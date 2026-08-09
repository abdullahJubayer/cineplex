import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { BookingProvider } from "@/context/BookingContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ticketor - Premium Cinema Ticket Booking",
  description: "Book movie tickets, choose VIP seats, and pre-order gourmet snacks at Ticketor Cineplex.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0B0F19] text-slate-100 min-h-screen flex flex-col antialiased selection:bg-rose-500 selection:text-white`}>
        <AuthProvider>
          <BookingProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </BookingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
