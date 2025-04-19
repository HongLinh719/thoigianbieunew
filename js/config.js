export const CONFIG = {
    APP_NAME: "Thời gian biểu cho bé",
    VERSION: "1.1.0",
    
    CHILDREN: {
        tridung: {
            name: "Trí Dũng",
            age: 5,
            image: "images/vit.jpg",
            initialLevel: 1,
            points: 0
        },
        thaoVy: {
            name: "Thảo Vy",
            age: 3,
            image: "images/vy.jpg",
            initialLevel: 1,
            points: 0
        }
    },
    
    POINTS: {
        GOOD: 3,
        NEUTRAL: 1,
        BAD: 0
    },
    
    LEVEL_UP_THRESHOLD: 10,
    
    TREE: {
        MAX_LEVEL: 7,
        DAYS_TO_GROW: 7,
        WATER_PER_GOOD_TASK: 1
    },
    
    SOUND: {
        enabled: true,
        volume: 0.7,
        notification: "audio/notification.mp3",
        achievement: "audio/firework.mp3",
        task_complete: "audio/task_complete.mp3"
    },
    
    ADMIN_PIN: "2022",
    
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

// Hàm lấy ngày trong tuần hiện tại (0: Chủ nhật, 1-6: Thứ 2 - Thứ 7)
function getCurrentDay() {
    return new Date().getDay();
}

// Hàm lấy ngày hiện tại dạng chuỗi YYYY-MM-DD
function getTodayString() {
    const now = new Date();
    return now.toISOString().split('T')[0];
}

// Hàm kiểm tra trạng thái âm thanh
function isSoundEnabled() {
    const soundSetting = localStorage.getItem('soundEnabled');
    return soundSetting !== null ? JSON.parse(soundSetting) : CONFIG.SOUND.enabled;
}

// Hàm lưu trạng thái âm thanh
function setSoundEnabled(enabled) {
    localStorage.setItem('soundEnabled', JSON.stringify(enabled));
    CONFIG.SOUND.enabled = enabled;
}

// Hàm chuyển đổi trạng thái âm thanh
function toggleSound() {
    const currentState = isSoundEnabled();
    setSoundEnabled(!currentState);
    
    // Cập nhật icon
    const soundIcon = document.getElementById('sound-icon');
    if (soundIcon) {
        soundIcon.className = isSoundEnabled() ? 'fas fa-volume-up' : 'fas fa-volume-mute';
    }
    
    // Hiển thị thông báo
    showNotification(isSoundEnabled() ? "Đã bật âm thanh" : "Đã tắt âm thanh");
    
    return !currentState;
}