const fs = require('fs');
const path = require('path');

const coursesHtmlPath = path.join(__dirname, 'AB_AI', 'courses.html');
let content = fs.readFileSync(coursesHtmlPath, 'utf8');

// Regex to match the premium-gold-card divs and their inner h3 titles
// We want to capture the data-category value, and then find the <h3 class="card-title"> inside it.

// Split by <div class="premium-gold-card" to process each card individually
const parts = content.split(/(<div[^>]*class="[^"]*premium-gold-card[^"]*"[^>]*>)/i);

let newContent = parts[0];

for (let i = 1; i < parts.length; i += 2) {
    const divTag = parts[i];
    let innerContent = parts[i + 1];
    
    // Extract category
    const categoryMatch = divTag.match(/data-category="([^"]+)"/i);
    const category = categoryMatch ? categoryMatch[1].trim() : '';

    if (category) {
        // Find the h3 tag and append the category
        // e.g. <h3 class="card-title">Title</h3> -> <h3 class="card-title">Title <span style="font-size: 0.85em; color: #D4AF37; display: block; margin-top: 4px;">(Crash Course)</span></h3>
        
        innerContent = innerContent.replace(/(<h3[^>]*class="[^"]*card-title[^"]*"[^>]*>)(.*?)(<\/h3>)/is, (match, openTag, titleText, closeTag) => {
            // Check if it already has the category to avoid duplicates
            if (titleText.includes(`(${category})`)) {
                return match;
            }
            
            // Append the label
            return `${openTag}${titleText.trim()} <span style="font-size: 0.85em; color: #D4AF37; display: block; margin-top: 4px; font-weight: 600;">(${category})</span>${closeTag}`;
        });
    }
    
    newContent += divTag + innerContent;
}

fs.writeFileSync(coursesHtmlPath, newContent, 'utf8');
console.log('Updated courses.html with explicit labels on card titles.');
