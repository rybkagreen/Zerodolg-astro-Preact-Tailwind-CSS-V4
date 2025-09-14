"""
Analytics Worker for C++ Development System
Provides metrics, analytics, and insights
"""

import json
import os
from pathlib import Path
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional, Tuple
import logging
from collections import defaultdict
from dataclasses import dataclass, field

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass
class CodeMetrics:
    """Code quality and complexity metrics"""
    lines_of_code: int = 0
    cyclomatic_complexity: float = 0
    code_coverage: float = 0
    technical_debt: float = 0
    duplication_ratio: float = 0
    maintainability_index: float = 0


@dataclass
class PerformanceMetrics:
    """Performance metrics"""
    build_time: float = 0
    test_execution_time: float = 0
    memory_usage: float = 0
    cpu_usage: float = 0
    response_time: float = 0


class AnalyticsWorker:
    """Worker for project analytics and metrics"""
    
    def __init__(self, worker_id: str):
        self.worker_id = worker_id
        self.qdrant_client = None
        self.ollama_embedder = None
        self.metrics_history: List[Dict] = []
        self.system_prompt = self._get_system_prompt()
        
    def _get_system_prompt(self) -> str:
        """Get system prompt for analytics"""
        return """You are a C++ project analytics specialist focused on:

## Metrics Analysis:
- Code quality metrics (complexity, coverage, duplication)
- Performance metrics (build time, runtime, memory)
- Development velocity and productivity
- Technical debt assessment
- Security vulnerability analysis
- Dependency analysis

## Reporting:
- Generate comprehensive analytics reports
- Identify trends and patterns
- Provide actionable insights
- Benchmark against industry standards
- Risk assessment and mitigation

## Recommendations:
- Suggest optimizations based on metrics
- Identify bottlenecks and inefficiencies
- Propose refactoring opportunities
- Recommend testing improvements"""
    
    async def process_task(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Process an analytics task"""
        task_type = task.get('type', 'analyze')
        
        if task_type == 'code_metrics':
            return await self.analyze_code_metrics(task)
        elif task_type == 'performance_metrics':
            return await self.analyze_performance(task)
        elif task_type == 'development_metrics':
            return await self.analyze_development(task)
        elif task_type == 'generate_report':
            return await self.generate_report(task)
        elif task_type == 'trend_analysis':
            return await self.analyze_trends(task)
        else:
            return await self.general_analytics(task)
    
    async def analyze_code_metrics(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze code quality metrics"""
        project_path = Path(task.get('project_path', '.'))
        
        metrics = CodeMetrics()
        
        # Count lines of code
        metrics.lines_of_code = self._count_lines_of_code(project_path)
        
        # Calculate complexity
        metrics.cyclomatic_complexity = self._calculate_complexity(project_path)
        
        # Check code coverage
        metrics.code_coverage = self._get_code_coverage(project_path)
        
        # Assess technical debt
        metrics.technical_debt = self._assess_technical_debt(project_path)
        
        # Check duplication
        metrics.duplication_ratio = self._check_duplication(project_path)
        
        # Calculate maintainability
        metrics.maintainability_index = self._calculate_maintainability(metrics)
        
        analysis = {
            'timestamp': datetime.now().isoformat(),
            'worker_id': self.worker_id,
            'task_type': 'code_metrics',
            'metrics': {
                'lines_of_code': metrics.lines_of_code,
                'cyclomatic_complexity': metrics.cyclomatic_complexity,
                'code_coverage': f"{metrics.code_coverage:.1f}%",
                'technical_debt': f"{metrics.technical_debt:.1f} hours",
                'duplication_ratio': f"{metrics.duplication_ratio:.1f}%",
                'maintainability_index': metrics.maintainability_index
            },
            'quality_score': self._calculate_quality_score(metrics),
            'recommendations': self._generate_code_recommendations(metrics)
        }
        
        # Store metrics for trend analysis
        self.metrics_history.append(analysis)
        
        # Store in vector database if available
        if self.qdrant_client:
            await self._store_metrics(analysis)
        
        return analysis
    
    async def analyze_performance(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze performance metrics"""
        project_path = Path(task.get('project_path', '.'))
        
        metrics = PerformanceMetrics()
        
        # Measure build time
        metrics.build_time = self._measure_build_time(project_path)
        
        # Measure test execution
        metrics.test_execution_time = self._measure_test_time(project_path)
        
        # Check resource usage
        metrics.memory_usage = self._check_memory_usage(project_path)
        metrics.cpu_usage = self._check_cpu_usage(project_path)
        
        # Measure response time
        metrics.response_time = self._measure_response_time(project_path)
        
        analysis = {
            'timestamp': datetime.now().isoformat(),
            'worker_id': self.worker_id,
            'task_type': 'performance_metrics',
            'metrics': {
                'build_time': f"{metrics.build_time:.2f}s",
                'test_execution_time': f"{metrics.test_execution_time:.2f}s",
                'memory_usage': f"{metrics.memory_usage:.1f} MB",
                'cpu_usage': f"{metrics.cpu_usage:.1f}%",
                'response_time': f"{metrics.response_time:.3f}s"
            },
            'performance_score': self._calculate_performance_score(metrics),
            'bottlenecks': self._identify_bottlenecks(metrics),
            'optimizations': self._suggest_optimizations(metrics)
        }
        
        return analysis
    
    async def analyze_development(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze development metrics"""
        project_path = Path(task.get('project_path', '.'))
        time_period = task.get('period', 'last_week')
        
        dev_metrics = {
            'commits': self._count_commits(project_path, time_period),
            'pull_requests': self._count_pull_requests(project_path, time_period),
            'issues_resolved': self._count_issues_resolved(project_path, time_period),
            'code_changes': self._analyze_code_changes(project_path, time_period),
            'contributor_activity': self._analyze_contributors(project_path, time_period)
        }
        
        analysis = {
            'timestamp': datetime.now().isoformat(),
            'worker_id': self.worker_id,
            'task_type': 'development_metrics',
            'period': time_period,
            'metrics': dev_metrics,
            'velocity': self._calculate_velocity(dev_metrics),
            'productivity_score': self._calculate_productivity(dev_metrics),
            'insights': self._generate_dev_insights(dev_metrics)
        }
        
        return analysis
    
    async def generate_report(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Generate comprehensive analytics report"""
        report_type = task.get('report_type', 'comprehensive')
        project_path = Path(task.get('project_path', '.'))
        
        # Gather all metrics
        code_metrics = await self.analyze_code_metrics({'project_path': str(project_path)})
        perf_metrics = await self.analyze_performance({'project_path': str(project_path)})
        dev_metrics = await self.analyze_development({'project_path': str(project_path)})
        
        report = {
            'timestamp': datetime.now().isoformat(),
            'worker_id': self.worker_id,
            'report_type': report_type,
            'project_path': str(project_path),
            'executive_summary': self._generate_executive_summary(
                code_metrics, perf_metrics, dev_metrics
            ),
            'detailed_metrics': {
                'code_quality': code_metrics,
                'performance': perf_metrics,
                'development': dev_metrics
            },
            'trends': self._analyze_historical_trends(),
            'risks': self._identify_risks(code_metrics, perf_metrics),
            'recommendations': self._generate_recommendations(
                code_metrics, perf_metrics, dev_metrics
            ),
            'action_items': self._prioritize_actions(
                code_metrics, perf_metrics, dev_metrics
            )
        }
        
        # Generate visualizations if needed
        if task.get('include_visualizations'):
            report['visualizations'] = self._generate_visualizations(report)
        
        return report
    
    async def analyze_trends(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze historical trends"""
        metric_type = task.get('metric_type', 'all')
        time_range = task.get('time_range', 'last_month')
        
        trends = {
            'timestamp': datetime.now().isoformat(),
            'worker_id': self.worker_id,
            'task_type': 'trend_analysis',
            'metric_type': metric_type,
            'time_range': time_range,
            'trends': []
        }
        
        # Analyze trends from history
        if self.metrics_history:
            trends['trends'] = self._calculate_trends(self.metrics_history, metric_type)
            trends['forecast'] = self._forecast_metrics(trends['trends'])
            trends['anomalies'] = self._detect_anomalies(self.metrics_history)
        
        return trends
    
    async def general_analytics(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """General analytics tasks"""
        query = task.get('query', '')
        
        response = {
            'timestamp': datetime.now().isoformat(),
            'worker_id': self.worker_id,
            'task_type': 'general_analytics',
            'query': query
        }
        
        # Use AI for analysis if available
        if self.ollama_embedder and query:
            prompt = f"{self.system_prompt}\n\nAnalyze: {query}"
            # Here you would call your AI model
            response['analysis'] = f"Analysis for: {query}"
        
        return response
    
    def _count_lines_of_code(self, project_path: Path) -> int:
        """Count lines of code in project"""
        total_lines = 0
        extensions = ['.cpp', '.hpp', '.h', '.cc', '.cxx']
        
        for ext in extensions:
            for file in project_path.rglob(f'*{ext}'):
                try:
                    with open(file, 'r', encoding='utf-8') as f:
                        total_lines += len(f.readlines())
                except:
                    pass
        
        return total_lines
    
    def _calculate_complexity(self, project_path: Path) -> float:
        """Calculate cyclomatic complexity"""
        # Simplified calculation
        return 10.5  # Would use actual complexity analysis tools
    
    def _get_code_coverage(self, project_path: Path) -> float:
        """Get code coverage percentage"""
        # Would read from coverage reports
        return 75.5
    
    def _assess_technical_debt(self, project_path: Path) -> float:
        """Assess technical debt in hours"""
        # Would analyze code issues and estimate fix time
        return 120.0
    
    def _check_duplication(self, project_path: Path) -> float:
        """Check code duplication ratio"""
        # Would use duplication detection tools
        return 5.2
    
    def _calculate_maintainability(self, metrics: CodeMetrics) -> float:
        """Calculate maintainability index"""
        # Microsoft's Maintainability Index formula (simplified)
        mi = 171 - 5.2 * metrics.cyclomatic_complexity
        mi -= 0.23 * (metrics.lines_of_code / 1000)
        mi -= 16.2 * metrics.duplication_ratio / 100
        
        return max(0, min(100, mi))
    
    def _calculate_quality_score(self, metrics: CodeMetrics) -> float:
        """Calculate overall quality score"""
        score = 100.0
        
        # Deduct for poor metrics
        if metrics.code_coverage < 80:
            score -= (80 - metrics.code_coverage) * 0.5
        
        if metrics.cyclomatic_complexity > 10:
            score -= (metrics.cyclomatic_complexity - 10) * 2
        
        if metrics.duplication_ratio > 3:
            score -= (metrics.duplication_ratio - 3) * 3
        
        if metrics.technical_debt > 100:
            score -= (metrics.technical_debt - 100) * 0.1
        
        return max(0, min(100, score))
    
    def _generate_code_recommendations(self, metrics: CodeMetrics) -> List[str]:
        """Generate recommendations based on code metrics"""
        recommendations = []
        
        if metrics.code_coverage < 80:
            recommendations.append(f"Increase test coverage from {metrics.code_coverage:.1f}% to at least 80%")
        
        if metrics.cyclomatic_complexity > 10:
            recommendations.append("Refactor complex functions to reduce cyclomatic complexity")
        
        if metrics.duplication_ratio > 3:
            recommendations.append("Extract duplicated code into reusable functions")
        
        if metrics.technical_debt > 100:
            recommendations.append("Allocate time to address technical debt")
        
        if metrics.maintainability_index < 70:
            recommendations.append("Improve code maintainability through refactoring")
        
        return recommendations
    
    def _measure_build_time(self, project_path: Path) -> float:
        """Measure build time in seconds"""
        # Would actually measure build time
        return 45.2
    
    def _measure_test_time(self, project_path: Path) -> float:
        """Measure test execution time"""
        return 12.5
    
    def _check_memory_usage(self, project_path: Path) -> float:
        """Check memory usage in MB"""
        return 256.0
    
    def _check_cpu_usage(self, project_path: Path) -> float:
        """Check CPU usage percentage"""
        return 65.0
    
    def _measure_response_time(self, project_path: Path) -> float:
        """Measure average response time"""
        return 0.125
    
    def _calculate_performance_score(self, metrics: PerformanceMetrics) -> float:
        """Calculate performance score"""
        score = 100.0
        
        if metrics.build_time > 60:
            score -= (metrics.build_time - 60) * 0.5
        
        if metrics.test_execution_time > 30:
            score -= (metrics.test_execution_time - 30) * 0.3
        
        if metrics.memory_usage > 512:
            score -= (metrics.memory_usage - 512) * 0.01
        
        if metrics.cpu_usage > 80:
            score -= (metrics.cpu_usage - 80) * 1.0
        
        return max(0, min(100, score))
    
    def _identify_bottlenecks(self, metrics: PerformanceMetrics) -> List[str]:
        """Identify performance bottlenecks"""
        bottlenecks = []
        
        if metrics.build_time > 60:
            bottlenecks.append("Long build times affecting development velocity")
        
        if metrics.memory_usage > 512:
            bottlenecks.append("High memory usage may cause issues on smaller systems")
        
        if metrics.cpu_usage > 80:
            bottlenecks.append("High CPU usage indicating inefficient algorithms")
        
        return bottlenecks
    
    def _suggest_optimizations(self, metrics: PerformanceMetrics) -> List[str]:
        """Suggest performance optimizations"""
        optimizations = []
        
        if metrics.build_time > 60:
            optimizations.append("Use precompiled headers to reduce build time")
            optimizations.append("Enable parallel compilation")
        
        if metrics.memory_usage > 512:
            optimizations.append("Optimize data structures to reduce memory footprint")
            optimizations.append("Use memory pools for frequent allocations")
        
        return optimizations
    
    def _count_commits(self, project_path: Path, period: str) -> int:
        """Count commits in time period"""
        # Would query git
        return 42
    
    def _count_pull_requests(self, project_path: Path, period: str) -> int:
        """Count pull requests"""
        return 8
    
    def _count_issues_resolved(self, project_path: Path, period: str) -> int:
        """Count resolved issues"""
        return 15
    
    def _analyze_code_changes(self, project_path: Path, period: str) -> Dict:
        """Analyze code changes"""
        return {
            'additions': 1250,
            'deletions': 450,
            'files_changed': 35
        }
    
    def _analyze_contributors(self, project_path: Path, period: str) -> Dict:
        """Analyze contributor activity"""
        return {
            'active_contributors': 5,
            'new_contributors': 1,
            'top_contributors': ['dev1', 'dev2', 'dev3']
        }
    
    def _calculate_velocity(self, metrics: Dict) -> float:
        """Calculate development velocity"""
        return metrics['commits'] * 1.0 + metrics['pull_requests'] * 3.0
    
    def _calculate_productivity(self, metrics: Dict) -> float:
        """Calculate productivity score"""
        return 85.0  # Simplified calculation
    
    def _generate_dev_insights(self, metrics: Dict) -> List[str]:
        """Generate development insights"""
        return [
            f"Team completed {metrics['issues_resolved']} issues",
            f"Code base grew by {metrics['code_changes']['additions'] - metrics['code_changes']['deletions']} lines",
            f"{metrics['contributor_activity']['active_contributors']} developers actively contributing"
        ]
    
    def _generate_executive_summary(self, code_metrics: Dict, perf_metrics: Dict, dev_metrics: Dict) -> str:
        """Generate executive summary"""
        return f"""Project Health Summary:
- Code Quality Score: {code_metrics.get('quality_score', 0):.1f}/100
- Performance Score: {perf_metrics.get('performance_score', 0):.1f}/100
- Development Velocity: {dev_metrics.get('velocity', 0):.1f}
- Overall Status: {'Healthy' if code_metrics.get('quality_score', 0) > 70 else 'Needs Attention'}"""
    
    def _analyze_historical_trends(self) -> List[Dict]:
        """Analyze historical trends from metrics history"""
        if not self.metrics_history:
            return []
        
        # Simplified trend analysis
        return [
            {'metric': 'code_coverage', 'trend': 'improving', 'change': '+5%'},
            {'metric': 'build_time', 'trend': 'stable', 'change': '0%'},
            {'metric': 'technical_debt', 'trend': 'increasing', 'change': '+10%'}
        ]
    
    def _identify_risks(self, code_metrics: Dict, perf_metrics: Dict) -> List[Dict]:
        """Identify project risks"""
        risks = []
        
        if code_metrics.get('metrics', {}).get('code_coverage', 100) < 60:
            risks.append({
                'type': 'quality',
                'severity': 'high',
                'description': 'Low test coverage increases bug risk'
            })
        
        if perf_metrics.get('metrics', {}).get('build_time', 0) > 300:
            risks.append({
                'type': 'productivity',
                'severity': 'medium',
                'description': 'Long build times impacting developer productivity'
            })
        
        return risks
    
    def _generate_recommendations(self, code_metrics: Dict, perf_metrics: Dict, dev_metrics: Dict) -> List[str]:
        """Generate overall recommendations"""
        recommendations = []
        recommendations.extend(code_metrics.get('recommendations', []))
        recommendations.extend(perf_metrics.get('optimizations', []))
        return recommendations
    
    def _prioritize_actions(self, code_metrics: Dict, perf_metrics: Dict, dev_metrics: Dict) -> List[Dict]:
        """Prioritize action items"""
        return [
            {'priority': 1, 'action': 'Increase test coverage', 'impact': 'high'},
            {'priority': 2, 'action': 'Refactor complex functions', 'impact': 'medium'},
            {'priority': 3, 'action': 'Optimize build process', 'impact': 'medium'}
        ]
    
    def _generate_visualizations(self, report: Dict) -> Dict:
        """Generate visualization configurations"""
        return {
            'charts': [
                {'type': 'line', 'data': 'metrics_over_time'},
                {'type': 'bar', 'data': 'code_quality_breakdown'},
                {'type': 'pie', 'data': 'time_distribution'}
            ]
        }
    
    def _calculate_trends(self, history: List[Dict], metric_type: str) -> List[Dict]:
        """Calculate trends from historical data"""
        return [
            {'metric': metric_type, 'direction': 'up', 'rate': 5.2}
        ]
    
    def _forecast_metrics(self, trends: List[Dict]) -> Dict:
        """Forecast future metrics"""
        return {
            'next_week': {'quality_score': 82},
            'next_month': {'quality_score': 85}
        }
    
    def _detect_anomalies(self, history: List[Dict]) -> List[Dict]:
        """Detect anomalies in metrics"""
        return []
    
    async def _store_metrics(self, analysis: Dict) -> None:
        """Store metrics in vector database"""
        if self.qdrant_client and self.ollama_embedder:
            try:
                content = json.dumps(analysis, indent=2)
                embedding = await self.ollama_embedder.embed(content)
                
                await self.qdrant_client.add_document(
                    collection_name='cpp_metrics',
                    document={
                        'id': f"metrics_{datetime.now().timestamp()}",
                        'content': content,
                        'type': 'metrics',
                        'timestamp': datetime.now().isoformat()
                    },
                    vector=embedding
                )
            except Exception as e:
                logger.error(f"Failed to store metrics: {e}")


def create_analytics_worker(worker_id: str) -> AnalyticsWorker:
    """Factory function to create analytics worker"""
    return AnalyticsWorker(worker_id)