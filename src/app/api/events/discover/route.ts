import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { DiscoveredEvent } from '@/types/event';

export async function POST(request: NextRequest) {
  try {
    const { city } = await request.json();

    if (!city) {
      return NextResponse.json(
        { error: 'City parameter is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Claude API key not configured' },
        { status: 500 }
      );
    }

    const anthropic = new Anthropic({ apiKey });

    const prompt = `Search the web for iftar events during Ramadan 2026 (March 2026) near ${city}. 
    
Find real, current events that are happening or scheduled to happen. Include mosques, Islamic centers, universities, and community organizations hosting iftar events.

Return ONLY a valid JSON array of events with this exact structure, with no additional text, explanation, or markdown formatting:

[
  {
    "title": "Event name",
    "description": "Brief description of the event",
    "location": "Full address",
    "city": "City name",
    "state": "State abbreviation (e.g., CA, NY)",
    "date": "YYYY-MM-DD format",
    "time": "Event time (e.g., 6:30 PM or Maghrib)",
    "organization": "Organization name",
    "contact_email": "email@example.com (optional)",
    "contact_phone": "phone number (optional)",
    "website": "https://website.com (optional)"
  }
]

If you cannot find any events, return an empty array: []

Focus on finding events that:
- Are scheduled for March 2026 (Ramadan 2026)
- Are near ${city}
- Include location details
- Are from reliable sources (mosque websites, university pages, community calendars)`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract text from response
    const responseText = message.content
      .filter((block) => block.type === 'text')
      .map((block) => ('text' in block ? block.text : ''))
      .join('');

    // Try to parse JSON from response
    let events: DiscoveredEvent[] = [];
    try {
      // Remove markdown code blocks if present
      const jsonText = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      events = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse Claude response:', responseText);
      return NextResponse.json(
        { 
          error: 'Failed to parse event data from AI response',
          details: 'The AI returned an invalid format. Please try again.',
        },
        { status: 500 }
      );
    }

    // Validate events array
    if (!Array.isArray(events)) {
      return NextResponse.json(
        { error: 'Invalid response format from AI' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      events,
      count: events.length,
    });
  } catch (error) {
    console.error('Error discovering events:', error);
    return NextResponse.json(
      { 
        error: 'Failed to discover events',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
