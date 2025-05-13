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

// Mock data for jets
export const jetsData: CategoryItemProps[] = [
  {
    id: "gulfstream-g700",
    title: "Gulfstream G700",
    description:
      "The ultimate in business jet luxury with the industry's largest cabin and range of 7,500 nautical miles.",
    price: 15000,
    priceUnit: "destination",
    location: "Global",
    rating: 4.9,
    reviews: 14,
    images: ["/images/jet_img/jet_img1.jpg"],
    amenities: ["wifi", "bar", "staff", "ac"],
    featured: true,
    categoryType: "jets",
  },
  {
    id: "bombardier-global-7500",
    title: "Bombardier Global 7500",
    description: "Ultra-long-range business jet featuring four living spaces and a dedicated crew suite.",
    price: 14000,
    priceUnit: "destination",
    location: "Global",
    rating: 4.8,
    reviews: 12,
    images: ["/images/jet_img/jet_img2.jpg"],
    amenities: ["wifi", "bar", "staff", "ac"],
    categoryType: "jets",
  },
  {
    id: "dassault-falcon-8x",
    title: "Dassault Falcon 8X",
    description: "Tri-jet offering exceptional performance, comfort, and the longest cabin in the Falcon family.",
    price: 12000,
    priceUnit: "destination",
    location: "Global",
    rating: 4.7,
    reviews: 10,
    images: ["/images/jet_img/jet_img3.jpg"],
    amenities: ["wifi", "bar", "staff", "ac"],
    categoryType: "jets",
  },
  {
    id: "embraer-praetor-600",
    title: "Embraer Praetor 600",
    description:
      "Super-midsize jet with intercontinental range and advanced technology for a smooth flight experience.",
    price: 9000,
    priceUnit: "destination",
    location: "Global",
    rating: 4.8,
    reviews: 9,
    images: ["/images/jet_img/jet_img4.jpg"],
    amenities: ["wifi", "staff", "ac"],
    categoryType: "jets",
  },
  {
    id: "cessna-citation-longitude",
    title: "Cessna Citation Longitude",
    description:
      "Revolutionary cabin experience with the lowest cabin altitude in its class and incredibly quiet interior.",
    price: 8000,
    priceUnit: "destination",
    location: "Global",
    rating: 4.7,
    reviews: 11,
    images: ["/images/jet_img/jet_img5.jpg"],
    amenities: ["wifi", "staff", "ac"],
    categoryType: "jets",
  },
  {
    id: "airbus-acj320neo",
    title: "Airbus ACJ320neo",
    description: "Corporate jet version of the popular A320neo airliner, offering unmatched space and luxury.",
    price: 20000,
    priceUnit: "destination",
    location: "Global",
    rating: 4.9,
    reviews: 8,
    images: ["/images/jet_img/jet_img6.jpg"],
    amenities: ["wifi", "bar", "staff", "ac"],
    categoryType: "jets",
  },
]

export default function JetsPage() {
  const { t } = useLanguage()
  const [filteredJets, setFilteredJets] = useState<CategoryItemProps[]>(jetsData)
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  
  const [filters, setFilters] = useState({
    priceRange: [0, 25000],
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
    let filtered = [...jetsData]

    // Filter by price
    filtered = filtered.filter((jet) => jet.price >= filters.priceRange[0] && jet.price <= filters.priceRange[1])

    // Filter by amenities
    if (filters.amenities.length > 0) {
      filtered = filtered.filter((jet) => filters.amenities.every((amenity) => jet.amenities.includes(amenity)))
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

    setFilteredJets(filtered)
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
      {/* Enhanced Hero Banner with Video Background */}
      <section ref={heroRef} className="relative h-[80vh] sm:h-[60vh] md:h-[70vh] w-full overflow-hidden">
        <animated.div
          style={{
            transform: scale.to(s => `scale(${s})`),
            filter: blur.to(b => `blur(${b}px)`),
          }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Video background instead of image */}
          <video 
            ref={videoRef}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src="/Video/luxury-jets.mp4" type="video/mp4" />
            {/* Fallback image in case video doesn't load */}
            <Image
              src="/images/jet_img/jet_hero.avif"
              alt={t("category.jets")}
              fill
              className="object-cover"
              priority
            />
          </video>
        </animated.div>
        
        <animated.div 
          style={{ 
            opacity: gradientOpacity 
          }}
          className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" 
        />
        
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
              {t("category.jets")}
            </motion.h1>
            
            <motion.p 
              custom={1}
              initial="hidden"
              animate="visible"
              variants={textVariants}
              className="text-lg md:text-xl text-gray-200 mb-6 max-w-3xl mx-auto drop-shadow-sm"
            >
              Experience the pinnacle of air travel with our exclusive private jet collection.
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

      {/* Jets Content */}
      <section className="py-16 bg-white dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filter */}
            <div className="lg:w-1/4">
              <CategoryFilter categoryType="jets" onFilterChange={handleFilterChange} />
            </div>

            {/* Jets Grid */}
            <div className="lg:w-3/4">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">{t("category.jets")}</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  {filteredJets.length} {t("category.results")}
                </p>
              </div>

              {filteredJets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredJets.map((jet, index) => (
                    <motion.div 
                      key={jet.id} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        delay: index * 0.1,
                        duration: 0.5,
                        ease: "easeOut"
                      }}
                      className="transition-transform duration-300 hover:scale-105 hover:shadow-lg rounded-xl overflow-hidden"
                    >
                      <CategoryItem {...jet} />
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
                        priceRange: [0, 25000],
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