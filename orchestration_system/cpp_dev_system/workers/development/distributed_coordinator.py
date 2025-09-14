"""
Distributed Development Coordinator for C++ Development System
Manages distributed development tasks across multiple workers
"""

import json
import asyncio
import logging
from pathlib import Path
from datetime import datetime
from typing import Dict, Any, List, Optional, Set
from dataclasses import dataclass, field
from enum import Enum

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class TaskPriority(Enum):
    """Task priority levels"""
    CRITICAL = 1
    HIGH = 2
    NORMAL = 3
    LOW = 4


@dataclass
class DevelopmentTask:
    """Represents a development task"""
    id: str
    type: str
    priority: TaskPriority
    dependencies: List[str] = field(default_factory=list)
    assigned_workers: Set[str] = field(default_factory=set)
    status: str = "pending"
    created_at: datetime = field(default_factory=datetime.now)
    completed_at: Optional[datetime] = None
    result: Optional[Dict[str, Any]] = None


class DistributedCoordinator:
    """Coordinates distributed C++ development tasks"""
    
    def __init__(self, worker_id: str):
        self.worker_id = worker_id
        self.qdrant_client = None
        self.ollama_embedder = None
        self.active_tasks: Dict[str, DevelopmentTask] = {}
        self.worker_pool: Dict[str, Dict[str, Any]] = {}
        self.task_queue: asyncio.Queue = asyncio.Queue()
        self.system_prompt = self._get_system_prompt()
        
    def _get_system_prompt(self) -> str:
        """Get system prompt for distributed coordination"""
        return """You are a distributed development coordinator for C++ projects.
        
Your responsibilities:
- Decompose complex tasks into parallel subtasks
- Manage dependencies between tasks
- Allocate resources efficiently
- Monitor progress and handle failures
- Ensure code consistency across distributed changes
- Coordinate testing and integration
- Manage version control and merging

Apply these principles:
- Maximize parallelization while respecting dependencies
- Balance load across available workers
- Minimize communication overhead
- Ensure atomic commits for related changes
- Maintain code quality standards
- Document all distributed changes"""
    
    async def process_task(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Process a coordination task"""
        task_type = task.get('type', 'coordinate')
        
        if task_type == 'decompose':
            return await self.decompose_task(task)
        elif task_type == 'distribute':
            return await self.distribute_work(task)
        elif task_type == 'synchronize':
            return await self.synchronize_workers(task)
        elif task_type == 'integrate':
            return await self.integrate_results(task)
        else:
            return await self.coordinate_general(task)
    
    async def decompose_task(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Decompose a complex task into subtasks"""
        main_task = task.get('main_task', {})
        
        # Analyze task complexity
        complexity = self._analyze_complexity(main_task)
        
        # Generate subtasks
        subtasks = []
        
        if complexity['requires_architecture']:
            subtasks.append({
                'id': f"{main_task.get('id', 'task')}_arch",
                'type': 'architecture_design',
                'priority': TaskPriority.HIGH.value,
                'description': 'Design system architecture',
                'estimated_time': '2h'
            })
        
        if complexity['requires_implementation']:
            # Split implementation into modules
            modules = main_task.get('modules', ['core', 'interface', 'utils'])
            for module in modules:
                subtasks.append({
                    'id': f"{main_task.get('id', 'task')}_impl_{module}",
                    'type': 'implementation',
                    'module': module,
                    'priority': TaskPriority.NORMAL.value,
                    'dependencies': [f"{main_task.get('id', 'task')}_arch"] if complexity['requires_architecture'] else [],
                    'description': f'Implement {module} module'
                })
        
        if complexity['requires_testing']:
            subtasks.append({
                'id': f"{main_task.get('id', 'task')}_test",
                'type': 'testing',
                'priority': TaskPriority.HIGH.value,
                'dependencies': [st['id'] for st in subtasks if st['type'] == 'implementation'],
                'description': 'Create and run tests'
            })
        
        if complexity['requires_documentation']:
            subtasks.append({
                'id': f"{main_task.get('id', 'task')}_doc",
                'type': 'documentation',
                'priority': TaskPriority.LOW.value,
                'dependencies': [st['id'] for st in subtasks if st['type'] == 'implementation'],
                'description': 'Document implementation'
            })
        
        return {
            'timestamp': datetime.now().isoformat(),
            'worker_id': self.worker_id,
            'main_task_id': main_task.get('id', 'unknown'),
            'subtasks': subtasks,
            'execution_plan': self._create_execution_plan(subtasks),
            'estimated_total_time': self._estimate_total_time(subtasks)
        }
    
    async def distribute_work(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Distribute work among available workers"""
        subtasks = task.get('subtasks', [])
        available_workers = await self._get_available_workers()
        
        distribution = []
        
        for subtask in subtasks:
            # Find best worker for task type
            worker = self._select_worker(subtask, available_workers)
            
            if worker:
                distribution.append({
                    'task_id': subtask['id'],
                    'worker_id': worker['id'],
                    'worker_type': worker['type'],
                    'estimated_completion': self._estimate_completion(subtask, worker)
                })
                
                # Mark worker as busy
                worker['busy'] = True
        
        return {
            'timestamp': datetime.now().isoformat(),
            'worker_id': self.worker_id,
            'distribution': distribution,
            'unassigned_tasks': [st for st in subtasks if not any(d['task_id'] == st['id'] for d in distribution)]
        }
    
    async def synchronize_workers(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Synchronize work across multiple workers"""
        sync_points = task.get('sync_points', [])
        
        sync_status = []
        
        for point in sync_points:
            workers = point.get('workers', [])
            
            # Check worker status
            statuses = await self._check_worker_status(workers)
            
            all_ready = all(s['ready'] for s in statuses)
            
            sync_status.append({
                'sync_point': point['id'],
                'workers': workers,
                'ready': all_ready,
                'statuses': statuses
            })
        
        return {
            'timestamp': datetime.now().isoformat(),
            'worker_id': self.worker_id,
            'sync_status': sync_status,
            'can_proceed': all(s['ready'] for s in sync_status)
        }
    
    async def integrate_results(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Integrate results from multiple workers"""
        results = task.get('results', [])
        
        # Validate results consistency
        validation = self._validate_results(results)
        
        if validation['valid']:
            # Merge results
            merged = self._merge_results(results)
            
            # Generate integration report
            report = {
                'timestamp': datetime.now().isoformat(),
                'worker_id': self.worker_id,
                'integrated_from': [r['worker_id'] for r in results],
                'merged_result': merged,
                'conflicts_resolved': validation.get('conflicts_resolved', []),
                'integration_successful': True
            }
        else:
            report = {
                'timestamp': datetime.now().isoformat(),
                'worker_id': self.worker_id,
                'integration_failed': True,
                'errors': validation['errors'],
                'conflicting_results': validation.get('conflicts', [])
            }
        
        # Store in knowledge base if available
        if self.qdrant_client and report.get('integration_successful'):
            await self._store_integration_knowledge(report)
        
        return report
    
    async def coordinate_general(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """General coordination tasks"""
        return {
            'timestamp': datetime.now().isoformat(),
            'worker_id': self.worker_id,
            'task_type': 'general_coordination',
            'status': 'completed'
        }
    
    def _analyze_complexity(self, task: Dict[str, Any]) -> Dict[str, bool]:
        """Analyze task complexity"""
        description = task.get('description', '').lower()
        
        return {
            'requires_architecture': any(k in description for k in ['design', 'architect', 'structure']),
            'requires_implementation': any(k in description for k in ['implement', 'code', 'develop']),
            'requires_testing': any(k in description for k in ['test', 'verify', 'validate']),
            'requires_documentation': any(k in description for k in ['document', 'explain', 'describe']),
            'is_complex': len(description.split()) > 20
        }
    
    def _create_execution_plan(self, subtasks: List[Dict]) -> List[List[str]]:
        """Create parallel execution plan respecting dependencies"""
        # Group tasks by dependency level
        levels = []
        processed = set()
        
        while len(processed) < len(subtasks):
            level = []
            for task in subtasks:
                if task['id'] not in processed:
                    deps = task.get('dependencies', [])
                    if all(d in processed for d in deps):
                        level.append(task['id'])
            
            if level:
                levels.append(level)
                processed.update(level)
            else:
                # Avoid infinite loop
                break
        
        return levels
    
    def _estimate_total_time(self, subtasks: List[Dict]) -> str:
        """Estimate total execution time"""
        # Simple estimation - would be more complex in practice
        total_hours = len(subtasks) * 2
        return f"{total_hours}h"
    
    async def _get_available_workers(self) -> List[Dict[str, Any]]:
        """Get list of available workers"""
        # In practice, this would query the orchestrator
        return [
            {'id': 'arch_1', 'type': 'architecture', 'busy': False},
            {'id': 'impl_1', 'type': 'implementation', 'busy': False},
            {'id': 'impl_2', 'type': 'implementation', 'busy': False},
            {'id': 'test_1', 'type': 'testing', 'busy': False},
            {'id': 'doc_1', 'type': 'documentation', 'busy': False}
        ]
    
    def _select_worker(self, task: Dict, workers: List[Dict]) -> Optional[Dict]:
        """Select best worker for a task"""
        task_type = task.get('type', '')
        
        for worker in workers:
            if not worker['busy']:
                # Match worker type to task type
                if task_type in worker['type'] or worker['type'] in task_type:
                    return worker
        
        # Return any available worker if no type match
        for worker in workers:
            if not worker['busy']:
                return worker
        
        return None
    
    def _estimate_completion(self, task: Dict, worker: Dict) -> str:
        """Estimate task completion time"""
        base_time = task.get('estimated_time', '1h')
        # Adjust based on worker efficiency
        return base_time
    
    async def _check_worker_status(self, workers: List[str]) -> List[Dict]:
        """Check status of multiple workers"""
        statuses = []
        for worker_id in workers:
            # In practice, query actual worker status
            statuses.append({
                'worker_id': worker_id,
                'ready': True,
                'progress': 100
            })
        return statuses
    
    def _validate_results(self, results: List[Dict]) -> Dict[str, Any]:
        """Validate consistency of results"""
        # Check for conflicts
        conflicts = []
        
        # Simple validation - check for conflicting file changes
        files_modified = {}
        for result in results:
            for file in result.get('files_modified', []):
                if file in files_modified:
                    conflicts.append({
                        'file': file,
                        'workers': [files_modified[file], result['worker_id']]
                    })
                files_modified[file] = result['worker_id']
        
        return {
            'valid': len(conflicts) == 0,
            'conflicts': conflicts,
            'errors': [f"Conflict in {c['file']}" for c in conflicts]
        }
    
    def _merge_results(self, results: List[Dict]) -> Dict[str, Any]:
        """Merge results from multiple workers"""
        merged = {
            'files_created': [],
            'files_modified': [],
            'tests_added': [],
            'documentation_updated': []
        }
        
        for result in results:
            merged['files_created'].extend(result.get('files_created', []))
            merged['files_modified'].extend(result.get('files_modified', []))
            merged['tests_added'].extend(result.get('tests_added', []))
            merged['documentation_updated'].extend(result.get('documentation_updated', []))
        
        # Remove duplicates
        for key in merged:
            merged[key] = list(set(merged[key]))
        
        return merged
    
    async def _store_integration_knowledge(self, report: Dict) -> None:
        """Store integration knowledge in vector database"""
        if self.qdrant_client and self.ollama_embedder:
            try:
                # Generate embedding for the report
                content = json.dumps(report, indent=2)
                embedding = await self.ollama_embedder.embed(content)
                
                # Store in Qdrant
                await self.qdrant_client.add_document(
                    collection_name='cpp_integrations',
                    document={
                        'id': f"integration_{datetime.now().timestamp()}",
                        'content': content,
                        'type': 'integration',
                        'timestamp': datetime.now().isoformat()
                    },
                    vector=embedding
                )
            except Exception as e:
                logger.error(f"Failed to store integration knowledge: {e}")


def create_distributed_coordinator(worker_id: str) -> DistributedCoordinator:
    """Factory function to create distributed coordinator"""
    return DistributedCoordinator(worker_id)