CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE teachers (
    id            SERIAL PRIMARY KEY,
    name          TEXT        NOT NULL,
    username      TEXT        NOT NULL UNIQUE,
    password_hash TEXT        NOT NULL,
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE students (
    id            SERIAL PRIMARY KEY,
    name          TEXT        NOT NULL,
    roll_no       TEXT        NOT NULL UNIQUE,
    password_hash TEXT        NOT NULL,
    class         INT         NOT NULL DEFAULT 7,
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE subjects (
    id   SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE tests (
    id         SERIAL PRIMARY KEY,
    name       TEXT NOT NULL,
    test_date  DATE NOT NULL,
    class      INT  NOT NULL DEFAULT 7,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE marks (
    id         SERIAL PRIMARY KEY,
    student_id INT          NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    test_id    INT          NOT NULL REFERENCES tests(id)    ON DELETE CASCADE,
    subject_id INT          NOT NULL REFERENCES subjects(id),
    score      NUMERIC(5,2) NOT NULL CHECK (score >= 0),
    max_score  NUMERIC(5,2) NOT NULL DEFAULT 100,
    entered_by INT          REFERENCES teachers(id),
    entered_at TIMESTAMPTZ  DEFAULT NOW(),
    UNIQUE (student_id, test_id, subject_id)
);
