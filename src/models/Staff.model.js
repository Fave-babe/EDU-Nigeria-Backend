// Staff.model.js
const mongoose = require('mongoose');
const { ROLES } = require('../config/constant');
const bcrypt = require('bcryptjs');

const staffSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    school: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "School",
  required: [true, "Staff school is required"],
},
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 8,
        select: false,
    },
    role: {
        type: String,
        enum: Object.values(ROLES),
        default: ROLES.STAFF,
        required: [true, 'Role is required'],
    },
    phone: { type: String, trim: true },
    staffRole: {
        type: String,
        trim: true
        // free-text job title/description, e.g. "Librarian", "Security", "IT Support"
    },
    isActive: { type: Boolean, default: true },
    lastLogin: Date,
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
}, { timestamps: true });

staffSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
});

staffSchema.methods.comparePassword = async function (candidate) {
    return bcrypt.compare(candidate, this.password);
};

staffSchema.methods.changePasswordAfter = function (jwtTimestamp) {
    if (this.passwordChangedAt) {
        return parseInt(this.passwordChangedAt.getTime() / 1000, 10) > jwtTimestamp;
    }
    return false;
};

staffSchema.set('toJSON', {
    transform: (_, ret) => { delete ret.password; return ret; },
});

module.exports = mongoose.model('Staff', staffSchema);