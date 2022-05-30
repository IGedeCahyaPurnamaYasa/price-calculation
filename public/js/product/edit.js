

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
        initialize_select2();
    }
}

function set_temp_price(event){
    let target = event.target;

    // let qty = $(target).parent().parent().find('td .ingridient_qty').val() ?? 0;
    let select = $(target).parent().parent().find('.temp_ingridient_select2').select2('data');
    let price = select[0].element.getAttribute('price');
    
    $(target).parent().parent().find('#temp_price').val(price);
}

function clone_temp_ingridient(e){
    e.preventDefault();

    let ingridient = $('#temp_ingridient').val();
    let qty = $('#temp_qty').val();
    let unit = $('#temp_unit').val();
    let price = $('#temp_price').val();
    let total = $('#temp_total').val();

    console.log(qty);

    const row = $('.ingridient-row').get();
    const lastId = $(row.slice(-1)[0]).attr('id') ? $(row.slice(-1)[0]).attr('id').split('-')[1] : -1;
    const content = $('#template-ingridient-row').prop('content');
    const tr = $(content).children().get()[0];

    $(tr).attr('id', 'ingridient-' + (parseInt(lastId) + 1));

    const rows = $('#template-ingridient-row').html();

    $('tbody#table_ingridient_body').append(rows);

    // console.log($('#ingridient-' + (parseInt(lastId) + 1)).find('.ingridient_select2'));
    
    $('#ingridient-' + (parseInt(lastId) + 1)).find('.ingridient_select2').val(ingridient);
    $('#ingridient-' + (parseInt(lastId) + 1)).find('.ingridient_qty').val(qty);
    $('#ingridient-' + (parseInt(lastId) + 1)).find('.ingridient_price').val(price)
    $('#ingridient-' + (parseInt(lastId) + 1)).find('.ingridient_unit').val(unit)
    $('#ingridient-' + (parseInt(lastId) + 1)).find('.ingridient_total').val(total)
    
    initialize_select2();

    calculate_total_ingridient();
    calculate_total_cost();
    calculate_adjustment();

    // reset_form_ingridient();
}

function reset_form_ingridient(){
    $('#temp_ingridient').val(null).trigger('change');
    $('#temp_qty').val('');
    $('#temp_unit').val('');
    $('#temp_price').val('');
    $('#temp_total').val('');
}


function clone_temp_cost(e){
    e.preventDefault();

    let cost = $('#temp_cost').val();
    let percentage = $('#temp_percentage').val();

    const row = $('.cost-row').get();
    const lastId = $(row.slice(-1)[0]).attr('id') ? $(row.slice(-1)[0]).attr('id').split('-')[1] : -1;
    const content = $('#template-cost-row').prop('content');
    const tr = $(content).children().get()[0];

    $(tr).attr('id', 'cost-' + (parseInt(lastId) + 1));
    
    const rows = $('#template-cost-row').html();
    
    $('tbody#table_cost_body').append(rows);
    
    initialize_select2();

    $('#cost-' + (parseInt(lastId) + 1)).find('.cost_select2').val(cost).trigger('change');
    $('#cost-' + (parseInt(lastId) + 1)).find('.cost_percentage').val(percentage);

    calculate_total_ingridient();
    calculate_total_cost();
    calculate_adjustment();

    reset_form_cost();
}

function reset_form_cost(){
    $('#temp_cost').val(null).trigger('change');
    $('#temp_percentage').val('');
}

function calculate_temp_total(){
    let qty = $('#temp_qty').val();
    let price = $('#temp_price').val();
    $('#temp_total').val(qty * price);
}

function calculate_temp_price(){
    let qty = $('#temp_qty').val();
    let total = $('#temp_total').val();
    $('#temp_price').val(total / qty);
}

function initialize_select2(){    
    $('.select2').select2();

    $('.temp_ingridient_select2').select2({
        tags: "true",
        placeholder: "Select an option",
    })

    $('.ingridient_select2').select2({
        tags: "true",
        placeholder: "Select an option",
    })

    $('.cost_select2').select2({
        tags: "true",
        placeholder: "Select an option",
    })

    $('.cost_temp_select2').select2({
        tags: "true",
        placeholder: "Select an option",
    })
}

function clone(){
    const row = $('.ingridient-row').get();
    const lastId = $(row.slice(-1)[0]).attr('id') ? $(row.slice(-1)[0]).attr('id').split('-')[1] : -1;
    const content = $('#template-ingridient-row').prop('content');
    const tr = $(content).children().get()[0];
    $(tr).attr('id', 'ingridient-' + (parseInt(lastId) + 1));

    const rows = $('#template-ingridient-row').html();

    $('tbody#table_ingridient_body').append(rows);

    initialize_select2();
}

function clone_cost(){
    const row = $('.cost-row').get();
    const lastId = $(row.slice(-1)[0]).attr('id') ? $(row.slice(-1)[0]).attr('id').split('-')[1] : -1;
    const content = $('#template-cost-row').prop('content');
    const tr = $(content).children().get()[0];

    $(tr).attr('id', 'cost-' + (parseInt(lastId) + 1));
    
    const rows = $('#template-cost-row').html();
    
    $('tbody#table_cost_body').append(rows);
    
    initialize_select2();
}

function calculate_total_ingridient(){
    let total = 0;
    $.each($('.ingridient_total'), function(k, v) {
        value = $(v).val();
        value = parseFloat(value);
        if(!isNaN(value))
            total += value;
    })

    $('#sum_ingridient').text(total);
}

function calculate_total_cost(){
    let total = 0;
    let total_ingridient = parseFloat($('#sum_ingridient').text() ?? 0);
    $.each($('.cost_percentage'), function(k, v) {
        value = $(v).val();
        value = parseFloat(value);
        if(!isNaN(value)){
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

function calculate_price(event){
    let target = event.target;

    let qty = $(target).parent().parent().find('td .ingridient_qty').val() ?? 0;
    let total = $(target).parent().parent().find('td .ingridient_total').val() ?? 0;

    let price = total / qty;

    $(target).parent().parent().find('td .ingridient_price').val(price);
}

function calculate_adjustment(){
    let sum_ingridient = $('#sum_ingridient').text();
    let sum_cost = $('#sum_cost').text();
    let price = $('#price').val();

    let adjustment = parseFloat(price) - (parseFloat(sum_ingridient) + parseFloat(sum_cost));

    $('#adjustment').text(adjustment);
}

function set_price(event){
    let target = event.target;

    // let qty = $(target).parent().parent().find('td .ingridient_qty').val() ?? 0;
    let select = $(target).parent().parent().find('td .ingridient_select2').select2('data');
    let price = select[0].element.getAttribute('price');
    
    $(target).parent().parent().find('td .ingridient_price').val(price);
}

function save(e){
    let product_id = document.getElementById("product_id").getAttribute('content');
    let form = $('#form-product');
    form.submit();
}


$(document).ready(() => app.start());