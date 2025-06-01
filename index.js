const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config({ path: path.join(process.cwd(), ".env") });
app.use(
  cors({
    origin: "*",
  })
);
app.post("/", async (req, res) => {
  const { to, subject, html } = req.body;
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com.", // Fixed: Removed the extra dot here
    port: 587,
    secure: false, // process.env.NODE_ENV === "production"
    auth: {
      user: process.env.NODEMAILLER_HOST_MAIL,
      pass: process.env.NODEMAILLER_HOST_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: "mdnazmulhasanniloy323@gmail.com",
      to,
      subject,
      text: "",
      html,
    });

    res
      .status(200)
      .json({ success: true, message: "Email sent successfully." });
    return;
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send email.",
      error: error.message,
      stack: error.stack,
    });
    return;
  }
});

app.patch("/", async (req, res) => {
  const sendEmail = async (to, subject, html) => {
    console.log("🚀 ~ sendEmail ~ html:", to);
    const transporter = nodemailer.createTransport({
      host: "email-smtp.eu-west-1.amazonaws.com", // Change this based on your AWS region
      port: 465,
      secure: false,
      auth: {
        user: "AKIAXZ5NGO5NG3ODA7P3",
        pass: "BAOJqzx7+eNmh7KgyH8k4dFyMnzQhBjuBLdzOWt7TExn",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const res = await transporter.sendMail({
      from: "noreply@aristocar.eu",
      to,
      subject,
      text: "",
      html,
    });
    console.log(res);
  };
  const { to, subject, html } = req.body;
  try {
    const data = await sendEmail(to, subject, html);
    res.json({ success: true, data });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
