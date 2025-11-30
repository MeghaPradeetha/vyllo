export default function PortfolioNotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-white mb-4">404</h1>
        <h2 className="text-3xl font-bold text-white mb-4">Portfolio Not Found</h2>
        <p className="text-gray-400 text-lg mb-8">
          This portfolio doesn't exist or has been removed.
        </p>
        <a
          href="/"
          className="inline-block px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          Go Home
        </a>
      </div>
    </div>
  )
}
