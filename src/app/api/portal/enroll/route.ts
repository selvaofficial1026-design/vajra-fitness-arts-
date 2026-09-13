import { NextResponse } from "next/server";
import { getPortalData, savePortalData, Student } from "@/lib/portalStore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, course, batch, age, gender, city, notes } = body;

    if (!name?.trim() || !phone?.trim() || !course?.trim() || !batch?.trim()) {
      return NextResponse.json(
        { success: false, error: "Name, Phone, Course, and Batch are required." },
        { status: 400 }
      );
    }

    const data = await getPortalData();

    // Generate unique temporary code
    let tempCode = "";
    let isUnique = false;
    while (!isUnique) {
      const randNum = Math.floor(1000 + Math.random() * 9000);
      tempCode = `TEMP-${randNum}`;
      if (!data.students.some((s) => s.tempCode === tempCode)) {
        isUnique = true;
      }
    }

    const newStudent: Student = {
      id: `std_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      tempCode,
      permanentCode: null,
      name: name.trim(),
      phone: phone.trim(),
      course: course.trim(),
      batch: batch.trim(),
      age: age ? String(age).trim() : "",
      gender: gender ? String(gender).trim() : "",
      city: city ? String(city).trim() : "Ariyalur",
      notes: notes ? String(notes).trim() : "",
      status: "PENDING",
      createdAt: new Date().toISOString(),
      approvedAt: null
    };

    data.students.unshift(newStudent);
    await savePortalData(data);

    return NextResponse.json({
      success: true,
      message: "Enrollment request submitted successfully!",
      student: newStudent,
      tempCode: newStudent.tempCode
    });
  } catch (error) {
    console.error("Enrollment error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process enrollment request." },
      { status: 500 }
    );
  }
}
