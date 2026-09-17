const { STATE_CODES, REG_NUMBER_PREFIX } = require('../config/constant');
const Candidate = require('../models/Student.model');

/**
 * Generates a unique JAMB-style registration number.
 * Format: YEAR + STATE_CODE (2) + GENDER_CHAR (1) + RANDOM_6_DIGITS
 * Example: 2025LA M123456  →  2025LAM123456
 */
const generateRegNumber = async (state, gender) => {
  const year      = REG_NUMBER_PREFIX;
  const stateCode = STATE_CODES[state] || 'FC';
  const genderChar= gender === 'Female' ? 'F' : 'M';

  let regNumber;
  let isUnique = false;
  let attempts = 0;

  while (!isUnique && attempts < 10) {
    const random = Math.floor(100000 + Math.random() * 900000); // 6-digit
    regNumber    = `${year}${stateCode}${genderChar}${random}`;
    const exists = await Candidate.findOne({ registrationNumber: regNumber });
    if (!exists) isUnique = true;
    attempts++;
     }

  if (!isUnique) throw new Error('Failed to generate unique registration number');
  return regNumber;
};

module.exports = { generateRegNumber };