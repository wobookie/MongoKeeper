const fileInputText = document.getElementById("file");
const fileUploadSuccessMsg = document.getElementById("fileUploadSuccessMsg");
const fileUploadSuccessAlert = document.getElementById("fileUploadSuccessAlert");

// Set event listener
$("#btnFileUploadSubmit").on("click", function () {
    var files = document.getElementById("file").files;

    if (!files.length) {
        alert("Please choose at least one file to parse.");
    } else {
        loader.classList.add("is-active");
        handleFileUpload(files);
    }
});

// File Browser
$("#file").on("change", function () {
    if (this.files && this.files[0]) {
        $('#fileUploadLabelId').html(this.files[0].name);
    }
});

function parseFile(url, callBack) {
    Papa.parse(url, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
            console.log("Results: ", results);
            callBack(results.data);
        }
    });
}

function handleFileUpload(files) {
    parseFile(files[0], writeDataSet);
}

let statusCount = 0
let datasetLength

function writeDataSet(dataset) {
    console.log("Prepare to write data set...");

    datasetLength = dataset.length
    for (var i = 0; i < dataset.length; i++) {
        dataset[i].creationDate = new Date();
    }
    i = 0
    j = []
    console.log("load Atlas")
    dataset.forEach(function (d) {
        i++
        j.push(d)
        if (i == 100 || dataset.length < 100) {
            i = 0
            loadInStitch(j)
            j = []
        }
    })
}


function loadInStitch(j) {

    collection.insertMany(j)
        .then(doc => {
            statusCount++;
            allProccessed(statusCount);
        })
        .catch(function (err) {
            console.log(err);
            statusCount++;
            allProccessed(statusCount);
        });
}

function allProccessed(counter) {
    if (datasetLength >= 100) {
        counter = counter * 100;
    }

    if (counter >= datasetLength) {
        loader.classList.remove("is-active");
        fileInputText.value = "";
        fileUploadSuccessMsg.innerText="Data file is loaded - chunks: " + counter/100 + " - total datasets: " + datasetLength;
        fileUploadSuccessAlert.classList.remove("hidden");
    }
}