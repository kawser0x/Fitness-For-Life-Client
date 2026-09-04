import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Fitness For Life",
  description: "Fitness For Life is a comprehensive fitness and wellness platform that provides personalized workout plans, nutrition guidance, and expert advice to help you achieve your health goals. Whether you're a beginner or an experienced athlete, our resources are designed to support your journey towards a healthier lifestyle.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Navbar></Navbar>
        <main>{children}</main>
        <Footer></Footer>
        <ToastContainer />
      </body>
    </html>
  );
}
