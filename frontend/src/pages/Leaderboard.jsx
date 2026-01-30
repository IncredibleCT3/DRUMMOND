import "../css/Leaderboard.css"
import { use, useState } from "react";
import { useEffect } from "react";

function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function loadUsers() {
      const res = await fetch("http://localhost:5206/Leaderboard");
      const data = await res.json();
      setUsers(data);
      console.log(data)
    }
    loadUsers();
  }, []);

  // Sample data - replace with actual data from your backend
  const topPlayers = [
    { name: "Player 1", score: 100 },
    { name: "Player 2", score: 95 },
    { name: "Player 3", score: 90 },
    { name: "Player 4", score: 85 },
    { name: "Player 5", score: 80 },
  ];

  const leaderboardData = [
    { rank: 1, name: "Mark", score: 100 },
    { rank: 2, name: "John", score: 95 },
    { rank: 3, name: "James", score: 90 },
    { rank: 4, name: "Connor", score: 85 },
    { rank: 5, name: "Tyler", score: 80 },
    { rank: 6, name: "Tyler", score: 80 },
    { rank: 7, name: "Tyler", score: 80 },
    { rank: 8, name: "Tyler", score: 80 },
    { rank: 9, name: "Tyler", score: 80 },
    { rank: 10, name: "Tyler", score: 80 },
  ];

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-content">
        <p className="thanks-header">Thanks For Playing</p>

        <div>
          <h1 className="title">DRUMMOND</h1>
          <hr />
        </div>

        <h2 className="standings-subtitle">Today's Starting 5</h2>

        <div className="top-players-row">
          {topPlayers.map((player, index) => (
            <div key={index} className="player-card">
              <span className="player-name">{player.name}</span>
            </div>
          ))}
        </div>

        <div className="leaderboard-list">
          {users.map((entry, index) => (
            <div key={index+1} className="leaderboard-entry">
              <span className="rank-number">{index+1})</span>
              <div className="user-bar">
                <span className="user-name">{entry.username}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
