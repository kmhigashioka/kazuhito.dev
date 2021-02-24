import Tag from '../components/Tag'

export default function About() {
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
        <p className="text-xl font-bold text-gray-900 text-center mb-3">Work History</p>

        {renderHistoryItem({
          title: 'Infor PSSC, Inc.',
          subTitle: 'January 2021 - September 2019',
          description: (
            <>
              Joined as <i>Software Engineer, Senior</i> and worked on a Fashion industry solutions.
              Had 1+ years of experience on <Tag>React</Tag>, <Tag>C#</Tag>, <Tag>.Net Core</Tag>, and <Tag>SQL Server</Tag>.
            </>
          ),
        })}

        {renderHistoryItem({
          title: "Samsung R&D Institute Philippines",
          subTitle: "September 2019 - November 2018",
          description: (
            <>
              Joined as <i>Engineer</i>, mainly as React Engineer, and worked on a data analytics tool.
              Had ~1 year of experience on <Tag>React</Tag>.
            </>
          ),
        })}

        {renderHistoryItem({
          title: "BizBox, Inc.",
          subTitle: "August 2014 - August 2018",
          description: (
            <>
              Began working as <i>Software Developer</i> in the healthcare industry.
              Had 3 years of experience on the following: <Tag>angular.js</Tag>, <Tag>C#</Tag>, <Tag>.Net Framework 4.5</Tag>, <Tag>SQL Server</Tag>, and
              1 year of experience on <Tag>React</Tag>, <Tag>Meteor / Node</Tag>, and <Tag>MongoDB</Tag>.
            </>
          ),
          isLast: true,
        })}
      </div>
      <div className="m-10 flex justify-center">
        <a href="https://github.com/kmhigashioka">
          <svg className="h-8 w-8 text-gray-900 fill-current" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub icon</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path></svg>
        </a>
        <a href="https://linkedin.com/in/kmhigashioka/" className="mx-3">
          <svg className="h-8 w-8 text-gray-900 fill-current" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>LinkedIn icon</title><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path></svg>
        </a>
        <a href="https://stackoverflow.com/users/2370190/kmhigashioka">
          <svg className="h-8 w-8 text-gray-900 fill-current" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Stack Overflow icon</title><path d="M18.986 21.865v-6.404h2.134V24H1.844v-8.539h2.13v6.404h15.012zM6.111 19.731H16.85v-2.137H6.111v2.137zm.259-4.852l10.48 2.189.451-2.07-10.478-2.187-.453 2.068zm1.359-5.056l9.705 4.53.903-1.95-9.706-4.53-.902 1.936v.014zm2.715-4.785l8.217 6.855 1.359-1.62-8.216-6.853-1.35 1.617-.01.001zM15.751 0l-1.746 1.294 6.405 8.604 1.746-1.294L15.749 0h.002z"></path></svg>
        </a>
      </div>
    </>
  )
}

interface HistoryItemProps {
  title: string
  subTitle: string
  description: any
  isLast?: boolean
}

function renderHistoryItem({ title, subTitle, description, isLast }: HistoryItemProps) {
  return (
    <div className="flex mb-5 md:even:flex-row-reverse">
      <div className="hidden md:block md:w-6/12" />
      <div className="flex flex-col items-center pt-1.5 relative mr-5 md:mx-2.5">
        <div className="inline-block rounded-full h-3 w-3 border-2 border-gray-300" />
        {isLast ? null : <div className="inline-block h-timeline w-0.5 bg-gray-300 mt-2.5 absolute" /> }
      </div>
      <div className="md:w-6/12">
        <p className="text-gray-900 font-semibold">{title}</p>
        <p className="text-gray-500 text-sm">{subTitle}</p>
        <p className="text-gray-900 text-sm mt-2">{description}</p>
      </div>
    </div>
  )
}
