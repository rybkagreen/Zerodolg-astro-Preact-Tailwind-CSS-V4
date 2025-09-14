"""
Setup and manage Qdrant vector database with Ollama embeddings
for C++ project knowledge base
"""

import os
import json
import hashlib
import asyncio
from typing import List, Dict, Any, Optional
from pathlib import Path
from datetime import datetime
import subprocess
import logging

from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance, 
    VectorParams, 
    PointStruct,
    Filter,
    FieldCondition,
    MatchValue,
    SearchRequest,
    CollectionStatus
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class OllamaEmbedder:
    """Ollama embedding generator using nomic-embed-text model"""
    
    def __init__(self, model: str = "nomic-embed-text"):
        self.model = model
        self.dimension = 768  # nomic-embed-text dimension
        
    async def embed(self, text: str) -> List[float]:
        """Generate embedding for text using Ollama"""
        try:
            # Use Ollama API or CLI
            result = subprocess.run(
                ['ollama', 'embed', self.model, text],
                capture_output=True,
                text=True,
                timeout=30
            )
            
            if result.returncode == 0:
                # Parse embedding from output
                embedding = json.loads(result.stdout)
                return embedding
            else:
                logger.error(f"Ollama embed failed: {result.stderr}")
                return [0.0] * self.dimension
                
        except subprocess.TimeoutExpired:
            logger.error("Ollama embed timeout")
            return [0.0] * self.dimension
        except Exception as e:
            logger.error(f"Ollama embed error: {e}")
            return [0.0] * self.dimension
    
    async def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for multiple texts"""
        embeddings = []
        for text in texts:
            embedding = await self.embed(text)
            embeddings.append(embedding)
        return embeddings


class QdrantKnowledgeBase:
    """Qdrant-based knowledge base for C++ project development"""
    
    def __init__(self, 
                 qdrant_url: str = "localhost",
                 qdrant_port: int = 6333,
                 collection_name: str = "cpp_knowledge"):
        self.client = QdrantClient(host=qdrant_url, port=qdrant_port)
        self.collection_name = collection_name
        self.embedder = OllamaEmbedder()
        self.dimension = 768  # nomic-embed-text dimension
        
    async def initialize(self):
        """Initialize Qdrant collection"""
        try:
            # Check if collection exists
            collections = self.client.get_collections()
            collection_names = [col.name for col in collections.collections]
            
            if self.collection_name not in collection_names:
                # Create collection
                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(
                        size=self.dimension,
                        distance=Distance.COSINE
                    )
                )
                logger.info(f"Created collection: {self.collection_name}")
            else:
                logger.info(f"Collection already exists: {self.collection_name}")
                
        except Exception as e:
            logger.error(f"Failed to initialize Qdrant: {e}")
            raise
    
    async def index_document(self, 
                            doc_id: str,
                            content: str,
                            metadata: Dict[str, Any]) -> bool:
        """Index a single document"""
        try:
            # Generate embedding
            embedding = await self.embedder.embed(content)
            
            # Create point
            point = PointStruct(
                id=doc_id,
                vector=embedding,
                payload={
                    "content": content[:1000],  # Store first 1000 chars
                    "full_content_hash": hashlib.md5(content.encode()).hexdigest(),
                    "timestamp": datetime.now().isoformat(),
                    **metadata
                }
            )
            
            # Upsert to Qdrant
            self.client.upsert(
                collection_name=self.collection_name,
                points=[point]
            )
            
            logger.info(f"Indexed document: {doc_id}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to index document {doc_id}: {e}")
            return False
    
    async def index_code_file(self, file_path: str) -> bool:
        """Index a C++ code file"""
        try:
            path = Path(file_path)
            if not path.exists():
                logger.error(f"File not found: {file_path}")
                return False
            
            # Read file content
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extract metadata
            metadata = {
                "type": "code",
                "file_path": str(path),
                "file_name": path.name,
                "extension": path.suffix,
                "size": len(content),
                "language": "cpp"
            }
            
            # Parse code for classes and functions
            components = self.extract_code_components(content)
            
            # Index whole file
            doc_id = f"code_{hashlib.md5(str(path).encode()).hexdigest()}"
            await self.index_document(doc_id, content, metadata)
            
            # Index individual components
            for comp in components:
                comp_id = f"component_{hashlib.md5(comp['signature'].encode()).hexdigest()}"
                await self.index_document(
                    comp_id,
                    comp['content'],
                    {
                        **metadata,
                        "component_type": comp['type'],
                        "component_name": comp['name'],
                        "signature": comp['signature']
                    }
                )
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to index code file {file_path}: {e}")
            return False
    
    def extract_code_components(self, code: str) -> List[Dict[str, str]]:
        """Extract classes, functions, etc. from C++ code"""
        components = []
        
        # Simple extraction - in production would use proper C++ parser
        lines = code.split('\n')
        current_component = []
        in_component = False
        component_type = None
        component_name = None
        
        for line in lines:
            # Detect class
            if 'class ' in line and '{' in line:
                if current_component and component_name:
                    components.append({
                        'type': component_type,
                        'name': component_name,
                        'content': '\n'.join(current_component),
                        'signature': current_component[0] if current_component else ''
                    })
                current_component = [line]
                in_component = True
                component_type = 'class'
                # Extract class name
                parts = line.split('class ')
                if len(parts) > 1:
                    component_name = parts[1].split()[0].strip(':{ ')
                    
            # Detect function
            elif any(ret_type in line for ret_type in ['void ', 'int ', 'bool ', 'auto ']) and '(' in line and ')' in line:
                if not in_component:
                    if current_component and component_name:
                        components.append({
                            'type': component_type,
                            'name': component_name,
                            'content': '\n'.join(current_component),
                            'signature': current_component[0] if current_component else ''
                        })
                    current_component = [line]
                    component_type = 'function'
                    # Extract function name
                    for ret_type in ['void', 'int', 'bool', 'auto']:
                        if ret_type in line:
                            parts = line.split(ret_type)
                            if len(parts) > 1:
                                func_part = parts[1].split('(')[0].strip()
                                component_name = func_part.split()[-1] if func_part else 'unknown'
                                break
            elif in_component:
                current_component.append(line)
                if line.strip() == '}' or line.strip() == '};':
                    in_component = False
                    
        # Add last component
        if current_component and component_name:
            components.append({
                'type': component_type,
                'name': component_name,
                'content': '\n'.join(current_component),
                'signature': current_component[0] if current_component else ''
            })
        
        return components
    
    async def index_documentation(self, doc_path: str) -> bool:
        """Index documentation file"""
        try:
            path = Path(doc_path)
            if not path.exists():
                logger.error(f"Documentation not found: {doc_path}")
                return False
            
            # Read content
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extract metadata
            metadata = {
                "type": "documentation",
                "file_path": str(path),
                "file_name": path.name,
                "format": path.suffix
            }
            
            # Split into sections for better retrieval
            sections = self.split_documentation(content)
            
            for i, section in enumerate(sections):
                doc_id = f"doc_{hashlib.md5(f'{path}_{i}'.encode()).hexdigest()}"
                await self.index_document(
                    doc_id,
                    section['content'],
                    {
                        **metadata,
                        "section_title": section.get('title', ''),
                        "section_index": i
                    }
                )
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to index documentation {doc_path}: {e}")
            return False
    
    def split_documentation(self, content: str) -> List[Dict[str, str]]:
        """Split documentation into sections"""
        sections = []
        current_section = []
        current_title = ""
        
        for line in content.split('\n'):
            # Detect markdown headers
            if line.startswith('#'):
                if current_section:
                    sections.append({
                        'title': current_title,
                        'content': '\n'.join(current_section)
                    })
                current_section = [line]
                current_title = line.strip('#').strip()
            else:
                current_section.append(line)
        
        # Add last section
        if current_section:
            sections.append({
                'title': current_title,
                'content': '\n'.join(current_section)
            })
        
        return sections if sections else [{'title': '', 'content': content}]
    
    async def search(self, 
                    query: str,
                    limit: int = 5,
                    filter_type: Optional[str] = None) -> List[Dict[str, Any]]:
        """Search knowledge base"""
        try:
            # Generate query embedding
            query_embedding = await self.embedder.embed(query)
            
            # Build filter if specified
            query_filter = None
            if filter_type:
                query_filter = Filter(
                    must=[
                        FieldCondition(
                            key="type",
                            match=MatchValue(value=filter_type)
                        )
                    ]
                )
            
            # Search
            results = self.client.search(
                collection_name=self.collection_name,
                query_vector=query_embedding,
                query_filter=query_filter,
                limit=limit
            )
            
            # Format results
            formatted_results = []
            for result in results:
                formatted_results.append({
                    'score': result.score,
                    'content': result.payload.get('content', ''),
                    'metadata': {
                        k: v for k, v in result.payload.items() 
                        if k != 'content'
                    }
                })
            
            return formatted_results
            
        except Exception as e:
            logger.error(f"Search failed: {e}")
            return []
    
    async def index_project(self, project_path: str):
        """Index entire C++ project"""
        logger.info(f"Indexing project: {project_path}")
        
        project_dir = Path(project_path)
        if not project_dir.exists():
            logger.error(f"Project path not found: {project_path}")
            return
        
        # Index C++ source files
        for ext in ['*.cpp', '*.hpp', '*.h', '*.cc', '*.cxx']:
            for file in project_dir.rglob(ext):
                await self.index_code_file(str(file))
        
        # Index documentation
        for ext in ['*.md', '*.rst', '*.txt']:
            for file in project_dir.rglob(ext):
                await self.index_documentation(str(file))
        
        # Index CMake files
        for file in project_dir.rglob('CMakeLists.txt'):
            await self.index_document(
                f"cmake_{hashlib.md5(str(file).encode()).hexdigest()}",
                file.read_text(),
                {
                    "type": "build",
                    "file_path": str(file),
                    "build_system": "cmake"
                }
            )
        
        logger.info("Project indexing complete")


class KnowledgeBaseManager:
    """Manager for knowledge base operations"""
    
    def __init__(self):
        self.kb = QdrantKnowledgeBase()
        
    async def setup(self):
        """Setup knowledge base"""
        await self.kb.initialize()
        
        # Index documentation rules
        doc_rules_path = "DOCUMENTATION_RULES.md"
        if Path(doc_rules_path).exists():
            await self.kb.index_documentation(doc_rules_path)
        
        # Index future project specification
        future_project_path = "FUTURE_CPP_PROJECT.md"
        if Path(future_project_path).exists():
            await self.kb.index_documentation(future_project_path)
        
        # Index C++ best practices
        await self.index_cpp_best_practices()
        
        logger.info("Knowledge base setup complete")
    
    async def index_cpp_best_practices(self):
        """Index C++ best practices and patterns"""
        best_practices = [
            {
                "title": "RAII Pattern",
                "content": """Resource Acquisition Is Initialization (RAII) is a C++ programming technique 
                that binds the life cycle of a resource to the lifetime of an object. 
                Resources are acquired in the constructor and released in the destructor.""",
                "tags": ["memory", "pattern", "raii"]
            },
            {
                "title": "Rule of Five",
                "content": """The Rule of Five states that if a class defines any of the following, 
                it should define all five: destructor, copy constructor, copy assignment operator, 
                move constructor, move assignment operator.""",
                "tags": ["class", "design", "rule-of-five"]
            },
            {
                "title": "Smart Pointers",
                "content": """Use std::unique_ptr for single ownership, std::shared_ptr for shared ownership, 
                and std::weak_ptr to break circular references. Avoid raw pointers for ownership.""",
                "tags": ["memory", "smart-pointers", "modern-cpp"]
            },
            {
                "title": "Const Correctness",
                "content": """Use const wherever possible. Mark member functions const if they don't modify state. 
                Use const references for parameters that won't be modified.""",
                "tags": ["const", "design", "safety"]
            },
            {
                "title": "Move Semantics",
                "content": """Use std::move for transferring ownership of resources. Implement move constructors 
                and move assignment operators for performance. Mark them noexcept when possible.""",
                "tags": ["performance", "move", "modern-cpp"]
            }
        ]
        
        for practice in best_practices:
            doc_id = f"practice_{hashlib.md5(practice['title'].encode()).hexdigest()}"
            await self.kb.index_document(
                doc_id,
                practice['content'],
                {
                    "type": "best_practice",
                    "title": practice['title'],
                    "tags": practice['tags']
                }
            )


async def main():
    """Main setup function"""
    manager = KnowledgeBaseManager()
    await manager.setup()
    
    # Test search
    results = await manager.kb.search("RAII memory management", limit=3)
    print("\nSearch Results:")
    for result in results:
        print(f"Score: {result['score']:.3f}")
        print(f"Content: {result['content'][:200]}...")
        print(f"Metadata: {result['metadata']}")
        print("-" * 50)


if __name__ == "__main__":
    asyncio.run(main())