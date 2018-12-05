// Get references to page elements
const statusMessage = document.getElementById("statusMessageId");
const loginMessage = document.getElementById("loginMessageId");

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
        await stitchClient.auth.loginWithCredential(credential);
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