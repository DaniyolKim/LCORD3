import React, { useMemo } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogContent,
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getPlayerByName } from '../stores/playersStore';

// 종족 아이콘 컴포넌트
const RaceIcon = ({ race }) => {
  const getRaceStyle = (race) => {
    switch (race) {
      case 'P': 
        return { 
          backgroundColor: '#FFD700', 
          color: 'white', 
          symbol: 'P' 
        };
      case 'T': 
        return { 
          backgroundColor: '#87CEEB', 
          color: 'white', 
          symbol: 'T' 
        };
      case 'Z': 
        return { 
          backgroundColor: '#9370DB', 
          color: 'white', 
          symbol: 'Z' 
        };
      case 'R': 
        return { 
          backgroundColor: '#FFA500', 
          color: 'white', 
          symbol: 'R' 
        };
      default: 
        return { 
          backgroundColor: '#CCCCCC', 
          color: 'black', 
          symbol: '?' 
        };
    }
  };

  const style = getRaceStyle(race);
  
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 20,
        height: 20,
        borderRadius: '50%',
        backgroundColor: style.backgroundColor,
        color: style.color,
        fontSize: '12px',
        fontWeight: 'bold',
        marginRight: 0.5,
        minWidth: 20
      }}
    >
      {style.symbol}
    </Box>
  );
};

