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
  status: "PENDING" | "APPROVED" | "REJECTED" | "LEFT";
  createdAt: string;
  approvedAt: string | null;
  leftAt?: string | null;
  password?: string;
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

export interface CourseItem {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  category: string;
  schedule: string;
  level: string;
  age: string;
  image: string;
  videoId: string;
  syllabus: string[];
}

export interface GalleryItem {
  id: number | string;
  title: string;
  category: string;
  image: string;
  description: string;
}

export interface SiteSettings {
  announcementActive: boolean;
  announcementBadge: string;
  announcementText: string;
  announcementLink: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  mapsUrl: string;
  trainingHours: string;
}

export interface ReviewItem {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  discipline?: string;
  createdAt?: string;
}

export interface FounderDiscipline {
  title: string;
  desc: string;
}

export interface AboutSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  storyTitle: string;
  storySubtitle: string;
  storyP1: string;
  storyP2: string;
  storyQuote: string;
  storyQuoteAuthor: string;
  storyImage: string;
  statStudents: string;
  statCoaching: string;
  statDisciplines: string;
  founderName: string;
  founderRole: string;
  founderTagline: string;
  founderHeading: string;
  founderBio: string;
  founderPhoto: string;
  founderDisciplines: FounderDiscipline[];
}

export interface PortalData {
  students: Student[];
  meetings: ClassMeeting[];
  videos: VideoClass[];
  messages: ChatMessage[];
  adminConfig?: AdminConfig;
  courses?: CourseItem[];
  gallery?: GalleryItem[];
  siteSettings?: SiteSettings;
  reviews?: ReviewItem[];
  aboutSettings?: AboutSettings;
}

export const DEFAULT_ADMIN_CONFIG: AdminConfig = {
  username: "admin",
  name: "Master Coach & Admin",
  password: "vajra@2026",
  phone: "+91 90477 43533",
  email: "vajrafitnessarts@gmail.com",
  roleTitle: "Head Coach & Academy Administrator",
  academyBranch: "Ariyalur Main Studio, Tamil Nadu",
  avatarLetter: "A",
  lastPasswordChange: null
};

export const DEFAULT_COURSES: CourseItem[] = [
  {
    id: "fitness",
    name: "Fitness",
    subtitle: "Functional Strength & Conditioning",
    description: "Full-body functional fitness, bodyweight calisthenics, core stability, and cardio endurance for all fitness levels.",
    category: "Fitness",
    schedule: "Morning: 4:30-5:15 AM, 5:30-6:00 AM, 8:30-9:15 AM | Evening: 3:45-4:30 PM, 5:00-5:45 PM, 6:00-6:45 PM",
    level: "All Levels (Beginner to Advanced)",
    age: "Teens & Adults",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop",
    videoId: "dQw4w9WgXcQ",
    syllabus: [
      "Bodyweight training: Push-ups, pull-ups, squats, and core strength",
      "Functional kettlebell and dumbbell movements for muscle tone",
      "Circuit training and cardio intervals to boost stamina",
      "Full-body stretching, mobility, and post-workout recovery"
    ]
  },
  {
    id: "yoga",
    name: "Yoga",
    subtitle: "Flexibility, Balance & Mindfulness",
    description: "Guided yoga classes designed to improve body flexibility, release joint tension, build core balance, and calm the mind.",
    category: "Yoga",
    schedule: "Morning: 4:30-5:15 AM, 5:30-6:00 AM, 8:30-9:15 AM | Evening: 3:45-4:30 PM, 5:00-5:45 PM, 6:00-6:45 PM",
    level: "All Levels Welcome",
    age: "All Age Groups",
    image: "/images/yoga.jpg",
    videoId: "dQw4w9WgXcQ",
    syllabus: [
      "Sun Salutations (Surya Namaskar) for gentle warmups",
      "Standing, balancing, and seated yoga postures (Asanas)",
      "Guided breathing techniques for stress relief and focus",
      "Relaxation and guided mindfulness for everyday well-being"
    ]
  },
  {
    id: "martial-arts",
    name: "Martial Arts",
    subtitle: "Striking, Defense & Discipline",
    description: "Learn essential striking techniques, punch-kick combinations, defensive head movement, and practical self-defense.",
    category: "Martial Arts",
    schedule: "Morning: 4:30-5:15 AM, 5:30-6:00 AM, 8:30-9:15 AM | Evening: 3:45-4:30 PM, 5:00-5:45 PM, 6:00-6:45 PM",
    level: "Beginner to Advanced",
    age: "Youth & Adults",
    image: "/images/martial_arts.jpg",
    videoId: "dQw4w9WgXcQ",
    syllabus: [
      "Fundamental punches: Jab, cross, hook, and uppercut mechanics",
      "Kick techniques: Front kicks, low kicks, and roundhouse kicks",
      "Defensive guards, footwork, and evasion drills",
      "Practical self-defense awareness and partner sparring drills"
    ]
  },
  {
    id: "silambam",
    name: "Silambam",
    subtitle: "Traditional Tamil Staff Art",
    description: "Learn the traditional art of Silambam, featuring footwork drills, continuous stick rotations, speed training, and combat forms.",
    category: "Silambam",
    schedule: "Morning: 4:30-5:15 AM, 5:30-6:00 AM, 8:30-9:15 AM | Evening: 3:45-4:30 PM, 5:00-5:45 PM, 6:00-6:45 PM",
    level: "Beginner to Advanced",
    age: "Kids (6+) & Adults",
    image: "/images/vajra_hero.jpg",
    videoId: "dQw4w9WgXcQ",
    syllabus: [
      "Kaalvari: Foundational footwork and directional stances",
      "Veesu: Single and double-hand staff rotation techniques",
      "Speed drills, wrist conditioning, and balance exercises",
      "Traditional forms (Chuvadu) and controlled partner drills"
    ]
  }
];

