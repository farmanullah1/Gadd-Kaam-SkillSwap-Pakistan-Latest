// gadd_kaam_backend/utils/badgeUtils.js
const User = require('../models/User');
const Badge = require('../models/Badge');
const Notification = require('../models/Notification');

const awardBadge = async (userId, badgeName) => {
  try {
    // 1. Find the badge definition
    const badge = await Badge.findOne({ name: badgeName });
    if (!badge) return;

    // 2. Find the user
    const user = await User.findById(userId);
    if (!user) return;

    // 3. Check if user already has this badge
    // Assuming user.badges is an array of Badge ObjectIds
    const alreadyHas = user.badges && user.badges.includes(badge._id);
    
    if (!alreadyHas) {
      // 4. Award the badge
      user.badges = user.badges || [];
      user.badges.push(badge._id);
      await user.save();

      // 5. Create Notification
      const newNotification = new Notification({
        recipient: userId,
        type: 'message', // Using generic type for simplicity, or add 'badge_awarded' to enum
        referenceId: badge._id,
        text: `🎉 Congratulations! You've earned the "${badge.name}" badge!`
      });
      await newNotification.save();
      
      console.log(`Badge awarded: ${badge.name} to ${user.username}`);
    }
  } catch (err) {
    console.error("Error awarding badge:", err.message);
  }
};

module.exports = { awardBadge };