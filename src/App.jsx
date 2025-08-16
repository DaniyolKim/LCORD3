import { useState, useEffect } from 'react'
import Papa from 'papaparse'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { Trophy, Users, Target, Map, Filter, BarChart3, User } from 'lucide-react'
import PlayerStatsTable from './components/PlayerStatsTable'
import './App.css'

function App() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [filteredData, setFilteredData] = useState([])
  const [selectedRound, setSelectedRound] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    // CSV 파일 로드
    fetch('https://raw.githubusercontent.com/donghyun88/lgcraft/refs/heads/main/input.csv')
      .then(response => response.text())
      .then(text => {
        Papa.parse(text, {
          header: true,
          complete: (results) => {
            setData(results.data.filter(row => row.round && row.match))
            setLoading(false)
          }
        })
      })
      .catch(error => {
        console.error('데이터 로드 오류:', error)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    let filtered = data
    
    if (selectedRound !== 'all') {
      filtered = filtered.filter(row => row.round === selectedRound)
    }
    
    if (selectedType !== 'all') {
      filtered = filtered.filter(row => row.type === selectedType)
    }
    
    setFilteredData(filtered)
  }, [data, selectedRound, selectedType])

  // 통계 계산
  const getStats = () => {
    const totalMatches = filteredData.length
    const individualMatches = filteredData.filter(match => match.type === '개인전').length
    const teamMatches = filteredData.filter(match => match.type === '팀전').length
    const rounds = [...new Set(filteredData.map(match => match.round))].length

    return { totalMatches, individualMatches, teamMatches, rounds }
  }

  // 라운드별 경기 수 데이터
  const getRoundData = () => {
    const roundStats = {}
    filteredData.forEach(match => {
      const round = match.round
      if (!roundStats[round]) {
        roundStats[round] = { round: `라운드 ${round}`, 개인전: 0, 팀전: 0 }
      }
      roundStats[round][match.type]++
    })
    return Object.values(roundStats)
  }

  // 맵별 통계
  const getMapData = () => {
    const mapStats = {}
    filteredData.forEach(match => {
      const map = match.map
      if (!mapStats[map]) {
        mapStats[map] = { name: map, count: 0 }
      }
      mapStats[map].count++
    })
    return Object.values(mapStats).sort((a, b) => b.count - a.count).slice(0, 10)
  }

  // 팀별 승률 데이터
  const getTeamWinData = () => {
    const teamStats = {}
    filteredData.forEach(match => {
      const team1 = match.team1
      const team2 = match.team2
      const winner = match.winner
      
      if (!teamStats[team1]) teamStats[team1] = { wins: 0, total: 0 }
      if (!teamStats[team2]) teamStats[team2] = { wins: 0, total: 0 }
      
      teamStats[team1].total++
      teamStats[team2].total++
      
      if (winner === '1') teamStats[team1].wins++
      if (winner === '2') teamStats[team2].wins++
    })
    
    return Object.entries(teamStats)
      .map(([team, stats]) => ({
        team: `팀 ${team}`,
        winRate: stats.total > 0 ? Math.round((stats.wins / stats.total) * 100) : 0,
        wins: stats.wins,
        total: stats.total
      }))
      .filter(team => team.total >= 3)
      .sort((a, b) => b.winRate - a.winRate)
      .slice(0, 8)
  }

  const stats = getStats()
  const roundData = getRoundData()
  const mapData = getMapData()
  const teamWinData = getTeamWinData()

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7300']

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>데이터를 로딩 중입니다...</p>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1><Trophy className="header-icon" />위너스리그 경기 분석 대시보드</h1>
        <p>게임 토너먼트 데이터 분석 및 시각화</p>
        
        {/* 탭 네비게이션 */}
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <BarChart3 size={20} />
            대시보드
          </button>
          <button 
            className={`tab-button ${activeTab === 'players' ? 'active' : ''}`}
            onClick={() => setActiveTab('players')}
          >
            <User size={20} />
            선수 통계
          </button>
        </div>
      </header>

      {/* 필터 */}
      {activeTab === 'dashboard' && (
        <div className="filters">
          <div className="filter-group">
            <Filter className="filter-icon" />
            <label>라운드:</label>
            <select value={selectedRound} onChange={(e) => setSelectedRound(e.target.value)}>
              <option value="all">전체</option>
              {[...new Set(data.map(match => match.round))].sort().map(round => (
                <option key={round} value={round}>라운드 {round}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>경기 타입:</label>
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
              <option value="all">전체</option>
              <option value="개인전">개인전</option>
              <option value="팀전">팀전</option>
            </select>
          </div>
        </div>
      )}

      {/* 대시보드 콘텐츠 */}
      {activeTab === 'dashboard' && (
        <>
          {/* 통계 카드 */}
          <div className="stats-grid">
            <div className="stat-card">
              <BarChart3 className="stat-icon" />
              <div>
                <h3>총 경기 수</h3>
                <p className="stat-number">{stats.totalMatches}</p>
              </div>
            </div>
            <div className="stat-card">
              <Users className="stat-icon" />
              <div>
                <h3>개인전</h3>
                <p className="stat-number">{stats.individualMatches}</p>
              </div>
            </div>
            <div className="stat-card">
              <Target className="stat-icon" />
              <div>
                <h3>팀전</h3>
                <p className="stat-number">{stats.teamMatches}</p>
              </div>
            </div>
            <div className="stat-card">
              <Map className="stat-icon" />
              <div>
                <h3>라운드 수</h3>
                <p className="stat-number">{stats.rounds}</p>
              </div>
            </div>
          </div>

          {/* 차트 그리드 */}
          <div className="charts-grid">
            {/* 라운드별 경기 분포 */}
            <div className="chart-card">
              <h3>라운드별 경기 분포</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={roundData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="round" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="개인전" fill="#8884d8" />
                  <Bar dataKey="팀전" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 맵 사용 빈도 */}
            <div className="chart-card">
              <h3>맵 사용 빈도 (상위 10개)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={mapData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {mapData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* 팀별 승률 */}
            <div className="chart-card full-width">
              <h3>팀별 승률 (3경기 이상)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={teamWinData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="team" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, '승률']}
                    labelFormatter={(label) => label}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="custom-tooltip">
                            <p>{label}</p>
                            <p>승률: {data.winRate}%</p>
                            <p>승수: {data.wins}/{data.total}</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="winRate" fill="#FF8042" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {/* 선수 통계 테이블 */}
      {activeTab === 'players' && (
        <div className="player-stats-container">
          <PlayerStatsTable data={data} />
        </div>
      )}
    </div>
  )
}

export default App
