import { z } from 'zod';

export const leadCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']).optional(),
  source: z.enum(['Website', 'Instagram', 'Referral']),
  createdAt: z.string().optional().or(z.date().optional())
});

export const leadUpdateSchema = leadCreateSchema.partial();
