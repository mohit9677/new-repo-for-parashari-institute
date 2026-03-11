import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import '../styles/Courses.css';

// ─────────────────────────────────────────────────────────────────────────────
// Static course data — 5 tiers as per Parashari Institute course structure
//
//  Crash Course  → Beginner   (4 Weeks  · ₹2,499)
//  Diploma       → Popular    (8 Weeks  · ₹4,199)
//  Bachelor      → Pro        (12 Weeks · ₹8,999)
//  Master        → Advanced   (16 Weeks · ₹18,699)
//  Grand Master  → Elite      (24 Weeks · ₹24,999)
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORY_META = {
    'Crash Course':  { label: 'Beginner',  badge: 'BEGINNER',  color: '#4CAF50', duration: '4 Weeks',  price: 2499,  originalPrice: 3499  },
    'Diploma':       { label: 'Popular',   badge: 'POPULAR',   color: '#2196F3', duration: '8 Weeks',  price: 4199,  originalPrice: 5499  },
    'Bachelor':      { label: 'Pro',       badge: 'PRO',       color: '#9C27B0', duration: '12 Weeks', price: 8999,  originalPrice: 11999 },
    'Master':        { label: 'Advanced',  badge: 'ADVANCED',  color: '#FF9800', duration: '16 Weeks', price: 18699, originalPrice: 24999 },
    'Grand Master':  { label: 'Elite',     badge: 'ELITE',     color: '#c8960c', duration: '24 Weeks', price: 24999, originalPrice: 34999 },
};

const CATEGORY_ORDER = ['Crash Course', 'Diploma', 'Bachelor', 'Master', 'Grand Master'];

