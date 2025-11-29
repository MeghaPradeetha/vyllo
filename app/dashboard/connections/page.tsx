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
  const [syncing, setSyncing] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    async function fetchConnections() {
      if (user) {
        const data = await getConnections(user.uid)
        setConnections(data)
        setLoading(false)
      }
    }
    fetchConnections()
    
    // Check for URL params (OAuth callback)
    const params = new URLSearchParams(window.location.search)
    const success = params.get('success')
    const error = params.get('error')
    
    if (success === 'youtube_connected') {
      setMessage({ type: 'success', text: 'YouTube connected successfully!' })
      // Refresh connections
      if (user) fetchConnections()
      // Clear URL params
      window.history.replaceState({}, '', '/dashboard/connections')
    } else if (error) {
      setMessage({ type: 'error', text: `Connection failed: ${error}` })
      window.history.replaceState({}, '', '/dashboard/connections')
    }
  }, [user])

  const handleConnect = (platform: Platform) => {
    if (platform === 'youtube') {
      if (!user) {
        setMessage({ type: 'error', text: 'Please log in first' })
        return
      }
      // Redirect to YouTube OAuth with userId
      window.location.href = `/api/auth/youtube?userId=${user.uid}`
    } else {
      setMessage({ type: 'error', text: `${platform} integration coming soon!` })
    }
  }

  const handleDisconnect = async (platform: Platform) => {
    if (!user) return
    
    if (!confirm(`Are you sure you want to disconnect ${platform}?`)) {
      return
    }
    
    setLoading(true)
    try {
      const idToken = await user.getIdToken()
      const response = await fetch(`/api/${platform}/disconnect`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      })
      
      if (!response.ok) {
        throw new Error('Failed to disconnect')
      }
      
      // Update local state
      setConnections(prev => ({ ...prev, [platform]: null }))
      setMessage({ type: 'success', text: `${platform} disconnected successfully` })
    } catch (error) {
      console.error('Error disconnecting:', error)
      setMessage({ type: 'error', text: `Failed to disconnect ${platform}` })
    } finally {
      setLoading(false)
    }
  }
  
  const handleSync = async (platform: Platform) => {
    if (!user) return
    
    setSyncing(true)
    setMessage(null)
    try {
      const idToken = await user.getIdToken()
      const response = await fetch(`/api/${platform}/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to sync')
      }
      
      setMessage({ 
        type: 'success', 
        text: `Synced ${data.itemsAdded} videos from ${platform}!` 
      })
      
      // Refresh connections to update lastSynced
      const updatedConnections = await getConnections(user.uid)
      setConnections(updatedConnections)
    } catch (error: any) {
      console.error('Error syncing:', error)
      setMessage({ type: 'error', text: error.message || `Failed to sync ${platform}` })
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Connections</h1>
        <p className="text-gray-400">
          Manage your social media connections and sync settings.
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-500/10 border-green-500/20 text-green-400' 
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

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
              onSync={platform === 'youtube' ? () => handleSync(platform) : undefined}
              loading={loading}
              syncing={syncing}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
