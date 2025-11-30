import React from 'react'
import { Mail, MessageSquare, MapPin } from 'lucide-react'

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-zinc-950 text-gray-300 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-6">Get in Touch</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Have questions about Vyllo? We're here to help.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/10">
              <h3 className="text-xl font-bold text-white mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Email Us</h4>
                    <p className="text-gray-400">support@vyllo.com</p>
                    <p className="text-gray-400">partnerships@vyllo.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Support Hours</h4>
                    <p className="text-gray-400">Monday - Friday</p>
                    <p className="text-gray-400">9:00 AM - 6:00 PM EST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Location</h4>
                    <p className="text-gray-400">San Francisco, CA</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-zinc-900 p-8 rounded-2xl border border-white/10">
            <h3 className="text-xl font-bold text-white mb-6">Send us a Message</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                <input 
                  type="text" 
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                <textarea 
                  rows={4}
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="How can we help?"
                />
              </div>
              <button 
                type="button"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
