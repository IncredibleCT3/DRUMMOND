import "../css/Login.css"
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();

    function redirectToHome() {
        navigate('/');
    }

  return <>
    <div className="main-container">
        <div className="login-page-container">

            <div className="title-container">
                <h1 className="title">DRUMMOND</h1>
                <p className = "title-of-game">STARTING 5 BATTLES</p>
            </div>

            <div className = "login-container">
                <div className="login-textview">LOGIN</div>

                <div className = "username-container">
                    <p className = "username-textview">Username</p>
                    <input className="username" type = "text"></input>
                </div>

                <div className = "password-container">
                    <p className = "password-textview">Password</p>
                    <input className="password" type = "password"></input>
                </div>

                <button className="enter-game-button">ENTER GAME</button>

                <button className="create-account-button">CREATE ACCOUNT</button>

                <button className="back-to-menu-button" onClick={redirectToHome}>BACK TO MENU</button>


            </div>
        </div>
    </div>
  </>
}

export default Login