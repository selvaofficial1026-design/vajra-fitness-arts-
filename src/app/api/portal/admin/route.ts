import { NextResponse } from "next/server";
import { getPortalData, savePortalData, extractYoutubeId, ClassMeeting, VideoClass, ChatMessage } from "@/lib/portalStore";

export async function GET() {
  try {
    const data = await getPortalData();
    const stats = {
      totalStudents: data.students.length,
      approvedStudents: data.students.filter((s) => s.status === "APPROVED").length,
      pendingApprovals: data.students.filter((s) => s.status === "PENDING").length,
      totalMeetings: data.meetings.length,
      totalVideos: data.videos.length,
      totalMessages: data.messages.length
    };

    return NextResponse.json({
      success: true,
      stats,
      students: data.students,
      meetings: data.meetings,
      videos: data.videos,
      messages: data.messages
    });
  } catch (error) {
    console.error("Admin GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch admin data." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;
    const data = await getPortalData();

    if (action === "approve") {
      const { studentId } = body;
      const studentIndex = data.students.findIndex((s) => s.id === studentId);
      if (studentIndex === -1) {
        return NextResponse.json({ success: false, error: "Student not found." }, { status: 404 });
      }

      // Generate permanent vajra-xxxx code
      let permanentCode = "";
      let isUnique = false;
      while (!isUnique) {
        const randNum = Math.floor(1000 + Math.random() * 9000);
        permanentCode = `vajra-${randNum}`;
        if (!data.students.some((s) => s.permanentCode === permanentCode)) {
          isUnique = true;
        }
      }

      data.students[studentIndex].status = "APPROVED";
      data.students[studentIndex].permanentCode = permanentCode;
      data.students[studentIndex].approvedAt = new Date().toISOString();

      // Automatically add a welcome message to this student's chat
      const welcomeMsg: ChatMessage = {
        id: `msg_${Date.now()}`,
        studentId: data.students[studentIndex].id,
        sender: "admin",
        text: `Namaskaram ${data.students[studentIndex].name}! Your admission for ${data.students[studentIndex].course} (${data.students[studentIndex].batch}) is approved! Your permanent login code is ${permanentCode}. Welcome to Vajra Fitness Arts!`,
        timestamp: new Date().toISOString(),
        isRead: false
      };
      data.messages.push(welcomeMsg);

      await savePortalData(data);
      return NextResponse.json({
        success: true,
        message: `Student approved! Permanent Code: ${permanentCode}`,
        student: data.students[studentIndex]
      });
    }

    if (action === "reject") {
      const { studentId } = body;
      const studentIndex = data.students.findIndex((s) => s.id === studentId);
      if (studentIndex === -1) {
        return NextResponse.json({ success: false, error: "Student not found." }, { status: 404 });
      }

      data.students[studentIndex].status = "REJECTED";
      await savePortalData(data);
      return NextResponse.json({
        success: true,
        message: "Student enrollment request rejected.",
        student: data.students[studentIndex]
      });
    }

    if (action === "add_meeting") {
      const { course, batch, title, meetUrl, scheduledTime, instructor } = body;
      if (!title || !meetUrl || !course || !batch) {
        return NextResponse.json(
          { success: false, error: "Course, Batch, Title, and Google Meet URL are required." },
          { status: 400 }
        );
      }

      const newMeeting: ClassMeeting = {
        id: `meet_${Date.now()}`,
        course: course.trim(),
        batch: batch.trim(),
        title: title.trim(),
        meetUrl: meetUrl.trim(),
        scheduledTime: scheduledTime?.trim() || "Daily Class",
        instructor: instructor?.trim() || "Head Coach",
        isActive: true,
        createdAt: new Date().toISOString()
      };

      data.meetings.unshift(newMeeting);
      await savePortalData(data);

      return NextResponse.json({
        success: true,
        message: "Google Meet link published successfully!",
        meeting: newMeeting
      });
    }

    if (action === "delete_meeting") {
      const { meetingId } = body;
      data.meetings = data.meetings.filter((m) => m.id !== meetingId);
      await savePortalData(data);
      return NextResponse.json({ success: true, message: "Class meeting deleted successfully." });
    }

    if (action === "toggle_meeting") {
      const { meetingId } = body;
      const meeting = data.meetings.find((m) => m.id === meetingId);
      if (meeting) {
        meeting.isActive = !meeting.isActive;
        await savePortalData(data);
      }
      return NextResponse.json({ success: true, message: "Meeting status toggled." });
    }

    if (action === "add_video") {
      const { youtubeUrl, title, course, category, description } = body;
      if (!youtubeUrl || !title || !course) {
        return NextResponse.json(
          { success: false, error: "YouTube URL, Title, and Course are required." },
          { status: 400 }
        );
      }

      const youtubeId = extractYoutubeId(youtubeUrl);
      const newVideo: VideoClass = {
        id: `vid_${Date.now()}`,
        youtubeUrl: youtubeUrl.trim(),
        youtubeId,
        title: title.trim(),
        course: course.trim(),
        category: category?.trim() || "Course Training",
        description: description?.trim() || "",
        addedAt: new Date().toISOString()
      };

      data.videos.unshift(newVideo);
      await savePortalData(data);

      return NextResponse.json({
        success: true,
        message: "YouTube video lesson added successfully!",
        video: newVideo
      });
    }

    if (action === "delete_video") {
      const { videoId } = body;
      data.videos = data.videos.filter((v) => v.id !== videoId);
      await savePortalData(data);
      return NextResponse.json({ success: true, message: "Video lesson deleted successfully." });
    }

    return NextResponse.json({ success: false, error: "Unknown admin action." }, { status: 400 });
  } catch (error) {
    console.error("Admin POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to process admin action." }, { status: 500 });
  }
}
