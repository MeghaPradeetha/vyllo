"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { LayoutDashboard, Link as LinkIcon, Settings, LogOut, User } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export function Sidebar() {
  const pathname = usePathname()
  const { userProfile, signOut } = useAuth()

  const links = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/connections", label: "Connections", icon: LinkIcon },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="w-64 bg-zinc-900/50 border-r border-white/10 flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2 mb-8">
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Vyllo
          </span>
        </Link>

        {userProfile && (
          <div className="flex items-center gap-3 mb-8 p-3 bg-white/5 rounded-xl border border-white/5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
              {userProfile.avatar ? (
                <img src={userProfile.avatar} alt={userProfile.username} className="w-full h-full rounded-full object-cover" />
              ) : (
                userProfile.username[0].toUpperCase()
              )}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{userProfile.displayName}</p>
              <p className="text-xs text-gray-400 truncate">@{userProfile.username}</p>
            </div>
          </div>
        )}

        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            
            return (
              <Link key={link.href} href={link.href}>
                <div
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{link.label}</span>
                </div>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-white/10">
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  )
}
