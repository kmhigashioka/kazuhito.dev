import supabase from "./supabase-client";

export default async function (
  name: string | undefined,
  email: string | undefined,
  subject: string | undefined,
  message: string | undefined,
) {
  await supabase
    .from('messages')
    .insert({
      name,
      email,
      subject,
      message
    });
}
