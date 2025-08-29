import React, { useState, useEffect } from "react";
import { Box, Typography, keyframes } from "@mui/material";
import { usePlayersStore } from "../stores/playersStore";
import SimplePlayerDetail from "./SimplePlayerDetail";
import RaceIcon from "./RaceIcon";
import protoss from "../assets/protoss.gif";
import zerg from "../assets/zerg.gif";
import terran from "../assets/terran.gif";
import random from "../assets/random.gif";

// 승리 애니메이션 키프레임 정의
const victoryPulse = keyframes`
  0% {
    transform: translateX(0) translateY(0);
    filter: brightness(1) drop-shadow(0 0 10px rgba(255, 215, 0, 0.5));
  }
  10% {
    transform: translateX(-2px) translateY(-1px);
    filter: brightness(1.8) drop-shadow(0 0 25px rgba(255, 215, 0, 0.9)) drop-shadow(0 0 40px rgba(255, 255, 255, 0.3));
  }
  20% {
    transform: translateX(2px) translateY(1px);
    filter: brightness(1.5) drop-shadow(0 0 30px rgba(255, 215, 0, 1)) drop-shadow(0 0 50px rgba(255, 255, 255, 0.4));
  }
  30% {
    transform: translateX(-1px) translateY(-2px);
    filter: brightness(2) drop-shadow(0 0 35px rgba(255, 215, 0, 1)) drop-shadow(0 0 60px rgba(255, 255, 255, 0.5));
  }
  40% {
    transform: translateX(1px) translateY(2px);
    filter: brightness(1.6) drop-shadow(0 0 25px rgba(255, 215, 0, 0.8)) drop-shadow(0 0 45px rgba(255, 255, 255, 0.3));
  }
  50% {
    transform: translateX(-2px) translateY(0);
    filter: brightness(1.9) drop-shadow(0 0 40px rgba(255, 215, 0, 1)) drop-shadow(0 0 70px rgba(255, 255, 255, 0.6));
  }
  60% {
    transform: translateX(2px) translateY(-1px);
    filter: brightness(1.4) drop-shadow(0 0 20px rgba(255, 215, 0, 0.7)) drop-shadow(0 0 35px rgba(255, 255, 255, 0.2));
  }
  70% {
    transform: translateX(-1px) translateY(1px);
    filter: brightness(1.7) drop-shadow(0 0 30px rgba(255, 215, 0, 0.9)) drop-shadow(0 0 50px rgba(255, 255, 255, 0.4));
  }
  80% {
    transform: translateX(1px) translateY(-2px);
    filter: brightness(1.3) drop-shadow(0 0 15px rgba(255, 215, 0, 0.6)) drop-shadow(0 0 25px rgba(255, 255, 255, 0.2));
  }
  90% {
    transform: translateX(-1px) translateY(0);
    filter: brightness(1.1) drop-shadow(0 0 12px rgba(255, 215, 0, 0.5));
  }
  100% {
    transform: translateX(0) translateY(0);
    filter: brightness(1) drop-shadow(0 0 10px rgba(255, 215, 0, 0.5));
  }
`;

const borderGlow = keyframes`
  0% {
    border-color: rgba(255, 215, 0, 0.3);
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
  }
  50% {
    border-color: rgba(255, 215, 0, 1);
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.8), 0 0 50px rgba(255, 215, 0, 0.5);
  }
  100% {
    border-color: rgba(255, 215, 0, 0.3);
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
  }
`;

// 종족별 GIF 배경 가져오기
const getRaceBackground = (race) => {
  switch (race) {
    case "P":
      return protoss;
    case "T":
      return terran;
    case "Z":
      return zerg;
    case "R":
    default:
      return random;
  }
};

