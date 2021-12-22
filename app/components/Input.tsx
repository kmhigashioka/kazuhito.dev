interface InputProps extends React.HTMLProps<HTMLInputElement> {
  containerClassName?: string;
  id?: string;
  label: any;
}

export default function Input({ containerClassName, label, ...props }: InputProps) {
  return (
    <div className={containerClassName}>
      <label className="block text-xs text-gray-800" htmlFor={props.id}>
        {label}
      </label>
      <input className="outline-none w-full border-2 border-gray-900 rounded-lg h-10 p-2 text-gray-800 focus:border-violet-900" {...props} />
    </div>
  );
}
