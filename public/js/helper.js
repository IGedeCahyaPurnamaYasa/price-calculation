var icon_number = function (data, type, row, meta) {
    return String(meta.row + meta.settings._iDisplayStart + 1);
}

var format_decimal = function (data, type, row, meta) {
    return String(data.toFixed(2))
}