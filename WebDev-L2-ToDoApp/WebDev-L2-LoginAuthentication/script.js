const loginSection =
    document.getElementById("loginSection");

const registerSection =
    document.getElementById("registerSection");

const dashboardSection =
    document.getElementById("dashboardSection");


const loginForm =
    document.getElementById("loginForm");

const registerForm =
    document.getElementById("registerForm");


const showRegisterButton =
    document.getElementById("showRegisterButton");

const showLoginButton =
    document.getElementById("showLoginButton");

const logoutButton =
    document.getElementById("logoutButton");


const loginMessage =
    document.getElementById("loginMessage");

const registerMessage =
    document.getElementById("registerMessage");


const userName =
    document.getElementById("userName");

const dashboardName =
    document.getElementById("dashboardName");

const dashboardEmail =
    document.getElementById("dashboardEmail");


/* Show Registration */

showRegisterButton.addEventListener(
    "click",
    function () {

        loginSection.classList.add("hidden");

        registerSection.classList.remove("hidden");

        loginMessage.textContent = "";
    }
);


/* Show Login */

showLoginButton.addEventListener(
    "click",
    function () {

        registerSection.classList.add("hidden");

        loginSection.classList.remove("hidden");

        registerMessage.textContent = "";
    }
);


/* Registration */

registerForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const name =
            document.getElementById("registerName").value.trim();

        const email =
            document.getElementById("registerEmail").value.trim();

        const password =
            document.getElementById("registerPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;


        registerMessage.textContent = "";
        registerMessage.style.color = "";


        /* Check Password */

        if (password !== confirmPassword) {

            registerMessage.textContent =
                "Passwords do not match.";

            registerMessage.style.color = "#a45c32";

            return;
        }


        /* Check Existing User */

        const existingUser =
            JSON.parse(
                localStorage.getItem("taskFlowUser")
            );


        if (
            existingUser &&
            existingUser.email.toLowerCase() ===
            email.toLowerCase()
        ) {

            registerMessage.textContent =
                "An account with this email already exists.";

            registerMessage.style.color = "#a45c32";

            return;
        }


        /* Create User */

        const user = {

            name: name,

            email: email,

            password: password

        };


        localStorage.setItem(
            "secureLoginUser",
            JSON.stringify(user)
        );


        registerMessage.textContent =
            "Account created successfully. Please login.";

        registerMessage.style.color = "green";


        registerForm.reset();


        setTimeout(
            function () {

                registerSection.classList.add(
                    "hidden"
                );

                loginSection.classList.remove(
                    "hidden"
                );

                registerMessage.textContent = "";

            },
            1000
        );

    }
);


/* Login */

loginForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;


        loginMessage.textContent = "";


        const savedUser =
            JSON.parse(
                localStorage.getItem("secureLoginUser")
            );


        /* No Account */

        if (!savedUser) {

            loginMessage.textContent =
                "No account found. Please create an account first.";

            loginMessage.style.color = "#a45c32";

            return;
        }


        /* Check Credentials */

        if (
            email.toLowerCase() ===
            savedUser.email.toLowerCase() &&
            password === savedUser.password
        ) {

            localStorage.setItem(
                "secureLoginStatus",
                "loggedIn"
            );


            showDashboard(savedUser);


            loginForm.reset();

            loginMessage.textContent = "";

        } else {

            loginMessage.textContent =
                "Incorrect email or password.";

            loginMessage.style.color = "#a45c32";
        }

    }
);


/* Show Dashboard */

function showDashboard(user) {

    loginSection.classList.add("hidden");

    registerSection.classList.add("hidden");

    dashboardSection.classList.remove("hidden");


    userName.textContent = user.name;

    dashboardName.textContent = user.name;

    dashboardEmail.textContent = user.email;
}


/* Logout */

logoutButton.addEventListener(
    "click",
    function () {

        localStorage.removeItem(
            "secureLoginStatus"
        );


        dashboardSection.classList.add(
            "hidden"
        );

        loginSection.classList.remove(
            "hidden"
        );

    }
);


/* Check Login Status */

function checkLoginStatus() {

    const loginStatus =
        localStorage.getItem(
            "secureLoginStatus"
        );

    const savedUser =
        JSON.parse(
            localStorage.getItem(
                "secureLoginUser"
            )
        );


    if (
        loginStatus === "loggedIn" &&
        savedUser
    ) {

        showDashboard(savedUser);

    } else {

        loginSection.classList.remove(
            "hidden"
        );

        dashboardSection.classList.add(
            "hidden"
        );
    }
}


checkLoginStatus();