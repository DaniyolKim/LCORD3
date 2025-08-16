import { Box, Typography, Paper, CircularProgress } from '@mui/material'
import { useGameDataStore } from '../stores/playersStore'
import PlayerStatsTable from '../components/PlayerStatsTable'

function PlayerAnalyzePage() {
  const { data, loading } = useGameDataStore()

  if (loading) {
    return (
      <Box
        sx={{
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f8fafc',
          aspectRatio: '16/9'
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h5" color="text.secondary">
            데이터를 불러오는 중...
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        p: 3,
        bgcolor: '#f8fafc',
        aspectRatio: '16/9'
      }}
    >
      <Box sx={{ mb: 4, pb: 3, borderBottom: '2px solid #e2e8f0' }}>
        <Typography
          variant="h3"
          sx={{
            color: '#1e293b',
            mb: 1,
            fontWeight: 'bold'
          }}
        >
          선수 통계 분석
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: '#64748b'
          }}
        >
          각 선수의 경기 성과와 통계를 분석합니다.
        </Typography>
      </Box>
      
      <Paper
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}
      >
        <PlayerStatsTable data={data} />
      </Paper>
    </Box>
  )
}

export default PlayerAnalyzePage