const PlayerBox = ({ playerId, playerName, isWinner = false }) => {
  const [showDetail, setShowDetail] = useState(false);
  const [showVictoryEffect, setShowVictoryEffect] = useState(false);
  const { getPlayerById, getPlayerByName } = usePlayersStore();

  // 승리 상태가 변경될 때 애니메이션 트리거
  useEffect(() => {
    if (isWinner) {
      setShowVictoryEffect(true);
      // 5초 후 애니메이션 효과 제거
      const timer = setTimeout(() => {
        setShowVictoryEffect(false);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setShowVictoryEffect(false);
    }
  }, [isWinner]);

  // playerId 또는 playerName으로 선수 정보 찾기
  const player = playerId
    ? getPlayerById(playerId)
    : getPlayerByName(playerName);

  if (!player) {
    return (
      <Box
        sx={{
          textAlign: "center",
          color: "white",
          position: "relative",
          zIndex: 2,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          padding: 3,
          borderRadius: 2,
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          minWidth: 200,
          mx: 1,
        }}
      >
        <Typography variant="h6" color="white">
          선수 정보 없음
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "relative",
        mx: 1,
        perspective: "1000px",
        width: 450,
        height: 600,
        animation: showVictoryEffect ? `${victoryPulse} 1.2s ease-in-out infinite` : 'none',
        transition: 'all 0.3s ease-in-out',
      }}
    >
  {/* 승리 스파클 이펙트 제거됨 */}

      {/* 카드 컨테이너 */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transition: "transform 0.6s",
          transform: showDetail ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* 앞면 - 기본 선수 정보 */}
        <Box
          onClick={() => setShowDetail(!showDetail)}
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            textAlign: "center",
            color: "white",
            backgroundColor: showVictoryEffect ? "rgba(255, 215, 0, 0.1)" : "rgba(0, 0, 0, 0.3)",
            backgroundImage: `url(${getRaceBackground(player.종족)})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            padding: 3,
            borderRadius: 2,
            backdropFilter: "blur(5px)",
            border: showVictoryEffect 
              ? "2px solid rgba(255, 215, 0, 0.8)" 
              : "1px solid rgba(255, 255, 255, 0.2)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            animation: showVictoryEffect ? `${borderGlow} 2s ease-in-out infinite` : 'none',
            "&:hover": {
              backgroundColor: showVictoryEffect ? "rgba(255, 215, 0, 0.2)" : "rgba(0, 0, 0, 0.5)",
            },
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: showVictoryEffect ? "rgba(255, 215, 0, 0.15)" : "rgba(0, 0, 0, 0.4)",
              borderRadius: 2,
              zIndex: 1,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              zIndex: 2,
              gap: 2,
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: "bold",
                position: "relative",
                zIndex: 2,
                color: showVictoryEffect ? "#FFD700" : "white",
                textShadow: showVictoryEffect 
                  ? "0 0 10px rgba(255, 215, 0, 0.8), 0 0 20px rgba(255, 215, 0, 0.6)" 
                  : "none",
                transition: "all 0.3s ease-in-out",
              }}
            >
              {player.이름}
            </Typography>
            <RaceIcon 
              race={player.종족} 
              useEm={true} 
              size={32}
              sx={{
                position: "relative",
                zIndex: 2,
                fontSize: "1.5em",
                filter: showVictoryEffect 
                  ? "drop-shadow(0 0 10px rgba(255, 215, 0, 0.8))" 
                  : "none",
                transition: "all 0.3s ease-in-out",
              }}
            />
          </Box>
          <Typography 
            variant="h3" 
            sx={{ 
              opacity: 0.8,
              color: showVictoryEffect ? "#FFD700" : "white",
              textShadow: showVictoryEffect 
                ? "0 0 8px rgba(255, 215, 0, 0.6)" 
                : "none",
              transition: "all 0.3s ease-in-out",
            }}
          >
            ({player.id})
          </Typography>
        </Box>

        {/* 뒤면 - 상세 정보 */}
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            overflow: "hidden",
          }}
        >
          <SimplePlayerDetail
            player={player}
            onClose={() => setShowDetail(false)}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default PlayerBox;
