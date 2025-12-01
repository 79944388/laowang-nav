const fs = require('fs');
const yaml = require('js-yaml'); // Need to install js-yaml or use simple parsing if structure is simple.
// Since I can't easily install packages, I'll use a simple regex/string manipulation approach or a basic parser if available.
// Actually, I can try to require 'js-yaml' if it's in the environment, but it's safer to assume standard node libs.
// However, parsing YAML with regex is error-prone.
// Let's check if I can use the existing `sections.yml` approach or if I need a better parser.
// The previous step used `JSON.parse` because I fetched JSON. Here I have YAML.
// I will try to use a simple YAML parser implementation since I cannot rely on external deps.

// Simple YAML parser for this specific structure (arrays of objects)
function parseSections(content) {
  const lines = content.split('\n');
  const sections = [];
  let currentSection = null;
  let currentItem = null;
  let inPageInfo = false;
  let inAppConfig = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith('#')) continue;
    if (!trimmed) continue;

    // Detect root keys
    if (line.match(/^pageInfo:/)) { inPageInfo = true; inAppConfig = false; continue; }
    if (line.match(/^appConfig:/)) { inAppConfig = true; inPageInfo = false; continue; }
    if (line.match(/^sections:/)) { inPageInfo = false; inAppConfig = false; continue; }

    if (inPageInfo || inAppConfig) continue;

    // Section start
    if (line.match(/^\s{2}-\s+name:/)) {
      const name = line.match(/^\s{2}-\s+name:\s+(.*)/)[1].trim();
      currentSection = { name, items: [] };
      sections.push(currentSection);
      currentItem = null;
      continue;
    }

    // Item start
    if (line.match(/^\s{6}-\s+title:/)) {
      const title = line.match(/^\s{6}-\s+title:\s+(.*)/)[1].trim().replace(/^['"]|['"]$/g, '');
      currentItem = { title };
      if (currentSection) currentSection.items.push(currentItem);
      continue;
    }

    // Item properties
    if (currentItem) {
      if (line.match(/^\s{8}description:/)) {
        const desc = line.match(/^\s{8}description:\s+(.*)/)[1].trim().replace(/^['"]|['"]$/g, '');
        currentItem.description = desc;
      } else if (line.match(/^\s{8}icon:/)) {
        const icon = line.match(/^\s{8}icon:\s+(.*)/)[1].trim().replace(/^['"]|['"]$/g, '');
        currentItem.icon = icon;
      } else if (line.match(/^\s{8}url:/)) {
        const url = line.match(/^\s{8}url:\s+(.*)/)[1].trim().replace(/^['"]|['"]$/g, '');
        currentItem.url = url;
      }
    }
  }
  return sections;
}

// Helper to generate YAML string
function generateYaml(sections) {
  let output = 'sections:\n';
  sections.forEach(section => {
    output += `  - name: ${section.name}\n`;
    if (section.icon) output += `    icon: ${section.icon}\n`; // Preserve section icon if I had it, but simple parser didn't capture it.
    // Wait, simple parser missed section icon. Let's fix that if needed, but for now items are key.
    // Actually, I should capture section icon too.
    output += '    items:\n';
    section.items.forEach(item => {
      const title = item.title.replace(/"/g, '\\"');
      output += `      - title: "${title}"\n`;
      if (item.description) output += `        description: "${item.description.replace(/"/g, '\\"')}"\n`;
      if (item.icon) output += `        icon: "${item.icon}"\n`;
      if (item.url) output += `        url: "${item.url}"\n`;
    });
  });
  return output;
}

// Better parser that captures section icon
function parseSectionsBetter(content) {
  const lines = content.split('\n');
  const sections = [];
  let currentSection = null;
  let currentItem = null;
  let inSections = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // const trimmed = line.trim(); // Don't trim yet, indentation matters

    if (line.startsWith('sections:')) {
      inSections = true;
      continue;
    }

    if (!inSections) continue;
    if (line.trim().startsWith('#')) continue;

    // Section start: "  - name: ..."
    if (line.match(/^ {2}- name:/)) {
      const name = line.match(/^ {2}- name:\s+(.*)/)[1].trim();
      currentSection = { name, items: [] };
      sections.push(currentSection);
      currentItem = null;
      continue;
    }

    // Section icon: "    icon: ..." (4 spaces)
    if (currentSection && !currentItem && line.match(/^ {4}icon:/)) {
      const icon = line.match(/^ {4}icon:\s+(.*)/)[1].trim();
      currentSection.icon = icon;
      continue;
    }

    // Item start: "      - title: ..." (6 spaces)
    if (line.match(/^ {6}- title:/)) {
      const titleMatch = line.match(/^ {6}- title:\s+(.*)/);
      const title = titleMatch ? titleMatch[1].trim().replace(/^['"]|['"]$/g, '') : '';
      currentItem = { title };
      if (currentSection) currentSection.items.push(currentItem);
      continue;
    }

    // Item properties (8 spaces)
    if (currentItem) {
      if (line.match(/^ {8}description:/)) {
        const descMatch = line.match(/^ {8}description:\s+(.*)/);
        if (descMatch) currentItem.description = descMatch[1].trim().replace(/^['"]|['"]$/g, '');
      } else if (line.match(/^ {8}icon:/)) {
        const iconMatch = line.match(/^ {8}icon:\s+(.*)/);
        if (iconMatch) currentItem.icon = iconMatch[1].trim().replace(/^['"]|['"]$/g, '');
      } else if (line.match(/^ {8}url:/)) {
        const urlMatch = line.match(/^ {8}url:\s+(.*)/);
        if (urlMatch) currentItem.url = urlMatch[1].trim().replace(/^['"]|['"]$/g, '');
      }
    }
  }
  return sections;
}

const confPath = 'user-data/conf.yml';
const keji8Path = 'keji8_conf.yml';

const confContent = fs.readFileSync(confPath, 'utf8');
const keji8Content = fs.readFileSync(keji8Path, 'utf8');

const targetSections = parseSectionsBetter(confContent);
const sourceSections = parseSectionsBetter(keji8Content);

// 1. Handle "状态监控" (Status Monitoring)
const statusSectionName = '状态监控';
const sourceStatusSection = sourceSections.find(s => s.name === statusSectionName);

if (sourceStatusSection) {
  const targetStatusIndex = targetSections.findIndex(s => s.name === statusSectionName);
  if (targetStatusIndex !== -1) {
    // Replace existing
    targetSections[targetStatusIndex] = sourceStatusSection;
  } else {
    // Add new at the beginning (or end? User said "copy to DEMO", usually implies appending or prominent placement. Let's put it at the top as requested in the screenshot it was top left)
    // Actually, let's put it as the first section.
    targetSections.unshift(sourceStatusSection);
  }
}

// 2. Handle other sections
const allTargetUrls = new Set();
targetSections.forEach(s => {
  s.items.forEach(i => {
    if (i.url) allTargetUrls.add(i.url.replace(/\/$/, '')); // Normalize URL by removing trailing slash
  });
});

sourceSections.forEach(sourceSection => {
  if (sourceSection.name === statusSectionName) return; // Already handled

  // Find or create target section
  let targetSection = targetSections.find(s => s.name === sourceSection.name);
  if (!targetSection) {
    targetSection = { name: sourceSection.name, icon: sourceSection.icon, items: [] };
    targetSections.push(targetSection);
  }

  sourceSection.items.forEach(item => {
    if (!item.url) return;
    const normalizedUrl = item.url.replace(/\/$/, '');

    if (!allTargetUrls.has(normalizedUrl)) {
      // Add item
      targetSection.items.push(item);
      allTargetUrls.add(normalizedUrl);
    }
  });
});

// 3. Generate new YAML
const header = confContent.split('sections:')[0];
const newSectionsYaml = generateYaml(targetSections);
const newConf = header + newSectionsYaml;

fs.writeFileSync(confPath, newConf);
console.log('Merged keji8 content successfully');
