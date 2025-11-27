"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { auth, isConfigured } from '@/lib/firebase'
import { UserProfile } from '@/types/database'
import { getUserProfile, createUserProfile, updateUserProfile } from '@/lib/db/users'

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  signUp: (email: string, password: string, username: string, displayName: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isConfigured || !auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      
      if (user) {
        // Fetch user profile
        const profile = await getUserProfile(user.uid)
        setUserProfile(profile)
      } else {
        setUserProfile(null)
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signUp = async (email: string, password: string, username: string, displayName: string) => {
    if (!auth) throw new Error('Firebase not configured')
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    
    // Create user profile in Firestore
    await createUserProfile(userCredential.user.uid, {
      username,
      displayName,
      bio: '',
      avatar: '',
    })
  }

  const signIn = async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase not configured')
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signInWithGoogle = async () => {
    if (!auth) throw new Error('Firebase not configured')
    
    const provider = new GoogleAuthProvider()
    const userCredential = await signInWithPopup(auth, provider)
    
    // Check if profile exists, if not create one
    const existingProfile = await getUserProfile(userCredential.user.uid)
    if (!existingProfile) {
      // Generate username from email
      const username = userCredential.user.email?.split('@')[0] || 'user'
      await createUserProfile(userCredential.user.uid, {
        username,
        displayName: userCredential.user.displayName || username,
        bio: '',
        avatar: userCredential.user.photoURL || '',
      })
    } else if (userCredential.user.photoURL) {
      // Check if we should update the avatar
      // Update if:
      // 1. Current avatar is empty/null
      // 2. Current avatar is the default placeholder (if we had one, but we don't seem to have a specific URL for it yet)
      // 3. OR just always update it on Google Sign In? 
      // Let's stick to: if empty or if it looks like a previous google avatar (which is hard to tell without storing it)
      // For now, let's be more aggressive: If they sign in with Google, and they don't have a CUSTOM uploaded avatar (how to tell?), we sync.
      // Since we can't easily distinguish, let's just sync if it's different? No, that might overwrite custom uploads.
      // Let's stick to "if empty" but ensure we handle "undefined" correctly.
      
      if (!existingProfile.avatar) {
         await updateUserProfile(userCredential.user.uid, {
          avatar: userCredential.user.photoURL
        })
        setUserProfile(prev => prev ? { ...prev, avatar: userCredential.user.photoURL! } : null)
      }
    }
  }

  const signOut = async () => {
    if (!auth) throw new Error('Firebase not configured')
    await firebaseSignOut(auth)
  }

  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
