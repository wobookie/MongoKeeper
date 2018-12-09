// Set event listener

// File Upload
$("#fileUploadFormId").submit(function() {
    handleFileUpload();
});

// File Label
function handleFileLabel(input) {
    if (input.files && input.files[0]) {
        $('#fileUploadLabelId').html(input.files[0].name);
    }
}

async function handleFileUpload() {
    stepped = 0;
    rowCount = 0;
    errorCount = 0;
    firstError = undefined;

    var config = buildConfig();

    if (!$('#files')[0].files.length)
    {
        alert("Please choose at least one file to parse.");
    }

    $('#files').parse({
        config: config,
        before: function(file, inputElem)
        {
            start = now();
            console.log("Parsing file...", file);
        },
        error: function(err, file)
        {
            console.log("ERROR:", err, file);
            firstError = firstError || err;
            errorCount++;
        },
        complete: function()
        {
            end = now();
            printStats("Done with all files");
        }
    });
    console.log("Parsing results: " + parseResult);

}

function buildConfig()
{
    return {
        delimiter: ",",	// auto-detect
        newline: "",	// auto-detect
        quoteChar: '"',
        escapeChar: '"',
        header: false,
        transformHeader: undefined,
        dynamicTyping: false,
        preview: 0,
        encoding: "",
        worker: false,
        comments: false,
        step: function(results) {
            console.log("Row data:", results.data);
            console.log("Row errors:", results.errors);
        },
        complete: function(results) {
            console.log("Parse complete");
            console.log("    Results: ", results);
        },
        error: function(error, file)
        {
            console.log("ERROR:", error, file);
            firstError = firstError || error;
            errorCount++;
        },
        download: false,
        skipEmptyLines: false,
        chunk: undefined,
        fastMode: undefined,
        beforeFirstChunk: undefined,
        withCredentials: undefined,
        transform: undefined
    };
}

function printStats(msg)
{
    if (msg)
        console.log(msg);
    console.log("       Time:", (end-start || "(Unknown; your browser does not support the Performance API)"), "ms");
    console.log("  Row count:", rowCount);
    if (stepped)
        console.log("    Stepped:", stepped);
    console.log("     Errors:", errorCount);
    if (errorCount)
        console.log("First error:", firstError);
}

function now()
{
    return typeof window.performance !== 'undefined'
        ? window.performance.now()
        : 0;
}

