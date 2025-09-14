# 📚 Documentation Rules for C++ Orchestration Project

## 1. Code Documentation Standards

### 1.1 File Headers
Every source file must start with:
```cpp
/**
 * @file filename.cpp
 * @brief Brief description of file purpose
 * @author Author Name
 * @date Creation date
 * @version 1.0.0
 * 
 * @details Detailed description of the file's role in the system
 * 
 * @copyright Copyright (c) 2025 Project Name
 * @license MIT License
 */
```

### 1.2 Class Documentation
```cpp
/**
 * @class ClassName
 * @brief Brief description
 * 
 * @details Detailed explanation of class purpose, responsibilities,
 *          and usage patterns. Include design decisions if relevant.
 * 
 * @tparam T Template parameter description (if applicable)
 * 
 * @invariant Class invariants that must always hold
 * 
 * @example
 * ```cpp
 * ClassName obj;
 * obj.doSomething();
 * ```
 */
```

### 1.3 Function Documentation
```cpp
/**
 * @brief Brief description of function
 * 
 * @param[in] input_param Description of input parameter
 * @param[out] output_param Description of output parameter
 * @param[in,out] inout_param Description of input/output parameter
 * 
 * @return Description of return value
 * 
 * @throws ExceptionType When this exception is thrown
 * 
 * @pre Preconditions that must be met
 * @post Postconditions guaranteed after execution
 * 
 * @note Important notes about the function
 * @warning Warnings about potential issues
 * 
 * @complexity O(n) - Time complexity
 * @thread_safe Yes/No - Thread safety guarantee
 */
```

### 1.4 Inline Comments
```cpp
// Single-line comments for simple explanations
int counter = 0;  // Initialize counter

/* Multi-line comments for complex logic explanation
   that requires multiple lines to properly describe
   the algorithm or approach being used */
```

## 2. Architecture Decision Records (ADR)

### 2.1 ADR Template
Create files in `docs/adr/` with naming: `ADR-XXXX-title.md`

```markdown
# ADR-0001: Title

## Status
[Proposed | Accepted | Deprecated | Superseded by ADR-XXXX]

## Context
What is the issue that we're seeing that is motivating this decision?

## Decision
What is the change that we're proposing/have agreed to implement?

## Consequences
### Positive
- List positive outcomes

### Negative
- List negative outcomes

### Neutral
- List neutral observations

## Alternatives Considered
- Alternative 1: Description and why rejected
- Alternative 2: Description and why rejected
```

## 3. API Documentation

### 3.1 REST API Documentation
Use OpenAPI 3.0 specification in `api/openapi.yaml`:
```yaml
paths:
  /api/v1/resource:
    get:
      summary: Brief description
      description: |
        Detailed description including:
        - Use cases
        - Performance characteristics
        - Rate limiting
      parameters:
        - name: param
          description: Parameter description
          required: true
          schema:
            type: string
      responses:
        200:
          description: Success response
```

### 3.2 C++ API Documentation
For public APIs, create separate documentation:
```cpp
namespace api {
    /**
     * @defgroup PublicAPI Public API Functions
     * @{
     */
    
    /**
     * @brief Public API function
     * @details This function is part of the public API and maintains
     *          backward compatibility across minor versions
     * @since v1.0.0
     * @deprecated Since v2.0.0, use newFunction() instead
     */
    void publicFunction();
    
    /** @} */ // end of PublicAPI group
}
```

## 4. Documentation Hierarchy

```
docs/
├── getting-started/
│   ├── installation.md       # Installation instructions
│   ├── quickstart.md         # Quick start guide
│   └── first-agent.md        # Creating first agent
├── architecture/
│   ├── overview.md           # System architecture overview
│   ├── components/           # Component documentation
│   │   ├── core-engine.md
│   │   ├── task-scheduler.md
│   │   └── plugin-system.md
│   └── decisions/            # ADRs
├── api/
│   ├── cpp/                  # C++ API documentation
│   ├── rest/                 # REST API documentation
│   └── graphql/              # GraphQL schema docs
├── development/
│   ├── contributing.md       # Contribution guidelines
│   ├── coding-standards.md   # Coding standards
│   ├── testing.md           # Testing guidelines
│   └── debugging.md         # Debugging tips
└── deployment/
    ├── docker.md            # Docker deployment
    ├── kubernetes.md        # K8s deployment
    └── monitoring.md        # Monitoring setup
```

## 5. Code Review Documentation

### 5.1 Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Performance tests (if applicable)

## Documentation
- [ ] Code comments updated
- [ ] API documentation updated
- [ ] ADR created (if architectural change)
- [ ] README updated (if needed)

## Checklist
- [ ] Follows coding standards
- [ ] No compiler warnings
- [ ] Memory leaks checked (valgrind/sanitizers)
- [ ] Thread safety considered
```

## 6. Automated Documentation

### 6.1 Doxygen Configuration
```doxyfile
PROJECT_NAME = "C++ Orchestration System"
GENERATE_HTML = YES
GENERATE_LATEX = NO
EXTRACT_ALL = YES
EXTRACT_PRIVATE = NO
EXTRACT_STATIC = YES
GENERATE_TREEVIEW = YES
HAVE_DOT = YES
CALL_GRAPH = YES
CALLER_GRAPH = YES
```

### 6.2 Documentation Generation Pipeline
```yaml
# .github/workflows/docs.yml
name: Generate Documentation
on:
  push:
    branches: [main]
jobs:
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Generate Doxygen
        run: doxygen Doxyfile
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
```

## 7. Knowledge Base Management

### 7.1 Vector Database Documentation
All documentation must be indexed in Qdrant for semantic search:
- Architecture decisions
- API documentation
- Code examples
- Common patterns
- Troubleshooting guides

### 7.2 Embedding Strategy
```python
# Document sections for embedding:
- Each class/function documentation
- Each ADR
- Each guide section
- Code examples with context
```

## 8. Version-Specific Documentation

### 8.1 Versioning Strategy
- Documentation versioned alongside code
- Maintain documentation for last 3 major versions
- Clear migration guides between versions

### 8.2 Changelog Format
```markdown
# Changelog

## [1.0.0] - 2025-01-01
### Added
- New features

### Changed
- Modified features

### Deprecated
- Features to be removed

### Removed
- Removed features

### Fixed
- Bug fixes

### Security
- Security updates
```

## 9. Documentation Quality Metrics

### 9.1 Coverage Requirements
- 100% public API documentation
- 90% internal API documentation
- All architectural decisions documented
- All complex algorithms explained

### 9.2 Quality Checks
- [ ] No broken links
- [ ] Code examples compile
- [ ] Consistent terminology
- [ ] Up-to-date with code
- [ ] Reviewed by technical writer

## 10. Special Documentation Types

### 10.1 Performance Documentation
```cpp
/**
 * @performance
 * Time Complexity: O(n log n)
 * Space Complexity: O(n)
 * Cache Performance: L1-friendly
 * Parallelizable: Yes (with grain size > 1000)
 * SIMD-optimized: AVX2 when available
 */
```

### 10.2 Security Documentation
```cpp
/**
 * @security
 * Input Validation: Required
 * Privileges Required: Admin
 * Audit: All calls logged
 * Encryption: Data encrypted at rest
 * Rate Limiting: 100 requests/minute
 */
```

### 10.3 Concurrency Documentation
```cpp
/**
 * @concurrency
 * Thread-Safe: Yes (with internal mutex)
 * Lock-Free: No
 * Wait-Free: No
 * Reentrancy: Not reentrant
 * Deadlock Potential: None
 */
```