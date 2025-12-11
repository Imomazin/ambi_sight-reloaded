import { NextRequest, NextResponse } from 'next/server';

// Slack integration webhook handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, channel, message, webhookUrl } = body;

    // Handle different Slack integration actions
    switch (action) {
      case 'send_message':
        return await sendSlackMessage(webhookUrl, channel, message);

      case 'send_insight':
        return await sendInsightToSlack(webhookUrl, body.insight);

      case 'send_alert':
        return await sendAlertToSlack(webhookUrl, body.alert);

      default:
        return NextResponse.json(
          { error: 'Unknown action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Slack integration error:', error);
    return NextResponse.json(
      { error: 'Integration failed' },
      { status: 500 }
    );
  }
}

async function sendSlackMessage(webhookUrl: string, channel: string, message: string) {
  // In production, this would actually send to Slack
  // For demo, we simulate the response

  if (!webhookUrl) {
    return NextResponse.json({
      success: false,
      error: 'Webhook URL not configured'
    }, { status: 400 });
  }

  // Simulate Slack API call
  const slackPayload = {
    channel,
    text: message,
    username: 'Lumina S Bot',
    icon_emoji: ':chart_with_upwards_trend:'
  };

  // In production:
  // const response = await fetch(webhookUrl, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(slackPayload)
  // });

  return NextResponse.json({
    success: true,
    message: 'Message sent to Slack (demo mode)',
    payload: slackPayload
  });
}

async function sendInsightToSlack(webhookUrl: string, insight: {
  title: string;
  summary: string;
  confidence: number;
  recommendations: string[];
}) {
  const blocks = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: `📊 ${insight.title}`,
        emoji: true
      }
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: insight.summary
      }
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `*Confidence:* ${insight.confidence}%`
        }
      ]
    },
    {
      type: 'divider'
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*Recommendations:*\n' + insight.recommendations.map(r => `• ${r}`).join('\n')
      }
    },
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'View in Lumina S'
          },
          url: 'https://luminas.app/insights',
          style: 'primary'
        }
      ]
    }
  ];

  return NextResponse.json({
    success: true,
    message: 'Insight shared to Slack (demo mode)',
    blocks
  });
}

async function sendAlertToSlack(webhookUrl: string, alert: {
  type: 'warning' | 'critical' | 'info';
  title: string;
  description: string;
}) {
  const emoji = {
    warning: '⚠️',
    critical: '🚨',
    info: 'ℹ️'
  }[alert.type];

  const color = {
    warning: '#F59E0B',
    critical: '#EF4444',
    info: '#3B82F6'
  }[alert.type];

  const attachment = {
    color,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `${emoji} *${alert.title}*\n${alert.description}`
        }
      }
    ]
  };

  return NextResponse.json({
    success: true,
    message: 'Alert sent to Slack (demo mode)',
    attachment
  });
}

// GET endpoint for OAuth callback
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL('/admin?slack_error=' + error, request.url));
  }

  if (code) {
    // In production, exchange code for access token
    // Store the token securely for the user
    return NextResponse.redirect(new URL('/admin?slack_connected=true', request.url));
  }

  return NextResponse.json({ error: 'Missing code parameter' }, { status: 400 });
}