const abAiCourses = [
    // ── CRASH COURSE (Beginner) ──────────────────────────────────────────────
    {
        id: 'abai_course_001',
        title: 'Vedic Astrology',
        description: 'Introduction to Vedic mysteries, spiritual sciences & all 21 spiritual pillars. Concept of Jyotish, birth chart basics & how astrology affects daily life.',
        image: '/assets/images/vedic-astrology-new.jpg',
        category: 'Crash Course',
        icon: '♈'
    },
    {
        id: 'abai_course_002',
        title: 'Palmistry',
        description: 'Decode destiny through palm lines and understand personality traits. Learn to read life, heart, head, and fate lines for complete palm analysis.',
        image: '/assets/images/palmistry-new.jpg',
        category: 'Crash Course',
        icon: '✋'
    },
    {
        id: 'abai_course_003',
        title: 'Nadi Jyotish',
        description: 'Learn precise prediction techniques using Nadi astrology principles and leaf reading concepts for absolute beginners.',
        image: '/assets/images/taurus-card.png',
        category: 'Crash Course',
        icon: '📜'
    },

    // ── DIPLOMA (Popular) ────────────────────────────────────────────────────
    {
        id: 'abai_course_004',
        title: 'Gemstone Science',
        description: 'Core concepts across all 21 pillars with practical application. Chart reading basics, gemstone selection, basic Vastu & numerology calculations.',
        image: '/assets/images/gemstone.jpg',
        category: 'Diploma',
        icon: '💎'
    },
    {
        id: 'abai_course_005',
        title: 'Lal Kitab',
        description: 'Simple yet effective remedies for complex life problems using the wisdom of Lal Kitab. For those seeking professional-level fundamentals.',
        image: '/assets/images/lal-kitab-new.jpg',
        category: 'Diploma',
        icon: '📕'
    },
    {
        id: 'abai_course_006',
        title: 'Reiki Healing',
        description: 'Discover the art of energy channeling and healing through Reiki practices. Core energy healing concepts for professional entry-level seekers.',
        image: '/assets/images/healing.jpg',
        category: 'Diploma',
        icon: '🙌'
    },
    {
        id: 'abai_course_007',
        title: 'Tarot Reading',
        description: 'Unlock intuitive guidance and future predictions using Tarot cards with practical application for professional-level studies.',
        image: '/assets/images/tarot-new.jpg',
        category: 'Diploma',
        icon: '🃏'
    },
    {
        id: 'abai_course_008',
        title: 'Crystal Courses & Remedies',
        description: 'Harness the power of crystals for healing, energy balancing, and spiritual growth. Practical diploma-level crystal therapy.',
        image: '/assets/images/crystal-healing-new.jpg',
        category: 'Diploma',
        icon: '🔮'
    },

    // ── BACHELOR (Pro) ───────────────────────────────────────────────────────
    {
        id: 'abai_course_009',
        title: 'Numerology',
        description: 'Advanced Vedic & KP astrology, Vastu consultancy. Numerology studies how numbers connected to your name and birthdate reveal personality and life path.',
        image: '/assets/images/numerology-new.jpg',
        category: 'Bachelor',
        icon: '🔢'
    },
    {
        id: 'abai_course_010',
        title: 'KP Astrology',
        description: 'Krishnamurti Paddhati system for pinpoint accuracy in timing events. Live case-study sessions for career builders in spiritual sciences.',
        image: '/assets/images/kp-astrology-new.jpg',
        category: 'Bachelor',
        icon: '⭐'
    },
    {
        id: 'abai_course_011',
        title: 'Vastu Shastra',
        description: 'Transform your space. Learn Vastu consultancy, client consultation practice & remedy application for career builders in spiritual sciences.',
        image: '/assets/images/vastu-new.jpg',
        category: 'Bachelor',
        icon: '🏠'
    },
    {
        id: 'abai_course_012',
        title: 'Nakshatra',
        description: 'Tarot & Reiki practitioner skills via Nakshatra mastery. Live case-study sessions, client consultation practice & remedy application.',
        image: '/assets/images/gold_zodiac_wheel.png',
        category: 'Bachelor',
        icon: '✨'
    },
    {
        id: 'abai_course_013',
        title: 'Feng Shui',
        description: 'Advanced Feng Shui consultancy and spatial harmony principles. For career builders in spiritual sciences with professional-level mastery.',
        image: '/assets/images/institute-building-modern.jpg',
        category: 'Bachelor',
        icon: '⛩️'
    },

    // ── MASTER (Advanced) ────────────────────────────────────────────────────
    {
        id: 'abai_course_014',
        title: 'Face Reading',
        description: 'Deep mastery of physiognomy — PLRT, Chakra Balancing & Yantra-Mantra-Tantra system. Advanced prediction & teaching practicum.',
        image: '/assets/images/face-reading-new.jpg',
        category: 'Master',
        icon: '👤'
    },
    {
        id: 'abai_course_015',
        title: 'Remedy Course - (11 Types)',
        description: 'Comprehensive training on astrological remedies — PLRT, Chakra Balancing & Yantra-Mantra-Tantra system. Research methodology & advanced prediction.',
        image: '/assets/images/cancer-card.png',
        category: 'Master',
        icon: '🕉️'
    },
    {
        id: 'abai_course_016',
        title: 'Medical Astrology',
        description: 'Diagnose potential health issues through planetary positions. Deep mastery of all 21 pillars for expert & teacher level. Certified to teach & consult professionally.',
        image: '/assets/images/scorpio-card.png',
        category: 'Master',
        icon: '⚕️'
    },
    {
        id: 'abai_course_017',
        title: 'Gemini Jyotish',
        description: 'Advanced prediction techniques using Gemini Jyotish principles. Deep mastery of all 21 pillars for expert level.',
        image: '/assets/images/gemini-card.png',
        category: 'Master',
        icon: '♊'
    },
    {
        id: 'abai_course_018',
        title: 'Healing Courses',
        description: 'Deep mastery of all 21 pillars, PLRT, Chakra Balancing & Yantra-Mantra-Tantra system. Research methodology and advanced prediction & teaching practicum.',
        image: '/assets/images/chakra-balancing.jpg',
        category: 'Master',
        icon: '💆'
    },

    // ── GRAND MASTER (Elite) ─────────────────────────────────────────────────
    {
        id: 'abai_course_019',
        title: 'BNN Advanced',
        description: 'Full-spectrum mastery, business of astrology, personal brand building & global outreach. Bhrigu Nandi Nadi advanced predictive techniques.',
        image: '/assets/images/virgo-card.jpg',
        category: 'Grand Master',
        icon: '🔍'
    },
    {
        id: 'abai_course_020',
        title: 'Rudraksha',
        description: 'Understand the power of different Mukhi Rudrakshas. Mentorship certification, workshop design & institutional leadership for global leaders in Vedic sciences.',
        image: '/assets/images/rudraksha-new.jpg',
        category: 'Grand Master',
        icon: '📿'
    },
    {
        id: 'abai_course_021',
        title: 'Past Life Prediction',
        description: 'Full-spectrum mastery with past-life regression techniques, personal brand building & global outreach. Workshop design & institutional leadership.',
        image: '/assets/images/past-life.jpg',
        category: 'Grand Master',
        icon: '🕰️'
    },
    {
        id: 'abai_course_022',
        title: '1-on-1 Mentorship',
        description: 'Personalized guidance and advanced training with expert gurus. Mentorship certification, workshop design & institutional leadership for global leaders.',
        image: '/assets/images/libra-card.png',
        category: 'Grand Master',
        icon: '🤝'
    },
];

