import React from 'react';
import { Box } from '@mui/material';

const RaceIcon = ({ race, size = 24, useEm = false, sx = {} }) => {
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
          symbol: race 
        };
    }
  };

  const style = getRaceStyle(race);
  
  // useEm이 true면 em 단위를 사용해서 상위 컴포넌트의 font size에 맞춰 크기 조정
  const iconSize = useEm ? `${size / 16}em` : size;
  const iconFontSize = useEm ? '0.5em' : `${size * 0.5}px`;
  
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: iconSize,
        height: iconSize,
        borderRadius: '50%',
        backgroundColor: style.backgroundColor,
        color: style.color,
        fontSize: iconFontSize,
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
