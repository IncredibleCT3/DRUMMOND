import "../css/Leaderboard.css"
import { useState } from "react";
import { useEffect } from "react";
import kingIcon from "../assets/king.svg";

function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [starting5, setStarting5] = useState([]);

  useEffect(() => {
    async function loadUsers() {
      const usersRes = await fetch("http://localhost:5206/Leaderboard");
      const users = await usersRes.json();

      const playerIds = users[0].starting5.split(",");
      console.log(playerIds);

      for (const id of playerIds) {
        const res = await fetch(`http://localhost:5206/Players/${id}`);
        const player = await res.json();
        starting5.push(player);
      }
      console.log(starting5);
      setStarting5(starting5);
      setUsers(users);
    }
    loadUsers();
  }, []);

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
          {starting5.map((player, index) => (
            <div key={index} className="player-card">
              <span className="player-name">{player.firstName} {player.lastName}</span>
            </div>
          ))}
        </div>

        <div className="leaderboard-list">
          {users.map((entry, index) => (
            <div key={index} className="leaderboard-entry">
              <span className="rank-number">{index+1}</span>
              <div className="user-bar">
                <span className="user-name">{entry.username}
                  {index === 0 && <img className="kingIcon" src={kingIcon} alt="king"/>}
                </span>
                <span className="score">{entry.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
