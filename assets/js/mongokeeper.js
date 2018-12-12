// Get references to page elements
const loader = document.getElementById("loaderId");

const statusMessage = document.getElementById("statusMessageId");
const loginMessage = document.getElementById("loginMessageId");
const loginErrorMessage = document.getElementById("loginErrorId")
const collectionMessage = document.getElementById("collectionMessageId");


// Set event listener
$("#btnLoginSubmit").on("click", function () {
    loader.classList.add("is-active");

    email = document.getElementById("inputEmail").value;
    password = document.getElementById("inputPassword").value;

    handleLogin(email, password);
});

// File Browser
$("#btnStatusRefresh").on("click", function () {
    loader.classList.add("is-active");

    handleStatusRefresh()
});


// Setup MongoDB Stitch
const {
    Stitch,
    RemoteMongoClient,
    UserPasswordCredential,
    UserPasswordAuthProviderClient
} = stitch;


const appID = "feedback-ksdgh";

//const appID = "archive-jeqag";
const stitchClient = stitch.Stitch.initializeDefaultAppClient(appID);
const db = stitchClient.getServiceClient(stitch.RemoteMongoClient.factory, 'mongodb-atlas').db('archiveDB');
const collection = db.collection("ingest")


if (stitch.Stitch.hasAppClient(appID)) {
    statusMessage.innerText = "Client for ID " + appID + " initialised.";
} else {
    statusMessage.innerText = "Client for ID " + appID + " not initialised!";
}

if (stitchClient.auth.isLoggedIn) {
    hideLoginContainer();
    revealDashboardContainer();
}

function countAllDocuments() {
    return (collection.count());
}

// Authenticate with Stitch as an email/password user
function emailPasswordAuth(email, password) {
    console.log("Handle login request via eMailPasswordAuth");

    if (!stitchClient.auth.isLoggedIn) {
        // Log the user in
        const credential = new UserPasswordCredential(email, password);
        stitchClient.auth.loginWithCredential(credential).then(authedId => {
            console.log('successfully logged in with id: ${authedId}');
            hideLoginContainer();
            revealDashboardContainer();
            loader.classList.remove("is-active");
        })
            .catch(error => {
                console.error('login failed ' + error);
                loginErrorMessage.innerText = "Login Failed - Incorrect email / password !";
                loader.classList.remove("is-active");
            })
    }
}

function revealDashboardContainer() {
    container = document.getElementById("dashboardContainerId");
    container.classList.remove("hidden");
}

function hideLoginContainer() {
    container = document.getElementById("loginContainerId");
    user = stitchClient.auth.user;

    container.classList.add("hidden");
    loginMessage.innerText = "Logged in as: " + user.profile.data.email;
}



// Set Event Handler
async function handleLogin(email, password) {
    isAuthenticated = await emailPasswordAuth(email, password);
}

async function handleStatusRefresh() {
    documentCount = await countAllDocuments();
    collectionMessage.innerText = "Found " + documentCount + " documents in collection";
    loader.classList.remove("is-active");
}


