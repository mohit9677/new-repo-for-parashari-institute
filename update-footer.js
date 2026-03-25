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
            // the text could be "Designed by <a href="#">Our Team</a>"
            let updated = content.replace(/Designed by\s*<a[^>]*>Our Team<\/a>/ig, 'Designed By <a href="#">Parashari Developers</a>');
            if (content !== updated) {
                fs.writeFileSync(fullPath, updated, 'utf8');
                console.log(`Updated ${file}`);
                count++;
            }
        }
    }
    return count;
}

const targetDir = path.join(__dirname, 'AB_AI');
console.log(`Scanning for HTML files in ${targetDir}...`);
const total = processDir(targetDir);
console.log(`Replaced text in ${total} files.`);
