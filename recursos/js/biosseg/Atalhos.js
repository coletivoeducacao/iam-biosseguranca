import { limparHash } from './AcaoHash.js';
import Tooltip from "../bootstrap/tooltip.js";

class Atalhos {
    constructor() {
        this.dialog = document.querySelector('#atalhos');

        if (!this.dialog) throw new Error('Atalhos dialog element not found.');

        this.dialog.__atalhos = this;

        // Cria referência global do método usado por AcaoHash.
        globalThis.atalhos = this.mostrarAtalhos.bind(this);

        this.#init();
    }

    #init() {
        this.#initTooltip();
        this.#bindToggleEvent();
    }

    #bindToggleEvent() {
        this.dialog.addEventListener('toggle', () => {
            if (this.dialog.open) {
                // Nada por enquanto
            } else {
                limparHash();
            }
        });
    }

    #initTooltip() {
        new Tooltip(document.querySelector('[data-bs-toggle="tooltip"]:has(#botao-atalhos)'));
    }

    mostrarAtalhos = () => {
        this.dialog.showModal();
    }
}

export const instance = new Atalhos();
