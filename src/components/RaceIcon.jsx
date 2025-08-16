import React from 'react';
import { Box } from '@mui/material';

const RaceIcon = ({ race, size = 24, sx = {} }) => {
  const getRaceStyle = (race) => {
    switch (race) {
      case 'P': 
        return { 
          backgroundColor: '#FFD700', 
          color: 'black', 
          symbol: 'P' 
        };
      case 'T': 
        return { 
          backgroundColor: '#87CEEB', 
          color: 'black', 
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
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: style.backgroundColor,
        color: style.color,
        fontSize: `${size * 0.5}px`,
        fontWeight: 'bold',
        flexShrink: 0,
        ...sx
      }}
    >
      {style.symbol}
    </Box>
  );
};

export default RaceIcon;
