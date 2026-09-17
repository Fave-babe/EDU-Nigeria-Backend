const SuperAdmin = require("../models/SuperAdmin.model");
const AppError = require("../utils/AppError");

const createSuperAdmin = async (data) => {
  const { fullName, email, password, phone } = data;

  const existingSuperAdmin = await SuperAdmin.findOne({
    email: email.toLowerCase(),
  });

  if (existingSuperAdmin) {
    throw new AppError("SuperAdmin email already exists", 409);
  }

  const superAdmin = await SuperAdmin.create({
    fullName,
    email,
    password,
    phone,
  });

  return superAdmin;
};

const getSuperAdmin = async (id) => {
  const superAdmin = await SuperAdmin.findById(id);

  if (!superAdmin) {
    throw new AppError("SuperAdmin not found", 404);
  }

  return superAdmin;
};

const getAllSuperAdmins = async () => {
  return await SuperAdmin.find().sort({ createdAt: -1 });
};

const updateSuperAdmin = async (id, data) => {
  const superAdmin = await SuperAdmin.findById(id);

  if (!superAdmin) {
    throw new AppError("SuperAdmin not found", 404);
  }

  const allowedFields = [
    "fullName",
    "email",
    "phone",
  ];

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      superAdmin[field] = data[field];
    }
  });

  await superAdmin.save();

  return superAdmin;
};

const deactivateSuperAdmin = async (id) => {
  const superAdmin = await SuperAdmin.findById(id);

  if (!superAdmin) {
    throw new AppError("SuperAdmin not found", 404);
  }

  superAdmin.isActive = false;

  await superAdmin.save();

  return superAdmin;
};

const activateSuperAdmin = async (id) => {
  const superAdmin = await SuperAdmin.findById(id);

  if (!superAdmin) {
    throw new AppError("SuperAdmin not found", 404);
  }

  superAdmin.isActive = true;

  await superAdmin.save();

  return superAdmin;
};

const deleteSuperAdmin = async (id) => {
  const superAdmin = await SuperAdmin.findById(id);

  if (!superAdmin) {
    throw new AppError("SuperAdmin not found", 404);
  }

  await SuperAdmin.findByIdAndDelete(id);

  return superAdmin;
};

module.exports = {
  createSuperAdmin,
  getSuperAdmin,
  getAllSuperAdmins,
  updateSuperAdmin,
  deactivateSuperAdmin,
  activateSuperAdmin,
  deleteSuperAdmin,
};