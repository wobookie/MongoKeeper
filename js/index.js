//check API
if (window.File && window.FileReader && window.FileList && window.Blob) {
	// Great success! All the File APIs are supported.
	console.log("API File Read fully supported");
} else {
	alert("The File APIs are not fully supported in this browser.");
}

// load function
function handleFileSelect(evt) {
	var files = evt.target.files; // FileList object

	// files is a FileList of File objects. List some properties.
	var output = [];
	for (var i = 0, f; (f = files[i]); i++) {
		// Only process csv files.
		console.log(f.type);
		if (f.type === "text/csv" || f.type==="text/plain") {
			var reader = new FileReader();
			reader.onload = (function(theFile) {
				return function(e) {
					readCSV(e.target.result);
				};
			})(f);

			reader.readAsDataURL(f);

			output.push(
				"<li><strong>",
				escape(f.name),
				"</strong> (",
				f.type || "n/a",
				") - ",
				f.size,
				" bytes, last modified: ",
				f.lastModifiedDate.toLocaleDateString(),
				"</li>"
			);
		}
	}
	document.getElementById("list").innerHTML = "<ul>" + output.join("") + "</ul>";
}

document
	.getElementById("files")
	.addEventListener("change", handleFileSelect, false);

function readCSV(url) {
	d3.csv(url, function(error, dataset) {
		// NEW
		status("loading")
		dataset.forEach(function(d) {
			console.log(d);
			
			//TODO Omodify d JSON Object as you needed
			db
				.collection("ingest")
				.insertOne(d)
				.then(doc => {
					//console.log(JSON.stringify(doc.insertedId));
				})
				.catch(err => {
					console.error(err);
				status("Error")
				});
			
		});
		status("job done")
	});
	
}

//login
let db = "";

document.getElementById("appID").addEventListener("change", appIDName, false);

function appIDName() {
	console.log(document.getElementById("appID").value);
	const client = stitch.Stitch.initializeDefaultAppClient(
		document.getElementById("appID").value
	);
	db = client
		.getServiceClient(stitch.RemoteMongoClient.factory, "mongodb-atlas")
		.db("dwhArchive");

	client.auth
		.loginWithCredential(new stitch.AnonymousCredential())
		.catch(err => {
			console.error(err);
		});

	var x = document.getElementById("fileDiv");
	x.style.display = "block";

	//console.log("auth");
}

function status(e){
	document.getElementById("status").innerHTML = `<p> Status: ${e} </p>`
}