import { Link, useLocation } from 'react-router-dom'
import { 
  Drawer as MuiDrawer, 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText
} from '@mui/material'
import { Tv, Users } from 'lucide-react'

function Drawer() {
  const location = useLocation()

  const menuItems = [
    {
      path: '/',
      icon: Tv,
      label: '방송화면',
      description: '라이브 방송 관리'
    },
    {
      path: '/playeranalyze',
      icon: Users,
      label: '선수 분석',
      description: '선수별 상세 통계'
    }
  ]

  return (
    <MuiDrawer
      variant="permanent"
      anchor="right"
      sx={{
        width: 300,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 300,
          boxSizing: 'border-box',
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          color: 'white',
          border: 'none',
          boxShadow: '2px 0 10px rgba(0, 0, 0, 0.15)'
        },
      }}
    >
      <Box sx={{ p: 3, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#f1f5f9', mb: 1 }}>
          위너스리그
        </Typography>
        <Typography variant="body2" sx={{ color: '#94a3b8' }}>
          관리 대시보드
        </Typography>
      </Box>
      
      <List sx={{ p: 0, mt: 2 }}>
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                sx={{
                  py: 2,
                  px: 3,
                  color: isActive ? '#60a5fa' : '#cbd5e1',
                  borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
                  backgroundColor: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#f1f5f9',
                    borderLeft: '3px solid #3b82f6'
                  }
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                  <Icon size={20} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {item.label}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" sx={{ color: 'inherit', opacity: 0.7, lineHeight: 1.2 }}>
                      {item.description}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
      
      <Box sx={{ mt: 'auto', p: 3, borderTop: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: '#64748b' }}>
          v1.0.0
        </Typography>
      </Box>
    </MuiDrawer>
  )
}

export default Drawer
