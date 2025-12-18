import { NextRequest, NextResponse } from 'next/server';

interface ContentSection {
  id: string;
  type: string;
  headline: string;
  subheadline: string;
  description: string;
  cta?: {
    primary: string;
    secondary?: string;
  };
  items?: {
    title: string;
    description: string;
    icon?: string;
  }[];
}

interface ContentTokens {
  brand: {
    name: string;
    tagline: string;
    description: string;
  };
  sections: ContentSection[];
  microcopy: {
    navigation: string[];
    buttons: Record<string, string>;
    labels: Record<string, string>;
    errors: Record<string, string>;
  };
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export async function POST(request: NextRequest) {
  try {
    const { strategy, output } = await request.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json(generateMockContent(strategy, output));
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: buildContentPrompt(strategy, output),
          },
        ],
      }),
    });

    if (!response.ok) {
      return NextResponse.json(generateMockContent(strategy, output));
    }

    const result = await response.json();
    const content = result.content[0].text;

    const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/);
    if (jsonMatch) {
      const contentTokens = JSON.parse(jsonMatch[1]);
      return NextResponse.json(contentTokens);
    }

    try {
      const contentTokens = JSON.parse(content);
      return NextResponse.json(contentTokens);
    } catch {
      return NextResponse.json(generateMockContent(strategy, output));
    }
  } catch (error) {
    console.error('Content generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}

function buildContentPrompt(strategy: Record<string, string>, output: Record<string, unknown>): string {
  return `You are a conversion-focused copywriter. Generate complete website content based on this strategy:

BUSINESS: ${strategy.businessName}
TYPE: ${strategy.businessType}
AUDIENCE: ${strategy.targetAudience}
PROBLEM: ${strategy.problem}
SOLUTION: ${strategy.solution}
UNIQUE VALUE: ${strategy.uniqueValue}
TONE: ${strategy.tone}

STRATEGY OUTPUT:
${JSON.stringify(output, null, 2)}

Generate a JSON response with complete content for a landing page:

{
  "brand": {
    "name": "${strategy.businessName}",
    "tagline": "Short memorable tagline",
    "description": "2-3 sentence brand description"
  },
  "sections": [
    {
      "id": "unique-id-1",
      "type": "hero",
      "headline": "Compelling headline (5-10 words)",
      "subheadline": "Supporting text (15-25 words)",
      "description": "",
      "cta": {
        "primary": "Primary action (2-3 words)",
        "secondary": "Secondary action (2-3 words)"
      }
    },
    {
      "id": "unique-id-2",
      "type": "features",
      "headline": "Features headline",
      "subheadline": "Features description",
      "description": "",
      "items": [
        {"title": "Feature 1", "description": "Description", "icon": "sparkles"},
        {"title": "Feature 2", "description": "Description", "icon": "zap"},
        {"title": "Feature 3", "description": "Description", "icon": "shield"}
      ]
    },
    {
      "id": "unique-id-3",
      "type": "how-it-works",
      "headline": "How it works",
      "subheadline": "Simple steps",
      "description": "",
      "items": [
        {"title": "Step 1", "description": "Description"},
        {"title": "Step 2", "description": "Description"},
        {"title": "Step 3", "description": "Description"}
      ]
    },
    {
      "id": "unique-id-4",
      "type": "cta",
      "headline": "Final call to action",
      "subheadline": "Why act now",
      "description": "",
      "cta": {
        "primary": "Get Started",
        "secondary": "Contact Us"
      }
    }
  ],
  "microcopy": {
    "navigation": ["Features", "How It Works", "Pricing", "Contact"],
    "buttons": {
      "primary": "Get Started",
      "secondary": "Learn More",
      "submit": "Submit",
      "cancel": "Cancel"
    },
    "labels": {},
    "errors": {}
  }
}

Make all content specific to the business. Use the tone guidelines. Each section ID must be unique. Respond ONLY with JSON.`;
}

function generateMockContent(strategy: Record<string, string>, output: Record<string, unknown>): ContentTokens {
  const messaging = output.messaging as { headline: string; subheadline: string; tagline: string } | undefined;

  return {
    brand: {
      name: strategy.businessName,
      tagline: messaging?.tagline || `${strategy.businessName} - Simply Better`,
      description: strategy.solution || 'Transform your workflow with our innovative solution.',
    },
    sections: [
      {
        id: generateId(),
        type: 'hero',
        headline: messaging?.headline || `Transform Your ${strategy.businessType}`,
        subheadline: messaging?.subheadline || `${strategy.businessName} helps ${strategy.targetAudience} achieve more with less effort.`,
        description: '',
        cta: { primary: 'Get Started', secondary: 'Learn More' },
      },
      {
        id: generateId(),
        type: 'features',
        headline: 'Why Choose ' + strategy.businessName,
        subheadline: 'Everything you need to succeed',
        description: '',
        items: [
          { title: 'Easy to Use', description: 'Get started in minutes with our intuitive interface', icon: 'sparkles' },
          { title: 'Powerful Results', description: 'See immediate improvements in your workflow', icon: 'zap' },
          { title: 'Reliable Support', description: 'Our team is here to help you every step of the way', icon: 'shield' },
        ],
      },
      {
        id: generateId(),
        type: 'how-it-works',
        headline: 'How It Works',
        subheadline: 'Three simple steps to get started',
        description: '',
        items: [
          { title: 'Sign Up', description: 'Create your account in seconds' },
          { title: 'Configure', description: 'Set up your preferences and workflow' },
          { title: 'Launch', description: 'Start seeing results immediately' },
        ],
      },
      {
        id: generateId(),
        type: 'cta',
        headline: 'Ready to Get Started?',
        subheadline: 'Join thousands of satisfied users today',
        description: '',
        cta: { primary: 'Start Free Trial', secondary: 'Contact Sales' },
      },
    ],
    microcopy: {
      navigation: ['Features', 'How It Works', 'Pricing', 'Contact'],
      buttons: {
        primary: 'Get Started',
        secondary: 'Learn More',
        submit: 'Submit',
        cancel: 'Cancel',
      },
      labels: {},
      errors: {},
    },
  };
}
