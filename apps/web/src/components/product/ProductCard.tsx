import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  author: string;
  authorAvatar?: string;
  coverUrl?: string; // Placeholder for now
  category?: string;
}

export default function ProductCard({ id, title, price, author, authorAvatar, coverUrl, category }: ProductCardProps) {
  return (
    <Link href={`/products/${id}`} className="group">
      <Card className="overflow-hidden border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-blue-500/50 transition-all duration-300">
        {/* Cover Image Placeholder */}
        <div className="aspect-[4/3] bg-gradient-to-br from-slate-800 to-slate-700 relative flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-500">
          {coverUrl ? (
            <img src={coverUrl} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="text-slate-500 font-mono text-sm">NO PREVIEW</div>
          )}
          {category && (
            <Badge className="absolute top-2 right-2 bg-blue-600/80 backdrop-blur-sm hover:bg-blue-600">
              {category}
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg text-slate-100 line-clamp-1 mb-1 group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-2 mt-3">
            <Avatar className="h-5 w-5">
              <AvatarImage src={authorAvatar} />
              <AvatarFallback>{author[0]}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-slate-400">{author}</span>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex justify-between items-center border-t border-slate-800/50 mt-auto">
          <div className="text-slate-400 text-xs">12 Sales</div>
          <div className="text-lg font-bold text-blue-400">${price}</div>
        </CardFooter>
      </Card>
    </Link>
  );
}
