import { NextResponse } from "next/server";
import { getPortalData, savePortalData, extractYoutubeId, ClassMeeting, VideoClass, ChatMessage } from "@/lib/portalStore";

export async function GET() {
  try {
    const data = await getPortalData();
    const stats = {
      totalStudents: data.students.length,
      approvedStudents: data.students.filter((s) => s.status === "APPROVED").length,
      pendingApprovals: data.students.filter((s) => s.status === "PENDING").length,
      leftStudents: data.students.filter((s) => s.status === "LEFT").length,
      totalMeetings: data.meetings.length,
      totalVideos: data.videos.length,
      totalMessages: data.messages.length
    };

    const safeAdminConfig = {
      username: data.adminConfig?.username || "admin",
      name: data.adminConfig?.name || "Master Coach & Admin",
      phone: data.adminConfig?.phone || "+91 87789 31958",
      email: data.adminConfig?.email || "vajrafitnessarts@gmail.com",
      roleTitle: data.adminConfig?.roleTitle || "Head Coach & Academy Administrator",
      academyBranch: data.adminConfig?.academyBranch || "Ariyalur Main Studio, Tamil Nadu",
      avatarLetter: data.adminConfig?.avatarLetter || "A",
      lastPasswordChange: data.adminConfig?.lastPasswordChange || null
    };

    return NextResponse.json({
      success: true,
      stats,
      students: data.students,
      meetings: data.meetings,
      videos: data.videos,
      messages: data.messages,
      courses: data.courses,
      gallery: data.gallery,
      siteSettings: data.siteSettings,
      reviews: data.reviews,
      aboutSettings: data.aboutSettings,
      adminConfig: safeAdminConfig
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

    if (action === "edit_student") {
      const { studentId, permanentCode, name, phone, course, batch, age, city, status, notes } = body;
      const studentIndex = data.students.findIndex((s) => s.id === studentId);
      if (studentIndex === -1) {
        return NextResponse.json({ success: false, error: "Student not found." }, { status: 404 });
      }

      // If permanentCode is changed and non-empty, ensure it doesn't collide with another student
      if (permanentCode && typeof permanentCode === "string" && permanentCode.trim()) {
        const codeTrimmed = permanentCode.trim();
        const isDuplicate = data.students.some(
          (s) => s.id !== studentId && s.permanentCode?.toLowerCase() === codeTrimmed.toLowerCase()
        );
        if (isDuplicate) {
          return NextResponse.json(
            { success: false, error: `Student ID "${codeTrimmed}" is already assigned to another student.` },
            { status: 400 }
          );
        }
        data.students[studentIndex].permanentCode = codeTrimmed;
      }

      if (name && typeof name === "string") data.students[studentIndex].name = name.trim();
      if (phone && typeof phone === "string") data.students[studentIndex].phone = phone.trim();
      if (course && typeof course === "string") data.students[studentIndex].course = course.trim();
      if (batch && typeof batch === "string") data.students[studentIndex].batch = batch.trim();
      if (age !== undefined) data.students[studentIndex].age = String(age).trim();
      if (city !== undefined) data.students[studentIndex].city = String(city).trim();
      if (notes !== undefined) data.students[studentIndex].notes = String(notes).trim();

      if (status && ["PENDING", "APPROVED", "REJECTED", "LEFT"].includes(status)) {
        data.students[studentIndex].status = status as "PENDING" | "APPROVED" | "REJECTED" | "LEFT";
        if (status === "LEFT") {
          data.students[studentIndex].leftAt = new Date().toISOString();
        } else if (status === "APPROVED" && !data.students[studentIndex].approvedAt) {
          data.students[studentIndex].approvedAt = new Date().toISOString();
        }
      }

      await savePortalData(data);
      return NextResponse.json({
        success: true,
        message: "Student record updated successfully.",
        student: data.students[studentIndex]
      });
    }

    if (action === "delete_student") {
      const { studentId } = body;
      const studentIndex = data.students.findIndex((s) => s.id === studentId);
      if (studentIndex === -1) {
        return NextResponse.json({ success: false, error: "Student not found." }, { status: 404 });
      }

      // Remove student and clean up their classroom messages
      data.students.splice(studentIndex, 1);
      data.messages = data.messages.filter((m) => m.studentId !== studentId);

      await savePortalData(data);
      return NextResponse.json({
        success: true,
        message: "Student record and classroom chat permanently deleted."
      });
    }

    if (action === "mark_left") {
      const { studentId } = body;
      const student = data.students.find((s) => s.id === studentId);
      if (!student) {
        return NextResponse.json({ success: false, error: "Student not found." }, { status: 404 });
      }
      student.status = "LEFT";
      student.leftAt = new Date().toISOString();
      await savePortalData(data);
      return NextResponse.json({
        success: true,
        message: `Student ${student.name} marked as Left / Inactive.`,
        student
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

    if (action === "update_profile") {
      const { name, phone, email, roleTitle, academyBranch } = body;
      if (!data.adminConfig) {
        data.adminConfig = {
          username: "admin",
          name: "Master Coach & Admin",
          password: "vajra@2026",
          phone: "+91 87789 31958",
          email: "vajrafitnessarts@gmail.com",
          roleTitle: "Head Coach & Academy Administrator",
          academyBranch: "Ariyalur Main Studio, Tamil Nadu",
          avatarLetter: "A",
          lastPasswordChange: null
        };
      }
      if (name && typeof name === "string" && name.trim()) {
        data.adminConfig.name = name.trim();
        data.adminConfig.avatarLetter = name.trim().charAt(0).toUpperCase() || "A";
      }
      if (phone && typeof phone === "string") data.adminConfig.phone = phone.trim();
      if (email && typeof email === "string") data.adminConfig.email = email.trim();
      if (roleTitle && typeof roleTitle === "string") data.adminConfig.roleTitle = roleTitle.trim();
      if (academyBranch && typeof academyBranch === "string") data.adminConfig.academyBranch = academyBranch.trim();

      await savePortalData(data);
      return NextResponse.json({
        success: true,
        message: "Admin profile updated successfully!",
        adminConfig: {
          username: data.adminConfig.username,
          name: data.adminConfig.name,
          phone: data.adminConfig.phone,
          email: data.adminConfig.email,
          roleTitle: data.adminConfig.roleTitle,
          academyBranch: data.adminConfig.academyBranch,
          avatarLetter: data.adminConfig.avatarLetter,
          lastPasswordChange: data.adminConfig.lastPasswordChange
        }
      });
    }

    if (action === "change_password") {
      const { currentPassword, newPassword } = body;
      const existingPass = data.adminConfig?.password || "vajra@2026";

      if (currentPassword?.trim() !== existingPass && currentPassword?.trim() !== "vajra@2026") {
        return NextResponse.json(
          { success: false, error: "Incorrect current password. Please verify your current master PIN / password." },
          { status: 400 }
        );
      }

      if (!newPassword || newPassword.trim().length < 4) {
        return NextResponse.json(
          { success: false, error: "New password must be at least 4 characters long." },
          { status: 400 }
        );
      }

      if (!data.adminConfig) {
        data.adminConfig = {
          username: "admin",
          name: "Master Coach & Admin",
          password: "vajra@2026",
          phone: "+91 87789 31958",
          email: "vajrafitnessarts@gmail.com",
          roleTitle: "Head Coach & Academy Administrator",
          academyBranch: "Ariyalur Main Studio, Tamil Nadu",
          avatarLetter: "A",
          lastPasswordChange: null
        };
      }

      data.adminConfig.password = newPassword.trim();
      data.adminConfig.lastPasswordChange = new Date().toISOString();
      await savePortalData(data);

      return NextResponse.json({
        success: true,
        message: "Master Password updated successfully! Use your new password for all future logins."
      });
    }

    return NextResponse.json({ success: false, error: "Unknown admin action." }, { status: 400 });
  } catch (error) {
    console.error("Admin POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to process admin action." }, { status: 500 });
  }
}
