CREATE TABLE IF NOT EXISTS event_candidates (
    id INTEGER PRIMARY KEY,
    choice VARCHAR(50),
    candidate_id varchar(255) REFERENCES users(uuid) ON DELETE CASCADE,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE
);