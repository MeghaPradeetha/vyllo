"use client"

import { motion } from "framer-motion"
import { Youtube, Instagram, Link as LinkIcon } from "lucide-react"
import { UserProfile } from "@/types/database"

interface PortfolioHeroProps {
  profile: UserProfile
}

export function PortfolioHero({ profile }: PortfolioHeroProps) {
  const socialIcons: Record<string, any> = {
    youtube: Youtube,
    instagram: Instagram,
  }

  return (
    <div className="relative">
      {/* Cover Photo with Parallax Effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-80 w-full overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center transform scale-105"
          style={{
            backgroundImage: `url(${profile.avatar ? '/images/portfolio/default-cover.png' : '/images/portfolio/default-cover.png'})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-zinc-950" />
      </motion.div>

      {/* Profile Info Card */}
      <div className="relative max-w-6xl mx-auto px-6 -mt-32">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          {/* Glassmorphism Card */}
          <div className="backdrop-blur-xl bg-zinc-900/70 border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Profile Picture */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="relative"
              >
                <div className="relative w-32 h-32 rounded-3xl overflow-hidden ring-4 ring-purple-500/30 shadow-2xl">
                  <img
                    src={profile.avatar || '/images/default.jpg'}
                    alt={profile.displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Status Indicator */}
                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1 ring-4 ring-zinc-900">
                  <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse" />
                </div>
              </motion.div>

              {/* Info */}
              <div className="flex-1">
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="text-4xl md:text-5xl font-bold text-white mb-2"
                >
                  {profile.displayName}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="text-lg text-purple-400 mb-4"
                >
                  @{profile.username}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="text-gray-300 text-lg leading-relaxed mb-6 max-w-2xl"
                >
                  {profile.bio || "Content creator sharing amazing stories and experiences."}
                </motion.p>

                {/* Social Links */}
                {profile.socialLinks && Object.keys(profile.socialLinks).length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="flex gap-3"
                  >
                    {Object.entries(profile.socialLinks).map(([platform, url]) => {
                      if (!url) return null
                      const Icon = socialIcons[platform] || LinkIcon
                      return (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 rounded-xl transition-all duration-300"
                        >
                          <Icon className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {platform}
                          </div>
                        </a>
                      )
                    })}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
