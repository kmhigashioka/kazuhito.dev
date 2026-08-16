import type { Employer } from './types';

export const employers: Employer[] = [
  {
    name: 'EngageRocket',
    role: 'Senior Software Developer',
    period: '2021 — now',
    projects: [
      {
        title: 'PerformAI',
        blurb: 'AI-assisted performance management — turning review cycles into something managers actually finish.',
        tech: ['React', 'TypeScript'],
        link: 'https://www.engagerocket.co/performai-performance-management',
      },
      {
        title: 'Nebula',
        blurb: "The design language system every EngageRocket app is built from. Components, documentation, Storybook.",
        tech: ['React', 'TypeScript', 'Storybook'],
      },
      {
        title: 'Frontend Development',
        blurb: 'Application and feature work across the analytics platform that helps leaders make people decisions from real-time data.',
        tech: ['React', 'TypeScript'],
      },
      {
        title: 'Rocket Surgeon',
        blurb: 'Resolving customer issues in production — the rotation where you find out what your abstractions really cost.',
        tech: ['React', 'Jira'],
      },
    ],
  },
  {
    name: 'Infor PSSC',
    role: 'Software Engineer, Senior',
    period: '2020 — 2021',
    projects: [
      {
        title: 'FPLM',
        blurb: 'Fashion product lifecycle management — frontend and backend work on tooling for the fashion supply chain.',
        tech: ['React', 'C#', '.NET Core', 'SQL Server'],
      },
    ],
  },
  {
    name: 'Samsung R&D Institute Philippines',
    role: 'Engineer',
    period: '2019 — 2020',
    projects: [
      {
        title: 'Cognitiv Analytics UI Components',
        blurb: 'The shared component library behind the Cognitiv Analytics application.',
        tech: ['React'],
      },
      {
        title: 'Frontend Development',
        blurb: 'Application and feature development on a data analytics tool.',
        tech: ['React'],
      },
    ],
  },
  {
    name: 'BizBox',
    role: 'Full Stack Developer / Team Lead',
    period: '2015 — 2019',
    projects: [
      {
        title: 'Beacon / PhilHealth E-Claims',
        blurb: 'A claims portal used by Philippine hospitals to file with PhilHealth — the kind of software where a bug is somebody’s hospital bill.',
        tech: ['AngularJS', 'C#', '.NET', 'SQL Server'],
      },
      {
        title: 'QMeUp',
        blurb: 'Queue management for clinics and hospitals.',
        tech: ['React', 'Meteor', 'Node', 'MongoDB'],
      },
      {
        title: 'EHR',
        blurb: 'Electronic health records — patient data, built to be read quickly by people who are in a hurry.',
        tech: ['AngularJS', 'C#', '.NET', 'SQL Server'],
      },
    ],
  },
];
