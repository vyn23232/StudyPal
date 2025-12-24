import './Header.css'
import studypalLogo from '../assets/studypalLogo.png'

function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <h1 className="logo">
            <img src={studypalLogo} alt="StudyPal Logo" className="logo-image" />
          </h1>
         
        </div>
      </div>
    </header>
  )
}

export default Header
