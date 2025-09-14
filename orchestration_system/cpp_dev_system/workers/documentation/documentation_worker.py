#!/usr/bin/env python3
"""
Documentation Worker - специальный worker для документирования всех изменений в проекте.
Автоматически создает и обновляет документацию в папке docs.
"""

import os
import sys
import json
import time
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, Optional

# Import enhanced worker base
from enhanced_worker import EnhancedQwenWorker

class DocumentationWorker(EnhancedQwenWorker):
    """Specialized worker for project documentation"""
    
    def __init__(self, worker_id: str = None, project_root: str = None):
        """Initialize documentation worker"""
        worker_name = "Docs-Worker"
        super().__init__(worker_id, worker_name, project_root)
        
        self.docs_dir = self.project_root / "docs"
        self.changes_log = self.docs_dir / "OPTIMIZATION_CHANGES.md"
        self.reports_dir = self.docs_dir / "reports"
        
        # Ensure directories exist
        self.docs_dir.mkdir(exist_ok=True)
        self.reports_dir.mkdir(exist_ok=True)
        
        print(f"📚 Documentation Worker initialized")
        print(f"📝 Will document changes to: {self.docs_dir}")
        
        # Initialize changes log
        self.init_changes_log()
    
    def init_changes_log(self):
        """Initialize or update the changes log file"""
        if not self.changes_log.exists():
            initial_content = f"""# Optimization Changes Log

**Project**: zerodolg-astro  
**Started**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}  
**Documentation Worker**: {self.worker_id}

---

## Summary of Changes

This document tracks all optimization changes made to the zerodolg-astro project.

## Change History

"""
            with open(self.changes_log, 'w', encoding='utf-8') as f:
                f.write(initial_content)
            print(f"✅ Created changes log: {self.changes_log.name}")
    
    def document_change(self, change_type: str, description: str, details: Dict[str, Any] = None):
        """Document a specific change to the project"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        entry = f"\n### [{timestamp}] {change_type}\n\n"
        entry += f"**Description**: {description}\n\n"
        
        if details:
            entry += "**Details**:\n"
            for key, value in details.items():
                entry += f"- **{key}**: {value}\n"
            entry += "\n"
        
        entry += "---\n"
        
        # Append to changes log
        with open(self.changes_log, 'a', encoding='utf-8') as f:
            f.write(entry)
        
        print(f"📝 Documented: {change_type}")
    
    def execute_task(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Execute documentation-specific tasks"""
        task_id = task.get("id", "unknown")
        task_type = task.get("type", "document")
        task_data = task.get("data", {})
        
        self.logger.info(f"Executing documentation task {task_id}: {task_type}")
        self.update_status("working", task_id)
        
        # Prepare result structure
        result = {
            "task_id": task_id,
            "worker_id": self.worker_id,
            "worker_name": self.worker_name,
            "status": "completed",
            "started_at": datetime.now().isoformat(),
            "completed_at": None,
            "execution_time": 0,
            "result": None,
            "error": None
        }
        
        start_time = time.time()
        
        try:
            if task_type == "document":
                # Document a specific change
                change_type = task_data.get('change_type', 'General Change')
                description = task_data.get('description', 'No description provided')
                details = task_data.get('details', {})
                
                self.document_change(change_type, description, details)
                
                result["result"] = {
                    "documented": True,
                    "change_type": change_type,
                    "log_file": str(self.changes_log)
                }
                
            elif task_type == "analyze":
                # Analyze project for documentation needs
                content = task_data.get('content', '')
                print(f"📊 Analyzing for documentation: {content[:100]}...")
                
                # Call qwen to analyze
                prompt = f"""As a documentation specialist for zerodolg-astro project:

{content}

Please provide:
1. What documentation needs to be created or updated
2. Key points that must be documented
3. Suggested documentation structure
4. Priority of documentation tasks
"""
                
                response = self.call_qwen(prompt)
                
                # Document the analysis
                self.document_change(
                    "Documentation Analysis",
                    "Analyzed project documentation needs",
                    {"analysis": response[:500] + "..." if len(response) > 500 else response}
                )
                
                result["result"] = {
                    "analysis": response,
                    "documented": True
                }
                
            elif task_type == "generate":
                # Generate documentation
                prompt = task_data.get('prompt', '')
                print(f"📝 Generating documentation...")
                
                doc_prompt = f"""As a documentation specialist for zerodolg-astro project:

{prompt}

Generate comprehensive, well-structured documentation in Markdown format.
Include code examples, best practices, and clear explanations.
"""
                
                response = self.call_qwen(doc_prompt)
                
                # Save generated documentation
                doc_name = f"generated_{task_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
                doc_path = self.reports_dir / doc_name
                
                with open(doc_path, 'w', encoding='utf-8') as f:
                    f.write(response)
                
                # Document the generation
                self.document_change(
                    "Documentation Generated",
                    f"Generated new documentation: {doc_name}",
                    {"file": str(doc_path), "size": f"{len(response)} characters"}
                )
                
                result["result"] = {
                    "generated_file": str(doc_path),
                    "content_preview": response[:200] + "..." if len(response) > 200 else response
                }
                
            elif task_type == "update":
                # Update existing documentation
                file_path = task_data.get('file', '')
                updates = task_data.get('updates', '')
                
                print(f"📝 Updating documentation: {file_path}")
                
                update_prompt = f"""Update the documentation file {file_path} with:

{updates}

Maintain the existing structure and style while adding the new information.
"""
                
                response = self.call_qwen(update_prompt)
                
                # Document the update
                self.document_change(
                    "Documentation Updated",
                    f"Updated documentation file: {file_path}",
                    {"updates": updates[:200] + "..." if len(updates) > 200 else updates}
                )
                
                result["result"] = {
                    "updated": True,
                    "file": file_path,
                    "response": response
                }
                
            else:
                # Default documentation task
                result["result"] = super().execute_task(task)["result"]
                
                # Document any general task
                self.document_change(
                    "Task Executed",
                    f"Executed task type: {task_type}",
                    {"task_id": task_id, "task_data": str(task_data)[:200]}
                )
                
        except Exception as e:
            self.logger.error(f"Error executing documentation task: {e}")
            result["status"] = "failed"
            result["error"] = str(e)
            
            # Document the error
            self.document_change(
                "Task Error",
                f"Error executing task {task_id}",
                {"error": str(e), "task_type": task_type}
            )
        
        execution_time = time.time() - start_time
        result["completed_at"] = datetime.now().isoformat()
        result["execution_time"] = round(execution_time, 2)
        
        return result
    
    def create_summary_report(self):
        """Create a summary report of all documented changes"""
        summary_file = self.docs_dir / f"optimization_summary_{datetime.now().strftime('%Y%m%d')}.md"
        
        summary_content = f"""# Optimization Summary Report

**Date**: {datetime.now().strftime('%Y-%m-%d')}  
**Project**: zerodolg-astro

## Overview

This report summarizes all optimization activities performed on the zerodolg-astro project.

## Key Achievements

- Documentation automatically maintained by Documentation Worker
- All changes tracked in real-time
- Comprehensive reports generated

## Files Modified

See OPTIMIZATION_CHANGES.md for detailed change history.

## Next Steps

1. Review all documented changes
2. Validate optimizations in production environment
3. Update deployment documentation
4. Create performance benchmarks

---

*Generated by Documentation Worker {self.worker_id}*
"""
        
        with open(summary_file, 'w', encoding='utf-8') as f:
            f.write(summary_content)
        
        print(f"📊 Created summary report: {summary_file.name}")
        
        return str(summary_file)

def main():
    """Main entry point for documentation worker"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Documentation Worker for zerodolg-astro")
    parser.add_argument("--project-root", default="../", help="Path to project root")
    parser.add_argument("--test", action="store_true", help="Run in test mode")
    
    args = parser.parse_args()
    
    # Create documentation worker
    worker = DocumentationWorker(project_root=args.project_root)
    
    if args.test:
        # Test mode
        test_task = {
            "id": "test-doc-001",
            "type": "document",
            "data": {
                "change_type": "Test Documentation",
                "description": "Testing documentation worker functionality",
                "details": {
                    "test": "successful",
                    "timestamp": datetime.now().isoformat()
                }
            }
        }
        print("🧪 Running documentation worker in test mode...")
        result = worker.execute_task(test_task)
        print(f"✅ Test result:\n{json.dumps(result, indent=2)}")
        
        # Create summary report
        summary = worker.create_summary_report()
        print(f"📊 Summary report created: {summary}")
    else:
        # Interactive mode
        print("📚 Documentation Worker running in interactive mode")
        print("Waiting for documentation tasks...")
        worker.run_interactive_mode()

if __name__ == "__main__":
    main()