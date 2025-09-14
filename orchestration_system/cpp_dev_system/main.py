"""
Main C++ Development System Integration
Coordinates all workers, Qdrant vector DB, and development workflow
"""

import os
import sys
import json
import asyncio
import logging
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, List, Optional
import argparse

# Add workers directory to path
sys.path.append(str(Path(__file__).parent))

# Import components
from .workers.cpp_workers import create_worker, WORKER_CLASSES
from .core.vector_db.setup_qdrant import QdrantManager, OllamaEmbedder
from .core.task_manager.task_orchestrator import TaskOrchestrator

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/cpp_development.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


class CPPDevelopmentSystem:
    """Main system for C++ project development"""
    
    def __init__(self, project_path: str = "."):
        self.project_path = Path(project_path).absolute()
        self.orchestrator = TaskOrchestrator()
        self.qdrant_manager = None
        self.ollama_embedder = None
        self.workers = {}
        self.config = self.load_config()
        
    def load_config(self) -> Dict[str, Any]:
        """Load system configuration"""
        config_file = self.project_path / "config" / "cpp_development.json"
        if config_file.exists():
            with open(config_file, 'r') as f:
                return json.load(f)
        
        # Default configuration
        return {
            "qdrant": {
                "host": "localhost",
                "port": 6333,
                "collection": "cpp_knowledge"
            },
            "ollama": {
                "model": "nomic-embed-text",
                "host": "http://localhost:11434"
            },
            "workers": {
                "architecture": 2,
                "code_generator": 3,
                "testing": 2,
                "code_review": 2,
                "build_system": 1,
                "documentation": 1,
                "performance": 1
            },
            "project": {
                "name": "CPP_Orchestration_System",
                "version": "1.0.0",
                "language": "C++20",
                "build_system": "CMake"
            }
        }
    
    async def initialize(self):
        """Initialize all system components"""
        logger.info("Initializing C++ Development System...")
        
        # Initialize Qdrant
        await self.setup_vector_database()
        
        # Initialize workers
        await self.setup_workers()
        
        # Load existing knowledge base
        await self.load_knowledge_base()
        
        logger.info("System initialization complete")
    
    async def setup_vector_database(self):
        """Setup Qdrant vector database"""
        logger.info("Setting up Qdrant vector database...")
        
        try:
            self.qdrant_manager = QdrantManager(
                host=self.config["qdrant"]["host"],
                port=self.config["qdrant"]["port"]
            )
            
            self.ollama_embedder = OllamaEmbedder(
                model=self.config["ollama"]["model"],
                ollama_host=self.config["ollama"]["host"]
            )
            
            # Create collection if not exists
            await self.qdrant_manager.create_collection(
                collection_name=self.config["qdrant"]["collection"],
                vector_size=768  # nomic-embed-text dimension
            )
            
            logger.info("Vector database setup complete")
            
        except Exception as e:
            logger.error(f"Failed to setup vector database: {e}")
            logger.warning("Running without vector database support")
    
    async def setup_workers(self):
        """Initialize all workers"""
        logger.info("Setting up workers...")
        
        for worker_type, count in self.config["workers"].items():
            for i in range(count):
                worker_id = f"{worker_type}_{i+1}"
                worker = create_worker(worker_type, worker_id)
                
                if worker:
                    # Inject Qdrant and Ollama dependencies
                    worker.qdrant_client = self.qdrant_manager
                    worker.ollama_embedder = self.ollama_embedder
                    
                    self.workers[worker_id] = worker
                    logger.info(f"Initialized worker: {worker_id}")
    
    async def load_knowledge_base(self):
        """Load existing documentation and code into knowledge base"""
        if not self.qdrant_manager:
            return
            
        logger.info("Loading knowledge base...")
        
        # Index existing documentation
        docs_path = self.project_path / "docs"
        if docs_path.exists():
            await self.index_documentation(docs_path)
        
        # Index existing code
        src_path = self.project_path / "src"
        if src_path.exists():
            await self.index_source_code(src_path)
        
        logger.info("Knowledge base loaded")
    
    async def index_documentation(self, docs_path: Path):
        """Index documentation files"""
        for doc_file in docs_path.rglob("*.md"):
            try:
                with open(doc_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Generate embedding
                embedding = await self.ollama_embedder.embed(content)
                
                # Store in Qdrant
                await self.qdrant_manager.add_document(
                    collection_name=self.config["qdrant"]["collection"],
                    document={
                        "id": str(doc_file),
                        "content": content,
                        "type": "documentation",
                        "path": str(doc_file),
                        "timestamp": datetime.now().isoformat()
                    },
                    vector=embedding
                )
                
                logger.debug(f"Indexed documentation: {doc_file}")
                
            except Exception as e:
                logger.error(f"Failed to index {doc_file}: {e}")
    
    async def index_source_code(self, src_path: Path):
        """Index source code files"""
        extensions = ['*.cpp', '*.hpp', '*.h', '*.cc', '*.cxx']
        
        for ext in extensions:
            for code_file in src_path.rglob(ext):
                try:
                    with open(code_file, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # Generate embedding
                    embedding = await self.ollama_embedder.embed(content)
                    
                    # Store in Qdrant
                    await self.qdrant_manager.add_document(
                        collection_name=self.config["qdrant"]["collection"],
                        document={
                            "id": str(code_file),
                            "content": content,
                            "type": "source_code",
                            "path": str(code_file),
                            "language": "cpp",
                            "timestamp": datetime.now().isoformat()
                        },
                        vector=embedding
                    )
                    
                    logger.debug(f"Indexed source code: {code_file}")
                    
                except Exception as e:
                    logger.error(f"Failed to index {code_file}: {e}")
    
    async def create_development_tasks(self) -> List[Dict[str, Any]]:
        """Create initial development tasks"""
        tasks = [
            # Architecture tasks
            {
                "type": "design_component",
                "worker_type": "architecture",
                "component_name": "TaskScheduler",
                "requirements": "Actor-based task scheduler with priority queue and worker pool management",
                "priority": 1
            },
            {
                "type": "design_component",
                "worker_type": "architecture",
                "component_name": "MessageBroker",
                "requirements": "High-performance message passing system for actor communication",
                "priority": 1
            },
            {
                "type": "create_adr",
                "worker_type": "architecture",
                "decision": "Actor Model Implementation",
                "context": "Need for scalable, concurrent task processing system",
                "priority": 2
            },
            
            # Code generation tasks
            {
                "type": "generate_class",
                "worker_type": "code_generator",
                "class_name": "Actor",
                "requirements": "Base actor class with message handling, state management, and lifecycle",
                "design": "Follow actor model with mailbox, message processing, supervision",
                "priority": 2
            },
            {
                "type": "generate_class",
                "worker_type": "code_generator",
                "class_name": "TaskQueue",
                "requirements": "Thread-safe priority queue for task management",
                "design": "Lock-free implementation using atomic operations",
                "priority": 2
            },
            
            # Testing tasks
            {
                "type": "generate_unit_tests",
                "worker_type": "testing",
                "code_file": "src/Actor.cpp",
                "priority": 3
            },
            {
                "type": "generate_benchmarks",
                "worker_type": "testing",
                "code_file": "src/TaskQueue.cpp",
                "priority": 3
            },
            
            # Build system tasks
            {
                "type": "generate_cmake",
                "worker_type": "build_system",
                "project_name": self.config["project"]["name"],
                "dependencies": ["Qt6", "Boost", "spdlog", "nlohmann_json", "gtest"],
                "priority": 1
            },
            
            # Documentation tasks
            {
                "type": "generate_guide",
                "worker_type": "documentation",
                "title": "Getting Started Guide",
                "content": "Installation, setup, and first project guide",
                "priority": 4
            }
        ]
        
        return tasks
    
    async def run_development_cycle(self):
        """Run a complete development cycle"""
        logger.info("Starting development cycle...")
        
        # Create initial tasks
        tasks = await self.create_development_tasks()
        
        # Submit tasks to orchestrator
        for task in tasks:
            task_id = self.orchestrator.submit_task(task)
            logger.info(f"Submitted task {task_id}: {task.get('type')}")
        
        # Process tasks with workers
        while self.orchestrator.has_pending_tasks():
            # Get next task
            task_data = self.orchestrator.get_next_task()
            if not task_data:
                await asyncio.sleep(1)
                continue
            
            task_id, task = task_data
            worker_type = task.get('worker_type')
            
            # Find available worker
            available_worker = None
            for worker_id, worker in self.workers.items():
                if worker.worker_type == worker_type:
                    available_worker = worker
                    break
            
            if available_worker:
                try:
                    # Execute task
                    logger.info(f"Worker {available_worker.worker_id} executing task {task_id}")
                    result = await available_worker.execute_task(task)
                    
                    # Complete task
                    self.orchestrator.complete_task(task_id, result)
                    logger.info(f"Task {task_id} completed successfully")
                    
                    # Index results in knowledge base
                    if self.qdrant_manager and result.get('code'):
                        await self.index_task_result(result)
                    
                except Exception as e:
                    logger.error(f"Task {task_id} failed: {e}")
                    self.orchestrator.fail_task(task_id, str(e))
            else:
                logger.warning(f"No worker available for task type: {worker_type}")
                # Return task to queue
                self.orchestrator.return_task_to_queue(task_id, task)
            
            await asyncio.sleep(0.1)
        
        logger.info("Development cycle complete")
    
    async def index_task_result(self, result: Dict[str, Any]):
        """Index task results in knowledge base"""
        try:
            content = json.dumps(result, indent=2)
            embedding = await self.ollama_embedder.embed(content)
            
            await self.qdrant_manager.add_document(
                collection_name=self.config["qdrant"]["collection"],
                document={
                    "id": f"result_{datetime.now().timestamp()}",
                    "content": content,
                    "type": "task_result",
                    "timestamp": datetime.now().isoformat()
                },
                vector=embedding
            )
        except Exception as e:
            logger.error(f"Failed to index task result: {e}")
    
    def generate_report(self):
        """Generate development report"""
        report = {
            "timestamp": datetime.now().isoformat(),
            "project": self.config["project"],
            "statistics": {
                "total_tasks": self.orchestrator.get_statistics()["total_tasks"],
                "completed_tasks": self.orchestrator.get_statistics()["completed_tasks"],
                "failed_tasks": self.orchestrator.get_statistics()["failed_tasks"],
                "workers": len(self.workers)
            },
            "files_created": list(Path("src").glob("*")) + list(Path("tests").glob("*")),
            "documentation": list(Path("docs").glob("*.md"))
        }
        
        report_file = f"reports/development_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        os.makedirs("reports", exist_ok=True)
        
        with open(report_file, 'w') as f:
            json.dump(report, f, indent=2, default=str)
        
        logger.info(f"Report generated: {report_file}")
        return report_file


async def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description="C++ Development System")
    parser.add_argument("--project", default=".", help="Project path")
    parser.add_argument("--cycles", type=int, default=1, help="Number of development cycles")
    parser.add_argument("--init-only", action="store_true", help="Only initialize system")
    
    args = parser.parse_args()
    
    # Create system
    system = CPPDevelopmentSystem(args.project)
    
    # Initialize
    await system.initialize()
    
    if args.init_only:
        logger.info("System initialized. Exiting.")
        return
    
    # Run development cycles
    for i in range(args.cycles):
        logger.info(f"Starting development cycle {i+1}/{args.cycles}")
        await system.run_development_cycle()
    
    # Generate report
    system.generate_report()
    
    logger.info("C++ Development System completed")


if __name__ == "__main__":
    asyncio.run(main())