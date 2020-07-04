function showWindow(el) {
    $(el).css('top', Math.max(0, (($(window).height() - $(el).outerHeight()) / 2) + $(window).scrollTop()) + 'px');
    $(el).css('left', Math.max(0, (($(window).width() - $(el).outerWidth()) / 2) + $(window).scrollLeft()) + 'px');
    $(el).fadeIn(1000);
}

function hideWindow(el) {
    $(el).fadeOut(1000);
}

alt.on("hideEnterAccount", () => {
    hideWindow('#authenticationApp');
});

alt.on("initNewCharacter", () => {
    hideWindow('.characterInfo');
    hideWindow('#createCharacter');
    hideWindow('#selectorCharacters');
});

alt.on("characterInfo", () => {
    hideWindow('.characterInfo');
    hideWindow('#createCharacter');
});

alt.on("selectorCharactersHide", () => {
    hideWindow('#selectorCharacters');
});

alt.on("infoTable", () => {
    hideWindow('.infoTable');
});

function isVisible(el) {
    return $(el).css("display") != "none";
}
