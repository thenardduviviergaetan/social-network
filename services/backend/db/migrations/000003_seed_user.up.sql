INSERT INTO users (uuid, email, password, first_name, last_name, date_of_birth, nickname, about, session_token, created_at)
VALUES
    ('1', 'user1@example.com', 'password1', 'John', 'Doe', '1990-01-01', 'johndoe', 'About John Doe', NULL, datetime('now')),
    ('2', 'user2@example.com', 'password2', 'Jane', 'Smith', '1995-02-15', 'janesmith', 'About Jane Smith', NULL, datetime('now')),
    ('3', 'user3@example.com', 'password3', 'Mike', 'Johnson', '1988-07-10', 'mikejohnson', 'About Mike Johnson', NULL, datetime('now')),
    ('4', 'user4@example.com', 'password4', 'Sarah', 'Williams', '1992-11-30', 'sarahwilliams', 'About Sarah Williams', NULL, datetime('now')),
    ('5', 'user5@example.com', 'password5', 'David', 'Brown', '1998-04-20', 'davidbrown', 'About David Brown', NULL, datetime('now'));