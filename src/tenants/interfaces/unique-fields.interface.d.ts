declare interface TenantUniqueFields {
  phone: string | null;
  lineId: string | null;
}

declare interface ValidateTenantUniqueFieldsParams extends Partial<TenantUniqueFields> {
  excludeTenantId?: string;
}
