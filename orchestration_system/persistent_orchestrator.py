#!/usr/bin/env python3
"""
Persistent Orchestrator - сохраняет состояние между сессиями.
Автоматически восстанавливает незавершенные задачи при перезапуске.
"""

import os
import sys
import json
import time
import uuid
import logging
import pickle
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Any, Optional
from collections import deque

# Base orchestrator functionality is now integrated

class PersistentOrchestrator:
    """Orchestrator with persistent state management"""
    
    def __init__(self):
        """Initialize persistent orchestrator"""
        # Initialize base orchestrator components
        self.base_dir = Path(__file__).parent
        self.tasks_dir = self.base_dir / "tasks"
        self.results_dir = self.base_dir / "results"
        self.workers_dir = self.base_dir / "workers"
        self.logs_dir = self.base_dir / "logs"
        
        # Create directories if they don't exist
        for dir_path in [self.tasks_dir, self.results_dir, self.workers_dir, self.logs_dir]:
            dir_path.mkdir(exist_ok=True)
        
        self.logger = logging.getLogger("Orchestrator")
        self.task_queue = deque()
        self.completed_tasks = []
        self.pending_tasks = {}
        self.workers = {}
        self.task_counter = 0
        
        # State persistence files
        self.state_dir = self.base_dir / "state"
        self.state_dir.mkdir(exist_ok=True)
        
        self.state_file = self.state_dir / "orchestrator_state.json"
        self.queue_file = self.state_dir / "task_queue.json"
        self.pending_file = self.state_dir / "pending_tasks.json"
        self.completed_file = self.state_dir / "completed_tasks.json"
        
        # Load previous state if exists
        self.load_state()
        
        print("💾 Persistent Orchestrator initialized")
        if self.task_queue or self.pending_tasks:
            print(f"📥 Restored {len(self.task_queue)} queued tasks and {len(self.pending_tasks)} pending tasks")
    
    def save_state(self):
        """Save current orchestrator state to disk"""
        try:
            # Save main state
            state = {
                "task_counter": self.task_counter,
                "last_saved": datetime.now().isoformat(),
                "session_start": getattr(self, 'session_start', datetime.now()).isoformat()
            }
            with open(self.state_file, 'w') as f:
                json.dump(state, f, indent=2)
            
            # Save task queue
            queue_list = list(self.task_queue)
            with open(self.queue_file, 'w') as f:
                json.dump(queue_list, f, indent=2, default=str)
            
            # Save pending tasks
            with open(self.pending_file, 'w') as f:
                json.dump(self.pending_tasks, f, indent=2, default=str)
            
            # Save completed tasks (last 100 to avoid huge files)
            recent_completed = self.completed_tasks[-100:] if len(self.completed_tasks) > 100 else self.completed_tasks
            with open(self.completed_file, 'w') as f:
                json.dump(recent_completed, f, indent=2, default=str)
                
            self.logger.info(f"State saved: {len(self.task_queue)} queued, {len(self.pending_tasks)} pending")
            
        except Exception as e:
            self.logger.error(f"Error saving state: {e}")
    
    def load_state(self):
        """Load previous orchestrator state from disk"""
        try:
            # Load main state
            if self.state_file.exists():
                with open(self.state_file, 'r') as f:
                    state = json.load(f)
                self.task_counter = state.get("task_counter", 0)
                last_saved = state.get("last_saved", "")
                print(f"📅 Loading state from: {last_saved}")
            
            # Load task queue
            if self.queue_file.exists():
                with open(self.queue_file, 'r') as f:
                    queue_list = json.load(f)
                self.task_queue = deque(queue_list)
                print(f"📋 Loaded {len(self.task_queue)} queued tasks")
            
            # Load pending tasks
            if self.pending_file.exists():
                with open(self.pending_file, 'r') as f:
                    self.pending_tasks = json.load(f)
                print(f"⏳ Loaded {len(self.pending_tasks)} pending tasks")
            
            # Load completed tasks
            if self.completed_file.exists():
                with open(self.completed_file, 'r') as f:
                    self.completed_tasks = json.load(f)
                print(f"✅ Loaded {len(self.completed_tasks)} completed tasks history")
            
            # Check for orphaned tasks in the tasks directory
            self.recover_orphaned_tasks()
            
        except Exception as e:
            self.logger.error(f"Error loading state: {e}")
            print(f"⚠️ Could not load previous state: {e}")
    
    def recover_orphaned_tasks(self):
        """Recover tasks that were assigned but not completed"""
        orphaned_count = 0
        
        # Check tasks directory for unprocessed task files
        for task_file in self.tasks_dir.glob("task_*.json"):
            try:
                with open(task_file, 'r') as f:
                    task = json.load(f)
                
                task_id = task.get("id")
                worker_id = task.get("assigned_to")
                
                # Check if this task is already pending
                if task_id not in self.pending_tasks:
                    print(f"🔄 Recovering orphaned task {task_id} (was assigned to {worker_id})")
                    
                    # Reset task status and add back to queue
                    task["status"] = "recovered"
                    task["recovered_at"] = datetime.now().isoformat()
                    self.task_queue.append(task)
                    orphaned_count += 1
                    
                    # Remove the orphaned task file
                    task_file.unlink()
                    
            except Exception as e:
                self.logger.error(f"Error recovering task from {task_file}: {e}")
        
        if orphaned_count > 0:
            print(f"♻️ Recovered {orphaned_count} orphaned tasks")
    
    def check_stalled_tasks(self):
        """Check for tasks that have been pending too long"""
        stalled_tasks = []
        current_time = datetime.now()
        
        for task_id, task in list(self.pending_tasks.items()):
            if "assigned_at" in task:
                assigned_time = datetime.fromisoformat(task["assigned_at"])
                time_elapsed = (current_time - assigned_time).total_seconds()
                
                # If task has been pending for more than 5 minutes, consider it stalled
                if time_elapsed > 300:  # 5 minutes
                    worker_id = task.get("assigned_to", "unknown")
                    print(f"⚠️ Task {task_id} has been pending for {round(time_elapsed/60, 1)} minutes (worker: {worker_id})")
                    
                    # Check if worker is still active
                    worker_file = self.workers_dir / f"{worker_id}.json"
                    if not worker_file.exists():
                        print(f"❌ Worker {worker_id} is gone, recovering task {task_id}")
                        
                        # Remove from pending and add back to queue
                        self.pending_tasks.pop(task_id)
                        task["status"] = "recovered"
                        task["recovered_at"] = datetime.now().isoformat()
                        task["stalled_time"] = round(time_elapsed, 1)
                        self.task_queue.append(task)
                        stalled_tasks.append(task_id)
        
        if stalled_tasks:
            print(f"♻️ Recovered {len(stalled_tasks)} stalled tasks")
            self.save_state()
        
        return stalled_tasks
    
    def assign_task(self, task: Dict[str, Any], worker_id: str):
        """Assign task and save state"""
        super().assign_task(task, worker_id)
        self.save_state()
    
    def collect_results(self) -> List[Dict[str, Any]]:
        """Collect results and save state"""
        results = super().collect_results()
        if results:
            self.save_state()
        return results
    
    def show_status(self):
        """Enhanced status display with persistence info"""
        super().show_status()
        
        # Add persistence status
        if self.state_file.exists():
            state_mod_time = datetime.fromtimestamp(self.state_file.stat().st_mtime)
            time_since_save = (datetime.now() - state_mod_time).total_seconds()
            print(f"\n💾 State last saved: {round(time_since_save, 1)}s ago")
        
        # Show recovered tasks if any
        recovered_count = sum(1 for task in self.task_queue if isinstance(task, dict) and task.get("status") == "recovered")
        if recovered_count > 0:
            print(f"♻️ Recovered tasks in queue: {recovered_count}")
    
    def cleanup_old_results(self, days_to_keep: int = 7):
        """Clean up old result files to save space"""
        cutoff_date = datetime.now() - timedelta(days=days_to_keep)
        cleaned_count = 0
        
        archive_dir = self.results_dir / "archive"
        if archive_dir.exists():
            for result_file in archive_dir.glob("result_*.json"):
                try:
                    file_time = datetime.fromtimestamp(result_file.stat().st_mtime)
                    if file_time < cutoff_date:
                        result_file.unlink()
                        cleaned_count += 1
                except Exception as e:
                    self.logger.error(f"Error cleaning up {result_file}: {e}")
        
        if cleaned_count > 0:
            print(f"🧹 Cleaned up {cleaned_count} old result files")
    
    def run_orchestration_loop(self, duration_minutes: int = 5):
        """Enhanced orchestration loop with state persistence"""
        print(f"\n🎬 Starting persistent orchestration for {duration_minutes} minutes...")
        print("💾 State will be automatically saved")
        print("Press Ctrl+C to stop (state will be preserved)\n")
        
        self.session_start = datetime.now()
        start_time = time.time()
        end_time = start_time + (duration_minutes * 60)
        iteration = 0
        
        # Initialize tasks if queue is empty
        if not self.task_queue and not self.pending_tasks:
            self.initialize_tasks()
        else:
            print(f"📋 Continuing with {len(self.task_queue)} queued and {len(self.pending_tasks)} pending tasks")
        
        try:
            while time.time() < end_time:
                iteration += 1
                print(f"\n--- Iteration {iteration} ---")
                
                # Check for stalled tasks every 5 iterations
                if iteration % 5 == 0:
                    self.check_stalled_tasks()
                
                # Scan for workers
                self.workers = self.scan_workers()
                
                if not self.workers:
                    print("⚠️ No active workers found. Waiting...")
                    time.sleep(5)
                    continue
                
                # Distribute pending tasks
                self.distribute_tasks()
                
                # Wait for task processing
                time.sleep(3)
                
                # Collect results
                results = self.collect_results()
                
                # Generate new tasks based on results
                if results:
                    new_tasks = self.generate_new_tasks(results)
                    for task in new_tasks:
                        self.task_queue.append(task)
                
                # Show status periodically
                if iteration % 3 == 0:
                    self.show_status()
                
                # Save state every 10 iterations
                if iteration % 10 == 0:
                    self.save_state()
                    print("💾 State checkpoint saved")
                
                # Cleanup old results every 50 iterations
                if iteration % 50 == 0:
                    self.cleanup_old_results()
                
                # Small delay between iterations
                time.sleep(2)
                
        except KeyboardInterrupt:
            print("\n\n⏹️ Orchestration paused by user")
        finally:
            # Always save state on exit
            self.save_state()
            print("💾 Final state saved")
        
        # Show final status
        self.show_final_report(start_time)
    
    def show_final_report(self, start_time):
        """Show enhanced final report"""
        runtime = time.time() - start_time
        
        print("\n" + "=" * 50)
        print("📈 SESSION REPORT")
        print("=" * 50)
        print(f"Session Runtime: {round(runtime, 1)} seconds")
        print(f"Tasks Completed in Session: {len([t for t in self.completed_tasks if 'completed_at' in t and datetime.fromisoformat(t['completed_at']) > self.session_start])}")
        print(f"Total Tasks Completed: {len(self.completed_tasks)}")
        print(f"Tasks Still Queued: {len(self.task_queue)}")
        print(f"Tasks In Progress: {len(self.pending_tasks)}")
        
        if self.completed_tasks:
            avg_time = sum(t.get('execution_time', 0) for t in self.completed_tasks) / len(self.completed_tasks)
            print(f"Average Task Time: {round(avg_time, 2)} seconds")
        
        print("=" * 50)
        print("💾 State has been saved and will be restored on next run")
        
        # Save report
        report = {
            "session_start": self.session_start.isoformat(),
            "session_end": datetime.now().isoformat(),
            "runtime_seconds": round(runtime, 1),
            "tasks_completed_session": len([t for t in self.completed_tasks if 'completed_at' in t and datetime.fromisoformat(t['completed_at']) > self.session_start]),
            "tasks_completed_total": len(self.completed_tasks),
            "tasks_queued": len(self.task_queue),
            "tasks_pending": len(self.pending_tasks)
        }
        
        report_file = self.logs_dir / f"session_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(report_file, 'w') as f:
            json.dump(report, f, indent=2)
        
        print(f"\n📁 Session report saved to: {report_file}")

def main():
    """Main entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Persistent Task Orchestrator")
    parser.add_argument("--duration", type=int, default=5,
                       help="Duration to run orchestration in minutes (default: 5)")
    parser.add_argument("--reset", action="store_true",
                       help="Reset all saved state and start fresh")
    parser.add_argument("--status", action="store_true",
                       help="Show current state status and exit")
    
    args = parser.parse_args()
    
    orchestrator = PersistentOrchestrator()
    
    if args.reset:
        print("🔄 Resetting saved state...")
        for file in [orchestrator.state_file, orchestrator.queue_file, 
                    orchestrator.pending_file, orchestrator.completed_file]:
            if file.exists():
                file.unlink()
                print(f"  ❌ Deleted: {file.name}")
        print("✅ State reset complete")
        return
    
    if args.status:
        orchestrator.show_status()
        print(f"\n📊 State Summary:")
        print(f"  • Queued Tasks: {len(orchestrator.task_queue)}")
        print(f"  • Pending Tasks: {len(orchestrator.pending_tasks)}")
        print(f"  • Completed Tasks: {len(orchestrator.completed_tasks)}")
        return
    
    orchestrator.run_orchestration_loop(duration_minutes=args.duration)

if __name__ == "__main__":
    main()