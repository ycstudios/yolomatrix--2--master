"use client"

import { useParams } from "next/navigation"
import FloatingActions from "@/components/floating-actions"
import CategoryDetail from "@/components/category-detail"

// Mock data for a specific mansion
const mansionData = {
  id: "beverly-hills-estate",
  title: "Beverly Hills Estate",
  description:
    "Luxurious mansion with panoramic views of Los Angeles, featuring a grand pool, home theater, and wine cellar.",
  longDescription:
    "Experience the epitome of luxury living in this magnificent Beverly Hills estate. Perched high in the hills with breathtaking panoramic views of Los Angeles, this architectural masterpiece offers unparalleled privacy and opulence. The property features meticulously landscaped gardens, a grand infinity pool that seems to merge with the horizon, a state-of-the-art home theater, and an extensive wine cellar housing rare vintages. Each of the seven bedroom suites has been individually designed with the finest materials and furnishings, ensuring absolute comfort and elegance. The mansion includes a fully-equipped gourmet kitchen, formal dining room, multiple living areas, a fitness center with sauna, and a private office. A full staff including a private chef, housekeeping, and security is available to cater to your every need during your stay.",
  price: 15000,
  priceUnit: "night",
  location: "Beverly Hills, CA",
  rating: 4.9,
  reviews: 28,
  images: [
    "/placeholder.svg?height=800&width=1200",
    "/placeholder.svg?height=800&width=1200",
    "/placeholder.svg?height=800&width=1200",
    "/placeholder.svg?height=800&width=1200",
    "/placeholder.svg?height=800&width=1200",
  ],
  amenities: ["pool", "spa", "gym", "wifi", "parking", "ac", "kitchen", "staff", "security", "helipad"],
  features: [
    "7 bedroom suites with en-suite bathrooms",
    "Infinity pool with panoramic views",
    "Home theater with professional sound system",
    "Wine cellar with temperature control",
    "Gourmet kitchen with professional appliances",
    "Multiple outdoor entertainment areas",
    "Helipad for private arrivals and departures",
    "Private gym with latest equipment",
    "Spa with sauna, steam room, and massage area",
    "24/7 security and surveillance system",
  ],
  specifications: {
    "Property Size": "15,000 sq ft",
    "Lot Size": "2 acres",
    Bedrooms: "7",
    Bathrooms: "9",
    Parking: "10 cars",
    "Year Built": "2018",
    Renovated: "2022",
    View: "Panoramic city and ocean views",
  },
  categoryType: "mansions",
}

export default function MansionDetailPage() {
  const params = useParams()
  const mansionId = params.id as string

  // In a real application, you would fetch the data based on the ID
  // For this example, we're using the mock data

  return (
    <main className="min-h-screen pt-16">
      <CategoryDetail {...mansionData} />
      <FloatingActions />
    </main>
  )
}
