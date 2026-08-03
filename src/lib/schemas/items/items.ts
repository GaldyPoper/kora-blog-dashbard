import { z } from 'zod';
import { usdAmountSchema, isoDateTimeSchema, isoDateSchema } from '../common/common';

export const itemStatusSchema = z.enum([
	'draft',
	'scheduled',
	'active',
	'paused',
	'completed',
	'archived'
]);

export const itemChannelSchema = z.enum(['email', 'sms', 'web', 'social', 'push']);

export const itemOwnerSchema = z.object({
	id: z.string(),
	name: z.string()
});

export const itemSchema = z.object({
	id: z.string(),
	name: z.string(),
	status: itemStatusSchema,
	channel: itemChannelSchema,
	owner: itemOwnerSchema,
	budget: usdAmountSchema,
	spent: usdAmountSchema,
	impressions: z.number().int().nonnegative(),
	clicks: z.number().int().nonnegative(),
	ctr: z.number().min(0).max(1),
	startDate: isoDateSchema,
	endDate: isoDateSchema,
	updatedAt: isoDateTimeSchema,
	tags: z.array(z.string())
});

export type ItemStatus = z.infer<typeof itemStatusSchema>;
export type ItemChannel = z.infer<typeof itemChannelSchema>;
export type ItemOwner = z.infer<typeof itemOwnerSchema>;
export type Item = z.infer<typeof itemSchema>;
