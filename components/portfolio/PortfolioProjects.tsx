"use client"

import { motion } from "framer-motion"
import { Play, Heart, Eye, ExternalLink } from "lucide-react"
import { ContentItem, Platform } from "@/types/database"
import { useState } from "react"

interface PortfolioProjectsProps {
  content:  ContentItem[]
}

export function PortfolioProjects({ content }: PortfolioProjectsProps) {
  const [filter, setFilter] = useState<Platform | 'all'>('all')
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const filteredContent = filter === 'all' 
    ? content 
    : content.filter(item => item.platform === filter)

  const platformColors: Record<Platform, string> = {
    youtube: "from-red-500 to-red-600",
    tiktok: "from-black to-zinc-800",
    instagram: "from-purple-500 to-pink-500",
  }

  const platformNames: Record<Platform, string> = {
    youtube: "YouTube",
    tiktok: "TikTok",
    instagram: "Instagram",
  }

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            My <span className="text-gradient bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Content</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Explore my latest videos and creative projects
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center gap-3 mb-12 flex-wrap"
        >
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
              filter === 'all'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
            }`}
          >
            All
          </button>
          {(['youtube', 'tiktok', 'instagram'] as Platform[]).map((platform) => (
            <button
              key={platform}
              onClick={() => setFilter(platform)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                filter === platform
                  ? `bg-gradient-to-r ${platformColors[platform]} text-white shadow-lg`
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
              }`}
            >
              {platformNames[platform]}
            </button>
          ))}
        </motion.div>

        {/* Content Grid */}
        {filteredContent.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">📹</div>
            <p className="text-gray-400 text-lg">No content available yet</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group cursor-pointer"
              >
                <a
                  href={item.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  {/* Card */}
                  <div className="relative overflow-hidden rounded-2xl bg-zinc-900 border border-white/10 transition-all duration-500 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 hover:scale-[1.02]">
                    {/* Thumbnail */}
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={item.thumbnailUrl || '/images/portfolio/placeholder-project.png'}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60" />
                      
                      {/* Platform Badge */}
                      <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${platformColors[item.platform]} text-white shadow-lg`}>
                        {platformNames[item.platform]}
                      </div>

                      {/* Play Button Overlay */}
                      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${hoveredId === item.id ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="bg-purple-500 rounded-full p-4 shadow-2xl transform transition-transform duration-300 group-hover:scale-110">
                          <Play className="w-8 h-8 text-white fill-current" />
                        </div>
                      </div>
                    </div>

                    {/* Content Info */}
                    <div className="p-5">
                      <h3 className="text-white font-bold text-lg mb-3 line-clamp-2 group-hover:text-purple-400 transition-colors">
                        {item.title}
                      </h3>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{formatNumber(item.views)}</span>
                        </div>
                        {item.likes && (
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            <span>{formatNumber(item.likes)}</span>
                          </div>
                        )}
                        <div className="flex-1" />
                        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// Helper function to format large numbers
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}
