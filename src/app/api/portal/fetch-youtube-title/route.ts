import { NextResponse } from "next/server";
import { extractYoutubeId } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const urlParam = searchParams.get("url");

    if (!urlParam || !urlParam.trim()) {
      return NextResponse.json({ success: false, error: "Missing URL parameter." }, { status: 400 });
    }

    const videoId = extractYoutubeId(urlParam);
    if (!videoId || videoId.length !== 11) {
      return NextResponse.json({ success: false, error: "Invalid YouTube URL or Video ID." }, { status: 400 });
    }

    // 1. Fetch official YouTube oEmbed JSON endpoint (No API key required, fast & accurate)
    try {
      const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
      const oembedRes = await fetch(oembedUrl, {
        headers: {
          "Accept": "application/json"
        },
        next: { revalidate: 3600 }
      });

      if (oembedRes.ok) {
        const oembedData = await oembedRes.json();
        if (oembedData?.title && typeof oembedData.title === "string") {
          return NextResponse.json({
            success: true,
            title: oembedData.title.trim(),
            videoId,
            authorName: oembedData.author_name || ""
          });
        }
      }
    } catch (oembedErr) {
      console.warn("YouTube oEmbed fetch error, falling back to HTML parsing:", oembedErr);
    }

    // 2. Fallback: Fetch public YouTube watch page and parse meta tags
    try {
      const pageRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9"
        }
      });

      if (pageRes.ok) {
        const html = await pageRes.text();
        const ogMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["'](.*?)["']/i);
        if (ogMatch && ogMatch[1]) {
          return NextResponse.json({
            success: true,
            title: ogMatch[1].trim(),
            videoId
          });
        }

        const titleTagMatch = html.match(/<title>(.*?)<\/title>/i);
        if (titleTagMatch && titleTagMatch[1]) {
          const cleanTitle = titleTagMatch[1].replace(/ - YouTube$/i, "").trim();
          return NextResponse.json({
            success: true,
            title: cleanTitle,
            videoId
          });
        }
      }
    } catch (fallbackErr) {
      console.warn("YouTube HTML fallback scrape error:", fallbackErr);
    }

    return NextResponse.json({ success: false, error: "Could not fetch YouTube title." }, { status: 404 });
  } catch (error) {
    console.error("fetch-youtube-title route error:", error);
    return NextResponse.json({ success: false, error: "Internal server error." }, { status: 500 });
  }
}
