const mongoose = require("mongoose");
require("dotenv").config();

const Admin = require("./models/Admin.model");

const MONGO_URI = process.env.MONGO_URI;

async function assignSchool() {
  try {
    await mongoose.connect(MONGO_URI);

    const admin = await Admin.findByIdAndUpdate(
      "6a7de50fb684250b3b66cf5a",
      {
        school: "6a8485d60293d305ecd84878",
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("_id fullName email role school");

    console.log("UPDATED ADMIN:");
    console.log(admin);

    await mongoose.disconnect();
  } catch (error) {
    console.error("ERROR:", error);
    process.exit(1);
  }
}

assignSchool();