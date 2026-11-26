import type { CollectionConfig } from 'payload'
import { authenticated, nobody } from '../access'

/** Newsletter sign-ups from the "Be first in line" form. */
export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  admin: {
    useAsTitle: 'email',
    group: 'Inbox',
    defaultColumns: ['email', 'status', 'source', 'createdAt'],
  },
  defaultSort: '-createdAt',
  access: {
    read: authenticated,
    create: nobody, // created by the server action
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    { name: 'email', type: 'email', required: true, unique: true, index: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'subscribed',
      options: [
        { label: 'Subscribed', value: 'subscribed' },
        { label: 'Unsubscribed', value: 'unsubscribed' },
      ],
    },
    { name: 'source', type: 'text', defaultValue: 'website', admin: { readOnly: true } },
  ],
}
