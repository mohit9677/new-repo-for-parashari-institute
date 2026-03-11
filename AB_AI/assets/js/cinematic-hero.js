// cinematic-hero.js

document.addEventListener("DOMContentLoaded", () => {
    // Find the container where we want the dust particles
    const container = document.querySelector('.about-split-image');
    if (!container) return;

    // We only want particles if it's the cinematic scene
    const isCinematic = container.querySelector('.cinematic-bg');
    if (!isCinematic) return;

    const particleCount = 35; // Number of particles

    function createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('dust-particle');

        // Randomize starting position, size, and animation duration
        const size = Math.random() * 2 + 1; // 1px to 3px
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;

        // Random animation duration between 15s and 30s for slow, elegant floating
        const duration = Math.random() * 15 + 15;
        particle.style.animationDuration = `${duration}s`;

        // Random delay to stagger the spawns, use negative to start immediately
        const delay = Math.random() * 30;
        particle.style.animationDelay = `-${delay}s`;

        container.appendChild(particle);

        // Remove and recreate particle when animation ends to keep DOM clean
        setTimeout(() => {
            particle.remove();
            createParticle();
        }, duration * 1000);
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        createParticle();
    }
});
