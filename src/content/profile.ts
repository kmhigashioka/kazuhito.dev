import type { Profile } from './types';

export const profile: Profile = {
  name: 'Kazuhito Higashioka',
  shortName: 'Kazu',
  tagline:
    'Senior software developer at EngageRocket, eleven years in, based in the Philippines. I care about the details nobody asked for.',
  about: [
    "I'm Kazu — a software developer from the Philippines. I've been doing this for eleven years, across healthcare claims portals, fashion supply chains, and now people analytics at EngageRocket.",
    'Mostly I build frontends, and mostly I care about the boring parts — the design system nobody notices, the test setup that stops a bug reaching someone’s Monday morning.',
  ],
  hobbies: [
    { name: 'Bouldering', blurb: 'Problems you solve with your whole body.' },
    { name: 'Running', blurb: 'Where most of my debugging actually happens.' },
    { name: 'Strength training', blurb: 'Slow, measurable progress. Very much my thing.' },
  ],
  email: 'kmhigashioka@gmail.com',
  links: [
    { label: 'GitHub', href: 'https://github.com/kmhigashioka' },
    { label: 'dev.to', href: 'https://dev.to/kmhigashioka' },
    { label: 'Email', href: 'mailto:kmhigashioka@gmail.com' },
  ],
};
