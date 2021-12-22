export default function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="outline-none bg-violet-900 hover:bg-violet-880 text-white rounded h-10 w-full shadow-button-light"
      {...props}
    />
  );
}
