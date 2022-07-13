CREATE TABLE users(
   id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
   provider TEXT NOT NULL,
   subject TEXT NOT NULL,
   disp_name TEXT,
   lesson INTEGER NOT NULL,
   chapter INTEGER NOT NULL,
   CONSTRAINT unique_progress UNIQUE (provider, subject, lesson)
);
INSERT INTO users(provider, subject, lesson, chapter)
VALUES('google', 'dummy', 0, 1);

CREATE TABLE federated_credentials(
   id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
   provider TEXT NOT NULL,
   subject TEXT NOT NULL,
   created_at TIMESTAMPTZ,
   UNIQUE (provider, subject)
);
INSERT INTO federated_credentials(provider, subject)
VALUES('https://accounts.google.com', 'dummy');

CREATE TABLE assets(
   id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
   provider TEXT NOT NULL,
   subject TEXT NOT NULL,
   key TEXT NOT NULL,
   reward JSONB NOT NULL
);
INSERT INTO assets (provider, subject, key, reward)
VALUES('google', 'dummy', 'secret1', '[{"name": "clear1", "loc": "assets/nft/clear1"}, {"name": "clear2", "loc": "assets/nft/clear2"}]'),
      ('facebook', 'dummy', 'secret2', '[{"name": "clear3", "loc": "assets/nft/clear3"}, {"name": "clear4", "loc": "assets/nft/clear4"}]');

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