import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const entry = `${new Date().toISOString()} | ${email}`;
    console.log(`[WAITLIST] ${entry}`);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to process' }, { status: 500 });
  }
}
