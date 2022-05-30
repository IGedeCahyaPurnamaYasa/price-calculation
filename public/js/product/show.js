

const app = {
    start(){
        $('#table_ingridient').DataTable({
            responsive: true
        })
        $('#table_cost').DataTable({
            responsive: true
        })

        calculate_total_ingridient();
        calculate_total_cost();
        calculate_adjustment();
    }
}


function calculate_total_ingridient(){
    let total = 0;
    $.each($('.ingridient_total'), function(k, v) {
        value = $(v).text();
        console.log(value);
        value = parseFloat(value);
        if(value !== NaN)
            total += value
    })

    $('#sum_ingridient').text(total);
}

function calculate_total_cost(){
    let total_cost = 0;
    let total_profit = 0;
    let total_ingridient = parseFloat($('#sum_ingridient').text() ?? 0);
    $.each($('.cost_percentage.cost'), function(k, v) {
        value = $(v).text();
        value = parseFloat(value);
        if(value !== NaN){
            let temp = (value/100) * total_ingridient;
            total_cost += temp
        }
    })

    $.each($('.cost_percentage.profit'), function(k, v) {
        value = $(v).text();
        value = parseFloat(value);
        if(value !== NaN){
            let temp = (value/100) * total_ingridient;
            total_profit += temp
        }
    })

    $('#sum_cost').text(total_cost);
    $('#sum_profit').text(total_profit);
}

function calculate_adjustment(){
    let sum_ingridient = $('#sum_ingridient').text();
    let sum_cost = $('#sum_cost').text();
    let sum_profit = $('#sum_profit').text();
    let price = $('#price').text();

    let adjustment = parseFloat(price) - (parseFloat(sum_ingridient) + parseFloat(sum_cost) + parseFloat(sum_profit));

    $('#adjustment').text(adjustment);
}


$(document).ready(() => app.start());