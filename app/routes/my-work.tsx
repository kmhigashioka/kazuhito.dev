import type { MetaFunction } from "remix";
import Card from "~/components/Card";
import beaconSrc from "../assets/my-work_beacon.svg";
import chartsSrc from "../assets/my-work_charts.svg";
import csSrc from "../assets/my-work_cs.svg";
import ehrSrc from "../assets/my-work_ehr.svg";
import fplmSrc from "../assets/my-work_fplm.svg";
import nebulaSrc from "../assets/my-work_nebula.svg";
import qmuSrc from "../assets/my-work_qmu.svg";

export let meta: MetaFunction = () => {
  return {
    title: "Hi! 👋 I'm Kazu. My work",
    description: "Building software for humans."
  };
};

export default function MyWork() {
  return (
    <main className="flex flex-col items-center">
      <div className="flex flex-col max-w-5xl w-full">
        <h1 className="text-gray-900 font-bold text-2xl mt-8 mx-10 mb-2 sm:mt-16 sm:text-3xl">my work</h1>
        <p className="mx-10 mb-10">
          Currently a Senior Software Developer with over 7 years of experience in software development.
        </p>
      </div>

      <Article
        title="EngageRocket Pte Ltd"
        subTitle="Senior Software Developer"
        description="Currently working on analytics solution provider that helps leaders and organizations make better people decisions using real-time data."
      >
        <Work
          title="Nebula - EngageRocket’s Design Language System"
          subTitle="UI Components for EngageRocket apps."
          imgSrc={nebulaSrc}
          imgProps={{ alt: "Nebula Storybook" }}
        />

        <Work
          title="Frontend Development"
          subTitle="Application and feature development contributor."
          imgSrc={chartsSrc}
          imgProps={{ alt: "Charts" }}
        />

        <Work
          title="Rocket Surgeon"
          subTitle="Resolving customer issues."
          imgSrc={csSrc}
          imgProps={{ alt: "Jira Board Sample" }}
        />
      </Article>

      <Article
        title="Infor PSSC, Inc."
        subTitle="Software Engineer, Senior"
        description="Worked on fashion industry solutions. Had 1+ years of experience on React, C#, .Net Core, and SQL Server."
      >
        <Work
          title="Frontend / Backend Development"
          subTitle="Application and feature development contributor."
          imgSrc={fplmSrc}
          imgProps={{ alt: "FPLM" }}
        />
      </Article>

      <Article
        title="Samsung R&D Institute Philippines"
        subTitle="Engineer"
        description="Worked on a data analytics tool. Had ~1 year of experience on React."
      >
        <Work
          title="Cognitiv Analytics UI Components"
          subTitle="UI Components for Cognitiv Analytics app."
        />

        <Work
          title="Frontend Development"
          subTitle="Application and feature development contributor."
        />
      </Article>

      <Article
        title="BizBox, Inc."
        subTitle="Full Stack Developer / Team Lead"
        description="Worked on a healthcare industry. Had 3 years of experience on the following: AngularJS, C#, .Net Framework, SQL Server, and 1 year of experience on React, Meteor, Node, and MongoDB."
      >
        <Work
          title="Beacon / PhilHealth E-Claims Portal"
          subTitle="Application and feature development contributor."
          imgSrc={beaconSrc}
          imgProps={{ alt: "Beacon / Philhealth e-claims" }}
        />

        <Work
          title="QMeUp"
          subTitle="Application and feature development contributor."
          imgSrc={qmuSrc}
          imgProps={{ alt: "Beacon / Philhealth e-claims" }}
        />

        <Work
          title="EHR (Electronic Health Record)"
          subTitle="Application and feature development contributor."
          imgSrc={ehrSrc}
          imgProps={{ alt: "EHR (Electronic Health Record)" }}
        />
      </Article>
    </main>
  );
}

interface ArticleProps {
  title: string;
  subTitle: string;
  description: string;
  children?: any;
}

function Article({ title, subTitle, description, children }: ArticleProps) {
  return (
    <article className="py-10 even:bg-violet-900 flex justify-center w-full text-gray-900 even:text-gray-50">
      <div className="w-full max-w-5xl">
        <h2 className="mx-10 text-xl sm:text-2xl font-bold mb-2">{title}</h2>
        <h3 className="mx-10 text-lg sm:text-xl mb-2">{subTitle}</h3>
        <p className="mx-10">{description}</p>
        {children}
      </div>
    </article>
  );
}

interface WorkProps {
  title: string;
  subTitle: string;
  imgSrc?: string;
  imgProps?: object;
}

function Work({ title, subTitle, imgSrc, imgProps }: WorkProps) {
  return (
    <Card className="mt-8 flex flex-col max-w-5xl mx-10 p-4 sm:p-8 md:gap-2 md:flex-row-reverse md:odd:flex-row md:odd:text-right">
      {imgSrc && (
        <div className="flex-1">
          <img src={imgSrc} {...imgProps} />
        </div>
      )}
      <div className="flex flex-col justify-end flex-1 text-gray-900">
        <h4 className="text-lg font-bold mb-2 sm:text-xl">{title}</h4>
        <p>{subTitle}</p>
      </div>
    </Card>
  );
}
