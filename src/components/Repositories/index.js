import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {GoStar} from 'react-icons/go'
import {BiGitRepoForked} from 'react-icons/bi'

import Header from '../Header'
import SearchContext from '../../context/SearchContext'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
  emptyUsername: 'EMPTY_USERNAME',
  noData: 'NO_DATA',
}

class Repositories extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    reposData: [],
    ownerData: {},
  }

  componentDidMount() {
    this.getRepositoriesData()
  }

  getRepositoriesData = async () => {
    const {username, apiToken} = this.context

    if (!username || username.trim() === '') {
      this.setState({apiStatus: apiStatusConstants.emptyUsername})
      return
    }

    this.setState({apiStatus: apiStatusConstants.inProgress})

    const apiUrl = `https://apis2.ccbp.in/gpv/repos/${username}?api_key=${apiToken}`
    const response = await fetch(apiUrl)

    if (response.ok) {
      const data = await response.json()

      if (data.length === 0) {
        this.setState({apiStatus: apiStatusConstants.noData})
        return
      }

      // Extract owner data from the first repo
      const ownerInfo = data[0].owner
      const formattedOwner = {
        login: ownerInfo.login,
        avatarUrl: ownerInfo.avatar_url,
      }

      const formattedRepos = data.map(repo => ({
        id: repo.id,
        name: repo.name,
        description: repo.description, // Added description so it shows up!
        languages: repo.languages || [],
        stargazersCount: repo.stargazers_count,
        forksCount: repo.forks_count,
      }))

      this.setState({
        reposData: formattedRepos,
        ownerData: formattedOwner,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onRetry = () => {
    this.getRepositoriesData()
  }

  renderLoadingView = () => (
    <div className="status-container" data-testid="loader">
      <Loader type="TailSpin" color="#3B82F6" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div className="status-container">
      <img
        src="https://res.cloudinary.com/dakquidzb/image/upload/v1777963476/Group_7522errorView_wkqa35.png"
        alt="failure view"
        className="status-image"
      />
      <p className="failure-text">Something went wrong. Please try again</p>
      <Link to="/">
        <button type="button" className="retry-button" onClick={this.onRetry}>
          Try Again
        </button>
      </Link>
    </div>
  )

  renderEmptyUsernameView = () => (
    <div className="status-container">
      <img
        src="https://res.cloudinary.com/dakquidzb/image/upload/v1777963475/Empty_Box_Illustration_1noData_y0o5wa.png"
        alt="empty repositories"
        className="status-image"
      />
      <h1 className="repositories-status-title">No Data Found</h1>
      <p className="empty-text">
        GitHub username is empty, please provide a valid username for
        Repositories
      </p>
      <Link to="/">
        <button type="button" className="retry-button">
          Go to Home
        </button>
      </Link>
    </div>
  )

  renderNoDataView = () => (
    <div className="status-container">
      <img
        src="https://res.cloudinary.com/dakquidzb/image/upload/v1777963475/Layer_3norepo_nhz36i.png"
        alt="no repositories"
        className="status-image"
      />
      <h1 className="repositories-status-title">No Repositories Found</h1>
    </div>
  )

  renderSuccessView = () => {
    const {reposData, ownerData} = this.state

    return (
      <div className="repositories-success-container">
        <h1 className="repositories-page-title">Repositories</h1>

        <ul className="repositories-list-container">
          {reposData.map(repo => (
            <li key={repo.id} className="repo-card-item">
              <Link
                to={`/repositories/${repo.name}`}
                className="repo-card-link"
              >
                {/* CSS maps the avatar and title to be inside a header! */}
                <div className="repo-card-header">
                  <img
                    src={ownerData.avatarUrl}
                    alt={ownerData.login}
                    className="repo-owner-avatar"
                  />
                  <h1 className="repo-title">{repo.name}</h1>
                </div>

                <p className="repo-description">{repo.description}</p>

                {/* CSS Maps the languages to colorful pills */}
                <ul className="repo-languages-list">
                  {repo.languages.map((lang, index) => {
                    const langName = lang.name || lang
                    return (
                      <li
                        key={langName}
                        className={`language-pill lang-color-${index % 5}`}
                      >
                        {langName}
                      </li>
                    )
                  })}
                </ul>

                <div className="repo-stats-container">
                  <div className="stat-item">
                    <GoStar className="stat-icon star-icon" />
                    <p className="stat-text">{repo.stargazersCount}</p>
                  </div>
                  <div className="stat-item">
                    <BiGitRepoForked className="stat-icon fork-icon" />
                    <p className="stat-text">{repo.forksCount}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderReposStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.emptyUsername:
        return this.renderEmptyUsernameView()
      case apiStatusConstants.noData:
        return this.renderNoDataView()
      default:
        return null
    }
  }

  render() {
    const {apiStatus} = this.state
    const showMenu = apiStatus !== apiStatusConstants.inProgress

    return (
      <div className="repositories-route-container">
        <Header showMenu={showMenu} />
        <div className="repositories-content-container">
          {this.renderReposStatus()}
        </div>
      </div>
    )
  }
}

Repositories.contextType = SearchContext

export default Repositories
