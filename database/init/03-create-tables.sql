CREATE TABLE IF NOT EXISTS users (
    user_id UUID,
    role user_role NOT NULL DEFAULT 'user',
    email TEXT NOT NULL,
    phone VARCHAR(10) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    nick_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_pk PRIMARY KEY (user_id),
    CONSTRAINT users_email_uq UNIQUE (email),
    CONSTRAINT users_email_ck CHECK (
        email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    ),
    CONSTRAINT users_phone_uq UNIQUE (phone),
    CONSTRAINT users_phone_ck CHECK (phone ~ '^0[1-9]{1}\d{7,8}$'),
    CONSTRAINT users_first_last_name_uq UNIQUE (first_name, last_name),
    CONSTRAINT users_first_name_ck CHECK (LENGTH(TRIM(first_name)) >= 2),
    CONSTRAINT users_last_name_ck CHECK (LENGTH(TRIM(last_name)) >= 2),
    CONSTRAINT users_nick_name_ck CHECK (LENGTH(TRIM(nick_name)) >= 2)
);

CREATE TABLE IF NOT EXISTS tenants (
    tenant_id UUID DEFAULT uuid_generate_v4 (),
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(10),
    line_id VARCHAR(20),
    note VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tenants_pk PRIMARY KEY (tenant_id),
    CONSTRAINT tenants_name_ck CHECK (LENGTH(TRIM(name)) >= 2),
    CONSTRAINT tenants_phone_uq UNIQUE (phone),
    CONSTRAINT tenants_phone_ck CHECK (
        phone IS NULL
        OR phone ~ '^0[1-9]{1}\d{7,8}$'
    ),
    CONSTRAINT tenants_line_id_uq UNIQUE (line_id),
    CONSTRAINT tenants_line_id_ck CHECK (
        line_id IS NULL
        OR line_id ~ '^[a-z0-9._-]{4,20}$'
    ),
    CONSTRAINT tenants_note_ck CHECK (
        note IS NULL
        OR LENGTH(TRIM(note)) > 0
    )
);

CREATE TABLE IF NOT EXISTS provinces (
    province_id INTEGER,
    name_th VARCHAR(120) NOT NULL,
    name_en VARCHAR(120) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT provinces_pk PRIMARY KEY (province_id),
    CONSTRAINT provinces_name_th_uq UNIQUE (name_th),
    CONSTRAINT provinces_name_th_ck CHECK (LENGTH(TRIM(name_th)) >= 2),
    CONSTRAINT provinces_name_en_uq UNIQUE (name_en),
    CONSTRAINT provinces_name_en_ck CHECK (LENGTH(TRIM(name_en)) >= 2)
);

CREATE TABLE IF NOT EXISTS vehicle_types (
    vehicle_type_id INTEGER GENERATED ALWAYS AS IDENTITY,
    name_th VARCHAR(20) NOT NULL,
    name_en VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT vehicle_types_pk PRIMARY KEY (vehicle_type_id),
    CONSTRAINT vehicle_types_name_th_uq UNIQUE (name_th),
    CONSTRAINT vehicle_types_name_th_ck CHECK (LENGTH(TRIM(name_th)) >= 2),
    CONSTRAINT vehicle_types_name_en_uq UNIQUE (name_en),
    CONSTRAINT vehicle_types_name_en_ck CHECK (LENGTH(TRIM(name_en)) >= 2)
);

CREATE TABLE IF NOT EXISTS vehicle_brands (
    vehicle_brand_id INTEGER GENERATED ALWAYS AS IDENTITY,
    name_th VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT vehicle_brands_pk PRIMARY KEY (vehicle_brand_id),
    CONSTRAINT vehicle_brands_name_th_uq UNIQUE (name_th),
    CONSTRAINT vehicle_brands_name_th_ck CHECK (LENGTH(TRIM(name_th)) >= 2),
    CONSTRAINT vehicle_brands_name_en_uq UNIQUE (name_en),
    CONSTRAINT vehicle_brands_name_en_ck CHECK (LENGTH(TRIM(name_en)) >= 2)
);

