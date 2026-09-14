import { NextResponse } from "next/server";
import {
  getPortalData,
  savePortalData,
  CourseItem,
  GalleryItem,
  SiteSettings,
  ReviewItem,
  DEFAULT_COURSES,
  DEFAULT_GALLERY,
  DEFAULT_SITE_SETTINGS,
  DEFAULT_REVIEWS,
  DEFAULT_ABOUT_SETTINGS,
  AboutSettings
} from "@/lib/portalStore";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    const data = await getPortalData();
    const courses = data.courses && data.courses.length > 0 ? data.courses : DEFAULT_COURSES;
    const gallery = data.gallery && data.gallery.length > 0 ? data.gallery : DEFAULT_GALLERY;
    const siteSettings = data.siteSettings || DEFAULT_SITE_SETTINGS;
    const reviews = data.reviews && data.reviews.length > 0 ? data.reviews : DEFAULT_REVIEWS;
    const aboutSettings = data.aboutSettings || DEFAULT_ABOUT_SETTINGS;

    if (type === "courses") {
      return NextResponse.json({ success: true, courses });
    }
    if (type === "gallery") {
      return NextResponse.json({ success: true, gallery });
    }
    if (type === "settings") {
      return NextResponse.json({ success: true, siteSettings });
    }
    if (type === "reviews") {
      return NextResponse.json({ success: true, reviews });
    }
    if (type === "about") {
      return NextResponse.json({ success: true, aboutSettings });
    }

    return NextResponse.json({
      success: true,
      courses,
      gallery,
      siteSettings,
      reviews,
      aboutSettings
    });
  } catch (error) {
    console.error("CMS GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch website CMS data." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;
    const data = await getPortalData();

    if (!data.courses || data.courses.length === 0) {
      data.courses = [...DEFAULT_COURSES];
    }
    if (!data.gallery || data.gallery.length === 0) {
      data.gallery = [...DEFAULT_GALLERY];
    }
    if (!data.siteSettings) {
      data.siteSettings = { ...DEFAULT_SITE_SETTINGS };
    }
    if (!data.reviews || data.reviews.length === 0) {
      data.reviews = [...DEFAULT_REVIEWS];
    }
    if (!data.aboutSettings) {
      data.aboutSettings = { ...DEFAULT_ABOUT_SETTINGS };
    }

    // --- 1. COURSE OPERATIONS ---
    if (action === "saveCourse") {
      const courseData: CourseItem = body.course;
      if (!courseData.name) {
        return NextResponse.json(
          { success: false, error: "Course name is required." },
          { status: 400 }
        );
      }

      const existingIndex = data.courses.findIndex((c) => c.id === courseData.id);
      if (existingIndex > -1) {
        // Update existing course
        data.courses[existingIndex] = {
          ...data.courses[existingIndex],
          ...courseData
        };
      } else {
        // Add new course
        const newId = courseData.id || `course_${Date.now()}`;
        data.courses.push({
          ...courseData,
          id: newId
        });
      }

      await savePortalData(data);
      return NextResponse.json({
        success: true,
        message: "Course saved successfully.",
        courses: data.courses
      });
    }

    if (action === "deleteCourse") {
      const { id } = body;
      data.courses = data.courses.filter((c) => c.id !== id);
      await savePortalData(data);
      return NextResponse.json({
        success: true,
        message: "Course deleted successfully.",
        courses: data.courses
      });
    }

    // --- 2. GALLERY OPERATIONS ---
    if (action === "saveGalleryItem") {
      const galleryItem: GalleryItem = body.galleryItem;
      if (!galleryItem.title || !galleryItem.image) {
        return NextResponse.json(
          { success: false, error: "Title and Image URL are required." },
          { status: 400 }
        );
      }

      const existingIndex = data.gallery.findIndex((g) => String(g.id) === String(galleryItem.id));
      if (existingIndex > -1) {
        data.gallery[existingIndex] = {
          ...data.gallery[existingIndex],
          ...galleryItem
        };
      } else {
        const newId = galleryItem.id || Date.now();
        data.gallery.unshift({
          ...galleryItem,
          id: newId
        });
      }

      await savePortalData(data);
      return NextResponse.json({
        success: true,
        message: "Gallery photo saved successfully.",
        gallery: data.gallery
      });
    }

    if (action === "deleteGalleryItem") {
      const { id } = body;
      data.gallery = data.gallery.filter((g) => String(g.id) !== String(id));
      await savePortalData(data);
      return NextResponse.json({
        success: true,
        message: "Gallery photo deleted successfully.",
        gallery: data.gallery
      });
    }

    // --- 3. SITE SETTINGS OPERATIONS ---
    if (action === "saveSettings") {
      const newSettings: Partial<SiteSettings> = body.settings;
      data.siteSettings = {
        ...data.siteSettings,
        ...newSettings
      };
      await savePortalData(data);
      return NextResponse.json({
        success: true,
        message: "Academy details and announcement settings updated successfully.",
        siteSettings: data.siteSettings
      });
    }

    // --- 4. REVIEWS & TESTIMONIALS OPERATIONS ---
    if (action === "saveReview") {
      const reviewData: ReviewItem = body.review;
      if (!reviewData || !reviewData.name?.trim() || !reviewData.quote?.trim()) {
        return NextResponse.json(
          { success: false, error: "Reviewer name and quote are required." },
          { status: 400 }
        );
      }

      const existingIndex = data.reviews.findIndex((r) => r.id === reviewData.id);
      if (existingIndex > -1) {
        data.reviews[existingIndex] = {
          ...data.reviews[existingIndex],
          ...reviewData,
          rating: Number(reviewData.rating) || 5
        };
      } else {
        const newId = reviewData.id || `rev_${Date.now()}`;
        data.reviews.unshift({
          ...reviewData,
          id: newId,
          rating: Number(reviewData.rating) || 5,
          createdAt: new Date().toISOString()
        });
      }

      await savePortalData(data);
      return NextResponse.json({
        success: true,
        message: "Review testimonial saved successfully.",
        reviews: data.reviews
      });
    }

    if (action === "deleteReview") {
      const { id } = body;
      data.reviews = data.reviews.filter((r) => r.id !== id);
      await savePortalData(data);
      return NextResponse.json({
        success: true,
        message: "Review testimonial deleted successfully.",
        reviews: data.reviews
      });
    }

    // --- 5. ABOUT PAGE OPERATIONS ---
    if (action === "saveAbout") {
      const aboutData: Partial<AboutSettings> = body.aboutSettings || {};
      data.aboutSettings = {
        ...DEFAULT_ABOUT_SETTINGS,
        ...(data.aboutSettings || {}),
        ...aboutData
      };
      await savePortalData(data);
      return NextResponse.json({
        success: true,
        message: "About page details updated successfully.",
        aboutSettings: data.aboutSettings
      });
    }

    // --- 6. RESET TO DEFAULTS ---
    if (action === "resetDefaults") {
      const { target } = body;
      if (target === "courses") data.courses = [...DEFAULT_COURSES];
      if (target === "gallery") data.gallery = [...DEFAULT_GALLERY];
      if (target === "settings") data.siteSettings = { ...DEFAULT_SITE_SETTINGS };
      if (target === "reviews") data.reviews = [...DEFAULT_REVIEWS];
      if (target === "about") data.aboutSettings = { ...DEFAULT_ABOUT_SETTINGS };
      if (target === "all") {
        data.courses = [...DEFAULT_COURSES];
        data.gallery = [...DEFAULT_GALLERY];
        data.siteSettings = { ...DEFAULT_SITE_SETTINGS };
        data.reviews = [...DEFAULT_REVIEWS];
        data.aboutSettings = { ...DEFAULT_ABOUT_SETTINGS };
      }
      await savePortalData(data);
      return NextResponse.json({
        success: true,
        message: "Reset to default academy content successfully.",
        courses: data.courses,
        gallery: data.gallery,
        siteSettings: data.siteSettings,
        reviews: data.reviews,
        aboutSettings: data.aboutSettings
      });
    }

    return NextResponse.json({ success: false, error: "Invalid action." }, { status: 400 });
  } catch (error) {
    console.error("CMS POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update CMS data." },
      { status: 500 }
    );
  }
}
