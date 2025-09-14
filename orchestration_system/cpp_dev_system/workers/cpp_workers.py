"""
Specialized workers for C++ project development
"""

import json
import os
import subprocess
import asyncio
from typing import Dict, Any, Optional, List
from datetime import datetime
import hashlib
from pathlib import Path

class CPPWorkerBase:
    """Base class for all C++ development workers"""
    
    def __init__(self, worker_id: str, worker_type: str):
        self.worker_id = worker_id
        self.worker_type = worker_type
        self.qdrant_client = None  # Will be initialized with Qdrant
        self.ollama_embedder = None  # Will be initialized with Ollama
        
    async def execute_task(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a task and return results"""
        raise NotImplementedError
        
    async def query_knowledge_base(self, query: str, limit: int = 5) -> List[Dict]:
        """Query Qdrant knowledge base for relevant context"""
        if not self.qdrant_client:
            return []
            
        # Generate embedding using Ollama
        embedding = await self.generate_embedding(query)
        
        # Search in Qdrant
        results = self.qdrant_client.search(
            collection_name="cpp_knowledge",
            query_vector=embedding,
            limit=limit
        )
        
        return results
        
    async def generate_embedding(self, text: str) -> List[float]:
        """Generate text embedding using Ollama"""
        if not self.ollama_embedder:
            return []
            
        response = await self.ollama_embedder.embed(text)
        return response['embedding']
        
    def execute_qwen(self, prompt: str, context: str = "") -> str:
        """Execute Qwen with prompt and context"""
        full_prompt = f"{self.system_prompt}\n\nContext:\n{context}\n\nTask:\n{prompt}"
        
        # Save prompt to file
        prompt_file = f"temp_prompt_{self.worker_id}.txt"
        with open(prompt_file, 'w', encoding='utf-8') as f:
            f.write(full_prompt)
        
        try:
            result = subprocess.run(
                ['qwen', 'chat', '--file', prompt_file],
                capture_output=True,
                text=True,
                timeout=120
            )
            return result.stdout.strip()
        except Exception as e:
            return f"Error executing Qwen: {str(e)}"
        finally:
            if os.path.exists(prompt_file):
                os.remove(prompt_file)


class ArchitectureWorker(CPPWorkerBase):
    """Worker specialized in C++ architecture design"""
    
    def __init__(self, worker_id: str):
        super().__init__(worker_id, "architecture")
        self.system_prompt = """You are an expert C++ software architect with deep knowledge of:
- Modern C++ (C++20/23) features and best practices
- Design patterns (GoF, POSA, Enterprise patterns)
- Actor model and reactive programming
- High-performance computing and optimization
- Distributed systems and microservices
- Memory management and RAII
- Template metaprogramming
- Concurrency and parallelism

Your task is to design robust, scalable, and maintainable C++ architectures.
Follow SOLID principles, use appropriate design patterns, and consider performance implications.
"""
    
    async def execute_task(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Design architecture components"""
        task_type = task.get('type', '')
        
        if task_type == 'design_component':
            return await self.design_component(task)
        elif task_type == 'review_architecture':
            return await self.review_architecture(task)
        elif task_type == 'create_adr':
            return await self.create_adr(task)
        else:
            return {'error': f'Unknown task type: {task_type}'}
    
    async def design_component(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Design a new component"""
        component_name = task.get('component_name', '')
        requirements = task.get('requirements', '')
        
        # Query knowledge base for similar components
        context = await self.query_knowledge_base(f"C++ component {component_name} {requirements}")
        context_str = "\n".join([doc.get('content', '') for doc in context])
        
        prompt = f"""Design a C++ component with the following requirements:
Component Name: {component_name}
Requirements: {requirements}

Provide:
1. Class diagram (PlantUML format)
2. Interface definition (C++ headers)
3. Key design decisions
4. Performance considerations
5. Testing strategy
"""
        
        design = self.execute_qwen(prompt, context_str)
        
        return {
            'component_name': component_name,
            'design': design,
            'timestamp': datetime.now().isoformat()
        }
    
    async def review_architecture(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Review existing architecture"""
        code_path = task.get('code_path', '')
        
        # Read code files
        code_content = self.read_code_files(code_path)
        
        prompt = f"""Review the following C++ architecture and provide:
1. Strengths and weaknesses
2. Potential improvements
3. Performance bottlenecks
4. Security concerns
5. Scalability issues
6. Recommended refactoring

Code:
{code_content}
"""
        
        review = self.execute_qwen(prompt)
        
        return {
            'code_path': code_path,
            'review': review,
            'timestamp': datetime.now().isoformat()
        }
    
    async def create_adr(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Create Architecture Decision Record"""
        decision = task.get('decision', '')
        context = task.get('context', '')
        
        prompt = f"""Create an Architecture Decision Record (ADR) for:
Decision: {decision}
Context: {context}

Follow the ADR template with Status, Context, Decision, Consequences, and Alternatives.
"""
        
        adr = self.execute_qwen(prompt)
        
        # Save ADR to file
        adr_number = self.get_next_adr_number()
        adr_file = f"docs/adr/ADR-{adr_number:04d}-{decision.replace(' ', '-').lower()}.md"
        
        os.makedirs(os.path.dirname(adr_file), exist_ok=True)
        with open(adr_file, 'w', encoding='utf-8') as f:
            f.write(adr)
        
        return {
            'adr_file': adr_file,
            'adr_content': adr,
            'timestamp': datetime.now().isoformat()
        }
    
    def read_code_files(self, path: str) -> str:
        """Read C++ code files from path"""
        code_content = []
        for file in Path(path).rglob('*.cpp'):
            with open(file, 'r', encoding='utf-8') as f:
                code_content.append(f"// File: {file}\n{f.read()}\n")
        for file in Path(path).rglob('*.hpp'):
            with open(file, 'r', encoding='utf-8') as f:
                code_content.append(f"// File: {file}\n{f.read()}\n")
        return "\n".join(code_content)
    
    def get_next_adr_number(self) -> int:
        """Get next ADR number"""
        adr_dir = Path("docs/adr")
        if not adr_dir.exists():
            return 1
        
        existing_adrs = list(adr_dir.glob("ADR-*.md"))
        if not existing_adrs:
            return 1
        
        numbers = []
        for adr in existing_adrs:
            try:
                num = int(adr.stem.split('-')[1])
                numbers.append(num)
            except:
                pass
        
        return max(numbers) + 1 if numbers else 1


class CodeGeneratorWorker(CPPWorkerBase):
    """Worker specialized in C++ code generation"""
    
    def __init__(self, worker_id: str):
        super().__init__(worker_id, "code_generator")
        self.system_prompt = """You are an expert C++ developer with mastery of:
- Modern C++ standards (C++17/20/23)
- STL and Boost libraries
- Template metaprogramming and SFINAE
- Move semantics and perfect forwarding
- Constexpr and compile-time programming
- Memory management and smart pointers
- Exception safety guarantees
- Performance optimization techniques

Generate production-quality C++ code that is:
- Efficient and optimized
- Exception-safe
- Thread-safe where needed
- Well-documented
- Following best practices
"""
    
    async def execute_task(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Generate C++ code"""
        task_type = task.get('type', '')
        
        if task_type == 'generate_class':
            return await self.generate_class(task)
        elif task_type == 'generate_function':
            return await self.generate_function(task)
        elif task_type == 'generate_tests':
            return await self.generate_tests(task)
        else:
            return {'error': f'Unknown task type: {task_type}'}
    
    async def generate_class(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Generate a C++ class"""
        class_name = task.get('class_name', '')
        requirements = task.get('requirements', '')
        design = task.get('design', '')
        
        # Query knowledge base for patterns
        context = await self.query_knowledge_base(f"C++ class {class_name} patterns")
        context_str = "\n".join([doc.get('content', '') for doc in context])
        
        prompt = f"""Generate a complete C++ class implementation:
Class Name: {class_name}
Requirements: {requirements}
Design: {design}

Include:
1. Header file (.hpp) with full documentation
2. Implementation file (.cpp)
3. Rule of Five implementations if needed
4. Exception safety guarantees
5. Thread safety considerations
"""
        
        code = self.execute_qwen(prompt, context_str)
        
        # Parse and save generated code
        header_code, impl_code = self.parse_generated_code(code)
        
        # Save files
        header_file = f"src/{class_name}.hpp"
        impl_file = f"src/{class_name}.cpp"
        
        os.makedirs("src", exist_ok=True)
        
        with open(header_file, 'w', encoding='utf-8') as f:
            f.write(header_code)
        
        with open(impl_file, 'w', encoding='utf-8') as f:
            f.write(impl_code)
        
        return {
            'class_name': class_name,
            'header_file': header_file,
            'impl_file': impl_file,
            'code': code,
            'timestamp': datetime.now().isoformat()
        }
    
    def parse_generated_code(self, code: str) -> tuple:
        """Parse generated code into header and implementation"""
        # Simple parsing - in production would be more sophisticated
        if "// Header file" in code and "// Implementation file" in code:
            parts = code.split("// Implementation file")
            header = parts[0].replace("// Header file", "").strip()
            impl = parts[1].strip() if len(parts) > 1 else ""
            return header, impl
        return code, ""


class TestingWorker(CPPWorkerBase):
    """Worker specialized in C++ testing"""
    
    def __init__(self, worker_id: str):
        super().__init__(worker_id, "testing")
        self.system_prompt = """You are a C++ testing expert with deep knowledge of:
- Google Test and Google Mock frameworks
- Unit testing best practices
- Integration testing strategies
- Performance testing and benchmarking
- Fuzzing and property-based testing
- Code coverage analysis
- Memory leak detection (Valgrind, AddressSanitizer)
- Thread safety testing (ThreadSanitizer)

Create comprehensive test suites that ensure code quality and reliability.
"""
    
    async def execute_task(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Execute testing tasks"""
        task_type = task.get('type', '')
        
        if task_type == 'generate_unit_tests':
            return await self.generate_unit_tests(task)
        elif task_type == 'generate_benchmarks':
            return await self.generate_benchmarks(task)
        elif task_type == 'analyze_coverage':
            return await self.analyze_coverage(task)
        else:
            return {'error': f'Unknown task type: {task_type}'}
    
    async def generate_unit_tests(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Generate unit tests for C++ code"""
        code_file = task.get('code_file', '')
        
        # Read the code to test
        with open(code_file, 'r', encoding='utf-8') as f:
            code = f.read()
        
        prompt = f"""Generate comprehensive Google Test unit tests for the following C++ code:

{code}

Include:
1. Test all public methods
2. Edge cases and error conditions
3. Mock objects where needed
4. Performance tests
5. Thread safety tests if applicable
"""
        
        tests = self.execute_qwen(prompt)
        
        # Save test file
        test_file = code_file.replace('.cpp', '_test.cpp').replace('.hpp', '_test.cpp')
        test_file = test_file.replace('src/', 'tests/')
        
        os.makedirs(os.path.dirname(test_file), exist_ok=True)
        with open(test_file, 'w', encoding='utf-8') as f:
            f.write(tests)
        
        return {
            'code_file': code_file,
            'test_file': test_file,
            'tests': tests,
            'timestamp': datetime.now().isoformat()
        }


class CodeReviewWorker(CPPWorkerBase):
    """Worker specialized in C++ code review"""
    
    def __init__(self, worker_id: str):
        super().__init__(worker_id, "code_review")
        self.system_prompt = """You are a senior C++ code reviewer with expertise in:
- C++ Core Guidelines
- Security best practices (CERT C++)
- Performance optimization
- Memory safety
- Concurrency issues
- Code smells and anti-patterns
- Refactoring techniques

Provide thorough, constructive code reviews that improve code quality.
"""
    
    async def execute_task(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Execute code review tasks"""
        code_file = task.get('code_file', '')
        
        with open(code_file, 'r', encoding='utf-8') as f:
            code = f.read()
        
        # Query knowledge base for common issues
        context = await self.query_knowledge_base("C++ code review checklist best practices")
        context_str = "\n".join([doc.get('content', '') for doc in context])
        
        prompt = f"""Review the following C++ code and provide:
1. Security vulnerabilities
2. Performance issues
3. Memory management problems
4. Thread safety concerns
5. Code style violations
6. Suggested improvements
7. Positive aspects

Code:
{code}
"""
        
        review = self.execute_qwen(prompt, context_str)
        
        return {
            'code_file': code_file,
            'review': review,
            'severity_issues': self.extract_severity_issues(review),
            'timestamp': datetime.now().isoformat()
        }
    
    def extract_severity_issues(self, review: str) -> Dict[str, List[str]]:
        """Extract issues by severity from review"""
        # Simple extraction - would be more sophisticated in production
        return {
            'critical': [],
            'high': [],
            'medium': [],
            'low': []
        }


class BuildSystemWorker(CPPWorkerBase):
    """Worker specialized in C++ build systems"""
    
    def __init__(self, worker_id: str):
        super().__init__(worker_id, "build_system")
        self.system_prompt = """You are a C++ build system expert with mastery of:
- CMake modern practices
- Conan package management
- vcpkg integration
- Cross-platform builds
- Compiler optimization flags
- Link-time optimization
- Static analysis integration
- CI/CD pipelines

Create efficient, maintainable build configurations.
"""
    
    async def execute_task(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Execute build system tasks"""
        task_type = task.get('type', '')
        
        if task_type == 'generate_cmake':
            return await self.generate_cmake(task)
        elif task_type == 'setup_dependencies':
            return await self.setup_dependencies(task)
        elif task_type == 'optimize_build':
            return await self.optimize_build(task)
        else:
            return {'error': f'Unknown task type: {task_type}'}
    
    async def generate_cmake(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Generate CMake configuration"""
        project_name = task.get('project_name', '')
        dependencies = task.get('dependencies', [])
        
        prompt = f"""Generate a modern CMake configuration for:
Project: {project_name}
Dependencies: {', '.join(dependencies)}

Include:
1. Modern CMake practices (3.20+)
2. Target-based configuration
3. Package management (Conan/vcpkg)
4. Testing integration
5. Installation rules
6. Cross-platform support
"""
        
        cmake_config = self.execute_qwen(prompt)
        
        # Save CMakeLists.txt
        with open('CMakeLists.txt', 'w', encoding='utf-8') as f:
            f.write(cmake_config)
        
        return {
            'project_name': project_name,
            'cmake_file': 'CMakeLists.txt',
            'config': cmake_config,
            'timestamp': datetime.now().isoformat()
        }


class DocumentationWorker(CPPWorkerBase):
    """Worker specialized in C++ documentation"""
    
    def __init__(self, worker_id: str):
        super().__init__(worker_id, "documentation")
        self.system_prompt = """You are a technical documentation expert for C++ projects with knowledge of:
- Doxygen documentation
- API documentation best practices
- Architecture documentation
- Tutorial and guide writing
- Code examples
- Performance documentation
- Migration guides

Create clear, comprehensive documentation that helps developers understand and use the code.
"""
    
    async def execute_task(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Execute documentation tasks"""
        task_type = task.get('type', '')
        
        if task_type == 'document_code':
            return await self.document_code(task)
        elif task_type == 'generate_guide':
            return await self.generate_guide(task)
        elif task_type == 'update_api_docs':
            return await self.update_api_docs(task)
        else:
            return {'error': f'Unknown task type: {task_type}'}
    
    async def document_code(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Add documentation to C++ code"""
        code_file = task.get('code_file', '')
        
        with open(code_file, 'r', encoding='utf-8') as f:
            code = f.read()
        
        prompt = f"""Add comprehensive Doxygen documentation to the following C++ code:

{code}

Include:
1. File header with description
2. Class documentation
3. Method documentation with parameters, returns, exceptions
4. Performance notes where relevant
5. Usage examples
"""
        
        documented_code = self.execute_qwen(prompt)
        
        # Backup original and save documented version
        backup_file = code_file + '.backup'
        os.rename(code_file, backup_file)
        
        with open(code_file, 'w', encoding='utf-8') as f:
            f.write(documented_code)
        
        return {
            'code_file': code_file,
            'backup_file': backup_file,
            'documented': True,
            'timestamp': datetime.now().isoformat()
        }


class PerformanceWorker(CPPWorkerBase):
    """Worker specialized in C++ performance optimization"""
    
    def __init__(self, worker_id: str):
        super().__init__(worker_id, "performance")
        self.system_prompt = """You are a C++ performance optimization expert with deep knowledge of:
- CPU architecture and cache optimization
- SIMD vectorization (SSE, AVX, NEON)
- Memory access patterns
- Compiler optimizations
- Profiling tools (perf, VTune, gprof)
- Benchmarking with Google Benchmark
- Lock-free data structures
- Parallel algorithms

Optimize C++ code for maximum performance while maintaining correctness.
"""
    
    async def execute_task(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Execute performance optimization tasks"""
        task_type = task.get('type', '')
        
        if task_type == 'optimize_code':
            return await self.optimize_code(task)
        elif task_type == 'generate_benchmark':
            return await self.generate_benchmark(task)
        elif task_type == 'analyze_performance':
            return await self.analyze_performance(task)
        else:
            return {'error': f'Unknown task type: {task_type}'}
    
    async def optimize_code(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Optimize C++ code for performance"""
        code_file = task.get('code_file', '')
        
        with open(code_file, 'r', encoding='utf-8') as f:
            code = f.read()
        
        # Query knowledge base for optimization patterns
        context = await self.query_knowledge_base("C++ performance optimization techniques")
        context_str = "\n".join([doc.get('content', '') for doc in context])
        
        prompt = f"""Optimize the following C++ code for performance:

{code}

Consider:
1. Cache-friendly data structures
2. SIMD vectorization opportunities
3. Memory allocation optimization
4. Loop optimizations
5. Branch prediction
6. Parallel execution
7. Compile-time computations

Provide optimized version with explanations.
"""
        
        optimized_code = self.execute_qwen(prompt, context_str)
        
        # Save optimized version
        optimized_file = code_file.replace('.cpp', '_optimized.cpp')
        with open(optimized_file, 'w', encoding='utf-8') as f:
            f.write(optimized_code)
        
        return {
            'original_file': code_file,
            'optimized_file': optimized_file,
            'optimizations': optimized_code,
            'timestamp': datetime.now().isoformat()
        }


# Worker registry
WORKER_CLASSES = {
    'architecture': ArchitectureWorker,
    'code_generator': CodeGeneratorWorker,
    'testing': TestingWorker,
    'code_review': CodeReviewWorker,
    'build_system': BuildSystemWorker,
    'documentation': DocumentationWorker,
    'performance': PerformanceWorker
}

def create_worker(worker_type: str, worker_id: str) -> Optional[CPPWorkerBase]:
    """Factory function to create workers"""
    worker_class = WORKER_CLASSES.get(worker_type)
    if worker_class:
        return worker_class(worker_id)
    return None