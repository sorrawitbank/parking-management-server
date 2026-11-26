CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS
$$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION touch_parking_assignment_updated_at()
RETURNS TRIGGER AS
$$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE parking_assignments
        SET updated_at = CURRENT_TIMESTAMP
        WHERE assignment_id = NEW.assignment_id;
        RETURN NEW;

    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE parking_assignments
        SET updated_at = CURRENT_TIMESTAMP
        WHERE assignment_id IN (OLD.assignment_id, NEW.assignment_id);
        RETURN NEW;

    ELSE
        UPDATE parking_assignments
        SET updated_at = CURRENT_TIMESTAMP
        WHERE assignment_id = OLD.assignment_id;
        RETURN OLD;
    END IF;
END;
$$
LANGUAGE plpgsql;