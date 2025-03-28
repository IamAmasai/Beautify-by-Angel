import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-plum)] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h2 className="font-bold text-2xl mb-4">
              Beautify <span className="text-[var(--color-amber)]">by Angel</span>
            </h2>
            <p className="mb-6 text-gray-300">Beauty Woven in Every Detail</p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-[var(--color-amber)] transition">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-white hover:text-[var(--color-amber)] transition">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-white hover:text-[var(--color-amber)] transition">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-white hover:text-[var(--color-amber)] transition">
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-gray-300 hover:text-[var(--color-amber)] transition">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/#services">
                  <a className="text-gray-300 hover:text-[var(--color-amber)] transition">Services</a>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <a className="text-gray-300 hover:text-[var(--color-amber)] transition">About</a>
                </Link>
              </li>
              <li>
                <Link href="/booking">
                  <a className="text-gray-300 hover:text-[var(--color-amber)] transition">Book Now</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-gray-300 hover:text-[var(--color-amber)] transition">Contact</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services/1">
                  <a className="text-gray-300 hover:text-[var(--color-amber)] transition">Hair Braiding</a>
                </Link>
              </li>
              <li>
                <Link href="/services/2">
                  <a className="text-gray-300 hover:text-[var(--color-amber)] transition">Makeup Artistry</a>
                </Link>
              </li>
              <li>
                <Link href="/services/3">
                  <a className="text-gray-300 hover:text-[var(--color-amber)] transition">Nail Artistry</a>
                </Link>
              </li>
              <li>
                <Link href="/services/4">
                  <a className="text-gray-300 hover:text-[var(--color-amber)] transition">Henna Artistry</a>
                </Link>
              </li>
              <li>
                <Link href="/booking">
                  <a className="text-gray-300 hover:text-[var(--color-amber)] transition">Service Packages</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[var(--color-amber)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+254 712 345 678</span>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[var(--color-amber)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>angel@beautifybyangel.com</span>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[var(--color-amber)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Nairobi, Kenya</span>
              </li>
              <li className="flex items-start mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[var(--color-amber)] mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <span className="block">Tue-Sat: 9AM - 7PM</span>
                  <span className="block">Sun-Mon: Closed</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">&copy; 2025 Beautify by Angel. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-gray-400 hover:text-[var(--color-amber)] transition">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-400 hover:text-[var(--color-amber)] transition">Terms of Service</a>
              <a href="#" className="text-sm text-gray-400 hover:text-[var(--color-amber)] transition">Booking Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
