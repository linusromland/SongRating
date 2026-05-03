# Eurovision App Analytics Queries

This document contains useful MongoDB aggregation queries for analyzing user behavior, voting patterns, and engagement statistics in the Eurovision Song Rating app.

## Basic Statistics

### 1. Total Unique Visitors
Get the total number of unique visitors who have given consent.

```javascript
db.sessions.countDocuments({ consentGiven: true })
```

## Competition Analytics

### 2. Most Popular Competition
Analyze which competition/theme has the most votes and unique voters.

```javascript
db.votes.aggregate([
  {
    $group: {
      _id: "$theme",
      totalVotes: { $sum: 1 },
      uniqueSessions: { $addToSet: "$sessionId" }
    }
  },
  {
    $project: {
      theme: "$_id",
      totalVotes: 1,
      uniqueVoters: { $size: "$uniqueSessions" }
    }
  },
  { $sort: { totalVotes: -1 } }
])
```

### 3. Most Popular Song in Each Competition
Find the song with the most wins in each competition.

```javascript
db.votes.aggregate([
  {
    $group: {
      _id: { theme: "$theme", songId: "$winnerId" },
      wins: { $sum: 1 }
    }
  },
  {
    $group: {
      _id: "$_id.theme",
      songs: {
        $push: {
          songId: "$_id.songId",
          wins: "$wins"
        }
      }
    }
  },
  {
    $project: {
      theme: "$_id",
      mostPopularSong: {
        $arrayElemAt: [
          {
            $sortArray: {
              input: "$songs",
              sortBy: { wins: -1 }
            }
          },
          0
        ]
      }
    }
  }
])
```

## User Demographics

### 4. Visitor Demographics by Country
Analyze visitor distribution by country with engagement metrics.

```javascript
db.sessions.aggregate([
  {
    $match: { 
      consentGiven: true,
      country: { $exists: true, $ne: null }
    }
  },
  {
    $group: {
      _id: "$country",
      visitors: { $sum: 1 },
      totalVotes: { $sum: "$totalVotes" },
      avgTimeSpent: { $avg: "$totalTimeSpent" }
    }
  },
  {
    $project: {
      country: "$_id",
      visitors: 1,
      totalVotes: 1,
      avgTimeSpentMinutes: { $round: [{ $divide: ["$avgTimeSpent", 60000] }, 2] }
    }
  },
  { $sort: { visitors: -1 } },
  { $limit: 10 }
])
```

### 5. Device Usage Statistics
Break down user engagement by device type.

```javascript
db.sessions.aggregate([
  {
    $match: { 
      consentGiven: true,
      "device.type": { $exists: true }
    }
  },
  {
    $group: {
      _id: "$device.type",
      count: { $sum: 1 },
      totalVotes: { $sum: "$totalVotes" }
    }
  },
  {
    $project: {
      device: "$_id",
      visitors: "$count",
      totalVotes: 1,
      avgVotesPerUser: { $round: [{ $divide: ["$totalVotes", "$count"] }, 2] }
    }
  },
  { $sort: { visitors: -1 } }
])
```

## Activity Patterns

### 6. Daily Activity Heatmap
Show voting activity by date and hour for the last 7 days.

```javascript
db.votes.aggregate([
  {
    $group: {
      _id: {
        date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
        hour: { $hour: "$timestamp" }
      },
      voteCount: { $sum: 1 }
    }
  },
  {
    $group: {
      _id: "$_id.date",
      hourlyActivity: {
        $push: {
          hour: "$_id.hour",
          votes: "$voteCount"
        }
      },
      totalDailyVotes: { $sum: "$voteCount" }
    }
  },
  { $sort: { "_id": -1 } },
  { $limit: 7 }
])
```

## Engagement Analytics

### 7. Competition Engagement Stats
Analyze how users engage across multiple competitions.

```javascript
db.sessions.aggregate([
  {
    $match: { consentGiven: true }
  },
  {
    $project: {
      themesCount: { $size: "$themesVisited" },
      totalVotes: 1,
      totalTimeSpent: 1,
      themesVisited: 1
    }
  },
  {
    $group: {
      _id: null,
      avgCompetitionsPerUser: { $avg: "$themesCount" },
      avgVotesPerUser: { $avg: "$totalVotes" },
      avgTimePerUser: { $avg: "$totalTimeSpent" },
      multiCompetitionUsers: {
        $sum: { $cond: [{ $gt: ["$themesCount", 1] }, 1, 0] }
      },
      totalUsers: { $sum: 1 }
    }
  },
  {
    $project: {
      avgCompetitionsPerUser: { $round: ["$avgCompetitionsPerUser", 2] },
      avgVotesPerUser: { $round: ["$avgVotesPerUser", 2] },
      avgTimePerUserMinutes: { $round: [{ $divide: ["$avgTimePerUser", 60000] }, 2] },
      multiCompetitionEngagement: { 
        $round: [{ $multiply: [{ $divide: ["$multiCompetitionUsers", "$totalUsers"] }, 100] }, 1]
      }
    }
  }
])
```

## Song Performance

### 8. Song Battle Win/Loss Ratios
Calculate win rates for all songs across competitions.

```javascript
db.votes.aggregate([
  {
    $facet: {
      wins: [
        { $group: { _id: { theme: "$theme", song: "$winnerId" }, wins: { $sum: 1 } } }
      ],
      losses: [
        { $group: { _id: { theme: "$theme", song: "$loserId" }, losses: { $sum: 1 } } }
      ]
    }
  },
  {
    $project: {
      combined: {
        $map: {
          input: "$wins",
          in: {
            theme: "$$this._id.theme",
            songId: "$$this._id.song",
            wins: "$$this.wins",
            losses: {
              $let: {
                vars: {
                  match: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$losses",
                          cond: {
                            $and: [
                              { $eq: ["$$this._id.theme", "$$item._id.theme"] },
                              { $eq: ["$$this._id.song", "$$item._id.song"] }
                            ]
                          }
                        }
                      },
                      0
                    ]
                  }
                },
                in: { $ifNull: ["$$match.losses", 0] }
              }
            }
          }
        }
      }
    }
  },
  { $unwind: "$combined" },
  {
    $project: {
      theme: "$combined.theme",
      songId: "$combined.songId",
      wins: "$combined.wins",
      losses: "$combined.losses",
      winRate: {
        $round: [
          { $multiply: [{ $divide: ["$combined.wins", { $add: ["$combined.wins", "$combined.losses"] }] }, 100] },
          1
        ]
      }
    }
  },
  { $sort: { theme: 1, winRate: -1 } }
])
```

## Usage Notes

- All queries respect user consent (`consentGiven: true` filter where applicable)
- Time-based calculations convert milliseconds to minutes for readability
- Results are typically sorted by relevance (highest engagement, most popular, etc.)
- Use MongoDB Compass or integrate these into your analytics API routes
- Consider adding time range filters (e.g., last 30 days) for time-sensitive queries

## Database Collections Used

- **sessions**: User session data, demographics, engagement metrics
- **votes**: Individual voting records with ELO ratings
- **events**: User interaction events and page views

## Performance Tips

- These queries use existing indexes on the collections
- For large datasets, consider adding date range filters
- Some complex queries may benefit from additional compound indexes
- Monitor query execution time and optimize as needed