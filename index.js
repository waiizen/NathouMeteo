$(document).ready(function(){

    // ##### VARIABLES GLOBALES #####

    var apiUrl = "http://api.openweathermap.org/data/2.5/weather?appid=" + config.MY_KEY;
    var liste = [];
    var villeMeteoID = '';
    var villeMeteo = '';
    var temperature, tempRessenti, tempMini, tempMax, ventVitesse, humidite = 0;
    var tempsTxt = '';

    // ##### PARTIE METEO D'UNE VILLE #####

    function meteo(){
        let url = apiUrl + '&id=' + villeMeteoID + '&units=metric' + '&lang=fr';
        fetch(url, {method: "GET"})
            .then(response => response.json())
            .then(DATAJSON => {
                console.log(DATAJSON);
                temperature = DATAJSON.main.temp;
                tempRessenti = DATAJSON.main.feels_like;
                tempMini = DATAJSON.main.temp_min;
                tempMax = DATAJSON.main.temp_max;
                ventVitesse = DATAJSON.wind.speed;
                humidite = DATAJSON.main.humidity;
                tempsTxt = DATAJSON.weather[0].description;
                affichageApp();
            })
            .catch(error => alert("Erreur: " + error));
    }

    function affichageApp(){
        let resultat = '<p>' + villeMeteo + ' ' + villeMeteoID + '<br/>'
            + 'temperature ' + temperature + '<br/>'
            + 'tempRessenti ' +  tempRessenti + '<br/>'
            + 'tempMini ' +  tempMini + '<br/>'
            + 'tempMax ' +  tempMax + '<br/>'
            + 'ventVitesse ' +  ventVitesse + '<br/>'
            + 'humidite ' +  humidite + '<br/>'
            + 'tempsTxt ' +  tempsTxt + '</p>';

        $('.app').append(resultat);
    }

    // ##### PARTIE RECHERCHE D'UNE VILLE #####

    // clique sur un bouton
    $('.resultat').on('click', 'button', function(){
        let splt = this.id.split(";");
        villeMeteoID = splt[0];
        villeMeteo = splt[1];
        $('#modalVille').modal('hide');
        meteo();
    });

    // recherche de la ville a chaque lettre entrée
    $('input[name=choisirVille]').keyup(function(){
        delay(function(){
            if ($('input[name=choisirVille]').val().length > 3) {
                clear();
                let villeRecherche = format($('input[name=choisirVille]').val());
                $.get("city.list.json", function (data) {
                    for (i in data) if (data[i].name.includes(villeRecherche)) creation(data[i].id, data[i].country, data[i].name);
                    affichageVilles();
                });
            } else {
                clear();
            }
        }, 500);
    })

    // attendre que l'utilisateur n'ai pas entré de touche pendant Xms
    var delay = (function(){
        var timer = 0;
        return function(callback, ms){
            clearTimeout (timer);
            timer = setTimeout(callback, ms);
        };
    })();

    function clear(){
        liste = [];
        aSupprimer = [];
        $('.resultat').html('');
    }

    function tri(){
        liste.sort();
        for(var i = 1 ; i < liste.length ; i++){
            let splt = liste[i].split(";");
            let spltBefore = liste[i-1].split(";");
            if(splt[0] == spltBefore[0] && splt[1] == spltBefore[1]){
                liste.splice(i,1);
            }
        }
    }

    function affichageVilles(){
        tri();
        var resultat = '<table class="table table-striped table-bordered table-hover">';
        for(let i = 0 ; i < liste.length ; i++){
            resultat += '<tr class="trVille">';
            var splt = liste[i].split(";")
            resultat += '<td>' + splt[0] + '</td>';
            resultat += '<td>' + splt[1] + '</td>';
            resultat += '<td><button type="button" class="btn btn-info" id="' + splt[2] + ';' + splt[1] + '">Choisir</button></td>';
            resultat += '</tr>';
        }
        resultat += '</table>';
        $('.resultat').append(resultat);
    }

    function creation(id, pays, ville){
        let send = pays + ';' + ville + ';' + id
        liste.push(send);
    }

    function format(text){
        return text.charAt(0).toUpperCase() + text.slice(1);
    }
});