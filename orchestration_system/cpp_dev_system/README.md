# C++ Development System with AI Workers

An advanced orchestration system for automated C++ project development using specialized AI workers, vector database for knowledge management, and intelligent task coordination.

## 🚀 Features

- **Specialized AI Workers**: Architecture, Code Generation, Testing, Code Review, Build System, Documentation, and Performance Optimization
- **Vector Database Integration**: Qdrant for semantic code search and knowledge retrieval
- **RAG-based Development**: Retrieval-Augmented Generation for context-aware code generation
- **Persistent Task Management**: Save and restore task states between sessions
- **Automated Workflow**: Complete development cycles from design to testing

## 📋 Prerequisites

### Required
- Python 3.8+
- PowerShell 7+ (Windows) or Bash (Linux/Mac)

### Optional (but recommended)
- Docker (for Qdrant)
- Ollama (for embeddings)
- Qwen or other LLM CLI tool

## 🛠️ Installation

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 2. Setup Qdrant (Optional)

Using Docker:
```bash
docker run -p 6333:6333 -v ./qdrant_storage:/qdrant/storage qdrant/qdrant
```

Or install locally:
```bash
pip install qdrant-client
```

### 3. Setup Ollama (Optional)

Install Ollama from https://ollama.ai

Pull the embedding model:
```bash
ollama pull nomic-embed-text
```

Start Ollama service:
```bash
ollama serve
```

### 4. Configure Qwen (Optional)

Install Qwen CLI for enhanced AI capabilities:
```bash
# Follow Qwen installation instructions
# Configure with your API key or local model
```

## 🎯 Quick Start

### Initialize Only (Setup without running tasks)
```powershell
.\start_cpp_development.ps1 --init-only
```

### Run Single Development Cycle
```powershell
.\start_cpp_development.ps1
```

### Run Multiple Cycles
```powershell
.\start_cpp_development.ps1 --cycles 3
```

### Custom Project Path
```powershell
.\start_cpp_development.ps1 --project "C:\my_cpp_project"
```

## 📁 Project Structure

```
orchestration_system/
├── cpp_development_system.py    # Main system coordinator
├── task_orchestrator.py         # Task queue management
├── setup_qdrant.py             # Vector database setup
├── workers/
│   └── cpp_workers.py          # Specialized worker implementations
├── config/
│   └── cpp_development.json    # System configuration
├── src/                        # Generated C++ source code
├── tests/                      # Generated test files
├── docs/                       # Generated documentation
│   └── adr/                    # Architecture Decision Records
├── reports/                    # Development reports
├── logs/                       # System logs
├── state/                      # Persistent state files
├── tasks/                      # Task queue files
└── results/                    # Task results

```

## 🤖 Worker Types

### Architecture Worker
- Designs system components
- Creates architecture diagrams
- Writes Architecture Decision Records (ADRs)
- Reviews existing architecture

### Code Generator Worker
- Generates C++ classes and functions
- Implements design patterns
- Creates header and implementation files
- Follows C++20/23 best practices

### Testing Worker
- Generates unit tests with Google Test
- Creates benchmarks
- Performs coverage analysis
- Generates integration tests

### Code Review Worker
- Security vulnerability detection
- Performance issue identification
- Memory management analysis
- Code style validation

### Build System Worker
- Generates CMake configurations
- Manages dependencies with Conan/vcpkg
- Optimizes build flags
- Creates CI/CD pipelines

### Documentation Worker
- Generates Doxygen documentation
- Creates API documentation
- Writes user guides
- Maintains code examples

### Performance Worker
- Optimizes code for performance
- SIMD vectorization
- Cache optimization
- Parallel algorithm implementation

## ⚙️ Configuration

Edit `config/cpp_development.json`:

```json
{
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
```

## 📊 Development Workflow

1. **Initialization**: System loads configuration and initializes workers
2. **Knowledge Base Setup**: Indexes existing code and documentation
3. **Task Generation**: Creates development tasks based on project needs
4. **Task Distribution**: Assigns tasks to specialized workers
5. **Execution**: Workers process tasks using AI and knowledge base
6. **Result Collection**: Gathers and stores task results
7. **Report Generation**: Creates development reports with statistics

## 🔍 Monitoring

### View System Status
```powershell
Get-Content logs/cpp_development.log -Tail 50
```

### Check Task Queue
```powershell
Get-Content state/task_queue.json | ConvertFrom-Json | Format-List
```

### View Latest Report
```powershell
Get-ChildItem reports/*.json | Sort-Object LastWriteTime -Descending | Select-Object -First 1 | Get-Content | ConvertFrom-Json
```

## 🧪 Testing the System

### Test Without External Dependencies
```python
python cpp_development_system.py --init-only
```

### Test Individual Workers
```python
from workers.cpp_workers import create_worker

# Create and test a worker
worker = create_worker("architecture", "test_worker")
result = await worker.execute_task({
    "type": "design_component",
    "component_name": "TestComponent",
    "requirements": "Simple test component"
})
```

## 🐛 Troubleshooting

### Qdrant Connection Issues
- Ensure Docker is running
- Check port 6333 is not blocked
- Verify Qdrant container status: `docker ps`

### Ollama Issues
- Ensure Ollama service is running: `ollama serve`
- Check model is downloaded: `ollama list`
- Verify API endpoint: `curl http://localhost:11434/api/tags`

### Worker Failures
- Check logs in `logs/cpp_development.log`
- Verify Qwen installation and configuration
- Ensure sufficient disk space for generated files

### Task Queue Issues
- Clear stale state: `Remove-Item state/*.json`
- Reset task counter in `state/orchestrator_state.json`
- Check for orphaned tasks in `tasks/` directory

## 📈 Performance Tips

1. **Parallel Processing**: Increase worker counts for parallel task execution
2. **Vector Database**: Pre-index large codebases for faster retrieval
3. **Caching**: Enable result caching in worker implementations
4. **Resource Limits**: Adjust timeout and memory limits per worker

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement new workers or improvements
4. Add tests for new functionality
5. Submit a pull request

## 📝 License

This project is part of the zerodolg-astro orchestration system.

## 🔗 Related Projects

- [Qdrant Vector Database](https://qdrant.tech/)
- [Ollama](https://ollama.ai/)
- [Google Test](https://github.com/google/googletest)
- [CMake](https://cmake.org/)

## 📞 Support

For issues and questions:
- Check the logs in `logs/` directory
- Review task results in `results/` directory
- Consult generated reports in `reports/` directory

---

**Note**: This system is designed for development assistance and should be reviewed before production use. Always validate generated code and follow your organization's coding standards.