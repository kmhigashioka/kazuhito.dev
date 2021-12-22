interface TextareaProps extends React.HTMLProps<HTMLTextAreaElement> {
  containerClassName?: string;
  id?: string;
  label: any;
}

export default function Textarea({ containerClassName, label, ...props }: TextareaProps) {
  return (
    <div className={containerClassName}>
      <label className="block text-xs text-gray-800" htmlFor={props.id}>
        {label}
      </label>
      <textarea rows={4} className="outline-none w-full border-2 border-gray-900 rounded-lg p-2 focus:border-violet-900 text-gray-800" {...props} />
    </div>
  );
}
