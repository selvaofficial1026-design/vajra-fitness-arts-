import { NextResponse } from "next/server";
import { getPortalData, savePortalData, ChatMessage } from "@/lib/portalStore";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId")?.trim();

    const data = await getPortalData();

    if (studentId) {
      const messages = data.messages.filter((m) => m.studentId === studentId);
      return NextResponse.json({ success: true, messages });
    }

    return NextResponse.json({ success: true, messages: data.messages });
  } catch (error) {
    console.error("Messages GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch messages." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentId, sender, text } = body;

    if (!studentId || !sender || !text?.trim()) {
      return NextResponse.json(
        { success: false, error: "Student ID, Sender, and Message text are required." },
        { status: 400 }
      );
    }

    const data = await getPortalData();

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      studentId: studentId.trim(),
      sender: sender === "admin" ? "admin" : "student",
      text: text.trim(),
      timestamp: new Date().toISOString(),
      isRead: false
    };

    data.messages.push(newMessage);
    await savePortalData(data);

    return NextResponse.json({
      success: true,
      message: newMessage
    });
  } catch (error) {
    console.error("Messages POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to send message." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { studentId, sender } = body;

    const data = await getPortalData();
    let updated = false;

    data.messages = data.messages.map((m) => {
      const studentMatch = !studentId || m.studentId === studentId;
      const senderMatch = !sender || m.sender === sender;
      if (studentMatch && senderMatch && !m.isRead) {
        updated = true;
        return { ...m, isRead: true };
      }
      return m;
    });

    if (updated) {
      await savePortalData(data);
    }

    return NextResponse.json({ success: true, updated });
  } catch (error) {
    console.error("Messages PATCH error:", error);
    return NextResponse.json({ success: false, error: "Failed to update message status." }, { status: 500 });
  }
}

