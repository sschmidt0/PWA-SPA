$(document).on('focus', ".datepicker", function() {
    $(this).datepicker();
});

function datepicker() {
    return {
        format: "yyyy-mm-dd",
        autoclose: true,
        todayHighlight: true,
        showOtherMonths: true,
        selectOtherMonths: true,
        changeMonth: true,
        changeYear: true,
        orientation: "button"
    };
}
