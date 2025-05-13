"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import FloatingActions from "@/components/floating-actions"
import CategoryFilter from "@/components/category-filter"
import CategoryItem, { type CategoryItemProps } from "@/components/category-item"
import { useLanguage } from "@/contexts/language-context"
import Footer from "@/components/footer"
import { useSpring, animated, config } from "react-spring"
import { motion } from "framer-motion"

// Mock data for concierge services
export const conciergeData: CategoryItemProps[] = [
  {
    id: "private-events",
    title: "Private Event Planning",
    description: "Bespoke event planning service for exclusive parties, celebrations, and corporate gatherings.",
    price: 5000,
    priceUnit: "day",
    location: "Global",
    rating: 4.9,
    reviews: 42,
    images: ["/images/package/event.jpeg"],
    amenities: ["staff", "security"],
    featured: true,
    categoryType: "concierge",
  },
  {
    id: "personal-shopping",
    title: "Personal Shopping Experience",
    description: "VIP shopping experiences with exclusive access to designer collections and private showrooms.",
    price: 2000,
    priceUnit: "day",
    location: "Paris, Milan, New York",
    rating: 4.8,
    reviews: 36,
    images: ["/images/package/shop.jpg"],
    amenities: ["staff"],
    categoryType: "concierge",
  },
  {
    id: "private-chef",
    title: "Private Chef Service",
    description: "Michelin-starred chefs creating personalized dining experiences in your luxury accommodation.",
    price: 1500,
    priceUnit: "day",
    location: "Global",
    rating: 4.9,
    reviews: 58,
    images: ["/images/package/chif.jpg"],
    amenities: ["staff"],
    categoryType: "concierge",
  },
  {
    id: "yacht-charter",
    title: "Yacht Charter Arrangement",
    description:
      "End-to-end yacht charter service including crew selection, itinerary planning, and onboard experiences.",
    price: 3000,
    priceUnit: "day",
    location: "Mediterranean, Caribbean",
    rating: 4.7,
    reviews: 29,
    images: ["/images/package/yetchs.jpg"],
    amenities: ["staff", "security"],
    categoryType: "concierge",
  },
  {
    id: "private-tours",
    title: "Private Cultural Tours",
    description: "Exclusive access to museums, historical sites, and cultural experiences with expert guides.",
    price: 1200,
    priceUnit: "day",
    location: "Europe, Asia",
    rating: 4.8,
    reviews: 45,
    images: ["/images/package/tour.jpg"],
    amenities: ["staff"],
    categoryType: "concierge",
  },
  {
    id: "wellness-retreat",
    title: "Wellness Retreat Planning",
    description: "Curated wellness experiences including spa treatments, fitness programs, and mindfulness activities.",
    price: 2500,
    priceUnit: "day",
    location: "Bali, Maldives, Switzerland",
    rating: 4.9,
    reviews: 38,
    images: ["/images/package/shanti.jpg"],
    amenities: ["staff"],
    categoryType: "concierge",
  },
]

