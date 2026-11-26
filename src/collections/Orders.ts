import type { CollectionConfig } from 'payload'
import { authenticated, nobody } from '../access'

/** Ticket orders. Created only by the Stripe webhook. */
export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'email',
    group: 'Sales',
    defaultColumns: ['email', 'event', 'quantity', 'amountTotal', 'status', 'createdAt'],
  },
  defaultSort: '-createdAt',
  access: {
    read: authenticated,
    create: nobody,
    update: authenticated, // e.g. mark refunded
    delete: authenticated,
  },
  fields: [
    { name: 'event', type: 'relationship', relationTo: 'events', required: true, index: true },
    { type: 'row', fields: [{ name: 'name', type: 'text' }, { name: 'email', type: 'email', required: true }] },
    {
      type: 'row',
      fields: [
        { name: 'quantity', type: 'number', required: true, min: 1 },
        {
          name: 'amountTotal',
          type: 'number',
          required: true,
          admin: { description: 'Amount paid, in cents.' },
        },
        { name: 'currency', type: 'text', defaultValue: 'usd' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'paid',
      options: [
        { label: 'Paid', value: 'paid' },
        { label: 'Refunded', value: 'refunded' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'stripeSessionId',
      type: 'text',
      unique: true,
      index: true,
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
}
