/**
 * Global Search Functionality
 */

(function () {
    // Course Data
    const courses = [
        { title: "Vedic Astrology (Jyotish) (Diploma)", url: "astrology.html", icon: "♈" },
        { title: "Nadi Jyotish", url: "nadi-jyotish.html", icon: "📜" },
        { title: "Lal Kitab (Diploma)", url: "lal-kitab.html", icon: "📕" },
        { title: "Remedy Course (Upaay Gyaan) (Crash Course)", url: "remedy-course.html", icon: "🕉️" },
        { title: "KP Astrology (Krishnamurti Padhdhati) (Diploma)", url: "kp-astrology.html", icon: "⭐" },
        { title: "BNN (Advanced Techniques)", url: "bnn-astrology.html", icon: "🔍" },
        { title: "Crystal Healing (Diploma)", url: "crystal-healing.html", icon: "💎" },
        { title: "Rudraksha (Diploma)", url: "rudraksha.html", icon: "📿" },
        { title: "Medical Astrology (Crash Course)", url: "medical-astrology.html", icon: "⚕️" },
        { title: "Complete Astrology Course", url: "complete-astrology.html", icon: "🎓" },
        { title: "Rudraksha Remedies", url: "rudraksha.html", icon: "📿" },
        { title: "Vastu Shastra (Diploma)", url: "vastu.html", icon: "🏠" },
        { title: "Palmistry (Chirognomy & Chiromancy) (Diploma)", url: "palmistry.html", icon: "✋" },
        { title: "Face Reading (Physiognomy) (Diploma)", url: "face-reading.html", icon: "👤" },
        { title: "Tarot Reading (Diploma)", url: "tarot.html", icon: "🃏" },
        { title: "Numerology (Pythagorean & Chaldean) (Diploma)", url: "numerology.html", icon: "🔢" },
        { title: "Nakshatra (Lunar Mansions) (Diploma)", url: "nakshatra.html", icon: "✨" },
        { title: "1-on-1 Mentorship", url: "mentorship.html", icon: "🤝" },
        // Bachelor Tier
        { title: "Vedic Astrology (Jyotish) (Bachelor)", url: "astrology.html", icon: "♈" },
        { title: "Numerology (Pythagorean & Chaldean) (Bachelor)", url: "numerology.html", icon: "🔢" },
        { title: "KP Astrology (Krishnamurti Padhdhati) (Bachelor)", url: "kp-astrology.html", icon: "⭐" },
        { title: "Gemstone Science (Ratna Vigyan) (Bachelor)", url: "gemstone.html", icon: "💎" },
        { title: "Vastu Shastra (Bachelor)", url: "vastu.html", icon: "🏠" },
        { title: "Lal Kitab (Bachelor)", url: "lal-kitab.html", icon: "📕" },
        { title: "Face Reading (Physiognomy) (Bachelor)", url: "face-reading.html", icon: "👤" },
        { title: "Reiki Healing (Bachelor)", url: "reiki.html", icon: "🙌" },
        { title: "Tarot Reading (Bachelor)", url: "tarot.html", icon: "🃏" },
        { title: "Nakshatra (Lunar Mansions) 1 (Bachelor)", url: "nakshatra.html", icon: "✨" },
        { title: "Crystal Healing (Bachelor)", url: "crystal-healing.html", icon: "🔮" },
        { title: "Rudraksha (Bachelor)", url: "rudraksha.html", icon: "📿" },
        { title: "Palmistry (Chirognomy & Chiromancy) (Bachelor)", url: "palmistry.html", icon: "✋" },
        { title: "Feng Shui (Crash Course)", url: "feng-shui.html", icon: "⛩️" },
        // Master Tier
        { title: "Numerology (Pythagorean & Chaldean) (Master)", url: "numerology.html", icon: "🔢" },
        { title: "Vedic Astrology (Jyotish) (Crash Course)", url: "astrology.html", icon: "♈" },
        { title: "KP Astrology (Krishnamurti Padhdhati) (Master)", url: "kp-astrology.html", icon: "⭐" },
        { title: "Gemstone Science (Ratna Vigyan) (Master)", url: "gemstone.html", icon: "💎" },
        { title: "Vastu Shastra (Master)", url: "vastu.html", icon: "🏠" },
        { title: "Lal Kitab (Master)", url: "lal-kitab.html", icon: "📕" },
        { title: "Face Reading (Physiognomy) (Master)", url: "face-reading.html", icon: "👤" },
        { title: "Reiki Healing (Crash Course)", url: "reiki.html", icon: "🙌" },
        { title: "Tarot Reading (Master)", url: "tarot.html", icon: "🃏" },
        { title: "Nakshatra (Lunar Mansions) (Master)", url: "nakshatra.html", icon: "✨" },
        { title: "Crystal Healing (Master)", url: "crystal-healing.html", icon: "🔮" },
        { title: "Rudraksha (Master)", url: "rudraksha.html", icon: "📿" },
        { title: "Palmistry (Chirognomy & Chiromancy) (Master)", url: "palmistry.html", icon: "✋" },
        { title: "About Us", url: "profile.html", icon: "ℹ️" },
        { title: "Contact", url: "contact.html", icon: "📞" },
        { title: "Gallery", url: "gallery.html", icon: "🖼️" }
    ];

    // Initialize Search
    function initSearch() {
        const searchContainers = document.querySelectorAll('.search-container');

        searchContainers.forEach(container => {
            const searchInput = container.querySelector('input');
            const resultsContainer = container.querySelector('.search-results');

            if (!searchInput || !resultsContainer) return;

            // Event Listeners
            searchInput.addEventListener('input', function (e) {
                const query = e.target.value.toLowerCase().trim();

                if (query.length === 0) {
                    resultsContainer.classList.remove('active');
                    resultsContainer.innerHTML = '';
                    return;
                }

                const filteredCourses = courses.filter(course =>
                    course.title.toLowerCase().includes(query)
                );

                renderResults(filteredCourses, resultsContainer);
            });

            // Close when clicking outside
            document.addEventListener('click', function (e) {
                if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
                    resultsContainer.classList.remove('active');
                }
            });

            // Open when clicking input if there's text
            searchInput.addEventListener('focus', function (e) {
                if (searchInput.value.trim().length > 0) {
                    searchInput.dispatchEvent(new Event('input'));
                }
            });
        });

        function renderResults(results, container) {
            container.innerHTML = '';

            if (results.length === 0) {
                container.innerHTML = '<div class="no-results">No courses found</div>';
            } else {
                results.forEach(course => {
                    const item = document.createElement('a');
                    item.href = course.url;
                    item.className = 'search-result-item';
                    item.innerHTML = `
                        <span class="search-result-icon">${course.icon}</span>
                        <span>${course.title}</span>
                    `;
                    container.appendChild(item);
                });
            }

            container.classList.add('active');
        }
    }

    // Run on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSearch);
    } else {
        initSearch();
    }
})();
