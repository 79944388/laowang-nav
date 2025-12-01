const fs = require('fs');

const confPath = 'user-data/conf.yml';
const sectionsPath = 'sections.yml';

const confContent = fs.readFileSync(confPath, 'utf8');
const sectionsContent = fs.readFileSync(sectionsPath, 'utf8');

const header = confContent.split('sections:')[0];
const newConf = header + sectionsContent;

fs.writeFileSync(confPath, newConf);
console.log('Merged conf.yml successfully');
