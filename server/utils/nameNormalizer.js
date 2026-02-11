/**
 * Smart Name Normalization Utility
 * Handles all variations of Malaysian state (negeri) and city (bandar) names
 */

// Negeri (State) Name Normalization Map
const negeriNormalizationMap = {
  'Kuala Lumpur': [
    'kuala lumpur', 'k.l.', 'k.l', 'kl', 'wp kl', 'wpkualalumpur', 'wp kuala lumpur',
    'wilayah persekutuan kuala lumpur', 'wilayah persekutuan kl', 'w.p. kuala lumpur',
    'w.p kuala lumpur', 'w.p.kuala lumpur', 'w p kuala lumpur', 'wpkuala lumpur',
    'wlkuala lumpur', 'w.l. kuala lumpur', 'wilaya persekutuan kuala lumpur',
    'wilayah persekutuan k.l', 'wp k.l', 'w.p.k.l', 'kuala lumpur wp', 'kl wp',
    'kuala lumpur wilayah persekutuan', 'k.l. wp', 'kl w.p.', 'kuala lumpur (wp)',
    'k.l. (wp)', 'kl (wp)', 'k.l(wp)', 'kl(wp)'
  ],
  
  'Labuan': [
    'labuan', 'wp labuan', 'w.p. labuan', 'w.p labuan', 'wplabuan', 'wilayah persekutuan labuan',
    'wilaya persekutuan labuan', 'w.p.labuan', 'w p labuan', 'wllabuan', 'w.l. labuan',
    'wp labuan', 'labuan wp', 'labuan w.p.', 'labuan wilayah persekutuan', 'labuan (wp)',
    'labuan (w.p.)', 'labuanwp', 'labuanw.p.'
  ],
  
  'Putrajaya': [
    'putrajaya', 'wp putrajaya', 'w.p. putrajaya', 'w.p putrajaya', 'wpputrajaya',
    'wilayah persekutuan putrajaya', 'wilaya persekutuan putrajaya', 'w.p.putrajaya',
    'w p putrajaya', 'wlputrajaya', 'w.l. putrajaya', 'wp putrajaya', 'putrajaya wp',
    'putrajaya w.p.', 'putrajaya wilayah persekutuan', 'putrajaya (wp)',
    'putrajaya (w.p.)', 'putrajayawp', 'putrajayaw.p.'
  ],
  
  'Pulau Pinang': [
    'pulau pinang', 'penang', 'p.pinang', 'p. pinang', 'pp', 'pulau pinang', 'pulau pinang',
    'p pinang', 'pinang', 'pulau pinang', 'penang island', 'pinang island',
    'pulau pinang', 'pulau pinang', 'penang', 'p.pinang', 'p. pinang', 'pp',
    'p pinang', 'pinang', 'penang island', 'pinang island'
  ],
  
  'Negeri Sembilan': [
    'negeri sembilan', 'n.sembilan', 'n. sembilan', 'n sembilan', 'ns', 'negeri 9',
    'negeri sembilan', 'negeri sembilan', 'negeri sembilan', 'sembilan', 'n9',
    'negeri 9', 'negeri sembilan', 'n.sembilan', 'n. sembilan', 'n sembilan',
    'ns', 'sembilan'
  ],
  
  'Johor': ['johor', 'johore', 'johor darul takzim', 'jdt'],
  'Kedah': ['kedah', 'kedah darul aman'],
  'Kelantan': ['kelantan', 'kelantan darul naim'],
  'Melaka': ['melaka', 'malacca', 'malaka', 'melaka', 'melaka'],
  'Pahang': ['pahang', 'pahang darul makmur'],
  'Perak': ['perak', 'perak darul ridzuan'],
  'Perlis': ['perlis', 'perlis indah kayangan'],
  'Sabah': ['sabah', 'negeri di bawah bayu', 'north borneo'],
  'Sarawak': ['sarawak', 'bumi kenyalang', 'land of the hornbills'],
  'Selangor': ['selangor', 'selangor darul ehsan'],
  'Terengganu': ['terengganu', 'trengganu', 'terengganu darul iman']
};

