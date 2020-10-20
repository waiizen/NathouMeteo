$(document).ready(function(){
    $('.valider').click(letsgo);

    function letsgo(){
        console.log("lets go");
        var url = "http://api.openweathermap.org/data/2.5/weather?appid=fed326473295f84475a8b0d43d324973&q=Nantes";

        fetch(url, {method: "GET"})
            .then(response => response.json())
            .then(DATAJSON => {
                console.log(DATAJSON);
                $('.corps').append($('<p></p>').text('coucou'));
            })
            .catch(error => alert("Erreur: " + error));
    }
});



