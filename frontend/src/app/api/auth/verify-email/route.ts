import { NextRequest, NextResponse } from 'next/server';

// Force Node.js runtime (not Edge) for longer timeout support
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Maximum timeout for Vercel hobby plan

const BACKEND_URL = process.env.BACKEND_URL?.replace(/\/$/, '');

async function proxyToBackend(
  request: NextRequest,
  method: 'GET' | 'POST' | 'PUT'
): Promise<NextResponse> {
  if (!BACKEND_URL) {
    return NextResponse.json(
      { error: 'BACKEND_URL is not configured on the frontend deployment.' },
      { status: 503 }
    );
  }

  const url = `${BACKEND_URL}/api/auth/verify-email`;
  
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Forward cookies so the backend can identify the user session
    const cookie = request.headers.get('cookie');
    if (cookie) {
      headers['Cookie'] = cookie;
    }
    
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
        body = '{}';
      }
    }

    console.log(`[verify-email proxy] ${method} ${url}`);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(url, {
      method,
      headers,
      body: method !== 'GET' ? body : undefined,
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    
    const responseText = await response.text();
    console.log(`[verify-email proxy] Response: ${response.status} - ${responseText.substring(0, 200)}`);
    
    // Build response, forwarding Set-Cookie headers from backend
    const proxyRes = new NextResponse(responseText, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
      },
    });

    // Forward any Set-Cookie headers from the backend
    const setCookies = response.headers.getSetCookie?.() || [];
    for (const sc of setCookies) {
      proxyRes.headers.append('Set-Cookie', sc);
    }

    return proxyRes;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error(`[verify-email proxy] Error: ${errorMessage}`);
    
    // Return a proper JSON error response
    return NextResponse.json(
      { 
        error: 'Backend service temporarily unavailable. Please try again in a moment.',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
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
