import fs from "fs/promises";
import path from "path";

export interface Student {
  id: string;
  tempCode: string;
  permanentCode: string | null;
  name: string;
  phone: string;
  course: string;
  batch: string;
  age: string;
  gender: string;
  city: string;
  notes?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  approvedAt: string | null;
}

export interface ClassMeeting {
  id: string;
  course: string;
  batch: string;
  title: string;
  meetUrl: string;
  scheduledTime: string;
  instructor?: string;
  isActive: boolean;
  createdAt: string;
}

export interface VideoClass {
  id: string;
  youtubeUrl: string;
  youtubeId: string;
  title: string;
  course: string;
  category: string;
  description: string;
  addedAt: string;
}

export interface ChatMessage {
  id: string;
  studentId: string;
  sender: "student" | "admin";
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface AdminConfig {
  username: string;
  name: string;
  password?: string;
  phone?: string;
  email?: string;
  roleTitle?: string;
  academyBranch?: string;
  avatarLetter?: string;
  lastPasswordChange?: string | null;
}

export interface PortalData {
  students: Student[];
  meetings: ClassMeeting[];
  videos: VideoClass[];
  messages: ChatMessage[];
  adminConfig?: AdminConfig;
}

const DATA_FILE_PATH = path.join(process.cwd(), "src", "data", "portal-data.json");

// Default Admin configuration
export const DEFAULT_ADMIN_CONFIG: AdminConfig = {
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

// In-memory fallback if file system access fails in serverless environments
let memoryStore: PortalData | null = null;

export async function getPortalData(): Promise<PortalData> {
  try {
    const raw = await fs.readFile(DATA_FILE_PATH, "utf-8");
    const data: PortalData = JSON.parse(raw);
    if (!data.adminConfig) {
      data.adminConfig = { ...DEFAULT_ADMIN_CONFIG };
    }
    memoryStore = data;
    return data;
  } catch {
    if (memoryStore) {
      if (!memoryStore.adminConfig) {
        memoryStore.adminConfig = { ...DEFAULT_ADMIN_CONFIG };
      }
      return memoryStore;
    }
    // Default empty structure
    const defaultData: PortalData = {
      students: [],
      meetings: [],
      videos: [],
      messages: [],
      adminConfig: { ...DEFAULT_ADMIN_CONFIG }
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
