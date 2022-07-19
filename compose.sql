CREATE TABLE federated_credentials(
   id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
   provider TEXT NOT NULL,
   subject TEXT NOT NULL,
   created_at TIMESTAMPTZ,
   UNIQUE (provider, subject)
);
INSERT INTO federated_credentials(provider, subject)
VALUES('github', '41176085'),
      ('google', '123456789');

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
VALUES('github', '41176085', 1, 0),
      ('google', '123456789', 2, 3);

CREATE TABLE assets(
   id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
   provider TEXT NOT NULL,
   subject TEXT NOT NULL,
   lesson INTEGER NOT NULL,
   status TEXT NOT NULL,
   loc TEXT NOT NULL,
   CONSTRAINT unique_asset UNIQUE(provider, subject, lesson),
   CONSTRAINT fk_unique_user
      FOREIGN KEY(provider, subject)
         REFERENCES federated_credentials(provider, subject) ON DELETE CASCADE
);
INSERT INTO assets (provider, subject, lesson, status, loc)
VALUES('github', '41176085', 1, 'done', 'assets/f03b9b48acf40d25882e7afc0a64573358ca5e9d15a0d343e657ba04b81c44ea-1/done.jpg'),
      ('github', '41176085', 2, 'doing', 'assets/2bf83c540ee563217f2c18e26ce2660a8302f28105c2328d27aa7eef7e0dca3b-2/doing.png'),
      ('github', '41176085', 3, 'start', 'assets/8da88b2d24e891496a3a921d47d873d34de670bd3eb8215222c97d6a63f597f5-3/start.png');

CREATE TABLE lesson_range(
   lesson INTEGER NOT NULL,
   threshold INTEGER NOT NULL,
   PRIMARY KEY (lesson)
);
INSERT INTO lesson_range (lesson, threshold)
VALUES(0, 5),(1, 5),(2, 5),(3, 5),(4, 5),(5, 5);

CREATE OR REPLACE PROCEDURE update_asset(newp TEXT, news TEXT, newl INTEGER, new_status TEXT, new_loc TEXT)
LANGUAGE SQL
BEGIN ATOMIC
  INSERT INTO assets (provider, subject, lesson, status, loc) VALUES (newp, news, newl, new_status, new_loc)
  ON CONFLICT ON CONSTRAINT unique_asset
  DO UPDATE SET status = new_status, loc = new_loc WHERE assets.provider = newp AND assets.subject = news AND assets.lesson = newl;
END;

CREATE OR REPLACE PROCEDURE update_lesson(newp TEXT, news TEXT, newl INTEGER, newc INTEGER)
LANGUAGE SQL
BEGIN ATOMIC
  INSERT INTO users (provider, subject, lesson, chapter) VALUES (newp, news, newl, newc)
  ON CONFLICT ON CONSTRAINT unique_progress
  DO UPDATE SET chapter = newc WHERE users.provider = newp AND users.subject = news AND users.lesson = newl;
END;

CREATE OR REPLACE FUNCTION get_progress(u_provider TEXT, u_subject TEXT, u_lesson INTEGER)
RETURNS TABLE(res_lesson INTEGER, res_chapter INTEGER) AS $$
BEGIN
  RETURN QUERY SELECT lesson, chapter FROM users WHERE provider = u_provider AND subject = u_subject AND lesson = u_lesson;
END;
$$
IMMUTABLE
LANGUAGE plpgsql
