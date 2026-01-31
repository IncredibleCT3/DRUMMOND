import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { BounceLoader } from 'react-spinners';
import 'react-toastify/dist/ReactToastify.css';
import '../css/Starting5.css'

const API_URL = 'http://localhost:5206';

// get today's date as a string (YYYY-MM-DD)
const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};

// cache keys - its okay to expose them in client side
const CACHE_KEY_PREFIX = 'starting5_';
const getCacheKey = (date) => `${CACHE_KEY_PREFIX}${date}`;

function Starting5() {
    const [criteria, setCriteria] = useState({ category1: '', category2: '' });
    const [score, setScore] = useState(0);
    const [currentRound, setCurrentRound] = useState(1);
    const [lineup, setLineup] = useState({
        PG: null,
        SG: null,
        SF: null,
        PF: null,
        C: null
    });
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [players, setPlayers] = useState([]);
    const [allPlayers, setAllPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [gameComplete, setGameComplete] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [incorrectPlayers, setIncorrectPlayers] = useState([]);
    const [showSurrenderModal, setShowSurrenderModal] = useState(false);
    const [selectingPlayer, setSelectingPlayer] = useState(false);

    // save game state to localStorage
    const saveGameState = (state) => {
        const todayDate = getTodayDate();
        const cacheKey = getCacheKey(todayDate);
        localStorage.setItem(cacheKey, JSON.stringify(state));
    };

    // load game state from localStorage
    const loadGameState = () => {
        const todayDate = getTodayDate();
        const cacheKey = getCacheKey(todayDate);
        const cached = localStorage.getItem(cacheKey);
        
        if (cached) {
            try {
                return JSON.parse(cached);
            } catch (e) {
                console.error('Error parsing cached game state:', e);
                return null;
            }
        }
        return null;
    };

    // clear old cache entries (keep only today's)
    const clearOldCache = () => {
        const todayDate = getTodayDate();
        const todayKey = getCacheKey(todayDate);
        
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(CACHE_KEY_PREFIX) && key !== todayKey) {
                localStorage.removeItem(key);
            }
        });
    };

    // clear today's cache (for debugging/reset)
    // const clearTodayCache = () => {
    //     const todayDate = getTodayDate();
    //     const todayKey = getCacheKey(todayDate);
    //     localStorage.removeItem(todayKey);
    //     window.location.reload();
    // };

    // initialize game on component mount
    useEffect(() => {
        const initGame = async () => {
            try {
                setLoading(true);
                
                clearOldCache();

                // start game and get daily game data
                const todayDate = getTodayDate();
                const gameResponse = await fetch(`${API_URL}/game/start`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ seed: todayDate })
                });
                
                if (!gameResponse.ok) throw new Error('Failed to start game');
                const gameData = await gameResponse.json();
                
                // check for cached game state FIRST
                const cachedState = loadGameState();
                
                if (cachedState && cachedState.gameComplete) {
                    const dailyGame = gameData.dailyGame;
                    if (dailyGame) {
                        const roundCriteria = getRoundCriteriaFromGame(dailyGame, cachedState.currentRound);
                        if (roundCriteria.category1 && roundCriteria.category2) {
                            setLineup(cachedState.lineup);
                            setScore(cachedState.score);
                            setCurrentRound(cachedState.currentRound);
                            setGameComplete(true);
                            setCriteria(roundCriteria);
                            setLoading(false);
                            return; // EXIT EARLY - Don't fetch players if game is done!
                        }
                    }
                }
                
                // only fetch players if game is NOT complete
                const playersResponse = await fetch('http://localhost:5206/players');
                if (!playersResponse.ok) {
                    throw new Error(`HTTP error! status: ${playersResponse.status}`);
                }
                const playersData = await playersResponse.json();
                setAllPlayers(playersData);
                
                // If we have cached state, validate it
                if (cachedState) {
                    const dailyGame = gameData.dailyGame;
                    
                    if (dailyGame) {
                        const roundCriteria = getRoundCriteriaFromGame(dailyGame, cachedState.currentRound);
                        
                        // Verify the cached criteria still matches the daily game
                        if (roundCriteria.category1 && roundCriteria.category2) {
                            // Restore from cache - valid state
                            setLineup(cachedState.lineup);
                            setScore(cachedState.score);
                            setCurrentRound(cachedState.currentRound);
                            setGameComplete(cachedState.gameComplete);
                            setCriteria(roundCriteria);
                        } else {
                            // Cache is invalid (round doesn't exist in DB), clear and start fresh
                            localStorage.removeItem(getCacheKey(todayDate));
                            setCriteria(gameData.criteria);
                            setCurrentRound(1);
                            setGameComplete(false);
                            setLineup({
                                PG: null,
                                SG: null,
                                SF: null,
                                PF: null,
                                C: null
                            });
                            setScore(0);
                            
                            // Save initial state
                            saveGameState({
                                lineup: {
                                    PG: null,
                                    SG: null,
                                    SF: null,
                                    PF: null,
                                    C: null
                                },
                                score: 0,
                                currentRound: 1,
                                gameComplete: false
                            });
                        }
                    } else {
                        // No dailyGame in response, but we have criteria - start fresh
                        localStorage.removeItem(getCacheKey(todayDate));
                        setCriteria(gameData.criteria);
                        setCurrentRound(1);
                        setGameComplete(false);
                        setLineup({
                            PG: null,
                            SG: null,
                            SF: null,
                            PF: null,
                            C: null
                        });
                        setScore(0);
                        
                        saveGameState({
                            lineup: {
                                PG: null,
                                SG: null,
                                SF: null,
                                PF: null,
                                C: null
                            },
                            score: 0,
                            currentRound: 1,
                            gameComplete: false
                        });
                    }
                } else {
                    // No cache - start fresh
                    setCriteria(gameData.criteria);
                    setCurrentRound(1);
                    setGameComplete(false);
                    setLineup({
                        PG: null,
                        SG: null,
                        SF: null,
                        PF: null,
                        C: null
                    });
                    setScore(0);
                    
                    // Save initial state
                    saveGameState({
                        lineup: {
                            PG: null,
                            SG: null,
                            SF: null,
                            PF: null,
                            C: null
                        },
                        score: 0,
                        currentRound: 1,
                        gameComplete: false
                    });
                }
            } catch (err) {
                console.error('Error initializing game:', err);
                toast.error(`Failed to initialize game: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        initGame();
    }, []);

    // Helper to get criteria for a specific round from the daily game
    const getRoundCriteriaFromGame = (dailyGame, round) => {
        const categoryMap = {
            1: { category1: dailyGame.round1Category1, category2: dailyGame.round1Category2 },
            2: { category1: dailyGame.round2Category1, category2: dailyGame.round2Category2 },
            3: { category1: dailyGame.round3Category1, category2: dailyGame.round3Category2 },
            4: { category1: dailyGame.round4Category1, category2: dailyGame.round4Category2 },
            5: { category1: dailyGame.round5Category1, category2: dailyGame.round5Category2 }
        };
        return categoryMap[round] || { category1: '', category2: '' };
    };

    // Get filled positions
    const getFilledPositions = () => {
        return Object.entries(lineup)
            .filter(([_, player]) => player !== null)
            .map(([position]) => position);
    };

    const showPlayerStats = (playerId) => {
        const player = allPlayers.find(p => p.playerId === playerId);
        if (player) {
            console.log('Player Stats:', player);
        }
    };

    // Select position and show matching players
    const selectPosition = (position) => {
        // If position is already done then just return
        if (lineup[position]) return;
        setSelectedPosition(position);
        setSearchQuery('');
        // Filter players by position
        const availablePlayers = allPlayers.filter(p => p.position === position);
        setPlayers(availablePlayers);
    };

    // Filter players based on search query
    const filteredPlayers = players.filter(player => {
        const fullName = `${player.firstName} ${player.lastName}`.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase());
    });

    const selectPlayer = async (player) => {
        if (!selectedPosition) return;
        if (incorrectPlayers.includes(player.playerId)) return;

        const isGameComplete = getFilledPositions().length === 4;

        try {
            setSelectingPlayer(true);
            const response = await fetch(`${API_URL}/game/select-player`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Player: player,
                    Position: selectedPosition,
                    IsGameComplete: isGameComplete,
                    Criteria: criteria,
                    FilledPositions: getFilledPositions()
                })
            });

            const data = await response.json();

            if (!data.success || data.error) {
                setIncorrectPlayers(prev => [...prev, player.playerId]);
                toast.error(data.error || 'This player does not match both categories!', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                setSelectingPlayer(false);
                return;
            }

            const newLineup = {
                ...lineup,
                [selectedPosition]: {
                    ...player,
                    points: data.points,
                    tags: { category1: criteria.category1, category2: criteria.category2 }
                }
            };
            setLineup(newLineup);
            
            const newScore = score + data.points;
            setScore(newScore);

            setSelectedPosition(null);
            setPlayers([]);
            setIncorrectPlayers([]);

            if (isGameComplete) {
                setGameComplete(true);
                saveGameState({
                    lineup: newLineup,
                    score: newScore,
                    currentRound: currentRound,
                    gameComplete: true
                });
            } else {
                const nextRound = currentRound + 1;
                setCriteria(data.nextCriteria);
                setCurrentRound(nextRound);
                
                saveGameState({
                    lineup: newLineup,
                    score: newScore,
                    currentRound: nextRound,
                    gameComplete: false
                });
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSelectingPlayer(false);
        }
    };

    const handleSurrender = () => {
        // Mark game as complete (surrendered) and save to cache
        saveGameState({
            lineup: lineup,
            score: score,
            currentRound: currentRound,
            gameComplete: true,
            surrendered: true
        });
        setGameComplete(true);
        setShowSurrenderModal(false);
    };

    if (gameComplete) {
        const cachedState = loadGameState();
        const isSurrendered = cachedState?.surrendered || false;
        
        return (
            <div className="game-container">
                <ToastContainer />
                <div className="complete-screen">
                    <h1 className="game-title">{isSurrendered ? 'GAME SURRENDERED' : 'GAME COMPLETE!'}</h1>
                    <div className="final-score">
                        <h2>Final Score</h2>
                        <div className="score-display">{score}</div>
                    </div>
                    <div className="final-lineup">
                        <h3>Your {isSurrendered ? 'Lineup' : 'Starting 5'}</h3>
                        {Object.entries(lineup).map(([position, player]) => (
                            player ? (
                                <div key={position} className="final-lineup-item">
                                    <span className="position">{position}</span>
                                    <span className="player-name">
                                        {player.firstName} {player.lastName}
                                    </span>
                                    {player.tags && (
                                        <div className="player-tags">
                                            <span className="tag">{player.tags.category1}</span>
                                            <span className="tag">{player.tags.category2}</span>
                                        </div>
                                    )}
                                    <span className="points">+{player.points}</span>
                                </div>
                            ) : (
                                <div key={position} className="final-lineup-item" style={{ opacity: 0.5 }}>
                                    <span className="position">{position}</span>
                                    <span className="player-name">Not Selected</span>
                                    <span className="points">—</span>
                                </div>
                            )
                        ))}
                    </div>
                    <div className="completion-message">
                        {isSurrendered ? 'Better luck next time! ' : ''}Come back tomorrow for a new challenge!
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="game-container">
            <ToastContainer />
            <div className="game-header">
                <h1 className="game-title">STARTING 5</h1>
                <button 
                    className="logout-button"
                    onClick={() => setShowSurrenderModal(true)}
                >
                    SURRENDER
                </button>
            </div>

            {loading && !criteria.category1 ? (
                <div className="loading">
                    <BounceLoader color="#1d42ba" size={100} />
                    <p>Loading game...</p>
                </div>
            ) : (
                <>
                    <div className="categories-box">
                        <div className="categories-title">CATEGORIES</div>
                        <div className="categories-content">
                            <div className="category">
                                <div className="category-label">Category 1</div>
                                <div className="category-value">{criteria.category1}</div>
                            </div>
                            <div className="category">
                                <div className="category-label">Category 2</div>
                                <div className="category-value-2">{criteria.category2}</div>
                            </div>
                        </div>
                    </div>

                    <div className="score-box">
                        <div className="score-label">CURRENT SCORE</div>
                        <div className="score-value">{score}</div>
                    </div>

                    <div className="lineup-section">
                        {['PG', 'SG', 'SF', 'PF', 'C'].map(position => (
                            <div
                                key={position}
                                className={`position-row ${lineup[position] ? 'filled' : ''} ${selectedPosition === position ? 'selected' : ''}`}
                                onClick={() => !lineup[position] && selectPosition(position)}
                            >
                                <span className="position-label">{position}</span>
                                <span className="position-content">
                                    {lineup[position] ? (
                                        <>
                                            <span className="player-name">
                                                {lineup[position].firstName} {lineup[position].lastName}
                                            </span>
                                            {lineup[position].tags && (
                                                <div className="player-tags">
                                                    <span className="tag">{lineup[position].tags.category1}</span>
                                                    <span className="tag">{lineup[position].tags.category2}</span>
                                                </div>
                                            )}
                                            <span className="player-points">+{lineup[position].points}</span>
                                        </>
                                    ) : (
                                        <span className="select-text">Select Player</span>
                                    )}
                                </span>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {showSurrenderModal && (
                <div className="player-selection-modal">
                    <div className="modal-content surrender-modal">
                        <div className="modal-header">
                            <h2>Surrender Game?</h2>
                            <button
                                className="close-button"
                                onClick={() => setShowSurrenderModal(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="surrender-content">
                            <p className="surrender-message">
                                Are you sure you want to surrender? This will reset your current game progress.
                            </p>
                            <div className="surrender-buttons">
                                <button
                                    onClick={() => setShowSurrenderModal(false)}
                                    className="surrender-cancel"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSurrender}
                                    className="surrender-confirm"
                                >
                                    Surrender
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {selectedPosition && (
                <div className="player-selection-modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Select {selectedPosition}</h2>
                            <button
                                className="close-button"
                                onClick={() => {
                                    setSelectedPosition(null);
                                    setPlayers([]);
                                    setSearchQuery('');
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="search-box">
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search players..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                            />
                        </div>

                        <div className="player-list">
                            {selectingPlayer ? (
                                <div className="loading">
                                    <BounceLoader color="#1d42ba" size={50} />
                                    <p>Validating selection...</p>
                                </div>
                            ) : !searchQuery ? (
                                <div className="search-prompt">Start typing to search for players...</div>
                            ) : filteredPlayers.length === 0 ? (
                                <div className="no-players">No players found matching your search</div>
                            ) : (
                                filteredPlayers.map(player => {
                                    const isIncorrect = incorrectPlayers.includes(player.playerId);
                                    return (
                                        <div
                                            key={player.playerId}
                                            className={`player-item ${isIncorrect ? 'incorrect' : ''}`}
                                            onClick={() => !isIncorrect && selectPlayer(player)}
                                        >
                                            <span className={`player-name ${isIncorrect ? 'crossed-out' : ''}`}>
                                                {player.firstName} {player.lastName}
                                            </span>
                                            <span className={`player-position ${isIncorrect ? 'crossed-out' : ''}`}>{player.position}</span>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Starting5;