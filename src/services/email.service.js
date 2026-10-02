const nodemailer = require("nodemailer");
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log(
  "EMAIL_PASSWORD EXISTS:",
  !!process.env.EMAIL_PASSWORD
);
console.log(
  "EMAIL_PASSWORD LENGTH:",
  process.env.EMAIL_PASSWORD?.length
);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
transporter.verify((error, success) => {
  if (error) {
    console.error("EMAIL SERVER ERROR:", error);
  } else {
    console.log("EMAIL SERVER READY ✅");
  }
});

const sendAdmissionAcceptanceEmail = async ({
  student,
  school,
  applyingForClass,
}) => {
  const schoolName = school?.name || "Your School";

  const loginUrl =
    process.env.FRONTEND_URL || "http://localhost:5173";

  const mailOptions = {
    from: `"${schoolName}" <${process.env.EMAIL_USER}>`,
    to: student.email,
    subject: `Admission Offer - ${schoolName}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Admission Offer</h2>

        <p>
          Dear ${student.firstName} ${student.lastName},
        </p>

        <p>
          Congratulations! We are pleased to inform you that your application
          for admission into <strong>${schoolName}</strong> has been approved.
        </p>

        <p>
          <strong>Class:</strong>
          ${applyingForClass || "Assigned by school"}
        </p>

        <p>
          Your student account has been created successfully.
        </p>

        <p>
          You can access the student portal here:
        </p>

        <p>
          <a
            href="${loginUrl}"
            style="
              display:inline-block;
              padding:10px 18px;
              background:#071a41;
              color:white;
              text-decoration:none;
              border-radius:5px;
            "
          >
            Login to Student Portal
          </a>
        </p>

        <p>
          Please keep your login details safe.
        </p>

        <p>
          Regards,<br />
          <strong>${schoolName}</strong>
        </p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendAdmissionAcceptanceEmail,
};