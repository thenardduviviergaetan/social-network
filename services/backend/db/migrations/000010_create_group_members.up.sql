CREATE TABLE IF NOT EXISTS group_members (
    id INTEGER PRIMARY KEY,
    group_id INTEGER REFERENCES social_group(id) ON DELETE CASCADE,
    member_id VARCHAR(255) REFERENCES user(uuid) ON DELETE CASCADE,
    pending INTEGER
);