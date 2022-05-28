const app = {
    start(){
        $('#qty').keyup(function(e){
            calculate_total();
        })
        
        $('#price').keyup(function(e) {
            calculate_total();
        })
    
        $('#total').keyup(function(e) {
            calculate_price();
        })
    }
}


function calculate_total(){
    let qty = $('#qty').val() ?? 0;
    let price = $('#price').val() ?? 0;

    let total = qty * price;

    $('#total').val(total);
}

function calculate_price(){
    let qty = $('#qty').val() ?? 0;
    let total = $('#total').val() ?? 0;

    let price = total/qty;

    $('#price').val(price);
}

$(document).ready(() => app.start());