import { useEffect, useState } from "react";
import type { ActionFunction, MetaFunction } from "remix";
import { Form, useActionData, useTransition } from "remix";
import Modal from "~/components/Modal";
import sendEmail from "~/utils/send-email";
import checkCircleSrc from "../assets/check_circle.svg";
import emailSrc from "../assets/email.svg";
import placeSrc from "../assets/place.svg";

export let meta: MetaFunction = () => {
  return {
    title: "Hi! 👋 I'm Kazu. Contact me",
    description: "Building software for humans."
  };
};

export default function ContactMe() {
  const actionData = useActionData();
  const email = 'kmhigashioka@gmail.com';
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  useEffect(() => {
    if (actionData?.success) {
      setIsConfirmationOpen(true);
    }
  }, [actionData]);

  return (
    <>
      <div className="h-96 w-full absolute top-0 left-0 right-0 bg-purple-15 z-minus-1 pointer-events-none" />
      <main className="flex flex-col items-center py-8 px-10 sm:pt-16">
        <h1 className="text-gray-900 font-bold text-2xl sm:text-3xl">contact me</h1>
        <div className="flex flex-col mt-8 shadow-card bg-white p-1 rounded-2xl w-full max-w-5xl md:flex-row">
          <JustSayHi email={email} />
          <ContactForm />
        </div>
        <Modal
          aria-labelledby="modal-title"
          isOpen={isConfirmationOpen}
          onClose={() => setIsConfirmationOpen(false)}
          className="flex flex-col items-center text-gray-900"
        >
          <img alt="check_circle icon" className="flex items-center mb-6 w-14 h-14" src={checkCircleSrc} />
          <p className="text-center text-base font-bold mb-2" id="modal-title">Your message is recorded!</p>
          <p className="text-center text-xs mb-6 text-gray-800">I’ll reach you as soon as I read your message. Take care!</p>
          <button onClick={() => setIsConfirmationOpen(false)} className="outline-none bg-purple-900 hover:bg-purple-800 text-white rounded h-10 w-full shadow-button-light">OK, Got it!</button>
        </Modal>
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
  const transition = useTransition();

  return (
    <span className="md:flex md:flex-1 md:justify-center md:py-8">
      <Form method="post" action="/contact-me" className="p-5" autoComplete="off">
        <div className="flex flex-col sm:flex-row sm:gap-x-8">
          <Input
            containerClassName="mb-3 flex-1 flex flex-col justify-end sm:mb-6"
            id="name"
            label="What is your name?"
            name="name"
            required
          />

          <Input
            containerClassName="mb-3 flex-1 flex flex-col justify-end sm:mb-6"
            id="email"
            label="What is your email address?"
            name="email"
            required
          />
        </div>

        <Input
          containerClassName="mb-3 sm:mb-6"
          id="subject"
          label="What is the subject?"
          name="subject"
          required
        />

        <Textarea
          containerClassName="mb-3 sm:mb-6"
          id="message"
          label="What is your message?"
          name="message"
          required
        />

        <button disabled={transition.state == 'submitting'} className="bg-purple-900 hover:bg-purple-800 text-white rounded h-10 w-full shadow-button-light disabled:opacity-50">
          SEND
        </button>
      </Form>
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
      <input className="outline-none w-full border-2 border-gray-900 rounded-lg h-10 p-2 text-gray-800 focus:border-purple-900" {...props} />
    </div>
  );
}

function Textarea({ containerClassName, label, ...props }: InputProps) {
  return (
    <div className={containerClassName}>
      <label className="block text-xs text-gray-800" htmlFor={props.id}>
        {label}
      </label>
      <textarea rows={4} className="outline-none w-full border-2 border-gray-900 rounded-lg p-2 focus:border-purple-900 text-gray-800" {...props} />
    </div>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  const name = body.get('name')?.toString();
  const email = body.get('email')?.toString();
  const message = body.get('message')?.toString();
  const subject = body.get('subject')?.toString();
  sendEmail(name, email, subject, message);
  return { errors: [], success: true };
};
