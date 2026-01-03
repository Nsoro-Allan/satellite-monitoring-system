import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://api.n2yo.com/rest/v1/satellite';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const satId = searchParams.get('satId');
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const alt = searchParams.get('alt');
  const days = searchParams.get('days');
  const minVisibility = searchParams.get('minVisibility');
  const apiKey = searchParams.get('apiKey');

  if (!satId || !lat || !lng || !alt || !days || !minVisibility || !apiKey) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    const res = await fetch(
      `${BASE_URL}/visualpasses/${satId}/${lat}/${lng}/${alt}/${days}/${minVisibility}/&apiKey=${apiKey}`
    );
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch visual passes' }, { status: 500 });
  }
}
