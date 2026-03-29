import React from 'react'

const SearchContext = React.createContext({
  username: '',
  apiToken: process.env.REACT_APP_GITHUB_TOKEN,
  onChangeUsername: () => {},
})

export default SearchContext
