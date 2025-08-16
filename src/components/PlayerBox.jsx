import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { usePlayersStore } from "../stores/playersStore";
import SimplePlayerDetail from "./SimplePlayerDetail";
import RaceIcon from "./RaceIcon";

// 종족별 GIF 배경 가져오기
const getRaceBackground = (race) => {
  switch (race) {
    case "P":
      return "/protoss.gif";
    case "T":
      return "/terran.gif";
    case "Z":
      return "/zerg.gif";
    case "R":
    default:
      return "/random.gif";
  }
};

const PlayerBox = ({ playerId, playerName }) => {
  const [showDetail, setShowDetail] = useState(false);
  const { getPlayerById, getPlayerByName } = usePlayersStore();

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
      }}
    >
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
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            backgroundImage: `url(${getRaceBackground(player.종족)})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            padding: 3,
            borderRadius: 2,
            backdropFilter: "blur(5px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            },
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.4)",
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
              }}
            />
          </Box>
          <Typography variant="h3" sx={{ opacity: 0.8 }}>
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
