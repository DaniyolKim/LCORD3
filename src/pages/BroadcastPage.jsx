import { Box, Typography } from "@mui/material";
import { useRef, useEffect } from "react";

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
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            color: "white",
            position: "relative",
            zIndex: 2,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            padding: 4,
            borderRadius: 2,
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          1
        </Box>
        <Box
          sx={{
            textAlign: "center",
            color: "white",
            position: "relative",
            zIndex: 2,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            padding: 4,
            borderRadius: 2,
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          2
        </Box>
      </Box>
    </Box>
  );
}

export default BroadcastPage;
