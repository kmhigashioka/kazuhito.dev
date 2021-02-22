import * as React from 'react'
import Nav from '../components/Nav'
import '../styles/globals.css'

interface MyAppProps {
  Component: React.FunctionComponent
  pageProps: any
}

function MyApp({ Component, pageProps }: MyAppProps) {
  return (
    <div className="flex flex-col md:flex-row h-screen w-screen">
      <Nav />
      <main className="bg-gray-50 flex-grow">
        <Component {...pageProps} />
      </main>
    </div>
  )
}

export default MyApp
