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
        <p className="text-xl font-bold text-gray-900 mb-3">Work History</p>

        {renderHistoryItem({
          title: 'Infor PSSC, Inc.',
          subTitle: 'January 2021 - September 2019',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        })}

        {renderHistoryItem({
          title: "Samsung R&D Institute Philippines",
          subTitle: "September 2019 - November 2018",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        })}

        {renderHistoryItem({
          title: "BizBox, Inc.",
          subTitle: "August 2014 - August 2018",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        })}

        {renderHistoryItem({
          title: "De La Salle Lipa",
          subTitle: "June 2014 - June 2018",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        })}
      </div>
    </>
  )
}

interface HistoryItemProps {
  title: string
  subTitle: string
  description: string
}

function renderHistoryItem({ title, subTitle, description }: HistoryItemProps) {
  return (
    <div className="flex mb-5">
      <div className="flex flex-col items-center pt-1.5 relative">
        <div className="inline-block rounded-full h-3 w-3 border-2 border-gray-300" />
        <div className="inline-block h-timeline w-0.5 bg-gray-300 mt-2.5 absolute" />
      </div>
      <div className="ml-5">
        <p className="text-gray-900 font-semibold">{title}</p>
        <p className="text-gray-500 text-sm">{subTitle}</p>
        <p className="text-gray-900 text-sm mt-2">{description}</p>
      </div>
    </div>
  )
}
