import { Heart, MessageCircle, Play } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface TikTokCardProps {
  description: string
  thumbnail: string
  views: string
  likes: string
  className?: string
}

export function TikTokCard({ description, thumbnail, views, likes, className }: TikTokCardProps) {
  return (
    <Card className={cn("group relative overflow-hidden border-0 bg-zinc-900/50", className)}>
      {/* Content Container - 9:16 Aspect Ratio */}
      <div className="relative aspect-[9/16] w-full overflow-hidden">
        <img
          src={thumbnail}
          alt={description}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
        
        {/* TikTok Icon Overlay */}
        <div className="absolute top-3 right-3">
            {/* Simple TikTok-like icon representation or use a custom SVG if needed. Using Play for now as placeholder or Lucide doesn't have TikTok */}
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm">
                <Play className="h-3 w-3 fill-current" />
            </div>
        </div>

        {/* Stats Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="mb-3 line-clamp-2 text-sm font-medium text-white">
            {description}
          </p>
          <div className="flex items-center justify-between text-xs text-white/90">
            <div className="flex items-center gap-1">
              <Play className="h-3 w-3" />
              <span>{views}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              <span>{likes}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
