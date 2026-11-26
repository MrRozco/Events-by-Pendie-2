import { Footer } from '@/components/Footer'
import { MotionProvider } from '@/components/motion'
import { Nav } from '@/components/Nav'
import { getSettings } from '@/lib/data'
import type { Metadata } from 'next'
import { DM_Sans, Fraunces, Hurricane } from 'next/font/google'
import type { ReactNode } from 'react'
import './globals.css'

const display = Fraunces({ subsets: ['latin'], variable: '--font-display', axes: ['opsz'], display: 'swap' })
const body = DM_Sans({ subsets: ['latin'], variable: '--font-body', display: 'swap' })
const script = Hurricane({ subsets: ['latin'], weight: '400', variable: '--font-script', display: 'swap' })

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings()
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
    title: { default: `${s.brandName} — Murder mysteries, Traitors & dinner parties`, template: `%s · ${s.brandName}` },
    description: `Murder mysteries, Traitors nights and dinner parties, planned and hosted in ${s.city}.`,
  }
}

export default async function FrontendLayout({ children }: { children: ReactNode }) {
  const settings = await getSettings()
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${script.variable}`}>
      <body>
        <MotionProvider>
          <div className="site">
            <a className="skip-link" href="#main">
              Skip to content
            </a>
            <Nav brandName={settings.brandName} />
            <main id="main">{children}</main>
            <Footer settings={settings} />
          </div>
        </MotionProvider>
      </body>
    </html>
  )
}
