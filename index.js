$(document).ready(function(){
    $('.valider').click(letsgo);

    function letsgo(){
        console.log("lets go");
        var url = "http://api.openweathermap.org/data/2.5/weather?q=Nantes&appid=" + config.MY_KEY;

        fetch(url, {method: "GET"})
            .then(response => response.json())
            .then(DATAJSON => {
                console.log(DATAJSON);
                $('.corps').append($('<p></p>').text('coucou'));
            })
            .catch(error => alert("Erreur: " + error));
    }
});



