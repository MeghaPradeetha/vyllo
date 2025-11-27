import { Play, ThumbsUp } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface YouTubeCardProps {
  title: string
  thumbnail: string
  views: string
  likes: string
  className?: string
}

export function YouTubeCard({ title, thumbnail, views, likes, className }: YouTubeCardProps) {
  return (
    <Card className={cn("group relative overflow-hidden border-0 bg-zinc-900/50", className)}>
      {/* Thumbnail Container - 16:9 Aspect Ratio */}
      <div className="relative aspect-video w-full overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/10" />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-lg">
            <Play className="ml-1 h-5 w-5 fill-current" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="line-clamp-2 text-sm font-medium text-zinc-100 group-hover:text-accent transition-colors">
          {title}
        </h3>
        <div className="mt-3 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-1">
            <Play className="h-3 w-3" />
            <span>{views}</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-3 w-3" />
            <span>{likes}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
