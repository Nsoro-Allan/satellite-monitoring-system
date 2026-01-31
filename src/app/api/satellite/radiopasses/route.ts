import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://api.n2yo.com/rest/v1/satellite';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const satId = searchParams.get('satId');
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const alt = searchParams.get('alt');
  const days = searchParams.get('days');
  const minElevation = searchParams.get('minElevation');
  const apiKey = searchParams.get('apiKey');

  if (!satId || !lat || !lng || !alt || !days || !minElevation || !apiKey) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    const url = `${BASE_URL}/radiopasses/${satId}/${lat}/${lng}/${alt}/${days}/${minElevation}/?apiKey=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch radio passes' }, { status: 500 });
  }
}
