const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");

const prisma = new PrismaClient();
const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post("/api/referrals", async (req, res) => {
  const { referrerName, referrerEmail, refereeName, refereeEmail } = req.body;
  try {
    const referral = await prisma.referral.create({
      data: { referrerName, referrerEmail, refereeName, refereeEmail },
    });

    // Send email notification
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "pavansian156@gmail.com",
        pass: "nior tzka dnfv raoi",
      },
    });

    const mailOptions = {
      from: "pavansian156@gmail.com",
      to: refereeEmail,
      subject: "Referral from " + referrerName,
      text: `Hi ${refereeName},\n\nYou have been referred by ${referrerName} for our course. Please check it out!\n\nThanks,\nTeam`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Email sent: " + info.response);
    });

    res.status(201).json(referral);
  } catch (error) {
    res.status(500).json({ error: "Failed to create referral" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
