import { NextResponse } from "next/server";
import { getPortalData } from "@/lib/portalStore";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const course = searchParams.get("course")?.trim();
    const batch = searchParams.get("batch")?.trim();

    const data = await getPortalData();
    let meetings = data.meetings;

    if (course && course.toLowerCase() !== "all" && course.toLowerCase() !== "all courses") {
      meetings = meetings.filter(
        (m) =>
          m.course.toLowerCase() === course.toLowerCase() ||
          m.course.toLowerCase() === "all" ||
          m.course.toLowerCase() === "all courses"
      );
    }

    if (batch && batch.toLowerCase() !== "all" && batch.toLowerCase() !== "all batches") {
      meetings = meetings.filter(
        (m) =>
          m.batch.toLowerCase() === batch.toLowerCase() ||
          m.batch.toLowerCase() === "all" ||
          m.batch.toLowerCase() === "all batches"
      );
    }

    return NextResponse.json({
      success: true,
      meetings
    });
  } catch (error) {
    console.error("Meet GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch meet links." }, { status: 500 });
  }
}
