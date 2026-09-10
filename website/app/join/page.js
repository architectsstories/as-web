import Link from 'next/link'
import JoinForm from '../../components/JoinForm'

export const metadata = {
  title: 'Join Architects Stories',
  description: 'Join the Architects Stories community — get your work featured, connect with other architects and designers, and stay updated on programmes and events.',
}

export default function JoinPage() {
  return (
    <div className="wrap">
      <div className="crumb"><Link href="/">Home</Link><span>/</span><span style={{color: 'var(--black)'}}>Join AS</span></div>

      <section style={{paddingTop: 0}}>
        <div className="eyebrow-dot"><span className="dot" /><h2>Join Architects Stories<span className="red">.</span></h2></div>
        <p style={{fontSize: 15, color: 'var(--grey)', maxWidth: '52ch', marginTop: 10, marginBottom: 32}}>
          A growing network of students, architects, designers, studios and makers.
          Tell us about you, and we'll take it from there.
        </p>

        <div className="join-benefits">
          <div className="join-benefit">
            <h4>Get Featured</h4>
            <p>Share your projects and stories with a community that cares about the craft.</p>
          </div>
          <div className="join-benefit">
            <h4>Community Directory</h4>
            <p>Show up in Find Your People, so others can discover and connect with you.</p>
          </div>
          <div className="join-benefit">
            <h4>Programmes & Events</h4>
            <p>Hear first about new Learn programmes and community meetups.</p>
          </div>
        </div>

        <JoinForm />
      </section>
    </div>
  )
}
