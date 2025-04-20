export const CONFIG = {
    PIN: "2022",
    AUDIO_MESSAGES: {
        "ăn tối tại nhà": (isThaoVy) => `audio/an_toi_tai_nha${isThaoVy ? '_thaovy' : ''}.mp3`,
        "vệ sinh cá nhân buổi tối": (isThaoVy) => `audio/ve_sinh_ca_nhan_buoi_toi${isThaoVy ? '_thaovy' : ''}.mp3`,
        "đọc sách, tô màu hoặc làm toán": (isThaoVy) => `audio/doc_sach_to_mau_hoac_lam_toan${isThaoVy ? '_thaovy' : ''}.mp3`,
        "đi ngủ": (isThaoVy) => `audio/di_ngu${isThaoVy ? '_thaovy' : ''}.mp3`,
        "thức dậy, vệ sinh cá nhân, đi học": (isThaoVy) => `audio/thuc_day_ve_sinh_ca_nhan_di_hoc${isThaoVy ? '_thaovy' : ''}.mp3`,
        "chơi tự do": (isThaoVy) => `audio/choi_tu_do${isThaoVy ? '_thaovy' : ''}.mp3`,
        "vệ sinh cá nhân sáng": () => 'audio/ve_sinh_ca_nhan_sang.mp3',
        "ngủ đêm qua": () => 'audio/ngu_dem_qua.mp3',
        "pháo hoa": () => 'audio/firework.mp3',
        "chúc mừng": () => 'audio/17449075384282438295te36qob-voicemaker.in-speech.mp3',
        "cố gắng": () => 'audio/ban_co_gang_vao_lan_sau_nhe.mp3',
        "chưa tốt": () => 'audio/chua_tot.mp3'
    },
    MOTIVATION_MESSAGES: {
        tridung: {
            good: [
                "Con trai giỏi quá! Mẹ rất tự hào về con!",
                "Trí Dũng của mẹ thật ngoan và chăm chỉ!",
                "Tuyệt vời lắm con trai! Cứ tiếp tục phát huy nhé!"
            ],
            neutral: [
                "Không sao con à, lần sau con làm tốt hơn nhé!",
                "Mẹ biết con có thể làm tốt hơn mà!"
            ],
            bad: [
                "Con cố gắng hơn vào lần sau nhé!",
                "Mẹ tin con có thể làm tốt hơn đấy!"
            ]
        },
        thaoVy: {
            good: [
                "Con gái giỏi quá! Mẹ rất tự hào về con!",
                "Thảo Vy của mẹ thật ngoan và đáng yêu!",
                "Tuyệt vời lắm con gái! Cứ tiếp tục phát huy nhé!"
            ],
            neutral: [
                "Không sao con à, lần sau con làm tốt hơn nhé!",
                "Mẹ biết con có thể làm tốt hơn mà!"
            ],
            bad: [
                "Con cố gắng hơn vào lần sau nhé!",
                "Mẹ tin con có thể làm tốt hơn đấy!"
            ]
        }
    },
    TREE_STAGES: {
        0: 'images/tree_day1.png',
        1: 'images/tree_day2.png',
        2: 'images/tree_day3.png',
        3: 'images/tree_day4.png',
        4: 'images/tree_day5.png',
        5: 'images/tree_day6.png',
        6: 'images/tree_day7.png',
        7: 'images/tree_full.png'
    },
    POINTS: {
        good: 10,
        neutral: 5,
        bad: 0
    },
    LEVEL_THRESHOLDS: {
        1: 0,
        2: 50,
        3: 100,
        4: 200,
        5: 300
    }
};

