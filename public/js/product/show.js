

const app = {
    start(){

        $('#table_ingridient').DataTable({
            responsive: true,
            fixedHeader: true,
            processing: true,
            // serverSide: true,
            // stateSave : true,
            paging: true,
            ajax: {
                url: window.location.href + "/ingridients"
            },
            columnDefs: [
                {
                    targets: [5],
                    createdCell: function (td, cellData, rowData, row, col){
                        $(td).addClass('dt-body-right ingridient_total')
                    },
                    render: format_decimal
                },
                {
                    targets: [2, 4],
                    className: 'dt-body-right',
                    render: format_decimal
                },
                {
                    targets: [3],
                    className: 'dt-body-center'
                },
                
            ],
            columns: [
                {
                    data: null,
                    render: icon_number,
                },
                {data: 'name'},
                {
                    data: 'qty',
                },
                {
                    data: 'unit',
                },
                {
                    data: 'price',
                },
                {data: 'total'},
            ],
            drawCallback: function(){
                calculate_total_ingridient();
                calculate_total_cost();
                calculate_adjustment();
            }
        })


        $('#table_cost').DataTable({
            responsive: true,
            fixedHeader: true,
            processing: true,
            // serverSide: true,
            // stateSave : true,
            paging: true,
            ajax: {
                url: window.location.href + "/costs"
            },
            columnDefs: [
                {
                    targets: [2],
                    createdCell: function (td, cellData, rowData, row, col){
                        console.log('rowData: ', rowData);
                        if(rowData.cost_type_id.type == 'profit'){
                            $(td).addClass('dt-body-right cost_percentage profit')
                        }
                        else{
                            $(td).addClass('dt-body-right cost_percentage cost')
                        }
                    },
                    // className: 'dt-body-right cost_percentage',
                    render: format_decimal
                },
            ],
            columns: [
                {
                    data: null,
                    render: icon_number,
                },
                {data: 'cost_type_id.name'},
                {
                    data: 'percentage'
                }
            ],
            drawCallback: function(){
                calculate_total_ingridient();
                calculate_total_cost();
                calculate_adjustment();
            }
        })
    }
}

var createActionBtn = function (data, type, row, meta){
    let action = `
        <div class="d-flex justify-content-center align-items-center">
            <a href="/product/${data._id}"><i class="fa fa-eye mx-1"></i></a>
            <a href="/product/${data._id}/edit"><i class="fa fa-edit text-warning mx-1"></i></a>
            <form action="/product/${data._id}?_method=DELETE" class="d-inline mx-1" method="POST">
                <button style="border: none;"><i class="fa fa-trash text-danger"></i></button>
            </form>
        </div>
    `
    return action;
}


function calculate_total_ingridient(){
    let total = 0;
    $.each($('.ingridient_total'), function(k, v) {
        value = $(v).text();
        value = parseFloat(value);
        console.log('value: ', value);
        if(value !== NaN)
            total += value
    })

    $('#sum_ingridient').text(total.toFixed(2));
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

    $('#sum_cost').text(total_cost.toFixed(2));
    $('#sum_profit').text(total_profit.toFixed(2));
}

function calculate_adjustment(){
    let sum_ingridient = $('#sum_ingridient').text();
    let sum_cost = $('#sum_cost').text();
    let sum_profit = $('#sum_profit').text();
    let price = $('#price').text();

    let adjustment = parseFloat(price) - (parseFloat(sum_ingridient) + parseFloat(sum_cost) + parseFloat(sum_profit));

    $('#adjustment').text(adjustment.toFixed(2));
}


$(document).ready(() => app.start());