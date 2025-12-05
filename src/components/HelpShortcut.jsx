import Link from "next/link";
import { HelpCircle } from "lucide-react";

export default function HelpShortcut({ className = "", showLabel = false }) {
  return (
    <Link
      href="/help"
      className={`flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors ${className}`}
      aria-label="Help Center"
    >
      <HelpCircle size={20} />
      {showLabel && <span className="text-sm font-medium">Help</span>}
    </Link>
  );
}
