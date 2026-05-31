// gadd_kaam_backend/routes/adminRoutes.js
const express = require("express");
const User = require("../models/User");
const SkillOffer = require("../models/SkillOffer");
const WomenSkillOffer = require("../models/WomenSkillOffer");
const Report = require("../models/Report");
const Request = require("../models/Request");
const Badge = require("../models/Badge");
const Notification = require("../models/Notification");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// --- USER MANAGEMENT ---

const maskCnic = (cnic) => {
  if (!cnic) return cnic;
  const match = cnic.match(/^(\d{5})-(\d{7})-(\d{1})$/);
  if (match) {
    return `${match[1]}-*******-${match[3]}`;
  }
  return 'xxxxx-*******-x';
};

/**
 * ✅ Get all users
 */
router.get("/users", adminAuth, async (req, res) => {
  try {
    const users = await User.find().select("-password").populate("badges");
    const sanitizedUsers = users.map(user => {
      const u = user.toObject({ getters: true });
      if (u.cnicNumber) {
        u.cnicNumber = maskCnic(u.cnicNumber);
      }
      return u;
    });
    res.json(sanitizedUsers);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Server error");
  }
});

/**
 * ✅ Reveal CNIC for a specific user (Admin only)
 */
router.get("/users/:id/reveal-cnic", adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json({ cnicNumber: user.cnicNumber });
  } catch (err) {
    console.error("Error revealing CNIC:", err);
    res.status(500).send("Server error");
  }
});

/**
 * ✅ Ban/Unban User
 */
router.put("/users/:id/ban", adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.isBanned = !user.isBanned;
    await user.save();

    res.json({ msg: user.isBanned ? "User banned" : "User activated", isBanned: user.isBanned });
  } catch (err) {
    console.error("Error banning user:", err);
    res.status(500).send("Server error");
  }
});

/**
 * ✅ Delete user
 */
router.delete("/users/:id", adminAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: "User deleted" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).send("Server error");
  }
});

// --- SKILL MANAGEMENT ---

/**
 * ✅ Get all skills (Marketplace + WomenOnlyZone)
 */
router.get("/skills", adminAuth, async (req, res) => {
  try {
    const marketplaceSkills = await SkillOffer.find()
      .populate("user", "username email firstName lastName profilePicture")
      .lean();

    const womenSkills = await WomenSkillOffer.find()
      .populate("user", "username email firstName lastName profilePicture")
      .lean();

    const normalize = (photo) => photo ? photo.replace(/^\/+/, "").replace(/\\/g, "/") : null;

    const allSkills = [
      ...marketplaceSkills.map(s => ({ ...s, source: "Marketplace", photo: normalize(s.photo) })),
      ...womenSkills.map(s => ({ ...s, source: "Women Zone", photo: normalize(s.photo) }))
    ];

    res.json(allSkills);
  } catch (err) {
    console.error("Error fetching skills:", err);
    res.status(500).send("Server error");
  }
});

/**
 * ✅ Delete skill (checks both collections)
 */
router.delete("/skills/:id", adminAuth, async (req, res) => {
  try {
    let skill = await SkillOffer.findByIdAndDelete(req.params.id);
    if (!skill) skill = await WomenSkillOffer.findByIdAndDelete(req.params.id);
    
    if (!skill) return res.status(404).json({ msg: "Skill not found" });
    
    res.json({ msg: "Skill deleted" });
  } catch (err) {
    console.error("Error deleting skill:", err);
    res.status(500).send("Server error");
  }
});

// --- REPORT MANAGEMENT ---

/**
 * ✅ Get all reports
 * FIX: Removed 'reportedSkill' populate to prevent strictPopulate error
 */
router.get("/reports", adminAuth, async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("reporter", "username email")
      .populate("reportedUser", "username email")
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).send("Server error");
  }
});

/**
 * ✅ Get Conversation for a specific Report
 */
router.get("/reports/:id/conversation", adminAuth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report || !report.requestId) return res.status(404).json({ msg: "No conversation linked." });

    const request = await Request.findById(report.requestId)
      .populate("messages.sender", "username profilePicture")
      .populate("sender", "username")
      .populate("receiver", "username");

    if (!request) return res.status(404).json({ msg: "Chat not found." });

    res.json({ 
      messages: request.messages, 
      participants: { 
        sender: request.sender.username, 
        receiver: request.receiver.username 
      } 
    });
  } catch (err) {
    console.error("Error fetching chat:", err);
    res.status(500).send("Server error");
  }
});

/**
 * ✅ Update Report Status
 */
router.put("/reports/:id", adminAuth, async (req, res) => {
  try {
    await Report.findByIdAndUpdate(req.params.id, { status: req.body.status });
    res.json({ msg: "Status updated" });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// --- DASHBOARD STATS ---

/**
 * ✅ Dashboard stats
 */
router.get("/stats", adminAuth, async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const skillCount = (await SkillOffer.countDocuments()) + (await WomenSkillOffer.countDocuments());
    const reportCount = await Report.countDocuments({ status: "open" });

    res.json({ users: userCount, skills: skillCount, reports: reportCount });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).send("Server error");
  }
});

/**
 * ✅ Award a badge to a user (Admin only)
 */
router.post("/users/:id/badges", adminAuth, async (req, res) => {
  const { badgeId } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const badge = await Badge.findById(badgeId);
    if (!badge) return res.status(404).json({ msg: "Badge not found" });

    // user.badges contains ObjectIds. Let's check if badgeId is already present.
    if (user.badges.some(b => b.toString() === badgeId.toString())) {
      return res.status(400).json({ msg: "User already has this badge" });
    }

    user.badges.push(badgeId);
    await user.save();

    // Create a real notification
    const notification = new Notification({
      recipient: user._id,
      type: "message",
      referenceId: badge._id,
      text: `🎉 Congratulations! You have been awarded the "${badge.name}" badge by an Admin for your stellar performance!`
    });
    await notification.save();

    const populatedUser = await User.findById(user._id).populate("badges").select("-password");
    res.json({ msg: "Badge awarded successfully", badges: populatedUser.badges });
  } catch (err) {
    console.error("Error awarding badge:", err);
    res.status(500).send("Server error");
  }
});

/**
 * ✅ Revoke a badge from a user (Admin only)
 */
router.delete("/users/:id/badges/:badgeId", adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.badges = user.badges.filter(bId => bId.toString() !== req.params.badgeId);
    await user.save();

    const populatedUser = await User.findById(user._id).populate("badges").select("-password");
    res.json({ msg: "Badge revoked successfully", badges: populatedUser.badges });
  } catch (err) {
    console.error("Error revoking badge:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;