CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author_id VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    group_id INTEGER,
    content TEXT NOT NULL,
    status Text NOT NULL,
    image TEXT,
    authorized TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES social_groups(id)
);
