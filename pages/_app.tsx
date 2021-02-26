import * as React from 'react'
import Head from 'next/head'
import Nav from '../components/Nav'
import '../styles/globals.css'

interface MyAppProps {
  Component: React.FunctionComponent
  pageProps: any
}

function MyApp({ Component, pageProps }: MyAppProps) {
  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins" rel="stylesheet" />
      </Head>
      <div className="flex flex-col md:flex-row h-screen w-screen">
        <Nav />
        <main className="bg-gray-50 flex-grow overflow-auto">
          <Component {...pageProps} />
        </main>
      </div>
    </>
  )
}

export default MyApp
