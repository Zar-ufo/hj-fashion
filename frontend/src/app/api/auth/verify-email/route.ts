import { NextRequest, NextResponse } from 'next/server';

// Force Node.js runtime (not Edge) for longer timeout support
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Maximum timeout for Vercel hobby plan

const BACKEND_URL = process.env.BACKEND_URL || 'https://hj-fashion-3.onrender.com';

async function proxyToBackend(
  request: NextRequest,
  method: 'GET' | 'POST' | 'PUT'
): Promise<NextResponse> {
  const url = `${BACKEND_URL}/api/auth/verify-email`;
  
  try {
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
        body = '{}';
      }
    }

    console.log(`[verify-email proxy] ${method} ${url}`);

    const response = await fetch(url, {
      method,
      headers,
      body: method !== 'GET' ? body : undefined,
      cache: 'no-store',
    });
    
    const responseText = await response.text();
    console.log(`[verify-email proxy] Response: ${response.status} - ${responseText.substring(0, 100)}`);
    
    // Return the response as-is
    return new NextResponse(responseText, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
      },
    });
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
