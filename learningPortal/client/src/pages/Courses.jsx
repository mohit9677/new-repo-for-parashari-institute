import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import '../styles/Courses.css';

const Courses = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');

    const titleMap = {
        'beginner': 'Beginner',
        'foundation': 'Foundation',
        'master': 'Master',
        'phd': 'PhD',
        'crash-course': 'Crash Course'
    };

    useEffect(() => {
        const catId = location.state?.category || searchParams.get('category');
        if (catId) {
            setSelectedCategory(titleMap[catId.toLowerCase()] || catId || 'All');
        }
    }, [location.state, searchParams]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/courses`);
                if (response.ok) {
                    const data = await response.json();
                    const raw = data.courses || [];
                    const seen = new Set();
                    const unique = raw.filter(c => {
                        const key = c.title?.toLowerCase();
                        if (seen.has(key)) return false;
                        seen.add(key);
                        return true;
                    });
                    setCourses(unique);
                }
            } catch (error) {
                console.error("Error fetching courses", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const filteredCourses = useMemo(() => {
        if (selectedCategory === 'All') return courses;
        return courses.filter(course =>
            course.level?.toLowerCase() === selectedCategory.toLowerCase()
        );
    }, [courses, selectedCategory]);

    return (
        <div className="courses-page">
            <header className="page-header">
                <h2 className="page-title">{selectedCategory === 'All' ? 'All Courses' : `${selectedCategory} Courses`}</h2>
                <p className="page-subtitle">Master ancient wisdom with our certified Vedic programs</p>
            </header>

            {loading ? (
                <Loader />
            ) : filteredCourses.length > 0 ? (
                <div className="modern-grid-courses">
                    {filteredCourses.map(course => (
                        <div key={course._id} className="modern-course-card">
                            <div className="card-top">
                                <div className="premium-ribbon">PREMIUM</div>
                                {course.thumbnail ? (
                                    <img src={course.thumbnail} alt={course.title} className="course-banner" />
                                ) : (
                                    <div className="banner-placeholder">{course.title}</div>
                                )}
                            </div>

                            <div className="card-middle">
                                <h3 className="course-title">{course.title}</h3>
                                <p className="course-desc">
                                    Enroll in the {course.title} program to master the concepts and gain deep insights.
                                </p>
                                <div className="course-tags">
                                    <span className="tag-level">{course.level}</span>
                                    <span className="tag-cert">✓ Certification</span>
                                </div>
                            </div>

                            <div className="card-price-section">
                                {course.price > 0 || !course.isFree ? (
                                    <div className="price-box">
                                        <span className="old-price">₹{Math.round((course.price || 2999) * 2.5)}</span>
                                        <span className="current-price">₹{course.price || 2999}</span>
                                    </div>
                                ) : (
                                    <div className="price-box">
                                        <span className="current-price">FREE</span>
                                    </div>
                                )}
                            </div>

                            <div className="card-bottom">
                                <button
                                    className="start-learning-btn"
                                    onClick={() => navigate(`/course/${course._id}`)}
                                >
                                    Start Learning
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <h3>No Valid Courses Found</h3>
                    <p>We couldn't find any courses in the "{selectedCategory}" category.</p>
                    <button className="primary-btn" onClick={() => setSelectedCategory('All')}>View All Courses</button>
                </div>
            )}
        </div>
    );
};

export default Courses;
