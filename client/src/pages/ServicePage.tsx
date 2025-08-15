import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { services } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ServicePage() {
  const [_, params] = useRoute("/services/:id");
  const serviceId = params?.id;
  
  const [service, setService] = useState<any>(null);
  
  useEffect(() => {
    if (serviceId) {
      const foundService = services.find(s => s.id.toString() === serviceId);
      if (foundService) {
        setService(foundService);
      }
    }
  }, [serviceId]);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardContent className="pt-6">
            <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
            <p className="text-gray-600 mb-6">The service you're looking for doesn't exist or has been removed.</p>
            <Link href="/">
              <Button variant="default">Return Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Service Header */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img 
          src={service.image} 
          alt={service.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(26,26,26,0.7)] to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="container mx-auto">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {service.title}
            </motion.h1>
            <motion.p 
              className="text-xl text-white/90 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {service.description}
            </motion.p>
          </div>
        </div>
      </div>
      
      {/* Service Details */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview">
              <TabsList className="mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
                <TabsTrigger value="packages">Packages & Pricing</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-[var(--color-plum)] mb-4">About this Service</h2>
                  <p className="text-lg text-gray-700 mb-4">
                    {service.longDescription || `Experience luxury ${service.title.toLowerCase()} with Beautify by Angel. Our approach combines traditional techniques with modern trends to create stunning, personalized designs that enhance your natural beauty.`}
                  </p>
                  <p className="text-lg text-gray-700">
                    Angel takes pride in her attention to detail, ensuring that every client receives a unique experience tailored to their preferences and style.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-[var(--color-plum)] mb-4">What to Expect</h3>
                  <ul className="space-y-3">
                    {service.expectationsList?.map((item: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--color-amber)] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{item}</span>
                      </li>
                    )) || (
                      <>
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--color-amber)] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>A personalized consultation to understand your preferences</span>
                        </li>
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--color-amber)] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Expert advice on styles that complement your features</span>
                        </li>
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--color-amber)] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Premium products and techniques for lasting results</span>
                        </li>
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--color-amber)] mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Care instructions to maintain your look</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="gallery">
                <h2 className="text-2xl font-bold text-[var(--color-plum)] mb-6">Gallery</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {service.galleryImages?.map((image: string, index: number) => (
                    <motion.div 
                      key={index}
                      className="rounded-lg overflow-hidden h-64 bg-gray-100"
                      whileHover={{ scale: 1.03 }}
                      transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    >
                      <img 
                        src={image} 
                        alt={`${service.title} - Gallery Image ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  )) || (
                    // Display at least 6 placeholder gallery images
                    Array(6).fill('').map((_, index) => (
                      <div key={index} className="rounded-lg overflow-hidden h-64 bg-gray-200 flex items-center justify-center">
                        <p className="text-gray-500 text-sm">Gallery image {index + 1}</p>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="packages">
                <h2 className="text-2xl font-bold text-[var(--color-plum)] mb-6">Packages & Pricing</h2>
                
                <div className="space-y-6">
                  {service.packages?.map((pkg: any, index: number) => (
                    <Card key={index} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="p-6 flex flex-col md:flex-row justify-between items-start gap-4">
                          <div>
                            <h3 className="text-xl font-semibold">{pkg.name}</h3>
                            <p className="text-gray-600 mt-1">{pkg.description}</p>
                            <ul className="mt-3 space-y-1">
                              {pkg.features.map((feature: string, idx: number) => (
                                <li key={idx} className="flex items-start text-sm">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[var(--color-amber)] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="md:text-right">
                            <p className="text-2xl font-bold text-[var(--color-plum)]">KSh {pkg.price}</p>
                            <p className="text-sm text-gray-500">{pkg.duration}</p>
                            <Link href="/contact">
                              <Button className="mt-4 bg-[var(--color-amber)] hover:bg-[var(--color-amber)]/90">
                                Contact to Book
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )) || (
                    // Display at least 3 placeholder packages
                    <>
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                            <div>
                              <h3 className="text-xl font-semibold">Basic Package</h3>
                              <p className="text-gray-600 mt-1">Essential service with quality results</p>
                              <ul className="mt-3 space-y-1">
                                <li className="flex items-start text-sm">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[var(--color-amber)] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Standard consultation</span>
                                </li>
                                <li className="flex items-start text-sm">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[var(--color-amber)] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Quality products</span>
                                </li>
                                <li className="flex items-start text-sm">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[var(--color-amber)] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Basic aftercare</span>
                                </li>
                              </ul>
                            </div>
                            <div className="md:text-right">
                              <p className="text-2xl font-bold text-[var(--color-plum)]">KSh 2,500</p>
                              <p className="text-sm text-gray-500">1-2 hours</p>
                              <Link href="/contact">
                                <Button className="mt-4 bg-[var(--color-amber)] hover:bg-[var(--color-amber)]/90">
                                  Contact to Book
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                            <div>
                              <h3 className="text-xl font-semibold">Premium Package</h3>
                              <p className="text-gray-600 mt-1">Luxury service with added benefits</p>
                              <ul className="mt-3 space-y-1">
                                <li className="flex items-start text-sm">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[var(--color-amber)] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Extended consultation</span>
                                </li>
                                <li className="flex items-start text-sm">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[var(--color-amber)] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Premium products</span>
                                </li>
                                <li className="flex items-start text-sm">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[var(--color-amber)] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Complimentary refreshments</span>
                                </li>
                                <li className="flex items-start text-sm">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[var(--color-amber)] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Detailed aftercare package</span>
                                </li>
                              </ul>
                            </div>
                            <div className="md:text-right">
                              <p className="text-2xl font-bold text-[var(--color-plum)]">KSh 4,500</p>
                              <p className="text-sm text-gray-500">2-3 hours</p>
                              <Link href="/contact">
                                <Button className="mt-4 bg-[var(--color-amber)] hover:bg-[var(--color-amber)]/90">
                                  Contact to Book
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                            <div>
                              <h3 className="text-xl font-semibold">VIP Experience</h3>
                              <p className="text-gray-600 mt-1">The ultimate luxury beauty experience</p>
                              <ul className="mt-3 space-y-1">
                                <li className="flex items-start text-sm">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[var(--color-amber)] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Exclusive one-on-one session with Angel</span>
                                </li>
                                <li className="flex items-start text-sm">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[var(--color-amber)] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Top-tier luxury products</span>
                                </li>
                                <li className="flex items-start text-sm">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[var(--color-amber)] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Complimentary champagne & refreshments</span>
                                </li>
                                <li className="flex items-start text-sm">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[var(--color-amber)] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Professional photo shoot of your final look</span>
                                </li>
                                <li className="flex items-start text-sm">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[var(--color-amber)] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Comprehensive aftercare package & products</span>
                                </li>
                              </ul>
                            </div>
                            <div className="md:text-right">
                              <p className="text-2xl font-bold text-[var(--color-plum)]">KSh 8,000</p>
                              <p className="text-sm text-gray-500">3-4 hours</p>
                              <Link href="/contact">
                                <Button className="mt-4 bg-[var(--color-amber)] hover:bg-[var(--color-amber)]/90">
                                  Contact to Book
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-[var(--color-plum)] mb-4">Ready to Get Started?</h3>
                <p className="text-gray-700 mb-6">
                  Experience premium {service.title.toLowerCase()} with Angel. Contact us to schedule your appointment.
                </p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Starting Price:</span>
                    <span className="font-semibold">KSh {service.startingPrice || "2,500"}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-semibold">{service.duration || "1-3 hours"}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-semibold">Nairobi, Kenya</span>
                  </div>
                </div>
                
                <Link href="/contact">
                  <Button className="w-full bg-[var(--color-amber)] hover:bg-[var(--color-amber)]/90 text-lg py-6">
                    Contact Now
                  </Button>
                </Link>
                
                <p className="text-sm text-gray-500 mt-4 text-center">
                  30% deposit required to secure appointment
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
