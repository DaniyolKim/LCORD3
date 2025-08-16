import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Box, CircularProgress, Typography, Button, Alert } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { useGameDataStore } from './stores/playersStore'
import Drawer from './components/Drawer'
import BroadcastPage from './pages/BroadcastPage'
import PlayerAnalyzePage from './pages/PlayerAnalyzePage'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
})

function App() {
  const { loadGameData, loading, error } = useGameDataStore()

  useEffect(() => {
    // 앱 시작시 CSV 데이터 로드
    loadGameData()
  }, [loadGameData])

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={60} sx={{ color: 'white', mb: 3 }} />
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
              위너스리그 데이터를 불러오는 중...
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              잠시만 기다려주세요
            </Typography>
          </Box>
        </Box>
      </ThemeProvider>
    )
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#fee2e2'
          }}
        >
          <Box
            sx={{
              textAlign: 'center',
              p: 5,
              bgcolor: 'white',
              borderRadius: 3,
              boxShadow: 3,
              border: '1px solid #fecaca'
            }}
          >
            <Typography variant="h4" sx={{ mb: 2, color: '#dc2626', fontWeight: 600 }}>
              데이터 로드 실패
            </Typography>
            <Alert severity="error" sx={{ mb: 3 }}>
              오류: {error}
            </Alert>
            <Button
              variant="contained"
              color="error"
              onClick={loadGameData}
              size="large"
            >
              다시 시도
            </Button>
          </Box>
        </Box>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', width: '100vw', height: '100vh' }}>
          <Box
            sx={{
              flex: 1,
              height: '100vh',
              aspectRatio: '16/9',
              overflow: 'auto',
              minHeight: '100vh'
            }}
          >
            <Routes>
              <Route path="/" element={<BroadcastPage />} />
              <Route path="/playeranalyze" element={<PlayerAnalyzePage />} />
            </Routes>
          </Box>
          <Drawer />
        </Box>
      </Router>
    </ThemeProvider>
  )
}

export default App
