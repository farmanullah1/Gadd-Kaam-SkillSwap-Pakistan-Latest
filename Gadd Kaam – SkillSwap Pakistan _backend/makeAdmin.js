const mongoose = require('mongoose');
const User = require('./models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// 👇 REPLACE THIS WITH THE EMAIL YOU WANT TO MAKE ADMIN
const TARGET_EMAIL = " farma0nullahansari999@gmail.com"; 

const makeUserAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to Database");

    const user = await User.findOne({ email: TARGET_EMAIL });

    if (!user) {
      console.log(`❌ User with email '${TARGET_EMAIL}' not found.`);
      process.exit();
    }

    user.role = "admin";
    await user.save();

    console.log(`🎉 SUCCESS! User '${user.username}' is now an ADMIN.`);
    process.exit();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

makeUserAdmin();