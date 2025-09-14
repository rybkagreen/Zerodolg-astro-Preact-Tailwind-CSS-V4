"""
Task Orchestrator for managing task queues and worker assignments
"""

import json
import uuid
import time
import logging
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, List, Optional, Tuple
from collections import deque
import threading


class TaskOrchestrator:
    """Manages task queues and worker assignments"""
    
    def __init__(self, base_dir: str = "."):
        self.base_dir = Path(base_dir)
        self.tasks_dir = self.base_dir / "tasks"
        self.results_dir = self.base_dir / "results"
        self.workers_dir = self.base_dir / "workers"
        self.state_dir = self.base_dir / "state"
        
        # Create directories
        for dir_path in [self.tasks_dir, self.results_dir, self.workers_dir, self.state_dir]:
            dir_path.mkdir(exist_ok=True)
        
        # Task management
        self.task_queue = deque()
        self.pending_tasks = {}
        self.completed_tasks = []
        self.failed_tasks = []
        self.task_counter = 0
        
        # Worker management
        self.workers = {}
        
        # Threading
        self.lock = threading.Lock()
        
        # Logging
        self.logger = logging.getLogger(__name__)
        
        # Load saved state
        self.load_state()
    
    def submit_task(self, task: Dict[str, Any]) -> str:
        """Submit a new task to the queue"""
        with self.lock:
            self.task_counter += 1
            task_id = f"task-{self.task_counter:04d}-{uuid.uuid4().hex[:6]}"
            
            task_data = {
                "id": task_id,
                "submitted_at": datetime.now().isoformat(),
                "status": "queued",
                **task
            }
            
            self.task_queue.append(task_data)
            self.save_state()
            
            self.logger.info(f"Task {task_id} submitted: {task.get('type', 'unknown')}")
            return task_id
    
    def get_next_task(self, worker_id: Optional[str] = None) -> Optional[Tuple[str, Dict[str, Any]]]:
        """Get the next task from queue"""
        with self.lock:
            if not self.task_queue:
                return None
            
            # Get task based on priority if available
            task = None
            if any('priority' in t for t in self.task_queue):
                # Sort by priority and get highest
                sorted_queue = sorted(self.task_queue, key=lambda x: x.get('priority', 999))
                task = sorted_queue[0]
                self.task_queue.remove(task)
            else:
                # Get first task
                task = self.task_queue.popleft()
            
            task_id = task["id"]
            task["status"] = "pending"
            task["assigned_at"] = datetime.now().isoformat()
            
            if worker_id:
                task["assigned_to"] = worker_id
            
            self.pending_tasks[task_id] = task
            self.save_state()
            
            self.logger.info(f"Task {task_id} assigned to {worker_id or 'unspecified'}")
            return task_id, task
    
    def complete_task(self, task_id: str, result: Dict[str, Any]) -> bool:
        """Mark task as completed with result"""
        with self.lock:
            if task_id not in self.pending_tasks:
                self.logger.warning(f"Task {task_id} not found in pending tasks")
                return False
            
            task = self.pending_tasks.pop(task_id)
            task["status"] = "completed"
            task["completed_at"] = datetime.now().isoformat()
            task["result"] = result
            
            self.completed_tasks.append(task)
            
            # Save result to file
            result_file = self.results_dir / f"result_{task_id}.json"
            with open(result_file, 'w') as f:
                json.dump({
                    "task": task,
                    "result": result,
                    "timestamp": datetime.now().isoformat()
                }, f, indent=2)
            
            self.save_state()
            self.logger.info(f"Task {task_id} completed")
            return True
    
    def fail_task(self, task_id: str, error: str) -> bool:
        """Mark task as failed"""
        with self.lock:
            if task_id not in self.pending_tasks:
                return False
            
            task = self.pending_tasks.pop(task_id)
            task["status"] = "failed"
            task["failed_at"] = datetime.now().isoformat()
            task["error"] = error
            
            self.failed_tasks.append(task)
            self.save_state()
            
            self.logger.error(f"Task {task_id} failed: {error}")
            return True
    
    def return_task_to_queue(self, task_id: str, task: Dict[str, Any]) -> bool:
        """Return a task back to the queue"""
        with self.lock:
            if task_id in self.pending_tasks:
                self.pending_tasks.pop(task_id)
            
            task["status"] = "requeued"
            task["requeued_at"] = datetime.now().isoformat()
            
            # Add back to front of queue for quick retry
            self.task_queue.appendleft(task)
            self.save_state()
            
            self.logger.info(f"Task {task_id} returned to queue")
            return True
    
    def has_pending_tasks(self) -> bool:
        """Check if there are pending tasks"""
        with self.lock:
            return len(self.task_queue) > 0 or len(self.pending_tasks) > 0
    
    def get_statistics(self) -> Dict[str, Any]:
        """Get orchestrator statistics"""
        with self.lock:
            return {
                "total_tasks": self.task_counter,
                "queued_tasks": len(self.task_queue),
                "pending_tasks": len(self.pending_tasks),
                "completed_tasks": len(self.completed_tasks),
                "failed_tasks": len(self.failed_tasks),
                "workers": len(self.workers)
            }
    
    def register_worker(self, worker_id: str, capabilities: Dict[str, Any]) -> bool:
        """Register a worker"""
        with self.lock:
            self.workers[worker_id] = {
                "id": worker_id,
                "capabilities": capabilities,
                "registered_at": datetime.now().isoformat(),
                "last_heartbeat": datetime.now().isoformat()
            }
            
            # Save worker info
            worker_file = self.workers_dir / f"{worker_id}.json"
            with open(worker_file, 'w') as f:
                json.dump(self.workers[worker_id], f, indent=2)
            
            self.logger.info(f"Worker {worker_id} registered")
            return True
    
    def unregister_worker(self, worker_id: str) -> bool:
        """Unregister a worker"""
        with self.lock:
            if worker_id in self.workers:
                del self.workers[worker_id]
                
                # Remove worker file
                worker_file = self.workers_dir / f"{worker_id}.json"
                if worker_file.exists():
                    worker_file.unlink()
                
                self.logger.info(f"Worker {worker_id} unregistered")
                return True
            return False
    
    def worker_heartbeat(self, worker_id: str) -> bool:
        """Update worker heartbeat"""
        with self.lock:
            if worker_id in self.workers:
                self.workers[worker_id]["last_heartbeat"] = datetime.now().isoformat()
                return True
            return False
    
    def save_state(self):
        """Save current state to disk"""
        try:
            # Save queue
            queue_file = self.state_dir / "task_queue.json"
            with open(queue_file, 'w') as f:
                json.dump(list(self.task_queue), f, indent=2, default=str)
            
            # Save pending tasks
            pending_file = self.state_dir / "pending_tasks.json"
            with open(pending_file, 'w') as f:
                json.dump(self.pending_tasks, f, indent=2, default=str)
            
            # Save completed tasks (last 100)
            completed_file = self.state_dir / "completed_tasks.json"
            recent_completed = self.completed_tasks[-100:] if len(self.completed_tasks) > 100 else self.completed_tasks
            with open(completed_file, 'w') as f:
                json.dump(recent_completed, f, indent=2, default=str)
            
            # Save failed tasks
            failed_file = self.state_dir / "failed_tasks.json"
            with open(failed_file, 'w') as f:
                json.dump(self.failed_tasks, f, indent=2, default=str)
            
            # Save orchestrator state
            state_file = self.state_dir / "orchestrator_state.json"
            with open(state_file, 'w') as f:
                json.dump({
                    "task_counter": self.task_counter,
                    "last_saved": datetime.now().isoformat(),
                    "statistics": self.get_statistics()
                }, f, indent=2)
                
        except Exception as e:
            self.logger.error(f"Error saving state: {e}")
    
    def load_state(self):
        """Load saved state from disk"""
        try:
            # Load orchestrator state
            state_file = self.state_dir / "orchestrator_state.json"
            if state_file.exists():
                with open(state_file, 'r') as f:
                    state = json.load(f)
                    self.task_counter = state.get("task_counter", 0)
            
            # Load queue
            queue_file = self.state_dir / "task_queue.json"
            if queue_file.exists():
                with open(queue_file, 'r') as f:
                    queue_list = json.load(f)
                    self.task_queue = deque(queue_list)
            
            # Load pending tasks
            pending_file = self.state_dir / "pending_tasks.json"
            if pending_file.exists():
                with open(pending_file, 'r') as f:
                    self.pending_tasks = json.load(f)
            
            # Load completed tasks
            completed_file = self.state_dir / "completed_tasks.json"
            if completed_file.exists():
                with open(completed_file, 'r') as f:
                    self.completed_tasks = json.load(f)
            
            # Load failed tasks
            failed_file = self.state_dir / "failed_tasks.json"
            if failed_file.exists():
                with open(failed_file, 'r') as f:
                    self.failed_tasks = json.load(f)
            
            # Load workers
            for worker_file in self.workers_dir.glob("*.json"):
                with open(worker_file, 'r') as f:
                    worker_data = json.load(f)
                    worker_id = worker_data["id"]
                    self.workers[worker_id] = worker_data
            
            self.logger.info(f"State loaded: {self.get_statistics()}")
            
        except Exception as e:
            self.logger.error(f"Error loading state: {e}")
    
    def cleanup_old_results(self, days: int = 7):
        """Clean up old result files"""
        cutoff_time = time.time() - (days * 24 * 60 * 60)
        cleaned = 0
        
        archive_dir = self.results_dir / "archive"
        archive_dir.mkdir(exist_ok=True)
        
        for result_file in self.results_dir.glob("result_*.json"):
            if result_file.stat().st_mtime < cutoff_time:
                # Move to archive
                archive_file = archive_dir / result_file.name
                result_file.rename(archive_file)
                cleaned += 1
        
        if cleaned > 0:
            self.logger.info(f"Archived {cleaned} old result files")
        
        return cleaned