import React, { useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Chip, 
  IconButton, 
  Card, 
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useGameDataStore, getPlayerByName } from '../stores/playersStore';
import RaceIcon from './RaceIcon';

const SimplePlayerDetail = ({ player, onClose }) => {
  const { data } = useGameDataStore();
  
  // 선수의 경기 데이터 계산
  const playerStats = useMemo(() => {
    if (!player || !data) return { matches: [], wins: 0, losses: 0, winRate: 0 };
    
    const matches = [];
    let wins = 0;
    let losses = 0;
    
    data.forEach((match, index) => {
      let isPlayerInMatch = false;
      let playerTeam = null;
      let isWin = false;
      
      // 팀1에서 선수 찾기
      if (match.team1_players) {
        const team1Players = match.team1_players.split(',').map(p => p.trim());
        const playerInTeam1 = team1Players.some(p => p.split(':')[0].trim() === player.이름);
        if (playerInTeam1) {
          isPlayerInMatch = true;
          playerTeam = 1;
          isWin = match.winner === '1';
        }
      }
      
      // 팀2에서 선수 찾기
      if (!isPlayerInMatch && match.team2_players) {
        const team2Players = match.team2_players.split(',').map(p => p.trim());
        const playerInTeam2 = team2Players.some(p => p.split(':')[0].trim() === player.이름);
        if (playerInTeam2) {
          isPlayerInMatch = true;
          playerTeam = 2;
          isWin = match.winner === '2';
        }
      }
      
      if (isPlayerInMatch) {
        // 상대팀 정보 구성
        const opponentTeamPlayers = [];
        const opponentTeamStr = playerTeam === 1 ? match.team2_players : match.team1_players;
        
        if (opponentTeamStr) {
          const opponentPlayerNames = opponentTeamStr.split(',').map(p => p.trim());
          opponentPlayerNames.forEach(playerStr => {
            const name = playerStr.split(':')[0].trim();
            const playerInfo = getPlayerByName(name);
            if (playerInfo) {
              opponentTeamPlayers.push({
                name,
                race: playerInfo.종족
              });
            } else {
              opponentTeamPlayers.push({
                name,
                race: 'Unknown'
              });
            }
          });
        }

        matches.push({
          ...match,
          playerTeam,
          isWin,
          index,
          opponents: opponentTeamPlayers
        });
        
        if (isWin) wins++;
        else losses++;
      }
    });
    
    const total = wins + losses;
    const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;
    
    return { matches: matches.reverse(), wins, losses, winRate, total };
  }, [player, data]);

  if (!player) return null;

  return (
    <Card 
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        color: 'white',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: 2,
      }}
    >
      <CardContent sx={{ p: 2 }}>
        {/* 헤더 - 닫기 버튼 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {player.이름} ({player.id})
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{ color: 'white', p: 0.5 }}
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* 전적 요약 */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#4ecdc4' }}>
            전적 요약
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                전체 승률:
              </Typography>
              <Chip
                label={`${playerStats.winRate}% (${playerStats.wins}승 ${playerStats.losses}패)`}
                size="small"
                sx={{
                  backgroundColor: playerStats.winRate >= 60 ? '#4caf50' : 
                                 playerStats.winRate >= 40 ? '#ff9800' : '#f44336',
                  color: 'white'
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                총 경기수:
              </Typography>
              <Typography variant="body2">
                {playerStats.total}경기
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* 경기 기록 */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2, color: '#4ecdc4' }}>
            최근 경기 기록
          </Typography>
          <TableContainer 
            component={Paper} 
            sx={{ 
              maxHeight: 350, 
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '& .MuiTableCell-root': {
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                fontSize: '0.7rem',
                padding: '4px 8px'
              }
            }}
          >
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>라운드</TableCell>
                  <TableCell sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>맵</TableCell>
                  <TableCell sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>상대</TableCell>
                  <TableCell sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }} align="center">결과</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {playerStats.matches.slice(0, 10).map((match, index) => (
                  <TableRow key={index} hover sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontSize: '0.7rem' }}>
                        {match.round}R {match.match}M
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.7, fontSize: '0.6rem' }}>
                        {match.type}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontSize: '0.7rem' }}>
                        {match.map}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: 0.5, 
                        alignItems: 'center',
                        maxWidth: '150px'
                      }}>
                        {match.opponents && match.opponents.map((opponent, idx) => (
                          <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                            <RaceIcon race={opponent.race} size={12} />
                            <Typography variant="body2" sx={{ fontSize: '0.6rem' }}>
                              {opponent.name}
                            </Typography>
                            {idx < match.opponents.length - 1 && (
                              <Typography variant="body2" sx={{ opacity: 0.5, fontSize: '0.6rem', mr: 0.25 }}>
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
                        sx={{
                          backgroundColor: match.isWin ? '#4caf50' : '#f44336',
                          color: 'white',
                          fontSize: '0.6rem',
                          height: '20px'
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SimplePlayerDetail;
