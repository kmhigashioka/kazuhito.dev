import { describe, expect, it } from 'vitest';
import { employers } from './projects';
import { profile } from './profile';

describe('projects', () => {
  it('has four employers', () => {
    expect(employers).toHaveLength(4);
  });

  it('has ten projects in total', () => {
    const count = employers.reduce((n, e) => n + e.projects.length, 0);
    expect(count).toBe(10);
  });

  it('gives every project a title, blurb and at least one tech tag', () => {
    for (const employer of employers) {
      for (const project of employer.projects) {
        expect(project.title.length).toBeGreaterThan(0);
        expect(project.blurb.length).toBeGreaterThan(0);
        expect(project.tech.length).toBeGreaterThan(0);
      }
    }
  });

  it('lists EngageRocket first', () => {
    expect(employers[0].name).toBe('EngageRocket');
  });

  it('uses absolute URLs for any project link', () => {
    for (const employer of employers) {
      for (const project of employer.projects) {
        if (project.link) expect(project.link).toMatch(/^https:\/\//);
      }
    }
  });
});

describe('profile', () => {
  it('has three hobbies', () => {
    expect(profile.hobbies).toHaveLength(3);
  });

  it('exposes github, dev.to and email links', () => {
    const labels = profile.links.map((l) => l.label);
    expect(labels).toEqual(expect.arrayContaining(['GitHub', 'dev.to', 'Email']));
  });

  it('uses a mailto: href for email', () => {
    const email = profile.links.find((l) => l.label === 'Email');
    expect(email?.href).toBe('mailto:kmhigashioka@gmail.com');
  });

  it('has at least two paragraphs of about copy', () => {
    expect(profile.about.length).toBeGreaterThanOrEqual(2);
  });
});
