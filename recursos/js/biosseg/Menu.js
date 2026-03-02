import { limparHash } from './AcaoHash.js';

class Menu {
    constructor() {
        this.dialog = document.querySelector('#menu');
        
        if (!this.dialog) {
            throw new Error('Menu dialog element not found.');
        }

        this.dialog.__menu = this;

        this.focusId = null;

        this.searchInput = this.dialog.querySelector('#menu-pesquisar-query');
        this.searchList = this.dialog.querySelector('#menu-pesquisar-lista');
        this.searchClear = this.dialog.querySelector('#menu-pesquisar-limpar');

        this.searchItemsMap = new Map();
        [...this.dialog.querySelectorAll('#menu-lista a[href*="/modulo"]')]
        .sort((a, b) => a.querySelector(':last-child')?.textContent.localeCompare(b.querySelector(':last-child')?.textContent))
        .forEach(el => {
            this.searchItemsMap.set(
                el,
                [el.textContent, (el.parentElement?.dataset?.tags ?? '')].join(' ')
            );
        });

        this.#init();
    }

    #init() {
        this.#highlightCurrentPage();
        this.#bindEscKey();
        this.#bindToggleEvent();
        this.#bindSearchShortcut();
        this.#bindSearchEvent();
        this.#bindSearchClearEvent();
    }

    /**
     * Detecta a página atual adiciona classe "active".
     */
    #highlightCurrentPage() {
        let current;
        const inicio = this.dialog.querySelector('#menu-inicio');
        const pathnameInicio = inicio.pathname;
        const pathnameCurrent = window.location.pathname.replace(pathnameInicio, '');
        if (pathnameCurrent) {
            current = this.dialog.querySelector(`a[href$="${pathnameCurrent}"]`);
            current?.classList.add('active');
        } else {
            current = inicio;
            current?.classList.add('active');
        }
    }

    #expand() {
        this.#closeAllCollapses();
        const current = this.dialog.querySelector('.active');
        const target = this.#eIDQueryValida(this.focusId) ? this.dialog.querySelector('#menu-'+this.focusId) : null;
        this.focusId = null;

        if (target) {
            this.#expandParents(target);
        } else if (current) {
            this.#expandParents(current);
        }
    }

    /**
     * Sobe na árvore DOM e:
     * - Adiciona .show para recolher containers
     * - Remove .collapsed dos botões de alternância
     */
    #expandParents(element) {
        let current = element.parentElement;

        while (current && current !== this.dialog) {
            if (current.classList.contains('collapse')) {
                current.classList.add('show');

                const toggleButton = this.#findToggleButton(current.id);
                if (toggleButton) {
                    toggleButton.classList.remove('collapsed');
                    toggleButton.setAttribute('aria-expanded', 'true');
                }
            }

            current = current.parentElement;
        }

        if (!this.searchInput.matches(':focus-within')) {
            element.scrollIntoView();
            element.focus();
        }
    }

    #closeAllCollapses() {
        const collapses = this.dialog.querySelectorAll('.collapse.show');
        const buttons = this.dialog.querySelectorAll('button:not(.collapsed)');

        collapses.forEach((collapse) => {
            collapse.classList.remove('show');
        });

        buttons.forEach((button) => {
            button.classList.add('collapsed');
            button.setAttribute('aria-expanded', 'false');
        });
    }

    /**
     * Encontra o botão que controla um determinado ID de recolhimento
     */
    #findToggleButton(collapseId) {
        if (!collapseId) {
            return null;
        }

        return this.dialog.querySelector(
            `button[href="#${collapseId}"], button[aria-controls="${collapseId}"]`
        );
    }

    /**
     * Alterna a caixa de diálogo com a tecla ESC
     */
    #bindEscKey() {
        document.addEventListener('keydown', (event) => {
            if (document.querySelector('dialog[open]:not(#menu)')) {
                return;
            }
            if (!document.querySelector('body.modal-open')) {
                if (event.key === 'Escape') {
                    event.preventDefault();
                    this.#toggleMenu();
                }
            }
        });
    }

    #bindToggleEvent() {
        this.dialog.addEventListener('toggle', e => {
            if (this.dialog.open) {
                this.#expand();
            } else {
                this.#clearSearch();
                limparHash();
            }
        });
    }

    #bindSearchClearEvent() {
        this.searchClear.addEventListener('click', () => {
            this.#clearSearch();
        });
    }

    #clearSearch() {
        this.searchList.replaceChildren(this.searchList.firstElementChild);
        this.searchInput.value = '';
        this.searchInput.focus();
    }

    #bindSearchShortcut() {
        document.addEventListener('keydown', (event) => {
            if (!this.searchInput.matches(':focus-within')) {
                if (event.key === 'p') {
                    event.preventDefault();
                    this.dialog.showModal();
                    this.searchInput.focus();
                }
            } else {
                if (event.key === 'Enter') {
                    this.searchList.querySelector('.list-group-item')?.focus();
                }
            }
        });
    }

    #bindSearchEvent() {
        const debounce = (fn, delay) => {
            let timeoutId;

            return (...args) => {
                clearTimeout(timeoutId);

                timeoutId = setTimeout(() => {
                    fn(...args);
                }, delay);
            };
        };

        const handleSearch = debounce(() => {
            this.searchList.replaceChildren(this.searchList.firstElementChild);

            const matches = this.#searchAllWords(
                this.searchItemsMap,
                this.searchInput.value
            );

            matches.forEach(el => {
                this.searchList.appendChild(this.#makeSearchItem(el));
            });
        }, 300);

        this.searchInput.addEventListener('input', handleSearch);
    }

    #searchAllWords(map, query) {
        const words = query.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().split(' ').filter(Boolean);
        const result = [];
    
        map.forEach((title, el) => {
            if (words.every(word => title.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(word))) {
                result.push(el);
            }
        });
    
        return result;
    }

    #makeSearchItem(anchorElement) {
        const tituloText = anchorElement.querySelector('.topico-titulo').textContent;

        const li = document.createElement("li");

        const a = document.createElement("a");
        a.className = "list-group-item list-group-item-action";
        a.href = anchorElement.href;

        const titulo = document.createElement("div");
        titulo.className = "resultado-titulo fw-medium";
        titulo.textContent = tituloText;

        const caminho = document.createElement("div");
        caminho.className = "resultado-caminho small";
        caminho.textContent = this.#hrefToString(anchorElement.attributes.href.value);

        a.appendChild(titulo);
        a.appendChild(caminho);
        li.appendChild(a);

        return li;
    }

    #hrefToString(href) {
        return href.split("/")
            .filter(Boolean)
            .filter(part => !part.startsWith("."))
            .map(part => {
                if (part.startsWith("modulo")) {
                    return `Módulo ${part.replace("modulo", "")}`;
                }
                if (part.startsWith("aula")) {
                    return `Aula ${part.replace("aula", "")}`;
                }
                if (part.startsWith("topico")) {
                    return `Tópico ${part.replace("topico", "")}`;
                }
                return part;
            })
            .join(" > ");
    }

    #toggleMenu() {
        if (this.dialog.open) {
            this.dialog.close();
        } else {
            this.dialog.showModal();
        }
    }

    #eIDQueryValida(id) {
        const regex = /[a-zA-Z_][a-zA-Z0-9_-]*$/;
        return regex.test(id);
    }

    mostrarMenu = (id = null) => {
        this.focusId = id;
        this.dialog.close();
        this.dialog.showModal();
    }
}

export const instance = new Menu();
