import { Box, Typography } from "@mui/material";
import { useRef, useEffect } from "react";
import PlayerBox from "../components/PlayerBox";

function BroadcastPage() {
  const videoRef = useRef(null);

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

      {/* 오버레이 컨텐츠 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          textAlign: "center",
          color: "white",
          zIndex: 2,
          padding: 4,
          borderRadius: 2,
          gap: 30
        }}
      >
        <PlayerBox playerName="강응선" />
        <PlayerBox playerName="김연섭" />
      </Box>
    </Box>
  );
}

export default BroadcastPage;
