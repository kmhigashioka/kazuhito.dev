export default function Tag({ children }: { children: any }) {
  return (
    <span className="text-sm bg-green-100 px-1 rounded text-green-500 align-middle">
      {children}
    </span>
  )
}
