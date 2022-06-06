

const app = {
    start(){
        $('#table_order').DataTable({
            responsive: true
        })
    }
}

$(document).ready(() => app.start());