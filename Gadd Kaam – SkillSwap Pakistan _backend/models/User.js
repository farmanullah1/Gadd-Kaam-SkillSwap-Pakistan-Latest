const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  username: { type: String, required: true, unique: true, trim: true, lowercase: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  phoneNumber: { type: String, required: true, unique: true, trim: true },
  dateOfBirth: { type: Date, required: true },
  cnicNumber: { type: String, required: true, unique: true, trim: true },
  gender: { type: String, required: true, enum: ['Male', 'Female'] },
  password: { type: String, required: true, minlength: 6 },
  profilePicture: { type: String, required: false },
  cnicFrontPicture: { type: String, required: false },
  cnicBackPicture: { type: String, required: false },
  registrationDate: { type: Date, default: Date.now },
  location: { type: String, required: false },
  aboutMe: { type: String, required: false },
  
  // ✅ Role for Admin Access
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  },
  
  // ✅ Ban Status
  isBanned: { 
    type: Boolean, 
    default: false 
  },

  // ✅ Badges Earned (New Feature)
  badges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Badge'
  }]
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);