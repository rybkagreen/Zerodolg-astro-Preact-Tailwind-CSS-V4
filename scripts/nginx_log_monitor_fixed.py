#!/usr/bin/env python3
"""
Nginx Log Monitor with Ollama Integration

This application monitors nginx logs for errors and coordinates with local ollama models
to generate reports and automate fixes.
"""

import os
import time
import json
import logging
import paramiko
from datetime import datetime
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import requests
from pathlib import Path

# Configuration - Load from environment variables or config file
def load_config():
    """Load configuration from environment variables or config file"""
    config = {}
    
    # Try to load from environment variables first
    config['OLLAMA_API_URL'] = os.getenv('OLLAMA_API_URL', 'http://localhost:11434/api/generate')
    config['NGINX_LOG_PATH'] = os.getenv('NGINX_LOG_PATH', '/var/log/nginx/error.log')
    config['SSH_HOST'] = os.getenv('SSH_HOST', 'YOUR_LOCAL_COMPUTER_IP')  # Replace with your local computer's IP address
    config['SSH_USER'] = os.getenv('SSH_USER', 'root')
    config['SSH_KEY_PATH'] = os.getenv('SSH_KEY_PATH', '/root/.ssh/id_rsa')
    config['SSH_PORT'] = int(os.getenv('SSH_HOST_PORT', 22))  # Default to standard SSH port
    config['SSH_DEST_PATH'] = os.getenv('SSH_DEST_PATH', '/root/develop/zerodolg.ru/zerodolg-astro/tmp/')
    config['CODER_MODEL_NAME'] = os.getenv('CODER_MODEL_NAME', 'coder-model')
    config['OLLAMA_ANALYSIS_MODEL'] = os.getenv('OLLAMA_ANALYSIS_MODEL', 'llama2')
    config['ERROR_POLL_INTERVAL'] = int(os.getenv('ERROR_POLL_INTERVAL', '1'))  # seconds
    config['MAX_FILE_SIZE'] = int(os.getenv('MAX_FILE_SIZE', str(100 * 1024 * 1024)))  # 100MB
    config['LOG_LEVEL'] = os.getenv('LOG_LEVEL', 'INFO')
    
    # Try to load from config file if it exists
    config_file = os.getenv('CONFIG_FILE', 'config.env')
    if os.path.exists(config_file):
        try:
            with open(config_file, 'r') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#'):
                        key, value = line.split('=', 1)
                        value = os.path.expandvars(value)
                        
                        # Convert specific values to appropriate types
                        if key in ["ERROR_POLL_INTERVAL", "SSH_HOST_PORT"]:
                            try:
                                value = int(value)
                                # Map SSH_HOST_PORT to SSH_PORT for internal use
                                if key == "SSH_HOST_PORT":
                                    key = "SSH_PORT"
                            except ValueError:
                                logger.warning(f"Could not convert {key} to integer, using default value")
                        elif key == "MAX_FILE_SIZE":
                            try:
                                value = int(value)
                            except ValueError:
                                logger.warning(f"Could not convert {key} to integer, using default value")
                        
                        config[key] = value
        except Exception as e:
            print(f"Warning: Could not load config file {config_file}: {e}")
    
    return config

config = load_config()