// Bandar (City/Town) Name Normalization Patterns
// These are common patterns found in Malaysian addresses
const bandarNormalizationPatterns = {
  // Common prefixes and abbreviations
  prefixes: {
    'bdr': 'bandar',
    'bdr.': 'bandar',
    'bandr': 'bandar',
    'taman': 'taman',
    'tm': 'taman',
    'tm.': 'taman',
    'kpg': 'kampung',
    'kpg.': 'kampung',
    'kg': 'kampung',
    'kg.': 'kampung',
    'bkt': 'bukit',
    'bkt.': 'bukit',
    'bt': 'batu',
    'bt.': 'batu',
    'jln': 'jalan',
    'jln.': 'jalan',
    'jln ': 'jalan ',
    'pj': 'petaling jaya',
    'pj ': 'petaling jaya ',
    'usj': 'usj',
    'puchong': 'puchong',
    'cheras': 'cheras',
    'kl': 'kuala lumpur',
    'kl ': 'kuala lumpur ',
    'ampang': 'ampang',
    'gombak': 'gombak',
    'klang': 'klang',
    'shah alam': 'shah alam',
    'subang': 'subang',
    'subang jaya': 'subang jaya'
  },
  
  // City-specific common variations
  cities: {
    'Kuala Lumpur': [
      'kuala lumpur', 'kl', 'k.l.', 'k.l', 'kuala lumpur city',
      'kl city', 'w.p kuala lumpur', 'wilayah persekutuan kuala lumpur',
      'klcc', 'kuala lumpur city centre', 'city centre'
    ],
    'Petaling Jaya': [
      'petaling jaya', 'pj', 'p.j.', 'p.j', 'pj selangor',
      'petaling', 'bandar petaling jaya'
    ],
    'Subang Jaya': [
      'subang jaya', 'usj', 'subang', 'subang jaya selangor',
      'usj subang jaya'
    ],
    'Shah Alam': [
      'shah alam', 'shah alam selangor', 'bandar shah alam',
      'shah alam city'
    ],
    'Klang': [
      'klang', 'port klang', 'bandar klang', 'klang selangor',
      'pelabuhan klang'
    ],
    'Ampang': [
      'ampang', 'ampang selangor', 'ampang jaya', 'ampang kuala lumpur',
      'pandan indah', 'pandan jaya'
    ],
    'Cheras': [
      'cheras', 'cheras kuala lumpur', 'cheras selangor', 'bandar cheras',
      'cheras jaya', 'taman cheras'
    ],
    'Gombak': [
      'gombak', 'gombak selangor', 'bandar gombak', 'taman gombak'
    ],
    'Kajang': [
      'kajang', 'kajang selangor', 'bandar kajang', 'kajang utama'
    ],
    'Selayang': [
      'selayang', 'selayang baru', 'bandar selayang', 'selayang jaya'
    ],
    'Rawang': [
      'rawang', 'rawang selangor', 'bandar rawang', 'taman rawang'
    ],
    'Puchong': [
      'puchong', 'puchong selangor', 'bandar puchong', 'puchong jaya',
      'puchong utama', 'puchong perdana'
    ],
    'Cyberjaya': [
      'cyberjaya', 'cyberjaya selangor', 'cyberjaya putrajaya'
    ],
    'Putrajaya': [
      'putrajaya', 'bandar putrajaya', 'putrajaya wilayah persekutuan',
      'precinct', 'presint'
    ],
    'Ipoh': [
      'ipoh', 'ipoh perak', 'bandar ipoh', 'ipoh city'
    ],
    'Georgetown': [
      'georgetown', 'george town', 'georgetown pulau pinang',
      'george town pulau pinang'
    ],
    'Bayan Lepas': [
      'bayan lepas', 'bayan lepas pulau pinang', 'bayan baru',
      'bayan lepas industrial'
    ],
    'Butterworth': [
      'butterworth', 'butterworth pulau pinang', 'bagan luar',
      'butterworth penang'
    ],
    'Johor Bahru': [
      'johor bahru', 'jb', 'j.b.', 'johor bahru city',
      'bandar johor bahru', 'jb city', 'johor baru'
    ],
    'Skudai': [
      'skudai', 'skudai johor', 'taman skudai', 'skudai baru'
    ],
    'Muar': [
      'muar', 'bandar maharani', 'muar johor', 'bandar muar'
    ],
    'Batu Pahat': [
      'batu pahat', 'batu pahat johor', 'bandar batu pahat',
      'bp', 'b.p.'
    ],
    'Kluang': [
      'kluang', 'kluang johor', 'bandar kluang', 'kluang town'
    ],
    'Kota Bharu': [
      'kota bharu', 'kota bahru', 'kota bharu kelantan',
      'kb', 'k.b.', 'kota bharu city'
    ],
    'Kuala Terengganu': [
      'kuala terengganu', 'kuala terengganu terengganu', 'kuala trengganu',
      'kt', 'k.t.', 'kt terengganu'
    ],
    'Kuantan': [
      'kuantan', 'kuantan pahang', 'bandar kuantan', 'kuantan city'
    ],
    'Kota Kinabalu': [
      'kota kinabalu', 'kk', 'k.k.', 'kk sabah', 'kota kinabalu sabah'
    ],
    'Sandakan': [
      'sandakan', 'sandakan sabah', 'bandar sandakan'
    ],
    'Kuching': [
      'kuching', 'kuching sarawak', 'bandar kuching', 'kuching city'
    ],
    'Miri': [
      'miri', 'miri sarawak', 'bandar miri', 'miri city'
    ],
    'Sibu': [
      'sibu', 'sibu sarawak', 'bandar sibu'
    ],
    'Alor Setar': [
      'alor setar', 'alor star', 'alor setar kedah', 'bandar alor setar'
    ],
    'Sungai Petani': [
      'sungai petani', 'sungai petani kedah', 'sg petani', 'sg. petani'
    ],
    'Kangar': [
      'kangar', 'kangar perlis', 'bandar kangar'
    ],
    'Seremban': [
      'seremban', 'seremban negeri sembilan', 'bandar seremban',
      'seremban 2', 'seremban jaya'
    ],
    'Port Dickson': [
      'port dickson', 'pd', 'p.d.', 'port dickson negeri sembilan'
    ],
    'Nilai': [
      'nilai', 'nilai negeri sembilan', 'bandar nilai', 'nilai impian'
    ],
    'Melaka': [
      'melaka', 'malacca', 'bandar melaka', 'malaka', 'melaka city',
      'bandaraya melaka', 'bandaraya malacca'
    ],
    'Ayer Keroh': [
      'ayer keroh', 'air keroh', 'ayer keroh melaka', 'air keroh melaka'
    ],
    'Labuan': [
      'labuan', 'bandar labuan', 'labuan island', 'victoria labuan'
    ]
  }
};

