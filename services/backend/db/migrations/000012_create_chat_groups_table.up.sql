CREATE TABLE IF NOT EXISTS chat_groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender VARCHAR(255) NOT NULL,
    target VARCHAR(255) NOT NULL,
    message_content VARCHAR(255) NOT NULL,
    creation_date TIMESTAMP,
    link_image VARCHAR(255),
    FOREIGN KEY (sender) REFERENCES users(uuid) ON DELETE CASCADE
    -- FOREIGN KEY (target) REFERENCES users(uuid) ON DELETE CASCADE
);