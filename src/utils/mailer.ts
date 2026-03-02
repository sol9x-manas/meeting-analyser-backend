import nodemailer from "nodemailer";
import { env } from "../config/env";

export const transporter = nodemailer.createTransport({
  host: env.mail.host,
  port: env.mail.port,
  secure: false,
  auth: {
    user: env.mail.user,
    pass: env.mail.pass,
  },
});

export const sendMail = async (
  to: string,
  subject: string,
  html: string
) => {
  await transporter.sendMail({
    from: env.mail.from,
    to,
    subject,
    html,
  });
};