import axios from 'axios'

const getHeaders = (params: any = {}) => {
  // const auth = sessionStorage.auth ? JSON.parse(sessionStorage.auth) : {};
  // if (!auth?.state?.token) {
  //   location.reload();
  // }
  let headers: any = { Accept: 'application/json' }
  //   if (auth?.state?.token) {
  //     headers["Authorization"] = `Bearer ${auth?.state?.token}`;
  //     if (params?.withOrganization) {
  //       headers["X-Organization"] = auth?.state?.group?.id;
  //     }
  //   }
  return headers
}

export const api = () =>
  axios.create({
    baseURL: '/api',
    headers: getHeaders(),
  })

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
