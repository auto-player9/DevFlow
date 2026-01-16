import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { techMap } from "@/constants/techMap";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getDeviconClassName(techName: string) {
  const normalizedTech = techName.replace(/[ .]/g, "").toLowerCase();

  // Dictionary mapping possible technology names to Devicon class names


  return `${techMap[normalizedTech] || "devicon-devicon-plain"} colored`;
}


export const getTimeStamp = (createdAt: Date | string): string => {
  // التأكد من أن الإدخال هو كائن Date
  const date = new Date(createdAt);
  const now = new Date();

  // الفرق بالمللي ثانية
  const diffMilliseconds = now.getTime() - date.getTime();

  // ثواني (Total seconds difference)
  const diffSeconds = Math.floor(diffMilliseconds / 1000);

  // --- 1. أقل من دقيقة ---
  if (diffSeconds < 60) {
    return diffSeconds <= 1 ? "just now" : `${diffSeconds} seconds ago`;
  }

  // --- 2. دقائق ---
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return `${diffMinutes} mins ago`;
  }

  // --- 3. ساعات ---
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hours ago`;
  }

  // --- 4. أيام ---
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) {
    return `${diffDays} days ago`;
  }

  // --- 5. أشهر (افتراض 30 يوماً للشهر لتبسيط المنطق) ---
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) {
    return `${diffMonths} months ago`;
  }

  // --- 6. سنوات ---
  const diffYears = Math.floor(diffMonths / 12);
  return `${diffYears} years ago`;
};


export function getTechDescription(techName: string): string {
  const normalizedTech = techName.replace(/[ .]/g, "").toLowerCase();

  // Mapping technology names to descriptions
  const techDescriptionMap: { [key: string]: string } = {
    javascript:
      "JavaScript is a powerful language for building dynamic, interactive, and modern web applications.",
    typescript:
      "TypeScript adds strong typing to JavaScript, making it great for scalable and maintainable applications.",
    react:
      "React is a popular library for building fast, component-based user interfaces and web applications.",
    nextjs:
      "Next.js is a React framework for building fast, SEO-friendly, and production-grade web applications.",
    nodejs:
      "Node.js is a runtime for building fast and scalable server-side applications using JavaScript.",
    python:
      "Python is a beginner-friendly language known for its versatility and simplicity in various fields.",
    java: "Java is a versatile, cross-platform language widely used in enterprise and Android development.",
    "c++":
      "C++ is a high-performance language ideal for system programming, games, and large-scale applications.",
    git: "Git is a version control system that helps developers track changes and collaborate on code efficiently.",
    docker:
      "Docker simplifies app deployment by containerizing environments, ensuring consistency across platforms.",
    mongodb:
      "MongoDB is a flexible NoSQL database ideal for handling unstructured data and scalable applications.",
    mysql:
      "MySQL is a popular open-source relational database management system known for its stability and performance.",
    postgresql:
      "PostgreSQL is a powerful open-source SQL database known for its scalability and robustness.",
    aws: "Amazon Web Services (AWS) is a cloud computing platform that offers a wide range of services for building, deploying, and managing web and mobile applications.",
  };

  return techDescriptionMap[normalizedTech] || "A powerful technology for modern development.";
}


export const formatNumber = (number: number): string => {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M'
  }else if (number >= 1000) {
    return (number / 1000).toFixed(1) +'K'
  }else {
    return number.toString()
  }
}