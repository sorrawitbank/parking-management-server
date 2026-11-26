CREATE OR REPLACE TRIGGER users_set_updated_at_trg
BEFORE UPDATE
ON users FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER tenants_set_updated_at_trg
BEFORE UPDATE
ON tenants FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER provinces_set_updated_at_trg
BEFORE UPDATE
ON provinces FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER vehicle_types_set_updated_at_trg
BEFORE UPDATE
ON vehicle_types FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER vehicle_brands_set_updated_at_trg
BEFORE UPDATE
ON vehicle_brands FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER vehicles_set_updated_at_trg
BEFORE UPDATE
ON vehicles FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER parking_slots_set_updated_at_trg
BEFORE UPDATE
ON parking_slots FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER parking_slot_statuses_set_updated_at_trg
BEFORE UPDATE
ON parking_slot_statuses FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER parking_assignments_set_updated_at_trg
BEFORE UPDATE
ON parking_assignments FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER parking_assignment_statuses_set_updated_at_trg
BEFORE UPDATE
ON parking_assignment_statuses FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER parking_assignment_slots_touch_assignment_updated_at_trg
AFTER INSERT OR UPDATE OR DELETE
ON parking_assignment_slots FOR EACH ROW
EXECUTE FUNCTION touch_parking_assignment_updated_at();