import Tag, { tech } from '../../components/Tag'

const projects = [
  {
    title: 'kazuhito.io',
    subTitle: 'Personal website.',
    technologies: [tech.REACT, tech.NEXT_JS, tech.TAILWIND],
    src: '/project-kazuhito.io.png',
  },
  {
    title: 'Infor PLM for Fashion',
    subTitle: 'A product lifecycle management collaboration tool for fashion companies.',
    technologies: [tech.REACT, tech.BOOTSTRAP, tech.SASS, tech.C_SHARP, tech.DOTNET_CORE, tech.SQL_SERVER, tech.ELASTICSEARCH],
    src: '/project-infor_fplm.jpg',
  },
  {
    title: 'yap (Yet Another Purse)',
    subTitle: 'Personalized budget tracking app.',
    technologies: [tech.REACT, tech.TYPESCRIPT, tech.C_SHARP, tech.DOTNET_CORE, tech.EF_CORE, tech.POSTGRESQL, tech.DOCKER, tech.GITHUB_ACTIONS, tech.DEPENDABOT],
    src: '/project-yap.png',
  },
  {
    title: 'react-jump-start',
    subTitle: 'A redux-less React boilerplate inspired by @kentcdodds, @mxstbr and @ryanflorence.',
    technologies: [tech.REACT, tech.TYPESCRIPT],
    src: '/project-rjs.PNG',
  },
  {
    title: 'ticktock',
    subTitle: 'A very simple time-tracking app.',
    technologies: [tech.REACT],
    src: '/project-ticktock.png',
  },
  {
    title: 'netcore-jump-start',
    subTitle: 'API boilerplate, Clean architecture implementation on a .Net Core API.',
    technologies: [tech.C_SHARP, tech.DOTNET_5, tech.EF_CORE],
    src: '/project-njs.PNG',
  },
  {
    title: 'Beacon / PhilHealth E-Claims Portal',
    subTitle: 'Digitalize processing of PhilHealth claims.',
    technologies: [tech.REACT, tech.C_SHARP, tech.DOTNET_FRAMEWORK, tech.SQL_SERVER],
    src: '/project-beacon.webp',
  },
  {
    title: 'QMEUP',
    subTitle: 'Queueing app for clinics and hospitals.',
    technologies: [tech.REACT, tech.METEOR, tech.NODE, tech.MONGODB],
    src: '/project-qmeup.webp',
  },
  {
    title: 'EHR (Electronic Health Record)',
    subTitle: 'A web-based application collecting patient health information.',
    isLast: true,
    technologies: [tech.ANGULAR_JS, tech.BOOTSTRAP, tech.LESS_CSS, tech.C_SHARP, tech.DOTNET_FRAMEWORK, tech.SQL_SERVER],
    src: '/project-ehr.webp',
  },
]

export default function Projects() {
  return (
    <>
      <div className="m-10">
        <p className="text-3xl font-bold text-gray-900 mb-3">
          Hi! 👋 I'm Kazu, a Full Stack Engineer.
        </p>
        <p className="text-lg text-gray-600">
          I love developing web application using React ⚛️ and .Net Core 💻 stack.
        </p>
      </div>
      <div className="m-10">
        <p className="text-xl text-gray-900 text-center mb-5">Projects</p>

        {projects.map(project => renderProjectItem(project))}
      </div>
    </>
  )
}

interface ProjectItemProps {
  title: any
  subTitle: string
  src: string
  technologies: string[]
  isLast?: boolean
}

function renderProjectItem({ title, subTitle, src, technologies, isLast }: ProjectItemProps) {
  return (
    <div className="flex mb-10" key={title}>
      <div className="flex flex-col items-center pt-1.5 relative mr-5">
        <div className="inline-block rounded-full h-3 w-3 border-2 border-gray-300" />
        {isLast ? null : <div className="inline-block h-timeline w-0.5 bg-gray-300 mt-2.5 absolute" /> }
      </div>
      <div className="flex flex-col md:flex-row-reverse">
        <div className="w-100 mb-5 md:w-1/2">
          <img src={src} />
        </div>
        <div className="w-100 md:w-1/2">
          <p className="text-gray-900 font-semibold">{title}</p>
          <p className="text-gray-500 text-sm">{subTitle}</p>
          <p className="mt-5 text-gray-600">TECHNOLOGIES</p>
            <div className="flex flex-wrap">
              {technologies.map(tech => <Tag className="mr-1 mb-1" key={tech}>{tech}</Tag>)}
            </div>
        </div>
      </div>
    </div>
  )
}
