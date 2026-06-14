import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side proxy for TikTok CDN images (avatar covers, video covers).
 *
 * TikTok's CDN (`p16-*.tiktokcdn.com`, `p77-*.tiktokcdn-us.com`, etc.)
 * rejects `<img src>` requests from non-tiktok.com origins via referer
 * policy — the response comes back blank/403. Routing the URL through
 * this Next.js route works around that because the fetch is performed
 * server-side without a browser `Referer` header.
 *
 * Usage from the client:
 *   `<img src={`/api/tiktok-image?url=${encodeURIComponent(originalUrl)}`} />`
 *
 * Only hosts on the allow-list below are proxied — this keeps the route
 * from being abused as a generic open proxy.
 */

const ALLOWED_HOST_FRAGMENTS = [
  "tiktokcdn.com",
  "tiktokcdn-us.com",
  "tiktokcdn-eu.com",
  "byteimg.com",
  "bytedance.com",
  // Echotik re-hosts TikTok user avatars & video covers on their own CDN
  "echotik.live",
];

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "Missing 'url' query parameter" },
      { status: 400 }
    );
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return NextResponse.json(
      { error: "Only http(s) URLs are allowed" },
      { status: 400 }
    );
  }

  const hostAllowed = ALLOWED_HOST_FRAGMENTS.some((frag) =>
    parsed.hostname.includes(frag)
  );
  if (!hostAllowed) {
    return NextResponse.json(
      { error: "Host not allowed", host: parsed.hostname },
      { status: 403 }
    );
  }

  let upstream: Response;
  try {
    upstream = await fetch(parsed.toString(), {
      // Pretend to be a regular browser; intentionally omit Referer so the
      // CDN's hot-link rules see a request that looks like it came from
      // tiktok.com itself.
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "image/avif,image/webp,image/png,image/jpeg,*/*",
      },
      cache: "no-store",
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Upstream fetch failed", details: String(err) },
      { status: 502 }
    );
  }

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json(
      { error: "Upstream returned non-OK", status: upstream.status },
      { status: upstream.status === 404 ? 404 : 502 }
    );
  }

  const contentType =
    upstream.headers.get("content-type") ?? "image/jpeg";

  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      // Cache aggressively at the edge — TikTok avatars rarely change.
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
