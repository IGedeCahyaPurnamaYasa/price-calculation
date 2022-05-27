

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

        $('.select2').select2();
    }
}

function clone(){
    const row = $('.ingridient-row').get();
    const lastId = $(row.slice(-1)[0]).attr('id') ? $(row.slice(-1)[0]).attr('id').split('-')[1] : -1;
    const content = $('#template-ingridient-row').prop('content');
    const tr = $(content).children().get()[0];
    $(tr).attr('id', 'ingridient-' + (parseInt(lastId) + 1));

    const rows = $('#template-ingridient-row').html();

    $('tbody#table_ingridient_body').append(rows);
}

function clone_cost(){
    const row = $('.cost-row').get();
    const lastId = $(row.slice(-1)[0]).attr('id') ? $(row.slice(-1)[0]).attr('id').split('-')[1] : -1;
    const content = $('#template-cost-row').prop('content');
    const tr = $(content).children().get()[0];
    const cost_type = $(content).find('.cost_type');

    // console.log('cost_type: ', cost_type);
    
    // $(cost_type).select2();

    $(tr).attr('id', 'cost-' + (parseInt(lastId) + 1));
    
    const rows = $('#template-cost-row').html();
    
    $('tbody#table_cost_body').append(rows);
    
    // cost_type.select2({
        
    // });
}

function calculate_total_ingridient(){
    let total = 0;
    $.each($('.ingridient_total'), function(k, v) {
        value = $(v).val();
        value = parseFloat(value);
        if(value !== NaN)
            total += value
    })

    $('#sum_ingridient').text(total);
}

function calculate_total_cost(){
    let total = 0;
    let total_ingridient = parseFloat($('#sum_ingridient').text() ?? 0);
    $.each($('.cost_percentage'), function(k, v) {
        value = $(v).val();
        value = parseFloat(value);
        if(value !== NaN){
            let temp = (value/100) * total_ingridient;
            total += temp
        }
    })

    $('#sum_cost').text(total);

    calculate_adjustment();
}

function calculate_total(event){
    let target = event.target;

    let qty = $(target).parent().parent().find('td .ingridient_qty').val() ?? 0;
    let price = $(target).parent().parent().find('td .ingridient_price').val() ?? 0;
    
    let total = qty * price;
    
    $(target).parent().parent().find('td .ingridient_total').val(total);
}

function calculate_adjustment(){
    let sum_ingridient = $('#sum_ingridient').text();
    console.log('sum_ingridient: ', sum_ingridient);
    let sum_cost = $('#sum_cost').text();
    console.log('sum_cost: ', sum_cost);
    let price = $('#price').val();
    console.log('price: ', price);

    let adjustment = parseFloat(price) - (parseFloat(sum_ingridient) + parseFloat(sum_cost));

    $('#adjustment').text(adjustment);
}

function save(e){
    let product_id = document.getElementById("product_id").getAttribute('content');
    let form = $('#form-product');
    form.submit();
    // let form_data = new FormData(form);

    // $.ajax({
    //     url: `/product/${product_id}?_method=PUT`,
    //     method: 'POST',
    //     data: form,
    //     success: function(res) {
    //         console.log(res);
    //     },
    //     error: function(req, status, error){
    //         console.log(error);
    //     }
    // })

    // console.log('form: ', form);
}


$(document).ready(() => app.start());