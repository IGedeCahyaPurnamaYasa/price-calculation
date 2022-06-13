const app = {
    start(){

        initialize_select2();
        
        initialize_datepicker();

        $('#payment_category').change(function(e){
            let val = $(this).val();
            console.log('val: ', val);
            if(val == 'Paid Off'){
                let order_total = parseFloat($('#total').text());

                $('#payment_value').val(order_total);
            }
        })
    }
}


function set_price(event){
    
    let target = event.target;

    let select = $(target).parent().parent().find('.payment_select2').select2('data');
    let total = select[0].element.getAttribute('total');

    $('#total').text(total);
}

function initialize_datepicker() {
    $(".datepicker").datepicker({ 
        format: 'yyyy-mm-dd' 
    });
}

function initialize_select2() {
    $('.select2').select2({
        tags: "true",
        placeholder: "Select an option",
    });

    $('.payment_select2').select2({
        tags: "true",
        placeholder: "Select an option",
    })
}


$(document).ready(() => app.start());