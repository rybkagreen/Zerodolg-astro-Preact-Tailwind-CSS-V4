// scripts/project-analyzer.js
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class ProjectAnalyzer {
  constructor(projectRoot = path.join(__dirname, '..')) {
    this.projectRoot = projectRoot;
    this.srcPath = path.join(projectRoot, 'src');
    this.analysis = {
      timestamp: new Date().toISOString(),
      projectInfo: {},
      structure: {
        folders: {},
        depth: 0,
      },
      dependencies: {},
      codeMetrics: {
        fileTypes: {},
        totalFiles: 0,
        totalLines: 0,
        componentCount: 0,
        testCoverage: null,
      },
      configs: {},
      performance: {},
      seo: {},
      security: {},
      quality: {},
    };
  }

  async analyzeProject() {
    console.log('🔍 Начинаем анализ проекта ZeroDolg...\n');
    console.log(`📁 Корневая директория: ${this.projectRoot}\n`);

    try {
      await this.collectProjectInfo();
      await this.analyzeFolderStructure();
      await this.analyzeDependencies();
      await this.analyzeCodeMetrics();
      await this.analyzeConfigFiles();
      await this.analyzePerformanceConfigs();
      await this.analyzeSEOReadiness();
      await this.analyzeSecurityAspects();
      await this.analyzeCodeQuality();

      await this.generateReport();
      console.log(
        '\n✅ Анализ завершен! Отчет сохранен в project-analysis.json и project-analysis.md'
      );
    } catch (error) {
      console.error('❌ Ошибка при анализе проекта:', error);
    }
  }

  async collectProjectInfo() {
    console.log('📦 Анализ информации о проекте...');
    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    try {
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
      this.analysis.projectInfo = {
        name: packageJson.name,
        version: packageJson.version,
        description: packageJson.description,
        framework: this.detectFramework(packageJson),
        scripts: Object.keys(packageJson.scripts || {}),
        engines: packageJson.engines,
        repository: packageJson.repository,
        author: packageJson.author,
        license: packageJson.license,
      };
    } catch (error) {
      console.warn('⚠️  package.json не найден или содержит ошибки');
    }
  }

  detectFramework(packageJson) {
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    const frameworks = [];

    if (deps.astro) frameworks.push(`Astro ${deps.astro}`);
    if (deps.preact) frameworks.push(`Preact ${deps.preact}`);
    if (deps.react) frameworks.push(`React ${deps.react}`);
    if (deps.next) frameworks.push(`Next.js ${deps.next}`);
    if (deps.vue) frameworks.push(`Vue ${deps.vue}`);

    return frameworks.length > 0 ? frameworks.join(', ') : 'Не определен';
  }

  async analyzeFolderStructure() {
    console.log('📂 Анализ структуры проекта...');
    try {
      const structure = await this.scanDirectory(this.srcPath, 0, 3);
      this.analysis.structure = {
        folders: structure,
        depth: this.calculateMaxDepth(structure),
        totalFolders: await this.countDirectories(this.srcPath),
      };
    } catch (error) {
      this.analysis.structure = { error: error.message };
    }
  }

  async scanDirectory(dirPath, currentDepth = 0, maxDepth = 3) {
    if (currentDepth >= maxDepth) return { truncated: true };

    const structure = {};
    try {
      const items = await fs.readdir(dirPath);

      for (const item of items) {
        // Пропускаем системные папки
        if (item.startsWith('.') || item === 'node_modules' || item === 'dist') continue;

        const fullPath = path.join(dirPath, item);
        const stat = await fs.stat(fullPath);

        if (stat.isDirectory()) {
          structure[item] = {
            type: 'folder',
            children: await this.scanDirectory(fullPath, currentDepth + 1, maxDepth),
            fileCount: await this.countFiles(fullPath),
          };
        } else {
          const ext = path.extname(item);
          if (!structure._files) structure._files = [];
          structure._files.push({
            name: item,
            extension: ext,
            size: stat.size,
          });
        }
      }
    } catch (error) {
      return { error: error.message };
    }

    return structure;
  }

  calculateMaxDepth(obj, currentDepth = 0) {
    if (typeof obj !== 'object' || obj === null) return currentDepth;

    let maxDepth = currentDepth;
    for (const key in obj) {
      if (key !== '_files' && typeof obj[key] === 'object') {
        const depth = this.calculateMaxDepth(obj[key].children || obj[key], currentDepth + 1);
        maxDepth = Math.max(maxDepth, depth);
      }
    }
    return maxDepth;
  }

  async countFiles(dirPath) {
    let count = 0;
    try {
      const items = await fs.readdir(dirPath);
      for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const stat = await fs.stat(fullPath);
        if (stat.isFile()) count++;
      }
    } catch (error) {
      // Игнорируем ошибки подсчета
    }
    return count;
  }

  async countDirectories(dirPath) {
    let count = 0;
    try {
      const items = await fs.readdir(dirPath);
      for (const item of items) {
        if (item.startsWith('.') || item === 'node_modules') continue;
        const fullPath = path.join(dirPath, item);
        const stat = await fs.stat(fullPath);
        if (stat.isDirectory()) {
          count++;
          count += await this.countDirectories(fullPath);
        }
      }
    } catch (error) {
      // Игнорируем ошибки
    }
    return count;
  }

  async analyzeDependencies() {
    console.log('📦 Анализ зависимостей...');
    try {
      const packageJsonPath = path.join(this.projectRoot, 'package.json');
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

      const deps = packageJson.dependencies || {};
      const devDeps = packageJson.devDependencies || {};

      // Категоризация зависимостей
      const categories = {
        framework: [],
        ui: [],
        testing: [],
        build: [],
        linting: [],
        utilities: [],
        other: [],
      };

      // Анализ production зависимостей
      for (const [name, version] of Object.entries(deps)) {
        if (name.includes('astro') || name.includes('preact') || name.includes('react')) {
          categories.framework.push({ name, version, type: 'production' });
        } else {
          categories.other.push({ name, version, type: 'production' });
        }
      }

      // Анализ dev зависимостей
      for (const [name, version] of Object.entries(devDeps)) {
        if (name.includes('test') || name.includes('jest') || name.includes('vitest')) {
          categories.testing.push({ name, version, type: 'dev' });
        } else if (name.includes('eslint') || name.includes('prettier') || name.includes('lint')) {
          categories.linting.push({ name, version, type: 'dev' });
        } else if (
          name.includes('vite') ||
          name.includes('rollup') ||
          name.includes('webpack') ||
          name.includes('build')
        ) {
          categories.build.push({ name, version, type: 'dev' });
        } else if (name.includes('tailwind') || name.includes('css') || name.includes('style')) {
          categories.ui.push({ name, version, type: 'dev' });
        } else {
          categories.utilities.push({ name, version, type: 'dev' });
        }
      }

      // Попытка получить размер node_modules (Windows-совместимо)
      let nodeModulesSize = 'unknown';
      try {
        const nodeModulesPath = path.join(this.projectRoot, 'node_modules');
        const stat = await fs.stat(nodeModulesPath);
        if (stat.isDirectory()) {
          nodeModulesSize = await this.getDirectorySize(nodeModulesPath);
        }
      } catch (error) {
        // Игнорируем ошибки
      }

      this.analysis.dependencies = {
        totalCount: Object.keys(deps).length + Object.keys(devDeps).length,
        production: Object.keys(deps).length,
        dev: Object.keys(devDeps).length,
        categories,
        nodeModulesSize,
        outdated: [], // Можно добавить проверку устаревших пакетов
        vulnerabilities: [], // Можно добавить проверку уязвимостей
      };
    } catch (error) {
      this.analysis.dependencies = { error: error.message };
    }
  }

  async getDirectorySize(dirPath) {
    let totalSize = 0;
    try {
      const items = await fs.readdir(dirPath);
      for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const stat = await fs.stat(fullPath);
        if (stat.isFile()) {
          totalSize += stat.size;
        } else if (stat.isDirectory() && !item.startsWith('.')) {
          // Рекурсивно для небольших директорий
          if (items.length < 100) {
            // Ограничиваем рекурсию
            totalSize += await this.getDirectorySize(fullPath);
          }
        }
      }
    } catch (error) {
      // Игнорируем ошибки
    }

    // Форматируем размер
    const units = ['B', 'KB', 'MB', 'GB'];
    let unitIndex = 0;
    let size = totalSize;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }

  async analyzeCodeMetrics() {
    console.log('📊 Анализ метрик кода...');
    try {
      const fileTypes = {
        astro: [],
        typescript: [],
        javascript: [],
        css: [],
        scss: [],
        json: [],
        markdown: [],
        other: [],
      };

      // Сканируем src директорию
      await this.scanForFiles(this.srcPath, fileTypes);

      // Подсчет компонентов
      const componentCount =
        fileTypes.astro.length + fileTypes.typescript.filter((f) => f.includes('.tsx')).length;

      // Подсчет строк кода
      let totalLines = 0;
      const fileGroups = [
        ...fileTypes.astro,
        ...fileTypes.typescript,
        ...fileTypes.javascript,
        ...fileTypes.css,
        ...fileTypes.scss,
      ];

      for (const filePath of fileGroups) {
        try {
          const content = await fs.readFile(filePath, 'utf-8');
          totalLines += content.split('\n').length;
        } catch (error) {
          // Игнорируем ошибки чтения файла
        }
      }

      // Анализ тестов
      const testFiles = fileTypes.typescript.filter(
        (f) => f.includes('.test.') || f.includes('.spec.') || f.includes('__tests__')
      );

      this.analysis.codeMetrics = {
        fileTypes: {
          astro: fileTypes.astro.length,
          typescript: fileTypes.typescript.length,
          javascript: fileTypes.javascript.length,
          css: fileTypes.css.length,
          scss: fileTypes.scss.length,
          json: fileTypes.json.length,
          markdown: fileTypes.markdown.length,
          other: fileTypes.other.length,
          total: Object.values(fileTypes).reduce((sum, arr) => sum + arr.length, 0),
        },
        totalLines,
        componentCount,
        testFiles: testFiles.length,
        averageLinesPerFile: fileGroups.length > 0 ? Math.round(totalLines / fileGroups.length) : 0,
        analysisDate: new Date().toISOString(),
      };
    } catch (error) {
      this.analysis.codeMetrics = { error: error.message };
    }
  }

  async scanForFiles(dirPath, fileTypes) {
    try {
      const items = await fs.readdir(dirPath);

      for (const item of items) {
        if (item.startsWith('.') || item === 'node_modules' || item === 'dist') continue;

        const fullPath = path.join(dirPath, item);
        const stat = await fs.stat(fullPath);

        if (stat.isDirectory()) {
          await this.scanForFiles(fullPath, fileTypes);
        } else {
          const ext = path.extname(item).toLowerCase();
          switch (ext) {
            case '.astro':
              fileTypes.astro.push(fullPath);
              break;
            case '.ts':
            case '.tsx':
              fileTypes.typescript.push(fullPath);
              break;
            case '.js':
            case '.jsx':
            case '.mjs':
            case '.cjs':
              fileTypes.javascript.push(fullPath);
              break;
            case '.css':
              fileTypes.css.push(fullPath);
              break;
            case '.scss':
            case '.sass':
              fileTypes.scss.push(fullPath);
              break;
            case '.json':
              fileTypes.json.push(fullPath);
              break;
            case '.md':
            case '.mdx':
              fileTypes.markdown.push(fullPath);
              break;
            default:
              fileTypes.other.push(fullPath);
          }
        }
      }
    } catch (error) {
      // Игнорируем ошибки сканирования
    }
  }

  async analyzeConfigFiles() {
    console.log('⚙️  Анализ конфигурационных файлов...');
    const configFiles = [
      'tsconfig.json',
      'astro.config.mjs',
      'astro.config.prod.mjs',
      'tailwind.config.js',
      'postcss.config.js',
      'eslint.config.js',
      '.eslintrc.js',
      '.prettierrc',
      'jest.config.cjs',
      'vite.config.js',
      '.env',
      '.env.example',
      '.gitignore',
      'package.json',
    ];

    for (const configFile of configFiles) {
      try {
        const configPath = path.join(this.projectRoot, configFile);
        const exists = await this.fileExists(configPath);

        if (exists) {
          const stat = await fs.stat(configPath);
          const content = await fs.readFile(configPath, 'utf-8');

          this.analysis.configs[configFile] = {
            exists: true,
            size: stat.size,
            lines: content.split('\n').length,
            lastModified: stat.mtime.toISOString(),
            validJson: configFile.endsWith('.json') ? this.isValidJson(content) : null,
          };

          // Специфичный анализ для определенных конфигов
          if (configFile === 'tsconfig.json' && this.isValidJson(content)) {
            const tsconfig = JSON.parse(content);
            this.analysis.configs[configFile].strict = tsconfig.compilerOptions?.strict || false;
            this.analysis.configs[configFile].target =
              tsconfig.compilerOptions?.target || 'unknown';
          }
        } else {
          this.analysis.configs[configFile] = { exists: false };
        }
      } catch (error) {
        this.analysis.configs[configFile] = { error: error.message };
      }
    }
  }

  async analyzePerformanceConfigs() {
    console.log('⚡ Анализ настроек производительности...');
    this.analysis.performance = {
      bundleOptimization: false,
      imageOptimization: false,
      codeSpitting: false,
      minification: false,
      compression: false,
      caching: false,
    };

    // Проверяем astro.config.mjs
    try {
      const astroConfigPath = path.join(this.projectRoot, 'astro.config.mjs');
      if (await this.fileExists(astroConfigPath)) {
        const content = await fs.readFile(astroConfigPath, 'utf-8');

        this.analysis.performance.bundleOptimization = content.includes('build:');
        this.analysis.performance.imageOptimization =
          content.includes('image:') || content.includes('sharp');
        this.analysis.performance.codeSpitting = content.includes('manualChunks');
        this.analysis.performance.minification =
          content.includes('minify') || content.includes('terser');
        this.analysis.performance.compression = content.includes('compress');
      }
    } catch (error) {
      // Игнорируем ошибки
    }
  }

  async analyzeSEOReadiness() {
    console.log('🔍 Анализ SEO готовности...');
    this.analysis.seo = {
      sitemap: false,
      robots: false,
      metaTags: false,
      structuredData: false,
      canonicalUrls: false,
      openGraph: false,
    };

    // Проверка наличия SEO пакетов
    try {
      const packageJsonPath = path.join(this.projectRoot, 'package.json');
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

      this.analysis.seo.sitemap = '@astrojs/sitemap' in deps;
      this.analysis.seo.robots = 'astro-robots-txt' in deps;

      // Проверка файлов robots.txt и sitemap.xml в public
      const publicPath = path.join(this.projectRoot, 'public');
      if (await this.fileExists(path.join(publicPath, 'robots.txt'))) {
        this.analysis.seo.robots = true;
      }
      if (await this.fileExists(path.join(publicPath, 'sitemap.xml'))) {
        this.analysis.seo.sitemap = true;
      }
    } catch (error) {
      // Игнорируем ошибки
    }
  }

  async analyzeSecurityAspects() {
    console.log('🔒 Анализ аспектов безопасности...');
    this.analysis.security = {
      envVarsProtected: false,
      dependencyAudit: false,
      contentSecurityPolicy: false,
      httpsRedirect: false,
      sensitiveDataExposure: [],
    };

    // Проверка .env файлов
    try {
      if (await this.fileExists(path.join(this.projectRoot, '.env'))) {
        // Проверяем, что .env в .gitignore
        const gitignorePath = path.join(this.projectRoot, '.gitignore');
        if (await this.fileExists(gitignorePath)) {
          const gitignore = await fs.readFile(gitignorePath, 'utf-8');
          this.analysis.security.envVarsProtected = gitignore.includes('.env');
        }
      }

      // Проверка на наличие потенциально чувствительных данных
      const srcFiles = await this.getAllFiles(this.srcPath, [
        '.ts',
        '.tsx',
        '.js',
        '.jsx',
        '.astro',
      ]);
      for (const file of srcFiles) {
        const content = await fs.readFile(file, 'utf-8');
        if (
          content.match(/api[_-]?key/i) ||
          content.match(/secret/i) ||
          content.match(/password/i) ||
          content.match(/token/i)
        ) {
          this.analysis.security.sensitiveDataExposure.push(path.relative(this.projectRoot, file));
        }
      }
    } catch (error) {
      // Игнорируем ошибки
    }
  }

  async analyzeCodeQuality() {
    console.log('✅ Анализ качества кода...');
    this.analysis.quality = {
      linting: false,
      formatting: false,
      typeChecking: false,
      testing: false,
      preCommitHooks: false,
      documentation: 0,
      codeComments: 0,
    };

    // Проверка наличия инструментов качества кода
    try {
      const packageJsonPath = path.join(this.projectRoot, 'package.json');
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      const scripts = packageJson.scripts || {};

      this.analysis.quality.linting = 'eslint' in deps || 'lint' in scripts;
      this.analysis.quality.formatting = 'prettier' in deps || 'format' in scripts;
      this.analysis.quality.typeChecking = 'typescript' in deps && 'type-check' in scripts;
      this.analysis.quality.testing = 'jest' in deps || 'vitest' in deps || 'test' in scripts;
      this.analysis.quality.preCommitHooks = 'husky' in deps || 'lint-staged' in deps;

      // Подсчет документации и комментариев
      const srcFiles = await this.getAllFiles(this.srcPath, [
        '.ts',
        '.tsx',
        '.js',
        '.jsx',
        '.astro',
      ]);
      let totalComments = 0;
      let totalDocs = 0;

      for (const file of srcFiles) {
        const content = await fs.readFile(file, 'utf-8');
        const comments = content.match(/\/\/.+|\/\*[\s\S]*?\*\//g) || [];
        const docs = content.match(/\/\*\*[\s\S]*?\*\//g) || [];
        totalComments += comments.length;
        totalDocs += docs.length;
      }

      this.analysis.quality.codeComments = totalComments;
      this.analysis.quality.documentation = totalDocs;
    } catch (error) {
      // Игнорируем ошибки
    }
  }

  async getAllFiles(dirPath, extensions = []) {
    const files = [];

    async function scan(dir) {
      try {
        const items = await fs.readdir(dir);
        for (const item of items) {
          if (item.startsWith('.') || item === 'node_modules' || item === 'dist') continue;

          const fullPath = path.join(dir, item);
          const stat = await fs.stat(fullPath);

          if (stat.isDirectory()) {
            await scan(fullPath);
          } else if (extensions.length === 0 || extensions.some((ext) => item.endsWith(ext))) {
            files.push(fullPath);
          }
        }
      } catch (error) {
        // Игнорируем ошибки
      }
    }

    await scan(dirPath);
    return files;
  }

  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  isValidJson(content) {
    try {
      JSON.parse(content);
      return true;
    } catch {
      return false;
    }
  }

  async generateReport() {
    const report = {
      ...this.analysis,
      recommendations: this.generateRecommendations(),
      score: this.calculateProjectScore(),
    };

    // Сохранение JSON отчета
    await fs.writeFile(
      path.join(this.projectRoot, 'project-analysis.json'),
      JSON.stringify(report, null, 2)
    );

    // Генерация Markdown отчета
    await this.generateMarkdownReport(report);

    // Вывод краткой сводки в консоль
    this.printSummary(report);
  }

  generateRecommendations() {
    const recs = {
      critical: [],
      high: [],
      medium: [],
      low: [],
    };

    // Критические рекомендации
    if (!this.analysis.configs['tsconfig.json']?.strict) {
      recs.critical.push('🔴 TypeScript не в строгом режиме. Критически важно для качества кода.');
    }
    if (this.analysis.security.sensitiveDataExposure.length > 0) {
      recs.critical.push(
        `🔴 Обнаружены потенциально чувствительные данные в ${this.analysis.security.sensitiveDataExposure.length} файлах.`
      );
    }

    // Высокий приоритет
    if (!this.analysis.seo.sitemap) {
      recs.high.push('🟠 Отсутствует sitemap. Критично для SEO.');
    }
    if (!this.analysis.quality.testing) {
      recs.high.push('🟠 Отсутствует тестирование. Рекомендуется добавить Jest или Vitest.');
    }
    if (this.analysis.dependencies.totalCount > 100) {
      recs.high.push('🟠 Слишком много зависимостей (>100). Требуется аудит.');
    }

    // Средний приоритет
    if (!this.analysis.performance.imageOptimization) {
      recs.medium.push('🟡 Не настроена оптимизация изображений.');
    }
    if (!this.analysis.quality.preCommitHooks) {
      recs.medium.push('🟡 Отсутствуют pre-commit хуки. Добавьте Husky + lint-staged.');
    }
    if (this.analysis.structure.depth > 5) {
      recs.medium.push('🟡 Слишком глубокая вложенность папок. Рассмотрите упрощение структуры.');
    }

    // Низкий приоритет
    if (!this.analysis.quality.formatting) {
      recs.low.push('🟢 Добавьте Prettier для единообразного форматирования.');
    }
    if (this.analysis.codeMetrics.averageLinesPerFile > 300) {
      recs.low.push('🟢 Некоторые файлы слишком большие. Рассмотрите разделение.');
    }

    return recs;
  }

  calculateProjectScore() {
    let score = 100;
    const penalties = {
      noTypeScript: -15,
      noStrictMode: -10,
      noTesting: -10,
      noLinting: -5,
      noDocs: -5,
      noSEO: -10,
      poorStructure: -5,
      tooManyDeps: -5,
      noSecurity: -10,
    };

    // TypeScript проверки
    if (this.analysis.codeMetrics.fileTypes.typescript === 0) score += penalties.noTypeScript;
    if (!this.analysis.configs['tsconfig.json']?.strict) score += penalties.noStrictMode;

    // Качество кода
    if (!this.analysis.quality.testing) score += penalties.noTesting;
    if (!this.analysis.quality.linting) score += penalties.noLinting;
    if (this.analysis.quality.documentation === 0) score += penalties.noDocs;

    // SEO
    if (!this.analysis.seo.sitemap && !this.analysis.seo.robots) score += penalties.noSEO;

    // Структура
    if (this.analysis.structure.depth > 5) score += penalties.poorStructure;
    if (this.analysis.dependencies.totalCount > 100) score += penalties.tooManyDeps;

    // Безопасность
    if (!this.analysis.security.envVarsProtected) score += penalties.noSecurity;

    return Math.max(0, Math.min(100, score));
  }

  async generateMarkdownReport(report) {
    const markdown = `# 📊 Анализ проекта ${report.projectInfo.name || 'ZeroDolg'}

_Дата анализа: ${new Date(report.timestamp).toLocaleString('ru-RU')}_

## 🎯 Общая оценка проекта: ${report.score}/100

${this.getScoreEmoji(report.score)} ${this.getScoreDescription(report.score)}

## 📋 Основная информация

- **Название**: ${report.projectInfo.name || 'Не указано'}
- **Версия**: ${report.projectInfo.version || 'Не указана'}
- **Фреймворк**: ${report.projectInfo.framework}
- **Лицензия**: ${report.projectInfo.license || 'Не указана'}

## 📁 Структура проекта

- **Глубина вложенности**: ${report.structure.depth} уровней
- **Всего папок**: ${report.structure.totalFolders || 0}

### Распределение файлов по типам:
| Тип файла | Количество |
|-----------|------------|
| Astro | ${report.codeMetrics.fileTypes.astro} |
| TypeScript | ${report.codeMetrics.fileTypes.typescript} |
| JavaScript | ${report.codeMetrics.fileTypes.javascript} |
| CSS | ${report.codeMetrics.fileTypes.css} |
| SCSS | ${report.codeMetrics.fileTypes.scss} |
| JSON | ${report.codeMetrics.fileTypes.json} |
| Markdown | ${report.codeMetrics.fileTypes.markdown} |
| **Всего** | **${report.codeMetrics.fileTypes.total}** |

## 📊 Метрики кода

- **Общее количество строк**: ${report.codeMetrics.totalLines.toLocaleString('ru-RU')}
- **Среднее строк на файл**: ${report.codeMetrics.averageLinesPerFile}
- **Количество компонентов**: ${report.codeMetrics.componentCount}
- **Тестовые файлы**: ${report.codeMetrics.testFiles}

## 📦 Зависимости

- **Production**: ${report.dependencies.production}
- **Dev**: ${report.dependencies.dev}
- **Всего**: ${report.dependencies.totalCount}
- **Размер node_modules**: ${report.dependencies.nodeModulesSize}

### Категории зависимостей:
- Framework: ${report.dependencies.categories?.framework?.length || 0}
- UI/Стили: ${report.dependencies.categories?.ui?.length || 0}
- Тестирование: ${report.dependencies.categories?.testing?.length || 0}
- Сборка: ${report.dependencies.categories?.build?.length || 0}
- Линтинг: ${report.dependencies.categories?.linting?.length || 0}

## ⚡ Производительность

${this.generateCheckList(report.performance, {
  bundleOptimization: 'Оптимизация бандла',
  imageOptimization: 'Оптимизация изображений',
  codeSpitting: 'Code splitting',
  minification: 'Минификация',
  compression: 'Сжатие',
  caching: 'Кеширование',
})}

## 🔍 SEO готовность

${this.generateCheckList(report.seo, {
  sitemap: 'Sitemap',
  robots: 'Robots.txt',
  metaTags: 'Meta теги',
  structuredData: 'Структурированные данные',
  canonicalUrls: 'Canonical URLs',
  openGraph: 'Open Graph',
})}

## 🔒 Безопасность

${this.generateCheckList(report.security, {
  envVarsProtected: '.env в .gitignore',
  dependencyAudit: 'Аудит зависимостей',
  contentSecurityPolicy: 'CSP заголовки',
  httpsRedirect: 'HTTPS перенаправление',
})}

${
  report.security.sensitiveDataExposure?.length > 0
    ? `
### ⚠️ Потенциальные утечки данных:
${report.security.sensitiveDataExposure.map((file) => `- ${file}`).join('\n')}
`
    : ''
}

## ✅ Качество кода

${this.generateCheckList(report.quality, {
  linting: 'ESLint',
  formatting: 'Prettier',
  typeChecking: 'TypeScript проверка типов',
  testing: 'Тестирование',
  preCommitHooks: 'Pre-commit хуки',
})}

- **Комментарии в коде**: ${report.quality.codeComments}
- **JSDoc документация**: ${report.quality.documentation}

## 💡 Рекомендации

${this.formatRecommendations(report.recommendations)}

## 📈 План действий

1. **Немедленно исправить** критические проблемы
2. **В течение недели** решить проблемы высокого приоритета
3. **В течение месяца** внедрить рекомендации среднего приоритета
4. **При возможности** улучшить аспекты низкого приоритета

---

_Сгенерировано автоматически анализатором проекта_
`;

    await fs.writeFile(path.join(this.projectRoot, 'project-analysis.md'), markdown);
  }

  getScoreEmoji(score) {
    if (score >= 90) return '🏆';
    if (score >= 75) return '✨';
    if (score >= 60) return '👍';
    if (score >= 40) return '⚠️';
    return '🚨';
  }

  getScoreDescription(score) {
    if (score >= 90) return 'Отличное состояние проекта!';
    if (score >= 75) return 'Хорошее состояние, есть что улучшить';
    if (score >= 60) return 'Удовлетворительно, требуются улучшения';
    if (score >= 40) return 'Требуется серьезный рефакторинг';
    return 'Критическое состояние, необходима полная оптимизация';
  }

  generateCheckList(obj, labels) {
    return Object.entries(labels)
      .map(([key, label]) => `- ${obj[key] ? '✅' : '❌'} ${label}`)
      .join('\n');
  }

  formatRecommendations(recs) {
    let output = '';

    if (recs.critical?.length > 0) {
      output += `### 🔴 Критические (немедленно):\n${recs.critical.map((r) => `- ${r}`).join('\n')}\n\n`;
    }
    if (recs.high?.length > 0) {
      output += `### 🟠 Высокий приоритет:\n${recs.high.map((r) => `- ${r}`).join('\n')}\n\n`;
    }
    if (recs.medium?.length > 0) {
      output += `### 🟡 Средний приоритет:\n${recs.medium.map((r) => `- ${r}`).join('\n')}\n\n`;
    }
    if (recs.low?.length > 0) {
      output += `### 🟢 Низкий приоритет:\n${recs.low.map((r) => `- ${r}`).join('\n')}\n\n`;
    }

    return output || 'Проект в хорошем состоянии!';
  }

  printSummary(report) {
    console.log('\n' + '='.repeat(60));
    console.log(
      `📊 АНАЛИЗ ПРОЕКТА ${report.projectInfo.name?.toUpperCase() || 'ZERODOLG'} ЗАВЕРШЕН`
    );
    console.log('='.repeat(60));

    console.log(`\n🎯 Общая оценка: ${report.score}/100 ${this.getScoreEmoji(report.score)}`);
    console.log(`   ${this.getScoreDescription(report.score)}`);

    console.log(`\n📋 Основные метрики:`);
    console.log(`   Название: ${report.projectInfo.name || 'Не указано'}`);
    console.log(`   Версия: ${report.projectInfo.version || 'Не указана'}`);
    console.log(`   Фреймворк: ${report.projectInfo.framework}`);

    console.log(`\n📁 Файлы проекта:`);
    console.log(`   Astro: ${report.codeMetrics.fileTypes?.astro || 0}`);
    console.log(`   TypeScript: ${report.codeMetrics.fileTypes?.typescript || 0}`);
    console.log(
      `   CSS/SCSS: ${(report.codeMetrics.fileTypes?.css || 0) + (report.codeMetrics.fileTypes?.scss || 0)}`
    );
    console.log(`   Всего файлов: ${report.codeMetrics.fileTypes?.total || 0}`);
    console.log(
      `   Всего строк кода: ${report.codeMetrics.totalLines?.toLocaleString('ru-RU') || 0}`
    );

    console.log(`\n📦 Зависимости:`);
    console.log(`   Production: ${report.dependencies.production || 0}`);
    console.log(`   Dev: ${report.dependencies.dev || 0}`);
    console.log(`   Всего: ${report.dependencies.totalCount || 0}`);

    // Показываем критические рекомендации
    if (report.recommendations.critical?.length > 0) {
      console.log(`\n🚨 КРИТИЧЕСКИЕ ПРОБЛЕМЫ:`);
      report.recommendations.critical.forEach((rec) => console.log(`   ${rec}`));
    }

    if (report.recommendations.high?.length > 0) {
      console.log(`\n⚠️  Проблемы высокого приоритета:`);
      report.recommendations.high.forEach((rec) => console.log(`   ${rec}`));
    }

    console.log('\n' + '='.repeat(60));
    console.log('📄 Подробные отчеты сохранены:');
    console.log('   • project-analysis.json (полные данные)');
    console.log('   • project-analysis.md (читаемый отчет)');
    console.log('='.repeat(60));
  }
}

// Запуск анализатора
console.log('🚀 Запуск анализатора проекта ZeroDolg...\n');
const analyzer = new ProjectAnalyzer();
await analyzer.analyzeProject();
