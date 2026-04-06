import { NextRequest, NextResponse } from 'next/server';

/**
 * Webpay Plus redirects here via POST with token_ws in the form body.
 * We extract the token and redirect (GET) to the confirm page with token_ws as a query param,
 * so the client component can read it from searchParams.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const formData = await request.formData();
  const tokenWs = formData.get('token_ws') as string | null;

  if (!tokenWs) {
    return NextResponse.redirect(new URL(`/${slug}/payments/confirm?error=no_token`, request.url));
  }

  return NextResponse.redirect(new URL(`/${slug}/payments/confirm?token_ws=${tokenWs}`, request.url));
}

/**
 * Some Transbank flows may redirect via GET with token_ws as query param.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const tokenWs = request.nextUrl.searchParams.get('token_ws');

  if (!tokenWs) {
    return NextResponse.redirect(new URL(`/${slug}/payments/confirm?error=no_token`, request.url));
  }

  return NextResponse.redirect(new URL(`/${slug}/payments/confirm?token_ws=${tokenWs}`, request.url));
}
