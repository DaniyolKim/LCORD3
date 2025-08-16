import { create } from "zustand";
import { persist } from "zustand/middleware";

const useBroadcastStore = create(
  persist(
    (set, get) => ({
      // 홈팀 정보
      homeTeam: {
        name: "",
        players: ["", "", "", "", "", "", ""],
        score: 0,
        currentPlayerIndex: 0,
      },

      // 어웨이팀 정보
      awayTeam: {
        name: "",
        players: ["", "", "", "", "", "", ""],
        score: 0,
        currentPlayerIndex: 0,
      },

      // 현재 경기 상태
      currentRound: 1,
      matchResults: [], // 각 경기 결과를 저장
      isOnGame: false, // 게임 진행 상태 (false: 게임 대기 중, true: 게임 중)

      // 홈팀 정보 업데이트
      setHomeTeam: (teamData) =>
        set((state) => ({
          homeTeam: { ...state.homeTeam, ...teamData },
        })),

      // 어웨이팀 정보 업데이트
      setAwayTeam: (teamData) =>
        set((state) => ({
          awayTeam: { ...state.awayTeam, ...teamData },
        })),

      // 홈팀 플레이어 업데이트
      setHomePlayer: (index, playerName) =>
        set((state) => {
          const newPlayers = [...state.homeTeam.players];
          newPlayers[index] = playerName;
          return {
            homeTeam: { ...state.homeTeam, players: newPlayers },
          };
        }),

      // 어웨이팀 플레이어 업데이트
      setAwayPlayer: (index, playerName) =>
        set((state) => {
          const newPlayers = [...state.awayTeam.players];
          newPlayers[index] = playerName;
          return {
            awayTeam: { ...state.awayTeam, players: newPlayers },
          };
        }),

      // 승리팀 결정 및 다음 라운드로 진행
      setWinner: (winner) =>
        set((state) => {
          const { homeTeam, awayTeam } = state;
          const newHomeScore =
            winner === "home" ? homeTeam.score + 1 : homeTeam.score;
          const newAwayScore =
            winner === "away" ? awayTeam.score + 1 : awayTeam.score;

          // 다음 플레이어로 이동
          const nextHomePlayerIndex =
            (homeTeam.currentPlayerIndex + 1) % homeTeam.players.length;
          const nextAwayPlayerIndex =
            (awayTeam.currentPlayerIndex + 1) % awayTeam.players.length;

          return {
            homeTeam: {
              ...homeTeam,
              score: newHomeScore,
              currentPlayerIndex: nextHomePlayerIndex,
            },
            awayTeam: {
              ...awayTeam,
              score: newAwayScore,
              currentPlayerIndex: nextAwayPlayerIndex,
            },
            currentRound: state.currentRound + 1,
            matchResults: [
              ...state.matchResults,
              {
                round: state.currentRound,
                homePlayer: homeTeam.players[homeTeam.currentPlayerIndex],
                awayPlayer: awayTeam.players[awayTeam.currentPlayerIndex],
                winner,
                homeScore: newHomeScore,
                awayScore: newAwayScore,
              },
            ],
          };
        }),

      // 특정 라운드의 승리 결과 수정
      updateRoundWinner: (roundIndex, newWinner) =>
        set((state) => {
          const updatedResults = [...state.matchResults];
          const existingResultIndex = updatedResults.findIndex(
            (r) => r.round === roundIndex + 1
          );

          if (newWinner === null) {
            // 승리자 해제 - 해당 결과 제거
            if (existingResultIndex !== -1) {
              updatedResults.splice(existingResultIndex, 1);
            }
          } else {
            if (existingResultIndex !== -1) {
              // 기존 결과 수정
              updatedResults[existingResultIndex] = {
                ...updatedResults[existingResultIndex],
                winner: newWinner,
              };
            } else {
              // 새로운 결과 추가
              const newResult = {
                round: roundIndex + 1,
                homePlayer: state.homeTeam.players[roundIndex],
                awayPlayer: state.awayTeam.players[roundIndex],
                winner: newWinner,
                homeScore: 0, // 나중에 재계산됨
                awayScore: 0, // 나중에 재계산됨
              };
              updatedResults.push(newResult);
            }
          }

          // 스코어 재계산
          let newHomeScore = 0;
          let newAwayScore = 0;
          updatedResults.forEach((result) => {
            if (result.winner === "home") newHomeScore++;
            if (result.winner === "away") newAwayScore++;
          });

          // 현재 플레이어 인덱스 계산 (가장 높은 완료된 라운드 + 1)
          const completedRounds =
            updatedResults.length > 0
              ? Math.max(...updatedResults.map((r) => r.round))
              : 0;
          const nextPlayerIndex =
            completedRounds % state.homeTeam.players.length;

          return {
            ...state,
            homeTeam: {
              ...state.homeTeam,
              score: newHomeScore,
              currentPlayerIndex: nextPlayerIndex,
            },
            awayTeam: {
              ...state.awayTeam,
              score: newAwayScore,
              currentPlayerIndex: nextPlayerIndex,
            },
            currentRound: completedRounds + 1,
            matchResults: updatedResults,
          };
        }),

      // 게임 리셋
      resetGame: () =>
        set({
          homeTeam: {
            name: "",
            players: ["", "", "", "", "", "", ""],
            score: 0,
            currentPlayerIndex: 0,
          },
          awayTeam: {
            name: "",
            players: ["", "", "", "", "", "", ""],
            score: 0,
            currentPlayerIndex: 0,
          },
          currentRound: 1,
          matchResults: [],
          isOnGame: false,
        }),

      // 게임 상태 변경
      setIsOnGame: (isOnGame) =>
        set(() => ({
          isOnGame,
        })),

      // 현재 플레이어 정보 가져오기
      getCurrentPlayers: () => {
        const state = get();
        return {
          homePlayer:
            state.homeTeam.players[state.homeTeam.currentPlayerIndex] || "",
          awayPlayer:
            state.awayTeam.players[state.awayTeam.currentPlayerIndex] || "",
        };
      },
    }),
    {
      name: "broadcast-storage", // localStorage key name
      // 필요에 따라 특정 필드만 persist할 수 있음
      // partialize: (state) => ({
      //   homeTeam: state.homeTeam,
      //   awayTeam: state.awayTeam,
      //   matchResults: state.matchResults,
      //   currentRound: state.currentRound
      // })
    }
  )
);

export default useBroadcastStore;
