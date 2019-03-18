function handleResponse(response) {
  return response.json()
    .then(json => {
      if (response.ok) {
        return json
      } else {
        return Promise.reject(json)
      }
    })
}

const api = {
  data: 'api/data'
};

export const getChartByIndex = index => {
  return fetch(api.data + '/' + index)
      .then(handleResponse)
      .catch(console.error);
}
