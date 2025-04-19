export class TaskComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['task-id', 'time', 'name', 'rating'];
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const taskId = this.getAttribute('task-id');
        const time = this.getAttribute('time');
        const name = this.getAttribute('name');
        const rating = this.getAttribute('rating');
        const audioPath = this.getAttribute('audio-path') || '';

        const styles = `
            :host {
                display: block;
                margin-bottom: 15px;
            }

            .task {
                background: var(--task-bg, #1E1919);
                padding: 15px;
                border-radius: 12px;
                color: var(--text-color, #ffffff);
            }

            .task-header {
                display: flex;
                align-items: center;
                margin-bottom: 15px;
            }

            .task-time {
                background: var(--bg-color, #2D2424);
                padding: 5px 10px;
                border-radius: 8px;
                font-weight: 600;
                margin-right: 10px;
                min-width: 60px;
                text-align: center;
            }

            .task-name {
                flex: 1;
                font-weight: 600;
            }

            .rating-buttons {
                display: flex;
                gap: 10px;
            }

            .rating-btn {
                flex: 1;
                padding: 12px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                color: var(--text-color, #ffffff);
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                transition: all 0.3s;
                opacity: 0.7;
            }

            .rating-btn:hover {
                opacity: 1;
            }

            .good-btn {
                background: var(--btn-good, #1B4332);
            }

            .neutral-btn {
                background: var(--btn-neutral, #8B7355);
            }

            .bad-btn {
                background: var(--btn-bad, #7B1818);
            }

            .rating-btn.active {
                opacity: 1;
                transform: scale(1.05);
            }

            .good-btn.active {
                background: var(--success-color, #66BB6A);
            }

            .neutral-btn.active {
                background: var(--warning-color, #FFCA28);
            }

            .bad-btn.active {
                background: var(--danger-color, #EF5350);
            }

            .play-audio {
                background: none;
                border: none;
                cursor: pointer;
                color: var(--primary-color, #FF7043);
                padding: 5px;
                margin-left: 10px;
            }

            @media (max-width: 768px) {
                .rating-buttons {
                    flex-direction: column;
                }

                .rating-btn {
                    width: 100%;
                    padding: 15px;
                }
            }
        `;

        this.shadowRoot.innerHTML = `
            <style>${styles}</style>
            <div class="task ${rating || ''}">
                <div class="task-header">
                    <div class="task-time">${time}</div>
                    <div class="task-name">${name}</div>
                    ${audioPath ? `
                        <button class="play-audio" onclick="new Audio('${audioPath}').play()">
                            <i class="fas fa-volume-up"></i>
                        </button>
                    ` : ''}
                </div>
                <div class="rating-buttons">
                    <button class="rating-btn good-btn ${rating === 'good' ? 'active' : ''}"
                            onclick="this.dispatchEvent(new CustomEvent('rate-task', 
                                { detail: { taskId: '${taskId}', rating: 'good' }, bubbles: true, composed: true }))">
                        Tốt
                    </button>
                    <button class="rating-btn neutral-btn ${rating === 'neutral' ? 'active' : ''}"
                            onclick="this.dispatchEvent(new CustomEvent('rate-task',
                                { detail: { taskId: '${taskId}', rating: 'neutral' }, bubbles: true, composed: true }))">
                        Bình thường
                    </button>
                    <button class="rating-btn bad-btn ${rating === 'bad' ? 'active' : ''}"
                            onclick="this.dispatchEvent(new CustomEvent('rate-task',
                                { detail: { taskId: '${taskId}', rating: 'bad' }, bubbles: true, composed: true }))">
                        Chưa tốt
                    </button>
                </div>
            </div>
        `;
    }
}

customElements.define('task-item', TaskComponent);