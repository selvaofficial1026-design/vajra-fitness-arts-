import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.vajrafitnessarts.com"),
  title: {
    default: "Vajra Fitness Arts | Fitness, Yoga, Martial Arts & Silambam Academy",
    template: "%s | Vajra Fitness Arts"
  },
  description: "Vajra Fitness Arts: Professional training academy in Fitness, Yoga, Martial Arts, and Traditional Silambam in Ariyalur, Tamil Nadu. Online and offline batches by Master Coach Murali.",
  keywords: [
    "Vajra Fitness Arts",
    "Silambam classes Ariyalur",
    "Traditional Silambam Tamil Nadu",
    "Yoga classes Ariyalur",
    "Martial Arts training Ariyalur",
    "Fitness gym Ariyalur",
    "Vajra Murali",
    "Calisthenics Ariyalur",
    "Self defense classes Tamil Nadu",
    "Online martial arts coaching India"
  ],
  authors: [{ name: "Master Coach Murali", url: "https://www.vajrafitnessarts.com/about" }],
  creator: "Vajra Fitness Arts",
  publisher: "Vajra Fitness Arts",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://www.vajrafitnessarts.com",
  },
  openGraph: {
    title: "Vajra Fitness Arts | Fitness, Yoga, Martial Arts & Silambam",
    description: "Transform your body, mind, and spirit with master coaching in Fitness, Yoga, Martial Arts, and Silambam in Ariyalur.",
    url: "https://www.vajrafitnessarts.com",
    siteName: "Vajra Fitness Arts",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/images/logo_gold.jpeg",
        width: 800,
        height: 800,
        alt: "Vajra Fitness Arts Official Academy Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vajra Fitness Arts | Fitness, Yoga, Martial Arts & Silambam",
    description: "Professional training academy in Fitness, Yoga, Martial Arts, and Silambam in Ariyalur, Tamil Nadu.",
    images: ["/images/logo_gold.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/images/logo_gold.jpeg",
    apple: "/images/logo_gold.jpeg",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  "name": "Vajra Fitness Arts",
  "alternateName": "Vajra Fitness & Martial Arts Academy",
  "description": "Professional training academy in Fitness, Yoga, Martial Arts, and Traditional Silambam in Ariyalur, Tamil Nadu. Online live classroom batches and personal coaching.",
  "url": "https://www.vajrafitnessarts.com",
  "telephone": "+919047743533",
  "priceRange": "₹₹",
  "image": "https://www.vajrafitnessarts.com/images/logo_gold.jpeg",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "8/73B B, Periyar Nagar 1st Cross",
    "addressLocality": "Ariyalur",
    "addressRegion": "Tamil Nadu",
    "postalCode": "621704",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "11.1401",
    "longitude": "79.0754"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "04:30",
      "closes": "20:00"
    }
  ],
  "sameAs": [
    "https://www.instagram.com/crown_of_vajramurali",
    "https://youtube.com/@teamvajrafitnessarts"
  ]
};

import LoadingScreen from "@/components/LoadingScreen";
import CustomCursor from "@/components/CustomCursor";

import PageTransition from "@/components/PageTransition";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans relative overflow-x-hidden">
        <div className="grain-overlay" />
        <div className="aura-container">
          <div className="aura-blob aura-blob-1" />
          <div className="aura-blob aura-blob-2" />
        </div>
        <LoadingScreen />
        <CustomCursor />
        <Navbar />
        <PageTransition>{children}</PageTransition>
        <Footer />
      </body>
    </html>
  );
}


