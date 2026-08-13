import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !toEmail) {
    return NextResponse.json(
      {
        error:
          "This form isn't connected yet. Add RESEND_API_KEY and CONTACT_TO_EMAIL to your environment to start receiving messages.",
      },
      { status: 503 },
    );
  }

  const { name, email, message } = (await req.json()) as {
    name?: string;
    email?: string;
    message?: string;
  };

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields." }, { status: 400 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "IZK Website <onboarding@resend.dev>",
      to: toEmail,
      reply_to: email,
      subject: `New inquiry from ${name}`,
      text: message,
    }),
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Message couldn't be sent right now. Try again shortly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
