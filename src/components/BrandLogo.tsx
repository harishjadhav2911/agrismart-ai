import Image from "next/image";
import Link from "next/link";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  linkHref?: string;
}

export default function BrandLogo({ className = "", size = "md", linkHref = "/" }: BrandLogoProps) {
  const heightClasses = {
    sm: "h-10 sm:h-12",
    md: "h-14 sm:h-16 md:h-18",
    lg: "h-24 sm:h-28 md:h-32 lg:h-36",
    xl: "h-32 sm:h-36 md:h-44"
  };

  const logoImg = (
    <div className="flex items-center justify-center">
      <Image
        src="/logo.png"
        alt="AgriSmart AI - Smart Farming, Better Tomorrow"
        width={1376}
        height={768}
        priority
        className={`${heightClasses[size]} w-auto object-contain transition-transform duration-200 hover:scale-[1.02] ${className}`}
      />
    </div>
  );

  if (linkHref) {
    return (
      <Link href={linkHref} className="flex-shrink-0 flex items-center group focus:outline-none">
        {logoImg}
      </Link>
    );
  }

  return logoImg;
}