export const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: 1,
    title: "Silambam Kaalvari Stance",
    category: "Silambam",
    image: "/images/vajra_hero.jpg",
    description: "Traditional footwork foundation and defensive readiness with the bamboo staff."
  },
  {
    id: 2,
    title: "Silambam Staff Defense",
    category: "Silambam",
    image: "/images/martial_arts.jpg",
    description: "Practicing rotational wrist spins, rapid strikes, and directional blocks with traditional weapons."
  },
  {
    id: 3,
    title: "Shaolin Crane Guard & Balance",
    category: "Martial Arts",
    image: "/images/gallery/vajra_martial_arts_crane_guard.jpg",
    description: "Single-leg crane stance developing kinetic control, poise, and lightning-fast defensive reactions."
  },
  {
    id: 4,
    title: "Low Drop Stance Agility",
    category: "Martial Arts",
    image: "/images/gallery/vajra_martial_arts_drop_stance.jpg",
    description: "Deep crouching stance training ankle tendon resilience, inner leg flexibility, and low-line defense."
  },
  {
    id: 5,
    title: "Rooted Horse Stance Power",
    category: "Martial Arts",
    image: "/images/gallery/vajra_martial_arts_horse_stance.jpg",
    description: "Fundamental Ma Bu posture cultivating lower-body endurance, pelvic alignment, and centered focus."
  },
  {
    id: 6,
    title: "Forward Bow Stance Strike",
    category: "Martial Arts",
    image: "/images/gallery/vajra_martial_arts_bow_stance.jpg",
    description: "Forward linear driving stance delivering grounded palm thrusts and stable weight transfer."
  },
  {
    id: 7,
    title: "Single-Leg Balance & Lateral Stretch",
    category: "Yoga",
    image: "/images/gallery/vajra_yoga_standing_balance.jpg",
    description: "Mastering single-leg stability, pelvic alignment, and lateral torso extension in open air."
  },
  {
    id: 8,
    title: "Guided Mindfulness & Dhyana",
    category: "Yoga",
    image: "/images/gallery/vajra_yoga_group_meditation.jpg",
    description: "Evening group meditation with Chin Mudra centering thoughts, reducing stress, and calming the mind."
  },
  {
    id: 9,
    title: "Pranayama Breathwork Mastery",
    category: "Yoga",
    image: "/images/gallery/vajra_yoga_pranayama_breathwork.jpg",
    description: "Systematic alternate nostril breathing improving respiratory lung capacity and mental clarity."
  },
  {
    id: 10,
    title: "Evening Group Tree Pose Circle",
    category: "Yoga",
    image: "/images/gallery/vajra_yoga_group_tree_night.jpg",
    description: "Community balance session developing focus, ankle stabilization, and poise under evening lights."
  }
];

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  announcementActive: true,
  announcementBadge: "Admissions Open",
  announcementText: "Daily Morning & Evening Batches for Silambam, Yoga, Martial Arts & Fitness — Enroll Online or Visit Our Ariyalur Studio",
  announcementLink: "/portal?tab=enroll",
  phone: "+91 90477 43533",
  whatsapp: "+91 90477 43533",
  email: "vajrafitnessarts@gmail.com",
  address: "8/73B B, Periyar Nagar 1st Cross, Ariyalur - 621704, Tamil Nadu, India",
  mapsUrl: "https://maps.google.com/?q=8/73B+B,+Periyar+Nagar+1st+Cross,+Ariyalur,+Tamil+Nadu+621704,+India",
  trainingHours: "Morning: 4:30 AM - 9:15 AM | Evening: 3:45 PM - 6:45 PM"
};

