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

// Mock data for yachts
export const yachtsData: CategoryItemProps[] = [
  {
    id: "azure-dream",
    title: "Azure Dream",
    description: "Magnificent 180-foot superyacht with 5 luxurious cabins, jacuzzi, and a professional crew of 12.",
    price: 75000,
    priceUnit: "week",
    location: "Mediterranean",
    rating: 4.9,
    reviews: 18,
    images: ["/images/yachts_img/Yachts_img1.jpg"],
    amenities: ["wifi", "bar", "kitchen", "staff", "ac"],
    featured: true,
    categoryType: "yachts",
  },
  {
    id: "ocean-paradise",
    title: "Ocean Paradise",
    description:
      "Sleek 165-foot motor yacht featuring a glass-bottom pool, helipad, and state-of-the-art entertainment systems.",
    price: 65000,
    priceUnit: "week",
    location: "Caribbean",
    rating: 4.8,
    reviews: 22,
    images: ["/images/yachts_img/Yachts_img2.jpg"],
    amenities: ["wifi", "bar", "kitchen", "staff", "ac"],
    categoryType: "yachts",
  },
  {
    id: "royal-blue",
    title: "Royal Blue",
    description: "Classic 145-foot sailing yacht combining traditional craftsmanship with modern luxury amenities.",
    price: 45000,
    priceUnit: "week",
    location: "Greek Islands",
    rating: 4.7,
    reviews: 15,
    images: ["/images/yachts_img/Yachts_img3.jpg"],
    amenities: ["wifi", "bar", "kitchen", "staff", "ac"],
    categoryType: "yachts",
  },
  {
    id: "diamond-seas",
    title: "Diamond Seas",
    description: "Ultra-modern 200-foot superyacht with expansive deck spaces, beach club, and cinema room.",
    price: 90000,
    priceUnit: "week",
    location: "French Riviera",
    rating: 4.9,
    reviews: 12,
    images: ["/images/yachts_img/Yachts_img4.jpg"],
    amenities: ["wifi", "bar", "kitchen", "staff", "ac"],
    categoryType: "yachts",
  },
  {
    id: "emerald-wave",
    title: "Emerald Wave",
    description: "Sporty 120-foot yacht perfect for island hopping, featuring water toys and a spacious sundeck.",
    price: 55000,
    priceUnit: "week",
    location: "Bahamas",
    rating: 4.8,
    reviews: 20,
    images: ["/images/yachts_img/Yachts_img5.jpg"],
    amenities: ["wifi", "bar", "kitchen", "staff", "ac"],
    categoryType: "yachts",
  },
  {
    id: "crystal-blue",
    title: "Crystal Blue",
    description: "Elegant 175-foot motor yacht with sophisticated interiors, spa, and gourmet dining experiences.",
    price: 70000,
    priceUnit: "week",
    location: "Amalfi Coast",
    rating: 4.9,
    reviews: 16,
    images: ["/images/yachts_img/Yachts_img6.jpg"],
    amenities: ["wifi", "bar", "kitchen", "staff", "ac"],
    categoryType: "yachts",
  },
]

export default function YachtsPage() {
  const { t } = useLanguage()
  const [filteredYachts, setFilteredYachts] = useState<CategoryItemProps[]>(yachtsData)
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  
  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
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
    let filtered = [...yachtsData]

    // Filter by price
    filtered = filtered.filter((yacht) => yacht.price >= filters.priceRange[0] && yacht.price <= filters.priceRange[1])

    // Filter by amenities
    if (filters.amenities.length > 0) {
      filtered = filtered.filter((yacht) => filters.amenities.every((amenity) => yacht.amenities.includes(amenity)))
    }

    // Filter by location
    if (filters.locations.length > 0) {
      filtered = filtered.filter((yacht) => filters.locations.some((loc) => yacht.location.includes(loc)))
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

    setFilteredYachts(filtered)
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
      {/* Hero Section with Video Background */}
      <section ref={heroRef} className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
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
            <source src="/Video/yathch.mp4" type="video/mp4" />
            {/* Fallback image in case video doesn't load */}
            <Image
              src="/images/yachts_img/Yachts_hero.jpg"
              alt={t("category.yachts")}
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
              {t("category.yachts")}
            </motion.h1>
            
            <motion.p 
              custom={1}
              initial="hidden"
              animate="visible"
              variants={textVariants}
              className="text-lg md:text-xl text-gray-200 mb-6 max-w-3xl mx-auto drop-shadow-sm"
            >
              Set sail in ultimate luxury with our exclusive collection of superyachts.
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

      {/* Yachts Content */}
      <section className="py-16 bg-white dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filter */}
            <div className="lg:w-1/4">
              <CategoryFilter categoryType="yachts" onFilterChange={handleFilterChange} />
            </div>

            {/* Yachts Grid */}
            <div className="lg:w-3/4">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">{t("category.yachts")}</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  {filteredYachts.length} {t("category.results")}
                </p>
              </div>

              {filteredYachts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredYachts.map((yacht, index) => (
                    <motion.div 
                      key={yacht.id} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        delay: index * 0.1,
                        duration: 0.5,
                        ease: "easeOut"
                      }}
                      className="transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      <CategoryItem {...yacht} />
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
                        priceRange: [0, 100000],
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