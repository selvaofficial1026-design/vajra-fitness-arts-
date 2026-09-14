import fs from "fs/promises";
import path from "path";
import { getDatabase } from "./mongodb";

export * from "./cmsDefaults";
import {
  PortalData,
  DEFAULT_ADMIN_CONFIG,
  DEFAULT_COURSES,
  DEFAULT_GALLERY,
  DEFAULT_SITE_SETTINGS,
  DEFAULT_REVIEWS,
  DEFAULT_ABOUT_SETTINGS
} from "./cmsDefaults";

const DATA_FILE_PATH = path.join(process.cwd(), "src", "data", "portal-data.json");

// In-memory fallback if file system access fails in serverless environments
let memoryStore: PortalData | null = null;

function normalizePortalData(data: Partial<PortalData>): PortalData {
  return {
    students: data.students || [],
    meetings: data.meetings || [],
    videos: data.videos || [],
    messages: data.messages || [],
    adminConfig: data.adminConfig ? { ...DEFAULT_ADMIN_CONFIG, ...data.adminConfig } : { ...DEFAULT_ADMIN_CONFIG },
    courses: data.courses && data.courses.length > 0 ? data.courses : [...DEFAULT_COURSES],
    gallery: data.gallery && data.gallery.length > 0 ? data.gallery : [...DEFAULT_GALLERY],
    siteSettings: data.siteSettings ? { ...DEFAULT_SITE_SETTINGS, ...data.siteSettings } : { ...DEFAULT_SITE_SETTINGS },
    reviews: data.reviews && data.reviews.length > 0 ? data.reviews : [...DEFAULT_REVIEWS],
    aboutSettings: data.aboutSettings ? { ...DEFAULT_ABOUT_SETTINGS, ...data.aboutSettings } : { ...DEFAULT_ABOUT_SETTINGS }
  };
}

export async function getPortalData(): Promise<PortalData> {
  // 1. Try fetching from MongoDB Atlas if configured
  try {
    const db = await getDatabase();
    if (db) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const doc = await db.collection("portal_store").findOne({ _id: "main_portal_data" as any });
      if (doc) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const normalized = normalizePortalData(doc as any);
        memoryStore = normalized;
        return normalized;
      }
    }
  } catch (err) {
    console.warn("MongoDB fetch failed, trying local file fallback:", err);
  }

  // 2. Fallback to local JSON file
  try {
    const raw = await fs.readFile(DATA_FILE_PATH, "utf-8");
    const data: PortalData = JSON.parse(raw);
    const normalized = normalizePortalData(data);
    memoryStore = normalized;
    return normalized;
  } catch {
    if (memoryStore) {
      return memoryStore;
    }
    const defaultData = normalizePortalData({});
    memoryStore = defaultData;
    return defaultData;
  }
}

export async function savePortalData(data: PortalData): Promise<void> {
  memoryStore = data;

  // 1. Save to MongoDB Atlas
  try {
    const db = await getDatabase();
    if (db) {
      await db.collection("portal_store").replaceOne(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { _id: "main_portal_data" as any },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { _id: "main_portal_data" as any, ...data, updatedAt: new Date() },
        { upsert: true }
      );
    }
  } catch (err) {
    console.error("Failed to save portal data to MongoDB Atlas:", err);
  }

  // 2. Also save to local JSON file as backup
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    // In serverless / read-only environment, local disk write might fail, which is expected
  }
}

export function extractYoutubeId(urlOrId: string): string {
  const trimmed = urlOrId.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|live\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : trimmed;
}
