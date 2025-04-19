export const CONFIG = {
    PIN: "2022",
    LEVELS: {
        1: { requiredPoints: 0, title: "Mới bắt đầu" },
        2: { requiredPoints: 25, title: "Chăm ngoan" },
        3: { requiredPoints: 50, title: "Rất ngoan" },
        4: { requiredPoints: 75, title: "Xuất sắc" },
        5: { requiredPoints: 100, title: "Siêu sao" }
    },
    AUDIO_EFFECTS: {
        good: "./audio/congratulation.mp3",
        bad: "./audio/chua_tot.mp3",
        firework: "./audio/firework.mp3"
    },
    TASKS: {
        tridung: [
            { id: "td1", time: "6:00", name: "Thức dậy, vệ sinh cá nhân & đi học", audioPath: "./audio/thuc_day_ve_sinh_ca_nhan_di_hoc.mp3" },
            { id: "td2", time: "17:00", name: "Đọc sách, tô màu hoặc làm toán", audioPath: "./audio/doc_sach_to_mau_hoac_lam_toan.mp3" },
            { id: "td3", time: "18:00", name: "Chơi tự do", audioPath: "./audio/choi_tu_do.mp3" },
            { id: "td4", time: "19:00", name: "Ăn tối tại nhà", audioPath: "./audio/an_toi_tai_nha.mp3" },
            { id: "td5", time: "20:00", name: "Vệ sinh cá nhân buổi tối", audioPath: "./audio/ve_sinh_ca_nhan_buoi_toi.mp3" },
            { id: "td6", time: "21:00", name: "Đi ngủ", audioPath: "./audio/di_ngu.mp3" }
        ],
        thaoVy: [
            { id: "tv1", time: "6:00", name: "Thức dậy, vệ sinh cá nhân & đi học", audioPath: "./audio/thuc_day_ve_sinh_ca_nhan_di_hoc_thaovy.mp3" },
            { id: "tv2", time: "17:00", name: "Đọc sách, tô màu hoặc làm toán", audioPath: "./audio/doc_sach_to_mau_hoac_lam_toan_thaovy.mp3" },
            { id: "tv3", time: "18:00", name: "Chơi tự do", audioPath: "./audio/choi_tu_do_thaovy.mp3" },
            { id: "tv4", time: "19:00", name: "Ăn tối tại nhà", audioPath: "./audio/an_toi_tai_nha_thaovy.mp3" },
            { id: "tv5", time: "20:00", name: "Vệ sinh cá nhân buổi tối", audioPath: "./audio/ve_sinh_ca_nhan_buoi_toi_thaovy.mp3" },
            { id: "tv6", time: "21:00", name: "Đi ngủ", audioPath: "./audio/di_ngu_thaovy.mp3" }
        ]
    },
    IMAGE_PATHS: {
        tree: {
            day1: "/thoigianbieunew/images/tree_day1.png",
            day2: "/thoigianbieunew/images/tree_day2.png",
            day3: "/thoigianbieunew/images/tree_day3.png",
            day4: "/thoigianbieunew/images/tree_day4.png",
            day5: "/thoigianbieunew/images/tree_day5.png",
            day6: "/thoigianbieunew/images/tree_day6.png",
            day7: "/thoigianbieunew/images/tree_day7.png",
            full: "/thoigianbieunew/images/tree_full.png"
        },
        water: "/thoigianbieunew/images/water.gif",
        flower: "/thoigianbieunew/images/flower.png",
        gift: "/thoigianbieunew/images/gift.png"
    }
};