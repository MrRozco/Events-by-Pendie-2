'use client'

import { MotionConfig, motion, type HTMLMotionProps } from 'motion/react'
import type { ReactNode } from 'react'

/** Respects the OS "reduce motion" setting for every Motion animation. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}

const EASE = [0.2, 0.7, 0.2, 1] as const

type RevealProps = HTMLMotionProps<'div'> & {
  delay?: number
  as?: 'div' | 'article' | 'li' | 'figure' | 'aside'
}

/** Fades content up as it scrolls into view (once). */
export function Reveal({ delay = 0, as = 'div', children, ...rest }: RevealProps) {
  const Comp = motion[as] as typeof motion.div
  return (
    <Comp
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.9, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Comp>
  )
}

/** Staggered children; wrap items in <RevealItem>. */
export function RevealGroup({ children, className, stagger = 0.12 }: { children: ReactNode; className?: string; stagger?: number }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </motion.div>
  )
}

export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 32 },
        show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  )
}
