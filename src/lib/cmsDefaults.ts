export interface Student {
  id: string;
  tempCode: string;
  permanentCode: string | null;
  name: string;
  phone: string;
  email?: string;
  course: string;
  batch: string;
  age: string;
  gender: string;
  height?: string;
  weight?: string;
  city: string;
  country?: string;
  address?: string;
  occupation?: string; // Profession / Occupation & Daily Routine
  medicalHistory?: string; // History of Injury / Any kind of medical condition
  primaryGoal?: string; // Primary Goal
  workoutExperience?: string; // Previous Workout Experience
  equipment?: string; // Available Equipment (e.g. Plates, Rods, kettlebell, etc.)
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

export interface ArticleImage {
  url: string;
  caption?: string;
}

export interface ArticleItem {
  id: string;
  title: string;
  category: "Fitness" | "Silambam" | "Yoga" | "Martial Arts" | "Diet & Lifestyle" | string;
  coverImage: string;
  galleryImages?: ArticleImage[];
  excerpt: string;
  content: string;
  author?: string;
  readTime?: string;
  publishedAt: string;
  isFeatured?: boolean;
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
  articles?: ArticleItem[];
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

export const DEFAULT_ARTICLES: ArticleItem[] = [
  {
    id: "art_1",
    title: "The Science of Silambam: How Traditional Tamil Staff Arts Build Reflexes & Balance",
    category: "Silambam",
    coverImage: "/images/vajra_hero.jpg",
    galleryImages: [
      {
        url: "/images/gallery/vajra_martial_arts_horse_stance.jpg",
        caption: "Foundational Horse Stance (Kuthirai Bhavam) grounding the lower body before rotation"
      },
      {
        url: "/images/gallery/vajra_martial_arts_bow_stance.jpg",
        caption: "Directional Bow Stance enabling explosive linear reach and swift defense recovery"
      }
    ],
    excerpt: "Silambam is far more than martial combat—it is a geometric science of rotational torque, peripheral visual awareness, and complete neuromuscular harmony.",
    content: `Silambam is an ancient martial treasure of Tamil Nadu, dating back thousands of years. When a practitioner picks up the bamboo staff (Pirambu), every single movement is governed by fundamental biomechanical laws of physics.

In our daily academy sessions at Vajra Fitness Arts, we observe that students initially view Silambam as simply swinging a stick. However, true mastery begins at the feet—through Kaalvari (footwork geometry). Without rooted footwork, even the fastest hand rotation loses balance and power.

Key Benefits of Consistent Silambam Training:
1. Enhanced Peripheral Vision: Tracking circular staff movements sharpens optic reflexes and spatial awareness.
2. Wrist and Forearm Conditioning: Rapid continuous 360-degree rotations (Veesu) develop exceptional grip strength and tendon elasticity.
3. Bilateral Symmetry: Unlike most modern sports that favor the dominant hand, Silambam strictly demands equal agility with both right and left hands, harmonizing left and right brain coordination.

Whether you are 7 or 45 years old, practicing Silambam builds a calm, unwavering focus that carries directly into daily life.`,
    author: "Coach Murali (Founder & Head Coach)",
    readTime: "4 min read",
    publishedAt: "2026-10-08",
    isFeatured: true
  },
  {
    id: "art_2",
    title: "Functional Strength vs Muscle Bulk: Why Movement Quality Matters Most",
    category: "Fitness",
    coverImage: "/images/martial_arts.jpg",
    galleryImages: [
      {
        url: "/images/gallery/vajra_fitness_full_splits.jpg",
        caption: "Hip flexor and hamstring mobility drills supporting full range athletic power"
      },
      {
        url: "/images/gallery/vajra_fitness_shoulder_mobility.jpg",
        caption: "Overhead thoracic spine and shoulder girdle conditioning for joint resilience"
      }
    ],
    excerpt: "Lifting heavy weights without functional mobility leaves the body stiff. Here is why movement quality, core stability, and agility build true lifelong vitality.",
    content: `In the modern fitness world, people often measure health solely by bicep circumference or numbers on a scale. But ask yourself: can you sit deep on the floor comfortably and stand up without hands? Can you sprint 100 meters without gasping for breath?

At Vajra Fitness Arts, our philosophy bridges classical martial mobility with functional conditioning. We focus on training the human body as an integrated kinetic chain, not isolated muscles on machines.

The Three Pillars of Functional Athleticism:
1. Multi-Planar Mobility: Modern life restricts us to the sagittal plane (sitting at desks, walking forward). Real athletic resilience requires transverse (twisting) and frontal (lateral) movement freedom.
2. Core Stability Over Sit-Ups: True core strength is anti-rotation and spinal protection under load—achieved through calisthenics, animal crawls, and dynamic martial stances.
3. Joint Longevity: Muscles can grow in months, but tendons and ligaments take years to adapt. Progressive movement training prevents chronic injuries and keeps you youthful decades into the future.

Train for capability, agility, and vitality—the aesthetic physique will naturally follow as a byproduct.`,
    author: "Coach Murali (Founder & Head Coach)",
    readTime: "3 min read",
    publishedAt: "2026-10-06",
    isFeatured: true
  },
  {
    id: "art_3",
    title: "Pranayama & Spine Mobility: The Missing Link in Everyday Recovery",
    category: "Yoga",
    coverImage: "/images/yoga.jpg",
    galleryImages: [
      {
        url: "/images/gallery/vajra_yoga_group_meditation.jpg",
        caption: "Morning group mindfulness and conscious breath calibration at our Ariyalur training center"
      },
      {
        url: "/images/gallery/vajra_yoga_pranayama_breathwork.jpg",
        caption: "Guided diaphragmatic breathing balancing the autonomic nervous system"
      }
    ],
    excerpt: "High stress and sedentary desk postures lock our spine and shallow our breath. Discover how 15 minutes of mindful breathwork restores central nervous balance.",
    content: `The modern student and working professional spend over 8 hours a day seated, hunched forward over screens. This posture mechanically compresses the ribcage, forcing shallow chest breathing that constantly keeps our sympathetic nervous system (fight-or-flight) activated.

When you cannot breathe deeply into your diaphragm, your body remains in chronic low-grade inflammation, fatigue, and muscular tension.

How Mindful Yoga Restores Equilibrium:
1. Lengthening the Spine: Through gentle traction, gentle spinal twists, and restorative extensions, we relieve pressure from compressed intervertebral discs.
2. Nadi Shodhana (Alternate Nostril Breathing): Calms mental chatter, reduces cortisol levels, and stabilizes heart rate variability.
3. Mind-Muscle Centering: Moving slowly with deliberate breath teaches the nervous system how to relax under stress.

True power does not come from constant aggression; it is anchored in the stillness and inner peace you cultivate between training sessions.`,
    author: "Coach Murali (Founder & Head Coach)",
    readTime: "3 min read",
    publishedAt: "2026-10-04",
    isFeatured: false
  }
];

