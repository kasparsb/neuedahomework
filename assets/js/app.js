requirejs.config({
    // Sadefinējam vendorus
    paths: {
        socketio: 'vendor/socket.io'
    },
    urlArgs: 'r=' + (new Date()).getTime(),
});

require(['socketio'], function(io){
	var socket = io('http://testevents.neueda.lv:80', {
        path: '/live'
    });
    socket.on('test', function(data) {
        
        console.log(data)
    });
});