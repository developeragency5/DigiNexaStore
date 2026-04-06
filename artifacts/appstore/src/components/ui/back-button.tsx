import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

interface BackButtonProps {
  fallback?: string;
  label?: string;
}

export function BackButton({ fallback = "/", label = "Back" }: BackButtonProps) {
  const [, navigate] = useLocation();

  function handleBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate(fallback);
    }
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      className="
        group
        inline-flex items-center gap-1.5
        px-3.5 py-2
        bg-white
        text-gray-600
        text-sm font-semibold
        rounded-xl
        border border-gray-200
        shadow-sm
        hover:bg-gray-50
        hover:text-gray-900
        hover:shadow-md
        hover:border-gray-300
        active:scale-[0.97]
        transition-all duration-150
        select-none
      "
    >
      <ArrowLeft className="h-4 w-4 transition-transform duration-150 group-hover:-translate-x-0.5" />
      {label}
    </button>
  );
}
