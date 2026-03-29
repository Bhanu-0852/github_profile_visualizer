import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {FiMenu} from 'react-icons/fi'
import SearchContext from '../../context/SearchContext'
import './index.css'

class Header extends Component {
  state = {
    isMobileMenuOpen: false,
  }

  toggleMobileMenu = () => {
    this.setState(prevState => ({
      isMobileMenuOpen: !prevState.isMobileMenuOpen,
    }))
  }

  render() {
    const {isMobileMenuOpen} = this.state
    const {location, showMenu = true} = this.props
    const currentPath = location.pathname

    return (
      <SearchContext.Consumer>
        {value => {
          const {username} = value
          // Logic: Hide hamburger on mobile if on the Landing Page (no username yet)
          const isLandingPage = currentPath === '/' && username === ''

          return (
            <nav className="header-container">
              <div className="header-nav-bar">
                <Link to="/" className="logo-link">
                  <h1 className="header-title">Github Profile Visualizer</h1>
                </Link>

                {showMenu && (
                  <div className="menu-controls-container">
                    <ul className="desktop-nav-menu">
                      <li>
                        <Link
                          to="/"
                          className={`nav-link ${
                            currentPath === '/' ? 'active-link' : ''
                          }`}
                        >
                          Home
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/repositories"
                          className={`nav-link ${
                            currentPath === '/repositories' ? 'active-link' : ''
                          }`}
                        >
                          Repositories
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/analysis"
                          className={`nav-link ${
                            currentPath === '/analysis' ? 'active-link' : ''
                          }`}
                        >
                          Analysis
                        </Link>
                      </li>
                    </ul>

                    {!isLandingPage && (
                      <button
                        type="button"
                        className="hamburger-button"
                        onClick={this.toggleMobileMenu}
                        aria-label="menu"
                      >
                        <FiMenu className="hamburger-icon" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {showMenu && isMobileMenuOpen && !isLandingPage && (
                <ul className="mobile-nav-menu">
                  <li>
                    <Link
                      to="/"
                      className={`mobile-nav-link ${
                        currentPath === '/' ? 'active-link' : ''
                      }`}
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/repositories"
                      className={`mobile-nav-link ${
                        currentPath === '/repositories' ? 'active-link' : ''
                      }`}
                    >
                      Repositories
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/analysis"
                      className={`mobile-nav-link ${
                        currentPath === '/analysis' ? 'active-link' : ''
                      }`}
                    >
                      Analysis
                    </Link>
                  </li>
                </ul>
              )}
            </nav>
          )
        }}
      </SearchContext.Consumer>
    )
  }
}

export default withRouter(Header)
