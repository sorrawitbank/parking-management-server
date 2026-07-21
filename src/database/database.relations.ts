import { relations } from 'drizzle-orm/relations';
import {
  tenants,
  vehicles,
  provinces,
  vehicleTypes,
  vehicleBrands,
  parkingAssignments,
  parkingAssignmentSlots,
  parkingSlots,
} from './database.schemas';

export const vehiclesRelations = relations(vehicles, ({ one }) => ({
  tenant: one(tenants, {
    fields: [vehicles.tenantId],
    references: [tenants.tenantId],
  }),
  province: one(provinces, {
    fields: [vehicles.provinceId],
    references: [provinces.provinceId],
  }),
  vehicleType: one(vehicleTypes, {
    fields: [vehicles.vehicleTypeId],
    references: [vehicleTypes.vehicleTypeId],
  }),
  vehicleBrand: one(vehicleBrands, {
    fields: [vehicles.vehicleBrandId],
    references: [vehicleBrands.vehicleBrandId],
  }),
}));

export const tenantsRelations = relations(tenants, ({ many }) => ({
  vehicles: many(vehicles),
  parkingAssignments: many(parkingAssignments),
}));

export const provincesRelations = relations(provinces, ({ many }) => ({
  vehicles: many(vehicles),
}));

export const vehicleTypesRelations = relations(vehicleTypes, ({ many }) => ({
  vehicles: many(vehicles),
}));

export const vehicleBrandsRelations = relations(vehicleBrands, ({ many }) => ({
  vehicles: many(vehicles),
}));

export const parkingAssignmentsRelations = relations(
  parkingAssignments,
  ({ one, many }) => ({
    tenant: one(tenants, {
      fields: [parkingAssignments.tenantId],
      references: [tenants.tenantId],
    }),
    parkingAssignmentSlots: many(parkingAssignmentSlots),
  }),
);

export const parkingAssignmentSlotsRelations = relations(
  parkingAssignmentSlots,
  ({ one }) => ({
    parkingAssignment: one(parkingAssignments, {
      fields: [parkingAssignmentSlots.assignmentId],
      references: [parkingAssignments.assignmentId],
    }),
    parkingSlot: one(parkingSlots, {
      fields: [parkingAssignmentSlots.slotId],
      references: [parkingSlots.slotId],
    }),
  }),
);

export const parkingSlotsRelations = relations(parkingSlots, ({ many }) => ({
  parkingAssignmentSlots: many(parkingAssignmentSlots),
}));
