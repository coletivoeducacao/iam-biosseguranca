/**
 * Barrel file do site.
 */

// Bootstrap
import * as bootstrap from './bootstrap/index.js'
// Módulos do site
import * as biosseg from './biosseg/index.js'

biosseg.AcaoHash.adicionarAcao(
    'atalhos',
    biosseg.Atalhos.instance.mostrarAtalhos
);

biosseg.AcaoHash.adicionarAcao(
    'menu',
    biosseg.Menu.instance.mostrarMenu
);

biosseg.AcaoHash.init();

export { biosseg, bootstrap };