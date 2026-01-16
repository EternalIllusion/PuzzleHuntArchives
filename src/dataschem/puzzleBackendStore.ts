import { defineStore } from 'pinia';

//初始化一个 key -> { status, nonce } 的对象，作为状态的存储
interface PuzzleBackendStatus {
    status: string;
    nonce: string;
}

export const usePuzzleBackendStore = defineStore('puzzleBackend', {
    state: () => ({
        puzzleBackendStatus: {} as { [key: string]: PuzzleBackendStatus },
    }),
    actions: {
        getPuzzleBackendStatus(key: string): PuzzleBackendStatus {
            return this.puzzleBackendStatus[key] || { status: null, nonce: null };
        },
        setPuzzleBackendStatus(key: string, status: string, nonce: string) {
            this.puzzleBackendStatus[key] = { status, nonce };
        },
    },
    persist: {
        storage: localStorage,
    },
});