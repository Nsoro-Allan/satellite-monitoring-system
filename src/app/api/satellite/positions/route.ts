import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://api.n2yo.com/rest/v1/satellite';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const satId = searchParams.get('satId');
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const alt = searchParams.get('alt');
  const seconds = searchParams.get('seconds');
  const apiKey = searchParams.get('apiKey');

  if (!satId || !lat || !lng || !alt || !seconds || !apiKey) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    const url = `${BASE_URL}/positions/${satId}/${lat}/${lng}/${alt}/${seconds}/?apiKey=${apiKey}`;
    console.log('Fetching positions from:', url);
    
    const res = await fetch(url);
    const data = await res.json();
    
    console.log('Positions response:', data);
    
    if (!res.ok) {
      console.error('N2YO API error:', data);
      return NextResponse.json({ error: data.error || 'API request failed', positions: [] }, { status: res.status });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch positions:', error);
    return NextResponse.json({ error: 'Failed to fetch positions', positions: [] }, { status: 500 });
  }
}
