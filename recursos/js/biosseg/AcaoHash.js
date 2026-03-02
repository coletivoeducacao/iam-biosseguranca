
/**
 * Mapa com todas as ações registradas.
 *
 * @type {Map}
 */
const mapaAcoes = new Map();


/**
 * Description placeholder
 *
 * @export
 */
export function init() {
    executar(window.location.hash);
    bindHashChange();
    bindHashLink();
}

/**
 * Adiciona uma função a ser chamada por um nome.
 *
 * @export
 * @param {String} nome
 * @param {Function} funcao
 * @param {any} [contexto=null]
 */
export function adicionarAcao(nome, funcao, contexto = null) {
    mapaAcoes.set(nome, funcao.bind(contexto));
}



/**
 * Remove hash da URL.
 *
 * @export
 */
export function limparHash() {
    history.replaceState(
        null,
        document.title,
        document.location.pathname + document.location.search
    );
}


/**
 * Executa a ação mencionada no hash toda vez que o evento hashchange ocorrer.
 */
function bindHashChange() {
    window.addEventListener("hashchange", event => {
        const newURL = new URL(event.newURL);
        executar(newURL.hash);
    });
}

/**
 * Registra uma função ao clique de links internos para tentar executar como ação.
 * Se a ação for executada, impedimos o comportamento padrão.
 */
function bindHashLink() {
    document.addEventListener('click', e => {
        const anchor = e.target.closest('a[href*="#"]')
        if (anchor) {
            const hash = eLinkInterno(anchor.href);
            if (hash && executar(hash)) {
                e.preventDefault();
            }
        }
    });
}

function eLinkInterno(link) {
    try {
        // 1. Resolve o link para uma URL absoluta usando a página atual como base
        const linkUrl = new URL(link, window.location.href);
        const currentUrl = new URL(window.location.href);

        // 2. Compara origem (protocolo + domínio + porta) e nome do caminho
        if (linkUrl.origin === currentUrl.origin && linkUrl.pathname === currentUrl.pathname) {
            return linkUrl.hash;
        };

        return false;
    } catch (e) {
        // Handle invalid URLs safely
        return false;
    }
}

/**
 * Description placeholder
 *
 * @param {*} hash 
 * @returns {function|null} 
 */
function eAcaoExistente(hash) {
    // 1. Limpa o caractere '#'
    let [acaoPath, ...params] = hash.replace(/^#/, '').split(':');

    params = params.map(param => decodeURI(param));

    // 2. Obtem referência à função
    const acao = mapaAcoes.get(acaoPath);

    // 3. Valida se o função existe e se é uma função
    const acaoExists = acao !== undefined;
    const acaoIsFunction = typeof acao === 'function';

    if (acaoExists && acaoIsFunction) {
        return acao.bind(null, ...params);
    }

    return null;
}

function executar(hash) {
    if (!hash.startsWith("#")) return false;

    hash = hash.replace(/:+$/, '');

    const acao = eAcaoExistente(hash);
    if (!acao) return false;

    history.replaceState(null, document.title, hash);
    acao();
    return true;
}
