import React from 'react';
import { CustomerQuoteLineItem } from '../types/portal.types';
interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        lineId?: string;
        comment: string;
    }) => Promise<any>;
    lines: CustomerQuoteLineItem[];
    defaultLineId?: string;
    isSubmitting: boolean;
}
export declare const LineCommentModal: React.FC<Props>;
export {};
//# sourceMappingURL=LineCommentModal.d.ts.map