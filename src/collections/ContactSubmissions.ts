import type { CollectionConfig } from 'payload'
import { authenticated, nobody } from '../access'
import { EVENT_TYPES } from '../lib/constants'

export const CONTACT_TOPICS = [
  { label: 'Private event', value: 'private' },
  { label: 'Tickets question', value: 'tickets' },
  { label: 'Venue or collaboration', value: 'collab' },
  { label: 'Something else', value: 'other' },
] as const

/** Messages from the Contact us form. */
export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  labels: { singular: 'Message', plural: 'Messages' },
  admin: {
    useAsTitle: 'name',
    group: 'Inbox',
    defaultColumns: ['name', 'email', 'topic', 'status', 'createdAt'],
  },
  defaultSort: '-createdAt',
  access: {
    read: authenticated,
    create: nobody, // created by the server action
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },
      ],
    },
    { name: 'topic', type: 'select', options: CONTACT_TOPICS.map((t) => ({ ...t })) },
    {
      type: 'row',
      fields: [
        {
          name: 'eventType',
          type: 'select',
          options: [...EVENT_TYPES.map((t) => ({ ...t })), { label: 'Not sure yet', value: 'unsure' }],
        },
        { name: 'guests', type: 'number', min: 1 },
        { name: 'preferredDate', type: 'date' },
      ],
    },
    { name: 'message', type: 'textarea' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Replied', value: 'replied' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
