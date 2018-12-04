// Get references to page elements
const statusMessage = document.getElementById("statusMessageId");

// Set event listener


// Setup MongoDB Stitch
const appID = "archive-jeqag";
const stitchClient = stitch.Stitch.initializeDefaultAppClient(appID);

if (stitch.Stitch.hasAppClient(appID)) {
	revealStatusContainer();
	statusMessage.innerText = "Client for ID " + appID + " initialised."
} else {
	statusMessage.innerText = "Client for ID " + appID + " not initialised!"
}

function revealStatusContainer() {
	const container = document.getElementById("appstatus-container");
	container.classList.remove("hidden");
}
