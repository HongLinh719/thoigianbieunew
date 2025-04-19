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

        this.shadowRoot.innerHTML = `
            <style>
                .task {
                    background: white;
                    padding: 15px;
                    border-radius: 12px;
                    margin-bottom: 15px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                .task.good { border-left: 5px solid var(--success-color, #66BB6A); }
                .task.neutral { border-left: 5px solid var(--warning-color, #FFCA28); }
                .task.bad { border-left: 5px solid var(--danger-color, #EF5350); }

                .task-header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                }

                .task-time {
                    background: var(--neutral-color, #FBE9E7);
                    padding: 5px 10px;
                    border-radius: 8px;
                    font-weight: 600;
                    margin-right: 10px;
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
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: all 0.3s;
                }

                .play-audio {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: var(--primary-color, #FF7043);
                    padding: 5px;
                    margin-left: 10px;
                }

                .good-btn {
                    background: #E8F5E9;
                    color: var(--success-color, #66BB6A);
                }

                .neutral-btn {
                    background: #FFF8E1;
                    color: var(--warning-color, #FFCA28);
                }

                .bad-btn {
                    background: #FFEBEE;
                    color: var(--danger-color, #EF5350);
                }

                .rating-btn.active {
                    color: white;
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
            </style>

            <div class="task ${rating || ''}">
                <div class="task-header">
                    <div class="task-time">${time}</div>
                    <div class="task-name">${name}</div>
                    ${audioPath ? `<button class="play-audio" onclick="new Audio('${audioPath}').play()">
                        <i class="fas fa-volume-up"></i>
                    </button>` : ''}
                </div>
                <div class="rating-buttons">
                    <button class="rating-btn good-btn ${rating === 'good' ? 'active' : ''}"
                            onclick="this.dispatchEvent(new CustomEvent('rate-task', 
                                { detail: { taskId: '${taskId}', rating: 'good' }, bubbles: true, composed: true }))">
                        <i class="fas fa-smile"></i> Tốt
                    </button>
                    <button class="rating-btn neutral-btn ${rating === 'neutral' ? 'active' : ''}"
                            onclick="this.dispatchEvent(new CustomEvent('rate-task',
                                { detail: { taskId: '${taskId}', rating: 'neutral' }, bubbles: true, composed: true }))">
                        <i class="fas fa-meh"></i> Bình thường
                    </button>
                    <button class="rating-btn bad-btn ${rating === 'bad' ? 'active' : ''}"
                            onclick="this.dispatchEvent(new CustomEvent('rate-task',
                                { detail: { taskId: '${taskId}', rating: 'bad' }, bubbles: true, composed: true }))">
                        <i class="fas fa-frown"></i> Chưa tốt
                    </button>
                </div>
            </div>
        `;
    }
}

// Đăng ký custom element
customElements.define('task-item', TaskComponent);