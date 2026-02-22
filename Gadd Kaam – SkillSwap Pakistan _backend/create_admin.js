const mongoose = require('mongoose')
const User = require('./models/User')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Connected to DB')

    // Check if user exists
    const email = 'superadmin@skillswap.com' // Changed email to ensure it's new
    const existingAdmin = await User.findOne({ email: email })
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists.')
      process.exit()
    }

    const adminUser = new User({
      firstName: 'Super',
      lastName: 'Admin',
      username: 'superadmin',
      email: email,
      phoneNumber: '00000000111',
      dateOfBirth: new Date(),
      cnicNumber: '11111-1111111-1',
      gender: 'Male',
      password: 'password123', // ✅ Simple password
      role: 'admin',
      isBanned: false
    })

    await adminUser.save()
    console.log('🎉 Admin Created!')
    console.log(`📧 Email: ${email}`)
    console.log('🔑 Password: password123') // ✅ Matches the code above
    process.exit()
  } catch (error) {
    console.error('❌ Error creating admin:', error)
    process.exit(1)
  }
}

createAdmin()
