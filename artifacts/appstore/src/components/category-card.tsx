import { Category } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Gamepad2, Music, Camera, Briefcase, 
  GraduationCap, HeartPulse, ShoppingBag, 
  Compass, MessageCircle, Map, Zap, Layers 
} from "lucide-react";

interface CategoryCardProps {
  category: Category;
}

const iconMap: Record<string, React.ElementType> = {
  "gamepad": Gamepad2,
  "music": Music,
  "camera": Camera,
  "briefcase": Briefcase,
  "graduation-cap": GraduationCap,
  "heart-pulse": HeartPulse,
  "shopping-bag": ShoppingBag,
  "compass": Compass,
  "message-circle": MessageCircle,
  "map": Map,
  "zap": Zap
};

export function CategoryCard({ category }: CategoryCardProps) {
  const Icon = iconMap[category.iconName] || Layers;

  return (
    <Link href={`/categories/${category.slug}`} className="block group">
      <Card className="overflow-hidden border-border/50 hover:shadow-md transition-all duration-300">
        <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-4 relative overflow-hidden">
          <div 
            className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500"
            style={{ backgroundColor: category.color }}
          />
          <div 
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 relative z-10"
            style={{ backgroundColor: `${category.color}15`, color: category.color }}
          >
            <Icon className="h-7 w-7" />
          </div>
          <div className="relative z-10">
            <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
              {category.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {category.appCount.toLocaleString()} apps
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
