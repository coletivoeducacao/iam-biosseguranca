(function () {
    function getCookie(name) {
        var match = document.cookie.match(
            new RegExp("(^| )" + name + "=([^;]+)")
        );
        return match ? match[2] : null;
    }

    var fontSize = getCookie("fontSize");

    if (fontSize) {
        var parsed = parseFloat(fontSize);

        if (!isNaN(parsed) && parsed >= 1 && parsed <= 1.5) {
            document.documentElement.style.fontSize = parsed + "em";
        }
    }
})();
