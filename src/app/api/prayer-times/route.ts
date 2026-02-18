import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const city = searchParams.get('city');
    const state = searchParams.get('state');

    let url: string;
    
    if (city && state) {
      // Use address-based endpoint
      url = `https://api.aladhan.com/v1/timingsByAddress?address=${encodeURIComponent(`${city}, ${state}, USA`)}&method=2&school=0`;
    } else if (lat && lng) {
      // Use coordinate-based endpoint
      url = `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=2&school=0`;
    } else {
      return NextResponse.json(
        { error: 'Either coordinates (lat/lng) or city/state must be provided' },
        { status: 400 }
      );
    }

    const res = await fetch(url, { 
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!res.ok) {
      throw new Error(`AlAdhan API error: ${res.statusText}`);
    }

    const data = await res.json();

    if (data.code !== 200 || !data.data) {
      return NextResponse.json(
        { error: 'Invalid response from AlAdhan API' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      timings: data.data.timings,
      hijri: data.data.date.hijri,
      gregorian: data.data.date.gregorian,
      meta: data.data.meta,
    });
  } catch (error) {
    console.error('Prayer times API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prayer times' },
      { status: 500 }
    );
  }
}
