const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const SkillOffer = require('./models/SkillOffer');
const Request = require('./models/Request');
const Badge = require('./models/Badge');

async function checkDatabase() {
  console.log('--- Gadd Kaam Database Diagnostics ---');
  console.log(`Connecting to: ${process.env.MONGO_URI || 'mongodb://localhost:27017/gadd_kaam'}`);
  
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gadd_kaam');
    console.log('✅ Connected to MongoDB successfully.');

    // Count records
    const usersCount = await User.countDocuments();
    const skillsCount = await SkillOffer.countDocuments();
    const requestsCount = await Request.countDocuments();
    const badgesCount = await Badge.countDocuments();

    console.log(`\n📊 Record Counts:`);
    console.log(`- Users: ${usersCount}`);
    console.log(`- Skill Offers: ${skillsCount}`);
    console.log(`- Requests/Swaps: ${requestsCount}`);
    console.log(`- Badges: ${badgesCount}`);

    // Print Users
    if (usersCount > 0) {
      console.log(`\n👤 Users sample (Up to 5):`);
      const users = await User.find().limit(5).select('firstName lastName username email role isBanned');
      users.forEach(u => {
        console.log(`  * ${u.username} (${u.firstName} ${u.lastName}) - Role: ${u.role}, Banned: ${u.isBanned}`);
      });
    } else {
      console.log('\n⚠️ No users found in the database.');
    }

    // Print Skill Offers
    if (skillsCount > 0) {
      console.log(`\n🛠️ Skill Offers sample (Up to 5):`);
      const skills = await SkillOffer.find().populate('user', 'username').limit(5);
      skills.forEach(s => {
        const username = s.user ? s.user.username : 'Unknown';
        console.log(`  * Offered: [${s.skills.join(', ')}] | Swaps for: [${s.skillsToSwap ? s.skillsToSwap.join(', ') : ''}] | Location: ${s.location} (Remotely: ${s.remotely}) | Posted by: @${username}`);
      });
    } else {
      console.log('\n⚠️ No skill offers found in the database.');
    }

    // Print Badges
    if (badgesCount > 0) {
      console.log(`\n🏅 Badges list:`);
      const badges = await Badge.find();
      badges.forEach(b => {
        console.log(`  * [${b.name}] - ${b.description} (${b.criteriaType}: ${b.criteriaValue})`);
      });
    } else {
      console.log('\n🏅 No badges created yet. (Run node seedBadges.js to seed them!)');
    }

  } catch (err) {
    console.error('❌ Database connection or query failed:', err.message);
  } finally {
    await mongoose.connection.close();
    console.log('\nDisconnected from MongoDB.');
  }
}

checkDatabase();
