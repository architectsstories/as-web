import Link from 'next/link'
import JoinForm from '../../components/JoinForm'

export const metadata = {
  title: 'Join Architects Stories',
  description: 'Join the Architects Stories community — get your work featured, connect with other architects and designers, and stay updated on programmes and events.',
}

export default function JoinPage() {
  return (
    <div className="wrap join-page">
      <div className="crumb"><Link href="/">Home</Link><span>/</span><span style={{color: 'var(--black)'}}>Join AS</span></div>

      <section style={{paddingTop: 0}}>
        <JoinForm />
      </section>
    </div>
  )
}
