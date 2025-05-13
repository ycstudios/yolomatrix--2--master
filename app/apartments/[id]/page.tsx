"use client"

import { useParams } from "next/navigation"
import FloatingActions from "@/components/floating-actions"
import CategoryDetail from "@/components/category-detail"

// Mock data for a specific apartment
const apartmentData = {
  id: "manhattan-penthouse",
  title: "Manhattan Luxury Penthouse",
  description:
    "Stunning penthouse with panoramic views of Central Park and the Manhattan skyline, featuring a private terrace.",
  longDescription:
    "Indulge in the ultimate New York City luxury experience in this magnificent Manhattan penthouse. Located in a prestigious building on Billionaires' Row, this penthouse offers breathtaking 360-degree views of Central Park and the iconic Manhattan skyline through floor-to-ceiling windows. The expansive private terrace is perfect for al fresco dining or simply taking in the spectacular city views. Inside, you'll find exquisite designer furnishings, museum-quality art, and the finest finishes throughout. The gourmet kitchen features top-of-the-line appliances and is fully equipped for preparing meals or having your private chef create culinary masterpieces. The master suite is a sanctuary with a king-sized bed, walk-in closet, and a marble bathroom with a deep soaking tub and separate rain shower. Additional bedrooms offer the same level of luxury and comfort for your guests. The penthouse includes a media room, office space, and a formal dining area perfect for entertaining.",
  price: 5000,
  priceUnit: "night",
  location: "Manhattan, NY",
  rating: 4.9,
  reviews: 42,
  images: [
    "/placeholder.svg?height=800&width=1200",
    "/placeholder.svg?height=800&width=1200",
    "/placeholder.svg?height=800&width=1200",
    "/placeholder.svg?height=800&width=1200",
    "/placeholder.svg?height=800&width=1200",
  ],
  amenities: ["gym", "wifi", "parking", "ac", "kitchen", "security"],
  features: [
    "3 bedroom suites with en-suite bathrooms",
    "Private terrace with panoramic views",
    "Gourmet kitchen with professional appliances",
    "Media room with surround sound",
    "Home office with high-speed internet",
    "24/7 doorman and concierge service",
    "Access to building amenities including pool and fitness center",
  ],
  specifications: {
    "Property Size": "4,500 sq ft",
    "Terrace Size": "1,200 sq ft",
    Bedrooms: "3",
    Bathrooms: "3.5",
    Floor: "Penthouse (52nd floor)",
    "Year Built": "2016",
    Renovated: "2021",
    View: "Central Park and Manhattan skyline",
  },
  categoryType: "apartments",
}

export default function ApartmentDetailPage() {
  const params = useParams()
  const apartmentId = params.id as string

  // In a real application, you would fetch the data based on the ID
  // For this example, we're using the mock data

  return (
    <main className="min-h-screen pt-16">
      <CategoryDetail {...apartmentData} />
      <FloatingActions />
    </main>
  )
}
