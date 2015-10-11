function generate_menu(surveys) {
    document.getElementById('surveys').remove();
    var surveys_ul = document.createElement('ul');
    surveys_ul.setAttribute('id', 'surveys');
    surveys_ul.setAttribute('class', 'sidebar-nav');
    document.getElementById('sidebar-wrapper').appendChild(surveys_ul);


    var sidebar_head = '<li class="sidebar-brand"> \
                       <h1>pirate survey</h1> \
                       </li> \
                       <li> \
                       <a href="/">Home</a> \
                       </li>';

    surveys_ul.innerHTML += sidebar_head;

    for(var i=0; i < surveys.length; i++) {
        var survey_li = document.createElement('li');
        survey_li.setAttribute('class', 'survey');
        survey_li.innerHTML = '<a href="' + surveys[i]['id'] + '">' + surveys[i]['name'] + '</a>';
        surveys_ul.appendChild(survey_li);
    };

    var impressum = '<li> \
                    <a href="//piratenfraktion-nrw.de/impressum"> \
                    Impressum</a> \
                    </li>';

    surveys_ul.innerHTML += impressum;
}