// Cấu hình thử thách tuần
const WEEKLY_CHALLENGES = [
  {
    id: 'sleep_streak',
    title: 'Đi ngủ đúng giờ',
    description: 'Hoàn thành <strong>5 nhiệm vụ</strong> Đi ngủ đúng giờ liên tiếp!',
    taskId: 'di_ngu', // ID của nhiệm vụ, đối chiếu với tasks
    taskIdThaoVy: 'tv6', // ID nhiệm vụ cho Thảo Vy
    taskIdTriDung: 'td6', // ID nhiệm vụ cho Trí Dũng
    target: 5, // Số lần cần hoàn thành
    streakBased: true, // Cần hoàn thành liên tiếp
    reward: {
      waterCredits: 2, // Số lượt tưới nước
      points: 50 // Số điểm thưởng
    }
  },
  {
    id: 'wake_up_streak',
    title: 'Thức dậy đúng giờ',
    description: 'Hoàn thành <strong>4 nhiệm vụ</strong> Thức dậy đúng giờ liên tiếp!',
    taskId: 'thuc_day',
    taskIdThaoVy: 'tv1',
    taskIdTriDung: 'td1',
    target: 4,
    streakBased: true,
    reward: {
      waterCredits: 2,
      points: 70
    }
  },
  {
    id: 'reading_streak',
    title: 'Đọc sách/Làm toán',
    description: 'Hoàn thành <strong>5 nhiệm vụ</strong> Đọc sách hoặc làm toán!',
    taskId: 'doc_sach',
    taskIdThaoVy: 'tv3',
    taskIdTriDung: 'td3',
    target: 5,
    streakBased: false, // Không cần liên tiếp
    reward: {
      waterCredits: 3,
      points: 80
    }
  },
  {
    id: 'all_good_day',
    title: 'Ngày hoàn hảo',
    description: 'Hoàn thành <strong>tất cả nhiệm vụ</strong> với mức Tốt trong một ngày!',
    special: 'all_tasks_good', // Đánh dấu đây là nhiệm vụ đặc biệt (tất cả nhiệm vụ trong ngày đạt tốt)
    target: 1,
    reward: {
      waterCredits: 3,
      points: 100
    }
  },
  {
    id: 'week_points',
    title: 'Tích lũy điểm',
    description: 'Đạt được <strong>100 điểm</strong> trong tuần này!',
    special: 'weekly_points', // Đánh dấu đây là nhiệm vụ tích điểm
    target: 100,
    reward: {
      waterCredits: 2,
      points: 50
    }
  }
];

// Cấu hình cấp độ cho mỗi bé
const LEVEL_CONFIG = {
  thresholds: {
    1: 0,     // Bắt đầu ở cấp 1 với 0 điểm
    2: 50,    // Đạt cấp 2 khi có 50 điểm
    3: 150,   // Đạt cấp 3 khi có 150 điểm
    4: 300,   // Đạt cấp 4 khi có 300 điểm
    5: 500,   // Đạt cấp 5 khi có 500 điểm
    6: 750,   // Đạt cấp 6 khi có 750 điểm
    7: 1000,  // Đạt cấp 7 khi có 1000 điểm
    8: 1500,  // Đạt cấp 8 khi có 1500 điểm
    9: 2000,  // Đạt cấp 9 khi có 2000 điểm
    10: 3000  // Đạt cấp 10 khi có 3000 điểm
  },
  rewards: {
    2: { message: "Chúc mừng! Bạn đã đạt cấp 2!", waterCredits: 1 },
    3: { message: "Tuyệt vời! Bạn đã đạt cấp 3!", waterCredits: 2 },
    4: { message: "Xuất sắc! Bạn đã đạt cấp 4!", waterCredits: 2 },
    5: { message: "Ấn tượng! Bạn đã đạt cấp 5!", waterCredits: 3 },
    6: { message: "Phi thường! Bạn đã đạt cấp 6!", waterCredits: 3 },
    7: { message: "Không thể tin được! Bạn đã đạt cấp 7!", waterCredits: 4 },
    8: { message: "Thật đáng kinh ngạc! Bạn đã đạt cấp 8!", waterCredits: 4 },
    9: { message: "Siêu nhân! Bạn đã đạt cấp 9!", waterCredits: 5 },
    10: { message: "Bạn đã đạt đến cấp tối đa! Bạn là huyền thoại!", waterCredits: 10 }
  }
};