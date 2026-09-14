import { NextResponse } from "next/server";
import { getPortalData } from "@/lib/portalStore";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code")?.trim().toUpperCase();

    if (!code) {
      return NextResponse.json(
        { success: false, error: "Temporary code is required." },
        { status: 400 }
      );
    }

    const data = await getPortalData();
    const cleanDigits = code.replace(/\D/g, "");
    const student = data.students.find(
      (s) =>
        s.tempCode.toUpperCase() === code ||
        (s.permanentCode && s.permanentCode.toUpperCase() === code) ||
        (cleanDigits.length >= 10 && s.phone.replace(/\D/g, "") === cleanDigits)
    );

    if (!student) {
      return NextResponse.json(
        { success: false, error: "No student enrollment found with this code or phone number. Please verify your details." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      student
    });
  } catch (error) {
    console.error("Track error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to look up enrollment status." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const code = body.code?.trim().toUpperCase();

    if (!code) {
      return NextResponse.json(
        { success: false, error: "Tracking code or phone number is required." },
        { status: 400 }
      );
    }

    const data = await getPortalData();
    const cleanDigits = code.replace(/\D/g, "");
    const student = data.students.find(
      (s) =>
        s.tempCode.toUpperCase() === code ||
        (s.permanentCode && s.permanentCode.toUpperCase() === code) ||
        (cleanDigits.length >= 10 && s.phone.replace(/\D/g, "") === cleanDigits)
    );

    if (!student) {
      return NextResponse.json(
        { success: false, error: "No student enrollment found with this code or phone number. Please verify your details." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      student
    });
  } catch (error) {
    console.error("Track error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to look up enrollment status." },
      { status: 500 }
    );
  }
}
