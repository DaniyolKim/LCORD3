import { create } from "zustand";
import Papa from "papaparse";

// 게임 데이터 스토어
export const useGameDataStore = create((set, get) => ({
  data: [],
  loading: true,
  error: null,

  // CSV 데이터 로드
  loadGameData: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        "https://raw.githubusercontent.com/donghyun88/lgcraft/refs/heads/main/input.csv"
      );
      const text = await response.text();

      Papa.parse(text, {
        header: true,
        complete: (results) => {
          const filteredData = results.data.filter(
            (row) => row.round && row.match
          );
          set({ data: filteredData, loading: false });
        },
        error: (error) => {
          console.error("CSV 파싱 오류:", error);
          set({ error: error.message, loading: false });
        },
      });
    } catch (error) {
      console.error("데이터 로드 오류:", error);
      set({ error: error.message, loading: false });
    }
  },

  // 데이터 필터링 함수들
  getDataByRound: (round) => {
    const { data } = get();
    return round === "all" ? data : data.filter((row) => row.round === round);
  },

  getDataByType: (type) => {
    const { data } = get();
    return type === "all" ? data : data.filter((row) => row.type === type);
  },

  getFilteredData: (round, type) => {
    const { data } = get();
    let filtered = data;

    if (round !== "all") {
      filtered = filtered.filter((row) => row.round === round);
    }

    if (type !== "all") {
      filtered = filtered.filter((row) => row.type === type);
    }

    return filtered;
  },
}));

