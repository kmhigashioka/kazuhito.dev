import * as React from 'react';
import '../styles/globals.css'

interface MyAppProps {
  Component: React.FunctionComponent;
  pageProps: any;
}

function MyApp({ Component, pageProps }: MyAppProps) {
  return <Component {...pageProps} />
}

export default MyApp
