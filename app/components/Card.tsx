interface CardProps extends React.HTMLProps<HTMLDivElement> {
  children: any;
}

export default function Card({ className, ...props }: CardProps) {
  return <div className={`shadow-card bg-white p-8 rounded-2xl ${className}`} {...props} />;
}
