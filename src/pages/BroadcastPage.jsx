import { Box, Typography } from "@mui/material";
import { useRef, useEffect } from "react";
import PlayerBox from "../components/PlayerBox";
import useBroadcastStore from "../stores/broadcastStore";
import scoreboard_mini from "../assets/scoreboard_mini.png";
import { getPlayerByName } from "../stores/playersStore";

function BroadcastPage() {
  const videoRef = useRef(null);
  const {
    homeTeam,
    awayTeam,
    getCurrentPlayers,
    matchResults,
    currentRound,
    isOnGame,
    matchTitle,
    setMatchTitle,
  } = useBroadcastStore();
  const { homePlayer, awayPlayer } = getCurrentPlayers();

  // 현재 라운드의 승리자 확인
  const currentRoundResult = matchResults.find(
    (result) => result.round === currentRound - 1
  );
  const isHomePlayerWinner = currentRoundResult?.winner === "home";
  const isAwayPlayerWinner = currentRoundResult?.winner === "away";

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch((err) => {
        console.log("자동 재생 실패 (사용자 상호작용 필요):", err);
      });
    }
  }, []);

  const homePlayerInfo = getPlayerByName(homePlayer);
  const homePlayerRace = homePlayerInfo?.종족;
  const awayPlayerInfo = getPlayerByName(awayPlayer);
  const awayPlayerRace = awayPlayerInfo?.종족;

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
        backgroundColor: isOnGame ? "green" : "transparent", // 게임 중일 때 녹색 배경
      }}
    >
      {/* 게임 대기 중일 때만 모든 컨텐츠 표시 */}
      {!isOnGame && (
        <>
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
                width: 500,
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

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flex: 1,
                }}
              >
                {/* 홈팀 이름 */}
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: "bold",
                    color: "#E8F4FD",
                    textAlign: "center",
                    textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
                    background:
                      "linear-gradient(135deg, #ff6b9d 0%, #ff8a50 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.5))",
                  }}
                >
                  {homeTeam.name}
                </Typography>
                {/* 홈팀 승패 히스토리 */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 1,
                    mt: 1,
                    justifyContent: "center",
                  }}
                >
                  {matchResults.map((result, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        width: 22,
                        height: 22,
                        borderRadius: 1,
                        backgroundColor:
                          result.winner === "home" ? "#22c55e" : "#ef4444",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        transition: "background 0.3s",
                      }}
                    />
                  ))}
                </Box>
              </Box>
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
                width: 500,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flex: 1,
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
                    background:
                      "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.5))",
                  }}
                >
                  {awayTeam.name}
                </Typography>
                {/* 어웨이팀 승패 히스토리 */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 1,
                    mt: 1,
                    justifyContent: "center",
                  }}
                >
                  {matchResults.map((result, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        width: 22,
                        height: 22,
                        borderRadius: 1,
                        backgroundColor:
                          result.winner === "away" ? "#22c55e" : "#ef4444",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        transition: "background 0.3s",
                      }}
                    />
                  ))}
                </Box>
              </Box>

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
            <PlayerBox
              playerName={homePlayer || "홈 플레이어"}
              isWinner={isHomePlayerWinner}
            />
            <PlayerBox
              playerName={awayPlayer || "어웨이 플레이어"}
              isWinner={isAwayPlayerWinner}
            />
          </Box>
        </>
      )}
      {isOnGame && (
        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: 524,
            width: 258,
            zIndex: 10,
          }}
        >
          <img
            src={scoreboard_mini}
            alt="Scoreboard Mini"
            style={{ width: "100%", display: "block" }}
          />
          <input
            type="text"
            value={matchTitle}
            onChange={(e) => setMatchTitle(e.target.value)}
            placeholder="match title"
            style={{
              position: "absolute",
              top: 4,
              left: "50%",
              transform: "translateX(-50%)",
              width: "100%",
              fontSize: "1rem",
              background: "transparent",
              zIndex: 20,
              border: "none",
              textAlign: "center",
            }}
          />
          <Box
            display="flex"
            justifyContent="space-between"
            sx={{
              position: "absolute",
              top: 30,
              left: "50%",
              transform: "translateX(-50%)",
              width: "80%",
              textAlign: "center",
              zIndex: 21,
              color: "white",
              fontWeight: "bold",
              fontSize: "1.1rem",
            }}
          >
            <Typography sx={{ fontWeight: "bold" }}>{homePlayer}</Typography>
            <Box
              sx={{
                backgroundColor: "#c49820ff",
                pl: 1,
                pr: 1,
                borderRadius: 2,
              }}
            >
              <Typography variant="h7" sx={{ fontWeight: "bold" }}>
                {homeTeam.score} : {awayTeam.score}
              </Typography>
            </Box>
            <Typography sx={{ fontWeight: "bold" }}>{awayPlayer}</Typography>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            sx={{
              position: "absolute",
              top: 60,
              left: "50%",
              transform: "translateX(-50%)",
              width: "80%",
              textAlign: "center",
              zIndex: 21,
              color: "white",
              fontWeight: "bold",
              fontSize: "1.1rem",
            }}
          >
            <Typography sx={{ fontWeight: "bold" }}>
              {homePlayerRace}
            </Typography>
            <Typography sx={{ fontWeight: "bold" }}>
              {awayPlayerRace}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default BroadcastPage;
