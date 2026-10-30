DROP POLICY "Anyone can post wishes" ON public.wishes;
CREATE POLICY "Anyone can post valid wishes" ON public.wishes FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(btrim(name)) BETWEEN 1 AND 40
  AND char_length(btrim(message)) BETWEEN 1 AND 280
  AND created_at BETWEEN now() - interval '1 minute' AND now() + interval '1 minute'
);
DROP POLICY "Anyone can view wishes" ON public.wishes;
CREATE POLICY "Public can view wishes" ON public.wishes FOR SELECT TO anon, authenticated USING (true);

DROP POLICY "Anyone can light a diya" ON public.diya_lights;
CREATE POLICY "Anyone can light a diya now" ON public.diya_lights FOR INSERT TO anon, authenticated
WITH CHECK (created_at BETWEEN now() - interval '1 minute' AND now() + interval '1 minute');
DROP POLICY "Anyone can view diyas" ON public.diya_lights;
CREATE POLICY "Public can view diyas" ON public.diya_lights FOR SELECT TO anon, authenticated USING (true);