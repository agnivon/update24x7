$(document).ready(function () {
    
    let $textarea = $('#chatbox');
    $('#newsCarousel .carousel-inner').children('.carousel-item').first().addClass('active');
    $('#newsCarousel .carousel-indicators').children('button').first().addClass('active');
    $('#messagebox').hide();

    navigator.geolocation.getCurrentPosition(function (position) {
        let lat = position.coords.latitude;
        let long = position.coords.longitude;
        console.log(lat, long);
        $.ajax({
            url: '/home/weather',
            method: 'GET',
            dataType: 'json',
            data: {
                lat,
                long
            }
        }).done((response) => {
            if (response.success) {
                const weatherData = response.data;
                // console.log(weatherData);
                const weather = weatherData.current.weather[0].main;
                const weatherIcon = weatherData.current.weather[0].icon;
                const weatherIconUrl = `https://openweathermap.org/img/w/${weatherIcon}.png`;
                const temperature = weatherData.current.temp + '&deg;C';
                const city = response.city;
                // console.log(weather, weatherIcon, temperature, city);
                const $weatherCardC = $('#weatherCardBody').children();
                $weatherCardC.eq(0).text(weather);
                $weatherCardC.eq(1).attr('src', weatherIconUrl);
                $weatherCardC.eq(2).html(temperature);
                $weatherCardC.eq(3).text(city);
                $('#weatherCardSpinner').hide(200);
                $('#weatherCard').show(200);

            }
        }).fail((err) => {
            console.log(err);
        });
    });

    function insertCbText(message) {
        $('#chatbox').val($('#chatbox').val() + message + '\n');
        $textarea.scrollTop($textarea[0].scrollHeight);
    }

    $("#username").keyup(function (event) {
        if (event.keyCode === 13) {
            $("#connectBtn").click();
        }
    });

    $('#connectBtn').click(function () {
        $('#connectBtn, #username').attr('disabled', true);
        let socket = io.connect();

        socket.on('connect', function () {
            socket.emit('registeruser', $('#username').val());
            $('#connectbox').hide();
            $('#messagebox').show();
        });

        $("#message").keyup(function (event) {
            if (event.keyCode === 13) {
                $("#messageBtn").click();
            }
        });

        $('#messageBtn').click(function () {
            socket.emit('chat', $('#message').val());
            $('#message').val('');
        });

        socket.on('newuser', (message) => {
            insertCbText(message);
        });

        socket.on('chat', (messageData) => {
            const username = messageData.username;
            const city = messageData.city;
            const message = messageData.message;
            const datetime = (new Date).toLocaleString();
            const formattedMessage = `(${datetime})|[${username}][${city}]: ${message}`;
            insertCbText(formattedMessage);
        });
    });
});
