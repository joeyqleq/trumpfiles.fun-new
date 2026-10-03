-- PROPOSAL ONLY; do not execute until live schema and release approval are confirmed.
-- Source packet 86d71a0bcd9d82301e72bc9f36a4271143c87ddb; latest account2 integration QA 38ec98608d61fc6e9eab0816f9f83d2d45f8e977; 62 PASS rows only, 38 HOLD excluded.
-- Assumption inferred from local types, not verified in Neon: public.trump_entries keyed by entry_number.
BEGIN;
SET LOCAL lock_timeout='1s'; SET LOCAL statement_timeout='30s';
ALTER TABLE public.trump_entries
 ADD COLUMN IF NOT EXISTS harm numeric(3,1) NULL CHECK(harm BETWEEN 0 AND 10),
 ADD COLUMN IF NOT EXISTS reach numeric(3,1) NULL CHECK(reach BETWEEN 0 AND 10),
 ADD COLUMN IF NOT EXISTS institutions numeric(3,1) NULL CHECK(institutions BETWEEN 0 AND 10),
 ADD COLUMN IF NOT EXISTS procedural_abuse numeric(3,1) NULL CHECK(procedural_abuse BETWEEN 0 AND 10),
 ADD COLUMN IF NOT EXISTS self_dealing numeric(3,1) NULL CHECK(self_dealing BETWEEN 0 AND 10),
 ADD COLUMN IF NOT EXISTS persistence numeric(3,1) NULL CHECK(persistence BETWEEN 0 AND 10);
CREATE TEMP TABLE _w20_stage(entry_number bigint PRIMARY KEY,harm numeric(3,1) NOT NULL CHECK(harm BETWEEN 0 AND 10), reach numeric(3,1) NOT NULL CHECK(reach BETWEEN 0 AND 10), institutions numeric(3,1) NOT NULL CHECK(institutions BETWEEN 0 AND 10), procedural_abuse numeric(3,1) NOT NULL CHECK(procedural_abuse BETWEEN 0 AND 10), self_dealing numeric(3,1) NOT NULL CHECK(self_dealing BETWEEN 0 AND 10), persistence numeric(3,1) NOT NULL CHECK(persistence BETWEEN 0 AND 10)) ON COMMIT DROP;
INSERT INTO _w20_stage(entry_number,harm, reach, institutions, procedural_abuse, self_dealing, persistence) VALUES
 (1, 7.0, 7.5, 0.5, 4.0, 1.0, 5.0),
 (3, 3.0, 7.0, 4.0, 0.0, 0.0, 3.0),
 (4, 2.5, 5.0, 1.5, 0.0, 0.0, 3.0),
 (6, 4.5, 9.0, 3.0, 0.0, 0.0, 2.0),
 (8, 6.3, 5.5, 5.0, 6.8, 0.0, 4.0),
 (10, 8.0, 8.0, 4.0, 3.0, 0.0, 4.0),
 (12, 5.5, 2.5, 1.0, 0.5, 0.0, 2.5),
 (13, 3.5, 8.5, 7.5, 3.0, 2.2, 5.5),
 (14, 5.5, 8.0, 6.0, 1.5, 0.5, 5.0),
 (15, 3.5, 5, 5, 3.5, 0, 3),
 (16, 4.0, 6.0, 1.0, 0.0, 0.0, 3.5),
 (17, 9.0, 8.5, 7.0, 7.5, 0.0, 8.0),
 (18, 4.5, 8.0, 8.0, 8.0, 8.0, 5.0),
 (20, 1.0, 2.0, 0.0, 0.0, 0.0, 2.0),
 (21, 4.0, 7.0, 5.0, 2.0, 5.0, 5.0),
 (25, 7.0, 2.0, 1.5, 0.5, 0.0, 5.5),
 (27, 8.0, 6.0, 5.0, 6.0, 0.0, 4.0),
 (28, 5.0, 6.0, 0.0, 0.0, 0.0, 2.0),
 (30, 4.5, 9, 6, 4, 0, 1.5),
 (31, 3.5, 7.5, 3.0, 1.5, 0.0, 2.5),
 (32, 2.5, 6.5, 5.5, 4.0, 7.0, 4.0),
 (39, 1.5, 6.0, 2.0, 2.5, 2.5, 1.5),
 (40, 4.0, 9.0, 0.0, 0.0, 0.0, 1.5),
 (41, 4.5, 7.0, 5.0, 0.0, 0.0, 6.0),
 (42, 4.0, 7.0, 4.5, 2.5, 0.0, 3.0),
 (44, 5.0, 8.0, 5.0, 4.0, 0.0, 2.5),
 (45, 2.5, 7.5, 6.5, 7.5, 0.0, 4.5),
 (46, 0.5, 5.0, 0.0, 0.0, 0.0, 0.5),
 (48, 4.0, 6.0, 4.0, 0.0, 0.0, 5.0),
 (50, 3.0, 2.0, 5.0, 4.0, 4.0, 3.0),
 (53, 7.0, 8.0, 7.0, 7.0, 0.0, 5.0),
 (55, 3.0, 10.0, 5.0, 0.0, 0.0, 5.0),
 (56, 4.8, 8.2, 5.0, 0.0, 0.0, 3.5),
 (58, 1.0, 3.0, 4.0, 3.0, 5.0, 2.0),
 (60, 2.0, 8.0, 5.0, 0.0, 0.0, 4.0),
 (62, 4.0, 9.0, 4.0, 0.0, 0.0, 2.0),
 (65, 3.0, 5.0, 3.5, 0.5, 0.0, 2.5),
 (67, 4.5, 9.0, 5.5, 3.5, 0.0, 3.0),
 (68, 3.0, 8.0, 5.0, 6.0, 5.0, 2.0),
 (69, 3.5, 8.0, 4.0, 2.5, 2.0, 3.5),
 (70, 8.0, 10.0, 9.0, 8.0, 3.0, 6.0),
 (71, 7.2, 8.2, 8.5, 8.8, 2.5, 5.5),
 (72, 1.5, 2.0, 1.0, 0.0, 0.0, 1.0),
 (76, 3.5, 8.0, 2.0, 0.5, 0.0, 0.5),
 (78, 4.5, 10.0, 6.5, 5.0, 0.0, 3.5),
 (79, 1.5, 10.0, 5.5, 2.5, 0.0, 1.5),
 (80, 2.5, 6.0, 5.0, 5.5, 8.0, 4.0),
 (82, 2.0, 9.0, 4.0, 0.0, 0.0, 2.0),
 (84, 3.2, 8.0, 2.0, 0.0, 2.0, 2.5),
 (85, 4.0, 5.0, 3.0, 5.0, 0.0, 2.5),
 (86, 1.5, 7.0, 3.5, 1.0, 4.0, 0.5),
 (88, 3.5, 3.0, 3.0, 0.0, 0.0, 2.0),
 (89, 6.0, 10.0, 4.0, 1.0, 0.0, 6.0),
 (91, 4.5, 9.0, 7.5, 5.5, 0.0, 4.5),
 (92, 3.5, 4.0, 2.0, 2.5, 3.0, 2.0),
 (93, 6.5, 8.5, 7.0, 5.8, 0.0, 5.0),
 (94, 8.0, 10.0, 9.0, 9.0, 8.0, 5.0),
 (98, 4.5, 9.0, 6.5, 3.5, 0.0, 2.0),
 (100, 5.2, 6.2, 5.3, 0.4, 0, 4.8),
 (102, 8.5, 8.5, 2.5, 4.5, 0.0, 7.0),
 (103, 5.5, 8.0, 6.0, 4.0, 0.0, 5.0),
 (104, 6.0, 8.0, 6.0, 3.0, 1.0, 4.0);
