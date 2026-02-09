-- Migration: Populate empty NEGERI and PERINGKAT columns based on PPD and JENIS
-- This fixes schools imported without proper state and level data

-- Update NEGERI based on PPD
UPDATE schools SET negeri = 'Johor' WHERE negeri = '' AND ppd LIKE '%Johor%';
UPDATE schools SET negeri = 'Kedah' WHERE negeri = '' AND ppd LIKE '%Kedah%';
UPDATE schools SET negeri = 'Kelantan' WHERE negeri = '' AND ppd LIKE '%Kelantan%';
UPDATE schools SET negeri = 'Melaka' WHERE negeri = '' AND ppd LIKE '%Melaka%';
UPDATE schools SET negeri = 'Negeri Sembilan' WHERE negeri = '' AND ppd LIKE '%Negeri Sembilan%';
UPDATE schools SET negeri = 'Pahang' WHERE negeri = '' AND ppd LIKE '%Pahang%';
UPDATE schools SET negeri = 'Perak' WHERE negeri = '' AND ppd LIKE '%Perak%';
UPDATE schools SET negeri = 'Perlis' WHERE negeri = '' AND ppd LIKE '%Perlis%';
UPDATE schools SET negeri = 'Pulau Pinang' WHERE negeri = '' AND (ppd LIKE '%Pulau Pinang%' OR ppd LIKE '%Penang%');
UPDATE schools SET negeri = 'Sabah' WHERE negeri = '' AND ppd LIKE '%Sabah%';
UPDATE schools SET negeri = 'Sarawak' WHERE negeri = '' AND ppd LIKE '%Sarawak%';
UPDATE schools SET negeri = 'Selangor' WHERE negeri = '' AND ppd LIKE '%Selangor%';
UPDATE schools SET negeri = 'Terengganu' WHERE negeri = '' AND ppd LIKE '%Terengganu%';
UPDATE schools SET negeri = 'W.P. Kuala Lumpur' WHERE negeri = '' AND (ppd LIKE '%Kuala Lumpur%' OR ppd LIKE '%WP KL%');
UPDATE schools SET negeri = 'W.P. Labuan' WHERE negeri = '' AND ppd LIKE '%Labuan%';
UPDATE schools SET negeri = 'W.P. Putrajaya' WHERE negeri = '' AND ppd LIKE '%Putrajaya%';

-- Update PERINGKAT based on JENIS
-- RENDAH = Primary school (Rendah)
-- MENENGAH = Secondary school (Menengah)
UPDATE schools SET peringkat = 'Rendah' WHERE peringkat = '' AND jenis = 'RENDAH';
UPDATE schools SET peringkat = 'Menengah' WHERE peringkat = '' AND jenis = 'MENENGAH';

-- Set defaults for any remaining empty fields
UPDATE schools SET peringkat = 'Rendah' WHERE peringkat = '';
UPDATE schools SET negeri = 'Lain-lain' WHERE negeri = '';

-- Verify the updates
SELECT negeri, COUNT(*) as count FROM schools GROUP BY negeri ORDER BY count DESC;
SELECT peringkat, COUNT(*) as count FROM schools GROUP BY peringkat;
