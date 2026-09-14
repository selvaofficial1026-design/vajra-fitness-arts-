import { NextResponse } from "next/server";
import { getPortalData } from "@/lib/portalStore";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const course = searchParams.get("course")?.trim();

    const data = await getPortalData();
    let videos = data.videos;

    if (course && course.toLowerCase() !== "all" && course.toLowerCase() !== "all courses") {
      const cleanCourse = course.toLowerCase().trim();
      videos = videos.filter((v) => {
        const vCourse = (v.course || "").toLowerCase().trim();
        return (
          vCourse === cleanCourse ||
          vCourse.includes(cleanCourse) ||
          cleanCourse.includes(vCourse) ||
          vCourse === "all" ||
          vCourse.includes("all")
        );
      });
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
