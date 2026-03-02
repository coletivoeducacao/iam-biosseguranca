class Flipcard {
    constructor(elemento) {
        if (!elemento.classList.contains('flipcard')) {
            throw new Error('O elemento deve ter a classe "flipcard".');
        }

        this.flipcard = elemento;

        this.input = this.flipcard.querySelector(':scope > input');
        if (!this.input) {
            throw new Error('Input não encontrado.');
        }

        this.frente = this.flipcard.querySelector('.flipcard-frente');
        if (!this.frente) {
            throw new Error('Frente não encontrado.');
        }

        this.verso = this.flipcard.querySelector('.flipcard-verso');
        if (!this.verso) {
            throw new Error('Verso não encontrado.');
        }

        this.botaoFrente = this.frente.querySelector('.flipcard-btn');
        if (!this.botaoFrente) {
            throw new Error('Botão do lado da frente não encontrado.');
        }

        this.botaoVerso = this.verso.querySelector('.flipcard-btn');
        if (!this.botaoVerso) {
            throw new Error('Botão do lado da verso não encontrado.');
        }

        this.botaoFrente.addEventListener('click', () => {
            this.input.checked = !this.input.checked;
            this.frente.setAttribute('inert', '');
            this.verso.removeAttribute('inert');
            this.botaoVerso.focus();
        })

        this.botaoVerso.addEventListener('click', () => {
            this.input.checked = !this.input.checked;
            this.verso.setAttribute('inert', '');
            this.frente.removeAttribute('inert');
            this.botaoFrente.focus();
        })

        if (!CSS.supports('height: attr(data-height type(<length>))')) {
            const val = this.flipcard.getAttribute('data-height');
            if (val) this.flipcard.style.setProperty('--flipcard-height-fallback', val);
        }
    }
}

document.querySelectorAll('.flipcard').forEach(elementoFlipcard => {
    try {
        new Flipcard(elementoFlipcard);
    } catch (error) {
        console.error(error);
    }
});