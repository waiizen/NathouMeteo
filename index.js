$(document).ready(function(){

    // ##### VARIABLES GLOBALES #####

    var apiUrl = "http://api.openweathermap.org/data/2.5/weather?appid=" + config.MY_KEY;
    var liste = [];
    var villeMeteoID = '';
    var villeMeteo = '';
    var temperature, tempRessenti, tempMini, tempMax, ventVitesse, humidite = 0;
    var tempsTxt = '';

    var colorSoleil = 'linear-gradient(322deg, rgba(255,139,80,1) 0%, rgba(255,210,80,1) 100%)';
    var colorNuageux = 'linear-gradient(322deg, rgba(125,125,125,1) 0%, rgba(227,227,227,1) 80%)';
    var colorPluie = 'linear-gradient(322deg, rgba(125,125,125,1) 34%, rgba(38,78,119,1) 100%)';
    var colorSoleilNuageux = 'linear-gradient(322deg, rgba(125,125,125,1) 34%, rgba(255,244,160,1) 100%)';
    var colorOrage = 'linear-gradient(322deg, rgba(21,18,124,1) 0%, rgba(155,109,238,1) 100%)';

    var imgNeige = 'images/neige.png';
    var imgNuageux = 'images/nuageux.png';
    var imgOrage = 'images/orage.png';
    var imgPluie = 'images/pluie.png';
    var imgSoleil = 'images/soleil.png';
    var imgSoleilNuageux = 'images/soleil_nuageux.png';

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
        /*let resultat = '<p>' + villeMeteo + ' ' + villeMeteoID + '<br/>'
            + 'temperature ' + temperature + '<br/>'
            + 'tempRessenti ' +  tempRessenti + '<br/>'
            + 'tempMini ' +  tempMini + '<br/>'
            + 'tempMax ' +  tempMax + '<br/>'
            + 'ventVitesse ' +  ventVitesse + '<br/>'
            + 'humidite ' +  humidite + '<br/>'
            + 'tempsTxt ' +  tempsTxt + '</p>';

        $('.app').append(resultat);*/
        $('.chVille').html(villeMeteo);
        $('.chDesc').html(tempsTxt);
        $('.chTemp').html(temperature);
        $('.chRessenti').html(tempRessenti);
        $('.chVent').html(ventVitesse);
        $('.chHumidite').html(humidite);
        meteoDesc(tempsTxt);
    }

    function meteoDesc(meteoDescr){

        if(meteoDescr == 'ciel dégagé'){
            $('#meteo').css("background", colorSoleil);
            $('.iconeMeteo').attr("src", imgSoleil);
        } else if(meteoDescr == 'brume'){
            $('#meteo').css("background", colorPluie);
            $('.iconeMeteo').attr("src", imgPluie);
        } else if(meteoDescr == 'couvert'){
            $('#meteo').css("background", colorNuageux);
            $('.iconeMeteo').attr("src", imgNuageux);
        } else if(meteoDescr == 'peu nuageux'){
            $('#meteo').css("background", colorSoleilNuageux);
            $('.iconeMeteo').attr("src", imgSoleilNuageux);
        } else if(meteoDescr == 'partiellement nuageux'){
            $('#meteo').css("background", colorNuageux);
            $('.iconeMeteo').attr("src", imgNuageux);
        } else if(meteoDescr == 'légère pluie'){
            $('#meteo').css("background", colorPluie);
            $('.iconeMeteo').attr("src", imgPluie);
        } else if(meteoDescr == 'nuageux'){
            $('#meteo').css("background", colorNuageux);
            $('.iconeMeteo').attr("src", imgNuageux);
        } else if(meteoDescr == ''){

        } else if(meteoDescr == ''){

        }
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