$(document).ready(function () {
    $('#logout').on('click', function () {
        // Cookies.remove('jwt');
        logOut();
        // removeAllcookies();
    });
});

function removeAllcookies() {
    Object.keys(Cookies.get()).forEach(function (cookie) {
        Cookies.remove(cookie);
    });
    window.location = `login.html`;
}

function logOut() {
    $.ajax({
        url: "/api/todo/auth/logout",
        type: 'get',
        contentType: 'application/json',
        success: function (data) {
            if (data.status)
                window.location = "login.html?loggedOut=true";
        }
    });
}
