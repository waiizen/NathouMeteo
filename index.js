$(document).ready(function(){
    $('.valider').click(ville);


    $('input[name=choisirVille]').keyup(function(){
        if($('input[name=choisirVille]').val().length > 3){
            clear();
            var villeRecherche = format($('input[name=choisirVille]').val());
            $.get("city.list.json", function(data){
                for(i in data) if(data[i].name.includes(villeRecherche)) creation(data[i].id, data[i].country, data[i].name);
            });
        }
    })

    function clear(){
        $('.resultat').html('');
    }

    function creation(id, pays, ville){
        var resultat = '';
        resultat += '<div>' + '<p hidden>' + id + '</p>' + '<p>' + pays + ' ' + ville + '</p></div>';
        $('.resultat').append(resultat);
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