'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { PortfolioHero } from '@/components/portfolio/PortfolioHero'
import { PortfolioProjects } from '@/components/portfolio/PortfolioProjects'
import { UserProfile, ContentItem } from '@/types/database'
import { Loader2 } from 'lucide-react'

export default function PortfolioPage() {
  const params = useParams()
  const username = params.username as string
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [content, setContent] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function loadPortfolio() {
      try {
        const res = await fetch(`/api/portfolio/${username}`)
        if (!res.ok) {
          setNotFound(true)
          return
        }
        const data = await res.json()
        
        // Convert ISO strings back to Date objects
        const profileWithDates = {
          ...data.profile,
          createdAt: new Date(data.profile.createdAt),
        }
        
        const contentWithDates = data.content.map((item: any) => ({
          ...item,
          publishedAt: new Date(item.publishedAt),
        }))
        
        setProfile(profileWithDates)
        setContent(contentWithDates)
      } catch (error) {
        console.error('Error loading portfolio:', error)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    loadPortfolio()
  }, [username])

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Loading portfolio...</p>
        </div>
      </div>
    )
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-white mb-4">404</h1>
          <h2 className="text-3xl font-bold text-white mb-4">Portfolio Not Found</h2>
          <p className="text-gray-400 text-lg mb-8">
            This portfolio doesn't exist or has been removed.
          </p>
          <a
            href="/"
            className="inline-block px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Go Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <PortfolioHero profile={profile} />
      <PortfolioProjects content={content} />
      
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} {profile.displayName}. Powered by{' '}
            <span className="text-purple-400 font-semibold">Vyllo</span>
          </p>
        </div>
      </footer>
    </div>
  )
}
