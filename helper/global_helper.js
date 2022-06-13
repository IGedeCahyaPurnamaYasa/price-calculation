
module.exports.generate_code = (header) => {
    let new_date = new Date().toISOString().split('T');
    let time = new_date[1].replaceAll(':', '').replace('Z', '').replace('.', '');
    let date = new_date[0].replaceAll('-', '');
    date = date + time;

    return header + '-' + date;
}