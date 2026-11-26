import { defineRelations } from 'drizzle-orm/relations';
import * as schemas from './database.schemas';

export const relations = defineRelations(schemas, (r) => ({
  parkingAssignmentSlots: {
    assignment: r.one.parkingAssignments({
      from: r.parkingAssignmentSlots.assignmentId,
      to: r.parkingAssignments.assignmentId,
      optional: false,
    }),
    slot: r.one.parkingSlots({
      from: r.parkingAssignmentSlots.slotId,
      to: r.parkingSlots.slotId,
      optional: false,
    }),
  },
  parkingAssignmentSlotsWithAssignedDays: {
    assignment: r.one.parkingAssignments({
      from: r.parkingAssignmentSlotsWithAssignedDays.assignmentId,
      to: r.parkingAssignments.assignmentId,
      optional: false,
    }),
    slot: r.one.parkingSlots({
      from: r.parkingAssignmentSlotsWithAssignedDays.slotId,
      to: r.parkingSlots.slotId,
      optional: false,
    }),
  },
  parkingAssignments: {
    assignmentSlots: r.many.parkingAssignmentSlots(),
    assignmentSlotsWithAssignedDays:
      r.many.parkingAssignmentSlotsWithAssignedDays(),
    slots: r.many.parkingSlots({
      from: r.parkingAssignments.assignmentId.through(
        r.parkingAssignmentSlots.assignmentId,
      ),
      to: r.parkingSlots.slotId.through(r.parkingAssignmentSlots.slotId),
    }),
    tenant: r.one.tenants({
      from: r.parkingAssignments.tenantId,
      to: r.tenants.tenantId,
      optional: false,
    }),
  },
  parkingSlots: {
    assignmentSlots: r.many.parkingAssignmentSlots(),
    assignmentSlotsWithAssignedDays:
      r.many.parkingAssignmentSlotsWithAssignedDays(),
    assignments: r.many.parkingAssignments(),
  },
  tenants: {
    assignments: r.many.parkingAssignments(),
    vehicles: r.many.vehicles(),
  },
  vehicles: {
    province: r.one.provinces({
      from: r.vehicles.provinceId,
      to: r.provinces.provinceId,
      optional: false,
    }),
    tenant: r.one.tenants({
      from: r.vehicles.tenantId,
      to: r.tenants.tenantId,
      optional: false,
    }),
    vehicleBrand: r.one.vehicleBrands({
      from: r.vehicles.vehicleBrandId,
      to: r.vehicleBrands.vehicleBrandId,
      optional: true,
    }),
    vehicleType: r.one.vehicleTypes({
      from: r.vehicles.vehicleTypeId,
      to: r.vehicleTypes.vehicleTypeId,
      optional: false,
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
