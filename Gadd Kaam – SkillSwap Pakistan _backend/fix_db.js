const mongoose = require('mongoose');
const path = require('path');

// ✅ FIX: Look for .env in the current directory (root of backend)
require('dotenv').config({ path: path.join(__dirname, '.env') });

const fixIndexes = async () => {
  // Check if URI was found
  if (!process.env.MONGO_URI) {
    console.error("❌ Error: MONGO_URI is still undefined.");
    console.error("👉 FIX: Open this file (fix_db.js) and replace process.env.MONGO_URI with your actual connection string.");
    console.error('   Example: await mongoose.connect("mongodb://127.0.0.1:27017/gadd_kaam");');
    process.exit(1);
  }

  try {
    console.log(`Connecting to DB...`);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected...');

    const db = mongoose.connection.db;
    
    // Check if reviews collection exists
    const collections = await db.listCollections({ name: 'reviews' }).toArray();
    if (collections.length > 0) {
      console.log('🔥 Dropping old indexes on "reviews" collection...');
      try {
        await db.collection('reviews').dropIndexes();
        console.log('✅ Success! Indexes dropped.');
      } catch (e) {
        console.log('⚠️ Indexes might already be dropped or empty.');
      }
    } else {
      console.log('ℹ️ "reviews" collection does not exist yet. No fix needed.');
    }

    console.log('👍 You can now restart your server (npm start).');
    process.exit();
  } catch (err) {
    console.error('❌ Database Error:', err.message);
    process.exit(1);
  }
};

fixIndexes();