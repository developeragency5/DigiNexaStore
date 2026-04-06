import { Category } from "@workspace/api-client-react";
import { Link } from "wouter";
import {
  Gamepad2, Music, Camera, Briefcase,
  GraduationCap, HeartPulse, ShoppingBag,
  Compass, MessageCircle, Map, Zap, Layers,
  DollarSign, Utensils, BookOpen, Play, Heart,
  Users, UtensilsCrossed, Trophy, Car, Star,
  Swords, Puzzle
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  "Briefcase": Briefcase,
  "briefcase": Briefcase,
  "BookOpen": BookOpen,
  "book-open": BookOpen,
  "DollarSign": DollarSign,
  "dollar-sign": DollarSign,
  "UtensilsCrossed": UtensilsCrossed,
  "utensils": Utensils,
  "Heart": Heart,
  "heart-pulse": HeartPulse,
  "Music": Music,
  "music": Music,
  "Camera": Camera,
  "camera": Camera,
  "Users": Users,
  "message-circle": MessageCircle,
  "Map": Map,
  "map": Map,
  "Play": Play,
  "compass": Compass,
  "Gamepad2": Gamepad2,
  "gamepad": Gamepad2,
  "joystick": Gamepad2,
  "Star": Star,
  "star": Star,
  "Puzzle": Puzzle,
  "puzzle": Puzzle,
  "Swords": Swords,
  "sword": Swords,
  "chess": Swords,
  "Car": Car,
  "car": Car,
  "Trophy": Trophy,
  "trophy": Trophy,
  "graduation-cap": GraduationCap,
  "shopping-bag": ShoppingBag,
  "zap": Zap,
};

export function CategoryCard({ category }: { category: Category }) {
  const Icon = iconMap[category.iconName] || Layers;

  return (
    <Link href={`/categories/${category.slug}`} className="block group">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-5 flex flex-col items-center justify-between text-center h-[136px]">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shrink-0"
          style={{ backgroundColor: `${category.color}18`, color: category.color }}
        >
          <Icon className="h-7 w-7" />
        </div>
        <div className="flex flex-col items-center">
          <h3 className="font-semibold text-sm text-gray-900 group-hover:text-primary transition-colors leading-tight line-clamp-2">{category.name}</h3>
        </div>
      </div>
    </Link>
  );
}
