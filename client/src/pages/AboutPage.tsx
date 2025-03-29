import { motion } from "framer-motion";
import { Link } from "wouter";
import angelImage from "@assets/angel.jpg";

export default function AboutPage() {
  return (
    <main className="pt-20 min-h-screen bg-white">
      <section className="py-12 bg-[var(--color-plum)] text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Angel Mwende</h1>
            <p className="text-xl max-w-2xl mx-auto">
              The story, vision, and passion behind Beautify by Angel
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src={angelImage} 
                alt="Angel Mwende - CEO of Beautify by Angel" 
                className="rounded-lg shadow-xl w-full h-auto"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-[var(--color-plum)] mb-6">My Journey</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  I'm Angel Mwende, founder and creative director of Beautify by Angel. My journey in the beauty industry began over a decade ago, sparked by a passion for hair braiding that I discovered as a young girl growing up in Nairobi.
                </p>
                <p>
                  After receiving formal training at one of Kenya's premier beauty academies, I expanded my skillset to include makeup artistry, nail design, and henna art. My approach combines traditional African beauty practices with modern techniques, creating unique experiences for my clients.
                </p>
                <p>
                  What sets Beautify by Angel apart is our commitment to detail—whether it's the precision of a braid pattern, the blend of makeup tones, or the intricate lines of a henna design. Our slogan, "Beauty Woven in Every Detail," reflects this philosophy that guides everything we do.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-[var(--color-ivory)]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--color-plum)] mb-4">Our Philosophy</h2>
            <div className="w-24 h-1 bg-[var(--color-amber)] mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white p-8 rounded-lg shadow-md"
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <div className="w-16 h-16 bg-[var(--color-amber)] rounded-full flex items-center justify-center text-white mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Creativity</h3>
              <p className="text-gray-700 text-center">
                We approach each client as a blank canvas, creating customized beauty solutions that highlight their unique features and personality. Innovation drives our work, whether following trends or creating new ones.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-8 rounded-lg shadow-md"
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <div className="w-16 h-16 bg-[var(--color-amber)] rounded-full flex items-center justify-center text-white mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Precision</h3>
              <p className="text-gray-700 text-center">
                The details make the difference in beauty services. From perfectly symmetrical braids to flawlessly blended makeup, we pride ourselves on precision in every aspect of our craft, ensuring exceptional results every time.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-8 rounded-lg shadow-md"
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <div className="w-16 h-16 bg-[var(--color-amber)] rounded-full flex items-center justify-center text-white mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Satisfaction</h3>
              <p className="text-gray-700 text-center">
                Client experience is at the heart of everything we do. We listen to your needs, respect your time, and aim to exceed expectations. Your smile when you see the final result is our greatest reward.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-[var(--color-plum)] mb-6">Our Vision</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  At Beautify by Angel, we envision becoming Nairobi's leading beauty destination known for exceptional craftsmanship and personalized service. We aim to empower our clients through beauty, helping them express their unique identity and enhancing their natural features.
                </p>
                <p>
                  We're committed to using premium, ethically-sourced products and staying at the forefront of beauty trends while honoring traditional techniques. As we grow, we plan to expand our team with talented artists who share our passion for detail and excellence.
                </p>
                <p>
                  Beyond beauty services, we strive to create a community where clients feel valued, understood, and transformed—not just in appearance but in confidence. Every service at Beautify by Angel is more than a beauty treatment; it's an experience where detail matters.
                </p>
              </div>
            </div>
            
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1589710751893-f9a6770ad71b?q=80&w=1887&auto=format&fit=crop" 
                alt="Luxury beauty salon space" 
                className="rounded-lg shadow-xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-[var(--color-plum)] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience the Difference?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Book your appointment with Angel and discover beauty woven in every detail
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
      </section>
    </main>
  );
}
