import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

async function checkContent() {
    await mongoose.connect(process.env.MONGODB_URI);
    const Module = mongoose.model('Module', new mongoose.Schema({ courseId: mongoose.Schema.Types.ObjectId, title: String }));
    const Video = mongoose.model('Video', new mongoose.Schema({ moduleId: mongoose.Schema.Types.ObjectId, title: String }));
    
    // Vedic Astrology ID
    const vedicId = '6985dbc8fc56f067555723ff';
    
    console.log(`Checking content for Course ID: ${vedicId}`);
    
    const modules = await Module.find({ courseId: vedicId });
    console.log(`Found ${modules.length} modules:`);
    modules.forEach(m => console.log(` - Module: ${m.title} (${m._id})`));
    
    const moduleIds = modules.map(m => m._id);
    const videos = await Video.find({ moduleId: { $in: moduleIds } });
    console.log(`Found ${videos.length} videos.`);
    
    // Also check for 'ContentItem' which is used in V2 (CourseDetail.jsx)
    const ContentItem = mongoose.model('ContentItem', new mongoose.Schema({ type: String, title: String }, { strict: false }));
    const v2Items = await ContentItem.find();
    console.log(`Found ${v2Items.length} ContentItems (V2).`);

    process.exit(0);
}
checkContent();
