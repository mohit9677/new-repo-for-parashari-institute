import mongoose from 'mongoose';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/parashari-learning-portal";

mongoose.connect(MONGO_URI).then(async () => {
    console.log("Connected to MongoDB.");

    // Using model referencing
    const Course = mongoose.models.Course || mongoose.model('Course', new mongoose.Schema({}, { strict: false }));

    // get all courses
    const courses = await Course.find();

    const mapped = courses.map(c => ({
        _id: c._id,
        title: c.title,
        level: c.level,
        active: c.active
    }));

    fs.writeFileSync('courses_dump.json', JSON.stringify(mapped, null, 2));
    console.log(`Saved ${mapped.length} courses to courses_dump.json`);

    mongoose.disconnect();
}).catch(console.error);
