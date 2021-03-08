export default function Tag({ className = '', children }: { className?: string, children: any }) {
  return (
    <span
      className={`text-sm bg-green-100 px-1 rounded text-green-500 align-middle whitespace-nowrap ${className}`}
    >
      {children}
    </span>
  )
}

export const tech = {
  ANGULAR_JS: 'AngularJS',
  BOOTSTRAP: 'Bootstrap',
  C_SHARP: 'C#',
  DEPENDABOT: 'Dependabot',
  DOCKER: 'Docker',
  DOTNET_5: '.Net 5',
  DOTNET_CORE: '.Net Core',
  DOTNET_FRAMEWORK: '.Net Framework',
  EF_CORE: 'Entity Framework Core',
  ELASTICSEARCH: 'Elasticsearch',
  GITHUB_ACTIONS: 'GitHub Actions',
  LESS_CSS: 'Less CSS',
  METEOR: 'Meteor',
  MONGODB: 'MongoDB',
  NEXT_JS: 'Next.js',
  NODE: 'Node',
  POSTGRESQL: 'PostgreSQL',
  REACT: 'React',
  SASS: 'Sass',
  SQL_SERVER: 'SQL Server',
  TAILWIND: 'Tailwind CSS',
  TYPESCRIPT: 'TypeScript',
}
