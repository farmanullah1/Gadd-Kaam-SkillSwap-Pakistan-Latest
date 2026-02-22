// gadd_kaam_backend/update_roles.js
const mongoose = require('mongoose');
const User = require('./models/User'); 
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const fixRoles = async () => {
  try {
    if (!process.env.MONGO_URI) {
        console.error("❌ Error: MONGO_URI is undefined. Check your .env file.");
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to Database...");

    // 1. Set default 'user' role for anyone who doesn't have a role
    const updateResult = await User.updateMany(
        { role: { $exists: false } }, 
        { $set: { role: "user", isBanned: false } }
    );
    console.log(`ℹ️ Updated ${updateResult.modifiedCount} old users to have 'user' role.`);

    // 2. Make the specific user from your screenshot an ADMIN
    // Using the ID from your first screenshot: 69564654e75bedcae35fae4f
    const targetId = "69564654e75bedcae35fae4f"; 
    
    const adminUpdate = await User.findByIdAndUpdate(
        targetId, 
        { $set: { role: "admin" } },
        { new: true } // Return the updated doc
    );

    if (adminUpdate) {
        console.log(`🎉 SUCCESS: User '${adminUpdate.username}' is now an ADMIN.`);
        console.log(`   Role: ${adminUpdate.role}`);
    } else {
        console.log("⚠️ Could not find the specific user ID. Check if the ID is correct.");
    }

    process.exit();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

fixRoles();