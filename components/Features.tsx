"use client"

import { motion } from "framer-motion"
import { Layers, Zap, Palette, Share2 } from "lucide-react"

const features = [
  {
    icon: Layers,
    title: "Multi-Platform Aggregation",
    description: "Seamlessly combine content from Instagram, TikTok, and YouTube in one unified view.",
  },
  {
    icon: Zap,
    title: "Real-Time Updates",
    description: "Your latest posts automatically sync and display instantly across all platforms.",
  },
  {
    icon: Palette,
    title: "Beautiful Presentation",
    description: "Showcase your content with stunning, customizable cards that make your work shine.",
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description: "Share your complete social portfolio with a single link. Perfect for media kits and collaborations.",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
}

export function Features() {
  return (
    <section className="relative py-32 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Everything You Need
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Powerful features designed to help you showcase your social media presence like never before
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group relative p-8 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-zinc-800 hover:border-purple-500/50 transition-all duration-300"
              >
                {/* Glow Effect on Hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300" />
                
                <div className="relative">
                  {/* Icon */}
                  <div className="mb-6 inline-flex p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-300">
                    <Icon className="h-6 w-6 text-purple-400 group-hover:text-purple-300 transition-colors" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* Background Decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
    </section>
  )
}
