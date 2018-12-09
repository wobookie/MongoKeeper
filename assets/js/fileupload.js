function handleFileLabel(input) {
    if (input.files && input.files[0]) {
        $('#fileUploadLabelId').html(input.files[0].name);
    }
}