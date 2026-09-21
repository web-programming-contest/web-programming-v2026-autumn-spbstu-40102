import {z} from 'zod';

export const loginSchema = z.object({
  username: z.string().trim().min(1).max(80),
  password: z.string().min(1).max(200),
});

export const orderSchema = z
  .object({
    items: z
      .array(
        z.object({
          productId: z.number().int().positive(),
          quantity: z.number().int().min(1).max(99),
        }),
      )
      .min(1)
      .max(100),
    phone: z.string().trim().min(5).max(32),
    email: z
      .union([z.string().trim().email().max(160), z.literal('')])
      .optional(),
    deliveryType: z.enum(['pickup', 'delivery']),
    address: z.string().trim().max(250).optional().default(''),
    paymentMethod: z.enum(['card', 'cash']),
    packaging: z.boolean().default(false),
  })
  .superRefine((value, context) => {
    if (value.deliveryType === 'delivery' && !value.address) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['address'],
        message: 'Address is required for delivery',
      });
    }
  });
