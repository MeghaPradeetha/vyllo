import React from 'react'

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-zinc-950 text-gray-300 py-20 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-6">About Vyllo</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            The ultimate portfolio platform for modern content creators.
          </p>
        </div>

        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Our Mission</h2>
            <p className="text-lg leading-relaxed">
              At Vyllo, we believe that content creators deserve a professional home for their work that goes beyond the algorithm. Our mission is to empower creators to aggregate their best content from YouTube, TikTok, and Instagram into a single, stunning portfolio that they truly own.
            </p>
            <p className="text-lg leading-relaxed">
              We're building tools that help you showcase your creativity, track your growth across platforms, and present yourself professionally to brands and collaborators.
            </p>
          </div>
          <div className="bg-zinc-900 p-8 rounded-2xl border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">Why Vyllo?</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-purple-500 text-xl">✓</span>
                <span>Unified portfolio for all your video content</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-500 text-xl">✓</span>
                <span>Automated sync with major platforms</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-500 text-xl">✓</span>
                <span>Professional, customizable designs</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-500 text-xl">✓</span>
                <span>Analytics and insights in one place</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-white">Our Story</h2>
          <p className="text-lg leading-relaxed">
            Vyllo was born out of a simple frustration: creators have their work scattered across multiple apps, making it hard to show the full picture of their talent. We set out to solve this by creating a seamless integration engine that pulls your content together automatically.
          </p>
          <p className="text-lg leading-relaxed">
            Today, we're helping creators build their personal brand with tools that are as creative and dynamic as they are.
          </p>
        </section>
      </div>
    </div>
  )
}
