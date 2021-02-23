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