export default function ConciergePage() {
  const { t } = useLanguage()
  const [filteredServices, setFilteredServices] = useState<CategoryItemProps[]>(conciergeData)
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  
  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    amenities: [] as string[],
    locations: [] as string[],
    sortBy: "recommended",
  })

  // Hero animation values based on scroll position
  const [{ scale, blur, opacity, gradientOpacity, translateY }, setHeroSpring] = useSpring(() => ({
    scale: 1,
    blur: 0,
    opacity: 1,
    gradientOpacity: 0.6,
    translateY: 0,
    config: { mass: 1, tension: 280, friction: 60 }
  }))

  // Handle scroll events with passive listener for performance
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)
      
      // Calculate animation values based on scroll
      const heroHeight = heroRef.current?.offsetHeight || 0
      const scrollProgress = Math.min(currentScrollY / (heroHeight * 0.8), 1)
      
      // Set spring values for animations
      setHeroSpring({
        scale: 1 + (scrollProgress * 0.3), // Max zoom 1.3x
        blur: scrollProgress * 2,
        opacity: 1 - (scrollProgress * 0.3),
        gradientOpacity: 0.6 + (scrollProgress * 0.2),
        translateY: currentScrollY * 0.2 // Parallax effect
      })
    }

    // Add scroll listener with passive option for better performance
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Initial calculation
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [setHeroSpring])

  // Auto-play video when component mounts
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Video autoplay prevented:", error);
        // Could add a play button here if autoplay is blocked
      });
    }
  }, [])

  useEffect(() => {
    let filtered = [...conciergeData]

    // Filter by price
    filtered = filtered.filter(
      (service) => service.price >= filters.priceRange[0] && service.price <= filters.priceRange[1],
    )

    // Filter by amenities
    if (filters.amenities.length > 0) {
      filtered = filtered.filter((service) => filters.amenities.every((amenity) => service.amenities.includes(amenity)))
    }

    // Filter by location
    if (filters.locations.length > 0) {
      filtered = filtered.filter((service) => filters.locations.some((loc) => service.location.includes(loc)))
    }

    // Sort
    switch (filters.sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      default:
        // Keep default order (recommended)
        break
    }

    setFilteredServices(filtered)
  }, [filters])

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
  }

  // Text animation variants for staggered animation
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.2,
        duration: 0.8,
        ease: [0.215, 0.61, 0.355, 1]
      }
    })
  }

  return (
    <main className="min-h-screen pt-0">
      {/* Hero Banner with Video Background */}
      <section ref={heroRef} className="relative h-[80vh] sm:h-[60vh] md:h-[70vh] w-full overflow-hidden">
        <animated.div
          style={{
            transform: scale.to(s => `scale(${s})`),
            filter: blur.to(b => `blur(${b}px)`),
          }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Video Background */}
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute w-full h-full object-cover"
          >
            <source src="/images/Concierge/Bespoke Concierge Services Demo Video (1).mp4" type="video/mp4" />
            {/* Fallback if video doesn't load */}
            <Image
              src="/images/Concierge/fallback.jpg"
              alt="Background"
              fill
              className="object-cover"
            />
          </video>
        </animated.div>
        
        {/* Overlay */}
        <animated.div 
          style={{ 
            opacity: gradientOpacity 
          }}
          className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" 
        />
        
        {/* Content */}
        <animated.div 
          style={{ 
            opacity,
            transform: translateY.to(y => `translateY(${y}px)`)
          }}
          className="absolute inset-0 flex items-center justify-center text-center"
        >
          <div className="max-w-4xl px-4">
            <motion.h1 
              custom={0}
              initial="hidden"
              animate="visible"
              variants={textVariants}
              className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-md"
            >
              {t("category.concierge")}
            </motion.h1>
            
            <motion.p 
              custom={1}
              initial="hidden"
              animate="visible"
              variants={textVariants}
              className="text-lg md:text-xl text-gray-200 mb-6 max-w-3xl mx-auto drop-shadow-sm"
            >
              Exclusive concierge services tailored to your every need and desire.
            </motion.p>
            
            <motion.div
              custom={2}
              initial="hidden"
              animate="visible"
              variants={textVariants}
            >
              <Button 
                size="lg"
                className="bg-white text-black hover:bg-gray-100 transition-all"
              >
                Explore Now
              </Button>
            </motion.div>
          </div>
        </animated.div>
      </section>

      {/* Concierge Content */}
      <section className="py-16 bg-white dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filter */}
            <div className="lg:w-1/4">
              <CategoryFilter categoryType="concierge" onFilterChange={handleFilterChange} />
            </div>

            {/* Concierge Grid */}
            <div className="lg:w-3/4">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">{t("category.concierge")}</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  {filteredServices.length} {t("category.results")}
                </p>
              </div>

              {filteredServices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredServices.map((service, index) => (
                    <motion.div 
                      key={service.id} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        delay: index * 0.1,
                        duration: 0.5,
                        ease: "easeOut"
                      }}
                      whileHover={{ scale: 1.05 }}
                      className="transition-shadow duration-300 hover:shadow-lg rounded-xl overflow-hidden"
                    >
                      <CategoryItem {...service} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-8 text-center">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{t("category.noResults")}</p>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setFilters({
                        priceRange: [0, 10000],
                        amenities: [],
                        locations: [],
                        sortBy: "recommended",
                      })
                    }
                  >
                    {t("category.reset")}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingActions />
    </main>
  )
}