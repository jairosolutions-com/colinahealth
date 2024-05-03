process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest, res: any) {
  try {
    const body = await req.json();

    const { name, emailAddress, subject, message } = body;

    const user = process.env.NEXT_USER;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.NEXT_USER,
        pass: process.env.NEXT_PASS,
      },
    });

    const mail = await transporter.sendMail({
      from: user,
      to: emailAddress,
      replyTo: emailAddress,
      subject: subject,
      html: `
      <div>
      <p>Hi ${name},</p>
      <p>${message}</p>
      </div>
      `,
    });

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
