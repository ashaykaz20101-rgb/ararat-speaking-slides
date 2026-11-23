DROP POLICY "Anyone can cast a vote" ON public.poll_votes;
CREATE POLICY "Anyone can cast a vote" ON public.poll_votes FOR INSERT TO anon, authenticated
WITH CHECK (poll_id IN ('reduce-unemployment','main-cause','most-affected','worst-effect','who-solves'));