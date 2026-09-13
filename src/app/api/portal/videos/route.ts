import { NextResponse } from "next/server";
import { getPortalData } from "@/lib/portalStore";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const course = searchParams.get("course")?.trim();

    const data = await getPortalData();
    let videos = data.videos;

    if (course && course.toLowerCase() !== "all" && course.toLowerCase() !== "all courses") {
      videos = videos.filter(
        (v) =>
          v.course.toLowerCase() === course.toLowerCase() ||
          v.course.toLowerCase() === "all" ||
          v.course.toLowerCase() === "all courses"
      );
    }

    return NextResponse.json({
      success: true,
      videos
    });
  } catch (error) {
    console.error("Videos GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch video classes." }, { status: 500 });
  }
}
