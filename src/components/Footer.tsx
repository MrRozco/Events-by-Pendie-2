import type { SiteSetting } from '@/payload-types'
import Link from 'next/link'

export function Footer({ settings }: { settings: SiteSetting }) {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="f-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: '34ch' }}>
            <Link className="brand" href="/">
              {settings.brandName}
            </Link>
            <p>Murder mysteries, Traitors nights and dinner parties, planned and hosted in {settings.city}.</p>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About us</Link></li>
              <li><Link href="/our-work">Our work</Link></li>
              <li><Link href="/contact">Contact us</Link></li>
            </ul>
          </div>
          <div>
            <h4>Events</h4>
            <ul>
              <li><Link href="/#events">Murder Mystery</Link></li>
              <li><Link href="/#events">Traitors</Link></li>
              <li><Link href="/#events">Dinner Parties</Link></li>
              <li><Link href="/contact">Private Events</Link></li>
            </ul>
          </div>
          <div>
            <h4>Connect</h4>
            <ul>
              {settings.instagram && <li><a href={settings.instagram} rel="noopener" target="_blank">Instagram</a></li>}
              {settings.tiktok && <li><a href={settings.tiktok} rel="noopener" target="_blank">TikTok</a></li>}
              {settings.email && <li><a href={`mailto:${settings.email}`}>{settings.email}</a></li>}
              <li><Link href="/contact">Send a message</Link></li>
            </ul>
          </div>
        </div>
        <div className="f-bottom">
          <span>© {year} {settings.brandName}. All rights reserved.</span>
          <span>Privacy · Terms · Refund policy</span>
        </div>
      </div>
    </footer>
  )
}
