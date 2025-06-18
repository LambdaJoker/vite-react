export interface Skill {
  id: number;
  name: string;
  level: number;
  categories: string[];
  description: string;
  icon: string;
  projects?: string[];
  lastUsed?: Date;
  yearsOfExperience?: number;
} 