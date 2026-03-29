import React from 'react'

const SearchContext = React.createContext({
  username: '',
  apiToken: '',
  onChangeUsername: () => {},
})

export default SearchContext
