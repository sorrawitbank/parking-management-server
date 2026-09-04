interface VehicleUniqueFields {
  licensePlatePrefix: string;
  licensePlateNumber: string;
  provinceId: number;
}

interface ValidateVehicleUniqueFieldsParams extends Partial<VehicleUniqueFields> {
  excludeVehicleId?: string;
}
