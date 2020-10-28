$(document).ready(function(){

    var liste = [];

    $('input[name=choisirVille]').keyup(function(){
        if($('input[name=choisirVille]').val().length > 3){
            clear();
            var villeRecherche = format($('input[name=choisirVille]').val());
            $.get("city.list.json", function(data){
                for(i in data) if(data[i].name.includes(villeRecherche)) creation(data[i].id, data[i].country, data[i].name);
                affichage();
            });
        }
    })

    function clear(){
        liste = [];
        aSupprimer = [];
        $('.resultat').html('');
    }

    function tri(){
        liste.sort();
        for(var i = 1 ; i < liste.length ; i++){
            var splt = liste[i].split(";");
            var spltBefore = liste[i-1].split(";");
            if(splt[0] == spltBefore[0] && splt[1] == spltBefore[1]){
                liste.splice(i,1);
            }
        }
    }

    function affichage(){
        tri();
        var resultat = '<table class="table table-striped table-bordered table-hover">';
        for(var i = 0 ; i < liste.length ; i++){
            resultat += '<tr class="trVille">';
            var splt = liste[i].split(";")
            resultat += '<td>' + splt[0] + '</td>';
            resultat += '<td>' + splt[1] + '</td>';
            resultat += '<td style="display:none;" class="codeVille">' + splt[2] + '</td>';
            resultat += '<td><button type="button" class="btn btn-primary">Primary</button></td>';
            resultat += '</tr>';
        }
        resultat += '</table>';
        $('.resultat').append(resultat);
    }

    function creation(id, pays, ville){
        var send = pays + ';' + ville + ';' + id
        liste.push(send);
    }

    function format(text){
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    function ville(){
        var villeRecherche = $('input[name=choisirVille]').val();
        $.get("city.list.json", function(data){
            console.log('commence');
            for(i in data){
                if(data[i].name.includes(villeRecherche)){
                    console.log(data[i].name, data[i].country);
                }
            }
            console.log('fini');
        });
    }

    function letsgo(){
        console.log("lets go");
        var url = "http://api.openweathermap.org/data/2.5/weather?appid=" + config.MY_KEY;

        url += '&zip=';
        url += $('input[name=choisirVille]').val();

        fetch(url, {method: "GET"})
            .then(response => response.json())
            .then(DATAJSON => {
                console.log(DATAJSON);
                console.log('----');
                for(i in DATAJSON){
                    console.log(DATAJSON.name);
                }

            })
            .catch(error => alert("Erreur: " + error));
    }
});