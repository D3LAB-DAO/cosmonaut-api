DROP PROCEDURE IF EXISTS update_lesson(TEXT, TEXT, INTEGER, INTEGER);
##
CREATE OR REPLACE PROCEDURE update_lesson(newp TEXT, news TEXT, newl INTEGER, newc INTEGER)
LANGUAGE SQL
BEGIN ATOMIC
  INSERT INTO users (provider, subject, lesson, chapter) VALUES (newp, news, newl, newc)
  ON CONFLICT ON CONSTRAINT unique_progress
  DO UPDATE SET chapter = newc WHERE users.provider = newp AND users.subject = news AND users.lesson = newl;
END;
##

DROP FUNCTION IF EXISTS get_chapter(TEXT, TEXT, INTEGER);
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