const Courses = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [apiCourses, setApiCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Map any legacy / URL category param names to new category keys
    const titleMap = {
        'crash course':  'Crash Course',
        'crashcourse':   'Crash Course',
        'crash-course':  'Crash Course',
        'beginner':      'Crash Course',
        'diploma':       'Diploma',
        'popular':       'Diploma',
        'intermediate':  'Diploma',
        'bachelor':      'Bachelor',
        'pro':           'Bachelor',
        'professional':  'Bachelor',
        'master':        'Master',
        'advanced':      'Master',
        'grand master':  'Grand Master',
        'grandmaster':   'Grand Master',
        'grand-master':  'Grand Master',
        'elite':         'Grand Master',
        'certification': 'Grand Master',
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
                    setApiCourses(unique);
                }
            } catch (error) {
                console.error('Error fetching courses', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    // abAiCourses is the canonical catalog. API data is used only for linking to detail pages.
    const mergedCourses = useMemo(() => {
        return [...abAiCourses];
    }, []);

    // Grouped by new category order
    const coursesByCategory = useMemo(() => {
        const grouped = {};
        CATEGORY_ORDER.forEach(cat => { grouped[cat] = []; });
        mergedCourses.forEach(course => {
            const cat = course.category;
            if (grouped[cat] !== undefined) grouped[cat].push(course);
        });
        return grouped;
    }, [mergedCourses]);

    const filteredForSingleCategory = useMemo(() => {
        if (selectedCategory === 'All') return [];
        return mergedCourses.filter(c => c.category === selectedCategory);
    }, [mergedCourses, selectedCategory]);

    const renderCard = (course) => {
        const meta = CATEGORY_META[course.category] || CATEGORY_META['Crash Course'];
        const imageUrl = course.image
            ? `${import.meta.env.VITE_ABAI_BASE_URL || 'http://localhost:3001'}${course.image}`
            : null;

        return (
            <div key={course.id || course._id} className="modern-course-card">
                <div className="card-top">
                    <div className="premium-ribbon">PREMIUM</div>
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={course.title}
                            className="course-banner"
                            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                        />
                    ) : null}
                    <div className="banner-placeholder" style={{ display: imageUrl ? 'none' : 'flex' }}>
                        <span style={{ fontSize: '2rem' }}>{course.icon || '🎓'}</span>
                        <span>{course.title}</span>
                    </div>
                </div>

                <div className="card-middle">
                    <h3 className="course-title">{course.title}</h3>
                    <p className="course-desc">{course.description}</p>
                    <div className="course-tags">
                        <span
                            className="tag-level"
                            style={{ backgroundColor: meta.color, color: '#fff' }}
                        >
                            {course.category}
                        </span>
                        <span className="tag-cert">✓ Certification</span>
                    </div>
                </div>

                <div className="card-price-section">
                    <div className="price-box">
                        <span className="old-price">₹{meta.originalPrice.toLocaleString('en-IN')}</span>
                        <span className="current-price">₹{meta.price.toLocaleString('en-IN')}</span>
                    </div>
                    <span className="price-duration">{meta.duration}</span>
                </div>

                <div className="card-bottom">
                    <button
                        className="start-learning-btn"
                        onClick={() => {
                            const matched = apiCourses.find(c => c.title?.toLowerCase() === course.title?.toLowerCase());
                            if (matched?._id) {
                                navigate(`/course/${matched._id}`);
                            } else if (course.id) {
                                navigate(`/course/${course.id}`);
                            } else {
                                navigate(`/courses?category=${encodeURIComponent(course.category)}`);
                            }
                        }}
                    >
                        Start Learning
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </button>
                </div>
            </div>
        );
    };

    const getPageTitle = () => {
        if (selectedCategory === 'All') return 'All Courses';
        const meta = CATEGORY_META[selectedCategory];
        return `${selectedCategory} — ${meta?.label || selectedCategory} Level`;
    };

    return (
        <div className="courses-page">
            <header className="page-header">
                <h2 className="page-title">{getPageTitle()}</h2>
                <p className="page-subtitle">Master ancient wisdom with our certified Vedic programs</p>
            </header>

            {/* Category Filter Tabs */}
            <div className="category-filter-tabs">
                <button
                    className={`filter-tab${selectedCategory === 'All' ? ' active' : ''}`}
                    onClick={() => setSelectedCategory('All')}
                >
                    All
                </button>
                {CATEGORY_ORDER.map(cat => {
                    const meta = CATEGORY_META[cat];
                    return (
                        <button
                            key={cat}
                            className={`filter-tab filter-tab--tiered${selectedCategory === cat ? ' active' : ''}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            <span className="tab-course-name">{cat}</span>
                            <span
                                className="tab-tier-badge"
                                style={{ backgroundColor: meta.color }}
                            >
                                {meta.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            {loading ? (
                <Loader />
            ) : selectedCategory !== 'All' ? (
                // Single category view
                filteredForSingleCategory.length > 0 ? (
                    <div className="modern-grid-courses">
                        {filteredForSingleCategory.map(renderCard)}
                    </div>
                ) : (
                    <div className="empty-state">
                        <h3>No Courses Found</h3>
                        <p>We couldn't find any courses in the "{selectedCategory}" category.</p>
                        <button className="primary-btn" onClick={() => setSelectedCategory('All')}>View All Courses</button>
                    </div>
                )
            ) : (
                // All courses view — 5 tier sections
                <div className="all-categories-wrapper">
                    {CATEGORY_ORDER.map(cat => {
                        const catCourses = coursesByCategory[cat] || [];
                        const meta = CATEGORY_META[cat];
                        if (catCourses.length === 0) return null;
                        return (
                            <section key={cat} className="category-section">
                                <div className="category-section-header">
                                    <div className="category-section-title-group">
                                        <span
                                            className="category-tier-badge"
                                            style={{ backgroundColor: meta.color }}
                                        >
                                            {meta.badge}
                                        </span>
                                        <h3 className="category-section-title">{cat}</h3>
                                        <span className="category-duration-pill">{meta.duration}</span>
                                    </div>
                                    <button
                                        className="view-all-link"
                                        onClick={() => setSelectedCategory(cat)}
                                    >
                                        View All →
                                    </button>
                                </div>
                                <div className="modern-grid-courses">
                                    {catCourses.map(renderCard)}
                                </div>
                            </section>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Courses;
