document.addEventListener('keydown', function(event) {
    if (document.querySelector('html:is([data-type="topico"],[data-type="referencias"])')) {
        if (event.key === '<') {
            const anteriorLink = document.querySelector('#proximo-anterior > .anterior');
            if (anteriorLink) anteriorLink.click();
        } else if (event.key === '>') {
            const proximoLink = document.querySelector('#proximo-anterior > .proximo');
            if (proximoLink) proximoLink.click();
        }
    }
});
