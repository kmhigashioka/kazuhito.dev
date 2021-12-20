import type { MetaFunction } from "remix";
import Card from "~/components/Card";
import chartsSrc from "../assets/my-work_charts.svg";
import csSrc from "../assets/my-work_cs.svg";
import nebulaSrc from "../assets/my-work_nebula.svg";

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
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
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

      {/* <Article
        title="Infor PSSC, Inc."
        subTitle="Software Engineer, Senior"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      />

      <Article
        title="Samsung R&D Institute Philippines"
        subTitle="Engineer"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      />

      <Article
        title="BizBox, Inc."
        subTitle="Full Stack Developer / Team Lead"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      />

      <Article
        title="De La Salle Lipa, Inc."
        subTitle="Instructor"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      /> */}
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
    <article className="py-10 even:bg-purple-15 text-gray-900 flex justify-center w-full">
      <div className="max-w-5xl">
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
  imgSrc: string;
  imgProps: object;
}

function Work({ title, subTitle, imgSrc, imgProps }: WorkProps) {
  return (
    <Card className="mt-8 flex flex-col max-w-5xl mx-10 md:gap-2 md:flex-row-reverse md:odd:flex-row md:odd:text-right">
      <div className="flex-1">
        <img src={imgSrc} {...imgProps} />
      </div>
      <div className="flex flex-col justify-end flex-1">
        <h4 className="text-lg font-bold mb-2 sm:text-xl">{title}</h4>
        <p>{subTitle}</p>
      </div>
    </Card>
  );
}
