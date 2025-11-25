import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, message } = body;

    const data = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>',
      to: ['crusheduplaceintl@gmail.com'],
      subject: `New Contact Form Submission from ${firstName} ${lastName}`,
      html: `
        <h1>New Contact Message</h1>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
