const fetchPPDData = async () => {
  try {
    // Fetch filter options from server first (includes negeri counts)
    await schoolStore.fetchFilterOptions()
    const filterData = schoolStore.filterOptions
    
    // Set negeri options from server
    negeriOptions.value = filterData.negeris || []
    
    // Fetch schools for PPD-city and negeri-PPD relationships
    await schoolStore.fetchSchools({ limit: 10000 })
    const schools = schoolStore.schools
    
    const data = {} // ppd -> cities
    const negeriPPDMap = {} // negeri -> ppds
    const countsByCity = {}
    const ppdSet = new Set()
    
    schools.forEach(school => {
      if (school.ppd) {
        ppdSet.add(school.ppd)
        
        if (school.negeri) {
          if (!negeriPPDMap[school.negeri]) {
            negeriPPDMap[school.negeri] = new Set()
          }
          negeriPPDMap[school.negeri].add(school.ppd)
        }
        
        if (school.bandar) {
          if (!data[school.ppd]) {
            data[school.ppd] = new Set()
          }
          data[school.ppd].add(school.bandar)
          
          const cityKey = `${school.ppd}-${school.bandar}`
          countsByCity[cityKey] = (countsByCity[cityKey] || 0) + 1
        }
      }
    })
    
    ppdOptions.value = Array.from(ppdSet).sort()
    
    ppdCityData.value = {}
    Object.keys(data).forEach(ppd => {
      ppdCityData.value[ppd] = Array.from(data[ppd]).sort()
    })
    
    Object.keys(negeriPPDMap).forEach(negeri => {
      negeriPPDMap[negeri] = Array.from(negeriPPDMap[negeri]).sort()
    })
    
    negeriToPPDMap.value = negeriPPDMap
    
    schoolCounts.value = {
      byState: filterData.negeriCounts || {},
      byCity: countsByCity
    }
  } catch (error) {
    console.error('Error fetching school data:', error)
  }
}