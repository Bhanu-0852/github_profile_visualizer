import {Component} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'
import SearchContext from './context/SearchContext'

import Home from './components/Home'
import Repositories from './components/Repositories'
import RepositoryItemDetails from './components/RepositoryItemDetails'
import Analysis from './components/Analysis'
import NotFound from './components/NotFound'

import './App.css'

class App extends Component {
  state = {username: ''}

  onChangeUsername = newUsername => {
    this.setState({username: newUsername})
  }

  render() {
    const {username} = this.state
    return (
      <SearchContext.Provider
        value={{
          username,
          apiToken: '',
          onChangeUsername: this.onChangeUsername,
        }}
      >
        <div className="app-container">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/repositories" component={Repositories} />
            <Route
              exact
              path="/repositories/:repoName"
              component={RepositoryItemDetails}
            />
            <Route exact path="/analysis" component={Analysis} />
            <Route path="/not-found" component={NotFound} />
            <Redirect to="/not-found" />
          </Switch>
        </div>
      </SearchContext.Provider>
    )
  }
}

export default App
