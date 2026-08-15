declare interface VehicleUniqueFields {
  licensePlatePrefix: string;
  licensePlateNumber: string;
  provinceId: number;
}

declare interface ValidateVehicleUniqueFieldsParams extends Partial<VehicleUniqueFields> {
  excludeVehicleId?: string;
}
