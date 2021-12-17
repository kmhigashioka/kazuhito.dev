import type { MetaFunction } from "remix";
import pictureSrc from "../assets/picture.svg";

export let meta: MetaFunction = () => {
  return {
    title: "Hi! 👋 I'm Kazu.",
    description: "Building software for humans."
  };
};

export default function Index() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col py-8 px-10 sm:flex-row-reverse sm:pt-16 sm:px-20">
      <div className="justify-center items-center hidden md:inline-flex">
        <img className="h-40 w-40 sm:h-80 sm:w-80" src={pictureSrc} />
      </div>
      <div>
        <h1 className="font-bold text-gray-900 text-2xl sm:text-4xl">
          Hi! <span className="font-normal">👋</span> I'm Kazu,
          <br />
          building software for humans.
        </h1>
        <p className="text-gray-900 text-lg pt-8 sm:pt-10 sm:text-xl">
          Currently a Senior Software Developer at <a className="text-purple-900 underline" href="https://www.engagerocket.co/">EngageRocket</a>.
        </p>
      </div>
      <RandomCircles />
    </main>
  );
}

function RandomCircles() {
  return (
    <>
      <svg className="absolute top-0 left-0 pointer-events-none z-minus-1 h-screen w-screen" xmlns="http://www.w3.org/2000/svg">
        <circle className="fill-current text-violet-20" cx="-20" cy="80%" r="75" />
        <circle className="fill-current text-purple-20" cx="400" cy="195" r="190" />
        <circle className="fill-current text-gray-20 hidden lg:inline" cx="97%" cy="195" r="65" />
        <circle className="fill-current text-pink-20" cx="650" cy="95%" r="90" />
      </svg>
    </>
  );
}
