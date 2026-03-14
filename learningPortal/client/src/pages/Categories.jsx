import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AIGuideBot from '../components/AIGuideBot';
import '../styles/Categories.css';

const Categories = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState(null);

    const categories = [
        { id: 'Crash Course',  title: 'Crash Course',  icon: '🔥', desc: 'Start your journey here' },
        { id: 'Diploma',       title: 'Diploma',       icon: '📜', desc: 'Build solid basics' },
        { id: 'Bachelor',      title: 'Bachelor',      icon: '🎓', desc: 'Deep dive into wisdom' },
        { id: 'Master',        title: 'Master',        icon: '🏅', desc: 'Research & Advanced' },
        { id: 'Grand Master',  title: 'Grand Master',  icon: '👑', desc: 'Fast track learning' }
    ];

    const handleCategoryClick = (catId) => {
        navigate('/courses', { state: { category: catId } });
    };

    const handleCategoryHover = (catId) => {
        setActiveCategory(catId);
    };

    const handleCategoryLeave = () => {
        setActiveCategory(null);
    };

    return (
        <div className="categories-page" onClick={handleCategoryLeave}>
            <header className="page-header">
                <h2 className="page-title">Learning Categories</h2>
                <p className="page-subtitle">Select a path to begin your astrological education</p>
            </header>

            <div className="modern-grid-category">
                {categories.map((cat) => (
                    <div
                        key={cat.id}
                        className={`modern-category-card ${activeCategory === cat.id ? 'active' : ''}`}
                        onMouseEnter={() => handleCategoryHover(cat.id)}
                        onMouseLeave={handleCategoryLeave}
                        onClick={() => handleCategoryClick(cat.id)}
                    >
                        <div className="card-icon-wrapper">
                            <span className="card-icon">{cat.icon}</span>
                        </div>
                        <h3 className="card-title">{cat.title}</h3>
                        <p className="card-subtitle">{cat.desc}</p>
                        <div className="card-arrow">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </div>
                    </div>
                ))}
            </div>

            <AIGuideBot
                activeCategory={activeCategory}
                onClose={handleCategoryLeave}
            />
        </div>
    );
};

export default Categories;
