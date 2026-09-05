import React from 'react';
export interface DispatchLine {
    id: string;
    name: string;
    subText: string;
    qtyText: string;
    originDepot: string;
    carrier: string;
    trackingStage: string;
    status: 'Reserved' | 'Ready' | 'Confirmed' | 'Backordered';
}
interface Props {
    lines: DispatchLine[];
}
export declare const DispatchManifestTable: React.FC<Props>;
export {};
//# sourceMappingURL=DispatchManifestTable.d.ts.map