import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {HiOutlineSearch} from 'react-icons/hi'
import {RiBuildingLine} from 'react-icons/ri'
import {MdLocationOn} from 'react-icons/md'
import {IoMdLink} from 'react-icons/io'
import Header from '../Header'
import SearchContext from '../../context/SearchContext'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {
    searchInput: '',
    apiStatus: apiStatusConstants.initial,
    profileData: {},
    showError: false,
  }

  componentDidMount() {
    const {username} = this.context
    if (username !== '') {
      this.setState({searchInput: username})
      this.getProfileData(username)
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value, showError: false})
  }

  onSearchProfile = () => {
    const {searchInput} = this.state
    const {onChangeUsername} = this.context

    if (searchInput === '') {
      this.setState({showError: true})
      return
    }

    onChangeUsername(searchInput)
    this.getProfileData(searchInput)
  }

  onClickTryAgain = () => {
    this.setState({
      apiStatus: apiStatusConstants.initial,
      searchInput: '',
      showError: false,
    })
  }

  getProfileData = async searchedUser => {
    const {apiToken} = this.context
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const apiUrl = `https://apis2.ccbp.in/gpv/profile-details/${searchedUser}?api_key=${apiToken}`
    const response = await fetch(apiUrl)

    if (response.ok) {
      const data = await response.json()
      const formattedData = {
        name: data.name || '',
        login: data.login || '',
        avatarUrl: data.avatar_url || '',
        bio: data.bio || '',
        followers: data.followers || 0,
        following: data.following || 0,
        publicRepos: data.public_repos || 0,
        company: data.company || 'No Company',
        blog: data.blog || 'No Blog',
        location: data.location || 'No Location',
      }
      this.setState({
        profileData: formattedData,
        apiStatus: apiStatusConstants.success,
        showError: false,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure, showError: true})
    }
  }

  renderInitialView = () => (
    <div className="status-container">
      <h1 className="landing-title">GitHub Profile Visualizer</h1>
      <img
        src="https://res.cloudinary.com/dakquidzb/image/upload/v1777963476/Group_2home_page_np24nj.png"
        alt="github profile visualizer home page"
        className="status-image"
      />
    </div>
  )

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
      <button
        type="button"
        className="retry-button"
        onClick={this.onClickTryAgain}
      >
        Try Again
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {profileData} = this.state
    const {
      name,
      login,
      avatarUrl,
      bio,
      followers,
      following,
      publicRepos,
      company,
      blog,
      location,
    } = profileData

    return (
      <div className="profile-card-container">
        <img src={avatarUrl} alt={name} className="profile-avatar" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-login">{login}</p>
        <p className="profile-bio-label">BIO</p>
        <p className="profile-bio">{bio}</p>

        <div className="profile-stats-container">
          <div className="stat-box">
            <p className="stat-value">{followers}</p>
            <p className="stat-label">FOLLOWERS</p>
          </div>

          <div className="stat-separator" />

          <div className="stat-box">
            <p className="stat-value">{following}</p>
            <p className="stat-label">FOLLOWING</p>
          </div>

          <div className="stat-separator" />

          <div className="stat-box">
            <p className="stat-value">{publicRepos}</p>
            <p className="stat-label">PUBLIC REPOS</p>
          </div>
        </div>

        <div className="profile-details-container">
          <div className="detail-block company-block">
            <p className="detail-block-title">Company</p>
            <div className="detail-item">
              <RiBuildingLine className="detail-icon" />
              <p className="detail-text">{company}</p>
            </div>
          </div>
          <div className="detail-block url-block">
            <p className="detail-block-title">Blog</p>
            <div className="detail-item">
              <IoMdLink className="detail-icon" />
              <a
                href={blog}
                target="_blank"
                rel="noreferrer"
                className="detail-text blog-link"
              >
                {blog}
              </a>
            </div>
          </div>
          <div className="detail-block location-block">
            <p className="detail-block-title">Location</p>
            <div className="detail-item">
              <MdLocationOn className="detail-icon" />
              <p className="detail-text">{location}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderHomeStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.initial:
        return this.renderInitialView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {searchInput, showError} = this.state
    return (
      <div className="home-route-container">
        <Header />
        <div className="home-content-container">
          <div className="search-wrapper">
            <div
              className={`search-bar-container ${
                showError ? 'search-bar-error' : ''
              }`}
            >
              <input
                type="search"
                className="search-input"
                placeholder="Enter github username"
                value={searchInput}
                onChange={this.onChangeSearchInput}
              />
              <button
                type="button"
                className="search-button"
                data-testid="searchButton"
                onClick={this.onSearchProfile}
                aria-label="search"
              >
                <HiOutlineSearch className="search-icon" />
              </button>
            </div>
            {showError && (
              <p className="error-message">Enter the valid github username</p>
            )}
          </div>
          {this.renderHomeStatus()}
        </div>
      </div>
    )
  }
}

Home.contextType = SearchContext

export default Home
