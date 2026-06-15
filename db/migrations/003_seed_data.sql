INSERT INTO subjects (name) VALUES
    ('Telugu'),
    ('Hindi'),
    ('English'),
    ('Mathematics'),
    ('Science'),
    ('Social Studies');

INSERT INTO teachers (name, username, password_hash) VALUES
    ('Rajkumar', 'rajkumar', crypt('rajkumar123', gen_salt('bf')));
