
BCL-Live-Scorer
---------------

Data Models
-----------

players: {
  playerId_#1: {
    name: String,
    project: String  
  }
}

teams: {
  teamId_#1: {
    players: {
      0: <playerId_#1>,
      1: <playerId_#2>
    },
    dept: String
  }
}

fixtures: {
  fixtureId_#1: {
    team1: {
      id: <teamId_#1>,
      playingXI: {
        <playerId_#1>: {
          runsScored: Number,
          wicketsTaken: Number,
          sixes: Number,
          fours: Number,
          wicketLostBy: String
        }
      },
      runsScored: Number,
      wicketsLost: Number,
      sixes: Number,
      fours: Number
    },
    team2: {},
    matchNo: Number,
    ground: String,
    status: String,
    result: String
  }
}
