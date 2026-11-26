CREATE UNIQUE INDEX IF NOT EXISTS parking_assignment_slots_slot_id_active_uq
ON parking_assignment_slots (slot_id)
WHERE is_active;

CREATE UNIQUE INDEX IF NOT EXISTS parking_assignment_slots_assignment_id_active_uq
ON parking_assignment_slots (assignment_id)
WHERE is_active;