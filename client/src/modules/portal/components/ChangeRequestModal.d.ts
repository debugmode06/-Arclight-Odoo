import React from 'react';
import { CustomerQuoteLineItem } from '../types/portal.types';
interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        lineId?: string;
        type: 'QUANTITY' | 'PRODUCT' | 'COMMERCIAL' | 'DELIVERY' | 'OTHER';
        description: string;
        requestedValue?: string;
    }) => Promise<any>;
    lines: CustomerQuoteLineItem[];
    isSubmitting: boolean;
}
export declare const ChangeRequestModal: React.FC<Props>;
export {};
//# sourceMappingURL=ChangeRequestModal.d.ts.map