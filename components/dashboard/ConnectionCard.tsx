"use client"

import { motion } from "framer-motion"
import { CheckCircle2, XCircle, ArrowRight, Loader2 } from "lucide-react"
import { Platform } from "@/types/database"

interface ConnectionCardProps {
  platform: Platform
  isConnected: boolean
  lastSynced?: Date
  onConnect: () => void
  onDisconnect: () => void
  loading?: boolean
}

export function ConnectionCard({
  platform,
  isConnected,
  lastSynced,
  onConnect,
  onDisconnect,
  loading,
}: ConnectionCardProps) {
  const platformConfig = {
    youtube: {
      name: "YouTube",
      color: "from-red-500 to-red-600",
      icon: (
        <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    tiktok: {
      name: "TikTok",
      color: "from-black to-zinc-800",
      icon: (
        <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      ),
    },
    instagram: {
      name: "Instagram",
      color: "from-purple-500 to-pink-500",
      icon: (
        <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.069-4.85.069-3.204 0-3.584-.012-4.849-.069-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
        </svg>
      ),
    },
  }

  const config = platformConfig[platform]

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="relative overflow-hidden rounded-2xl bg-zinc-900 border border-white/10 p-6 group"
    >
      {/* Background Glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${config.color} shadow-lg`}>
            {config.icon}
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
            isConnected 
              ? "bg-green-500/10 text-green-400 border-green-500/20" 
              : "bg-zinc-800 text-gray-400 border-white/10"
          }`}>
            {isConnected ? "Connected" : "Not Connected"}
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-2">{config.name}</h3>
        <p className="text-gray-400 text-sm mb-6">
          {isConnected 
            ? `Last synced: ${lastSynced ? lastSynced.toLocaleDateString() : 'Never'}`
            : "Connect to showcase your content"}
        </p>

        <button
          onClick={isConnected ? onDisconnect : onConnect}
          disabled={loading}
          className={`w-full py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
            isConnected
              ? "bg-white/5 text-gray-300 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 border border-white/10"
              : `bg-gradient-to-r ${config.color} text-white hover:shadow-lg hover:scale-[1.02]`
          }`}
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isConnected ? (
            <>
              Disconnect
              <XCircle className="h-5 w-5" />
            </>
          ) : (
            <>
              Connect Account
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </div>
    </motion.div>
  )
}