const PlayerDetailCard = ({ player, data, open, onClose }) => {
  // 선수의 모든 경기 데이터 추출
  const playerMatches = useMemo(() => {
    if (!player || !data) return [];
    
    const matches = [];
    let currentElo = 1000; // 시작 ELO
    
    data.forEach((match, index) => {
      let isPlayerInMatch = false;
      let playerTeam = null;
      let isWin = false;
      
      // 팀1에서 선수 찾기
      if (match.team1_players) {
        const team1Players = match.team1_players.split(',').map(p => p.trim());
        const playerInTeam1 = team1Players.some(p => p.split(':')[0].trim() === player.name);
        if (playerInTeam1) {
          isPlayerInMatch = true;
          playerTeam = 1; // 팀 번호로 설정
          isWin = match.winner === '1';
        }
      }
      
      // 팀2에서 선수 찾기
      if (!isPlayerInMatch && match.team2_players) {
        const team2Players = match.team2_players.split(',').map(p => p.trim());
        const playerInTeam2 = team2Players.some(p => p.split(':')[0].trim() === player.name);
        if (playerInTeam2) {
          isPlayerInMatch = true;
          playerTeam = 2; // 팀 번호로 설정
          isWin = match.winner === '2';
        }
      }
      
      if (isPlayerInMatch) {
        // ELO 변화 계산 (간단한 공식)
        const eloChange = isWin ? 25 : -15;
        currentElo += eloChange;
        currentElo = Math.max(500, currentElo); // 최소 ELO 500
        
        // 상대선수 정보 추출
        let opponents = [];
        if (playerTeam === 1) {
          // 현재 선수가 팀1이면 팀2가 상대
          const team2Players = match.team2_players.split(',').map(p => p.trim());
          opponents = team2Players.map(playerStr => {
            const name = playerStr.split(':')[0].trim();
            const playerInfo = getPlayerByName(name);
            return {
              name,
              race: playerInfo ? playerInfo.종족 : 'Unknown'
            };
          });
        } else {
          // 현재 선수가 팀2이면 팀1이 상대
          const team1Players = match.team1_players.split(',').map(p => p.trim());
          opponents = team1Players.map(playerStr => {
            const name = playerStr.split(':')[0].trim();
            const playerInfo = getPlayerByName(name);
            return {
              name,
              race: playerInfo ? playerInfo.종족 : 'Unknown'
            };
          });
        }
        
        matches.push({
          matchIndex: index + 1,
          round: match.round,
          matchNumber: match.match,
          type: match.type,
          tier: match.tier,
          map: match.map,
          team1: match.team1,
          team2: match.team2,
          team1_players: match.team1_players,
          team2_players: match.team2_players,
          winner: match.winner,
          result: match.result,
          playerTeam,
          isWin,
          eloChange,
          elo: currentElo,
          opponents
        });
      }
    });
    
    return matches;
  }, [player, data]);

  // 경기 타입별 통계 계산
  const matchTypeStats = useMemo(() => {
    if (!playerMatches.length) return {};
    
    const stats = {
      개인전: { wins: 0, total: 0 },
      팀전: { wins: 0, total: 0 },
      '2vs2': { wins: 0, total: 0 },
      '3vs3': { wins: 0, total: 0 }
    };
    
    playerMatches.forEach(match => {
      const type = match.type;
      if (stats[type]) {
        stats[type].total++;
        if (match.isWin) stats[type].wins++;
      }
    });
    
    // 승률 계산
    Object.keys(stats).forEach(type => {
      stats[type].winRate = stats[type].total > 0 ? 
        Math.round((stats[type].wins / stats[type].total) * 100) : 0;
    });
    
    return stats;
  }, [playerMatches]);

  // ELO 차트 데이터
  const eloChartData = useMemo(() => {
    return playerMatches.map((match, index) => ({
      match: `경기 ${index + 1}`,
      elo: match.elo,
      round: match.round,
      result: match.isWin ? '승' : '패'
    }));
  }, [playerMatches]);

  const getRaceColor = (race) => {
    switch (race) {
      case 'P': return '#FFD700';
      case 'T': return '#87CEEB';
      case 'Z': return '#9370DB';
      case 'R': return '#FFA500';
      case 'PT': return '#FF69B4';
      case 'ZP': return '#32CD32';
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

  if (!player) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: { minHeight: '80vh' }
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Card sx={{ boxShadow: 'none' }}>
          <CardHeader
            title={`${player.name} (${player.id})`}
            action={
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            }
            sx={{ borderBottom: '1px solid #e0e0e0' }}
          />
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* 첫 번째 행 - 기본정보와 전적요약 */}
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Box sx={{ flex: 1, minWidth: '300px' }}>
                  <Typography variant="h6" gutterBottom>
                    기본정보
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ minWidth: '60px' }}>팀:</Typography>
                      <Chip label={`팀 ${player.team}`} size="small" />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ minWidth: '60px' }}>종족:</Typography>
                      <Chip
                        label={getRaceDisplayName(player.race)}
                        size="small"
                        sx={{
                          backgroundColor: getRaceColor(player.race),
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ minWidth: '60px' }}>티어:</Typography>
                      <Chip label={player.tier} size="small" variant="outlined" />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ minWidth: '60px' }}>ELO:</Typography>
                      <Typography variant="h6" color="primary" fontWeight="bold">
                        {player.elo}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ flex: 1, minWidth: '300px' }}>
                  <Typography variant="h6" gutterBottom>
                    전적 요약
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">전체 승률:</Typography>
                      <Chip
                        label={`${player.winRate}% (${player.wins}승 ${player.losses}패)`}
                        size="small"
                        color={player.winRate >= 60 ? 'success' : player.winRate >= 40 ? 'warning' : 'error'}
                      />
                    </Box>
                    {Object.entries(matchTypeStats).map(([type, stats]) => (
                      <Box key={type} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">{type}:</Typography>
                        <Typography variant="body2">
                          {stats.winRate}% ({stats.wins}승 {stats.total - stats.wins}패)
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>

              {/* 두 번째 행 - ELO 변화 그래프 */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  ELO 변화
                </Typography>
                <Box sx={{ height: 300, width: '100%' }}>
                  <ResponsiveContainer>
                    <LineChart data={eloChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="match" 
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis domain={[850, 'dataMax']} />
                      <Tooltip 
                        formatter={(value) => [value, 'ELO']}
                        labelFormatter={(label, payload) => {
                          if (payload && payload[0]) {
                            const data = payload[0].payload;
                            return `${label} (${data.round}라운드, ${data.result})`;
                          }
                          return label;
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="elo" 
                        stroke="#2196f3" 
                        strokeWidth={2}
                        dot={{ fill: '#2196f3', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Box>

              {/* 세 번째 행 - 경기 기록 테이블 */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  경기 기록
                </Typography>
                <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ width: '18%' }}>라운드/경기</TableCell>
                        <TableCell sx={{ width: '15%' }}>맵</TableCell>
                        <TableCell sx={{ width: '25%' }}>우리팀</TableCell>
                        <TableCell sx={{ width: '25%' }}>상대팀</TableCell>
                        <TableCell sx={{ width: '7%' }} align="center">결과</TableCell>
                        <TableCell sx={{ width: '10%' }} align="right">ELO 변화</TableCell>
                        <TableCell sx={{ width: '10%' }} align="right">ELO</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[...playerMatches].reverse().map((match, index) => {
                        // 우리팀 선수들 (현재 선수 제외)
                        const ourTeamPlayers = [];
                        if (match.type === '팀전') {
                          const ourTeamPlayersStr = match.playerTeam === 1 ? match.team1_players : match.team2_players;
                          const playerNames = ourTeamPlayersStr.split(',').map(p => p.trim());
                          
                          playerNames.forEach(playerStr => {
                            const name = playerStr.split(':')[0].trim();
                            // 현재 선수 제외
                            if (name !== player.name) {
                              const playerInfo = getPlayerByName(name);
                              if (playerInfo) {
                                ourTeamPlayers.push({
                                  name,
                                  race: playerInfo.종족
                                });
                              } else {
                                // playerInfo를 찾을 수 없는 경우 기본값 사용
                                ourTeamPlayers.push({
                                  name,
                                  race: 'Unknown'
                                });
                              }
                            }
                          });
                        }

                        return (
                        <TableRow key={index} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold">
                              {match.round}R {match.matchNumber}M ({match.type})
                            </Typography>
                          </TableCell>
                          <TableCell>{match.map}</TableCell>
                          <TableCell>
                            {match.type === '개인전' ? (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <RaceIcon race={player.race}>{player.race}</RaceIcon>
                                <Typography variant="body2" component="span">
                                  {player.name}
                                </Typography>
                              </Box>
                            ) : (
                              <Box sx={{ 
                                display: 'flex', 
                                flexWrap: 'nowrap', 
                                gap: 0.5, 
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}>
                                {/* 현재 선수 (굵게 표시) */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                                  <RaceIcon race={player.race}>{player.race}</RaceIcon>
                                  <Typography variant="body2" component="span" fontWeight="bold">
                                    {player.name}
                                  </Typography>
                                </Box>
                                {/* 팀원들 */}
                                {ourTeamPlayers.length > 0 && ourTeamPlayers.map((teammate, idx) => (
                                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                                    <Typography variant="body2" color="text.secondary" component="span">
                                      ,
                                    </Typography>
                                    <RaceIcon race={teammate.race}>{teammate.race}</RaceIcon>
                                    <Typography variant="body2" component="span">
                                      {teammate.name}
                                    </Typography>
                                  </Box>
                                ))}
                              </Box>
                            )}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ 
                              display: 'flex', 
                              flexWrap: 'nowrap', 
                              gap: 0.5,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {match.opponents.map((opponent, idx) => (
                                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                                  <RaceIcon race={opponent.race}>{opponent.race}</RaceIcon>
                                  <Typography variant="body2" component="span">
                                    {opponent.name}
                                  </Typography>
                                  {idx < match.opponents.length - 1 && (
                                    <Typography variant="body2" color="text.secondary" component="span">
                                      ,
                                    </Typography>
                                  )}
                                </Box>
                              ))}
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={match.isWin ? '승' : '패'}
                              size="small"
                              color={match.isWin ? 'success' : 'error'}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Typography
                              variant="body2"
                              color={match.eloChange > 0 ? 'success.main' : 'error.main'}
                              fontWeight="bold"
                            >
                              {match.eloChange > 0 ? '+' : ''}{match.eloChange}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="bold">
                              {match.elo}
                            </Typography>
                          </TableCell>
                        </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerDetailCard;
