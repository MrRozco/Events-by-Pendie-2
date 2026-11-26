'use client'

import type { Faq as FaqItem } from '@/lib/types'
import { AnimatePresence, motion } from 'motion/react'
import { useId, useState } from 'react'
import { Plus } from './icons'

export function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number>(0)
  const uid = useId()

  return (
    <div className="faq">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div className="faq-item" key={i}>
            <h3 style={{ margin: 0, font: 'inherit' }}>
              <button
                type="button"
                className="faq-q"
                aria-expanded={isOpen}
                aria-controls={`${uid}-a${i}`}
                onClick={() => setOpen(isOpen ? -1 : i)}
              >
                {item.question}
                <span className="plus" aria-hidden>
                  <Plus />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`${uid}-a${i}`}
                  className="faq-a"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
                >
                  <p>{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
