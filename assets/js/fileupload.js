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

function writeDataSet(dataset) {
    console.log("Prepare to write data set...");

    /*for (var i = 0; i < dataset.length; i++) {
        dataset[i].creationDate = new Date().toISOString();
    }*/


    i = 0
    j = []
    dataset.forEach(function (d) {
        i++
        j.push(d)
        if (i == 100) {
            i = 0
            loadInStitch(j)
            j = []
        }

    })

    /*
    
        */
    // for (var i = 0; i < dataset.length; i++) {
    //    console.log("write dataSet " + dataset[i]);
    //    collection.insertOne(dataset[i])
    //        .then(doc => {
    //            console.log(JSON.stringify(doc.insertedId));
    //       })
    //        .catch(err => {
    //            console.error(err);
    //        });
    // }

}
async function loadInStitch(j) {
    collection.insertMany(j)
        .then(doc => {
            console.log("Dataset inserted");
        })
        .catch(function (err) {
            console.error(err);
        });
}