// Get references to page elements
const statusMessage = document.getElementById("statusMessageId");
const loginMessage = document.getElementById("loginMessageId");
const loginErrorMessage = document.getElementById("loginErrorId")
const collectionMessage = document.getElementById("collectionMessageId");


// Set event listener


// Setup MongoDB Stitch
const {
    Stitch,
    RemoteMongoClient,
    UserPasswordCredential,
    UserPasswordAuthProviderClient
} = stitch;


const appID = "archive-jeqag"; 
const stitchClient = stitch.Stitch.initializeDefaultAppClient(appID);
const db = stitchClient.getServiceClient(stitch.RemoteMongoClient.factory, 'mongodb-atlas').db('dwhArchive');
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

async function handleLogin() {
    console.log("Handle login - getLoginForm");
    const { email, password } = getLoginFormInfo();
    await emailPasswordAuth(email, password);
}

// Authenticate with Stitch as an email/password user
async function emailPasswordAuth(email, password) {
    console.log("Handle login request via eMailPasswordAuth");

    if (!stitchClient.auth.isLoggedIn) {
        // Log the user in
        const credential = new UserPasswordCredential(email, password);
        stitchClient.auth.loginWithCredential(credential).then(authedId => {
		console.log('successfully logged in with id: ${authedId}');
		hideLoginContainer();
		revealDashboardContainer();
		countAllDocuments();
	})
	.catch(error => {
		console.error('login failed ' + error);
		loginErrorMessage.innerText = "Login Failed - Incorrect email / password !";
	})
    }
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

function countAllDocuments() {
	return (collection.count());
}

async function refreshStatus() {
	try {
		var documentCount = await countAllDocuments();
		collectionMessage.innerText = "Found " + documentCount + " documents in collection";
	} catch(error) {
		console.error(error);
	}
}