/**
 * Preprocess text for normalization
 * @param {string} text - Input text
 * @returns {string} - Preprocessed text
 */
function preprocessText(text) {
  if (!text || typeof text !== 'string') return '';
  
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[\.]+/g, '.') // Normalize multiple dots
    .replace(/\s+/g, ' ') // Normalize multiple spaces
    .replace(/[^a-z0-9\s\.\-]/g, '') // Remove special characters except dots and hyphens
    .trim();
}

/**
 * Normalize negeri (state) name
 * @param {string} negeriName - Raw negeri name
 * @returns {string} - Normalized negeri name
 */
function normalizeNegeri(negeriName) {
  const processed = preprocessText(negeriName);
  if (!processed) return '';
  
  // Check each standard state
  for (const [standardName, variations] of Object.entries(negeriNormalizationMap)) {
    // Check exact match or inclusion
    for (const variation of variations) {
      const normalizedVariation = preprocessText(variation);
      
      // Exact match
      if (processed === normalizedVariation) {
        return standardName;
      }
      
      // Check if variation is a significant part of input (avoid false positives)
      if (normalizedVariation.length > 5) {
        if (processed.includes(normalizedVariation) || normalizedVariation.includes(processed)) {
          return standardName;
        }
      }
    }
  }
  
  // If no match found, apply title case
  return processed
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace(/\bWp\b/g, 'WP')
    .replace(/\bW\.p\b/g, 'W.P.')
    .replace(/\bKl\b/g, 'KL');
}

/**
 * Normalize bandar (city/town) name
 * @param {string} bandarName - Raw bandar name
 * @returns {string} - Normalized bandar name
 */
