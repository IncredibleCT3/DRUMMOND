function Dashboard() {
    return <>
        <div className = "dashboard-main-content">
            <div className="dashboard-content">

                <div className="title-and-logout-container">
                    <p className = "title-game">STARTING 5 BATTLES</p>
                    <button>LOG OUT</button>
                </div>
                <hr></hr>

                <div className="high-score-container">
                    <p className = "high-score-this-week-textview">HIGH SCORES THIS WEEK</p>

                </div>
            </div>
        </div>
        </>
    
}

export default Dashboard;
