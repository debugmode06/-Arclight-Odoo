import React from 'react';
interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: {
        termsAccepted: boolean;
        customerNotes?: string;
    }) => Promise<any>;
    quotationNumber: string;
    totalAmount: number;
    currency: string;
    isSubmitting: boolean;
}
export declare const QuoteConfirmDialog: React.FC<Props>;
export {};
//# sourceMappingURL=QuoteConfirmDialog.d.ts.map