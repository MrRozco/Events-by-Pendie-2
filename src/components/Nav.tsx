'use client'

import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Close, Menu } from './icons'

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About us' },
  { href: '/our-work', label: 'Our work' },
  { href: '/contact', label: 'Contact us' },
]

export function Nav({ brandName }: { brandName: string }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <>
      <nav className="nav" aria-label="Main">
        <div className="wrap nav-in">
          <Link className="brand" href="/">
            {brandName}
          </Link>
          <div className="links">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={isActive(l.href) ? 'nl active' : 'nl'}
                aria-current={isActive(l.href) ? 'page' : undefined}
              >
                {l.label}
              </Link>
            ))}
            <Link className="btn btn-ghost" href="/#events">
              Get tickets
            </Link>
            <button
              type="button"
              className="menu-toggle"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <Close /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="mobile-menu"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
          >
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={isActive(l.href) ? 'active' : undefined} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <Link className="btn btn-primary" href="/#events" onClick={() => setOpen(false)}>
              Get tickets
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
