export default function Tag({ className = '', children }: { className?: string, children: any }) {
  return (
    <span
      className={`text-sm bg-green-100 px-1 rounded text-green-500 align-middle whitespace-nowrap ${className}`}
    >
      {children}
    </span>
  )
}
