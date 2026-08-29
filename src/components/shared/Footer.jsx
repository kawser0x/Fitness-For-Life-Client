import Link from "next/link";
import Image from "next/image";
import {
  FaLocationDot,
  FaPhone,
  FaEnvelope,
  FaXTwitter,
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa6";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-200 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-bold text-xl text-cyan-400">
              <Image
                src="/assets/logo.png"
                alt="FitnessForLife Logo"
                width={36}
                height={36}
                className="w-9 h-9 object-contain rounded-full border border-cyan-500/40"
              />
              <span>FitnessForLife</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering your wellness journey with professional trainers,
              vibrant community discussions, and top-tier fitness classes.
            </p>
            {/* Social Media Links using React Icons including FaXTwitter */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X (formerly Twitter)"
                className="p-2.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:bg-cyan-500/20 hover:text-cyan-400 hover:border-cyan-500/40 transition">
                <FaXTwitter className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="p-2.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:bg-cyan-500/20 hover:text-cyan-400 hover:border-cyan-500/40 transition">
                <FaFacebookF className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="p-2.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:bg-cyan-500/20 hover:text-cyan-400 hover:border-cyan-500/40 transition">
                <FaInstagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-cyan-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/classes"
                  className="hover:text-cyan-400 transition">
                  Browse All Classes
                </Link>
              </li>
              <li>
                <Link href="/forum" className="hover:text-cyan-400 transition">
                  Community Forum
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-white">
              Popular Categories
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Yoga & Flexibility</li>
              <li>HIIT & Cardio</li>
              <li>Strength & Weight Training</li>
              <li>Pilates & Core</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-white">Contact Us</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <FaLocationDot className="h-4 w-4 text-cyan-400 shrink-0" />
                <span>123 Fitness Way, Gym City, GC 45000</span>
              </li>
              <li className="flex items-center gap-2">
                <FaPhone className="h-4 w-4 text-cyan-400 shrink-0" />
                <span>+1 (555) 234-5678</span>
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope className="h-4 w-4 text-cyan-400 shrink-0" />
                <span>support@fitnessforlife.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} FitnessForLife. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
