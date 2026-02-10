-- Migration: Normalize Negeri Names Casing
-- Fixes casing issues for all Malaysian states

-- Update Negeri Sembilan variations
UPDATE schools 
SET negeri = 'Negeri Sembilan' 
WHERE LOWER(negeri) = 'negeri sembilan' 
   OR negeri = 'Negeri sembilan';

-- Update Pulau Pinang variations  
UPDATE schools 
SET negeri = 'Pulau Pinang' 
WHERE LOWER(negeri) = 'pulau pinang' 
   OR negeri = 'Pulau pinang';

-- Update Kuala Lumpur variations
UPDATE schools 
SET negeri = 'Kuala Lumpur' 
WHERE LOWER(negeri) = 'kuala lumpur' 
   OR LOWER(negeri) = 'w.p. kuala lumpur'
   OR LOWER(negeri) = 'wp kuala lumpur';

-- Update other states with potential casing issues
UPDATE schools 
SET negeri = 'Johor' 
WHERE LOWER(negeri) = 'johor' AND negeri != 'Johor';

UPDATE schools 
SET negeri = 'Kedah' 
WHERE LOWER(negeri) = 'kedah' AND negeri != 'Kedah';

UPDATE schools 
SET negeri = 'Kelantan' 
WHERE LOWER(negeri) = 'kelantan' AND negeri != 'Kelantan';

UPDATE schools 
SET negeri = 'Melaka' 
WHERE LOWER(negeri) = 'melaka' AND negeri != 'Melaka';

UPDATE schools 
SET negeri = 'Pahang' 
WHERE LOWER(negeri) = 'pahang' AND negeri != 'Pahang';

UPDATE schools 
SET negeri = 'Perak' 
WHERE LOWER(negeri) = 'perak' AND negeri != 'Perak';

UPDATE schools 
SET negeri = 'Perlis' 
WHERE LOWER(negeri) = 'perlis' AND negeri != 'Perlis';

UPDATE schools 
SET negeri = 'Sabah' 
WHERE LOWER(negeri) = 'sabah' AND negeri != 'Sabah';

UPDATE schools 
SET negeri = 'Sarawak' 
WHERE LOWER(negeri) = 'sarawak' AND negeri != 'Sarawak';

UPDATE schools 
SET negeri = 'Selangor' 
WHERE LOWER(negeri) = 'selangor' AND negeri != 'Selangor';

UPDATE schools 
SET negeri = 'Terengganu' 
WHERE LOWER(negeri) = 'terengganu' AND negeri != 'Terengganu';

UPDATE schools 
SET negeri = 'Labuan' 
WHERE LOWER(negeri) = 'labuan' AND negeri != 'Labuan';

UPDATE schools 
SET negeri = 'Putrajaya' 
WHERE LOWER(negeri) = 'putrajaya' AND negeri != 'Putrajaya';

-- Verify the changes
SELECT negeri, COUNT(*) as count 
FROM schools 
WHERE negeri IS NOT NULL 
GROUP BY negeri 
ORDER BY negeri;