const html = document.documentElement;

const sentinel = document.createElement('div');
sentinel.style.position = 'absolute';
sentinel.style.top = '0';
sentinel.style.left = '0';
sentinel.style.width = '1px';
sentinel.style.height = '1px';
document.body.appendChild(sentinel);

const addObserver = new IntersectionObserver(
    ([entry]) => {
        if (!entry.isIntersecting) {
            html.classList.add('deslocado');
        }
    },
    {
        root: null,
        threshold: 0,
        rootMargin: '500px 0px 0px 0px'
    }
);

const removeObserver = new IntersectionObserver(
    ([entry]) => {
        if (entry.isIntersecting) {
            html.classList.remove('deslocado');
        }
    },
    {
        root: null,
        threshold: 0,
        rootMargin: '200px 0px 0px 0px'
    }
);

addObserver.observe(sentinel);
removeObserver.observe(sentinel);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
AOS.init({
    disable: reduceMotion ? true : false,
    once: true
});

document.addEventListener("show.bs.modal", function(event) {
    if (reduceMotion) return;
    event.target.querySelectorAll('.aos-init').forEach(element => {
        element.classList.remove('aos-animate');
    });
});

function sleep(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

document.addEventListener("shown.bs.modal", async function(event) {
    if (reduceMotion) return;
    const elements = event.target.querySelectorAll(".aos-init");

    for (const element of elements) {
        element.classList.add("aos-animate");
        await sleep(0.25);
    }
});