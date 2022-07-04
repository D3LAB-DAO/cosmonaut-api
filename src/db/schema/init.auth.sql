DROP TABLE IF EXISTS federated_credentials;
CREATE TABLE federated_credentials(
   id INTEGER GENERATED ALWAYS AS IDENTITY,
   provider TEXT NOT NULL,
   subject TEXT NOT NULL,
   name TEXT NOT NULL,
   PRIMARY KEY (provider, subject)
);
INSERT INTO federated_credentials(provider, subject, name) VALUES('https://accounts.google.com', 'tkxkd0159', 'JAESEUNG LEE');