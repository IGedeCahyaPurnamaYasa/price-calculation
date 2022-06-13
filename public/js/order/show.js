

const app = {
    start(){
        $('#table_order').DataTable({
            responsive: true
        })

        $('#table_payment').DataTable({
            responsive: true
        })

        calculate_total_payment();
        calculate_unpaid();
    }
}

function calculate_unpaid(){
    const total_order = parseFloat($('#price').text());
    const total_paid = parseFloat($('#total_paid').text());

    $('#total_unpaid').text(total_order - total_paid);
}

function calculate_total_payment(){
    let total = 0;
    $.each($('.payment_value'), function(k, v) {
        value = $(v).text();
        value = parseFloat(value);
        if(!isNaN(value))
            total += value;
    })

    $('#total_paid').text(total);
}

$(document).ready(() => app.start());