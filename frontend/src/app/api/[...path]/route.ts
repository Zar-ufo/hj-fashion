import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const BACKEND_URL = process.env.BACKEND_URL || 'https://hj-fashion0.vercel.app';

async function proxy(request: NextRequest, method: string, path: string[]) {
  const pathname = path.join('/');
  const search = request.nextUrl.search || '';
  const targetUrl = `${BACKEND_URL}/api/${pathname}${search}`;

  try {
    const headers = new Headers();

    const contentType = request.headers.get('content-type');
    if (contentType) {
      headers.set('content-type', contentType);
    }

    const cookie = request.headers.get('cookie');
    if (cookie) {
      headers.set('cookie', cookie);
    }

    const authorization = request.headers.get('authorization');
    if (authorization) {
      headers.set('authorization', authorization);
    }

    const body = method === 'GET' || method === 'HEAD' ? undefined : await request.text();

    const upstreamResponse = await fetch(targetUrl, {
      method,
      headers,
      body,
      cache: 'no-store',
    });

    const responseText = await upstreamResponse.text();
    const response = new NextResponse(responseText, {
      status: upstreamResponse.status,
      headers: {
        'content-type': upstreamResponse.headers.get('content-type') || 'application/json',
      },
    });

    const setCookies = upstreamResponse.headers.getSetCookie?.() || [];
    for (const cookieValue of setCookies) {
      response.headers.append('set-cookie', cookieValue);
    }

    return response;
  } catch (error) {
    console.error(`[api proxy] ${method} /api/${pathname} failed:`, error);
    return NextResponse.json(
      { error: 'Backend service is temporarily unavailable.' },
      { status: 502 }
    );
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return proxy(request, 'GET', path);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return proxy(request, 'POST', path);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return proxy(request, 'PUT', path);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return proxy(request, 'PATCH', path);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return proxy(request, 'DELETE', path);
}
