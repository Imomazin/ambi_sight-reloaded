import { NextRequest, NextResponse } from 'next/server';

// Magic Link Authentication API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, action } = body;

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'send':
        return await sendMagicLink(email);

      case 'verify':
        const { token } = body;
        return await verifyMagicLink(email, token);

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Magic link error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function sendMagicLink(email: string) {
  // In production, this would:
  // 1. Generate a secure random token
  // 2. Store token with email and expiration in database
  // 3. Send email with magic link via SendGrid/Resend/etc.

  const token = generateToken();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  // Demo: Store in memory (production would use Redis/DB)
  const magicLink = {
    email,
    token,
    expiresAt: expiresAt.toISOString(),
    used: false
  };

  // In production, send actual email
  const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/signin?token=${token}&email=${encodeURIComponent(email)}`;

  console.log('Magic link generated:', loginUrl);

  return NextResponse.json({
    success: true,
    message: 'Magic link sent to your email',
    // Demo only - remove in production
    demo: {
      note: 'In production, this would be sent via email',
      loginUrl,
      expiresIn: '15 minutes'
    }
  });
}

async function verifyMagicLink(email: string, token: string) {
  if (!token) {
    return NextResponse.json(
      { error: 'Token is required' },
      { status: 400 }
    );
  }

  // In production, verify token from database
  // Check: token exists, matches email, not expired, not used

  // Demo: Accept any token for demonstration
  const isValid = token && token.length > 10;

  if (!isValid) {
    return NextResponse.json(
      { error: 'Invalid or expired magic link' },
      { status: 401 }
    );
  }

  // Create session
  const user = {
    id: `user-${Date.now()}`,
    email,
    name: email.split('@')[0],
    plan: 'Free' as const,
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString()
  };

  // In production, create actual session token (JWT or session cookie)
  const sessionToken = generateToken();

  return NextResponse.json({
    success: true,
    user,
    sessionToken,
    expiresIn: '7 days'
  });
}

function generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}
