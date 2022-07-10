DROP TABLE IF EXISTS users;
CREATE TABLE users(
   id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
   provider TEXT NOT NULL,
   subject TEXT NOT NULL,
   lesson INTEGER NOT NULL,
   chapter INTEGER NOT NULL,
   CONSTRAINT unique_progress UNIQUE (provider, subject, lesson)
);
INSERT INTO users(provider, subject, lesson, chapter)
VALUES('google', 'tkxkd0159', 0, 1);

DROP TABLE IF EXISTS federated_credentials;
CREATE TABLE federated_credentials(
   id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
   provider TEXT NOT NULL,
   subject TEXT NOT NULL,
   name TEXT NOT NULL,
   create_at TIMESTAMPTZ,
   UNIQUE (provider, subject)
);
INSERT INTO federated_credentials(provider, subject, name)
VALUES('https://accounts.google.com', 'tkxkd0159', 'JAESEUNG LEE');


DROP TABLE IF EXISTS assets;
CREATE TABLE assets(
   id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
   provider TEXT NOT NULL,
   subject TEXT NOT NULL,
   key TEXT NOT NULL,
   reward JSONB NOT NULL
);
INSERT INTO assets (provider, subject, key, reward)
VALUES('google', 'tkxkd0159', 'secret1', '[{"name": "clear1", "loc": "assets/nft/clear1"}, {"name": "clear2", "loc": "assets/nft/clear2"}]'),
      ('facebook', 'tkxkd0159', 'secret2', '[{"name": "clear3", "loc": "assets/nft/clear3"}, {"name": "clear4", "loc": "assets/nft/clear4"}]');
