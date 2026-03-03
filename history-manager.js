import { state } from './state.js';
import { renderSidebar } from './ui-renderer.js';
import { saveToLocal } from './storage.js';

class HistoryManager {
    constructor() {
        this.history = [];
        this.maxStackSize = 40;
    }

    pushHistory() {
        const textContainer = document.getElementById('text-container');
        if (!textContainer) return;

        // Perform a deep copy of cardsData
        const cardsSnapshot = state.cardsData.map(card => ({ ...card }));

        const snapshot = {
            html: textContainer.innerHTML,
            cards: cardsSnapshot,
            colorIndex: state.colorIndex
        };

        this.history.push(snapshot);

        if (this.history.length > this.maxStackSize) {
            this.history.shift(); // Remove the oldest entry if size exceeds limit
        }
    }

    undoHistory() {
        if (this.history.length <= 1) {
            console.log("Nothing to undo.");
            return; // Needs at least 1 previous state to revert to
        }

        // Pop the current state (since it's the tip we are actively looking at/editing)
        this.history.pop();

        // Peek at the previous state and apply it
        const previousState = this.history[this.history.length - 1];

        const textContainer = document.getElementById('text-container');
        if (textContainer) {
            textContainer.innerHTML = previousState.html;
        }

        state.cardsData = previousState.cards.map(card => ({ ...card }));
        state.colorIndex = previousState.colorIndex;

        renderSidebar();
        saveToLocal();
    }
}

export const historyManager = new HistoryManager();
