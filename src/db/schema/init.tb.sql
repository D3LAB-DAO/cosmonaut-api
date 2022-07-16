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

-- CREATE TABLE assets(
--    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
--    provider TEXT NOT NULL,
--    subject TEXT NOT NULL,
--    key TEXT NOT NULL,
--    reward JSONB NOT NULL
-- );
-- INSERT INTO assets (provider, subject, key, reward)
-- VALUES('google', 'dummy', 'secret1', '[{"name": "clear1", "loc": "assets/nft/clear1"}, {"name": "clear2", "loc": "assets/nft/clear2"}]'),
--       ('facebook', 'dummy', 'secret2', '[{"name": "clear3", "loc": "assets/nft/clear3"}, {"name": "clear4", "loc": "assets/nft/clear4"}]');

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