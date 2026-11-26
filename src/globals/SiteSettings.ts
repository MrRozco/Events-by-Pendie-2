import type { GlobalConfig } from 'payload'
import { anyone, authenticated } from '../access'
import { revalidateGlobal } from '../lib/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: { group: 'Settings' },
  access: { read: anyone, update: authenticated },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Brand & contact',
          fields: [
            { name: 'brandName', type: 'text', required: true, defaultValue: '[Your Brand]' },
            { name: 'hostName', type: 'text', defaultValue: '[Your name]' },
            { name: 'city', type: 'text', defaultValue: '[City, State]' },
            { name: 'email', type: 'email' },
            { name: 'instagram', type: 'text', admin: { description: 'Full URL' } },
            { name: 'tiktok', type: 'text', admin: { description: 'Full URL' } },
            { name: 'responseTime', type: 'text', defaultValue: 'Within 48 hours' },
          ],
        },
        {
          label: 'Images',
          fields: [
            { name: 'heroImage', type: 'upload', relationTo: 'media', admin: { description: 'Optional photo behind the home hero (olive overlay is applied).' } },
            { name: 'hostPhoto', type: 'upload', relationTo: 'media' },
            { name: 'privateEventPhoto', type: 'upload', relationTo: 'media' },
          ],
        },
        {
          label: 'About numbers',
          fields: [
            { name: 'eventsHosted', type: 'text', defaultValue: '[#]' },
            { name: 'guestsWelcomed', type: 'text', defaultValue: '[#]' },
            { name: 'storylinesWritten', type: 'text', defaultValue: '[#]' },
          ],
        },
        {
          label: 'FAQ',
          fields: [
            {
              name: 'faqs',
              type: 'array',
              labels: { singular: 'Question', plural: 'Questions' },
              fields: [
                { name: 'question', type: 'text', required: true },
                { name: 'answer', type: 'textarea', required: true },
              ],
            },
          ],
        },
      ],
    },
  ],
}
