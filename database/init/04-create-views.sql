CREATE OR REPLACE VIEW parking_slots_with_status AS
SELECT ps.slot_id,
    psst.slot_status_id
FROM parking_slots ps
    INNER JOIN parking_slot_statuses psst ON psst.slot_status_id = (
        CASE
            WHEN EXISTS(
                SELECT 1
                FROM parking_assignment_slots pas
                WHERE pas.is_active
                    AND pas.slot_id = ps.slot_id
            ) THEN 2
            WHEN NOT ps.is_unavailable THEN 1
            ELSE 3
        END
    );

CREATE OR REPLACE VIEW parking_assignment_slots_with_assigned_days AS
SELECT pas.assignment_slot_id,
    pas.assignment_id,
    pas.slot_id,
    pas.assigned_date,
    pas.ended_date,
    COALESCE(pas.ended_date, CURRENT_DATE) - pas.assigned_date + 1 AS assigned_days,
    pas.is_active
FROM parking_assignment_slots pas;

CREATE OR REPLACE VIEW parking_assignments_with_stats AS
SELECT pa.assignment_id,
    pa.tenant_id,
    pa.paid_until_month,
    pa.monthly_fee,
    assignment_stats.assigned_date,
    assignment_stats.ended_date,
    assignment_stats.assigned_days,
    assignment_stats.is_active,
    pa.created_at,
    pa.updated_at
FROM parking_assignments pa
    INNER JOIN (
        SELECT pas.assignment_id,
            MIN(pas.assigned_date) AS assigned_date,
            CASE
                WHEN BOOL_OR(pas.is_active) THEN NULL
                ELSE MAX(pas.ended_date)
            END AS ended_date,
            (SUM(pas.assigned_days) - COUNT(*) + 1)::INTEGER AS assigned_days,
            BOOL_OR(pas.is_active) AS is_active
        FROM parking_assignment_slots_with_assigned_days pas
        GROUP BY pas.assignment_id
    ) assignment_stats ON assignment_stats.assignment_id = pa.assignment_id;

CREATE OR REPLACE VIEW active_parking_assignments AS
SELECT pa.assignment_id,
    pas.slot_id,
    past.assignment_status_id,
    pa.paid_until_month,
    pa.monthly_fee,
    pa.assigned_date,
    pa.assigned_days,
    t.tenant_id,
    t.name,
    t.phone,
    t.line_id,
    t.note
FROM parking_assignments_with_stats pa
    INNER JOIN parking_assignment_slots pas ON pas.is_active
    AND pas.assignment_id = pa.assignment_id
    INNER JOIN parking_assignment_statuses past ON past.month_diff_range @> (
        12 * (
            EXTRACT(
                year
                FROM pa.paid_until_month
            ) - EXTRACT(
                year
                FROM CURRENT_DATE
            )
        ) + EXTRACT(
            month
            FROM pa.paid_until_month
        ) - EXTRACT(
            month
            FROM CURRENT_DATE
        )
    )::INTEGER
    INNER JOIN tenants t ON t.tenant_id = pa.tenant_id;

CREATE OR REPLACE VIEW renting_tenants AS
SELECT t.*
FROM tenants t
WHERE EXISTS(
        SELECT 1
        FROM parking_assignments_with_stats pa
        WHERE pa.is_active
            AND pa.tenant_id = t.tenant_id
    );

CREATE OR REPLACE VIEW non_renting_tenants AS
SELECT t.*
FROM tenants t
WHERE NOT EXISTS(
        SELECT 1
        FROM parking_assignments_with_stats pa
        WHERE pa.is_active
            AND pa.tenant_id = t.tenant_id
    );