# Set up logging
log_level = getattr(logging, config['LOG_LEVEL'].upper(), logging.INFO)
logging.basicConfig(
    level=log_level,
    format='%(asctime)s - %(levelname)s - %(funcName)s:%(lineno)d - %(message)s',
    handlers=[
        logging.FileHandler('nginx_monitor.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)


class NginxLogHandler(FileSystemEventHandler):
    """Handles nginx log file changes"""
    
    def __init__(self, log_file_path):
        self.log_file_path = log_file_path
        self.last_position = self._get_file_size()
        
    def _get_file_size(self):
        """Get the current size of the log file"""
        try:
            return os.path.getsize(self.log_file_path)
        except OSError:
            return 0
    
    def on_modified(self, event):
        """Handle when the log file is modified"""
        if event.src_path == self.log_file_path:
            self._process_new_lines()
    
    def _process_new_lines(self):
        """Process new lines added to the log file"""
        try:
            current_size = self._get_file_size()
            if current_size < self.last_position:
                # Log file was rotated
                self.last_position = 0
            
            with open(self.log_file_path, 'r', encoding='utf-8') as f:
                f.seek(self.last_position)
                new_lines = f.readlines()
                self.last_position = f.tell()
                
            for line in new_lines:
                if self._is_error_line(line):
                    logger.info(f"Error detected in log: {line.strip()}")
                    self._handle_error(line.strip())
        
        except Exception as e:
            logger.error(f"Error processing log file: {e}")
    
    def _is_error_line(self, line):
        """Check if a log line contains an error"""
        import re
        
        # More sophisticated error detection
        error_patterns = [
            r'error',           # General error
            r'Error',           # Capitalized error
            r'ERROR',           # Uppercase error
            r'critical',        # Critical issue
            r'Critical',        # Capitalized critical
            r'CRITICAL',        # Uppercase critical
            r'fail',            # Failure
            r'Fail',            # Capitalized failure
            r'FAIL',            # Uppercase failure
            r'4\d{2}',          # 4xx client errors
            r'5\d{2}',          # 5xx server errors
            r'timeout',         # Timeout issues
            r'Timeout',         # Capitalized timeout
            r'unable',          # Unable to perform action
            r'Unable',          # Capitalized unable
            r'connection.*refused',  # Connection refused
            r'connection.*reset',    # Connection reset
            r'not found',       # Resource not found
            r'Not found',       # Capitalized not found
            r'NOT FOUND',       # Uppercase not found
        ]
        
        for pattern in error_patterns:
            if re.search(pattern, line, re.IGNORECASE):
                return True
        return False
    
    def _handle_error(self, error_line):
        """Handle detected error by analyzing with ollama and sending report"""
        try:
            # Analyze the error with ollama
            analysis_result = self._analyze_error_with_ollama(error_line)
            
            # Generate report
            report = self._generate_report(error_line, analysis_result)
            
            # Send report via SSH
            self._send_report_via_ssh(report)
            
        except Exception as e:
            logger.error(f"Error handling detected error: {e}")
    
    def _analyze_error_with_ollama(self, error_line):
        """Return a simple placeholder analysis since Ollama is not available"""
        try:
            # Return a basic analysis without calling Ollama API
            analysis = f"Basic analysis for: {error_line}. This is a placeholder analysis since Ollama API is not available."
            return analysis
        except Exception as e:
            logger.error(f"Error generating placeholder analysis: {e}")
            return f"Placeholder analysis failed with error: {str(e)}"
    
    def _generate_report(self, error_line, analysis):
        """Generate a JSON report from error and analysis"""
        import re
        
        # Try to parse the error line to extract timestamp and error level
        timestamp = datetime.now().isoformat()
        error_level = "UNKNOWN"
        error_component = "UNKNOWN"
        
        # Extract timestamp from nginx log if present (format: [timestamp] level: message)
        timestamp_match = re.search(r'\[([^\]]+)\]', error_line)
        if timestamp_match:
            timestamp = timestamp_match.group(1)
        
        # Extract error level (format: [timestamp] level: message)
        level_match = re.search(r'\[([^\]]+)\].*?(\w+):', error_line)
        if level_match:
            error_level = level_match.group(2).upper()
        
        # Extract component if present
        component_match = re.search(r'([a-zA-Z]+):.*', error_line.split(':')[2] if len(error_line.split(':')) > 2 else error_line)
        if component_match:
            error_component = component_match.group(1).upper()
        
        # Categorize the error based on keywords
        error_category = self._categorize_error(error_line)
        
        report = {
            "timestamp": timestamp,
            "error_line": error_line,
            "analysis": analysis,
            "nginx_log_path": self.log_file_path,
            "error_level": error_level,
            "error_component": error_component,
            "error_category": error_category,
            "severity": self._determine_severity(error_line, analysis),
            "suggested_fixes": self._extract_suggested_fixes(analysis)
        }
        
        # Save report to a temporary file
        report_filename = f"error_report_{int(datetime.now().timestamp())}.json"
        report_path = os.path.join('/tmp', report_filename)
        
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2)
        
        logger.info(f"Generated error report at: {report_path}")
        return report_path
    
    def _categorize_error(self, error_line):
        """Categorize the error based on keywords"""
        error_line_lower = error_line.lower()
        
        categories = {
            "connection": ["connection", "connect", "refused", "reset", "timeout"],
            "file": ["file", "not found", "permission", "access", "404", "403"],
            "memory": ["memory", "allocation", "overflow", "limit"],
            "config": ["config", "configuration", "syntax", "directive", "invalid"],
            "ssl": ["ssl", "tls", "certificate", "handshake", "protocol"],
            "upstream": ["upstream", "backend", "proxy", "502", "503", "504"]
        }
        
        for category, keywords in categories.items():
            if any(keyword in error_line_lower for keyword in keywords):
                return category.upper()
        
        return "UNKNOWN"
    
    def _determine_severity(self, error_line, analysis):
        """Determine the severity of the error"""
        error_line_lower = error_line.lower()
        
        # High severity indicators
        high_indicators = ["critical", "emergency", "50[0-9]", "timeout", "connection refused", "connection reset"]
        medium_indicators = ["warn", "warning", "40[0-9]", "config", "memory", "limit"]
        
        for indicator in high_indicators:
            if indicator.lower() in error_line_lower or indicator.lower() in analysis.lower():
                return "HIGH"
        
        for indicator in medium_indicators:
            if indicator.lower() in error_line_lower or indicator.lower() in analysis.lower():
                return "MEDIUM"
        
        return "LOW"
    
    def _extract_suggested_fixes(self, analysis):
        """Extract suggested fixes from the analysis"""
        # This would normally use more sophisticated NLP to extract fixes
        # For now, we'll look for common fix patterns in the analysis
        import re
        
        fixes = []
        sentences = re.split(r'[.!?]+', analysis)
        
        for sentence in sentences:
            sentence_lower = sentence.lower()
            if any(word in sentence_lower for word in ["fix", "solution", "try", "recommend", "should"]):
                fix = sentence.strip()
                if fix and fix not in fixes:
                    fixes.append(fix)
        
        return fixes
    
    def _send_report_via_ssh(self, report_path):
        """Send the report to the remote server via SSH"""
        ssh = None
        sftp = None
        
        try:
            # Validate that the report file exists
            if not os.path.exists(report_path):
                logger.error(f"Report file does not exist: {report_path}")
                return
            
            # Establish SSH connection
            ssh = paramiko.SSHClient()
            ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            
            # Load private key
            private_key = paramiko.RSAKey.from_private_key_file(config['SSH_KEY_PATH'])
            
            # Connect to remote server
            logger.info(f"Connecting to SSH server at {config['SSH_HOST']}:{config['SSH_PORT']}...")
            ssh.connect(
                hostname=config['SSH_HOST'],
                port=config['SSH_PORT'],
                username=config['SSH_USER'],
                pkey=private_key,
                timeout=10
            )
            logger.info("SSH connection established successfully.")
            
            # Create SFTP client for file transfer
            sftp = ssh.open_sftp()
            
            # Ensure the destination directory exists
            self._ensure_remote_directory(ssh, config['SSH_DEST_PATH'])
            
            # Extract filename from path
            filename = os.path.basename(report_path)
            remote_path = os.path.join(config['SSH_DEST_PATH'], filename).replace('\\', '/')
            
            # Upload the report file
            logger.info(f"Uploading report to: {remote_path}")
            sftp.put(report_path, remote_path)
            logger.info(f"Report uploaded successfully to: {remote_path}")
            
            # Execute the remote command to trigger the coder model
            command = f"/root/develop/zerodolg.ru/zerodolg-astro/scripts/error_reports_handler.sh '{remote_path}'"
            
            logger.info(f"Executing remote command: {command}")
            stdin, stdout, stderr = ssh.exec_command(command, timeout=300)  # 5 minute timeout
            
            # Wait for command to complete and get output
            stdout_output = stdout.read().decode()
            stderr_output = stderr.read().decode()
            
            if stderr_output:
                logger.error(f"Remote command error: {stderr_output}")
            else:
                logger.info(f"Remote command executed successfully: {stdout_output[:500]}...")  # Log first 500 chars
            
            # Close SFTP connection
            sftp.close()
            sftp = None
            
            # Close SSH connection
            ssh.close()
            ssh = None
            
            # Remove the temporary report file after successful upload
            os.remove(report_path)
            logger.info(f"Temporary report file removed: {report_path}")
        
        except FileNotFoundError:
            logger.error(f"SSH private key not found at: {config['SSH_KEY_PATH']}")
        except paramiko.AuthenticationException:
            logger.error("SSH authentication failed. Please check your SSH key and credentials.")
        except paramiko.SSHException as e:
            logger.error(f"SSH connection error: {e}")
        except Exception as e:
            logger.error(f"Error sending report via SSH: {e}")
        finally:
            # Ensure connections are closed in case of exception
            if sftp:
                sftp.close()
            if ssh:
                ssh.close()
    
    def _ensure_remote_directory(self, ssh, remote_path):
        """Ensure that the remote directory exists"""
        try:
            # Try to create the directory recursively
            dirs = remote_path.strip('/').split('/')
            current_dir = '/'
            
            for directory in dirs:
                if directory:
                    current_dir = f"{current_dir}{directory}"
                    # Try to create the directory
                    stdin, stdout, stderr = ssh.exec_command(f"mkdir -p '{current_dir}'")
                    stderr_output = stderr.read().decode()
                    if stderr_output and "File exists" not in stderr_output:
                        logger.warning(f"Error creating directory {current_dir}: {stderr_output}")
                    current_dir += "/"
        except Exception as e:
            logger.error(f"Error ensuring remote directory exists: {e}")

def main():
    """Main function to start the nginx log monitor"""
    logger.info("Starting Nginx Log Monitor...")
    
    # Validate configuration
    if config['SSH_HOST'] == 'YOUR_LOCAL_COMPUTER_IP':
        logger.error("ERROR: SSH_HOST is not configured. Please update config.env with your local computer's IP address.")
        return
    
    if not os.path.exists(config['NGINX_LOG_PATH']):
        logger.error(f"ERROR: Nginx log file does not exist at: {config['NGINX_LOG_PATH']}")
        return
    
    if not os.path.exists(config['SSH_KEY_PATH']):
        logger.error(f"ERROR: SSH private key does not exist at: {config['SSH_KEY_PATH']}")
        return
    
    # Create the log handler
    event_handler = NginxLogHandler(config['NGINX_LOG_PATH'])
    
    # Watch the directory containing the log file
    observer = Observer()
    log_dir = os.path.dirname(config['NGINX_LOG_PATH'])
    observer.schedule(event_handler, log_dir, recursive=False)
    
    # Start the observer
    observer.start()
    logger.info(f"Monitoring nginx log file: {config['NGINX_LOG_PATH']}")
    
    try:
        while True:
            time.sleep(config['ERROR_POLL_INTERVAL'])
    except KeyboardInterrupt:
        logger.info("Stopping Nginx Log Monitor...")
        observer.stop()
    
    observer.join()


if __name__ == "__main__":
    main()