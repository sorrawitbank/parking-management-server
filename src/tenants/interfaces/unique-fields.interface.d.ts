interface TenantUniqueFields {
  phone: string | null;
  lineId: string | null;
}

interface ValidateTenantUniqueFieldsParams extends Partial<TenantUniqueFields> {
  excludeTenantId?: string;
}
