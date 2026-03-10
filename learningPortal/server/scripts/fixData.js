import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/parashari-learning-portal";

mongoose.connect(MONGO_URI).then(async () => {
    console.log("Connected to MongoDB.");

    // Using simple model referencing
    const Course = mongoose.models.Course || mongoose.model('Course', new mongoose.Schema({}, { strict: false }));

    const courses = await Course.find();
    console.log(`Found ${courses.length} courses total.`);

    // Fix active flags
    let updatedCount = 0;
    for (const course of courses) {
        if (!course.active) {
            await Course.updateOne({ _id: course._id }, { $set: { active: true } });
            updatedCount++;
        }
        console.log(`Course: "${course.title}" | Level: ${course.level} | Active: ${course.active}`);
    }

    console.log(`Updated ${updatedCount} courses to be active=true.`);

    mongoose.disconnect();
}).catch(console.error);
