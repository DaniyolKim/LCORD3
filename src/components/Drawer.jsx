import { Link, useLocation } from "react-router-dom";
import {
  Drawer as MuiDrawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Divider,
  Switch,
  FormControlLabel,
} from "@mui/material";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import BarChartIcon from "@mui/icons-material/BarChart";
import useBroadcastStore from "../stores/broadcastStore";

const Drawer = () => {
  const location = useLocation();
  const {
    homeTeam,
    awayTeam,
    setHomeTeam,
    setAwayTeam,
    setHomePlayer,
    setAwayPlayer,
    updateRoundWinner,
    resetGame,
    matchResults,
    isOnGame,
    setIsOnGame,
  } = useBroadcastStore();

  const menuItems = [
    {
      path: "/",
      label: "방송화면",
      description: "라이브 방송 관리",
      icon: LiveTvIcon,
    },
    {
      path: "/playeranalyze",
      label: "선수 분석",
      description: "선수별 상세 통계",
      icon: BarChartIcon,
    },
  ];

  return (
    <MuiDrawer
      variant="permanent"
      anchor="right"
      sx={{
        width: 400,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 400,
          boxSizing: "border-box",
          background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
          color: "white",
          border: "none",
          boxShadow: "2px 0 10px rgba(0, 0, 0, 0.15)",
          overflow: "auto",
        },
      }}
    >
      <Box sx={{ p: 3, borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: "#f1f5f9" }}
        >
          LG크래프트
        </Typography>
      </Box>

      <List sx={{ p: 0, mt: 2 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                sx={{
                  py: 2,
                  px: 3,
                  color: isActive ? "#60a5fa" : "#cbd5e1",
                  borderLeft: isActive
                    ? "3px solid #3b82f6"
                    : "3px solid transparent",
                  backgroundColor: isActive
                    ? "rgba(59, 130, 246, 0.15)"
                    : "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    color: "#f1f5f9",
                    borderLeft: "3px solid #3b82f6",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                  <Icon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {item.label}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="caption"
                      sx={{ color: "inherit", opacity: 0.7, lineHeight: 1.2 }}
                    >
                      {item.description}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* 방송화면에서만 broadcast 관리 UI 표시 */}
      {location.pathname === "/" && (
        <>
          <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", mx: 2 }} />

          {/* 방송 관리 섹션 */}
          <Box sx={{ p: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: "#f1f5f9", fontWeight: "bold" }}
              >
                방송 관리
              </Typography>
              <Button
                size="small"
                onClick={resetGame}
                sx={{
                  color: "#f87171",
                  borderColor: "#f87171",
                  "&:hover": { borderColor: "#fca5a5" },
                }}
                variant="outlined"
              >
                리셋
              </Button>
            </Box>

            {/* 게임 상태 스위치 */}
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isOnGame}
                    onChange={(e) => setIsOnGame(e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#22c55e',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#22c55e',
                      },
                    }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: isOnGame ? '#22c55e' : '#6b7280',
                      }}
                    />
                    <Typography sx={{ color: '#f1f5f9' }}>
                      {isOnGame ? '게임 중' : '게임 대기 중'}
                    </Typography>
                  </Box>
                }
                sx={{ color: '#f1f5f9' }}
              />
            </Box>

            {/* 팀 설정 */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: "#cbd5e1" }}>
                팀 이름
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <TextField
                  label="홈팀"
                  size="small"
                  value={homeTeam.name}
                  onChange={(e) => setHomeTeam({ name: e.target.value })}
                  sx={{
                    flex: 1,
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                      "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" },
                      "&:hover fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.5)",
                      },
                      "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(255, 255, 255, 0.7)",
                    },
                  }}
                />
                <TextField
                  label="어웨이팀"
                  size="small"
                  value={awayTeam.name}
                  onChange={(e) => setAwayTeam({ name: e.target.value })}
                  sx={{
                    flex: 1,
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                      "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" },
                      "&:hover fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.5)",
                      },
                      "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(255, 255, 255, 0.7)",
                    },
                  }}
                />
              </Box>
            </Box>

            {/* 경기 관리 테이블 */}
            <Typography variant="subtitle2" sx={{ mb: 1, color: "#cbd5e1" }}>
              경기 관리
            </Typography>
            <TableContainer
              component={Paper}
              sx={{
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                maxHeight: 430,
                overflow: "auto",
              }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{ color: "white", fontWeight: "bold", p: 1 }}
                    ></TableCell>
                    <TableCell
                      sx={{ color: "white", fontWeight: "bold", p: 1 }}
                    >
                      홈
                    </TableCell>
                    <TableCell
                      sx={{ color: "white", fontWeight: "bold", p: 1 }}
                    >
                      어웨이
                    </TableCell>
                    <TableCell
                      sx={{ color: "white", fontWeight: "bold", p: 1 }}
                    >
                      승리
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[0, 1, 2, 3, 4, 5, 6].map((index) => {
                    const isCurrentRound =
                      index === homeTeam.currentPlayerIndex &&
                      index === awayTeam.currentPlayerIndex;
                    const result = matchResults.find(
                      (r) => r.round === index + 1
                    );

                    return (
                      <TableRow
                        key={index}
                        sx={{
                          backgroundColor: isCurrentRound
                            ? "rgba(59, 130, 246, 0.2)"
                            : "transparent",
                        }}
                      >
                        <TableCell
                          sx={{ color: "white", p: 1, fontSize: "0.8rem" }}
                        >
                          {index + 1}
                        </TableCell>
                        <TableCell sx={{ p: 1 }}>
                          <TextField
                            size="small"
                            value={homeTeam.players[index] || ""}
                            onChange={(e) =>
                              setHomePlayer(index, e.target.value)
                            }
                            placeholder={`홈 ${index + 1}`}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                color: "white",
                                fontSize: "0.8rem",
                                "& fieldset": {
                                  borderColor: "rgba(255, 255, 255, 0.2)",
                                },
                                "&:hover fieldset": {
                                  borderColor: "rgba(255, 255, 255, 0.3)",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#3b82f6",
                                },
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ p: 1 }}>
                          <TextField
                            size="small"
                            value={awayTeam.players[index] || ""}
                            onChange={(e) =>
                              setAwayPlayer(index, e.target.value)
                            }
                            placeholder={`어웨이 ${index + 1}`}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                color: "white",
                                fontSize: "0.8rem",
                                "& fieldset": {
                                  borderColor: "rgba(255, 255, 255, 0.2)",
                                },
                                "&:hover fieldset": {
                                  borderColor: "rgba(255, 255, 255, 0.3)",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#3b82f6",
                                },
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ p: 1 }}>
                          <Box sx={{ display: "flex", gap: 0.5 }}>
                            <Checkbox
                              size="small"
                              checked={result?.winner === "home"}
                              sx={{
                                color: "#4ade80",
                                p: 0,
                                "&.Mui-checked": { color: "#4ade80" },
                              }}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  updateRoundWinner(index, "home");
                                } else {
                                  updateRoundWinner(index, null);
                                }
                              }}
                            />
                            <Checkbox
                              size="small"
                              checked={result?.winner === "away"}
                              sx={{
                                color: "#f87171",
                                p: 0,
                                "&.Mui-checked": { color: "#f87171" },
                              }}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  updateRoundWinner(index, "away");
                                } else {
                                  updateRoundWinner(index, null);
                                }
                              }}
                            />
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </>
      )}
    </MuiDrawer>
  );
}

export default Drawer;
