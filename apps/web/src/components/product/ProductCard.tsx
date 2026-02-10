import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  author: string;
  authorAvatar?: string;
  coverUrl?: string;
  category?: string;
}

/* 4-point sparkle SVG used as decorative element */
function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2L13.09 8.26L18 6L14.74 10.91L21 12L14.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L9.26 13.09L3 12L9.26 10.91L6 6L10.91 8.26L12 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* Generate a consistent color from the author name */
function getAvatarColor(name: string): string {
  const colors = [
    'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-emerald-500',
    'bg-teal-500', 'bg-cyan-500', 'bg-blue-500', 'bg-indigo-500',
    'bg-violet-500', 'bg-pink-500', 'bg-rose-500', 'bg-fuchsia-500',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function ProductCard({ id, title, price, author, authorAvatar, coverUrl, category }: ProductCardProps) {
  const initials = author
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Link href={`/products/${id}`} className="group">
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
        {/* Cover / Preview Area */}
        <div className="aspect-[4/3] bg-gradient-to-br from-purple-50 via-indigo-50 to-violet-100 relative flex items-center justify-center overflow-hidden">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <SparkleIcon className="w-8 h-8 text-purple-300/60" />
          )}
          {category && (
            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-purple-600 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
              {category}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4 pt-4 pb-4">
          <h3 className="font-bold text-gray-900 text-base line-clamp-1 mb-3 group-hover:text-purple-600 transition-colors">
            {title}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {authorAvatar ? (
                <Image src={authorAvatar} alt={author} width={28} height={28} className="rounded-full" />
              ) : (
                <div className={`w-7 h-7 ${getAvatarColor(author)} rounded-full flex items-center justify-center`}>
                  <span className="text-white text-[10px] font-bold leading-none">{initials}</span>
                </div>
              )}
              <span className="text-sm text-gray-500">{author}</span>
            </div>
            <span className="text-lg font-extrabold text-gray-900">${price}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
