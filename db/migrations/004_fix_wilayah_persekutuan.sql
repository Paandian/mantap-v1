-- Migration: Fix Wilayah Persekutuan (Federal Territories) Naming
-- Standardizes W.P. Kuala Lumpur, W.P. Labuan, W.P. Putrajaya

-- First, let's see what we actually have
SELECT DISTINCT negeri FROM schools WHERE negeri LIKE '%kuala%' OR negeri LIKE '%labuan%' OR negeri LIKE '%putrajaya%' ORDER BY negeri;

-- Fix Kuala Lumpur variations (consolidate to "Kuala Lumpur" without W.P. prefix for consistency)
UPDATE schools 
SET negeri = 'Kuala Lumpur' 
WHERE LOWER(negeri) LIKE '%kuala lumpur%' 
   OR negeri = 'W.P. Kuala Lumpur'
   OR negeri = 'WP Kuala Lumpur'
   OR negeri = 'WILAYAH PERSEKUTUAN KUALA LUMPUR';

-- Fix Labuan variations
UPDATE schools 
SET negeri = 'Labuan' 
WHERE LOWER(negeri) LIKE '%labuan%' 
   OR negeri = 'W.P. Labuan'
   OR negeri = 'WP Labuan'
   OR negeri = 'WILAYAH PERSEKUTUAN LABUAN';

-- Fix Putrajaya variations
UPDATE schools 
SET negeri = 'Putrajaya' 
WHERE LOWER(negeri) LIKE '%putrajaya%' 
   OR negeri = 'W.P. Putrajaya'
   OR negeri = 'WP Putrajaya'
   OR negeri = 'WILAYAH PERSEKUTUAN PUTRAJAYA';

-- Also fix any remaining Pulau Pinang variations
UPDATE schools 
SET negeri = 'Pulau Pinang' 
WHERE LOWER(negeri) LIKE '%pulau pinang%' 
   OR negeri = 'Pulau pinang';

-- Verify the changes
SELECT negeri, COUNT(*) as count 
FROM schools 
WHERE negeri IS NOT NULL 
GROUP BY negeri 
ORDER BY negeri;

-- Check for cities in these states
SELECT negeri, COUNT(DISTINCT bandar) as city_count
FROM schools 
WHERE negeri IN ('Pulau Pinang', 'Kuala Lumpur', 'Labuan', 'Putrajaya')
GROUP BY negeri;