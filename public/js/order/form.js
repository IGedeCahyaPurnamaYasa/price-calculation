
const app = {
    start(){
        $('#table_order').DataTable({})
        
        initialize_select2();
        initialize_datepicker();
    }
}

function initialize_datepicker() {
    $(".datepicker").datepicker({ 
        format: 'yyyy-mm-dd' 
    });
}

function reset_form_order_detail(){
    $('#temp_product').val(null).trigger('change');
    $('#temp_qty').val('');
    $('#temp_price').val('');
    $('#temp_total').val('');
}


function set_temp_price(event){
    let target = event.target;

    let select = $(target).parent().parent().find('.temp_order_detail_select2').select2('data');
    let price = select[0].element.getAttribute('price');
    
    $(target).parent().parent().find('#temp_price').val(price);
}


function clone_temp_order_detail(e){
    e.preventDefault();

    let product = $('#temp_product').val();
    let qty = $('#temp_qty').val();
    let price = $('#temp_price').val();
    let total = $('#temp_total').val();

    const row = $('.order-detail-row').get();
    const lastId = $(row.slice(-1)[0]).attr('id') ? $(row.slice(-1)[0]).attr('id').split('-')[1] : -1;
    const content = $('#template-order-detail-row').prop('content');
    const tr = $(content).children().get()[0];

    $(tr).attr('id', 'order_detail-' + (parseInt(lastId) + 1));

    const rows = $('#template-order-detail-row').html();

    $('tbody#table_order_body').append(rows);
    
    $('#order_detail-' + (parseInt(lastId) + 1)).find('.order_detail_select2').val(product);
    $('#order_detail-' + (parseInt(lastId) + 1)).find('.order_detail_qty').val(qty);
    $('#order_detail-' + (parseInt(lastId) + 1)).find('.order_detail_price').val(price)
    $('#order_detail-' + (parseInt(lastId) + 1)).find('.order_detail_total').val(total)
    
    initialize_select2();

    calculate_total_order();

    reset_form_order_detail();
}

function calculate_temp_total(){
    let qty = $('#temp_qty').val();
    let price = $('#temp_price').val();
    $('#temp_total').val(qty * price);
}


function initialize_select2() {
    $('.select2').select2({
        tags: "true",
        placeholder: "Select an option",
    });

    $('.temp_order_detail_select2').select2({
        tags: "true",
        placeholder: "Select an option",
    })

    $('.order_detail_select2').select2({
        tags: "true",
        placeholder: "Select an option",
    })
}


function clone(){
    const row = $('.order-detail-row').get();
    const lastId = $(row.slice(-1)[0]).attr('id') ? $(row.slice(-1)[0]).attr('id').split('-')[1] : -1;
    const content = $('#template-order-detail-row').prop('content');
    const tr = $(content).children().get()[0];
    $(tr).attr('id', 'order_detail-' + (parseInt(lastId) + 1));

    const rows = $('#template-order-detail-row').html();

    $('tbody#table_order_body').append(rows);

    initialize_select2();
}


function set_price(event){
    let target = event.target;

    // let qty = $(target).parent().parent().find('td .ingridient_qty').val() ?? 0;
    let select = $(target).parent().parent().find('td .order_detail_select2').select2('data');
    let price = select[0].element.getAttribute('price');
    
    $(target).parent().parent().find('td .order_detail_price').val(price);
}

function calculate_total_order(){
    let total = 0;
    $.each($('.order_detail_total'), function(k, v) {
        value = $(v).val();
        value = parseFloat(value);
        if(!isNaN(value))
            total += value;
    })

    $('#total_order').val(total);
}

function calculate_total(event){
    let target = event.target;

    let qty = $(target).parent().parent().find('td .order_detail_qty').val() ?? 0;
    let price = $(target).parent().parent().find('td .order_detail_price').val() ?? 0;
    
    let total = qty * price;
    
    $(target).parent().parent().find('td .order_detail_total').val(total);
}


function save(e){
    let form = $('#form-order');
    form.submit();
}


$(document).ready(() => app.start());