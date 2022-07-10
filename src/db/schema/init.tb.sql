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
