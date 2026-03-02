import Tooltip from "../bootstrap/tooltip.js";

export default class TamanhoDoTexto {
    constructor({
        min = 1,
        max = 1.5,
        step = 0.1,
        containerId = 'tamanho-do-texto-container',
        btnIncreaseId = 'tamanho-do-texto-aumentar',
        btnDecreaseId = 'tamanho-do-texto-reduzir',
        cookieName = 'fontSize'
    }) {
        this.htmlElement = document.documentElement;
        this.min = min;
        this.max = max;
        this.step = step;
        this.cookieName = cookieName;

        this.container = document.getElementById(containerId);
        this.btnIncrease = document.getElementById(btnIncreaseId);
        this.btnDecrease = document.getElementById(btnDecreaseId);

        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]:has([id^="tamanho-do-texto"])')
        this.tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new Tooltip(tooltipTriggerEl))

        this.currentSize = this.getCurrentFontSize();

        this.setFontSize(this.currentSize, false);
        this.bindEvents();
        this.updateButtonsState();
    }

    /* =========================
     * Font size helpers
     * ========================= */

    getCurrentFontSize() {
        const fontSize = window
            .getComputedStyle(this.htmlElement)
            .fontSize;

        return parseFloat(fontSize) / 16;
    }

    setFontSize(size, save = true) {
        const clampedSize = Math.min(this.max, Math.max(this.min, size));

        this.currentSize = clampedSize;
        this.htmlElement.style.fontSize = `${clampedSize}em`;

        if (save) {
            this.setCookie(this.cookieName, clampedSize, 365);
        }

        this.updateButtonsState();
    }

    increase() {
        if (this.currentSize < this.max) {
            this.setFontSize(this.currentSize + this.step);
        }
    }

    decrease() {
        if (this.currentSize > this.min) {
        this.setFontSize(this.currentSize - this.step);
        }
    }

    /* =========================
     * Buttons state & a11y
     * ========================= */

    updateButtonsState() {
        const atMax = this.currentSize >= this.max;
        const atMin = this.currentSize <= this.min;

        this.btnIncrease?.toggleAttribute('disabled', atMax);
        this.btnDecrease?.toggleAttribute('disabled', atMin);

        this.btnIncrease?.setAttribute("aria-disabled", atMax);
        this.btnDecrease?.setAttribute("aria-disabled", atMin);

        setTimeout(() => {
            this.tooltipList.forEach(tooltip => tooltip.update());
        }, 300);
    }

    bindEvents() {
        if (this.btnIncrease) {
            this.btnIncrease.addEventListener("click", () => {
                this.increase();
            });
        }

        if (this.btnDecrease) {
            this.btnDecrease.addEventListener("click", () => {
                this.decrease();
            });
        }

        if (this.container) {
            this.container.addEventListener('mouseenter', () => {
                const rect = this.container.getBoundingClientRect();
                const currentFontSize = window.getComputedStyle(this.container).fontSize;

                this.container.style.position = 'fixed';
                this.container.style.left = `${rect.left}px`;
                this.container.style.top = `${rect.top}px`;
                this.container.style.fontSize = currentFontSize;
            });

            this.container.addEventListener('mouseleave', () => {
                this.container.style.position = '';
                this.container.style.left = '';
                this.container.style.top = '';
                this.container.style.fontSize = '';
            });
        }
    }

    /* =========================
     * Cookie helpers
     * ========================= */

    setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

        document.cookie =
            `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
    }

    getCookie(name) {
        const match = document.cookie.match(
            new RegExp("(^| )" + name + "=([^;]+)")
        );
        return match ? match[2] : null;
    }
}

new TamanhoDoTexto({});