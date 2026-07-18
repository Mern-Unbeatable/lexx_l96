// Add new course names to this array to extend the Host dropdown.
export const courseOptions = [
  'Abbey Hill',
  'Abbey Hotel',
  'Abbey Moor',
  'Abbeydale',
  'Abbeyleix',
  'Aberdare',
  'Aberdour',
  'Aberdovey',
  'Aberfeldy',
  'Aberfoyle',
  'Abergele',
  'Abernethy',
  'Abersoch',
  'Aberystwyth',
  'Aboyne',
  'Abridge',
  'Accrington And District',
  'Achill Island',
  'Adare Manor',
  'Addington Court (Academy)',
  'Addington Court (Championship)',
  'Addington Court (Falconwood)',
  'Addington Palace',
  'Addlethorpe (Skegness Golf Centre)',
  'Aigas',
  'Aintree (Grand National)',
  'Airdrie',
  'Akebar Park (Wensleydale)',
  'Aldeburgh (Championship)',
  'Aldeburgh (River)',
  'Aldenham (Church)',
  'Aldenham (Village)',
  'Alder Root',
  'Alderley Edge',
  'Aldersey Green',
  'Aldwickbury Park',
  'Alexander Park',
]

export const searchCourseOptions = (query) => {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) return courseOptions

  return courseOptions.filter((course) =>
    course.toLowerCase().includes(normalizedQuery),
  )
}
