var authenticationApp = new Vue({
    el: '#authenticationApp',
    data: {
        showedwelcome: 0,
        curselector: -1,
        cursex: -1,
        result_icon: "img/authentication/result_err.png",
        result_text: "",
        result_button: ""
    },
    methods: {

        setSelector: function(selector) {
            switch (selector) {
                case 0:
                    document.getElementsByClassName("login")[0].style.display = "grid";
                    document.getElementsByClassName("registration")[0].style.display = "none";
                    document.getElementsByClassName("recovery")[0].style.display = "none";

                    document.getElementsByClassName("left-login")[0].style.display = "grid";
                    document.getElementsByClassName("left-registration")[0].style.display = "none";
                    document.getElementsByClassName("left-lost")[0].style.display = "none";

                    authenticationApp.$data.curselector = 0;
                    $(".authentication .login #login-email").focus();
                    break;
                case 1:
                    document.getElementsByClassName("login")[0].style.display = "none";
                    document.getElementsByClassName("registration")[0].style.display = "grid";
                    document.getElementsByClassName("recovery")[0].style.display = "none";

                    document.getElementsByClassName("left-login")[0].style.display = "none";
                    document.getElementsByClassName("left-registration")[0].style.display = "grid";
                    document.getElementsByClassName("left-lost")[0].style.display = "none";

                    $(".authentication .registration #reg-email").focus();
                    authenticationApp.$data.curselector = 1;
                    break;
                case 2:
                    document.getElementsByClassName("login")[0].style.display = "none";
                    document.getElementsByClassName("registration")[0].style.display = "none";
                    document.getElementsByClassName("recovery")[0].style.display = "grid";

                    document.getElementsByClassName("left-login")[0].style.display = "none";
                    document.getElementsByClassName("left-registration")[0].style.display = "none";
                    document.getElementsByClassName("left-lost")[0].style.display = "grid";

                    $(".authentication .registration #reg-email").focus();
                    authenticationApp.$data.curselector = 2;
                    break;
            }
        },
        /*setSex: function(selector) {
              if(!selector) {

                  if(authenticationApp.$data.cursex !== 0) {
                      var list = $(".sex-block");
                      list[1].classList.add("sex-block-active");
                      list[0].classList.remove("sex-block-active");

                      authenticationApp.$data.cursex = 0;
                  }
              }
              else {
                  if(authenticationApp.$data.cursex !== 1) {
                      var list = $(".sex-block");
                      list[1].classList.remove("sex-block-active");
                      list[0].classList.add("sex-block-active");

                      authenticationApp.$data.cursex = 1;
                  }
              }
        },*/
        hideRecoveryCodeScreen: function() {
            $("#authenticationApp .recovery-modal").fadeOut(500).promise().done(function() {
                $("#authenticationApp .authentication-screen").fadeIn(250);
            });
        },
        showRecoveryScreen: function() {
            $(".select,.login,.registration,.confirmEmail").fadeOut(500).promise().done(function() {
                $(".recovery").fadeIn(250);
                $(".recovery .email").focus();
            });
        },
        hideRecoveryResultScreen: function() {

            $(".recovery-result").fadeOut(500).promise().done(function() {
                $(".select,.login").fadeIn(250);
            });
        },
        showConfirmEmail: function() {
            sendEmailCode();
            initConfirmEmailHandler();
            $(".authentication-screen").fadeOut(500).promise().done(function() {
                $(".email-confirm-modal").fadeIn(250);
                $(".email-confirm-modal #email-confirm-code").focus();
            });
        },
        showAuthAccount: function() {
            $(".email-confirm-modal").fadeOut(500).promise().done(function() {
                $(".authentication-screen").fadeIn(250);
                authenticationApp.setSelector(1);
                $(".authentication .login .loginOrEmail").focus();
            });
        },
    }
});

alt.on("showConfirmCodeModal", () => {
    authenticationApp.showConfirmEmail();
});

authenticationApp.setSelector(0);

// Global function
function showWelcomeScreen() {

    $(".welcome").fadeIn(1500, function() {
        authenticationApp.$data.showedwelcome = 0;
        $("body").click(function() {
            hideWelcomeScreen();
        });

        $("body").keyup(function() {
            hideWelcomeScreen();
        });
    });;
}

function hideWelcomeScreen() {

    if (authenticationApp.$data.showedwelcome) return;
    authenticationApp.$data.showedwelcome = 1;

    $(".welcome").addClass("hide-welcome");

    $(".logo").fadeOut(1000);
    setTimeout(function() {
        $(".welcome").hide();
        showAuthenticationScreen();

    }, 1500);
}

function showAuthenticationScreen() {
    $(".authentication").fadeIn(400);
    $(".authentication .login .loginOrEmail").focus();
}

function hideAuthenticationScreen() {
    $(".authentication").fadeOut(400);
}

function showRecoveryResultScreen(error, message, button) {

    if (error) authenticationApp.$data.result_icon = "img/authentication/result_err.png";
    else authenticationApp.$data.result_icon = "img/authentication/result_ok.png";

    authenticationApp.$data.result_text = message;
    authenticationApp.$data.result_button = button;

    $(".select,.login").fadeOut(500).promise().done(function() {
        $(".recovery-result").fadeIn(250);
    });
}