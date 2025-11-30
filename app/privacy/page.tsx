import React from 'react'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-zinc-950 text-gray-300 py-20 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">1. Introduction</h2>
          <p>
            Welcome to Vyllo ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services, including our integrations with third-party platforms like YouTube, TikTok, and Instagram.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">2. Information We Collect</h2>
          <p>We collect information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, when you participate in activities on the website, or otherwise when you contact us.</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Personal Information:</strong> Name, email address, and contact data.</li>
            <li><strong>Social Media Data:</strong> When you link your YouTube, TikTok, or Instagram accounts, we access public profile information (username, avatar) and content metadata (video titles, descriptions, views, likes) to display in your portfolio. We do not store your passwords.</li>
            <li><strong>Usage Data:</strong> Information about how you use our website, such as access times, pages viewed, and the route you navigated to get there.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">3. How We Use Your Information</h2>
          <p>We use the information we collect or receive:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>To facilitate account creation and logon processes.</li>
            <li>To generate and display your professional portfolio.</li>
            <li>To send you administrative information, such as product, service, and new feature information.</li>
            <li>To protect our services and for legal compliance.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">4. Third-Party Social Media Services</h2>
          <p>
            Our service allows you to link your account with third-party social media service providers. If you choose to link your account with a third-party account, we use the information you allowed us to collect from those third parties to facilitate account creation and logon processes and to display your content. We comply with the developer policies of these platforms (e.g., YouTube API Services Terms of Service, TikTok for Developers Terms of Service).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">5. Data Retention</h2>
          <p>
            We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy policy, unless a longer retention period is required or permitted by law.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">6. Contact Us</h2>
          <p>
            If you have questions or comments about this policy, you may email us at support@vyllo.com.
          </p>
        </section>
      </div>
    </div>
  )
}
