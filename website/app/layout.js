import { Figtree, Space_Grotesk } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'

const figtree = Figtree({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-figtree',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-space-grotesk',
})

export const metadata = {
  title: 'Architects Stories — Stories, Projects, Learning & Community',
  description:
    'Architects Stories is a platform for the architecture community. We feature and tell stories through our media, connect professionals through our network, and create learning opportunities through industry experts.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
  <head>
    <meta
      name="google-adsense-account"
      content="ca-pub-4659159605242515"
    />
  </head>

  <body className={`${figtree.variable} ${spaceGrotesk.variable}`}>
    <Header />
    {children}
    <Footer />

    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4659159605242515"
      crossOrigin="anonymous"
      strategy="beforeInteractive"
    />
  </body>
  </html>
  )
}
