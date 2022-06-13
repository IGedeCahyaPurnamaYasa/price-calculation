

const app = {
    start(){

        console.log($('#table'));
        $('#table').DataTable({
            responsive: true
        })
    }
}

$(document).ready(() => app.start());