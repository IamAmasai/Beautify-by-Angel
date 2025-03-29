import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Hero from "@/components/Hero";
import ServiceCard from "@/components/ServiceCard";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import { Link } from "wouter";
import { services } from "@/lib/constants";
import angelImage from "@assets/angel.jpg";

export default function HomePage() {
  return (
    <main>
      {/* Hero Section */}
      <Hero />

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[var(--color-plum)] mb-2">Our Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our range of premium beauty services, each crafted with meticulous attention to detail
            </p>
            <div className="w-24 h-1 bg-[var(--color-amber)] mx-auto mt-4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-[var(--color-ivory)]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <img 
                src={angelImage} 
                alt="Angel Mwende - CEO of Beautify by Angel" 
                className="rounded-lg shadow-xl w-full h-auto object-cover"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-4xl font-bold text-[var(--color-plum)] mb-4">About Angel Mwende</h2>
              <p className="text-lg text-gray-700 mb-6">
                As the founder and creative force behind Beautify by Angel, I bring over a decade of expertise in hair styling, makeup artistry, and beauty innovation to Nairobi's beauty scene.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                My passion lies in weaving beauty into every detail of your experience, creating personalized looks that enhance your natural features while reflecting your unique style and personality.
              </p>
              <p className="text-lg text-gray-700 mb-8">
                With training from international beauty academies and experience working with diverse clientele, I've developed techniques that blend traditional practices with modern trends, ensuring every client leaves feeling confident and beautiful.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <motion.div 
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="w-12 h-12 bg-[var(--color-amber)] rounded-full flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold">Creativity</h3>
                    <p className="text-sm text-gray-600">Innovative designs</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="w-12 h-12 bg-[var(--color-amber)] rounded-full flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold">Precision</h3>
                    <p className="text-sm text-gray-600">Attention to detail</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="w-12 h-12 bg-[var(--color-amber)] rounded-full flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold">Satisfaction</h3>
                    <p className="text-sm text-gray-600">Client-focused service</p>
                  </div>
                </motion.div>
              </div>
              
              <Link href="/about">
                <a className="inline-block mt-8 text-[var(--color-plum)] bg-white px-6 py-3 rounded-md border border-[var(--color-plum)] hover:bg-[var(--color-plum)] hover:text-white transition duration-300">
                  Learn More About Angel
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[var(--color-plum)] mb-2">Client Experiences</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from our clients who have experienced the artistry and attention to detail at Beautify by Angel
            </p>
            <div className="w-24 h-1 bg-[var(--color-amber)] mx-auto mt-4"></div>
          </div>
          
          <TestimonialCarousel />
        </div>
      </section>

      {/* Book Now CTA */}
      <section className="py-16 bg-[var(--color-plum)] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience Luxury Beauty?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Schedule your appointment with Angel and discover beauty woven in every detail
          </p>
          <Link href="/booking">
            <motion.a 
              className="inline-block bg-[var(--color-amber)] text-white text-lg px-8 py-3 rounded-md shadow-lg hover:bg-opacity-90 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Book Your Appointment
            </motion.a>
          </Link>
        </div>
        <div className="absolute bottom-5 left-0 right-0 flex justify-center">
          <a href="#services" className="text-white animate-bounce">
            <ChevronDown className="h-8 w-8" />
          </a>
        </div>
      </section>
    </main>
  );
}
