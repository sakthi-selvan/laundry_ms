import { z } from 'zod';

export const idSchema = z.string().uuid();
export const customerSchema = z.object({ name: z.string().trim().min(2).max(100), mobile: z.string().regex(/^(?:\+?91)?\d{10}$/), whatsapp: z.string().regex(/^(?:\+?91)?\d{10}$/).optional(), address: z.string().max(300).optional() });
export const orderSchema = z.object({ customerId: idSchema, expectedDeliveryAt: z.string().min(10), discount: z.number().min(0), advance: z.number().min(0), paymentMethod: z.enum(['cash','upi','card','other']), instructions: z.string().max(500).optional(), items: z.array(z.object({ clothingItemId: z.string(), serviceId: z.string(), itemName: z.string().min(1), serviceName: z.string().min(1), quantity: z.number().int().min(1).max(999), unitPrice: z.number().min(0), notes: z.string().max(300).optional() })).min(1) });
export const paymentSchema = z.object({ orderId: idSchema, amount: z.number().positive(), method: z.enum(['cash','upi','card','other']), reference: z.string().max(100).optional(), notes: z.string().max(300).optional() });
