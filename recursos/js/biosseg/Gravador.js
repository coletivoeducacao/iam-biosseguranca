import Modal from "../bootstrap/modal.js";

class Gravador {

    constructor(root) {

        this.root = root;
        this.audio = root.querySelector('audio');

        this.timeline = root.querySelector('input[type="range"]');
        this.currentTimeEl = root.querySelector('.tempo-atual');
        this.totalTimeEl = root.querySelector('.tempo-total');
        this.volume = root.querySelector('.gravador__barra .volume');
        this.withSound = true;
        this.modal = root.closest('.modal');
        this.layout = root.closest('.gravador-layout');
        this.bsModal = Modal.getOrCreateInstance(this.modal);

        this.buttons = {
            stop: root.querySelector('[posicao="top-left"]'),
            off: root.querySelector('[posicao="top-right"]'),
            volUp: root.querySelector('[posicao="wheel-top"]'),
            rewind: root.querySelector('[posicao="wheel-left"]'),
            play: root.querySelector('[posicao="wheel-center"]'),
            forward: root.querySelector('[posicao="wheel-right"]'),
            volDown: root.querySelector('[posicao="wheel-bottom"]'),
            mute: root.querySelector('[posicao="bottom-right"]'),
            cc: root.querySelector('[posicao="bottom-left"]')
        };

        this.volumeLevels = [0, 0.25, 0.5, 0.75, 1];
        this.volumeIndex = 2;

        this.init();
    }

    init() {
        this.bindEvents();
        this.updateVolume();
    }

    bindEvents() {

        /* DURAÇÃO */
        if (this.audio.readyState > 0) {
            this.totalTimeEl.textContent = this.format(this.audio.duration);
        } else {
            this.audio.addEventListener('loadedmetadata', () => {
                this.totalTimeEl.textContent = this.format(this.audio.duration);
            });
        }

        /* TEMPO */
        this.audio.addEventListener('timeupdate', () => {

            if (!this.audio.duration) return;

            const progress =
                (this.audio.currentTime / this.audio.duration) * 100;

            this.timeline.value = progress;

            this.currentTimeEl.textContent =
                this.format(this.audio.currentTime);
        });

        /* TIMELINE */
        this.timeline.addEventListener('input', () => {

            if (!this.audio.duration) return;

            this.audio.currentTime =
                (this.timeline.value / 100) * this.audio.duration;
        });

        /* PLAY / PAUSE */
        this.buttons.play.onclick = () => {

            if (this.audio.paused) {
                this.audio.play();
            } else {
                this.audio.pause();
            }
        };

        /* STOP */
        this.buttons.stop.onclick = () => {
            this.audio.pause();
            this.audio.currentTime = 0;
        };

        /* AVANÇAR / RETROCEDER */
        this.buttons.forward.onclick = () => {
            this.audio.currentTime += 5;
        };

        this.buttons.rewind.onclick = () => {
            this.audio.currentTime -= 5;
        };

        /* VOLUME */
        this.buttons.volUp.onclick = () => {
            this.withSound = true;
            if (this.volumeIndex < 4) {
                this.volumeIndex++;
            }
            this.updateVolume();
        };

        this.buttons.volDown.onclick = () => {
            this.withSound = true;
            if (this.volumeIndex > 0) {
                this.volumeIndex--;
            }
            this.updateVolume();
        };

        /* MUDO */
        this.buttons.mute.onclick = () => {
            this.withSound = !this.withSound;
            this.updateVolume();
        };

        /* OFF */
        this.buttons.off.onclick = () => {
            this.bsModal.hide();
        }

        this.modal.addEventListener('hide.bs.modal', () => {
            this.audio.pause();
        });

        /* CC */
        this.buttons.cc.onclick = () => {
            this.layout.classList.toggle('fechado');
        };
    }

    updateVolume() {
        this.audio.volume = this.volumeLevels[this.volumeIndex] * Number(this.withSound);
        this.volume.textContent = this.audio.volume * 100;
    }

    format(sec) {

        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);

        return String(m).padStart(2, '0') +
               ':' +
               String(s).padStart(2, '0');
    }
}

/* INICIALIZAÇÃO */
document.querySelectorAll('.gravador')
    .forEach(el => new Gravador(el));
