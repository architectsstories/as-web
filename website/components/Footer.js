import Image from 'next/image'

export default function Footer() {
  return (
    <footer>
      <div className="wrap foot-bottom">
        <Image src="/logo.png" alt="Architects Stories" width={140} height={47} style={{height: 32, width: 'auto'}} />
        <div className="foot-copy">© {new Date().getFullYear()} Architects Stories. All rights reserved.</div>
        <div className="foot-links">
          <a href="#">About</a>
          <a href="#">Contact</a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </div>
      </div>
    </footer>
  )
}
