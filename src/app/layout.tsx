import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FARAS METHOD | Online Fitness Coaching",
  description:
    "Train Smart. Stay Consistent. Transform Yourself. Online fitness coaching by Certified Level 4 General Fitness Trainer Mohammad Faras U.",
  keywords: [
    "FARAS METHOD",
    "Faras",
    "Mohammad Faras U",
    "Online Fitness Coaching",
    "Train Smart Stay Consistent Transform Yourself",
    "Certified Level 4 General Fitness Trainer",
    "SPEFL-SC",
    "SPF/Q1107",
    "National Occupational Standards",
    "natural muscle building",
    "workout planning",
  ],
  openGraph: {
    title: "FARAS METHOD | Online Fitness Coaching",
    description:
      "Train Smart. Stay Consistent. Transform Yourself. 1-on-1 personalized fitness coaching with Certified Level 4 General Fitness Trainer Mohammad Faras U.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Oswald:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="bg-[#06141B] text-[#CCD0CF] min-h-screen antialiased selection:bg-[#CCD0CF] selection:text-[#06141B]">
        {children}
      </body>
    </html>
  );
}
