import {Link} from 'react-router-dom'
import './index.css'

const NotFound = () => (
  <div className="not-found-container">
    <img
      src="https://res.cloudinary.com/dakquidzb/image/upload/v1777963476/Group_7519pageNotFound_g50x9f.png"
      alt="page not found"
      className="not-found-image"
    />
    <h1 className="not-found-title">PAGE NOT FOUND</h1>
    <p className="not-found-description">
      we are sorry, the page you requested could not be found Please go back to
      the homepage.
    </p>
    <Link to="/">
      <button type="button" className="go-home-button">
        Go to Home
      </button>
    </Link>
  </div>
)

export default NotFound
