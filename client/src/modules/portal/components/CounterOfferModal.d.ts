import React from 'react';
interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        proposedDiscount: number;
        reason: string;
    }) => Promise<any>;
    currentSubtotal: number;
    currentDiscountAmount: number;
    isSubmitting: boolean;
}
export declare const CounterOfferModal: React.FC<Props>;
export {};
//# sourceMappingURL=CounterOfferModal.d.ts.map