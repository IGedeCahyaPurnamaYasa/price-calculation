

const app = {
    start(){
        $('#table').DataTable({})
    }
}

$(document).ready(() => app.start());