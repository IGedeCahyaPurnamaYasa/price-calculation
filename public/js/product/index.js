

const app = {
    start(){

        var icon_number = function (data, type, row, meta) {
            return String(meta.row + meta.settings._iDisplayStart + 1);
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

        $('#table').DataTable({
            responsive: true,
            fixedHeader: true,
            processing: true,
            // serverSide: true,
            paging: true,
            // stateSave : true,
            ajax: {
                url: "/product/data"
            },
            columns: [
                {
                    data: null,
                    render: icon_number,
                },
                {data: 'name'},
                {data: 'price'},
                {data: 'total_ingridient'},
                {data: 'total_cost'},
                {data: 'total_profit'},
                {data: 'adjustment'},
                {
                    data: null,
                    sortable: false,
                    render: createActionBtn
                },
            ]
        })
    }
}

$(document).ready(() => app.start());