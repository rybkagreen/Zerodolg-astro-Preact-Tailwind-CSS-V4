const fs = require('fs');
const path = require('path');

// Directory containing the blog posts
const blogDir = path.join(__dirname, '..', 'src', 'content', 'blog');

// Read all blog posts
const files = fs.readdirSync(blogDir);

files.forEach(file => {
  if (path.extname(file) === '.md') {
    const filePath = path.join(blogDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Extract title, description and keywords from the content
    const titleMatch = content.match(/^# (.+)$/m);
    const descriptionMatch = content.match(/\*\*Метаописание:\*\* (.+)$/m);
    const keywordsMatch = content.match(/\*\*Ключевые слова:\*\* (.+)$/m);
    
    const title = titleMatch ? titleMatch[1].trim() : 'Без названия';
    const description = descriptionMatch ? descriptionMatch[1].trim() : '';
    const keywords = keywordsMatch ? keywordsMatch[1].trim() : '';
    
    // Convert keywords to tags array
    const tags = keywords.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    
    // Create frontmatter
    let frontmatterLines = [
      '---',
      `title: "${title}"`,
      `description: "${description}"`,
      'pubDate: 2024-01-01'
    ];
    
    // Only add tags if there are any
    if (tags.length > 0) {
      frontmatterLines.push('tags:');
      tags.forEach(tag => frontmatterLines.push(`  - ${tag}`));
    }
    
    frontmatterLines.push('---');
    
    const frontmatter = frontmatterLines.join('\n');
    
    // Remove the old header lines
    content = content.replace(/^# .+$/m, '');
    content = content.replace(/^\*\*Метаописание:\*\* .+$/m, '');
    content = content.replace(/^\*\*Ключевые слова:\*\* .+$/m, '');
    content = content.replace(/^\s*---\s*$/m, '');
    
    // Add new frontmatter
    content = frontmatter + '\n' + content;
    
    // Write back to file
    fs.writeFileSync(filePath, content, 'utf8');
    
    console.log(`Processed ${file}`);
  }
});

console.log('All blog posts have been converted to the correct format.');