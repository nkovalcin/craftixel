import { NextRequest, NextResponse } from 'next/server';

interface StrategyInput {
  businessName: string;
  businessType: string;
  targetAudience: string;
  problem: string;
  solution: string;
  uniqueValue: string;
  tone: string;
  competitors: string;
}

interface StrategyOutput {
  positioning: string;
  valueProposition: string;
  messaging: {
    headline: string;
    subheadline: string;
    tagline: string;
  };
  sections: string[];
  toneGuidelines: string[];
}

export async function POST(request: NextRequest) {
  try {
    const input: StrategyInput = await request.json();

    // Check for API key
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      // Return mock data if no API key
      return NextResponse.json(generateMockStrategy(input));
    }

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: buildStrategyPrompt(input),
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error('Claude API error:', await response.text());
      return NextResponse.json(generateMockStrategy(input));
    }

    const result = await response.json();
    const content = result.content[0].text;

    // Parse the JSON from Claude's response
    const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/);
    if (jsonMatch) {
      const strategyOutput = JSON.parse(jsonMatch[1]);
      return NextResponse.json(strategyOutput);
    }

    // Try to parse the entire response as JSON
    try {
      const strategyOutput = JSON.parse(content);
      return NextResponse.json(strategyOutput);
    } catch {
      return NextResponse.json(generateMockStrategy(input));
    }
  } catch (error) {
    console.error('Strategy generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate strategy' },
      { status: 500 }
    );
  }
}

function buildStrategyPrompt(input: StrategyInput): string {
  return `You are a brand strategist and content expert. Based on the following business information, generate a comprehensive content strategy.

BUSINESS INFORMATION:
- Name: ${input.businessName}
- Type: ${input.businessType}
- Target Audience: ${input.targetAudience}
- Problem they solve: ${input.problem}
- Solution: ${input.solution}
- Unique Value: ${input.uniqueValue}
- Tone of Voice: ${input.tone}
- Competitors: ${input.competitors}

Generate a JSON response with the following structure:

{
  "positioning": "A clear 1-2 sentence positioning statement",
  "valueProposition": "A compelling value proposition that differentiates the business",
  "messaging": {
    "headline": "A powerful main headline (5-10 words)",
    "subheadline": "A supporting subheadline (15-25 words)",
    "tagline": "A memorable tagline (3-7 words)"
  },
  "sections": [
    "hero",
    "features",
    "how-it-works",
    "testimonials",
    "pricing",
    "cta",
    "faq"
  ],
  "toneGuidelines": [
    "Be ${input.tone.toLowerCase()}",
    "Use clear, simple language",
    "Focus on benefits over features",
    "Address the reader directly"
  ]
}

Respond ONLY with the JSON object, no additional text. Make sure the content is tailored to the specific business and audience described.`;
}

function generateMockStrategy(input: StrategyInput): StrategyOutput {
  return {
    positioning: `${input.businessName} is the leading ${input.businessType.toLowerCase()} solution that helps ${input.targetAudience.toLowerCase()} overcome ${input.problem.split(' ').slice(0, 5).join(' ')} through innovative technology.`,
    valueProposition: input.uniqueValue || `Transform your workflow with ${input.businessName}. We combine cutting-edge technology with user-centric design to deliver results that matter.`,
    messaging: {
      headline: `${input.solution.split(' ').slice(0, 6).join(' ')}`,
      subheadline: `${input.businessName} helps ${input.targetAudience.toLowerCase()} ${input.solution.toLowerCase().slice(0, 100)}`,
      tagline: input.businessName + ' - ' + (input.tone || 'Simply Better'),
    },
    sections: [
      'hero',
      'features',
      'how-it-works',
      'testimonials',
      'pricing',
      'cta',
      'faq',
    ],
    toneGuidelines: [
      `Maintain a ${input.tone.toLowerCase()} voice`,
      'Use clear, benefit-focused language',
      'Address the reader directly with "you"',
      'Back claims with specific results',
    ],
  };
}