// 선수 메타데이터 상수
const PLAYERS_META = [
  { id: "Tana", 이름: "이대연", 팀: 1, 종족: "Z", 티어: "갓" },
  { id: "Sword", 이름: "김연섭", 팀: 1, 종족: "T", 티어: "갓" },
  { id: "Cain", 이름: "김태훈", 팀: 1, 종족: "P", 티어: "갓" },
  { id: "WoongD", 이름: "구선웅", 팀: 1, 종족: "T", 티어: "휴" },
  { id: "HKK", 이름: "전성민", 팀: 1, 종족: "Z", 티어: "휴" },
  { id: "MiMiMong", 이름: "이창언", 팀: 1, 종족: "Z", 티어: "휴" },
  { id: "KuSan", 이름: "강구산", 팀: 1, 종족: "Z", 티어: "애" },
  { id: "ziLLeKi", 이름: "최성진", 팀: 1, 종족: "P", 티어: "애" },
  { id: "Nucleus", 이름: "김기현", 팀: 1, 종족: "T", 티어: "애" },
  { id: "jjabTana", 이름: "김현기", 팀: 1, 종족: "Z", 티어: "애" },
  { id: "HD", 이름: "조항용", 팀: 1, 종족: "P", 티어: "애" },
  { id: "Toast", 이름: "설재근", 팀: 1, 종족: "P", 티어: "아" },
  { id: "Kensay", 이름: "이경성", 팀: 1, 종족: "Z", 티어: "아" },
  { id: "Hillock", 이름: "강응선", 팀: 2, 종족: "P", 티어: "갓" },
  { id: "sEpI", 이름: "김경식", 팀: 2, 종족: "T", 티어: "갓" },
  { id: "Jenny", 이름: "박진욱", 팀: 2, 종족: "Z", 티어: "휴" },
  { id: "rOdeO", 이름: "김재현", 팀: 2, 종족: "Z", 티어: "휴" },
  { id: "beat", 이름: "이동규", 팀: 2, 종족: "Z", 티어: "휴" },
  { id: "KJJ", 이름: "경제진", 팀: 2, 종족: "T", 티어: "휴" },
  { id: "Twin", 이름: "유윤실", 팀: 2, 종족: "P", 티어: "애" },
  { id: "Asada", 이름: "공동현", 팀: 2, 종족: "Z", 티어: "애" },
  { id: "StyLe", 이름: "한규호", 팀: 2, 종족: "P", 티어: "애" },
  { id: "ZirubAk", 이름: "방호석", 팀: 2, 종족: "Z", 티어: "애" },
  { id: "SandbaG", 이름: "염규상", 팀: 2, 종족: "P", 티어: "애" },
  { id: "Tori", 이름: "양시찬", 팀: 2, 종족: "P", 티어: "아" },
  { id: "zoa", 이름: "서승일", 팀: 2, 종족: "Z", 티어: "아" },
  { id: "MansaeGii", 이름: "문명훈", 팀: 3, 종족: "P", 티어: "갓" },
  { id: "Nolg", 이름: "채원식", 팀: 3, 종족: "Z", 티어: "갓" },
  { id: "Pooooker", 이름: "전은후", 팀: 3, 종족: "P", 티어: "휴" },
  { id: "SSangBak", 이름: "이종열", 팀: 3, 종족: "T", 티어: "휴" },
  { id: "wassub", 이름: "이형섭", 팀: 3, 종족: "P", 티어: "휴" },
  { id: "Evicu", 이름: "변진황", 팀: 3, 종족: "P", 티어: "휴" },
  { id: "G9in", 이름: "정명열", 팀: 3, 종족: "P", 티어: "애" },
  { id: "PerfecT", 이름: "손정곤", 팀: 3, 종족: "T", 티어: "애" },
  { id: "CibalBattle", 이름: "정현우", 팀: 3, 종족: "Z", 티어: "애" },
  { id: "tRalala", 이름: "박지훈", 팀: 3, 종족: "Z", 티어: "애" },
  { id: "Hjvita", 이름: "양현철", 팀: 3, 종족: "P", 티어: "아" },
  { id: "catcat", 이름: "권노흠", 팀: 3, 종족: "Z", 티어: "아" },
  { id: "benpro", 이름: "임병헌", 팀: 3, 종족: "PT", 티어: "아" },
  { id: "ShaDOw", 이름: "박재창", 팀: 4, 종족: "T", 티어: "갓" },
  { id: "Bullfrog", 이름: "오택삼", 팀: 4, 종족: "Z", 티어: "갓" },
  { id: "Alive", 이름: "이윤종", 팀: 4, 종족: "T", 티어: "갓" },
  { id: "sky9898", 이름: "최상균", 팀: 4, 종족: "ZP", 티어: "휴" },
  { id: "Sign1666", 이름: "김주한", 팀: 4, 종족: "P", 티어: "휴" },
  { id: "Naldo", 이름: "김이헌", 팀: 4, 종족: "Z", 티어: "휴" },
  { id: "TheMan", 이름: "조현용", 팀: 4, 종족: "P", 티어: "휴" },
  { id: "No-Gi", 이름: "유태욱", 팀: 4, 종족: "Z", 티어: "애" },
  { id: "Pixel", 이름: "임호진", 팀: 4, 종족: "T", 티어: "애" },
  { id: "Goat", 이름: "김동환", 팀: 4, 종족: "P", 티어: "애" },
  { id: "Tiempo", 이름: "이태경", 팀: 4, 종족: "T", 티어: "애" },
  { id: "GR", 이름: "박가람", 팀: 4, 종족: "P", 티어: "아" },
  { id: "Kakaru", 이름: "정주오", 팀: 4, 종족: "P", 티어: "아" },
  { id: "ZZAKSSON", 이름: "김재우", 팀: 4, 종족: "P", 티어: "아" },
  { id: "Raon", 이름: "예의현", 팀: 5, 종족: "P", 티어: "갓" },
  { id: "HON", 이름: "장민수", 팀: 5, 종족: "Z", 티어: "갓" },
  { id: "King", 이름: "변정식", 팀: 5, 종족: "Z", 티어: "휴" },
  { id: "dOngkim!", 이름: "김동현", 팀: 5, 종족: "P", 티어: "휴" },
  { id: "berrykim", 이름: "주효진", 팀: 5, 종족: "Z", 티어: "휴" },
  { id: "Freeman", 이름: "박정진", 팀: 5, 종족: "P", 티어: "애" },
  { id: "home", 이름: "우병진", 팀: 5, 종족: "Z", 티어: "애" },
  { id: "gunstory", 이름: "공동건", 팀: 5, 종족: "Z", 티어: "애" },
  { id: "casino", 이름: "이정훈", 팀: 5, 종족: "PT", 티어: "애" },
  { id: "Xellos", 이름: "최화용", 팀: 5, 종족: "T", 티어: "애" },
  { id: "STeVe", 이름: "최수명", 팀: 5, 종족: "P", 티어: "아" },
  { id: "Valc", 이름: "이재혁", 팀: 5, 종족: "P", 티어: "아" },
  { id: "hahaha", 이름: "이윤호", 팀: 5, 종족: "Z", 티어: "아" },
  { id: "Castle", 이름: "김종성", 팀: 6, 종족: "T", 티어: "갓" },
  { id: "ggamak", 이름: "정용석", 팀: 6, 종족: "Z", 티어: "갓" },
  { id: "Nope", 이름: "안태영", 팀: 6, 종족: "Z", 티어: "갓" },
  { id: "Atta", 이름: "이봉철", 팀: 6, 종족: "Z", 티어: "휴" },
  { id: "Panya", 이름: "조승일", 팀: 6, 종족: "P", 티어: "휴" },
  { id: "BMC", 이름: "장승룡", 팀: 6, 종족: "P", 티어: "휴" },
  { id: "JH", 이름: "손재현", 팀: 6, 종족: "Z", 티어: "휴" },
  { id: "sAviOr", 이름: "권혁준", 팀: 6, 종족: "R", 티어: "애" },
  { id: "JY", 이름: "황진영", 팀: 6, 종족: "Z", 티어: "애" },
  { id: "SeaSee", 이름: "김태준", 팀: 6, 종족: "P", 티어: "애" },
  { id: "glory", 이름: "황정동", 팀: 6, 종족: "R", 티어: "아" },
  { id: "Eco", 이름: "박지호", 팀: 6, 종족: "P", 티어: "아" },
  { id: "bradsk", 이름: "오석현", 팀: 6, 종족: "Z", 티어: "아" },
];

