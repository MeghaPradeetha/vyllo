"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { ConnectionCard } from "@/components/dashboard/ConnectionCard"
import { getConnections } from "@/lib/db/connections"
import { Platform, PlatformConnection } from "@/types/database"
import { BarChart3, Eye, ThumbsUp, Share2 } from "lucide-react"

export default function DashboardPage() {
  const { user, userProfile } = useAuth()
  const [connections, setConnections] = useState<Record<Platform, PlatformConnection | null>>({
    youtube: null,
    tiktok: null,
    instagram: null,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchConnections() {
      if (user) {
        const data = await getConnections(user.uid)
        setConnections(data)
        setLoading(false)
      }
    }
    fetchConnections()
  }, [user])

  const handleConnect = (platform: Platform) => {
    // TODO: Implement OAuth flow
    console.log(`Connecting to ${platform}`)
  }

  const handleDisconnect = (platform: Platform) => {
    // TODO: Implement disconnect logic
    console.log(`Disconnecting from ${platform}`)
  }

  const stats = [
    { label: "Total Views", value: "0", icon: Eye, color: "text-blue-400" },
    { label: "Total Likes", value: "0", icon: ThumbsUp, color: "text-pink-400" },
    { label: "Engagement", value: "0%", icon: BarChart3, color: "text-purple-400" },
    { label: "Shares", value: "0", icon: Share2, color: "text-green-400" },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {userProfile?.displayName?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-400">
            Here's what's happening with your portfolio today.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors">
            View Portfolio
          </button>
          <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
            Sync Content
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-zinc-900/50 border border-white/10 p-6 rounded-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 text-sm font-medium">{stat.label}</span>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
            </motion.div>
          )
        })}
      </div>

      {/* Connections Section */}
      <div>
        <h2 className="text-xl font-bold text-white mb-6">Platform Connections</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['youtube', 'tiktok', 'instagram'] as Platform[]).map((platform, index) => (
            <motion.div
              key={platform}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <ConnectionCard
                platform={platform}
                isConnected={!!connections[platform]}
                lastSynced={connections[platform]?.lastSynced}
                onConnect={() => handleConnect(platform)}
                onDisconnect={() => handleDisconnect(platform)}
                loading={loading}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