export const DEFAULT_REVIEWS: ReviewItem[] = [
  {
    id: "rev_1",
    name: "S. Karthikeyan",
    role: "Silambam Practitioner",
    quote: "Vajra Fitness Arts helped me build great endurance, fast reflexes, and daily discipline. The instructors are patient, knowledgeable, and always encouraging.",
    rating: 5,
    discipline: "Silambam"
  },
  {
    id: "rev_2",
    name: "Dr. Priyadarshini",
    role: "Yoga Student & Physician",
    quote: "The yoga classes at Vajra Fitness Arts improved my flexibility and gave me peace of mind after long work days. I highly recommend it for all ages.",
    rating: 5,
    discipline: "Yoga"
  },
  {
    id: "rev_3",
    name: "R. Vignesh",
    role: "Martial Arts & Fitness Trainee",
    quote: "The striking techniques, agility drills, and personal attention from coach helped me transform my physical fitness and mental focus completely.",
    rating: 5,
    discipline: "Martial Arts"
  }
];

export const DEFAULT_ABOUT_SETTINGS: AboutSettings = {
  heroTitle: "The Vajra Journey",
  heroSubtitle: "Promoting health, discipline, and traditional martial arts for modern everyday life.",
  heroImage: "/images/vajra_hero.jpg",
  storyTitle: "Building Strength and Character Through Movement Arts",
  storySubtitle: "Our Background",
  storyP1: "Vajra Fitness Arts was founded to provide quality training in traditional Tamil martial arts alongside modern physical conditioning and yoga.",
  storyP2: "We believe fitness is about more than just appearance. Through Silambam, Yoga, Martial Arts, and Functional Fitness, our students develop agility, practical strength, self-confidence, and a focused mind.",
  storyQuote: "Consistent practice builds both physical strength and a peaceful mind.",
  storyQuoteAuthor: "Founder & Head Coach, Vajra Fitness Arts",
  storyImage: "/images/vajra_hero.jpg",
  statStudents: "100+",
  statCoaching: "100%",
  statDisciplines: "4",
  founderName: "Vajra Fitness Arts",
  founderRole: "Founder & Head Coach",
  founderTagline: "Sole Master Trainer for All Disciplines",
  founderHeading: "Learn Directly from the Founder",
  founderBio: "At Vajra Fitness Arts, you receive direct, personalized instruction from our founder across all four disciplines—Fitness, Yoga, Martial Arts, and Silambam. Every student gets dedicated one-on-one attention, step-by-step progress tracking, and disciplined training tailored to their goals.",
  founderPhoto: "/images/coach_murali_clean.jpg",
  founderDisciplines: [
    {
      title: "Fitness",
      desc: "Full-body functional workouts, calisthenics, core stability, and cardio endurance tailored to each student."
    },
    {
      title: "Yoga",
      desc: "Guided flexibility training, posture alignment, joint mobility, and mindful breathing techniques."
    },
    {
      title: "Martial Arts",
      desc: "Practical striking techniques, boxing footwork, kick combinations, and real-world personal self-defense."
    },
    {
      title: "Silambam",
      desc: "Classical Tamil staff martial art, Kaalvari footwork, rapid double-hand stick spins, and combat drills."
    }
  ]
};
