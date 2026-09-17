const success = (
  res,
  data = {},
  message = "Success",
  statusCode = 200
) =>
  res.status(statusCode).json({
    success: true,
    message,
    ...data,
  });

const created = (
  res,
  data = {},
  message = "Created successfully"
) => success(res, data, message, 201);

const paginated = (
  res,
  data = {},
  message = "Data retrieved successfully"
) =>
  res.status(200).json({
    success: true,
    message,
    ...data,
  });

const error = (
  res,
  message = "An error occurred",
  statusCode = 400,
  errors = null
) =>
  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
  });

module.exports = {
  success,
  created,
  paginated,
  error,
};