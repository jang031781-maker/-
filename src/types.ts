export interface Project {
  id: number;
  title: string;
  category: string;
  type: 'main' | 'supporting';
  description: string;
  problem: string;
  strategy: string;
  result: string;
  insight: string;
  images: string[]; // Changed from imageUrl: string
  order_index: number;
}

export interface SiteSettings {
  profileImageUrl: string;
  bio: string;
  resumeData: string; // JSON string for education, experience, etc.
}

export type Section = 'home' | 'profile' | 'projects' | 'archive' | 'contact' | 'admin';
