from nba_api.stats.endpoints import playercareerstats

career = playercareerstats.PlayerCareerStats(player_id='203999')

f = open("myfile.txt", "x")
with open("myfile.txt", "w") as f:
  f.write(career.get_json())

