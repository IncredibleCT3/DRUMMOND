import "../css/Login.css"
import { useNavigate } from 'react-router-dom';
import { useState } from 'react'

function Login() {
    const navigate = useNavigate();
    const [isCreatingAccount, setIsCreatingAccount] = useState(false);

    function redirectToHome() {
        navigate('/');
    }

    function toggleAccountMode() {
        setIsCreatingAccount(!isCreatingAccount);
    }

  return <>
    <div className="login-main-container">
        <div className="login-page-container">

            <div className="title-container">
                <h1 className="title">DRUMMOND</h1>
                <p className = "title-of-game">STARTING 5 BATTLES</p>
            </div>

            <div className = "login-container">
                <div className="login-textview">
                    {isCreatingAccount ? 'CREATE ACCOUNT' : 'LOGIN'}
                </div>

                <div className = "username-container">
                    <p className = "username-textview">Username</p>
                    <input className="username" type = "text"></input>
                </div>

                <div className = "password-container">
                    <p className = "password-textview">Password</p>
                    <input className="password" type = "password"></input>
                </div>

                {isCreatingAccount && (
                    <div className="password-container">
                        <p className="password-textview">Confirm Password</p>
                        <input className="password" type="password"></input>
                    </div>
                )}

                <button className="enter-game-button"> 
                    {isCreatingAccount ? 'CREATE ACCOUNT' : 'ENTER GAME'}
                </button>

                <button className="create-account-button" onClick={toggleAccountMode}>
                    {isCreatingAccount ? 'BACK TO LOGIN' : 'CREATE ACCOUNT'}
                </button>

                <button className="back-to-menu-button" onClick={redirectToHome}>BACK TO MENU</button>


            </div>
        </div>
    </div>
  </>
}

export default Login