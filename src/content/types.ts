import type { ImageMetadata } from 'astro';

export interface Project {
  title: string;
  blurb: string;
  tech: string[];
  link?: string;
  /** Product screenshot. Absent renders no image area at all. Deliberately
   *  not a placeholder, which is what this replaced. */
  image?: ImageMetadata;
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
