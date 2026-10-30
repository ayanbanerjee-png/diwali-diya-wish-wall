CREATE TABLE public.diya_lights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.diya_lights TO anon, authenticated;
GRANT ALL ON public.diya_lights TO service_role;
ALTER TABLE public.diya_lights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view diyas" ON public.diya_lights FOR SELECT USING (true);
CREATE POLICY "Anyone can light a diya" ON public.diya_lights FOR INSERT WITH CHECK (true);

CREATE TABLE public.wishes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 40),
  message text NOT NULL CHECK (char_length(message) BETWEEN 1 AND 280),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.wishes TO anon, authenticated;
GRANT ALL ON public.wishes TO service_role;
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view wishes" ON public.wishes FOR SELECT USING (true);
CREATE POLICY "Anyone can post wishes" ON public.wishes FOR INSERT WITH CHECK (true);

INSERT INTO public.wishes (name, message) VALUES
 ('Ananya', 'May your home glow with joy and prosperity. Shubh Deepavali!'),
 ('Rahul', 'Wishing everyone light, love and laddoos 🪔');

ALTER PUBLICATION supabase_realtime ADD TABLE public.diya_lights;
ALTER PUBLICATION supabase_realtime ADD TABLE public.wishes;