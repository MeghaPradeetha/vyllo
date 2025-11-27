"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { ConnectionCard } from "@/components/dashboard/ConnectionCard"
import { getConnections } from "@/lib/db/connections"
import { Platform, PlatformConnection } from "@/types/database"

export default function ConnectionsPage() {
  const { user } = useAuth()
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Connections</h1>
        <p className="text-gray-400">
          Manage your social media connections and sync settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(['youtube', 'tiktok', 'instagram'] as Platform[]).map((platform, index) => (
          <motion.div
            key={platform}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
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
  )
}
