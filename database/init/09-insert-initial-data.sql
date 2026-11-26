INSERT INTO
    tenants (name, phone, line_id, note)
VALUES
    ('สมชาย', '0987654321', NULL, NULL),
    ('สมหญิง', NULL, 'goodgirl', NULL),
    ('วิชัย', '0812345678', 'wichai', NULL),
    ('นภา', '0923456789', NULL, NULL),
    ('ประเสริฐ', NULL, 'prasert.99', NULL);

INSERT INTO
    vehicles (
        tenant_id,
        license_plate_prefix,
        license_plate_number,
        province_id,
        vehicle_type_id,
        vehicle_brand_id,
        note
    )
VALUES
    (
        (
            SELECT
                tenant_id
            FROM
                tenants
            WHERE
                name = 'สมชาย'
        ),
        'กก',
        '1234',
        10,
        1,
        1,
        NULL
    ),
    (
        (
            SELECT
                tenant_id
            FROM
                tenants
            WHERE
                name = 'สมชาย'
        ),
        '1กก',
        '5678',
        12,
        2,
        2,
        NULL
    ),
    (
        (
            SELECT
                tenant_id
            FROM
                tenants
            WHERE
                name = 'สมหญิง'
        ),
        'ขข',
        '2345',
        11,
        1,
        4,
        NULL
    ),
    (
        (
            SELECT
                tenant_id
            FROM
                tenants
            WHERE
                name = 'สมหญิง'
        ),
        '2ขข',
        '8901',
        13,
        2,
        2,
        NULL
    ),
    (
        (
            SELECT
                tenant_id
            FROM
                tenants
            WHERE
                name = 'วิชัย'
        ),
        'งง',
        '3456',
        20,
        1,
        6,
        NULL
    ),
    (
        (
            SELECT
                tenant_id
            FROM
                tenants
            WHERE
                name = 'วิชัย'
        ),
        '3งง',
        '1122',
        50,
        2,
        8,
        NULL
    ),
    (
        (
            SELECT
                tenant_id
            FROM
                tenants
            WHERE
                name = 'นภา'
        ),
        'จจ',
        '4567',
        83,
        1,
        5,
        NULL
    ),
    (
        (
            SELECT
                tenant_id
            FROM
                tenants
            WHERE
                name = 'นภา'
        ),
        '4จจ',
        '2233',
        90,
        2,
        2,
        NULL
    ),
    (
        (
            SELECT
                tenant_id
            FROM
                tenants
            WHERE
                name = 'ประเสริฐ'
        ),
        'ฉฉ',
        '5678',
        73,
        1,
        9,
        NULL
    ),
    (
        (
            SELECT
                tenant_id
            FROM
                tenants
            WHERE
                name = 'ประเสริฐ'
        ),
        '5ฉฉ',
        '3344',
        14,
        2,
        8,
        NULL
    );

INSERT INTO
    parking_assignments (tenant_id, paid_until_month, monthly_fee)
