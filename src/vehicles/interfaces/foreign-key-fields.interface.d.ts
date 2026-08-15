declare interface VehicleForeignKeyFields {
  tenantId: string;
  provinceId: number;
  vehicleTypeId: number;
  vehicleBrandId: number | null;
}

declare interface ValidateVehicleForeignKeyFieldsParams extends Partial<VehicleForeignKeyFields> {}
