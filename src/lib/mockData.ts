export interface Project {
  id: string;
  title: string;
  titleEn: string;
  tag: string;
  tagEn: string;
  description?: string;
  descriptionEn?: string;
  coverImage: string;
  images: string[];
  videos?: string[];
  spanCols?: number;
  spanRows?: number;
  icon?: string;
}

export const initialProjects: Project[] = [
  {
    id: "1",
    title: "إعلان سيارة رياضية (كوستاريكا)",
    titleEn: "Sports Car Ad (Costa Rica)",
    tag: "فيديو",
    tagEn: "Video",
    coverImage: "https://images.unsplash.com/photo-1546768292-fb12f6c92568?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    images: [
      "https://images.unsplash.com/photo-1546768292-fb12f6c92568?w=800",
      "https://images.unsplash.com/photo-1503376763036-066120622c74?w=800",
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800",
    ],
    spanCols: 2,
  },
  {
    id: "2",
    title: "هوية بصرية \"ناس\"",
    titleEn: "Visual Identity \"Nas\"",
    tag: "جرافيكس",
    tagEn: "Graphics",
    icon: "👁️",
    coverImage: "",
    images: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800",
    ],
  },
  {
    id: "3",
    title: "أضواء المدينة",
    titleEn: "City Lights",
    tag: "فوتوغراف",
    tagEn: "Photography",
    coverImage: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800",
      "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800",
    ],
  },
  {
    id: "4",
    title: "انعكاسات معمارية",
    titleEn: "Architectural Reflections",
    tag: "معماري",
    tagEn: "Architecture",
    coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
    ],
  },
  {
    id: "5",
    title: "وجوه المدينة",
    titleEn: "City Faces",
    tag: "بورتريه",
    tagEn: "Portrait",
    coverImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800",
    ],
    spanRows: 2,
  },
  {
    id: "6",
    title: "قمم الجبال",
    titleEn: "Mountain Peaks",
    tag: "طبيعة",
    tagEn: "Nature",
    coverImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    images: [
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",
    ],
    spanCols: 2,
  },
];

// Mock data store
let projectsStore = [...initialProjects];

export const getProjects = async (): Promise<Project[]> => {
  return projectsStore;
};

export const getProject = async (id: string): Promise<Project | undefined> => {
  return projectsStore.find((p) => p.id === id);
};

export const createProject = async (project: Omit<Project, "id">): Promise<Project> => {
  const newProject = {
    ...project,
    id: Date.now().toString(),
  };
  projectsStore.push(newProject);
  return newProject;
};

export const updateProject = async (id: string, updates: Partial<Project>): Promise<Project | null> => {
  const index = projectsStore.findIndex((p) => p.id === id);
  if (index === -1) return null;
  projectsStore[index] = { ...projectsStore[index], ...updates };
  return projectsStore[index];
};

export const deleteProject = async (id: string): Promise<boolean> => {
  const index = projectsStore.findIndex((p) => p.id === id);
  if (index === -1) return false;
  projectsStore.splice(index, 1);
  return true;
};

// Hero content
export interface HeroContent {
  badge: string;
  badgeEn: string;
  title: string;
  titleEn: string;
  titleBreak: string;
  titleBreakEn: string;
  description: string;
  descriptionEn: string;
  ctaPrimary: string;
  ctaPrimaryEn: string;
  ctaSecondary: string;
  ctaSecondaryEn: string;
}

let heroContent: HeroContent = {
  badge: "مرحباً أنا عبدالملك مروان 👋 مصور ومصمم",
  badgeEn: "Hello I'm Abdulmalik Marwan 👋 Photographer & Designer",
  title: "نروي القصص",
  titleEn: "We Tell Stories",
  titleBreak: "من خلال العدسة",
  titleBreakEn: "Through the Lens",
  description: "متخصص في التقاط اللحظات العابرة وتحويلها إلى ذكريات خالدة. أدمج بين الفن والتكنولوجيا لخلق تجارب بصرية فريدة.",
  descriptionEn: "Specialized in capturing fleeting moments and turning them into timeless memories. I blend art and technology to create unique visual experiences.",
  ctaPrimary: "استكشف أعمالي ↙",
  ctaPrimaryEn: "Explore My Work ↙",
  ctaSecondary: "تواصل معي",
  ctaSecondaryEn: "Contact Me",
};

export const getHeroContent = async (): Promise<HeroContent> => heroContent;
export const updateHeroContent = async (updates: Partial<HeroContent>): Promise<HeroContent> => {
  heroContent = { ...heroContent, ...updates };
  return heroContent;
};

// Footer content
export interface FooterContent {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  cta: string;
  ctaEn: string;
}

let footerContent: FooterContent = {
  title: "هل لديك مشروع في ذهنك؟",
  titleEn: "Have a project in mind?",
  description: "دعنا نعمل معاً لتحويل أفكارك إلى واقع مرئي مذهل.",
  descriptionEn: "Let's work together to turn your ideas into stunning visual reality.",
  cta: "لنبدا الحديث",
  ctaEn: "Let's Talk",
};

export const getFooterContent = async (): Promise<FooterContent> => footerContent;
export const updateFooterContent = async (updates: Partial<FooterContent>): Promise<FooterContent> => {
  footerContent = { ...footerContent, ...updates };
  return footerContent;
};