VALUES
    (
        (
            SELECT
                tenant_id
            FROM
                tenants
            WHERE
                name = 'สมชาย'
        ),
        DATE_TRUNC ('month', CURRENT_DATE) + INTERVAL '2 month' - INTERVAL '1 day',
        1000
    ),
    (
        (
            SELECT
                tenant_id
            FROM
                tenants
            WHERE
                name = 'สมหญิง'
        ),
        DATE_TRUNC ('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day',
        1000
    ),
    (
        (
            SELECT
                tenant_id
            FROM
                tenants
            WHERE
                name = 'วิชัย'
        ),
        DATE_TRUNC ('month', CURRENT_DATE) - INTERVAL '1 day',
        1000
    ),
    (
        (
            SELECT
                tenant_id
            FROM
                tenants
            WHERE
                name = 'วิชัย'
        ),
        DATE_TRUNC ('month', CURRENT_DATE) - INTERVAL '1 month' - INTERVAL '1 day',
        1000
    ),
    (
        (
            SELECT
                tenant_id
            FROM
                tenants
            WHERE
                name = 'นภา'
        ),
        DATE_TRUNC ('month', CURRENT_DATE) - INTERVAL '2 month' - INTERVAL '1 day',
        1000
    ),
    (
        (
            SELECT
                tenant_id
            FROM
                tenants
            WHERE
                name = 'นภา'
        ),
        DATE_TRUNC ('month', CURRENT_DATE) - INTERVAL '3 month' - INTERVAL '1 day',
        1000
    ),
    (
        (
            SELECT
                tenant_id
            FROM
                tenants
            WHERE
                name = 'นภา'
        ),
        DATE_TRUNC ('month', CURRENT_DATE) - INTERVAL '4 month' - INTERVAL '1 day',
        1000
    ),
    (
        (
            SELECT
                tenant_id
            FROM
                tenants
            WHERE
                name = 'ประเสริฐ'
        ),
        DATE_TRUNC ('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day',
        1000
    ),
    (
        (
            SELECT
                tenant_id
            FROM
                tenants
            WHERE
                name = 'ประเสริฐ'
        ),
        DATE_TRUNC ('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day',
        1000
    );

INSERT INTO
    parking_assignment_slots (
        assignment_id,
        slot_id,
        assigned_date,
        ended_date,
        is_active
    )
VALUES
    (
        1,
        (
            SELECT
                slot_id
            FROM
                parking_slots
            WHERE
                slot_no = 10
        ),
        DATE_TRUNC ('month', CURRENT_DATE) - INTERVAL '2 month',
        NULL,
        TRUE
    ),
    (
        2,
        (
            SELECT
                slot_id
            FROM
                parking_slots
            WHERE
                slot_no = 20
        ),
        DATE_TRUNC ('month', CURRENT_DATE) - INTERVAL '6 month',
        DATE_TRUNC ('month', CURRENT_DATE) - INTERVAL '1 month',
        FALSE
    ),
    (
        2,
        (
            SELECT
                slot_id
            FROM
                parking_slots
            WHERE
                slot_no = 21
        ),
        DATE_TRUNC ('month', CURRENT_DATE) - INTERVAL '1 month',
        DATE_TRUNC ('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day',
        FALSE
    ),
    (
        3,
        (
            SELECT
                slot_id
            FROM
                parking_slots
            WHERE
                slot_no = 30
        ),
        DATE_TRUNC ('month', CURRENT_DATE) - INTERVAL '1 year' - INTERVAL '2 month',
        NULL,
        TRUE
    ),
    (
        4,
        (
            SELECT
                slot_id
            FROM
                parking_slots
            WHERE
                slot_no = 40
        ),
        DATE_TRUNC ('month', CURRENT_DATE) - INTERVAL '2 year' - INTERVAL '6 month',
        NULL,
        TRUE
    ),
    (
        5,
        (
            SELECT
                slot_id
            FROM
                parking_slots
            WHERE
                slot_no = 50
        ),
        DATE_TRUNC ('month', CURRENT_DATE) - INTERVAL '10 month',
        NULL,
        TRUE
    ),
    (
        6,
        (
            SELECT
                slot_id
            FROM
                parking_slots
            WHERE
                slot_no = 60
        ),
        DATE_TRUNC ('month', CURRENT_DATE) - INTERVAL '1 year' - INTERVAL '2 month',
        NULL,
        TRUE
    ),
    (
        7,
        (
            SELECT
                slot_id
            FROM
                parking_slots
            WHERE
                slot_no = 70
        ),
        DATE_TRUNC ('month', CURRENT_DATE) - INTERVAL '4 year' - INTERVAL '8 month',
        NULL,
        TRUE
    ),
    (
        8,
        (
            SELECT
                slot_id
            FROM
                parking_slots
            WHERE
                slot_no = 80
        ),
        DATE_TRUNC ('month', CURRENT_DATE) - INTERVAL '4 year' - INTERVAL '8 month',
        DATE_TRUNC ('month', CURRENT_DATE) - INTERVAL '2 year' - INTERVAL '4 month',
        FALSE
    ),
    (
        8,
        (
            SELECT
                slot_id
            FROM
                parking_slots
            WHERE
                slot_no = 81
        ),
        DATE_TRUNC ('month', CURRENT_DATE) - INTERVAL '2 year' - INTERVAL '4 month',
        DATE_TRUNC ('month', CURRENT_DATE) - INTERVAL '1 year' - INTERVAL '2 month',
        FALSE
    ),
    (
        8,
        (
            SELECT
                slot_id
            FROM
                parking_slots
            WHERE
                slot_no = 82
        ),
        DATE_TRUNC ('month', CURRENT_DATE) - INTERVAL '1 year' - INTERVAL '2 month',
        DATE_TRUNC ('month', CURRENT_DATE) - INTERVAL '4 month',
        FALSE
    ),
    (
        8,
        (
            SELECT
                slot_id
            FROM
                parking_slots
            WHERE
                slot_no = 83
        ),
        DATE_TRUNC ('month', CURRENT_DATE) - INTERVAL '4 month',
        CURRENT_DATE,
        FALSE
    ),
    (
        8,
        (
            SELECT
                slot_id
            FROM
                parking_slots
            WHERE
                slot_no = 84
        ),
        CURRENT_DATE,
        NULL,
        TRUE
    ),
    (
        9,
        (
            SELECT
                slot_id
            FROM
                parking_slots
            WHERE
                slot_no = 90
        ),
        DATE_TRUNC ('month', CURRENT_DATE) - INTERVAL '2 month',
        NULL,
        TRUE
    );