DO $$ BEGIN
 IF (SELECT count(*) FROM _w20_stage)<>62 THEN RAISE EXCEPTION 'stage count mismatch'; END IF;
 IF (SELECT count(*) FROM public.trump_entries t JOIN _w20_stage s USING(entry_number))<>62 THEN RAISE EXCEPTION 'missing/duplicate target identity'; END IF;
END $$;
CREATE TEMP TABLE _w20_before ON COMMIT DROP AS SELECT t.entry_number,t.harm, t.reach, t.institutions, t.procedural_abuse, t.self_dealing, t.persistence FROM public.trump_entries t JOIN _w20_stage s USING(entry_number);
UPDATE public.trump_entries t SET harm=CASE WHEN t.harm IS NULL THEN s.harm ELSE t.harm END,
 reach=CASE WHEN t.reach IS NULL THEN s.reach ELSE t.reach END,
 institutions=CASE WHEN t.institutions IS NULL THEN s.institutions ELSE t.institutions END,
 procedural_abuse=CASE WHEN t.procedural_abuse IS NULL THEN s.procedural_abuse ELSE t.procedural_abuse END,
 self_dealing=CASE WHEN t.self_dealing IS NULL THEN s.self_dealing ELSE t.self_dealing END,
 persistence=CASE WHEN t.persistence IS NULL THEN s.persistence ELSE t.persistence END FROM _w20_stage s WHERE t.entry_number=s.entry_number AND (t.harm IS NULL OR t.reach IS NULL OR t.institutions IS NULL OR t.procedural_abuse IS NULL OR t.self_dealing IS NULL OR t.persistence IS NULL);
DO $$ BEGIN
 IF EXISTS(SELECT 1 FROM public.trump_entries t JOIN _w20_before b USING(entry_number) WHERE (b.harm IS NOT NULL AND t.harm IS DISTINCT FROM b.harm) OR (b.reach IS NOT NULL AND t.reach IS DISTINCT FROM b.reach) OR (b.institutions IS NOT NULL AND t.institutions IS DISTINCT FROM b.institutions) OR (b.procedural_abuse IS NOT NULL AND t.procedural_abuse IS DISTINCT FROM b.procedural_abuse) OR (b.self_dealing IS NOT NULL AND t.self_dealing IS DISTINCT FROM b.self_dealing) OR (b.persistence IS NOT NULL AND t.persistence IS DISTINCT FROM b.persistence)) THEN RAISE EXCEPTION 'pre-existing non-NULL changed'; END IF;
 IF (SELECT count(*) FROM _w20_before)<>62 THEN RAISE EXCEPTION 'before-image count mismatch'; END IF;
END $$;
COMMIT;
-- Any raised exception aborts the transaction; issue ROLLBACK to abort manually before COMMIT.
