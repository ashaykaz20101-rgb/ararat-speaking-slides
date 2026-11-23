ALTER TABLE public.poll_votes DROP CONSTRAINT poll_votes_option_key_check;
ALTER TABLE public.poll_votes ADD CONSTRAINT poll_votes_option_key_check CHECK (
  (poll_id = 'reduce-unemployment' AND option_key IN ('small_business','vocational','youth','industries'))
  OR (poll_id = 'main-cause' AND option_key IN ('few_jobs','skills_gap','low_wages','experience'))
  OR (poll_id = 'most-affected' AND option_key IN ('young','women','regions','older'))
  OR (poll_id = 'worst-effect' AND option_key IN ('family_income','emigration','budget','wellbeing'))
  OR (poll_id = 'who-solves' AND option_key IN ('state','business','education','everyone'))
);