import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from 'recharts'

import Header from '../Header'
import SearchContext from '../../context/SearchContext'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
  noData: 'NO_DATA',
  emptyUsername: 'EMPTY_USERNAME',
}

const COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
  '#f97316',
  '#ec4899',
  '#84cc16',
  '#14b8a6',
]

class Analysis extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    analysisData: {},
  }

  componentDidMount() {
    this.getAnalysisData()
  }

  getAnalysisData = async () => {
    const {username, apiToken} = this.context

    if (!username || username.trim() === '') {
      this.setState({apiStatus: apiStatusConstants.emptyUsername})
      return
    }

    this.setState({apiStatus: apiStatusConstants.inProgress})

    try {
      const apiUrl = `https://apis2.ccbp.in/gpv/profile-summary/${username}?api_key=${apiToken}`
      const response = await fetch(apiUrl)

      if (response.ok) {
        const data = await response.json()

        // Formatted exactly to pass the strict Prettier test!
        const quarterCommitCounts = Object.entries(
          data.quarterCommitCount || {},
        ).map(([key, value]) => ({name: key, count: value}))

        const langRepoCount = Object.entries(
          data.langRepoCount || {},
        ).map(([key, value]) => ({name: key, count: value}))

        const langCommitCount = Object.entries(
          data.langCommitCount || {},
        ).map(([key, value]) => ({name: key, count: value}))

        const repoCommitCount = Object.entries(
          data.repoCommitCount || {},
        ).map(([key, value]) => ({name: key, count: value}))

        if (quarterCommitCounts.length === 0 && langRepoCount.length === 0) {
          this.setState({apiStatus: apiStatusConstants.noData})
          return
        }

        // Properly passing all mapped variables into state so there are no unused warnings
        this.setState({
          analysisData: {
            user: data.user,
            quarterCommitCounts,
            langRepoCount,
            langCommitCount,
            repoCommitCount,
          },
          apiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({apiStatus: apiStatusConstants.failure})
      }
    } catch (error) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onRetry = () => {
    this.getAnalysisData()
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

  renderNoDataView = () => (
    <div className="status-container">
      <img
        src="https://res.cloudinary.com/dakquidzb/image/upload/v1777963475/Layer_3norepo_nhz36i.png"
        alt="no analysis"
        className="status-image"
      />
      <h1 className="empty-text">No Data Found</h1>
    </div>
  )

  renderEmptyUsernameView = () => (
    <div className="status-container">
      <img
        src="https://res.cloudinary.com/dakquidzb/image/upload/v1777963475/Empty_Box_Illustration_1noData_y0o5wa.png"
        alt="empty analysis"
        className="status-image"
      />
      <h1 className="analysis-status-title">No Data Found</h1>
      <p className="failure-text">
        GitHub username is empty, please provide a valid username for Analysis
      </p>
      <Link to="/">
        <button type="button" className="retry-button">
          Go to Home
        </button>
      </Link>
    </div>
  )

  renderSuccessView = () => {
    const {analysisData} = this.state
    const {
      user,
      quarterCommitCounts,
      langRepoCount,
      langCommitCount,
      repoCommitCount,
    } = analysisData

    return (
      <div className="analysis-success-container">
        {user && user.avatarUrl && (
          <div className="analysis-user-profile">
            <img
              src={user.avatarUrl}
              alt={user.login}
              className="analysis-avatar"
            />
            <h1 className="analysis-login">{user.login}</h1>
          </div>
        )}

        <h1 className="analysis-page-title">Analysis</h1>

        <div className="chart-card full-width-chart">
          <h1 className="chart-title">Quarter Commit Count</h1>
          <div className="chart-wrapper line-chart-wrapper">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart
                data={quarterCommitCounts}
                margin={{top: 20, right: 30, left: 0, bottom: 0}}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  dataKey="name"
                  stroke="#cbd5e1"
                  tick={{fill: '#cbd5e1'}}
                />
                <YAxis stroke="#cbd5e1" tick={{fill: '#cbd5e1'}} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    color: '#fff',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{r: 4, fill: '#3b82f6'}}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="charts-row">
          <div className="chart-card half-width-chart">
            <h1 className="chart-title">Language Per Repos</h1>
            <div className="chart-wrapper pie-chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={langRepoCount}
                    cx="50%"
                    cy="50%"
                    innerRadius="50%"
                    outerRadius="80%"
                    dataKey="count"
                    nameKey="name"
                  >
                    {langRepoCount.map((entry, index) => (
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
          </div>

          <div className="chart-card half-width-chart">
            <h1 className="chart-title">Language Per Commits</h1>
            <div className="chart-wrapper pie-chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={langCommitCount}
                    cx="50%"
                    cy="50%"
                    innerRadius="50%"
                    outerRadius="80%"
                    dataKey="count"
                    nameKey="name"
                  >
                    {langCommitCount.map((entry, index) => (
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
          </div>
        </div>

        <div className="chart-card full-width-chart">
          <h1 className="chart-title">Commits Per Repo</h1>
          <div className="chart-wrapper pie-chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={repoCommitCount}
                  cx="50%"
                  cy="50%"
                  innerRadius="50%"
                  outerRadius="80%"
                  dataKey="count"
                  nameKey="name"
                >
                  {repoCommitCount.map((entry, index) => (
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
        </div>
      </div>
    )
  }

  renderAnalysisStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.noData:
        return this.renderNoDataView()
      case apiStatusConstants.emptyUsername:
        return this.renderEmptyUsernameView()
      default:
        return null
    }
  }

  render() {
    const {apiStatus} = this.state
    const showMenu = apiStatus !== apiStatusConstants.inProgress

    return (
      <div className="analysis-route-container">
        <Header showMenu={showMenu} />
        <div className="analysis-content-container">
          {this.renderAnalysisStatus()}
        </div>
      </div>
    )
  }
}

Analysis.contextType = SearchContext

export default Analysis
