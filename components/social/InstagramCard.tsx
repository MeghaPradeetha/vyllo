import { Heart, MessageCircle, Instagram } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface InstagramCardProps {
  caption: string
  image: string
  likes: string
  comments: string
  className?: string
}

export function InstagramCard({ caption, image, likes, comments, className }: InstagramCardProps) {
  return (
    <Card className={cn("group relative overflow-hidden border-0 bg-zinc-900/50", className)}>
      {/* Image Container - Square or 4:5 */}
      <div className="relative aspect-square w-full overflow-hidden">
        <img
          src={image}
          alt={caption}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex items-center gap-6 text-white">
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 fill-current" />
              <span className="font-semibold">{likes}</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-6 w-6 fill-current" />
              <span className="font-semibold">{comments}</span>
            </div>
          </div>
        </div>

        <div className="absolute top-3 right-3 text-white drop-shadow-lg">
            <Instagram className="h-5 w-5" />
        </div>
      </div>
    </Card>
  )
}
