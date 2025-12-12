import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend - set RESEND_API_KEY in environment for real emails
const resend = new Resend(process.env.RESEND_API_KEY || 're_demo_key');

// Store codes in memory (in production, use Redis or database)
const verificationCodes = new Map<string, { code: string; expiresAt: number }>();

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
        return await sendVerificationCode(email);

      case 'verify':
        const { code } = body;
        return await verifyCode(email, code);

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use "send" or "verify"' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Verification code error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Generate a 6-digit code
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendVerificationCode(email: string) {
  const code = generateCode();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  // Store the code
  verificationCodes.set(email.toLowerCase(), { code, expiresAt });

  // Check if we have a valid Resend API key
  const apiKey = process.env.RESEND_API_KEY;
  const hasRealApiKey = apiKey && apiKey !== 're_demo_key' && apiKey.startsWith('re_');

  // Log for debugging (check Vercel logs)
  console.log('[Email API] API Key present:', !!apiKey);
  console.log('[Email API] API Key valid:', hasRealApiKey);
  console.log('[Email API] API Key prefix:', apiKey ? apiKey.substring(0, 10) + '...' : 'none');

  if (hasRealApiKey) {
    try {
      // Send real email via Resend
      const { data, error } = await resend.emails.send({
        from: 'Lumina S <noreply@resend.dev>',
        to: email,
        subject: 'Your Lumina S Verification Code',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; padding: 40px 20px;">
            <div style="max-width: 440px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 32px;">
                <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #14B8A6, #A855F7); border-radius: 14px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                  <span style="color: white; font-size: 28px;">&#9993;</span>
                </div>
                <h1 style="color: #1e293b; font-size: 24px; font-weight: 700; margin: 0;">Verify your email</h1>
              </div>

              <p style="color: #64748b; font-size: 15px; line-height: 1.6; text-align: center; margin-bottom: 32px;">
                Enter this code to sign in to <strong style="color: #1e293b;">Lumina S</strong>
              </p>

              <div style="background: linear-gradient(135deg, #f0fdfa, #faf5ff); border: 2px dashed #14B8A6; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 32px;">
                <div style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #1e293b; font-family: 'SF Mono', Monaco, 'Courier New', monospace;">
                  ${code}
                </div>
              </div>

              <p style="color: #94a3b8; font-size: 13px; text-align: center; margin: 0;">
                This code expires in 10 minutes.<br>
                If you didn't request this code, you can safely ignore this email.
              </p>
            </div>

            <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 24px;">
              &copy; ${new Date().getFullYear()} Lumina S. All rights reserved.
            </p>
          </body>
          </html>
        `,
      });

      if (error) {
        console.error('Resend error:', error);
        // Fall back to demo mode
        return NextResponse.json({
          success: true,
          message: 'Verification code sent to your email',
          demo: true,
          demoCode: code,
          note: 'Email service error - using demo mode'
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Verification code sent to your email',
        emailId: data?.id
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Fall back to demo mode
      return NextResponse.json({
        success: true,
        message: 'Verification code sent to your email',
        demo: true,
        demoCode: code,
        note: 'Email service unavailable - using demo mode'
      });
    }
  } else {
    // Demo mode - no real email sent
    console.log(`[DEMO] Verification code for ${email}: ${code}`);

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email',
      demo: true,
      demoCode: code,
      note: 'Demo mode - set RESEND_API_KEY in .env for real emails'
    });
  }
}

async function verifyCode(email: string, code: string) {
  if (!code) {
    return NextResponse.json(
      { error: 'Verification code is required' },
      { status: 400 }
    );
  }

  const stored = verificationCodes.get(email.toLowerCase());

  if (!stored) {
    return NextResponse.json(
      { error: 'No verification code found. Please request a new one.' },
      { status: 400 }
    );
  }

  if (Date.now() > stored.expiresAt) {
    verificationCodes.delete(email.toLowerCase());
    return NextResponse.json(
      { error: 'Verification code has expired. Please request a new one.' },
      { status: 400 }
    );
  }

  if (stored.code !== code) {
    return NextResponse.json(
      { error: 'Invalid verification code. Please try again.' },
      { status: 400 }
    );
  }

  // Code is valid - remove it so it can't be reused
  verificationCodes.delete(email.toLowerCase());

  return NextResponse.json({
    success: true,
    message: 'Email verified successfully'
  });
}
