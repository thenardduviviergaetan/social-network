INSERT INTO users (email, password, first_name, last_name, date_of_birth, nickname, avatar, about, session_token, created_at)
VALUES 
    ('john@example.com', 'password123', 'John', 'Doe', '1990-01-01', 'johndoe', 'avatar.jpg', 'I am a software developer', 'token123', datetime('now')),
    ('jane@example.com', 'password456', 'Jane', 'Smith', '1995-05-10', 'janesmith', 'avatar.jpg', 'I love coding', 'token456', datetime('now')),
    ('mike@example.com', 'password789', 'Mike', 'Johnson', '1985-09-15', 'mikejohnson', 'avatar.jpg', 'Hello, world!', 'token789', datetime('now'));