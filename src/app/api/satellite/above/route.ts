import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://api.n2yo.com/rest/v1/satellite';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const alt = searchParams.get('alt');
  const radius = searchParams.get('radius');
  const category = searchParams.get('category');
  const apiKey = searchParams.get('apiKey');

  if (!lat || !lng || !alt || !radius || !category || !apiKey) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    const url = `${BASE_URL}/above/${lat}/${lng}/${alt}/${radius}/${category}/?apiKey=${apiKey}`;
    console.log('Fetching satellites above from:', url);
    
    const res = await fetch(url);
    const data = await res.json();
    
    console.log('Satellites above response:', data);
    
    if (!res.ok) {
      console.error('N2YO API error:', data);
      return NextResponse.json({ error: data.error || 'API request failed', above: [] }, { status: res.status });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch satellites above:', error);
    return NextResponse.json({ error: 'Failed to fetch satellites above', above: [] }, { status: 500 });
  }
}
