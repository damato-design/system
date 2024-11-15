import inventory from './_inventory.json' with { type: "json" };
const PRELOADED_MODES = [];
const ANIMATION_NAME = '__MODE_LISTENER__';

const css = `
    [data-mode]{
        visibility: hidden;
        animation: ${ANIMATION_NAME} .0001s linear forwards;
    }

    @keyframes ${ANIMATION_NAME} { to { visibility: visible } }
`;

const $style = document.createElement('style');
$style.innerHTML = css;
document.head.appendChild($style);

const modes = new Set(PRELOADED_MODES);

function appendModeCSS(mode) {
    modes.add(mode);
    if (!(mode in inventory)) return console.info(`Mode does not exist in inventory: ${mode}`);
    inventory[mode].forEach((file) => {
        const $link = document.createElement('link');
        $link.rel = 'stylesheet';
        $link.src = file;
        document.head.appendChild($link);
    });
}

const onAnimationEnd = (ev) => {
    if (ev.animationName === ANIMATION_NAME) {
        const incomingModes = ev.target.dataset.mode.split(' ');
        incomingModes.filter((mode) => !modes.has(mode)).forEach(appendModeCSS);
    }
}
document.documentElement.addEventListener('onanimationend', onAnimationEnd);
