import type { MetaFunction } from "remix";
import emailSrc from "../assets/email.svg";
import placeSrc from "../assets/place.svg";

export let meta: MetaFunction = () => {
  return {
    title: "Hi! 👋 I'm Kazu. Contact me",
    description: "Building software for humans."
  };
};

export default function ContactMe() {
  const email = 'kmhigashioka@gmail.com';

  return (
    <>
      <div className="h-96 w-full absolute top-0 left-0 right-0 bg-purple-15 z-minus-1 pointer-events-none" />
      <main className="flex flex-col items-center py-8 px-10 sm:pt-16">
        <h1 className="text-gray-900 font-bold text-2xl sm:text-3xl">contact me</h1>
        <div className="flex flex-col mt-8 shadow-card bg-white p-1 rounded-2xl w-full max-w-5xl md:flex-row">
          <JustSayHi email={email} />
          <ContactForm />
        </div>
      </main>
    </>
  );
}

function JustSayHi({ email }: { email: string }) {
  return (
    <span className="bg-purple-900 p-5 rounded-2xl text-white sm:p-10 md:w-96">
      <p className="text-lg font-bold sm:text-xl">Just say hi</p>
      <p className="mt-2 text-xs">Lorem ipsum dolor emet. The quick brown fox jumps over the lazy dog?</p>
      <div className="flex items-start mt-7 sm:mt-14">
        <img alt="email icon" className="mr-3 w-6 h-6 sm:mr-6" src={emailSrc} />
        <a className="break-all underline" href={`mailto:${email}?subject=Hi! 👋`}>{email}</a>
      </div>
      <div className="flex mt-7 sm:mt-14">
        <img alt="place icon" className="mr-3 w-6 h-6 sm:mr-6" src={placeSrc} />
        Philippines
      </div>
    </span>
  );
}

function ContactForm() {
  return (
    <span className="md:flex md:flex-1 md:justify-center md:py-8">
      <form className="p-5" autoComplete="off">
        <div className="flex flex-col sm:flex-row sm:gap-x-8">
          <Input containerClassName="mb-3 flex-1 flex flex-col justify-end sm:mb-6" id="name" label="What is your name?" />

          <Input containerClassName="mb-3 flex-1 flex flex-col justify-end sm:mb-6" id="email" label="What is your email address?" />
        </div>

        <Input containerClassName="mb-3 sm:mb-6" id="subject" label="What is the subject?" />

        <Textarea containerClassName="mb-3 sm:mb-6" id="message" label="What is your message?" />

        <button className="bg-purple-900 hover:bg-purple-800 text-white rounded h-10 w-full shadow-button-light">SUBMIT</button>
      </form>
    </span>
  );
}

interface InputProps {
  containerClassName?: string;
  id?: string;
  label: any;
}

function Input({ containerClassName, label, ...props }: InputProps) {
  return (
    <div className={containerClassName}>
      <label className="block text-xs text-gray-800" htmlFor={props.id}>
        {label}
      </label>
      <input className="outline-none w-full border-2 border-gray-800 rounded-lg h-10 p-2 focus:border-purple-900" {...props} />
    </div>
  );
}

function Textarea({ containerClassName, label, ...props }: InputProps) {
  return (
    <div className={containerClassName}>
      <label className="block text-xs text-gray-800" htmlFor={props.id}>
        {label}
      </label>
      <textarea rows={4} className="outline-none w-full border-2 border-gray-800 rounded-lg p-2 focus:border-purple-900" {...props} />
    </div>
  );
}
