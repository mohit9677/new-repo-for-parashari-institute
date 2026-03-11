// premium-stats.js

document.addEventListener("DOMContentLoaded", () => {
    const statsSection = document.querySelector('.premium-stats-section');
    if (!statsSection) return;

    const counters = document.querySelectorAll('.stat-counter');
    const speed = 200; // The lower the slower

    let hasAnimated = false;

    const animateCounters = () => {
        counters.forEach(counter => {
            const animate = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText.replace(/,/g, ''); // Remove commas if any

                // Increment factor
                const inc = target / speed;

                if (count < target) {
                    // Update the counter and format with commas
                    counter.innerText = Math.ceil(count + inc).toLocaleString();
                    setTimeout(animate, 20);
                } else {
                    counter.innerText = target.toLocaleString();
                }
            };

            animate();
        });
    };

    // Intersection Observer to trigger animation when scrolled into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                animateCounters();
                hasAnimated = true; // Only animate once
                observer.unobserve(statsSection);
            }
        });
    }, {
        threshold: 0.3 // Trigger when 30% of the section is visible
    });

    observer.observe(statsSection);
});
