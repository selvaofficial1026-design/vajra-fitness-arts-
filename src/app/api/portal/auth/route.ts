import { NextResponse } from "next/server";
import { getPortalData } from "@/lib/portalStore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, username, code, password } = body;

    if (type === "admin") {
      const cleanUser = username?.trim().toLowerCase();
      const cleanPass = password?.trim();

      if (
        (cleanUser === "admin" || cleanUser === "coach" || cleanUser === "vajra") &&
        (cleanPass === "vajra@2026" || cleanPass === "admin123" || cleanPass === "vajra123")
      ) {
        return NextResponse.json({
          success: true,
          role: "admin",
          user: {
            id: "admin_1",
            name: "Head Coach & Admin",
            username: "admin",
            role: "admin"
          }
        });
      }

      return NextResponse.json(
        { success: false, error: "Invalid Admin username or password." },
        { status: 401 }
      );
    }

    // Student Authentication
    const cleanUsername = username?.trim().toLowerCase();
    const cleanCode = code?.trim().toLowerCase();

    if (!cleanUsername || !cleanCode) {
      return NextResponse.json(
        { success: false, error: "Please provide both your Username and Permanent Student Code (vajra-xxxx)." },
        { status: 400 }
      );
    }

    const data = await getPortalData();
    const student = data.students.find((s) => {
      const matchCode = s.permanentCode && s.permanentCode.toLowerCase() === cleanCode;
      const matchNameOrPhone =
        s.name.toLowerCase() === cleanUsername ||
        s.name.toLowerCase().includes(cleanUsername) ||
        s.phone.replace(/\D/g, "") === cleanUsername.replace(/\D/g, "");
      return matchCode && matchNameOrPhone;
    });

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid credentials. Please verify your Username and Permanent Student Code (vajra-xxxx)."
        },
        { status: 401 }
      );
    }

    if (student.status !== "APPROVED") {
      return NextResponse.json(
        {
          success: false,
          error: "Your enrollment is currently pending admin approval. Please track your status using your temporary code."
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      role: "student",
      user: student
    });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { success: false, error: "Authentication failed. Please try again." },
      { status: 500 }
    );
  }
}
