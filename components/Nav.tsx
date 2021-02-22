import { useState } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const links = [
    {
      href: '/',
      children: 'Home',
    },
    {
      href: '/about',
      children: 'About',
    },
    {
      href: '/projects',
      children: 'Projects',
    },
  ]

  return (
    <nav className="w-100 md:w-60">
      <div className="flex items-center justify-between m-10">
        <span className="text-lg antialiased font-semibold italic text-gray-900">@kmhigashioka</span>
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          aria-controls="mobile-menu"
          aria-expanded="false"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="sr-only">Open main menu</span>
          <svg className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <ul className={`${isOpen ? 'block' : 'hidden'} md:block`} id="mobile-menu">
        {links.map(link => {
          return (
            <li key={link.href}>
              <Link href={link.href} active={router.pathname === link.href}>
                {link.children}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

function Link({ active, children, href }: { active: boolean, children: React.ReactNode, href: string }) {
  const activeClass = active ? 'border-opacity-100 font-bold text-gray-900' : ''

  return (
    <NextLink href={href}>
      <a className={`block my-4 px-9 border-l-4 border-opacity-0 border-gray-900 text-gray-400 hover:text-gray-700 hover:border-gray-700 ${activeClass}`}>
        {children}
      </a>
    </NextLink>
  )
}
