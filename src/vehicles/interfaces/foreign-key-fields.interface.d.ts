interface VehicleForeignKeyFields {
  tenantId: string;
  provinceId: number;
  vehicleTypeId: number;
  vehicleBrandId: number | null;
}

interface ValidateVehicleForeignKeyFieldsParams extends Partial<VehicleForeignKeyFields> {}
