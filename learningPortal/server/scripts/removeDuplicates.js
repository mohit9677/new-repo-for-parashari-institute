import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/parashari-learning-portal";

mongoose.connect(MONGO_URI).then(async () => {
    console.log("Connected to MongoDB.");

    // Using dynamic import or mongoose.model depending on architecture
    const Course = mongoose.models.Course || mongoose.model('Course', new mongoose.Schema({}, { strict: false }));
    const Category = mongoose.models.Category || mongoose.model('Category', new mongoose.Schema({}, { strict: false }));

    const courses = await Course.find();
    console.log(`Found ${courses.length} courses total.`);

    if (courses.length > 0) {
        console.log("Sample course:", courses[0]);
    }

    // Find duplicates based on title
    const seenTitles = {};
    const toDelete = [];

    for (const course of courses) {
        if (!course.title) continue;
        const normalizedTitle = course.title.trim().toLowerCase();
        if (seenTitles[normalizedTitle]) {
            console.log(`Duplicate found: ${course.title} (ID: ${course._id})`);
            toDelete.push(course._id);
        } else {
            seenTitles[normalizedTitle] = course._id;
        }
    }

    if (toDelete.length > 0) {
        console.log(`Deleting ${toDelete.length} duplicate courses...`);
        await Course.deleteMany({ _id: { $in: toDelete } });
        console.log("Deleted.");
    } else {
        console.log("No duplicates found by title.");
    }

    mongoose.disconnect();
}).catch(console.error);
