const fs = require('fs');
const path = require('path');

const coursesHtmlPath = path.join(__dirname, 'AB_AI', 'courses.html');
let content = fs.readFileSync(coursesHtmlPath, 'utf8');

const categoryMap = {
    'Crash Course': { color: '#4CAF50', text: 'Crash Course · Beginner' },
    'Diploma': { color: '#2196F3', text: 'Diploma · Popular' },
    'Bachelor': { color: '#9C27B0', text: 'Bachelor · Advanced' },
    'Master': { color: '#E91E63', text: 'Master · Expert' },
    'Grand Master': { color: '#F44336', text: 'Grand Master · Elite' },
    '6 Stairs': { color: '#FF9800', text: '6 Stairs · Special' },
    '1-On-1 Mentorship': { color: '#009688', text: '1-on-1 Mentorship · Personal' },
    '1-on-1 Mentorship': { color: '#009688', text: '1-on-1 Mentorship · Personal' }
};

// Revert h3 tags
// Match: <span style="font-size: 0.85em; color: #D4AF37; display: block; margin-top: 4px; font-weight: 600;">(Crash Course)</span>
content = content.replace(/ \n*<span style="font-size: 0\.85em; color: #D4AF37; display: block; margin-top: 4px; font-weight: 600;">\([^<]+\)<\/span>/gi, '');
content = content.replace(/ <span style="font-size: 0\.85em; color: #D4AF37; display: block; margin-top: 4px; font-weight: 600;">\([^<]+\)<\/span>/gi, '');

// Process each premium-gold-card
const parts = content.split(/(<div[^>]*class="[^"]*premium-gold-card[^"]*"[^>]*>)/i);
let newContent = parts[0];

for (let i = 1; i < parts.length; i += 2) {
    const divTag = parts[i];
    let innerContent = parts[i + 1];
    
    // Extract category
    const categoryMatch = divTag.match(/data-category="([^"]+)"/i);
    const category = categoryMatch ? categoryMatch[1].trim() : '';

    if (category) {
        const catInfo = categoryMap[category] || { color: '#795548', text: category }; // Default brown
        
        // Update the category-badge
        // It looks like: <span class="category-badge" style="background:#4CAF50">Crash Course &middot; Beginner</span>
        innerContent = innerContent.replace(
            /(<span[^>]*class="[^"]*category-badge[^"]*"[^>]*>)(.*?)(<\/span>)/is,
            (match, openTag, text, closeTag) => {
                return `<span class="category-badge" style="background:${catInfo.color}">${catInfo.text}${closeTag}`;
            }
        );
    }
    
    newContent += divTag + innerContent;
}

fs.writeFileSync(coursesHtmlPath, newContent, 'utf8');
console.log('Successfully reverted title change and updated category badges.');