// 선수 스토어
export const usePlayersStore = create((set, get) => ({
  players: PLAYERS_META,

  // 액션: ID로 선수 찾기
  getPlayerById: (id) => {
    const { players } = get();
    return players.find((player) => player.id === id);
  },

  // 액션: 이름으로 선수 찾기
  getPlayerByName: (name) => {
    const { players } = get();
    return players.find((player) => player.이름 === name);
  },

  // 액션: 팀별 선수 목록 가져오기
  getPlayersByTeam: (teamNumber) => {
    const { players } = get();
    return players.filter((player) => player.팀 === teamNumber);
  },

  // 액션: 종족별 선수 목록 가져오기
  getPlayersByRace: (race) => {
    const { players } = get();
    return players.filter((player) => player.종족 === race);
  },

  // 액션: 티어별 선수 목록 가져오기
  getPlayersByTier: (tier) => {
    const { players } = get();
    return players.filter((player) => player.티어 === tier);
  },
}));

// 편의를 위한 헬퍼 함수들
export const getPlayerById = (id) =>
  usePlayersStore.getState().getPlayerById(id);
export const getPlayerByName = (name) =>
  usePlayersStore.getState().getPlayerByName(name);
export const getPlayersByTeam = (teamNumber) =>
  usePlayersStore.getState().getPlayersByTeam(teamNumber);
export const getPlayersByRace = (race) =>
  usePlayersStore.getState().getPlayersByRace(race);
export const getPlayersByTier = (tier) =>
  usePlayersStore.getState().getPlayersByTier(tier);
