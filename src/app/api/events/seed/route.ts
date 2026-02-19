import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST() {
  try {
    // Sample events covering different US cities
    const seedEvents = [
      {
        title: 'Community Iftar at ICB Wayland',
        description: 'Family-friendly community iftar with traditional meals and short lecture',
        location: '126 Boston Post Rd, Wayland, MA 01778',
        city: 'Wayland',
        state: 'MA',
        date: '2026-03-01',
        time: '6:30 PM',
        organization: 'Islamic Center of Boston',
        contact_email: 'info@icbwayland.org',
        website: 'https://www.icbwayland.org',
        is_approved: true,
      },
      {
        title: 'MSA Iftar Dinner at NYU',
        description: 'Open to all students and community members. Free food and networking.',
        location: 'NYU Kimmel Center, 60 Washington Square S, New York, NY 10012',
        city: 'New York',
        state: 'NY',
        date: '2026-03-05',
        time: '7:00 PM',
        organization: 'NYU Muslim Students Association',
        contact_email: 'msa@nyu.edu',
        is_approved: true,
      },
      {
        title: 'Interfaith Community Iftar',
        description: 'Bringing communities together for understanding and unity during Ramadan',
        location: 'City Hall Plaza, Philadelphia, PA',
        city: 'Philadelphia',
        state: 'PA',
        date: '2026-03-08',
        time: 'Maghrib',
        organization: 'Philadelphia Interfaith Coalition',
        contact_email: 'info@philainterfaith.org',
        is_approved: true,
      },
      {
        title: 'Islamic Center of Houston Grand Iftar',
        description: 'Open iftar for the entire community with parking available',
        location: '3110 Eastside St, Houston, TX 77098',
        city: 'Houston',
        state: 'TX',
        date: '2026-03-12',
        time: '6:45 PM',
        organization: 'Islamic Society of Greater Houston',
        contact_email: 'info@isgh.org',
        website: 'https://www.isgh.org',
        is_approved: true,
      },
      {
        title: 'Downtown Mosque Community Iftar',
        description: 'Daily community iftar open to all. No registration required.',
        location: 'Islamic Center of America, 19500 Ford Rd, Dearborn, MI 48128',
        city: 'Dearborn',
        state: 'MI',
        date: '2026-03-15',
        time: 'Maghrib',
        organization: 'ICA Dearborn',
        contact_email: 'info@icadetroit.org',
        website: 'https://www.icadetroit.org',
        is_approved: true,
      },
      {
        title: 'University of Chicago MSA Iftar',
        description: 'Students, faculty, and local community welcome. Halal food provided.',
        location: 'University of Chicago Reynolds Club, Chicago, IL',
        city: 'Chicago',
        state: 'IL',
        date: '2026-03-18',
        time: '6:30 PM',
        organization: 'UChicago MSA',
        contact_email: 'msa@uchicago.edu',
        is_approved: true,
      },
      {
        title: 'Grand Mosque Los Angeles Iftar',
        description: 'One of the largest iftars in Southern California. All welcome.',
        location: '434 S Vermont Ave, Los Angeles, CA 90020',
        city: 'Los Angeles',
        state: 'CA',
        date: '2026-03-20',
        time: 'Maghrib',
        organization: 'Islamic Center of Southern California',
        contact_email: 'info@icsconline.org',
        website: 'https://www.icsconline.org',
        is_approved: true,
      },
      {
        title: 'Seattle Tech Community Iftar',
        description: 'Networking iftar for tech professionals and engineers in the Seattle area',
        location: 'Seattle Islamic Center, 1420 NE Northgate Way, Seattle, WA',
        city: 'Seattle',
        state: 'WA',
        date: '2026-03-22',
        time: '7:00 PM',
        organization: 'Seattle Muslim Professionals',
        contact_email: 'info@seattlemuslimtech.org',
        is_approved: true,
      },
      {
        title: 'Atlanta Interfaith Ramadan Celebration',
        description: 'Celebrating diversity with international cuisines and cultural performances',
        location: 'Masjid Al-Muminun, 2014 14th Ave, Atlanta, GA 30318',
        city: 'Atlanta',
        state: 'GA',
        date: '2026-03-25',
        time: '6:45 PM',
        organization: 'Atlanta Muslim Community',
        contact_email: 'info@atlantamuslims.org',
        is_approved: true,
      },
      {
        title: 'Phoenix Family Iftar Night',
        description: 'Family-friendly event with kids activities, bouncy houses, and dinner',
        location: 'Islamic Center of Arizona, 1325 E Guadalupe Rd, Tempe, AZ',
        city: 'Tempe',
        state: 'AZ',
        date: '2026-03-28',
        time: '6:30 PM',
        organization: 'ICA Phoenix',
        contact_email: 'info@icaphoenix.org',
        website: 'https://www.icaphoenix.org',
        is_approved: true,
      },
    ];

    // Insert events into Supabase
    const { data, error } = await supabase
      .from('events')
      .insert(seedEvents)
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to seed events', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${data?.length || 0} events`,
      events: data,
    });
  } catch (error) {
    console.error('Error seeding events:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
