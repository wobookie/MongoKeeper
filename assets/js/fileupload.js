// Set event listener

// File Upload
$("#fileUploadFormId").submit(function() {
    handleFileUpload();
});

function handleFileLabel(input) {
    if (input.files && input.files[0]) {
        $('#fileUploadLabelId').html(input.files[0].name);
    }
}

async function handleFileUpload() {

    var config = buildConfig();

    if (!$('#file')[0].files.length)
    {
        alert("Please choose at least one file to parse.");
        return;
    }

    results = Papa.parse($('#file'), config)

}

function buildConfig()
{
    return {
        delimiter: "",	// auto-detect
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
        step: undefined,
        complete: undefined,
        error: undefined,
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

