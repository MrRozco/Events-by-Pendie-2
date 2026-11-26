import type { CollectionConfig, FieldHook } from 'payload'
import { authenticated } from '../access'
import { revalidateAfterChange, revalidateAfterDelete } from '../lib/revalidate'
import { EVENT_STATUSES, EVENT_TYPES } from '../lib/constants'

const slugify = (v: string) =>
  v
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const formatSlug: FieldHook = ({ value, data, originalDoc }) => {
  if (typeof value === 'string' && value.length > 0) return slugify(value)
  const title = data?.title ?? originalDoc?.title
  const date = (data?.startsAt ?? originalDoc?.startsAt ?? '').slice(0, 10)
  return title ? slugify(`${title} ${date}`) : value
}

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    group: 'Events',
    defaultColumns: ['title', 'type', 'startsAt', 'status', 'ticketsSold', 'capacity'],
    listSearchableFields: ['title', 'venue'],
    description: 'Every event you host. "On sale" events show on the home page; "Past" events show in Our work.',
  },
  defaultSort: '-startsAt',
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  access: {
    // Public can read everything except drafts.
    read: ({ req: { user } }) => (user ? true : { status: { not_equals: 'draft' } }),
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'title', type: 'text', required: true, admin: { width: '60%' } },
        {
          name: 'type',
          type: 'select',
          required: true,
          options: EVENT_TYPES.map((t) => ({ ...t })),
          admin: { width: '40%' },
        },
      ],
    },
    {
      name: 'theme',
      type: 'text',
      admin: { description: 'Optional subtitle, e.g. "1920s Speakeasy".' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startsAt',
          type: 'date',
          required: true,
          index: true,
          admin: { width: '50%', date: { pickerAppearance: 'dayAndTime' } },
        },
        {
          name: 'endsAt',
          type: 'date',
          admin: { width: '50%', date: { pickerAppearance: 'dayAndTime' } },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'venue', type: 'text', admin: { width: '50%' } },
        { name: 'city', type: 'text', admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'price',
          type: 'number',
          min: 0,
          admin: { width: '33%', description: 'Ticket price in USD.', step: 0.01 },
        },
        { name: 'capacity', type: 'number', min: 1, admin: { width: '33%' } },
        {
          name: 'ticketsSold',
          type: 'number',
          defaultValue: 0,
          min: 0,
          admin: { width: '33%', readOnly: true, description: 'Updated automatically by Stripe.' },
        },
      ],
    },
    { name: 'summary', type: 'textarea', admin: { description: 'One or two sentences for listings.' } },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    {
      name: 'gallery',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: { description: 'Photos from the night — used in Our work.' },
    },
    { name: 'description', type: 'richText' },
    {
      name: 'guestCount',
      type: 'number',
      admin: { description: 'For past events: how many guests attended.', condition: (d) => d?.status === 'past' },
    },
    // Sidebar
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      index: true,
      options: EVENT_STATUSES.map((s) => ({ ...s })),
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Feature this past event at the top of Our work.' },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'Auto-generated from the title.' },
      hooks: { beforeValidate: [formatSlug] },
    },
  ],
}
