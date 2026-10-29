import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer>
      <div className="wrap foot-bottom">
        <Image src="/logo.png" alt="Architects Stories" width={140} height={47} style={{height: 32, width: 'auto'}} />
        <div className="foot-copy">© {new Date().getFullYear()} Architects Stories. All rights reserved.</div>
        <div className="foot-links">
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  )
}
