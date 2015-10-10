function generate_chart_container(id) {
    var chart_container = document.createElement('div');
    chart_container.setAttribute('id', id);
    chart_container.setAttribute('class', 'row');
    document.getElementById('charts').appendChild(chart_container);
};

function generate_chart(chart_type, data, title, div, chart_container) {

    var s = ' \
            <div class="col-lg-3 col-sm-6"> \
            <div class="panel panel-default"> \
            <div class="panel-heading"> \
            <h2>' + title + '</h2> \
            </div> \
            <div class="panel-body"> \
            <div id="' + div + '" style="height: 250px;"></div> \
            </div> \
            </div> \
            </div>';

    var cc = document.getElementById(chart_container);

    if((chart_container == undefined) || (cc == null)) {
        var row = document.createElement('div');
        row.setAttribute('class', 'row');
        row.innerHTML = s;
        document.getElementById('charts').appendChild(row);
    } else {
        cc.innerHTML += s;
    }

    switch(chart_type) {
        case 0:
            new Morris.Bar({
                element: div,
                data: data,
                barColors: [
                    '#2577B5',
                    '#7CB47C'
                ],
                xkey: 'answer',
                ykeys: ['value'],
                labels: ['Value'],
                resize: false,
                hideHover: 'auto'
            });
            break;
        case 1:
            /* TODO:
               new Morris.Line({
               element: div,
               data: data,
               barColors: [
               '#2577B5',
               '#7CB47C'
               ],
               xkey: 'answer',
               ykeys: ['value'],
               labels: ['Value'],
               resize: false,
               hideHover: 'auto'
               });*/
        break;
        default:
        // TODO
    }

}