CREATE TABLE IF NOT EXISTS vehicles (
    vehicle_id UUID DEFAULT uuid_generate_v4 (),
    tenant_id UUID NOT NULL,
    license_plate_prefix VARCHAR(10) NOT NULL,
    license_plate_number VARCHAR(10) NOT NULL,
    province_id INTEGER NOT NULL,
    vehicle_type_id INTEGER NOT NULL,
    vehicle_brand_id INTEGER,
    note VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT vehicles_pk PRIMARY KEY (vehicle_id),
    CONSTRAINT vehicles_tenants_fk FOREIGN KEY (tenant_id) REFERENCES tenants (tenant_id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT vehicles_provinces_fk FOREIGN KEY (province_id) REFERENCES provinces (province_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT vehicles_license_plate_uq UNIQUE (
        license_plate_prefix,
        license_plate_number,
        province_id
    ),
    CONSTRAINT vehicles_license_plate_prefix_ck CHECK (license_plate_prefix ~ '^\S+$'),
    CONSTRAINT vehicles_license_plate_number_ck CHECK (license_plate_number ~ '^\d+$'),
    CONSTRAINT vehicles_vehicle_types_fk FOREIGN KEY (vehicle_type_id) REFERENCES vehicle_types (vehicle_type_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT vehicles_vehicle_brands_fk FOREIGN KEY (vehicle_brand_id) REFERENCES vehicle_brands (vehicle_brand_id) ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT vehicles_note_ck CHECK (
        note IS NULL
        OR LENGTH(TRIM(note)) > 0
    )
);

CREATE TABLE IF NOT EXISTS parking_slots (
    slot_id UUID DEFAULT uuid_generate_v4 (),
    slot_no INTEGER NOT NULL,
    slot_code VARCHAR(8) NOT NULL,
    position_left INTEGER NOT NULL,
    position_top INTEGER NOT NULL,
    width INTEGER NOT NULL DEFAULT 1,
    height INTEGER NOT NULL DEFAULT 1,
    is_unavailable BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT parking_slots_pk PRIMARY KEY (slot_id),
    CONSTRAINT parking_slots_slot_no_uq UNIQUE (slot_no),
    CONSTRAINT parking_slots_slot_no_ck CHECK (slot_no > 0),
    CONSTRAINT parking_slots_slot_code_uq UNIQUE (slot_code),
    CONSTRAINT parking_slots_slot_code_ck CHECK (slot_code ~ '^[A-Z0-9]+$'),
    CONSTRAINT parking_slots_x_axis_ck CHECK (
        position_left >= 0
        AND width > 0
    ),
    CONSTRAINT parking_slots_y_axis_ck CHECK (
        position_top >= 0
        AND height > 0
    ),
    CONSTRAINT parking_slots_position_ex EXCLUDE USING gist (
        int4range(position_left, position_left + width, '[)') WITH &&,
        int4range(position_top, position_top + height, '[)') WITH &&
    )
);

CREATE TABLE IF NOT EXISTS parking_slot_statuses (
    slot_status_id INTEGER,
    name_th VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    background_color_light CHAR(7) NOT NULL,
    background_color_dark CHAR(7) NOT NULL,
    text_color_light CHAR(7) NOT NULL,
    text_color_dark CHAR(7) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT parking_slot_statuses_pk PRIMARY KEY (slot_status_id),
    CONSTRAINT parking_slot_statuses_name_th_uq UNIQUE (name_th),
    CONSTRAINT parking_slot_statuses_name_th_ck CHECK (LENGTH(TRIM(name_th)) >= 2),
    CONSTRAINT parking_slot_statuses_name_en_uq UNIQUE (name_en),
    CONSTRAINT parking_slot_statuses_name_en_ck CHECK (LENGTH(TRIM(name_en)) >= 2),
    CONSTRAINT parking_slot_statuses_background_color_light_ck CHECK (background_color_light ~ '^#[A-F0-9]{6}$'),
    CONSTRAINT parking_slot_statuses_background_color_dark_ck CHECK (background_color_dark ~ '^#[A-F0-9]{6}$'),
    CONSTRAINT parking_slot_statuses_text_color_light_ck CHECK (text_color_light ~ '^#[A-F0-9]{6}$'),
    CONSTRAINT parking_slot_statuses_text_color_dark_ck CHECK (text_color_dark ~ '^#[A-F0-9]{6}$')
);

CREATE TABLE IF NOT EXISTS parking_assignments (
    assignment_id INTEGER GENERATED ALWAYS AS IDENTITY,
    tenant_id UUID NOT NULL,
    paid_until_month DATE NOT NULL,
    monthly_fee NUMERIC(6, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT parking_assignments_pk PRIMARY KEY (assignment_id),
    CONSTRAINT parking_assignments_tenants_fk FOREIGN KEY (tenant_id) REFERENCES tenants (tenant_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT parking_assignments_paid_until_month_ck CHECK (
        (
            DATE_TRUNC('month', paid_until_month) + INTERVAL '1 month' - INTERVAL '1 day'
        ) = paid_until_month
    ),
    CONSTRAINT parking_assignments_monthly_fee_ck CHECK (monthly_fee >= 0)
);

CREATE TABLE IF NOT EXISTS parking_assignment_statuses (
    assignment_status_id INTEGER,
    name_th VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    background_color_light CHAR(7) NOT NULL,
    background_color_dark CHAR(7) NOT NULL,
    text_color_light CHAR(7) NOT NULL,
    text_color_dark CHAR(7) NOT NULL,
    month_diff_range INT4RANGE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT parking_assignment_statuses_pk PRIMARY KEY (assignment_status_id),
    CONSTRAINT parking_assignment_statuses_name_th_uq UNIQUE (name_th),
    CONSTRAINT parking_assignment_statuses_name_th_ck CHECK (LENGTH(TRIM(name_th)) >= 2),
    CONSTRAINT parking_assignment_statuses_name_en_uq UNIQUE (name_en),
    CONSTRAINT parking_assignment_statuses_name_en_ck CHECK (LENGTH(TRIM(name_en)) >= 2),
    CONSTRAINT parking_assignment_statuses_background_color_light_ck CHECK (background_color_light ~ '^#[A-F0-9]{6}$'),
    CONSTRAINT parking_assignment_statuses_background_color_dark_ck CHECK (background_color_dark ~ '^#[A-F0-9]{6}$'),
    CONSTRAINT parking_assignment_statuses_text_color_light_ck CHECK (text_color_light ~ '^#[A-F0-9]{6}$'),
    CONSTRAINT parking_assignment_statuses_text_color_dark_ck CHECK (text_color_dark ~ '^#[A-F0-9]{6}$'),
    CONSTRAINT parking_assignment_statuses_month_diff_range_ex EXCLUDE USING gist (month_diff_range WITH &&)
);

CREATE TABLE IF NOT EXISTS parking_assignment_slots (
    assignment_slot_id INTEGER GENERATED ALWAYS AS IDENTITY,
    assignment_id INTEGER NOT NULL,
    slot_id UUID NOT NULL,
    assigned_date DATE NOT NULL,
    ended_date DATE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT parking_assignment_slots_pk PRIMARY KEY (assignment_slot_id),
    CONSTRAINT parking_assignment_slots_parking_assignments_fk FOREIGN KEY (assignment_id) REFERENCES parking_assignments (assignment_id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT parking_assignment_slots_parking_slots_fk FOREIGN KEY (slot_id) REFERENCES parking_slots (slot_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT parking_assignment_slots_date_range_ck CHECK (
        ended_date IS NULL
        OR ended_date >= assigned_date
    ),
    CONSTRAINT parking_assignment_slots_assignment_id_assigned_ended_date_ex EXCLUDE USING gist (
        assignment_id WITH =,
        daterange(
            assigned_date,
            COALESCE(ended_date, 'infinity'::DATE),
            '[)'
        ) WITH &&
    ),
    CONSTRAINT parking_assignment_slots_slot_id_assigned_ended_date_ex EXCLUDE USING gist (
        slot_id WITH =,
        daterange(
            assigned_date,
            COALESCE(ended_date, 'infinity'::DATE),
            '[)'
        ) WITH &&
    ),
    CONSTRAINT parking_assignment_slots_is_active_ended_date_ck CHECK (
        (
            is_active = TRUE
            AND ended_date IS NULL
        )
        OR (
            is_active = FALSE
            AND ended_date IS NOT NULL
        )
    )
);