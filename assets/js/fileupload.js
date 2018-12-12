// Set event listener

$("#btnFileUploadSubmit").on("click", function () {
    loader.classList.add("is-active");

    var files = document.getElementById("file").files;
    handleFileUpload(files);
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
    if (!files.length) {
        alert("Please choose at least one file to parse.");
        return;
    }

    loader.classList.add("is-active");

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
            statusCount++
            allProccessed(statusCount)
        })
        .catch(function (err) {
            console.error(err);
            statusCount++
            allProccessed(statusCount)
        });
}

function allProccessed(counter) {
    if (datasetLength > 100) {
        counter = counter * 100;
    }

    if (counter >= datasetLength) {
        console.log(`Data is loaded - ${counter} - ${datasetLength}`)
        loader.classList.remove("is-active");
    }
}