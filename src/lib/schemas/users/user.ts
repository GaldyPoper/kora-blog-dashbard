import { z } from 'zod';
import { emailSchema } from '../common/common';

export const userRoleSchema = z.enum(['admin', 'editor', 'viewer']);

export const userSchema = z.object({
	id: z.string(),
	email: emailSchema,
	password: z.string(),
	name: z.string(),
	role: userRoleSchema
});

export type UserRole = z.infer<typeof userRoleSchema>;
export type User = z.infer<typeof userSchema>;
