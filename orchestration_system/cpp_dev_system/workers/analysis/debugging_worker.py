"""
Debugging Worker for C++ Development System
Handles debugging, error analysis, and troubleshooting
"""

import json
import os
import sys
import time
import subprocess
from pathlib import Path
from datetime import datetime
from typing import Dict, Any, List, Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class DebuggingWorker:
    """Worker specialized in debugging and error analysis"""
    
    def __init__(self, worker_id: str):
        self.worker_id = worker_id
        self.qdrant_client = None
        self.ollama_embedder = None
        self.system_prompt = self._get_system_prompt()
        
    def _get_system_prompt(self) -> str:
        """Get specialized system prompt for debugging"""
        return """You are an expert C++ debugging specialist with deep knowledge of:

## Core Competencies:
- Advanced debugging techniques (GDB, LLDB, Visual Studio Debugger)
- Memory debugging (Valgrind, AddressSanitizer, MemorySanitizer)
- Performance profiling (perf, VTune, gperftools)
- Static analysis (clang-tidy, cppcheck, PVS-Studio)
- Dynamic analysis and runtime error detection
- Core dump analysis and stack trace interpretation
- Multithreading and race condition debugging
- Memory leak detection and analysis

## Debugging Workflow:
1. Analyze error symptoms and collect diagnostics
2. Reproduce the issue in controlled environment
3. Use appropriate debugging tools for the problem type
4. Identify root cause through systematic analysis
5. Propose and validate fixes
6. Document debugging process and solution

## Analysis Techniques:
- Stack trace analysis and symbol resolution
- Memory access pattern analysis
- Thread synchronization debugging
- Performance bottleneck identification
- Resource leak detection
- Undefined behavior analysis
- Compiler optimization issues

## Best Practices:
- Create minimal reproducible examples
- Use assert() and static_assert for invariants
- Implement comprehensive logging
- Write defensive code with proper error handling
- Use sanitizers during development
- Maintain debugging symbol information
- Document known issues and workarounds

When debugging C++ code:
- Provide detailed analysis of error conditions
- Suggest appropriate debugging tools and techniques
- Explain the root cause clearly
- Propose robust fixes that prevent recurrence
- Consider edge cases and error conditions
- Ensure thread safety and memory safety
"""
    
    async def process_task(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Process a debugging task"""
        task_type = task.get('type', 'debug')
        
        if task_type == 'debug_crash':
            return await self.debug_crash(task)
        elif task_type == 'analyze_memory':
            return await self.analyze_memory_issues(task)
        elif task_type == 'profile_performance':
            return await self.profile_performance(task)
        elif task_type == 'static_analysis':
            return await self.run_static_analysis(task)
        elif task_type == 'trace_execution':
            return await self.trace_execution(task)
        else:
            return await self.general_debugging(task)
    
    async def debug_crash(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Debug a crash or segmentation fault"""
        code_path = task.get('code_path')
        crash_info = task.get('crash_info', {})
        
        analysis = {
            'timestamp': datetime.now().isoformat(),
            'worker_id': self.worker_id,
            'task_type': 'debug_crash',
            'findings': []
        }
        
        # Analyze stack trace if available
        if 'stack_trace' in crash_info:
            stack_analysis = self._analyze_stack_trace(crash_info['stack_trace'])
            analysis['findings'].append({
                'type': 'stack_analysis',
                'details': stack_analysis
            })
        
        # Check for common crash patterns
        crash_patterns = self._check_crash_patterns(code_path)
        if crash_patterns:
            analysis['findings'].append({
                'type': 'crash_patterns',
                'patterns': crash_patterns
            })
        
        # Generate debugging commands
        debug_commands = self._generate_debug_commands(code_path, crash_info)
        analysis['debug_commands'] = debug_commands
        
        # Use AI for deeper analysis if available
        if self.ollama_embedder:
            ai_analysis = await self._ai_crash_analysis(code_path, crash_info)
            analysis['ai_analysis'] = ai_analysis
        
        return analysis
    
    async def analyze_memory_issues(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze memory-related issues"""
        code_path = task.get('code_path')
        
        analysis = {
            'timestamp': datetime.now().isoformat(),
            'worker_id': self.worker_id,
            'task_type': 'analyze_memory',
            'checks': []
        }
        
        # Check for memory leaks
        leak_check = self._check_memory_leaks(code_path)
        analysis['checks'].append({
            'type': 'memory_leaks',
            'results': leak_check
        })
        
        # Check for buffer overflows
        overflow_check = self._check_buffer_overflows(code_path)
        analysis['checks'].append({
            'type': 'buffer_overflows',
            'results': overflow_check
        })
        
        # Check for use-after-free
        uaf_check = self._check_use_after_free(code_path)
        analysis['checks'].append({
            'type': 'use_after_free',
            'results': uaf_check
        })
        
        # Generate Valgrind commands
        analysis['valgrind_commands'] = [
            f"valgrind --leak-check=full --show-leak-kinds=all {code_path}",
            f"valgrind --tool=memcheck --track-origins=yes {code_path}",
            f"valgrind --tool=massif {code_path}"
        ]
        
        # Generate AddressSanitizer compilation
        analysis['asan_compile'] = f"g++ -fsanitize=address -g -O1 {code_path}"
        
        return analysis
    
    async def profile_performance(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Profile performance issues"""
        code_path = task.get('code_path')
        
        profile = {
            'timestamp': datetime.now().isoformat(),
            'worker_id': self.worker_id,
            'task_type': 'profile_performance',
            'metrics': {}
        }
        
        # Generate profiling commands
        profile['profiling_commands'] = {
            'perf': [
                f"perf record -g {code_path}",
                "perf report",
                f"perf stat {code_path}"
            ],
            'gprof': [
                f"g++ -pg {code_path} -o profiled_app",
                "./profiled_app",
                "gprof profiled_app gmon.out"
            ],
            'time': f"time -v {code_path}"
        }
        
        # Identify potential bottlenecks
        bottlenecks = self._identify_bottlenecks(code_path)
        profile['potential_bottlenecks'] = bottlenecks
        
        # Suggest optimizations
        optimizations = self._suggest_optimizations(code_path)
        profile['optimization_suggestions'] = optimizations
        
        return profile
    
    async def run_static_analysis(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Run static code analysis"""
        code_path = task.get('code_path')
        
        analysis = {
            'timestamp': datetime.now().isoformat(),
            'worker_id': self.worker_id,
            'task_type': 'static_analysis',
            'tools': {}
        }
        
        # clang-tidy analysis
        analysis['tools']['clang_tidy'] = {
            'command': f"clang-tidy {code_path} --checks=*",
            'checks': [
                'bugprone-*',
                'cert-*',
                'cppcoreguidelines-*',
                'modernize-*',
                'performance-*',
                'readability-*'
            ]
        }
        
        # cppcheck analysis
        analysis['tools']['cppcheck'] = {
            'command': f"cppcheck --enable=all --std=c++20 {code_path}",
            'checks': [
                'error',
                'warning',
                'style',
                'performance',
                'portability'
            ]
        }
        
        # Compiler warnings
        analysis['compiler_warnings'] = {
            'gcc': f"g++ -Wall -Wextra -Wpedantic -Werror {code_path}",
            'clang': f"clang++ -Weverything {code_path}"
        }
        
        return analysis
    
    async def trace_execution(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Trace program execution"""
        code_path = task.get('code_path')
        
        trace = {
            'timestamp': datetime.now().isoformat(),
            'worker_id': self.worker_id,
            'task_type': 'trace_execution',
            'tracing_methods': {}
        }
        
        # System call tracing
        trace['tracing_methods']['strace'] = f"strace -f -e trace=all {code_path}"
        
        # Library call tracing
        trace['tracing_methods']['ltrace'] = f"ltrace -f {code_path}"
        
        # GDB tracing
        trace['tracing_methods']['gdb'] = [
            f"gdb {code_path}",
            "set logging on",
            "set trace-commands on",
            "run",
            "bt full"
        ]
        
        # Custom logging points
        trace['logging_suggestions'] = self._suggest_logging_points(code_path)
        
        return trace
    
    async def general_debugging(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """General debugging assistance"""
        problem = task.get('problem', '')
        code = task.get('code', '')
        
        response = {
            'timestamp': datetime.now().isoformat(),
            'worker_id': self.worker_id,
            'task_type': 'general_debugging'
        }
        
        # Use AI for analysis if available
        if self.ollama_embedder:
            prompt = f"{self.system_prompt}\n\nProblem: {problem}\n\nCode:\n{code}\n\nProvide debugging guidance:"
            
            try:
                # Here you would call your AI model
                # For now, we'll provide structured guidance
                response['analysis'] = {
                    'problem_understanding': problem,
                    'debugging_steps': [
                        "1. Reproduce the issue consistently",
                        "2. Add logging to track execution flow",
                        "3. Use debugger to step through code",
                        "4. Check variable values at key points",
                        "5. Verify assumptions with assertions",
                        "6. Test edge cases and boundary conditions"
                    ],
                    'tools_recommended': self._recommend_tools(problem)
                }
            except Exception as e:
                logger.error(f"AI analysis failed: {e}")
                response['error'] = str(e)
        
        return response
    
    def _analyze_stack_trace(self, stack_trace: str) -> Dict[str, Any]:
        """Analyze a stack trace"""
        analysis = {
            'crash_location': None,
            'call_chain': [],
            'potential_causes': []
        }
        
        lines = stack_trace.split('\n')
        for line in lines:
            if '#0' in line:
                analysis['crash_location'] = line
            if '#' in line:
                analysis['call_chain'].append(line)
        
        # Check for common patterns
        if 'segmentation fault' in stack_trace.lower():
            analysis['potential_causes'].append('Null pointer dereference')
            analysis['potential_causes'].append('Buffer overflow')
            analysis['potential_causes'].append('Use after free')
        
        if 'stack overflow' in stack_trace.lower():
            analysis['potential_causes'].append('Infinite recursion')
            analysis['potential_causes'].append('Large stack allocations')
        
        return analysis
    
    def _check_crash_patterns(self, code_path: str) -> List[str]:
        """Check for common crash patterns in code"""
        patterns = []
        
        # This would normally analyze the actual code
        # For now, return common patterns to check
        patterns.extend([
            "Null pointer dereference",
            "Array index out of bounds",
            "Division by zero",
            "Stack overflow",
            "Heap corruption",
            "Race condition",
            "Deadlock"
        ])
        
        return patterns
    
    def _generate_debug_commands(self, code_path: str, crash_info: Dict) -> List[str]:
        """Generate debugging commands"""
        commands = [
            f"gdb {code_path}",
            "run",
            "bt",
            "info registers",
            "info locals",
            "disassemble",
            "x/10i $pc"
        ]
        
        if crash_info.get('core_dump'):
            commands.insert(1, f"core {crash_info['core_dump']}")
        
        return commands
    
    def _check_memory_leaks(self, code_path: str) -> Dict[str, Any]:
        """Check for potential memory leaks"""
        return {
            'patterns_to_check': [
                "new without delete",
                "malloc without free",
                "Missing destructor",
                "Circular references",
                "Exception safety issues"
            ]
        }
    
    def _check_buffer_overflows(self, code_path: str) -> Dict[str, Any]:
        """Check for buffer overflow vulnerabilities"""
        return {
            'dangerous_functions': [
                "strcpy", "strcat", "sprintf", "gets",
                "scanf without bounds"
            ],
            'safe_alternatives': [
                "strncpy", "strncat", "snprintf",
                "fgets", "scanf with width specifier"
            ]
        }
    
    def _check_use_after_free(self, code_path: str) -> Dict[str, Any]:
        """Check for use-after-free issues"""
        return {
            'patterns': [
                "Dangling pointers",
                "Deleted object access",
                "Return of local address",
                "Iterator invalidation"
            ]
        }
    
    def _identify_bottlenecks(self, code_path: str) -> List[str]:
        """Identify potential performance bottlenecks"""
        return [
            "Nested loops with high complexity",
            "Frequent memory allocations",
            "Unnecessary copying",
            "Cache misses",
            "Lock contention",
            "I/O operations in tight loops"
        ]
    
    def _suggest_optimizations(self, code_path: str) -> List[str]:
        """Suggest performance optimizations"""
        return [
            "Use move semantics instead of copying",
            "Apply const wherever possible",
            "Inline small functions",
            "Use reserve() for containers",
            "Prefer stack allocation over heap",
            "Cache frequently accessed data",
            "Use compiler optimization flags"
        ]
    
    def _suggest_logging_points(self, code_path: str) -> List[str]:
        """Suggest where to add logging"""
        return [
            "Function entry and exit points",
            "Before and after critical sections",
            "Error conditions and exceptions",
            "Loop iterations for debugging",
            "Variable state changes",
            "Thread synchronization points"
        ]
    
    def _recommend_tools(self, problem: str) -> List[str]:
        """Recommend debugging tools based on problem type"""
        tools = ["GDB - General debugging"]
        
        problem_lower = problem.lower()
        if 'memory' in problem_lower or 'leak' in problem_lower:
            tools.append("Valgrind - Memory debugging")
            tools.append("AddressSanitizer - Memory error detection")
        
        if 'performance' in problem_lower or 'slow' in problem_lower:
            tools.append("perf - Performance profiling")
            tools.append("gprof - Function profiling")
        
        if 'thread' in problem_lower or 'race' in problem_lower:
            tools.append("ThreadSanitizer - Race condition detection")
            tools.append("Helgrind - Thread error detection")
        
        return tools
    
    async def _ai_crash_analysis(self, code_path: str, crash_info: Dict) -> Dict[str, Any]:
        """Use AI for crash analysis"""
        # This would integrate with your AI model
        # For now, return structured analysis
        return {
            'analysis_complete': True,
            'confidence': 0.85,
            'suggested_fixes': [
                "Add null checks before pointer dereference",
                "Validate array indices",
                "Use smart pointers for automatic memory management"
            ]
        }


def create_debugging_worker(worker_id: str) -> DebuggingWorker:
    """Factory function to create debugging worker"""
    return DebuggingWorker(worker_id)