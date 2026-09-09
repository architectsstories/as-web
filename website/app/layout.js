import { Figtree, Space_Grotesk } from 'next/font/google'
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
  description: 'Architecture storytelling, projects, learning and community, rooted in Kerala/India architecture.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${figtree.variable} ${spaceGrotesk.variable}`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
