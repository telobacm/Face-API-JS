export function groupDataByPageAndSection(data: any) {
  const groupedData = []
  const tempData: any = {}

  data.forEach((item: any) => {
    const { page, section, description } = item

    if (!tempData[page]) {
      tempData[page] = {
        page: page,
        sections: [],
      }
    }

    const existingSectionIndex = tempData[page].sections.findIndex(
      (s: any) => s.name === section,
    )
    if (existingSectionIndex === -1) {
      tempData[page].sections.push({
        name: section,
        items: [item],
      })
    } else {
      tempData[page].sections[existingSectionIndex].items.push(item)
    }
  })

  for (const pageKey in tempData) {
    groupedData.push(tempData[pageKey])
  }

  return groupedData
}

export function groupByPage(data: any) {
  const groupedData = []
  const tempData: any = {}

  data.forEach((item: any) => {
    const { page } = item

    if (!tempData[page]) {
      tempData[page] = {
        page: page,
        items: [],
      }
    }

    tempData[page].items.push(item)
  })

  for (const pageKey in tempData) {
    groupedData.push(tempData[pageKey])
  }

  return groupedData
}

export function groupByCategory(data: any) {
  const groupedData = []
  const tempData: any = {}

  data.forEach((item: any) => {
    const { category } = item

    if (!tempData[category]) {
      tempData[category] = {
        category: category,
        items: [],
      }
    }

    tempData[category].items.push(item)
  })

  for (const categoryKey in tempData) {
    groupedData.push(tempData[categoryKey])
  }

  return groupedData
}

export function groupByAdvisor(data: any) {
  if (Array.isArray(data)) {
    const groupedData: any = {
      advisor: [],
      team: [],
    }

    data?.forEach((item: any) => {
      const { advisor } = item

      if (advisor === true) {
        groupedData.advisor.push(item)
      } else {
        groupedData.team.push(item)
      }
    })

    return groupedData
  } else {
    console.error('Data is not an array')
  }
}

export function groupDataBySection(data: any) {
  const groupedData: any = {}
  if (data?.length) {
    data?.forEach((item: any) => {
      const { section } = item

      if (!groupedData[section]) {
        groupedData[section] = []
      }

      groupedData[section].push(item)
    })
  }

  return !!Object.keys(groupedData).length ? groupedData : null
}

export function getFileName(fullFileName: any) {
  const parts = fullFileName.split('.')

  if (parts.length > 1) {
    parts.pop()
  }

  const fileNameWithoutExtension = parts.join('.')

  return fileNameWithoutExtension
}
