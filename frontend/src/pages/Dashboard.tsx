import "../css/Dashboard.css"
function Dashboard() {
    return <>
        <div className = "dashboard-main-content">
            <div className="dashboard-content">

                <div className="title-and-menu-container">
                    <p className = "title-game">STARTING 5 BATTLES</p>
                    <button>BACK TO MENU</button>
                </div>
                <hr className="dashboard-hr"></hr>

                <div className="high-scores-container">
                    <p className = "high-score-this-week-textview">HIGH SCORES THIS WEEK</p>

                    <div className = "high-score-player-record">
                        <div className="high-score-contents">
                            <div className="rank">
                                #1
                            </div>

                            <div className="player-name-and-date-container">
                                <p className = "player-name">PistonsPro</p>
                                <p className = "date-achieved">Dec 29</p>
                            </div>

                            <div className="score-container">
                                <p className="score-textview">SCORE</p>
                                <p className="score">1,234</p>
                            </div>
                        </div>
                    </div>

                      <div className = "high-score-player-record">
                        <div className="high-score-contents">
                            <div className="rank">
                                #2
                            </div>

                            <div className="player-name-and-date-container">
                                <p className = "player-name">PistonsPro</p>
                                <p className = "date-achieved">Dec 29</p>
                            </div>

                            <div className="score-container">
                                <p className="score-textview">SCORE</p>
                                <p className="score">1,234</p>
                            </div>
                        </div>
                    </div>

                      <div className = "high-score-player-record">
                        <div className="high-score-contents">
                            <div className="rank">
                                #3
                            </div>

                            <div className="player-name-and-date-container">
                                <p className = "player-name">PistonsPro</p>
                                <p className = "date-achieved">Dec 29</p>
                            </div>

                            <div className="score-container">
                                <p className="score-textview">SCORE</p>
                                <p className="score">1,234</p>
                            </div>
                        </div>
                    </div>

                      <div className = "high-score-player-record">
                        <div className="high-score-contents">
                            <div className="rank">
                                #4
                            </div>

                            <div className="player-name-and-date-container">
                                <p className = "player-name">PistonsPro</p>
                                <p className = "date-achieved">Dec 29</p>
                            </div>

                            <div className="score-container">
                                <p className="score-textview">SCORE</p>
                                <p className="score">1,234</p>
                            </div>
                        </div>
                    </div>

                      <div className = "high-score-player-record">
                        <div className="high-score-contents">
                            <div className="rank">
                                #5
                            </div>

                            <div className="player-name-and-date-container">
                                <p className = "player-name">PistonsPro</p>
                                <p className = "date-achieved">Dec 29</p>
                            </div>

                            <div className="score-container">
                                <p className="score-textview">SCORE</p>
                                <p className="score">1,234</p>
                            </div>
                        </div>
                    </div>   
                </div>

                <div className="ready-to-play-container">
                    <p className="ready-to-play-textview">READY TO PLAY?</p>
                    <p className = "ready-to-play-info">Test your basketball knowledge and climb the leaderboard!</p>
                    <button className="start-new-game-button">START NEW GAME</button>
                </div>
            </div>
        </div>
        </>
    
}

export default Dashboard;
