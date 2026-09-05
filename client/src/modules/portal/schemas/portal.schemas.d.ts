import { z } from 'zod';
export declare const customerLoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const lineCommentSchema: z.ZodObject<{
    lineId: z.ZodOptional<z.ZodString>;
    comment: z.ZodString;
}, z.core.$strip>;
export declare const changeRequestSchema: z.ZodObject<{
    lineId: z.ZodOptional<z.ZodString>;
    type: z.ZodEnum<{
        QUANTITY: "QUANTITY";
        PRODUCT: "PRODUCT";
        COMMERCIAL: "COMMERCIAL";
        DELIVERY: "DELIVERY";
        OTHER: "OTHER";
    }>;
    description: z.ZodString;
    requestedValue: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const counterOfferSchema: z.ZodObject<{
    proposedDiscount: z.ZodCoercedNumber<unknown>;
    reason: z.ZodString;
}, z.core.$strip>;
export declare const confirmQuoteSchema: z.ZodObject<{
    termsAccepted: z.ZodBoolean;
    customerNotes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CustomerLoginFormValues = z.infer<typeof customerLoginSchema>;
export type LineCommentFormValues = z.infer<typeof lineCommentSchema>;
export type ChangeRequestFormValues = z.infer<typeof changeRequestSchema>;
export type CounterOfferFormValues = z.infer<typeof counterOfferSchema>;
export type ConfirmQuoteFormValues = z.infer<typeof confirmQuoteSchema>;
//# sourceMappingURL=portal.schemas.d.ts.map