function normalizeBandar(bandarName) {
  const processed = preprocessText(bandarName);
  if (!processed) return '';
  
  // First check for exact city matches
  for (const [standardCity, variations] of Object.entries(bandarNormalizationPatterns.cities)) {
    for (const variation of variations) {
      const normalizedVariation = preprocessText(variation);
      
      if (processed === normalizedVariation) {
        return standardCity;
      }
      
      // Check if input contains the variation
      if (normalizedVariation.length > 3 && processed.includes(normalizedVariation)) {
        return standardCity;
      }
    }
  }
  
  // Apply prefix normalization
  let normalized = processed;
  for (const [prefix, replacement] of Object.entries(bandarNormalizationPatterns.prefixes)) {
    const prefixPattern = new RegExp(`^${prefix}\\b`, 'i');
    if (prefixPattern.test(normalized)) {
      normalized = normalized.replace(prefixPattern, replacement);
      break; // Only replace first matching prefix
    }
  }
  
  // Capitalize each word
  normalized = normalized
    .split(' ')
    .map(word => {
      // Keep small words lowercase unless they're the first word
      const smallWords = ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'in', 'of'];
      if (smallWords.includes(word.toLowerCase())) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
  
  // Handle special cases
  normalized = normalized
    .replace(/\bJln\b/g, 'Jalan')
    .replace(/\bBkt\b/g, 'Bukit')
    .replace(/\bKpg\b/g, 'Kampung')
    .replace(/\bKg\b/g, 'Kampung')
    .replace(/\bBdr\b/g, 'Bandar')
    .replace(/\bTm\b/g, 'Taman')
    .replace(/\bBt\b/g, 'Batu');
  
  return normalized;
}

/**
 * Normalize both negeri and bandar names from a school record
 * @param {Object} schoolData - School data object
 * @returns {Object} - School data with normalized names
 */
function normalizeSchoolLocation(schoolData) {
  return {
    ...schoolData,
    negeri: normalizeNegeri(schoolData.negeri || ''),
    bandar: normalizeBandar(schoolData.bandar || '')
  };
}

/**
 * Get list of all standard state names
 * @returns {string[]} - Array of standard state names
 */
function getStandardStates() {
  return Object.keys(negeriNormalizationMap);
}

/**
 * Get list of all standard city names
 * @returns {string[]} - Array of standard city names
 */
function getStandardCities() {
  return Object.keys(bandarNormalizationPatterns.cities);
}

/**
 * Check if a negeri name is valid
 * @param {string} negeriName - Negeri name to check
 * @returns {boolean} - True if valid
 */
function isValidNegeri(negeriName) {
  if (!negeriName) return false;
  const normalized = normalizeNegeri(negeriName);
  return getStandardStates().includes(normalized);
}

/**
 * Get normalization statistics
 * @param {Array} schools - Array of school objects
 * @returns {Object} - Statistics
 */
function getNormalizationStats(schools) {
  const stats = {
    total: schools.length,
    negeri: {
      normalized: 0,
      unrecognized: [],
      breakdown: {}
    },
    bandar: {
      normalized: 0,
      unrecognized: [],
      breakdown: {}
    }
  };
  
  schools.forEach(school => {
    // Negeri stats
    const normalizedNegeri = normalizeNegeri(school.negeri);
    if (isValidNegeri(school.negeri)) {
      stats.negeri.normalized++;
      stats.negeri.breakdown[normalizedNegeri] = (stats.negeri.breakdown[normalizedNegeri] || 0) + 1;
    } else {
      stats.negeri.unrecognized.push(school.negeri);
    }
    
    // Bandar stats
    const normalizedBandar = normalizeBandar(school.bandar);
    const standardCities = getStandardCities().map(c => c.toLowerCase());
    if (standardCities.includes(normalizedBandar.toLowerCase())) {
      stats.bandar.normalized++;
    } else if (normalizedBandar) {
      stats.bandar.unrecognized.push(school.bandar);
    }
  });
  
  return stats;
}

module.exports = {
  normalizeNegeri,
  normalizeBandar,
  normalizeSchoolLocation,
  getStandardStates,
  getStandardCities,
  isValidNegeri,
  getNormalizationStats,
  negeriNormalizationMap,
  bandarNormalizationPatterns
};