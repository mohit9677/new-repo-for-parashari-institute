import express from 'express';
import Course from '../models/Course.js';
import User from '../models/User.js';
import Module from '../models/Module.js';
import Video from '../models/Video.js';
import { authMiddleware } from '../middleware/auth.js';
import { getAccessibleCourses } from '../utils/accessControl.js';

const router = express.Router();

// Get all courses (public)
router.get('/', async (req, res) => {
    try {
        console.log('📚 GET /api/courses - Fetching all courses...');
        const courses = await Course.find({ active: true }).select('-videoKey');
        console.log(`✅ Found ${courses.length} courses`);
        res.json({ courses });
    } catch (error) {
        console.error('❌ Fetch courses error:', error.message);
        console.error(error.stack);
        res.status(500).json({ error: 'Failed to fetch courses', details: error.message });
    }
});

// Get user's enrolled courses
router.get('/my-courses', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const courses = await getAccessibleCourses(user);

        res.json({
            courses,
            isPremium: user.isPremium,
            subscriptionStatus: user.isPremium ? 'active' : 'inactive'
        });
    } catch (error) {
        console.error('Fetch my courses error:', error);
        res.status(500).json({ error: 'Failed to fetch enrolled courses' });
    }
});

// Get course details with access check
router.get('/:courseId', authMiddleware, async (req, res) => {
    try {
        const { courseId } = req.params;
        const ACCESS_MODE = process.env.ACCESS_MODE || 'OPEN';

        // Handle static dummy courses
        if (courseId.startsWith('abai_course_')) {
            const mockTitleMap = {
                'abai_course_001': 'Vedic Astrology',
                'abai_course_002': 'Palmistry',
                'abai_course_003': 'Nadi Jyotish',
                'abai_course_004': 'Gemstone Science',
                'abai_course_005': 'Lal Kitab'
            };
            
            const course = {
                _id: courseId,
                title: mockTitleMap[courseId] || 'Demo Course Content',
                description: 'Content for this course is currently syncing.',
            };
            
            const v1MockModules = [
                {
                    _id: 'mod1', title: 'Introduction & Basics', orderIndex: 1, moduleId: 'mod1',
                    videos: [
                        { _id: 'item1', title: 'Welcome Video', url: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4', active: true, orderIndex: 1 }
                    ]
                },
                {
                    _id: 'mod2', title: 'Core Concepts', orderIndex: 2, moduleId: 'mod2',
                    videos: []
                },
                {
                    _id: 'mod3', title: 'Advanced Application', orderIndex: 2, moduleId: 'mod3',
                    videos: []
                }
            ];
            
            return res.json({ course: { ...course, modules: v1MockModules } });
        }

        // 1. Fetch Course
        const course = await Course.findById(courseId);
        if (!course) {
            console.warn(`Course not found: ${courseId}`);
            return res.status(404).json({ error: 'Course not found' });
        }

        // 2. Fetch User (needed for logs or future checks)
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // 3. Access Control
        if (ACCESS_MODE !== 'OPEN') {
            if (course.isSubscriptionBased) {
                // if (user.subscriptionStatus !== 'active') return res.status(403)...
            }
            // Check enrollment logic here if not OPEN
        }

        // 4. Content Retrieval & Hierarchy Assembly
        // Fetch Modules
        const modules = await Module.find({ courseId: course._id, active: true }).sort('orderIndex');

        // Fetch Videos for those modules
        const moduleIds = modules.map(m => m._id);
        const videos = await Video.find({ moduleId: { $in: moduleIds }, active: true }).sort('orderIndex');

        // Nest videos under modules
        const courseContent = modules.map(module => {
            const moduleVideos = videos.filter(v => v.moduleId.toString() === module._id.toString());
            return {
                ...module.toObject(),
                videos: moduleVideos
            };
        });

        console.log(`✅ Served Course: ${course.title} to User: ${req.userId} (Mode: ${ACCESS_MODE})`);

        res.json({
            course: {
                ...course.toObject(),
                modules: courseContent
            }
        });

    } catch (error) {
        console.error('Fetch course detail error:', error);
        res.status(500).json({ error: 'Failed to fetch course detail', details: error.message });
    }
});

export default router;
