import {
  bigint,
  boolean,
  char,
  check,
  date,
  foreignKey,
  integer,
  numeric,
  pgEnum,
  pgTable,
  pgView,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { int4range } from './customs/int4range';

export const userRole = pgEnum('user_role', ['user', 'admin']);

export const users = pgTable(
  'users',
  {
    userId: uuid('user_id').primaryKey().notNull(),
    role: userRole().default('user').notNull(),
    email: text().notNull(),
    phone: varchar({ length: 10 }).notNull(),
    firstName: varchar('first_name', { length: 100 }).notNull(),
    lastName: varchar('last_name', { length: 100 }).notNull(),
    nickName: varchar('nick_name', { length: 100 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    unique('users_email_uq').on(table.email),
    unique('users_phone_uq').on(table.phone),
    unique('users_first_last_name_uq').on(table.lastName, table.firstName),
    check(
      'users_email_ck',
      sql`email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'::text`,
    ),
    check('users_phone_ck', sql`(phone)::text ~ '^0[1-9]{1}\d{7,8}$'::text`),
    check('users_first_name_ck', sql`length(TRIM(BOTH FROM first_name)) >= 2`),
    check('users_last_name_ck', sql`length(TRIM(BOTH FROM last_name)) >= 2`),
    check('users_nick_name_ck', sql`length(TRIM(BOTH FROM nick_name)) >= 2`),
  ],
);

export const tenants = pgTable(
  'tenants',
  {
    tenantId: uuid('tenant_id')
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    name: varchar({ length: 100 }).notNull(),
    phone: varchar({ length: 10 }),
    lineId: varchar('line_id', { length: 20 }),
    note: varchar({ length: 500 }),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    unique('tenants_phone_uq').on(table.phone),
    unique('tenants_line_id_uq').on(table.lineId),
    check('tenants_name_ck', sql`length(TRIM(BOTH FROM name)) >= 2`),
    check(
      'tenants_phone_ck',
      sql`(phone IS NULL) OR ((phone)::text ~ '^0[1-9]{1}\d{7,8}$'::text)`,
    ),
    check(
      'tenants_line_id_ck',
      sql`(line_id IS NULL) OR ((line_id)::text ~ '^[a-z0-9._-]{4,20}$'::text)`,
    ),
    check(
      'tenants_note_ck',
      sql`(note IS NULL) OR (length(TRIM(BOTH FROM note)) > 0)`,
    ),
  ],
);

export const provinces = pgTable(
  'provinces',
  {
    provinceId: integer('province_id').primaryKey().notNull(),
    nameTh: varchar('name_th', { length: 120 }).notNull(),
    nameEn: varchar('name_en', { length: 120 }).notNull(),
  },
  (table) => [
    unique('provinces_name_th_uq').on(table.nameTh),
    unique('provinces_name_en_uq').on(table.nameEn),
    check('provinces_name_th_ck', sql`length(TRIM(BOTH FROM name_th)) >= 2`),
    check('provinces_name_en_ck', sql`length(TRIM(BOTH FROM name_en)) >= 2`),
  ],
);

export const vehicleTypes = pgTable(
  'vehicle_types',
  {
    vehicleTypeId: integer('vehicle_type_id')
      .primaryKey()
      .generatedAlwaysAsIdentity({
        name: 'vehicle_types_vehicle_type_id_seq',
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 2147483647,
        cache: 1,
      }),
    nameTh: varchar('name_th', { length: 20 }).notNull(),
    nameEn: varchar('name_en', { length: 20 }).notNull(),
  },
  (table) => [
    unique('vehicle_types_name_th_uq').on(table.nameTh),
    unique('vehicle_types_name_en_uq').on(table.nameEn),
    check(
      'vehicle_types_name_th_ck',
      sql`length(TRIM(BOTH FROM name_th)) >= 2`,
    ),
    check(
      'vehicle_types_name_en_ck',
      sql`length(TRIM(BOTH FROM name_en)) >= 2`,
    ),
  ],
);

export const vehicleBrands = pgTable(
  'vehicle_brands',
  {
    vehicleBrandId: integer('vehicle_brand_id')
      .primaryKey()
      .generatedAlwaysAsIdentity({
        name: 'vehicle_brands_vehicle_brand_id_seq',
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 2147483647,
        cache: 1,
      }),
    nameTh: varchar('name_th', { length: 100 }).notNull(),
    nameEn: varchar('name_en', { length: 100 }).notNull(),
  },
  (table) => [
    unique('vehicle_brands_name_th_uq').on(table.nameTh),
    unique('vehicle_brands_name_en_uq').on(table.nameEn),
    check(
      'vehicle_brands_name_th_ck',
      sql`length(TRIM(BOTH FROM name_th)) >= 2`,
    ),
    check(
      'vehicle_brands_name_en_ck',
      sql`length(TRIM(BOTH FROM name_en)) >= 2`,
    ),
  ],
);

export const vehicles = pgTable(
  'vehicles',
  {
    vehicleId: uuid('vehicle_id')
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    tenantId: uuid('tenant_id').notNull(),
    licensePlatePrefix: varchar('license_plate_prefix', {
      length: 10,
    }).notNull(),
    licensePlateNumber: varchar('license_plate_number', {
      length: 10,
    }).notNull(),
    provinceId: integer('province_id').notNull(),
    vehicleTypeId: integer('vehicle_type_id').notNull(),
    vehicleBrandId: integer('vehicle_brand_id'),
    note: varchar({ length: 500 }),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.tenantId],
      foreignColumns: [tenants.tenantId],
      name: 'vehicles_tenants_fk',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    foreignKey({
      columns: [table.provinceId],
      foreignColumns: [provinces.provinceId],
      name: 'vehicles_provinces_fk',
    })
      .onUpdate('cascade')
      .onDelete('restrict'),
    foreignKey({
      columns: [table.vehicleTypeId],
      foreignColumns: [vehicleTypes.vehicleTypeId],
      name: 'vehicles_vehicle_types_fk',
    })
      .onUpdate('cascade')
      .onDelete('restrict'),
    foreignKey({
      columns: [table.vehicleBrandId],
      foreignColumns: [vehicleBrands.vehicleBrandId],
      name: 'vehicles_vehicle_brands_fk',
    })
      .onUpdate('cascade')
      .onDelete('set null'),
    unique('vehicles_license_plate_uq').on(
      table.provinceId,
      table.licensePlatePrefix,
      table.licensePlateNumber,
    ),
    check(
      'vehicles_license_plate_prefix_ck',
      sql`(license_plate_prefix)::text ~ '^\S+$'::text`,
    ),
    check(
      'vehicles_license_plate_number_ck',
      sql`(license_plate_number)::text ~ '^\d+$'::text`,
    ),
    check(
      'vehicles_note_ck',
      sql`(note IS NULL) OR (length(TRIM(BOTH FROM note)) > 0)`,
    ),
  ],
);

export const parkingSlots = pgTable(
  'parking_slots',
  {
    slotId: uuid('slot_id')
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    slotNo: integer('slot_no').notNull(),
    slotCode: varchar('slot_code', { length: 8 }).notNull(),
    positionLeft: integer('position_left').notNull(),
    positionTop: integer('position_top').notNull(),
    width: integer().default(1).notNull(),
    height: integer().default(1).notNull(),
    isUnavailable: boolean('is_unavailable').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    unique('parking_slots_slot_no_uq').on(table.slotNo),
    unique('parking_slots_slot_code_uq').on(table.slotCode),
    check('parking_slots_slot_no_ck', sql`slot_no > 0`),
    check(
      'parking_slots_slot_code_ck',
      sql`(slot_code)::text ~ '^[A-Z0-9]+$'::text`,
    ),
    check('parking_slots_x_axis_ck', sql`(position_left >= 0) AND (width > 0)`),
    check('parking_slots_y_axis_ck', sql`(position_top >= 0) AND (height > 0)`),
  ],
);

export const parkingSlotStatuses = pgTable(
  'parking_slot_statuses',
  {
    slotStatusId: integer('slot_status_id').primaryKey().notNull(),
    nameTh: varchar('name_th', { length: 100 }).notNull(),
    nameEn: varchar('name_en', { length: 100 }).notNull(),
    backgroundColorLight: char('background_color_light', {
      length: 7,
    }).notNull(),
    backgroundColorDark: char('background_color_dark', { length: 7 }).notNull(),
    textColorLight: char('text_color_light', { length: 7 }).notNull(),
    textColorDark: char('text_color_dark', { length: 7 }).notNull(),
  },
  (table) => [
    unique('parking_slot_statuses_name_th_uq').on(table.nameTh),
    unique('parking_slot_statuses_name_en_uq').on(table.nameEn),
    check(
      'parking_slot_statuses_name_th_ck',
      sql`length(TRIM(BOTH FROM name_th)) >= 2`,
    ),
    check(
      'parking_slot_statuses_name_en_ck',
      sql`length(TRIM(BOTH FROM name_en)) >= 2`,
    ),
    check(
      'parking_slot_statuses_background_color_light_ck',
      sql`background_color_light ~ '^#[A-F0-9]{6}$'::text`,
    ),
    check(
      'parking_slot_statuses_background_color_dark_ck',
      sql`background_color_dark ~ '^#[A-F0-9]{6}$'::text`,
    ),
    check(
      'parking_slot_statuses_text_color_light_ck',
      sql`text_color_light ~ '^#[A-F0-9]{6}$'::text`,
    ),
    check(
      'parking_slot_statuses_text_color_dark_ck',
      sql`text_color_dark ~ '^#[A-F0-9]{6}$'::text`,
    ),
  ],
);

export const parkingAssignments = pgTable(
  'parking_assignments',
  {
    assignmentId: bigint('assignment_id', { mode: 'bigint' })
      .primaryKey()
      .generatedAlwaysAsIdentity({
        name: 'parking_assignments_assignment_id_seq',
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    tenantId: uuid('tenant_id').notNull(),
    paidUntilMonth: date('paid_until_month').notNull(),
    monthlyFee: numeric('monthly_fee', { precision: 6, scale: 2 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.tenantId],
      foreignColumns: [tenants.tenantId],
      name: 'parking_assignments_tenants_fk',
    })
      .onUpdate('cascade')
      .onDelete('restrict'),
    check(
      'parking_assignments_paid_until_month_ck',
      sql`paid_until_month = (((date_trunc('month'::text, (paid_until_month)::timestamp with time zone) + '1 mon'::interval) - '1 day'::interval))::date`,
    ),
    check(
      'parking_assignments_monthly_fee_ck',
      sql`monthly_fee >= (0)::numeric`,
    ),
  ],
);

export const parkingAssignmentStatuses = pgTable(
  'parking_assignment_statuses',
  {
    assignmentStatusId: integer('assignment_status_id').primaryKey().notNull(),
    nameTh: varchar('name_th', { length: 100 }).notNull(),
    nameEn: varchar('name_en', { length: 100 }).notNull(),
    backgroundColorLight: char('background_color_light', {
      length: 7,
    }).notNull(),
    backgroundColorDark: char('background_color_dark', { length: 7 }).notNull(),
    textColorLight: char('text_color_light', { length: 7 }).notNull(),
    textColorDark: char('text_color_dark', { length: 7 }).notNull(),
    monthDiffRange: int4range('month_diff_range').notNull(),
  },
  (table) => [
    unique('parking_assignment_statuses_name_th_uq').on(table.nameTh),
    unique('parking_assignment_statuses_name_en_uq').on(table.nameEn),
    check(
      'parking_assignment_statuses_name_th_ck',
      sql`length(TRIM(BOTH FROM name_th)) >= 2`,
    ),
    check(
      'parking_assignment_statuses_name_en_ck',
      sql`length(TRIM(BOTH FROM name_en)) >= 2`,
    ),
    check(
      'parking_assignment_statuses_background_color_light_ck',
      sql`background_color_light ~ '^#[A-F0-9]{6}$'::text`,
    ),
    check(
      'parking_assignment_statuses_background_color_dark_ck',
      sql`background_color_dark ~ '^#[A-F0-9]{6}$'::text`,
    ),
    check(
      'parking_assignment_statuses_text_color_light_ck',
      sql`text_color_light ~ '^#[A-F0-9]{6}$'::text`,
    ),
    check(
      'parking_assignment_statuses_text_color_dark_ck',
      sql`text_color_dark ~ '^#[A-F0-9]{6}$'::text`,
    ),
  ],
);

export const parkingAssignmentSlots = pgTable(
  'parking_assignment_slots',
  {
    assignmentSlotId: bigint('assignment_slot_id', { mode: 'bigint' })
      .primaryKey()
      .generatedAlwaysAsIdentity({
        name: 'parking_assignment_slots_assignment_slot_id_seq',
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    assignmentId: bigint('assignment_id', { mode: 'bigint' }).notNull(),
    slotId: uuid('slot_id').notNull(),
    assignedDate: date('assigned_date').notNull(),
    endedDate: date('ended_date'),
    isActive: boolean('is_active').default(true).notNull(),
  },
  (table) => [
    uniqueIndex('parking_assignment_slots_slot_id_active_uq')
      .using('btree', table.slotId.asc().nullsLast().op('uuid_ops'))
      .where(sql`(is_active = true)`),
    foreignKey({
      columns: [table.assignmentId],
      foreignColumns: [parkingAssignments.assignmentId],
      name: 'parking_assignment_slots_parking_assignments_fk',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    foreignKey({
      columns: [table.slotId],
      foreignColumns: [parkingSlots.slotId],
      name: 'parking_assignment_slots_parking_slots_fk',
    })
      .onUpdate('cascade')
      .onDelete('restrict'),
    check(
      'parking_assignment_slots_date_range_ck',
      sql`(ended_date IS NULL) OR (ended_date >= assigned_date)`,
    ),
    check(
      'parking_assignment_slots_is_active_ended_date_ck',
      sql`((is_active = true) AND (ended_date IS NULL)) OR ((is_active = false) AND (ended_date IS NOT NULL))`,
    ),
  ],
);

export const parkingSlotsWithStatus = pgView('parking_slots_with_status', {
  slotId: uuid('slot_id')
    .default(sql`uuid_generate_v4()`)
    .primaryKey()
    .notNull(),
  slotNo: integer('slot_no').notNull(),
  slotCode: varchar('slot_code', { length: 8 }).notNull(),
  positionLeft: integer('position_left').notNull(),
  positionTop: integer('position_top').notNull(),
  width: integer().default(1).notNull(),
  height: integer().default(1).notNull(),
  isUnavailable: boolean('is_unavailable').default(false).notNull(),
  slotStatusId: integer('slot_status_id').notNull(),
  statusTh: varchar('status_th', { length: 100 }).notNull(),
  statusEn: varchar('status_en', { length: 100 }).notNull(),
  backgroundColorLight: char('background_color_light', { length: 7 }).notNull(),
  backgroundColorDark: char('background_color_dark', { length: 7 }).notNull(),
  textColorLight: char('text_color_light', { length: 7 }).notNull(),
  textColorDark: char('text_color_dark', { length: 7 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
}).as(
  sql`SELECT ps.slot_id, ps.slot_no, ps.slot_code, ps.position_left, ps.position_top, ps.width, ps.height, ps.is_unavailable, psst.slot_status_id, psst.name_th AS status_th, psst.name_en AS status_en, psst.background_color_light, psst.background_color_dark, psst.text_color_light, psst.text_color_dark, ps.created_at, ps.updated_at FROM parking_slots ps JOIN parking_slot_statuses psst ON psst.slot_status_id = CASE WHEN (EXISTS ( SELECT 1 FROM parking_assignment_slots pas WHERE pas.is_active AND pas.slot_id = ps.slot_id)) THEN 2 WHEN NOT ps.is_unavailable THEN 1 ELSE 3 END`,
);

export const parkingAssignmentSlotsWithAssignedDays = pgView(
  'parking_assignment_slots_with_assigned_days',
  {
    assignmentSlotId: bigint('assignment_slot_id', { mode: 'bigint' })
      .primaryKey()
      .generatedAlwaysAsIdentity({
        name: 'parking_assignment_slots_assignment_slot_id_seq',
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    assignmentId: bigint('assignment_id', { mode: 'bigint' }).notNull(),
    slotId: uuid('slot_id').notNull(),
    assignedDate: date('assigned_date').notNull(),
    endedDate: date('ended_date'),
    assignedDays: integer('assigned_days').notNull(),
    isActive: boolean('is_active').default(true).notNull(),
  },
).as(
  sql`SELECT assignment_slot_id, assignment_id, slot_id, assigned_date, ended_date, COALESCE(ended_date, CURRENT_DATE) - assigned_date + 1 AS assigned_days, is_active FROM parking_assignment_slots pas`,
);

export const parkingAssignmentsWithStats = pgView(
  'parking_assignments_with_stats',
  {
    assignmentId: bigint('assignment_id', { mode: 'bigint' })
      .primaryKey()
      .generatedAlwaysAsIdentity({
        name: 'parking_assignments_assignment_id_seq',
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    tenantId: uuid('tenant_id').notNull(),
    paidUntilMonth: date('paid_until_month').notNull(),
    monthlyFee: numeric('monthly_fee', { precision: 6, scale: 2 }).notNull(),
    assignedDate: date('assigned_date').notNull(),
    endedDate: date('ended_date'),
    assignedDays: integer('assigned_days').notNull(),
    isActive: boolean('is_active').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
).as(
  sql`SELECT pa.assignment_id, pa.tenant_id, pa.paid_until_month, pa.monthly_fee, assignment_stats.assigned_date, assignment_stats.ended_date, assignment_stats.assigned_days, assignment_stats.is_active, pa.created_at, pa.updated_at FROM parking_assignments pa JOIN ( SELECT pas.assignment_id, min(pas.assigned_date) AS assigned_date, CASE WHEN bool_or(pas.is_active) THEN NULL::date ELSE max(pas.ended_date) END AS ended_date, sum(pas.assigned_days)::integer AS assigned_days, bool_or(pas.is_active) AS is_active FROM parking_assignment_slots_with_assigned_days pas GROUP BY pas.assignment_id) assignment_stats ON assignment_stats.assignment_id = pa.assignment_id`,
);

export const activeParkingAssignments = pgView('active_parking_assignments', {
  assignmentId: bigint('assignment_id', { mode: 'bigint' })
    .primaryKey()
    .generatedAlwaysAsIdentity({
      name: 'parking_assignments_assignment_id_seq',
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 9223372036854775807,
      cache: 1,
    }),
  slotId: uuid('slot_id').notNull(),
  paidUntilMonth: date('paid_until_month').notNull(),
  monthlyFee: numeric('monthly_fee', { precision: 6, scale: 2 }).notNull(),
  assignmentStatusId: integer('assignment_status_id').notNull(),
  statusTh: varchar('status_th', { length: 100 }).notNull(),
  statusEn: varchar('status_en', { length: 100 }).notNull(),
  backgroundColorLight: char('background_color_light', { length: 7 }).notNull(),
  backgroundColorDark: char('background_color_dark', { length: 7 }).notNull(),
  textColorLight: char('text_color_light', { length: 7 }).notNull(),
  textColorDark: char('text_color_dark', { length: 7 }).notNull(),
  assignedDate: date('assigned_date').notNull(),
  assignedDays: integer('assigned_days').notNull(),
  tenantId: uuid('tenant_id').notNull(),
  name: varchar({ length: 100 }).notNull(),
  phone: varchar({ length: 10 }),
  lineId: varchar('line_id', { length: 20 }),
  note: varchar({ length: 500 }),
}).as(
  sql`SELECT pa.assignment_id, pas.slot_id, pa.paid_until_month, pa.monthly_fee, past.assignment_status_id, past.name_th AS status_th, past.name_en AS status_en, past.background_color_light, past.background_color_dark, past.text_color_light, past.text_color_dark, pa.assigned_date, pa.assigned_days, t.tenant_id, t.name, t.phone, t.line_id, t.note FROM parking_assignments_with_stats pa JOIN parking_assignment_slots pas ON pas.is_active AND pas.assignment_id = pa.assignment_id JOIN parking_assignment_statuses past ON past.month_diff_range @> (12::numeric * EXTRACT(year FROM age(pa.paid_until_month::timestamp with time zone, CURRENT_DATE::timestamp with time zone)) + EXTRACT(month FROM age(pa.paid_until_month::timestamp with time zone, CURRENT_DATE::timestamp with time zone)))::integer JOIN tenants t ON t.tenant_id = pa.tenant_id`,
);

export const rentingTenants = pgView('renting_tenants', {
  tenantId: uuid('tenant_id')
    .default(sql`uuid_generate_v4()`)
    .primaryKey()
    .notNull(),
  name: varchar({ length: 100 }).notNull(),
  phone: varchar({ length: 10 }),
  lineId: varchar('line_id', { length: 20 }),
  note: varchar({ length: 500 }),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
}).as(
  sql`SELECT tenant_id, name, phone, line_id, note, created_at, updated_at FROM tenants t WHERE (EXISTS ( SELECT 1 FROM parking_assignments_with_stats pawst WHERE pawst.is_active AND pawst.tenant_id = t.tenant_id))`,
);
