// gadd_kaam_backend/seedBadges.js
const mongoose = require('mongoose');
const Badge = require('./models/Badge');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const seedBadges = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  
  const badges = [
    {
      name: 'First Swap',
      description: 'Completed your first skill exchange!',
      icon: 'Handshake', // Icon name from lucide-react
      criteriaType: 'skill_exchanges_completed',
      criteriaValue: 1
    },
    {
      name: 'Top Rated',
      description: 'Maintained a 4.5+ rating over 5 swaps.',
      icon: 'Star',
      criteriaType: 'endorsements_received',
      criteriaValue: 5
    },
    {
      name: 'Community Pillar',
      description: 'Posted 5 skill offers to help others.',
      icon: 'Heart',
      criteriaType: 'skill_offers_made',
      criteriaValue: 5
    }
  ];

  for (const b of badges) {
    const exists = await Badge.findOne({ name: b.name });
    if (!exists) {
      await new Badge(b).save();
      console.log(`Created badge: ${b.name}`);
    }
  }
  console.log('Badge seeding complete');
  process.exit();
};

seedBadges();