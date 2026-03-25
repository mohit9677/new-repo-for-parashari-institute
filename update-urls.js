const fs = require('fs');
const path = require('path');

// Map of data-category values to the tab IDs
const categoryToTab = {
  'Diploma': 'diploma',
  'Bachelor': 'bachelors',
  'Master': 'masters',
  'Grand Master': 'grand-master'
};

// 1. Update courses.html
const coursesFile = path.join(__dirname, 'AB_AI/courses.html');
let coursesHtml = fs.readFileSync(coursesFile, 'utf8');

const cardRegex = /data-category="([^"]+)"((?:(?!data-category=").)*?)<a href="([^"]+)" class="learn-more">/gis;

let updatedCount = 0;
let updatedCoursesHtml = coursesHtml.replace(cardRegex, (match, category, middle, href) => {
  const tabId = categoryToTab[category];
  if (tabId) {
    // Remove existing query string if any
    const baseUrl = href.split('?')[0];
    const newHref = `${baseUrl}?level=${tabId}`;
    updatedCount++;
    return `data-category="${category}"${middle}<a href="${newHref}" class="learn-more">`;
  }
  return match;
});

fs.writeFileSync(coursesFile, updatedCoursesHtml);
console.log(`Updated ${updatedCount} URLs in courses.html`);

// 2. Add URL parameter handling to individual course pages
const targetDir = path.join(__dirname, 'AB_AI');
const files = fs.readdirSync(targetDir).filter(f => f.endsWith('.html') && f !== 'courses.html');

let scriptUpdatedCount = 0;
const paramLogic = `
    <!-- AUTO-SELECT TAB JS -->
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            const urlParams = new URLSearchParams(window.location.search);
            const levelParam = urlParams.get('level');
            if (levelParam) {
                setTimeout(() => {
                    const targetTab = document.querySelector(\`.filter-tab[data-program="\${levelParam}"]\`);
                    if (targetTab) {
                        targetTab.click();
                        const section = targetTab.closest('.category-filter-container');
                        window.scrollTo({ top: section ? section.getBoundingClientRect().top + window.scrollY - 100 : 0, behavior: 'smooth' });
                    }
                }, 50);
            }
        });
    </script>
`;

for (const file of files) {
  const filePath = path.join(targetDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Check if it has the PROGRAM TABS JS
  if (content.includes("const tabs = document.querySelectorAll('.filter-tab[data-program]');")) {
    
    // Inject our new script block right before the closing body tag or after the existing script
    if (!content.includes("AUTO-SELECT TAB JS")) {
      
      const updatedContent = content.replace('</body>', paramLogic + '\n</body>');
      
      if (updatedContent !== content) {
        fs.writeFileSync(filePath, updatedContent);
        scriptUpdatedCount++;
      }
    }
  }
}

console.log(`Updated scripts in ${scriptUpdatedCount} course pages`);
