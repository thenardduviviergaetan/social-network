CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    birthday TEXT NOT NULL,
    nickname TEXT,
    avatar TEXT,
    about TEXT,
    session_token TEXT
    created_at DATETIME NOT NULL,
);