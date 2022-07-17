CREATE OR REPLACE PROCEDURE update_asset(newp TEXT, news TEXT, newl INTEGER, new_status TEXT, new_loc TEXT)
LANGUAGE SQL
BEGIN ATOMIC
  INSERT INTO assets (provider, subject, lesson, status, loc) VALUES (newp, news, newl, new_status, new_loc)
  ON CONFLICT ON CONSTRAINT unique_asset
  DO UPDATE SET status = new_status, loc = new_loc WHERE assets.provider = newp AND assets.subject = news AND assets.lesson = newl;
END;
##
CREATE OR REPLACE PROCEDURE update_lesson(newp TEXT, news TEXT, newl INTEGER, newc INTEGER)
LANGUAGE SQL
BEGIN ATOMIC
  INSERT INTO users (provider, subject, lesson, chapter) VALUES (newp, news, newl, newc)
  ON CONFLICT ON CONSTRAINT unique_progress
  DO UPDATE SET chapter = newc WHERE users.provider = newp AND users.subject = news AND users.lesson = newl;
END;
##
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
##
