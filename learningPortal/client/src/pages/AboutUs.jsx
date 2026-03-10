import React from 'react';
import '../styles/AboutUs.css';

const AboutUs = () => {
    // Footer is now handled by MainLayout with page-specific logic
    return (
        <div className="about-us-container">
            <section className="about-hero">
                <h1 className="section-title">About the Institute</h1>
                <p className="about-intro">
                    Parashari Indian Institute of Astrology and Research Centre is a premier institution
                    dedicated to the profound study and research of Vedic Astrology. Our mission is to
                    preserve and disseminate the ancient wisdom of Parashari astrology through modern
                    education and research.
                </p>
            </section>

            <div className="about-grid">
                <section className="about-mission">
                    <h2 className="subsection-title">Our Mission</h2>
                    <p>
                        To empower individuals with the authentic knowledge of astrology, enabling them
                        to understand life's cycles and make informed decisions. We strive to provide
                        comprehensive, high-quality education that bridges tradition and modernity.
                    </p>
                </section>

                <section className="about-contact">
                    <h2 className="subsection-title">Contact Details</h2>
                    <ul className="contact-list">
                        <li>
                            <strong>Email:</strong> support@astrobharat.com
                        </li>
                        <li>
                            <strong>Location:</strong> India
                        </li>
                        <li>
                            <strong>Social:</strong>
                            <div className="social-links">
                                <a href="#">Facebook</a>
                                <a href="#">Twitter</a>
                                <a href="#">YouTube</a>
                            </div>
                        </li>
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default AboutUs;
