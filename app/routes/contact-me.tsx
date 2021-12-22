import { useEffect, useState } from "react";
import { ActionFunction, MetaFunction, useLoaderData, } from "remix";
import { Form, useActionData, useTransition } from "remix";
import Button from "~/components/Button";
import Input from "~/components/Input";
import Modal from "~/components/Modal";
import Textarea from "~/components/Textarea";
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

export function loader() {
  return {
    ENV: {
      CONTACT_ME_EMAIL: process.env.CONTACT_ME_EMAIL,
    },
  };
}

export default function ContactMe() {
  const actionData = useActionData();
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  useEffect(() => {
    if (actionData?.success) {
      setIsConfirmationOpen(true);
    }
  }, [actionData]);

  return (
    <>
      <div className="h-96 w-full absolute top-0 left-0 right-0 bg-violet-20 z-minus-1 pointer-events-none" />
      <main className="flex flex-col items-center py-8 px-10 sm:pt-16">
        <h1 className="text-gray-900 font-bold text-2xl sm:text-3xl">contact me</h1>
        <div className="flex flex-col mt-8 shadow-card bg-white p-1 rounded-2xl w-full max-w-5xl md:flex-row">
          <JustSayHi />
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
          <Button onClick={() => setIsConfirmationOpen(false)}>
            OK, Got it!
          </Button>
        </Modal>
      </main>
    </>
  );
}

function JustSayHi() {
  const data = useLoaderData();

  return (
    <span className="bg-violet-900 p-5 rounded-2xl text-white sm:p-10 md:w-96">
      <p className="text-lg font-bold sm:text-xl">Just say hi</p>
      <p className="mt-2 text-xs">Lorem ipsum dolor emet. The quick brown fox jumps over the lazy dog?</p>
      <div className="flex items-start mt-7 sm:mt-14">
        <img alt="email icon" className="mr-3 w-6 h-6 sm:mr-6" src={emailSrc} width={24} height={24} />
        <a className="break-all underline" href={`mailto:${data.ENV['CONTACT_ME_EMAIL']}?subject=Hi! 👋`}>{data.ENV['CONTACT_ME_EMAIL']}</a>
      </div>
      <div className="flex mt-7 sm:mt-14">
        <img alt="place icon" className="mr-3 w-6 h-6 sm:mr-6" src={placeSrc} width={24} height={24} />
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

        <Button disabled={transition.state == 'submitting'}>
          SEND
        </Button>
      </Form>
    </span>
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
