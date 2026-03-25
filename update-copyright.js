const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    let count = 0;
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (!fullPath.includes('node_modules')) {
                count += processDir(fullPath);
            }
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            // Match both "&copy;" and "©" variations, with or without "All rights reserved."
            let updated = content.replace(
                /(&copy;|©)\s*2024 Parashari Institute\.(\s*All rights reserved\.)?/gi,
                '$1 2024 Parashari Institute. All Rights Reserved.'
            );
            if (content !== updated) {
                fs.writeFileSync(fullPath, updated, 'utf8');
                console.log(`Updated: ${file}`);
                count++;
            }
        }
    }
    return count;
}

const targetDir = path.join(__dirname, 'AB_AI');
const total = processDir(targetDir);
console.log(`\nUpdated ${total} files.`);
