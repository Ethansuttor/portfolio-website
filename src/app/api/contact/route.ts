import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  const { name, subject, message } = await request.json();

  if (!name?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Name and message are required." }, { status: 400 });
  }

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return NextResponse.json({ error: "Email service not configured." }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
    to: "ethan.suttor@gmail.com",
    replyTo: process.env.GMAIL_USER,
    subject: subject?.trim() ? `[Portfolio] ${subject.trim()}` : "[Portfolio] New Message",
    text: `Name: ${name}\n\n${message}`,
    html: `<p><strong>From:</strong> ${name}</p><p><strong>Subject:</strong> ${subject || "—"}</p><hr/><p>${message.replace(/\n/g, "<br/>")}</p>`,
  });

  return NextResponse.json({ success: true });
}
