CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY,
    creation_date CURRENT_TIMESTAMP,
    event_date CURRENT_TIMESTAMP,
    name VARCHAR(150),
    group_id INTEGER REFERENCES social_groups(id) ON DELETE CASCADE
);