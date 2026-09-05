import React from 'react';
interface DepotData {
    code: string;
    name: string;
    subName: string;
    zone: string;
    depotTag: string;
    allocatedQty: number;
    availableStock: number;
    sharePercent: number;
    transitDays: string;
    freightCost: string;
}
interface Props {
    depots: DepotData[];
    isConsolidatedMode?: boolean;
}
export declare const DepotAllocationCards: React.FC<Props>;
export {};
//# sourceMappingURL=DepotAllocationCards.d.ts.map