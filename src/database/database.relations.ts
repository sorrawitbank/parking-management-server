import { defineRelations } from 'drizzle-orm/relations';
import * as schemas from './database.schemas';

export const relations = defineRelations(schemas, (r) => ({
  parkingAssignments: {
    parkingSlots: r.many.parkingSlots({
      from: r.parkingAssignments.assignmentId.through(
        r.parkingAssignmentSlots.assignmentId,
      ),
      to: r.parkingSlots.slotId.through(r.parkingAssignmentSlots.slotId),
    }),
    tenant: r.one.tenants({
      from: r.parkingAssignments.tenantId,
      to: r.tenants.tenantId,
    }),
  },
  parkingSlots: {
    parkingAssignments: r.many.parkingAssignments(),
  },
  tenants: {
    parkingAssignments: r.many.parkingAssignments(),
    vehicles: r.many.vehicles(),
  },
  vehicles: {
    province: r.one.provinces({
      from: r.vehicles.provinceId,
      to: r.provinces.provinceId,
    }),
    tenant: r.one.tenants({
      from: r.vehicles.tenantId,
      to: r.tenants.tenantId,
    }),
    vehicleBrand: r.one.vehicleBrands({
      from: r.vehicles.vehicleBrandId,
      to: r.vehicleBrands.vehicleBrandId,
    }),
    vehicleType: r.one.vehicleTypes({
      from: r.vehicles.vehicleTypeId,
      to: r.vehicleTypes.vehicleTypeId,
    }),
  },
  provinces: {
    vehicles: r.many.vehicles(),
  },
  vehicleBrands: {
    vehicles: r.many.vehicles(),
  },
  vehicleTypes: {
    vehicles: r.many.vehicles(),
  },
}));
