import { Box, Typography } from "@mui/material";
import { useRef, useEffect } from "react";
import PlayerBox from "../components/PlayerBox";
import useBroadcastStore from "../stores/broadcastStore";

function BroadcastPage() {
  const videoRef = useRef(null);
  const { homeTeam, awayTeam, getCurrentPlayers } = useBroadcastStore();
  const { homePlayer, awayPlayer } = getCurrentPlayers();

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch((err) => {
        console.log("자동 재생 실패 (사용자 상호작용 필요):", err);
      });
    }
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        aspectRatio: "16/9",
        overflow: "hidden",
      }}
    >
      {/* 배경 비디오 */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      >
        <source src="/versus.mp4" type="video/mp4" />
      </video>

      {/* 팀 정보 - 상단 가운데 */}
      <Box
        sx={{
          position: "absolute",
          top: 20,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 3,
          background: "rgba(0, 0, 0, 0.7)",
          borderRadius: 2,
          width: 1250,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: 400,
          }}
        >
          {/* 홈팀 로고 */}
          <Box
            component="img"
            src={`/team_logo/${homeTeam.name.split(" ")[0]}.jpg`}
            alt={`${homeTeam.name} 로고`}
            sx={{
              width: 80,
              height: 80,
              borderRadius: 2,
              objectFit: "cover",
              ml: 2,
            }}
          />

          {/* 홈팀 이름 */}
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              color: "#E8F4FD",
              textAlign: "center",
              textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
              background: "linear-gradient(135deg, #ff6b9d 0%, #ff8a50 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.5))",
            }}
          >
            {homeTeam.name}
          </Typography>
        </Box>

        {/* 점수 */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
            borderRadius: 3,
            padding: "16px 32px",
            border: "3px solid #17292eff",
            boxShadow:
              "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 2px 0 rgba(255,255,255,0.1)",
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontWeight: "bold",
              color: "#ecf0f1",
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              fontSize: "4rem",
            }}
          >
            {homeTeam.score} : {awayTeam.score}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: 400,
          }}
        >
          {/* 어웨이팀 이름 */}
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              color: "#E8F4FD",
              textAlign: "center",
              textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
              background: "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.5))",
            }}
          >
            {awayTeam.name}
          </Typography>

          {/* 어웨이팀 로고 */}
          <Box
            component="img"
            src={`/team_logo/${awayTeam.name.split(" ")[0]}.jpg`}
            alt={`${awayTeam.name} 로고`}
            sx={{
              width: 80,
              height: 80,
              borderRadius: 2,
              objectFit: "cover",
              mr: 2,
            }}
          />
        </Box>
      </Box>
      {/* 오버레이 컨텐츠 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          textAlign: "center",
          zIndex: 2,
          padding: 4,
          gap: 30,
          marginTop: 18,
        }}
      >
        <PlayerBox playerName={homePlayer || "홈 플레이어"} />
        <PlayerBox playerName={awayPlayer || "어웨이 플레이어"} />
      </Box>
    </Box>
  );
}

export default BroadcastPage;
