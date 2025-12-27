import { NextRequest, NextResponse } from 'next/server';

// Force Node.js runtime (not Edge) for longer timeout support
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.BACKEND_URL || 'https://hj-fashion-3.onrender.com';

async function proxyToBackend(
  request: NextRequest,
  method: 'GET' | 'POST' | 'PUT'
): Promise<NextResponse> {
  try {
    const url = `${BACKEND_URL}/api/auth/verify-email`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Copy auth headers if present
    const authHeader = request.headers.get('Authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    let body: string | undefined;
    if (method !== 'GET') {
      try {
        body = await request.text();
      } catch {
        body = undefined;
      }
    }

    // Simple fetch with generous timeout (no AbortController for max compatibility)
    const response = await fetch(url, {
      method,
      headers,
      body: method !== 'GET' ? body : undefined,
    });
    
    const responseText = await response.text();
    
    return new NextResponse(responseText, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
      },
    });
  } catch (err) {
    console.error('Proxy to backend failed:', err);
    return NextResponse.json(
      { error: 'Backend service temporarily unavailable. Please try again.' },
      { status: 502 }
    );
  }
}

export async function GET(request: NextRequest) {
  return proxyToBackend(request, 'GET');
}

export async function POST(request: NextRequest) {
  return proxyToBackend(request, 'POST');
}

export async function PUT(request: NextRequest) {
  return proxyToBackend(request, 'PUT');
}
