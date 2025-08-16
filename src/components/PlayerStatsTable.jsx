import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Chip
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import PlayerDetailCard from './PlayerDetailCard';
import { getPlayerByName } from '../stores/playersStore';

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 4px 8px 2px rgba(255, 215, 0, .4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 6px 12px 4px rgba(255, 215, 0, .6);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 4px 8px 2px rgba(255, 215, 0, .4);
  }
`;

const GoldChip = styled(Chip)(() => ({
  background: 'linear-gradient(45deg, #FFD700 30%, #FFA500 90%)',
  color: 'white',
  fontWeight: 'bold',
  minWidth: '50px',
  boxShadow: '0 4px 8px 2px rgba(255, 215, 0, .4)',
  animation: `${pulseAnimation} 2s infinite`,
}));

const SilverChip = styled(Chip)(() => ({
  background: 'linear-gradient(45deg, #C0C0C0 30%, #A8A8A8 90%)',
  color: 'white',
  fontWeight: 'bold',
  minWidth: '50px',
  boxShadow: '0 4px 8px 2px rgba(192, 192, 192, .4)',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 6px 12px 4px rgba(192, 192, 192, .6)',
  },
  transition: 'all 0.3s ease',
}));

const BronzeChip = styled(Chip)(() => ({
  background: 'linear-gradient(45deg, #CD7F32 30%, #B8860B 90%)',
  color: 'white',
  fontWeight: 'bold',
  minWidth: '50px',
  boxShadow: '0 4px 8px 2px rgba(205, 127, 50, .4)',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 6px 12px 4px rgba(205, 127, 50, .6)',
  },
  transition: 'all 0.3s ease',
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(2),
  maxHeight: 600,
  '& .MuiTableHead-root': {
    backgroundColor: '#f5f5f5',
  },
  '& .MuiTableCell-head': {
    fontWeight: 'bold',
    position: 'sticky',
    top: 0,
    backgroundColor: '#f5f5f5',
    zIndex: 1,
  }
}));

const FilterContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
  flexWrap: 'wrap',
  alignItems: 'center'
}));

const PlayerStatsTable = ({ data }) => {
  const [orderBy, setOrderBy] = useState('elo');
  const [order, setOrder] = useState('desc');
  const [nameFilter, setNameFilter] = useState('');
  const [teamFilter, setTeamFilter] = useState('');
  const [raceFilter, setRaceFilter] = useState('');
  const [tierFilter, setTierFilter] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // 디버깅용 로그
  console.log('PlayerStatsTable data:', data);
  console.log('Data length:', data.length);

  // 선수 문자열 파싱 (이름, 종족 등 추출)
  const parsePlayerString = (playerStr) => {
    const cleanName = playerStr.split(':')[0].trim();
    
    // 스토어에서 해당 선수 찾기
    const playerMeta = getPlayerByName(cleanName);
    
    if (playerMeta) {
      return {
        name: playerMeta.이름,
        id: playerMeta.id,
        race: playerMeta.종족,
        tier: playerMeta.티어,
        team: playerMeta.팀
      };
    }
    
    // 메타데이터에 없는 경우 기존 로직 사용
    const parts = playerStr.split(':');
    let race = 'Unknown';
    
    if (parts.length > 1) {
      const raceInfo = parts[1];
      if (raceInfo.includes('P')) race = 'P';
      else if (raceInfo.includes('T')) race = 'T';
      else if (raceInfo.includes('Z')) race = 'Z';
      else if (raceInfo.includes('R')) race = 'R';
    }
    
    return { 
      name: cleanName, 
      id: cleanName,
      race,
      tier: 'Unknown',
      team: null
    };
  };

  // 선수 데이터 파싱
  const playerStats = useMemo(() => {
    const players = {};
    
    console.log('Processing data in useMemo:', data.length);
    
    data.forEach(match => {
      console.log('Processing match:', match);
      // 팀1 선수들 파싱
      if (match.team1_players) {
        const team1Players = match.team1_players.split(',').map(p => p.trim());
        team1Players.forEach(playerStr => {
          const playerInfo = parsePlayerString(playerStr);
          const playerId = `${playerInfo.name}_${playerInfo.team || match.team1}`;
          
          if (!players[playerId]) {
            players[playerId] = {
              name: playerInfo.name,
              id: playerInfo.id,
              team: playerInfo.team || match.team1,
              race: playerInfo.race,
              tier: playerInfo.tier !== 'Unknown' ? playerInfo.tier : match.tier,
              wins: 0,
              losses: 0,
              totalGames: 0,
              winRate: 0,
              elo: 1000 // 기본 ELO
            };
          }
          
          players[playerId].totalGames++;
          if (match.winner === '1') {
            players[playerId].wins++;
          } else if (match.winner === '2') {
            players[playerId].losses++;
          }
        });
      }
      
      // 팀2 선수들 파싱
      if (match.team2_players) {
        const team2Players = match.team2_players.split(',').map(p => p.trim());
        team2Players.forEach(playerStr => {
          const playerInfo = parsePlayerString(playerStr);
          const playerId = `${playerInfo.name}_${playerInfo.team || match.team2}`;
          
          if (!players[playerId]) {
            players[playerId] = {
              name: playerInfo.name,
              id: playerInfo.id,
              team: playerInfo.team || match.team2,
              race: playerInfo.race,
              tier: playerInfo.tier !== 'Unknown' ? playerInfo.tier : match.tier,
              wins: 0,
              losses: 0,
              totalGames: 0,
              winRate: 0,
              elo: 1000
            };
          }
          
          players[playerId].totalGames++;
          if (match.winner === '2') {
            players[playerId].wins++;
          } else if (match.winner === '1') {
            players[playerId].losses++;
          }
        });
      }
    });
    
    // 승률과 ELO 계산
    Object.values(players).forEach(player => {
      player.winRate = player.totalGames > 0 ? 
        Math.round((player.wins / player.totalGames) * 100) : 0;
      
      // 간단한 ELO 계산 (승률 기반)
      const baseElo = 1000;
      const winBonus = player.wins * 25;
      const losspenalty = player.losses * 15;
      const gameBonus = Math.min(player.totalGames * 5, 100);
      player.elo = Math.max(500, baseElo + winBonus - losspenalty + gameBonus);
    });
    
    return Object.values(players).filter(player => player.totalGames > 0);
  }, [data]);

  // 필터링된 데이터
  const filteredData = useMemo(() => {
    return playerStats.filter(player => {
      const nameMatch = player.name.toLowerCase().includes(nameFilter.toLowerCase()) ||
                       player.id.toLowerCase().includes(nameFilter.toLowerCase());
      return (
        nameMatch &&
        (teamFilter === '' || player.team.toString() === teamFilter) &&
        (raceFilter === '' || player.race === raceFilter) &&
        (tierFilter === '' || player.tier === tierFilter)
      );
    });
  }, [playerStats, nameFilter, teamFilter, raceFilter, tierFilter]);

  // 정렬된 데이터
  const sortedData = useMemo(() => {
    const sorted = [...filteredData].sort((a, b) => {
      const isAsc = order === 'asc';
      if (orderBy === 'name' || orderBy === 'id' || orderBy === 'team' || orderBy === 'race' || orderBy === 'tier') {
        const aVal = orderBy === 'team' ? a[orderBy].toString() : a[orderBy];
        const bVal = orderBy === 'team' ? b[orderBy].toString() : b[orderBy];
        return isAsc ? 
          aVal.localeCompare(bVal) : 
          bVal.localeCompare(aVal);
      }
      return isAsc ? a[orderBy] - b[orderBy] : b[orderBy] - a[orderBy];
    });
    
    // ELO 기준 랭킹 계산 (동점자 처리)
    const sortedByElo = [...playerStats].sort((a, b) => b.elo - a.elo);
    const rankMap = {};
    let currentRank = 1;
    
    sortedByElo.forEach((player, index) => {
      // 이전 선수와 ELO가 같으면 같은 랭킹
      if (index > 0 && sortedByElo[index - 1].elo === player.elo) {
        rankMap[`${player.name}_${player.team}`] = rankMap[`${sortedByElo[index - 1].name}_${sortedByElo[index - 1].team}`];
      } else {
        rankMap[`${player.name}_${player.team}`] = currentRank;
      }
      
      // 다음 랭킹은 현재 인덱스 + 1
      if (index === sortedByElo.length - 1 || sortedByElo[index + 1].elo !== player.elo) {
        currentRank = index + 2;
      }
    });
    
    // 정렬된 데이터에 랭킹 추가
    const withRanks = sorted.map(player => ({
      ...player,
      rank: rankMap[`${player.name}_${player.team}`]
    }));
    
    // 랭킹으로 정렬하는 경우 따로 처리
    if (orderBy === 'rank') {
      return withRanks.sort((a, b) => {
        return order === 'asc' ? a.rank - b.rank : b.rank - a.rank;
      });
    }
    
    return withRanks;
  }, [filteredData, order, orderBy, playerStats]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // 유니크 값들 추출
  const uniqueTeams = [...new Set(playerStats.map(p => p.team.toString()))].sort((a, b) => parseInt(a) - parseInt(b));
  const uniqueRaces = [...new Set(playerStats.map(p => p.race))].filter(race => race !== 'Unknown').sort();
  const uniqueTiers = [...new Set(playerStats.map(p => p.tier))].filter(tier => tier !== 'Unknown').sort();

  const getRaceColor = (race) => {
    switch (race) {
      case 'P': return '#FFD700'; // Protoss - Gold
      case 'T': return '#87CEEB'; // Terran - Sky Blue
      case 'Z': return '#9370DB'; // Zerg - Purple
      case 'R': return '#FFA500'; // Random - Orange
      case 'PT': return '#FF69B4'; // Protoss/Terran - Pink
      case 'ZP': return '#32CD32'; // Zerg/Protoss - Lime
      default: return '#CCCCCC';
    }
  };

  const getRaceDisplayName = (race) => {
    switch (race) {
      case 'P': return 'Protoss';
      case 'T': return 'Terran';
      case 'Z': return 'Zerg';
      case 'R': return 'Random';
      case 'PT': return 'P/T';
      case 'ZP': return 'Z/P';
      default: return race;
    }
  };

  const getWinRateColor = (winRate) => {
    if (winRate >= 70) return '#4CAF50';
    if (winRate >= 50) return '#FF9800';
    return '#F44336';
  };

  const handlePlayerClick = (player) => {
    setSelectedPlayer(player);
    setDetailOpen(true);
  };

  const handleDetailClose = () => {
    setDetailOpen(false);
    setSelectedPlayer(null);
  };

  return (
    <Box>      
      {/* 데이터 없을 때 메시지 */}
      {!data || data.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="textSecondary">
            데이터가 없습니다. 먼저 대시보드에서 데이터가 로드되었는지 확인해주세요.
          </Typography>
        </Box>
      ) : playerStats.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="textSecondary">
            선수 데이터를 파싱할 수 없습니다. 데이터 형식을 확인해주세요.
          </Typography>
        </Box>
      ) : (
        <>
          <FilterContainer>
        <TextField
          label="선수명/ID 검색"
          variant="outlined"
          size="small"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          sx={{ minWidth: 150 }}
        />
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>팀</InputLabel>
          <Select
            value={teamFilter}
            label="팀"
            onChange={(e) => setTeamFilter(e.target.value)}
          >
            <MenuItem value="">전체</MenuItem>
            {uniqueTeams.map(team => (
              <MenuItem key={team} value={team}>팀 {team}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>종족</InputLabel>
          <Select
            value={raceFilter}
            label="종족"
            onChange={(e) => setRaceFilter(e.target.value)}
          >
            <MenuItem value="">전체</MenuItem>
            {uniqueRaces.map(race => (
              <MenuItem key={race} value={race}>{race}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>티어</InputLabel>
          <Select
            value={tierFilter}
            label="티어"
            onChange={(e) => setTierFilter(e.target.value)}
          >
            <MenuItem value="">전체</MenuItem>
            {uniqueTiers.map(tier => (
              <MenuItem key={tier} value={tier}>{tier}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Typography variant="body2" color="textSecondary">
          총 {sortedData.length}명의 선수
        </Typography>
      </FilterContainer>

      <StyledTableContainer component={Paper}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'rank'}
                  direction={orderBy === 'rank' ? order : 'asc'}
                  onClick={() => handleRequestSort('rank')}
                >
                  랭킹
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={() => handleRequestSort('name')}
                >
                  선수명 (ID)
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'team'}
                  direction={orderBy === 'team' ? order : 'asc'}
                  onClick={() => handleRequestSort('team')}
                >
                  팀
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'race'}
                  direction={orderBy === 'race' ? order : 'asc'}
                  onClick={() => handleRequestSort('race')}
                >
                  종족
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'tier'}
                  direction={orderBy === 'tier' ? order : 'asc'}
                  onClick={() => handleRequestSort('tier')}
                >
                  티어
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === 'totalGames'}
                  direction={orderBy === 'totalGames' ? order : 'asc'}
                  onClick={() => handleRequestSort('totalGames')}
                >
                  경기수
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === 'wins'}
                  direction={orderBy === 'wins' ? order : 'asc'}
                  onClick={() => handleRequestSort('wins')}
                >
                  승
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === 'losses'}
                  direction={orderBy === 'losses' ? order : 'asc'}
                  onClick={() => handleRequestSort('losses')}
                >
                  패
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === 'winRate'}
                  direction={orderBy === 'winRate' ? order : 'asc'}
                  onClick={() => handleRequestSort('winRate')}
                >
                  승률
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === 'elo'}
                  direction={orderBy === 'elo' ? order : 'asc'}
                  onClick={() => handleRequestSort('elo')}
                >
                  ELO
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((player) => (
              <TableRow key={`${player.name}_${player.team}`} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {player.rank === 1 ? (
                      <GoldChip
                        label="🥇 #1"
                        size="small"
                      />
                    ) : player.rank === 2 ? (
                      <SilverChip
                        label="🥈 #2"
                        size="small"
                      />
                    ) : player.rank === 3 ? (
                      <BronzeChip
                        label="🥉 #3"
                        size="small"
                      />
                    ) : (
                      <Chip
                        label={`#${player.rank}`}
                        size="small"
                        sx={{
                          backgroundColor: '#4CAF50',
                          color: 'white',
                          fontWeight: 'bold',
                          minWidth: '40px'
                        }}
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography 
                    variant="body2" 
                    fontWeight="medium"
                    sx={{ 
                      cursor: 'pointer', 
                      color: 'primary.main',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                    onClick={() => handlePlayerClick(player)}
                  >
                    {player.name} ({player.id})
                  </Typography>
                </TableCell>
                <TableCell>팀 {player.team}</TableCell>
                <TableCell>
                  <Chip
                    label={getRaceDisplayName(player.race)}
                    size="small"
                    sx={{
                      backgroundColor: getRaceColor(player.race),
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={player.tier}
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: 'bold' }}
                  />
                </TableCell>
                <TableCell align="right">{player.totalGames}</TableCell>
                <TableCell align="right">{player.wins}</TableCell>
                <TableCell align="right">{player.losses}</TableCell>
                <TableCell align="right">
                  <Chip
                    label={`${player.winRate}%`}
                    size="small"
                    sx={{
                      backgroundColor: getWinRateColor(player.winRate),
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight="bold">
                    {player.elo}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
        </>
      )}
      
      <PlayerDetailCard
        player={selectedPlayer}
        data={data}
        open={detailOpen}
        onClose={handleDetailClose}
      />
    </Box>
  );
};

export default PlayerStatsTable;
