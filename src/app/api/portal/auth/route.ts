import { NextResponse } from "next/server";
import { getPortalData, savePortalData } from "@/lib/portalStore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, action, username, code, password } = body;

    // Student Password Change Action
    if (action === "change_student_password") {
      const { studentId, currentCode, newPassword } = body;
      if (!studentId || !currentCode || !newPassword) {
        return NextResponse.json(
          { success: false, error: "Please enter your Current Student Code and New Password." },
          { status: 400 }
        );
      }
      if (newPassword.trim().length < 4) {
        return NextResponse.json(
          { success: false, error: "New password must be at least 4 characters long." },
          { status: 400 }
        );
      }

      const data = await getPortalData();
      const studentIndex = data.students.findIndex((s) => s.id === studentId);
      if (studentIndex === -1) {
        return NextResponse.json({ success: false, error: "Student account not found." }, { status: 404 });
      }

      const student = data.students[studentIndex];
      const cleanInputCode = currentCode.trim().toLowerCase();
      const validCurrentCode =
        (student.permanentCode && student.permanentCode.toLowerCase() === cleanInputCode) ||
        (student.password && student.password.toLowerCase() === cleanInputCode) ||
        (student.tempCode && student.tempCode.toLowerCase() === cleanInputCode);

      if (!validCurrentCode) {
        return NextResponse.json(
          { success: false, error: "Incorrect Current Student ID / Code. Please check and try again." },
          { status: 400 }
        );
      }

      student.password = newPassword.trim();
      await savePortalData(data);

      return NextResponse.json({
        success: true,
        message: "Password updated successfully! You can now use your new password or student ID to sign in.",
        student
      });
    }

    if (type === "admin") {
      const cleanUser = username?.trim().toLowerCase();
      const cleanPass = password?.trim();

      const data = await getPortalData();
      const currentPassword = data.adminConfig?.password || "vajra@2026";
      const configuredUser = (data.adminConfig?.username || "admin").toLowerCase();

      const isUserValid = cleanUser === configuredUser || cleanUser === "admin" || cleanUser === "coach" || cleanUser === "vajra";
      // If admin has changed their password, only the configured password is valid; otherwise fallback to vajra@2026
      const isPassValid = cleanPass === currentPassword || (cleanPass === "vajra@2026" && !data.adminConfig?.lastPasswordChange);

      if (isUserValid && isPassValid) {
        return NextResponse.json({
          success: true,
          role: "admin",
          user: {
            id: "admin_1",
            name: data.adminConfig?.name || "Master Coach & Admin",
            username: data.adminConfig?.username || "admin",
            role: "admin",
            roleTitle: data.adminConfig?.roleTitle || "Head Coach & Academy Administrator",
            avatarLetter: data.adminConfig?.avatarLetter || "A"
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
        { success: false, error: "Please provide both your Username and Student ID / Password." },
        { status: 400 }
      );
    }

    const data = await getPortalData();
    const student = data.students.find((s) => {
      const matchCode =
        (s.permanentCode && s.permanentCode.toLowerCase() === cleanCode) ||
        (s.password && s.password.toLowerCase() === cleanCode);
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
