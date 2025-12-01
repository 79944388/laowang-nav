const fs = require('fs');

const data = JSON.parse(fs.readFileSync('nav_data.json', 'utf8'));

let yaml = 'sections:\n';

data.forEach(category => {
  yaml += `  - name: ${category.name}\n`;
  yaml += '    items:\n';
  category.items.forEach(item => {
    const title = item.title ? item.title.replace(/"/g, '\\"') : '';
    const desc = item.desc ? item.desc.replace(/"/g, '\\"') : '';
    const icon = item.logo_url || item.display_logo || '';
    const url = item.url || '';

    yaml += `      - title: "${title}"\n`;
    if (desc) yaml += `        description: "${desc}"\n`;
    if (icon) yaml += `        icon: "${icon}"\n`;
    yaml += `        url: "${url}"\n`;
  });
});

fs.writeFileSync('sections.yml', yaml);
console.log('Done! Saved to sections.yml');
