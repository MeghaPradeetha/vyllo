import { Hero } from "@/components/Hero"
import { Features } from "@/components/Features"
import { SocialShowcase } from "@/components/SocialShowcase"
import { Footer } from "@/components/Footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Hero />
      <Features />
      <SocialShowcase />
      <Footer />
    </div>
  )
}
