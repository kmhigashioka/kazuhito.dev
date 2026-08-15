export interface Project {
  title: string;
  blurb: string;
  tech: string[];
  link?: string;
  /** Optional screenshot. Cards fall back to a decorative gradient when absent. */
  image?: string;
}

export interface Employer {
  name: string;
  role: string;
  period: string;
  projects: Project[];
}

export interface Hobby {
  name: string;
  blurb: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface Profile {
  name: string;
  shortName: string;
  tagline: string;
  about: string[];
  hobbies: Hobby[];
  links: SocialLink[];
  email: string;
}
