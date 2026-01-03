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
    const res = await fetch(
      `${BASE_URL}/above/${lat}/${lng}/${alt}/${radius}/${category}/&apiKey=${apiKey}`
    );
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch satellites above' }, { status: 500 });
  }
}
