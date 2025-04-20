export class ProfileComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['child-name', 'level', 'points'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    render() {
        const childName = this.getAttribute('child-name');
        const level = this.getAttribute('level') || '1';
        const points = this.getAttribute('points') || '0';
        const displayName = childName === 'tridung' ? 'Trí Dũng' : 'Thảo Vy';
        const imagePath = childName === 'tridung' ? './images/vit.jpg' : './images/vy.jpg';

        this.shadowRoot.innerHTML = `
        <!-- Cập nhật CSS để điều chỉnh kích thước hình ảnh -->
        <style>
            /* CSS cho profile container (cập nhật kích thước hình ảnh) */
            .profile-container img {
                width: 50px;  /* Giảm kích thước từ 100px xuống 50px */
                height: 50px; /* Giảm kích thước từ 100px xuống 50px */
                border-radius: 10px;
                object-fit: cover;
                border: 3px solid #FF7043;
            }
            
            /* CSS cho tab (cập nhật kích thước hình ảnh) */
            .tabs {
                display: flex;
                justify-content: center;
                margin: 20px 0;
            }
            
            .tab {
                display: flex;
                align-items: center;
                padding: 10px 15px;
                margin: 0 5px;
                background-color: rgba(0, 0, 0, 0.3);
                border-radius: 10px;
                cursor: pointer;
                transition: background-color 0.3s;
            }
            
            .tab.active {
                background-color: var(--primary-color);
            }
            
            .tab img {
                width: 30px;  /* Giảm kích thước từ mặc định xuống 30px */
                height: 30px; /* Giảm kích thước từ mặc định xuống 30px */
                border-radius: 50%;
                margin-right: 8px;
                object-fit: cover;
                border: 2px solid white;
            }
            
            /* CSS cho popup chúc mừng (chỉnh kích thước hình ảnh) */
            #popup-congrats img {
                width: 150px;  /* Giảm kích thước từ 250px xuống 150px */
                border-radius: 10px;
                box-shadow: 0 0 10px #888;
            }
            
            /* Thêm CSS responsive cho mobile */
            @media screen and (max-width: 768px) {
                .profile-container img {
                    width: 40px;  /* Giảm kích thước hơn nữa trên mobile */
                    height: 40px;
                }
                
                .tab img {
                    width: 25px;  /* Giảm kích thước hơn nữa trên mobile */
                    height: 25px;
                }
                
                #popup-congrats img {
                    width: 120px;  /* Giảm kích thước hơn nữa trên mobile */
                }
            }
        </style>

            <div class="profile-container">
                <img src="${imagePath}" alt="${displayName}" class="profile-image">
                <div class="profile-info">
                    <div class="profile-name">${displayName}</div>
                    <div class="profile-stats">
                        Cấp độ: ${level} | Điểm: ${points}
                    </div>
                </div>
            </div>
        `;
    }
}