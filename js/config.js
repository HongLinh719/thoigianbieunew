export const CONFIG = {
    PIN: "2022",
    LEVELS: {
        1: { requiredPoints: 0, title: "Mới bắt đầu" },
        2: { requiredPoints: 25, title: "Chăm ngoan" },
        3: { requiredPoints: 50, title: "Rất ngoan" },
        4: { requiredPoints: 75, title: "Xuất sắc" },
        5: { requiredPoints: 100, title: "Siêu sao" }
    },
    AUDIO_PATHS: {
        goodTask: "./audio/congratulation.mp3",
        levelUp: "./audio/level_up.mp3",
        badTask: "./audio/chua_tot.mp3",
        firework: "./audio/firework.mp3"
    }
};