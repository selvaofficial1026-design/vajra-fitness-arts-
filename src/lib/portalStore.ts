import fs from "fs/promises";
import path from "path";

export * from "./cmsDefaults";
import {
  PortalData,
  DEFAULT_ADMIN_CONFIG,
  DEFAULT_COURSES,
  DEFAULT_GALLERY,
  DEFAULT_SITE_SETTINGS,
  DEFAULT_REVIEWS
} from "./cmsDefaults";

const DATA_FILE_PATH = path.join(process.cwd(), "src", "data", "portal-data.json");



// In-memory fallback if file system access fails in serverless environments
let memoryStore: PortalData | null = null;

export async function getPortalData(): Promise<PortalData> {
  try {
    const raw = await fs.readFile(DATA_FILE_PATH, "utf-8");
    const data: PortalData = JSON.parse(raw);
    if (!data.adminConfig) {
      data.adminConfig = { ...DEFAULT_ADMIN_CONFIG };
    }
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
    memoryStore = data;
    return data;
  } catch {
    if (memoryStore) {
      if (!memoryStore.adminConfig) {
        memoryStore.adminConfig = { ...DEFAULT_ADMIN_CONFIG };
      }
      if (!memoryStore.courses || memoryStore.courses.length === 0) {
        memoryStore.courses = [...DEFAULT_COURSES];
      }
      if (!memoryStore.gallery || memoryStore.gallery.length === 0) {
        memoryStore.gallery = [...DEFAULT_GALLERY];
      }
      if (!memoryStore.siteSettings) {
        memoryStore.siteSettings = { ...DEFAULT_SITE_SETTINGS };
      }
      if (!memoryStore.reviews || memoryStore.reviews.length === 0) {
        memoryStore.reviews = [...DEFAULT_REVIEWS];
      }
      return memoryStore;
    }
    // Default structure with pre-seeded courses, gallery, settings, and reviews
    const defaultData: PortalData = {
      students: [],
      meetings: [],
      videos: [],
      messages: [],
      adminConfig: { ...DEFAULT_ADMIN_CONFIG },
      courses: [...DEFAULT_COURSES],
      gallery: [...DEFAULT_GALLERY],
      siteSettings: { ...DEFAULT_SITE_SETTINGS },
      reviews: [...DEFAULT_REVIEWS]
    };
    return defaultData;
  }
}

export async function savePortalData(data: PortalData): Promise<void> {
  memoryStore = data;
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save portal data to disk:", err);
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
