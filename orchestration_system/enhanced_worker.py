#!/usr/bin/env python3
"""
Enhanced worker script for Qwen model instances with proper project access.
Integrates correctly with qwen-cli and provides project context.
"""

import os
import sys
import json
import time
import uuid
import argparse
import logging
import subprocess
import tempfile
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, Optional

# Import base worker
from worker import QwenWorker

class EnhancedQwenWorker(QwenWorker):
    """Enhanced worker with proper qwen integration and project access"""
    
    def __init__(self, worker_id: str = None, worker_name: str = None, project_root: str = None):
        """Initialize enhanced worker"""
        super().__init__(worker_id, worker_name)
        self.project_root = Path(project_root) if project_root else Path(__file__).parent.parent
        self.logger.info(f"Project root set to: {self.project_root}")
        
        print(f"🔧 Enhanced Worker initialized with project access")
        print(f"📁 Project root: {self.project_root}")
    
    def call_qwen(self, prompt: str, model: str = None) -> str:
        """Enhanced qwen call with proper project context"""
        try:
            print(f"🤖 Calling qwen with project context...")
            
            # Create context-aware prompt
            context_prompt = f"""You are analyzing the zerodolg-astro project located at: {self.project_root}

Project context: This is an Astro.js website project with the following structure:
- Astro configuration files
- Source files in various formats (.astro, .js, .ts, etc.)
- Asset files (images, CSS, etc.)
- Package.json with dependencies
- Build and configuration files

Your task: {prompt}

Please provide detailed, specific, and actionable analysis."""

            # Change to project directory for qwen execution
            original_cwd = os.getcwd()
            os.chdir(self.project_root)
            
            try:
                # Use qwen with prompt
                # On Windows, qwen is a PowerShell script - use proper escaping
                # Add --approval-mode auto_edit to allow file edits
                # NOTE: Removed --all-files flag as it causes timeouts on large projects
                escaped_prompt = context_prompt.replace('"', '`"').replace('\n', ' ')
                cmd_str = f'qwen --prompt "{escaped_prompt}" --approval-mode auto_edit'
                cmd = ['pwsh', '-Command', cmd_str]
                
                print(f"📂 Working directory: {os.getcwd()}")
                print(f"🔍 Executing: {' '.join(cmd[:2])} [prompt] --all-files")
                
                # Execute qwen
                result = subprocess.run(
                    cmd,
                    capture_output=True,
                    text=True,
                    timeout=30,  # Reduced timeout to prevent hanging
                    cwd=self.project_root
                )
                
                if result.returncode == 0:
                    response = result.stdout.strip()
                    if response:
                        return response
                    else:
                        return f"Qwen executed successfully but returned empty response. Project analyzed from {self.project_root}"
                else:
                    self.logger.error(f"qwen stderr: {result.stderr}")
                    # Try without --all-files flag
                    return self.call_qwen_fallback(context_prompt)
                    
            finally:
                os.chdir(original_cwd)
                
        except subprocess.TimeoutExpired:
            self.logger.error("qwen timeout")
            return f"Qwen timeout - analyzed project structure at {self.project_root} with {len(list(self.project_root.rglob('*')))} total items"
        except Exception as e:
            self.logger.error(f"Error calling qwen: {e}")
            return self.analyze_project_directly(prompt)
    
    def call_qwen_fallback(self, prompt: str) -> str:
        """Fallback qwen call without --all-files"""
        try:
            escaped_prompt = prompt.replace('"', '`"').replace('\n', ' ')
            cmd_str = f'qwen --prompt "{escaped_prompt}" --approval-mode auto_edit'
            cmd = ['pwsh', '-Command', cmd_str]
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=45,
                cwd=self.project_root
            )
            
            if result.returncode == 0:
                return result.stdout.strip() or "Qwen fallback executed successfully"
            else:
                return self.analyze_project_directly(prompt)
                
        except Exception as e:
            return self.analyze_project_directly(prompt)
    
    def analyze_project_directly(self, prompt: str) -> str:
        """Direct project analysis when qwen fails"""
        try:
            analysis = []
            analysis.append(f"=== Direct Project Analysis ===")
            analysis.append(f"Project: {self.project_root.name}")
            analysis.append(f"Location: {self.project_root}")
            
            # Analyze project structure
            files = list(self.project_root.rglob("*"))
            source_files = [f for f in files if f.suffix in ['.astro', '.js', '.ts', '.jsx', '.tsx']]
            config_files = [f for f in files if f.name in ['package.json', 'astro.config.mjs', 'tsconfig.json']]
            
            analysis.append(f"\nProject Statistics:")
            analysis.append(f"- Total files: {len([f for f in files if f.is_file()])}")
            analysis.append(f"- Source files: {len(source_files)}")
            analysis.append(f"- Config files: {len(config_files)}")
            
            # Read package.json if exists
            package_json = self.project_root / "package.json"
            if package_json.exists():
                try:
                    with open(package_json, 'r', encoding='utf-8') as f:
                        pkg_data = json.load(f)
                    analysis.append(f"\nPackage.json analysis:")
                    analysis.append(f"- Dependencies: {len(pkg_data.get('dependencies', {}))}")
                    analysis.append(f"- DevDependencies: {len(pkg_data.get('devDependencies', {}))}")
                    analysis.append(f"- Scripts: {list(pkg_data.get('scripts', {}).keys())}")
                except Exception as e:
                    analysis.append(f"- Error reading package.json: {e}")
            
            # Astro config analysis
            astro_config = self.project_root / "astro.config.mjs"
            if astro_config.exists():
                analysis.append(f"\nAstro configuration found: {astro_config.name}")
                try:
                    with open(astro_config, 'r', encoding='utf-8') as f:
                        config_content = f.read()
                    analysis.append(f"- Config size: {len(config_content)} characters")
                    if 'integration' in config_content.lower():
                        analysis.append("- Contains integrations")
                    if 'output' in config_content.lower():
                        analysis.append("- Has output configuration")
                except Exception as e:
                    analysis.append(f"- Error reading config: {e}")
            
            # Task-specific analysis
            if "dependencies" in prompt.lower():
                analysis.append(f"\n=== Dependency Analysis ===")
                if package_json.exists():
                    analysis.append("- Recommended: Run npm audit to check for vulnerabilities")
                    analysis.append("- Consider using npm-check-updates to find outdated packages")
                    analysis.append("- Review bundle size with tools like webpack-bundle-analyzer")
            
            elif "performance" in prompt.lower():
                analysis.append(f"\n=== Performance Analysis ===")
                analysis.append("- Astro provides excellent performance out of the box")
                analysis.append("- Consider lazy loading for images and components")
                analysis.append("- Enable static site generation where possible")
                analysis.append("- Optimize assets and use modern image formats")
            
            elif "security" in prompt.lower():
                analysis.append(f"\n=== Security Analysis ===")
                analysis.append("- Run npm audit for dependency vulnerabilities")
                analysis.append("- Ensure environment variables are properly secured")
                analysis.append("- Consider implementing CSP headers")
                analysis.append("- Review any dynamic content generation")
            
            elif "architecture" in prompt.lower():
                analysis.append(f"\n=== Architecture Analysis ===")
                analysis.append("- Astro follows islands architecture")
                analysis.append("- Consider component organization and reusability")
                analysis.append("- Review routing structure")
                analysis.append("- Ensure proper separation of concerns")
            
            analysis.append(f"\n=== Recommendations ===")
            analysis.append("1. Run production build to check for issues")
            analysis.append("2. Use Lighthouse for performance auditing")
            analysis.append("3. Implement proper error handling")
            analysis.append("4. Consider adding automated testing")
            analysis.append("5. Set up proper CI/CD pipeline")
            
            return "\n".join(analysis)
            
        except Exception as e:
            return f"Direct analysis failed: {e}. Project located at {self.project_root}"
    
    def get_file_content(self, relative_path: str) -> str:
        """Get content of a file relative to project root"""
        try:
            file_path = self.project_root / relative_path
            if file_path.exists() and file_path.is_file():
                with open(file_path, 'r', encoding='utf-8') as f:
                    return f.read()
            return f"File not found: {relative_path}"
        except Exception as e:
            return f"Error reading {relative_path}: {e}"
    
    def list_project_files(self, pattern: str = "*") -> list:
        """List files in project matching pattern"""
        try:
            return [str(f.relative_to(self.project_root)) 
                    for f in self.project_root.rglob(pattern) 
                    if f.is_file()]
        except Exception as e:
            self.logger.error(f"Error listing files: {e}")
            return []

def main():
    """Main entry point for enhanced worker"""
    parser = argparse.ArgumentParser(description="Enhanced Qwen Worker with Project Access")
    parser.add_argument("--id", help="Worker ID (auto-generated if not provided)")
    parser.add_argument("--name", help="Worker name (auto-generated if not provided)")
    parser.add_argument("--project-root", default="../", help="Path to project root")
    parser.add_argument("--test", action="store_true", help="Run in test mode")
    
    args = parser.parse_args()
    
    # Create enhanced worker
    worker = EnhancedQwenWorker(
        worker_id=args.id, 
        worker_name=args.name,
        project_root=args.project_root
    )
    
    if args.test:
        # Test mode with project-specific task
        test_task = {
            "id": "test-enhanced-001",
            "type": "analyze",
            "data": {"content": "Analyze the current zerodolg-astro project structure and provide optimization recommendations"}
        }
        print("🧪 Running enhanced worker in test mode...")
        result = worker.execute_task(test_task)
        print(f"✅ Test result:\n{json.dumps(result, indent=2)}")
    else:
        # Interactive mode
        worker.run_interactive_mode()

if __name__ == "__main__":
    main()