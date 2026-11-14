export const SITE_CONFIG = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "FARAS METHOD",
  description: "ONLINE FITNESS COACHING",
  trainerName: process.env.NEXT_PUBLIC_TRAINER_NAME || "Faras",
  fullName: "Mohammad Faras U",
  professionalTitle: "Certified Level 4 General Fitness Trainer",
  tagline: "Train Smart. Stay Consistent. Transform Yourself.",
  heroTagline: "TRAIN SMART.\nSTAY CONSISTENT.\nTRANSFORM YOURSELF.",
  bio: "I started my fitness journey as a skinny beginner with very little knowledge of training or nutrition. I made mistakes, struggled to see results, and had to learn through experience.\n\nOver the years, I gained 13 kg of body weight, developed my physique, and built a much deeper understanding of natural muscle building.\n\nMore importantly, the journey taught me patience, discipline, and the value of consistency. I learned that progress isn't about finding shortcuts — it's about following the right approach and sticking with it.\n\nToday, as a Certified Level 4 General Fitness Trainer, I use the knowledge and experience I've gained to help others train with purpose, improve their nutrition, and work towards their fitness goals.\n\nI've been a beginner myself. Now, I'm here to help you make your own progress with a clear plan and consistent guidance.",
  philosophy: "No shortcuts. No unrealistic promises. Just proper training, consistency and progress.",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918138954423",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "coach@farasfitness.com",
  instagramHandle: process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "itsfarasu",
  instagramUrl: "https://www.instagram.com/itsfarasu/",
  location: "Online Personal Training & Fitness Guidance",
  stats: {
    experienceYears: "4+ Years",
    startingWeight: "56 KG",
    currentWeight: "69 KG",
    weightGained: "13 KG",
  },
  transformation: {
    beforeImage: "/photos/faras-before.jpeg",
    afterImage: "/photos/faras-after-1.jpeg",
    afterImage2: "/photos/faras-after-2.jpeg",
    afterImage3: "/photos/faras-after-3.jpeg",
  },
  certification: {
    title: "Certified Level 4 General Fitness Trainer",
    qualification: "General Fitness Trainer",
    qualificationCode: "SPF/Q1107",
    nsqfLevel: "Level 4",
    assessmentStatus: "Successfully Cleared",
    standard: "National Occupational Standards",
    sectorCouncil: "Sports, Physical Education, Fitness & Leisure Skills Council (SPEFL-SC)",
    dateOfIssue: "29 April 2026",
    certificateImageUrl: "/certificate/mohammad-faras-u-certificate.svg",
    trainingAreas: [
      "Fitness instruction",
      "Workout planning",
      "Exercise techniques",
      "Client fitness guidance",
    ],
  },
};

export const COLOR_PALETTE = {
  deepBlack: "#06141B",  // Main background
  darkNavy: "#11212D",   // Cards and sections
  blueGray: "#253745",   // Secondary backgrounds
  slateGray: "#4A5C6A",  // Borders and elements
  lightGray: "#9BA8AB",  // Secondary text
  offWhite: "#CCD0CF",   // Main text and highlights
};

/**
 * Builds a direct wa.me WhatsApp URL with a prefilled message
 */
export function buildWhatsAppBookingUrl(params: {
  customerName?: string;
  packageName: string;
  duration?: string;
  price?: number;
  currency?: string;
  customMessage?: string;
  fitnessGoal?: string;
  coachName?: string;
  customNumber?: string;
}): string {
  const number = (params.customNumber || SITE_CONFIG.whatsappNumber).replace(/[^0-9]/g, "");
  const { customerName, packageName, duration, price, currency = "INR", customMessage, fitnessGoal } = params;
  const coach = params.coachName || SITE_CONFIG.trainerName;

  let text = "";
  if (customMessage) {
    text = `Hello Coach ${coach},\n\n${customMessage}`;
    if (customerName) text += `\nName: ${customerName}`;
    if (fitnessGoal) text += `\nGoal: ${fitnessGoal}`;
  } else {
    text = `Hello Coach ${coach},\n\nI would like to apply for the ${packageName} package.`;
    if (duration) text += `\nDuration: ${duration}`;
    if (price !== undefined) {
      const sym = currency === "USD" ? "$" : "₹";
      text += `\nFee: ${sym}${price.toLocaleString("en-IN")}`;
    }
    if (customerName) text += `\nName: ${customerName}`;
    if (fitnessGoal) text += `\nGoal: ${fitnessGoal}`;
    text += `\n\nPlease let me know the enrollment process to get started.`;
  }

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

/**
 * Builds a general inquiry WhatsApp URL
 */
export function buildGeneralWhatsAppUrl(customNote?: string, customNumber?: string, coachName?: string): string {
  const number = (customNumber || SITE_CONFIG.whatsappNumber).replace(/[^0-9]/g, "");
  const coach = coachName || SITE_CONFIG.trainerName;
  const defaultText = `Hello Coach ${coach}, I visited your website and would like to inquire about your online coaching programs.`;
  const message = customNote ? `${defaultText}\n\nNote: ${customNote}` : defaultText;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
