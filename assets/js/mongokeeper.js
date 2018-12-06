// Get references to page elements
const statusMessage = document.getElementById("statusMessageId");
const loginMessage = document.getElementById("loginMessageId");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const btnRegisterLogin = document.getElementById("btnRegisterLogin");
// Set event listener


// Setup MongoDB Stitch
const appID = "archive-jeqag";
const stitchClient = stitch.Stitch.initializeDefaultAppClient(appID);

if (stitch.Stitch.hasAppClient(appID)) {
    statusMessage.innerText = "Client for ID " + appID + " initialised."


} else {
    statusMessage.innerText = "Client for ID " + appID + " not initialised!"
}


if (stitchClient.auth.isLoggedIn) {
    hideLoginForm();
    revealDashboardContainer();
    build(Date.now());
}

async function handleLogin() {

    const { email, password } = getLoginFormInfo();

    await emailPasswordAuth(email, password);
    build(Date.now());
}

// Authenticate with Stitch as an email/password user
async function emailPasswordAuth(email, password) {

    if (!stitchClient.auth.isLoggedIn) {
        // Log the user in

        const credential = new UserPasswordCredential(email, password);
        await stitchClient.loginWithCredential(credential)
            .then(authedId => {
                console.log(`successfully logged in with id: ${authedId}`);
            })
            .catch(err => {
                console.error(`login failed with error: ${err}`)
            });
    }
    hideLoginForm();
    revealDashboardContainer();
}

function getLoginFormInfo() {

    const emailEl = document.getElementById("inputEmail");
    const passwordEl = document.getElementById("inputPassword");
    // Parse out input text
    const email = emailEl.value;
    const password = passwordEl.value;
    // Remove text from login boxes
    emailEl.value = "";
    passwordEl.value = "";
    return { email: email, password: password };
}

function revealDashboardContainer() {
    const container = document.getElementById("dashboardContainerId");
    container.classList.remove("hidden");
}

function hideLoginContainer() {
    const container = document.getElementById("loginContainerId");
    const user = stitchClient.auth.user;

    container.classList.add("hidden");
    loginMessage.innerText = "Logged in as: " + user.profile.data.email;
}


function registerNewUser() {
    console.log(btnRegisterLogin.value)

    if (btnRegisterLogin.value === "Register") {
        btnRegisterLogin.value = "Sign In"
        loginForm.classList.add("hidden")
        registerForm.classList.remove("hidden")
    } else {
        loginForm.classList.remove("hidden")
        registerForm.classList.add("hidden")
        btnRegisterLogin.value = "Register"
    }
}

function newUserCreate(email, pwd) {

    const emailPassClient = stitchClient.auth
        .getProviderClient(UserPasswordAuthProviderClient.factory);

    emailPassClient.registerWithEmail(email, pwd)
        .then(() => {
            console.log("Successfully sent account confirmation email!");
        })
        .catch(err => {
            console.log("Error registering new user:", err);
        });
}
