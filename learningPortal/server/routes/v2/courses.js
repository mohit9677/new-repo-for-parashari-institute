import express from 'express';
import mongoose from 'mongoose';
import Course from '../../models/Course.js';
import Module from '../../models/Module.js';
import Section from '../../models/Section.js';
import ContentItem from '../../models/ContentItem.js';
import { authMiddleware as authenticate } from '../../middleware/auth.js';

const router = express.Router();

// GET /api/v2/courses/:courseId
// Returns full hierarchy: Course -> Modules -> Sections -> ContentItems (Stubs)
router.get('/:courseId', authenticate, async (req, res) => {
    try {
        const { courseId } = req.params;

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
                level: 'Beginner',
                totalDuration: 120,
                isPublished: true
            };
            
            const mockHierarchy = [
                {
                    _id: 'mod1', title: 'Foundation Module',
                    sections: [{ _id: 'sec1', title: 'Getting Started', contentItems: [
                        { _id: 'item1', title: 'Welcome Video', type: 'VIDEO' },
                        { _id: 'item2', title: 'Course Details', type: 'PDF' }
                    ]}]
                },
                {
                    _id: 'mod2', title: 'Advanced Module',
                    sections: [{ _id: 'sec2', title: 'Deep Concepts', contentItems: [
                        { _id: 'item3', title: 'Advanced Notes', type: 'NOTE' }
                    ]}]
                }
            ];
            
            return res.json({ course, hierarchy: mockHierarchy });
        }

        // 1. Fetch Course Metadata
        const course = await Course.findById(courseId)
            .select('title description thumbnail level totalDuration isPublished')
            .lean();

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // 2. Aggregate Hierarchy
        // This is a complex aggregation to stitch Modules -> Sections -> ContentItems
        const modules = await Module.aggregate([
            { $match: { courseId: new mongoose.Types.ObjectId(courseId), active: true } },
            { $sort: { orderIndex: 1 } },
            {
                $lookup: {
                    from: 'sections',
                    let: { moduleId: '$_id' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$moduleId', '$$moduleId'] } } },
                        { $sort: { orderIndex: 1 } },
                        {
                            $lookup: {
                                from: 'contentitems',
                                let: { sectionId: '$_id' },
                                pipeline: [
                                    { $match: { $expr: { $eq: ['$sectionId', '$$sectionId'] } } },
                                    { $sort: { orderIndex: 1 } },
                                    {
                                        $project: {
                                            title: 1,
                                            type: 1,
                                            slug: 1,
                                            isLocked: 1,
                                            orderIndex: 1,
                                            // Only return safe metadata, never signed URLs here
                                            'metadata.duration': 1,
                                            'metadata.pageCount': 1,
                                            'metadata.size': 1,
                                            'metadata.cloudflareId': 1 // Safe to expose ID, not token
                                        }
                                    }
                                ],
                                as: 'contentItems'
                            }
                        }
                    ],
                    as: 'sections'
                }
            }
        ]);

        res.json({
            course,
            hierarchy: modules
        });

    } catch (error) {
        console.error('Error fetching course hierarchy:', error);
        res.status(500).json({ error: 'Server error fetching course content' });
    }
});

export default router;
