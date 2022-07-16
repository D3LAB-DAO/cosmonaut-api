CREATE TABLE federated_credentials(
   id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
   provider TEXT NOT NULL,
   subject TEXT NOT NULL,
   created_at TIMESTAMPTZ,
   UNIQUE (provider, subject)
);
INSERT INTO federated_credentials(provider, subject)
VALUES('google', 'dummy');

CREATE TABLE users(
   id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
   provider TEXT NOT NULL,
   subject TEXT NOT NULL,
   disp_name TEXT,
   lesson INTEGER NOT NULL,
   chapter INTEGER NOT NULL,
   CONSTRAINT unique_progress UNIQUE (provider, subject, lesson),
   CONSTRAINT fk_unique_user
      FOREIGN KEY(provider, subject)
         REFERENCES federated_credentials(provider, subject) ON DELETE CASCADE
);
INSERT INTO users(provider, subject, lesson, chapter)
VALUES('google', 'dummy', 1, 1);

CREATE TABLE assets(
   id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
   provider TEXT NOT NULL,
   subject TEXT NOT NULL,
   lesson INTEGER NOT NULL,
   status TEXT NOT NULL,
   loc TEXT NOT NULL,
   CONSTRAINT fk_unique_user
      FOREIGN KEY(provider, subject)
         REFERENCES federated_credentials(provider, subject) ON DELETE CASCADE
);
INSERT INTO assets (provider, subject, lesson, status, loc)
VALUES('google', 'dummy', 1, 'doing', '/path/to/jpg');

CREATE TABLE lesson_range(
   lesson INTEGER NOT NULL,
   threshold INTEGER NOT NULL,
   PRIMARY KEY (lesson)
);
INSERT INTO lesson_range (lesson, threshold)
VALUES(1, 5),(2, 5),(3, 5),(4, 5);
CREATE OR REPLACE PROCEDURE update_lesson(newp TEXT, news TEXT, newl INTEGER, newc INTEGER)
LANGUAGE SQL
BEGIN ATOMIC
  INSERT INTO users (provider, subject, lesson, chapter) VALUES (newp, news, newl, newc)
  ON CONFLICT ON CONSTRAINT unique_progress
  DO UPDATE SET chapter = newc WHERE users.provider = newp AND users.subject = news AND users.lesson = newl;
END;

CREATE OR REPLACE FUNCTION get_chapter(u_provider TEXT, u_subject TEXT, u_lesson INTEGER)
RETURNS INTEGER AS $$
DECLARE
  cur_ch INTEGER;
BEGIN
  SELECT chapter INTO cur_ch FROM users WHERE provider = u_provider AND subject = u_subject AND lesson = u_lesson;
  RETURN cur_ch;
END;
$$
IMMUTABLE
LANGUAGE plpgsql