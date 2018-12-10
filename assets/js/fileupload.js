// Set event listener

$("#btnFileUploadSubmit").on("click", function() {
    loader.classList.add("is-active");

    var files = document.getElementById("file").files;
    handleFileUpload(files);
});

// File Browser
$("#file").on("change", function() {
    if (this.files && this.files[0]) {
        $('#fileUploadLabelId').html(this.files[0].name);
    }
});

function parseFile(url, callBack) {
    Papa.parse(url, {
        header: true,
        complete: function(results) {
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
    console.log("start write dataSet");

    collection.insertMany(dataset)
        .then(doc => {
            console.log("Dataset inserted");
            loader.classList.remove("is-active");
        })
        .catch(err => {
            console.error(err);
            loader.classList.remove("is-active");
        });

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