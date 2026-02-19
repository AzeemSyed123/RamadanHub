import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { EventSubmissionData } from '@/types/event';

export async function POST(request: NextRequest) {
  try {
    const body: EventSubmissionData = await request.json();

    // Validate required fields
    if (!body.title || !body.location || !body.city || !body.date || !body.time) {
      return NextResponse.json(
        { error: 'Missing required fields: title, location, city, date, and time are required' },
        { status: 400 }
      );
    }

    // Insert event into Supabase (defaults to is_approved: false)
    const { data, error } = await supabase
      .from('events')
      .insert([
        {
          title: body.title,
          description: body.description,
          location: body.location,
          city: body.city,
          state: body.state,
          date: body.date,
          time: body.time,
          organization: body.organization,
          contact_email: body.contact_email,
          contact_phone: body.contact_phone,
          website: body.website,
          submitted_by: body.submitted_by,
          is_approved: false, // Events require approval
        },
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to submit event', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Event submitted successfully and is pending approval',
      event: data?.[0],
    });
  } catch (error) {
    console.error('Error submitting event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
