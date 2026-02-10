-- Migration: Complete Negeri Name Normalization
-- Fixes all casing and naming issues for Malaysian states

-- Step 1: Check current state of negeri names
SELECT negeri, COUNT(*) as count 
FROM schools 
WHERE negeri IS NOT NULL 
GROUP BY negeri 
ORDER BY negeri;

-- Step 2: Fix all negeri names with variations
-- Using UPDATE with CASE to standardize all names

-- Negeri Sembilan (fix lowercase 'sembilan')
UPDATE schools 
SET negeri = 'Negeri Sembilan' 
WHERE LOWER(negeri) LIKE '%negeri sembilan%';

-- Pulau Pinang (fix lowercase 'pinang')
UPDATE schools 
SET negeri = 'Pulau Pinang' 
WHERE LOWER(negeri) LIKE '%pulau pinang%';

-- Kuala Lumpur (consolidate all W.P., WP, and WILAYAH variations)
UPDATE schools 
SET negeri = 'Kuala Lumpur' 
WHERE LOWER(negeri) LIKE '%kuala lumpur%'
   OR LOWER(negeri) LIKE '%wp%kuala%'
   OR LOWER(negeri) LIKE '%wilayah%kuala%';

-- Labuan (consolidate all W.P., WP, and WILAYAH variations)
UPDATE schools 
SET negeri = 'Labuan' 
WHERE LOWER(negeri) LIKE '%labuan%'
   OR LOWER(negeri) LIKE '%wp%labuan%'
   OR LOWER(negeri) LIKE '%wilayah%labuan%';

-- Putrajaya (consolidate all W.P., WP, and WILAYAH variations)
UPDATE schools 
SET negeri = 'Putrajaya' 
WHERE LOWER(negeri) LIKE '%putrajaya%'
   OR LOWER(negeri) LIKE '%wp%putrajaya%'
   OR LOWER(negeri) LIKE '%wilayah%putrajaya%';

-- Step 3: Fix any remaining lowercase issues for other states
UPDATE schools SET negeri = 'Johor' WHERE LOWER(negeri) = 'johor' AND negeri != 'Johor';
UPDATE schools SET negeri = 'Kedah' WHERE LOWER(negeri) = 'kedah' AND negeri != 'Kedah';
UPDATE schools SET negeri = 'Kelantan' WHERE LOWER(negeri) = 'kelantan' AND negeri != 'Kelantan';
UPDATE schools SET negeri = 'Melaka' WHERE LOWER(negeri) = 'melaka' AND negeri != 'Melaka';
UPDATE schools SET negeri = 'Pahang' WHERE LOWER(negeri) = 'pahang' AND negeri != 'Pahang';
UPDATE schools SET negeri = 'Perak' WHERE LOWER(negeri) = 'perak' AND negeri != 'Perak';
UPDATE schools SET negeri = 'Perlis' WHERE LOWER(negeri) = 'perlis' AND negeri != 'Perlis';
UPDATE schools SET negeri = 'Sabah' WHERE LOWER(negeri) = 'sabah' AND negeri != 'Sabah';
UPDATE schools SET negeri = 'Sarawak' WHERE LOWER(negeri) = 'sarawak' AND negeri != 'Sarawak';
UPDATE schools SET negeri = 'Selangor' WHERE LOWER(negeri) = 'selangor' AND negeri != 'Selangor';
UPDATE schools SET negeri = 'Terengganu' WHERE LOWER(negeri) = 'terengganu' AND negeri != 'Terengganu';

-- Step 4: Verify the changes
SELECT negeri, COUNT(*) as count 
FROM schools 
WHERE negeri IS NOT NULL 
GROUP BY negeri 
ORDER BY negeri;

-- Step 5: Check cities for the fixed states
SELECT negeri, COUNT(DISTINCT bandar) as city_count, COUNT(*) as school_count
FROM schools 
WHERE negeri IN ('Pulau Pinang', 'Kuala Lumpur', 'Labuan', 'Putrajaya', 'Negeri Sembilan')
GROUP BY negeri
ORDER BY negeri;

-- Step 6: List cities for each state (for verification)
SELECT negeri, bandar, COUNT(*) as school_count
FROM schools 
WHERE negeri IN ('Pulau Pinang', 'Kuala Lumpur', 'Labuan', 'Putrajaya')
  AND bandar IS NOT NULL
GROUP BY negeri, bandar
ORDER BY negeri, bandar;