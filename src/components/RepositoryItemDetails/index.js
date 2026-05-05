import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {GoStar} from 'react-icons/go'
import {BiGitRepoForked} from 'react-icons/bi'
import {PieChart, Pie, Cell, Legend, ResponsiveContainer} from 'recharts'

import Header from '../Header'
import SearchContext from '../../context/SearchContext'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444']

class RepositoryItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    repoData: {},
  }

  componentDidMount() {
    this.getRepositoryDetails()
  }

  getRepositoryDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {repoName} = params
    const {username, apiToken} = this.context

    if (username === '') {
      this.setState({apiStatus: apiStatusConstants.failure})
      return
    }

    this.setState({apiStatus: apiStatusConstants.inProgress})

    const apiUrl = `https://apis2.ccbp.in/gpv/specific-repo/${username}/${repoName}?api_key=${apiToken}`
    const response = await fetch(apiUrl)

    if (response.ok) {
      const data = await response.json()

      const safeLanguages = data.lanuages || []
      const safeContributors = data.contributors || []

      const formattedData = {
        name: data.name,
        description: data.description,
        languages: safeLanguages,
        lanuages: safeLanguages,
        stargazersCount: data.stargazers_count,
        forksCount: data.forks_count,
        watchersCount: data.watchers_count,
        openIssuesCount: data.open_issues_count,
        contributors: safeContributors.map(contributor => ({
          id: contributor.id,
          avatarUrl: contributor.avatar_url,
          login: contributor.login,
        })),
        languagesChartData: safeLanguages.map(lang => ({
          name: lang.name || lang,
          value: lang.value || 10,
        })),
      }

      this.setState({
        repoData: formattedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onRetry = () => {
    this.getRepositoryDetails()
  }

  renderLoadingView = () => (
    <div className="status-container" data-testid="loader">
      <Loader type="TailSpin" color="#3B82F6" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div className="status-container">
      <h1 className="landing-title">Github Profile Visualizer</h1>
      <img
        src="https://res.cloudinary.com/dakquidzb/image/upload/v1777963476/Group_7522errorView_wkqa35.png"
        alt="failure view"
        className="status-image"
      />
      <p className="failure-text">Something went wrong. Please try again</p>
      <button type="button" className="retry-button" onClick={this.onRetry}>
        Try Again
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {repoData} = this.state
    const {
      name,
      description,
      languages,
      stargazersCount,
      forksCount,
      watchersCount,
      openIssuesCount,
      contributors,
      languagesChartData,
    } = repoData

    return (
      <div className="repo-details-success-container">
        <div className="details-header-card">
          <h1 className="details-repo-title">{name}</h1>
          <p className="details-repo-description">
            {description || 'No description provided.'}
          </p>

          <ul className="details-languages-list">
            {languages.map((lang, index) => (
              <li
                key={lang.name || lang}
                className={`language-pill lang-color-${index % 5}`}
              >
                {lang.name || lang}
              </li>
            ))}
          </ul>

          <div className="details-stats-row">
            <div className="details-stat-item">
              <GoStar className="stat-icon star-icon" />
              <p className="stat-text">{stargazersCount}</p>
            </div>
            <div className="details-stat-item">
              <BiGitRepoForked className="stat-icon fork-icon" />
              <p className="stat-text">{forksCount}</p>
            </div>
          </div>
        </div>

        <div className="counts-container">
          <div className="count-box">
            <p className="count-label">Watchers Counts</p>
            <p className="count-value">{watchersCount || 0}</p>
          </div>
          <div className="count-box">
            <p className="count-label">Issues Counts</p>
            <p className="count-value">{openIssuesCount || 0}</p>
          </div>
        </div>

        <div className="contributors-container">
          <h1 className="section-subtitle">Contributors</h1>
          <p className="contributors-count">{contributors.length} Members</p>

          <ul className="contributors-avatar-list">
            {contributors.slice(0, 5).map(contributor => (
              <li key={contributor.id} className="contributor-avatar-item">
                <img
                  src={contributor.avatarUrl}
                  alt="contributor profile"
                  className="contributor-avatar-img"
                />
              </li>
            ))}
            {contributors.length > 5 && (
              <li className="contributor-avatar-item extra-count-badge">
                +{contributors.length - 5}
              </li>
            )}
          </ul>
        </div>

        <div className="chart-container">
          <h1 className="section-subtitle">Languages</h1>
          {languagesChartData.length > 0 ? (
            <div className="pie-chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={languagesChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius="50%"
                    outerRadius="80%"
                    dataKey="value"
                  >
                    {languagesChartData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend
                    iconType="square"
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    wrapperStyle={{color: '#cbd5e1', fontSize: '14px'}}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="failure-text">No language data available.</p>
          )}
        </div>
      </div>
    )
  }

  renderDetailsStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
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
    const {apiStatus} = this.state
    const showMenu = apiStatus !== apiStatusConstants.inProgress

    return (
      <div className="details-route-container">
        <Header showMenu={showMenu} />
        <div className="details-content-container">
          {this.renderDetailsStatus()}
        </div>
      </div>
    )
  }
}

RepositoryItemDetails.contextType = SearchContext

export default RepositoryItemDetails
