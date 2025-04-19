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
            <style>
                .profile-container {
                    display: flex;
                    align-items: center;
                    background: white;
                    padding: 15px;
                    border-radius: 10px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }

                .profile-image {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    margin-right: 15px;
                }

                .profile-info {
                    flex: 1;
                }

                .profile-name {
                    font-size: 18px;
                    font-weight: bold;
                    color: var(--primary-color, #FF7043);
                }

                .profile-stats {
                    font-size: 14px;
                    color: var(--light-text, #795548);
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