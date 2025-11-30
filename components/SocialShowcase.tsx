"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { InstagramCard } from "./social/InstagramCard"
import { TikTokCard } from "./social/TikTokCard"
import { YouTubeCard } from "./social/YouTubeCard"
import { Tabs } from "./ui/tabs"

const sampleInstagramPosts = [
  {
    caption: "Golden hour magic ✨ #photography #sunset",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    likes: "12.5K",
    comments: "342",
  },
  {
    caption: "Coffee and code ☕️💻 #developer #lifestyle",
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=80",
    likes: "8.2K",
    comments: "156",
  },
  {
    caption: "Urban exploration 🏙️ #citylife #architecture",
    image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80",
    likes: "15.7K",
    comments: "428",
  },
]

const sampleTikTokVideos = [
  {
    description: "Quick coding tips for beginners 🚀 #coding #tutorial",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
    views: "245K",
    likes: "18.3K",
  },
  {
    description: "Day in the life of a developer 💼 #tech #vlog",
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
    views: "189K",
    likes: "12.1K",
  },
  {
    description: "My setup tour 2024 🖥️ #workspace #tech",
    thumbnail: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80",
    views: "312K",
    likes: "24.5K",
  },
]

const sampleYouTubeVideos = [
  {
    title: "Building a Full-Stack App with Next.js 14 | Complete Tutorial",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    views: "125K",
    likes: "4.2K",
  },
  {
    title: "10 JavaScript Tips Every Developer Should Know",
    thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80",
    views: "89K",
    likes: "3.1K",
  },
  {
    title: "My Coding Journey: From Beginner to Professional",
    thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80",
    views: "156K",
    likes: "5.8K",
  },
]

export function SocialShowcase() {
  const [activeTab, setActiveTab] = useState("instagram")

  const tabs = [
    { id: "instagram", label: "Instagram" },
    { id: "tiktok", label: "TikTok" },
    { id: "youtube", label: "YouTube" },
  ]

  return (
    <section className="relative py-32 bg-gradient-to-b from-black via-zinc-900 to-black">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            See It In Action
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Experience how your content looks across different platforms
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className="mb-12"
        />

        {/* Content Grid */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {activeTab === "instagram" &&
            sampleInstagramPosts.map((post, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <InstagramCard {...post} />
              </motion.div>
            ))}

          {activeTab === "tiktok" &&
            sampleTikTokVideos.map((video, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <TikTokCard {...video} />
              </motion.div>
            ))}

          {activeTab === "youtube" &&
            sampleYouTubeVideos.map((video, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <YouTubeCard {...video} />
              </motion.div>
            ))}
        </motion.div>
      </div>

      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent" />
    </section>
  )
}
