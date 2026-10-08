const mongoose = require('mongoose')
const User = require('./models/User')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Connected to DB')

    // Admin credentials from CLI args, environment, or default fallback
    const email = (process.argv[2] || process.env.ADMIN_EMAIL || 'superadmin@skillswap.com').trim().toLowerCase();
    const password = process.argv[3] || process.env.ADMIN_PASSWORD || 'Admin@123456';
    const username = (process.argv[4] || process.env.ADMIN_USERNAME || 'superadmin').trim().toLowerCase();

    const existingAdmin = await User.findOne({ email: email });
    if (existingAdmin) {
      console.log('⚠️ Admin user with this email already exists.');
      process.exit();
    }

    const adminUser = new User({
      firstName: 'Super',
      lastName: 'Admin',
      username: username,
      email: email,
      phoneNumber: '00000000111',
      dateOfBirth: new Date('1990-01-01'),
      cnicNumber: '11111-1111111-1',
      gender: 'Male',
      password: password,
      role: 'admin',
      isBanned: false
    });

    await adminUser.save();
    console.log('🎉 Admin Created Successfully!');
    console.log(`📧 Email: ${email}`);
    console.log(`👤 Username: ${username}`);
    process.exit();
  } catch (error) {
    console.error('❌ Error creating admin:', error)
    process.exit(1)
  }
}

createAdmin()
