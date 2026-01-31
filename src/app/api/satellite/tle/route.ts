import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://api.n2yo.com/rest/v1/satellite';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const satId = searchParams.get('satId');
  const apiKey = searchParams.get('apiKey');

  if (!satId || !apiKey) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    const url = `${BASE_URL}/tle/${satId}/?apiKey=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch TLE' }, { status: 500 });
  }
}
