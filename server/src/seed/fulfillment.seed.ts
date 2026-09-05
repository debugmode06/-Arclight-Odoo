import { Warehouse } from '../modules/fulfillment/models/warehouse.model';
import { Inventory } from '../modules/fulfillment/models/inventory.model';
import { Fulfillment } from '../modules/fulfillment/models/fulfillment.model';
import { Types } from 'mongoose';
import { logger } from '../shared';

export async function seedFulfillmentData(): Promise<void> {
  logger.info('Seed', 'Seeding Member 3 Multi-Depot Fulfillment & Quote Q-2025-0842 data into MongoDB Atlas...');

  // 1. Warehouses (Depot A: Bhiwandi Hub, Depot B: Kolkata Terminal, Depot C: Central Field Hub)
  const warehousesData = [
    {
      code: 'DEPOT-A',
      name: 'Main Warehouse (Bhiwandi Hub, West)',
      location: {
        address: 'Bhiwandi Industrial Zone',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        zipCode: '421302',
        coordinates: { lat: 19.2812, lng: 73.0482 },
      },
      contactEmail: 'bhiwandi-depot@dealflow360.com',
      contactPhone: '+91-22-5550-199',
      shippingRatePerKm: 12.0,
      shippingBaseFee: 8000.0,
      isActive: true,
    },
    {
      code: 'DEPOT-B',
      name: 'East Depot (Kolkata Terminal)',
      location: {
        address: 'Dankuni Freight Terminal',
        city: 'Kolkata',
        state: 'West Bengal',
        country: 'India',
        zipCode: '712311',
        coordinates: { lat: 22.5726, lng: 88.3639 },
      },
      contactEmail: 'kolkata-depot@dealflow360.com',
      contactPhone: '+91-33-5550-144',
      shippingRatePerKm: 14.0,
      shippingBaseFee: 10400.0,
      isActive: true,
    },
    {
      code: 'DEPOT-C',
      name: 'West Enterprise Field Hub',
      location: {
        address: 'Pune Tech Park Zone',
        city: 'Pune',
        state: 'Maharashtra',
        country: 'India',
        zipCode: '411057',
        coordinates: { lat: 18.5204, lng: 73.8567 },
      },
      contactEmail: 'field-hub@dealflow360.com',
      contactPhone: '+91-20-5550-188',
      shippingRatePerKm: 10.0,
      shippingBaseFee: 5000.0,
      isActive: true,
    },
  ];

  const createdWarehouses = [];
  for (const wh of warehousesData) {
    const doc = await Warehouse.findOneAndUpdate({ code: wh.code }, wh, {
      upsert: true,
      new: true,
    });
    createdWarehouses.push(doc);
  }

  // 2. Products for Quote Q-2025-0842
  const laptopProdId = new Types.ObjectId('64f1a2b3c4d5e6f7a8b9c101');
  const cloudLicenseProdId = new Types.ObjectId('64f1a2b3c4d5e6f7a8b9c102');
  const onsiteImplProdId = new Types.ObjectId('64f1a2b3c4d5e6f7a8b9c103');

  // Seed inventory levels
  // Main Warehouse (Bhiwandi): 14 Physical Stock available, 6 allocated, 8 remaining
  await Inventory.findOneAndUpdate(
    { warehouseId: createdWarehouses[0]._id, productId: laptopProdId },
    {
      warehouseId: createdWarehouses[0]._id,
      productId: laptopProdId,
      quantityAvailable: 14,
      quantityReserved: 6,
      reorderPoint: 5,
      reorderQuantity: 20,
    },
    { upsert: true }
  );

  // East Depot (Kolkata): 9 Physical Stock available, 4 allocated, 5 remaining
  await Inventory.findOneAndUpdate(
    { warehouseId: createdWarehouses[1]._id, productId: laptopProdId },
    {
      warehouseId: createdWarehouses[1]._id,
      productId: laptopProdId,
      quantityAvailable: 9,
      quantityReserved: 4,
      reorderPoint: 3,
      reorderQuantity: 15,
    },
    { upsert: true }
  );

  // 3. Seed Initial Fulfillment Record for Quote Q-2025-0842
  const dummyQuotationId = new Types.ObjectId('64f1a2b3c4d5e6f7a8b9c201');
  const dummyCustomerId = new Types.ObjectId('64f1a2b3c4d5e6f7a8b9c202');

  await Fulfillment.findOneAndUpdate(
    { fulfillmentNumber: 'FUL-Q-2025-0842' },
    {
      fulfillmentNumber: 'FUL-Q-2025-0842',
      quotationId: dummyQuotationId,
      customerId: dummyCustomerId,
      status: 'ALLOCATED',
      allocations: [
        {
          productId: laptopProdId,
          warehouseId: createdWarehouses[0]._id,
          quantityAllocated: 6,
          shippingCost: 8000,
          status: 'ALLOCATED',
          trackingNumber: 'BLUEDART-APEX-842',
        },
        {
          productId: laptopProdId,
          warehouseId: createdWarehouses[1]._id,
          quantityAllocated: 4,
          shippingCost: 10400,
          status: 'ALLOCATED',
          trackingNumber: 'DELHIVERY-FREIGHT-842',
        },
        {
          productId: cloudLicenseProdId,
          warehouseId: createdWarehouses[0]._id,
          quantityAllocated: 10,
          shippingCost: 0,
          status: 'ALLOCATED',
          trackingNumber: 'SAAS-AUTO-TOKEN-842',
        },
        {
          productId: onsiteImplProdId,
          warehouseId: createdWarehouses[2]._id,
          quantityAllocated: 1,
          shippingCost: 2000,
          status: 'ALLOCATED',
          trackingNumber: 'FIELD-ENG-ASSIGNED',
        },
      ],
      totalShipments: 2,
      totalShippingCost: 18400,
      isManualOverride: false,
      notes: 'DealTwin engine auto-routed 6+4 split based on customer regional delivery sites (Mumbai HQ: 6 units, Kolkata Branch: 4 units).',
    },
    { upsert: true }
  );

  logger.info('Seed', 'MongoDB Atlas Multi-Depot Fulfillment seed complete!');
}
