requirejs.config({
    // Sadefinējam vendorus
    paths: {
        socketio: 'vendor/socket.io',
        jquery:  'vendor/jquery',
        underscore:  'vendor/underscore',
        snapsvg: 'vendor/snap.svg',
        react: 'vendor/react'
    },
    urlArgs: 'r=' + (new Date()).getTime(),
});

define(function( require ){
    
    var React = require('react'),
        Dashboard = require('dashboard');

    React.render( 
        React.createElement( Dashboard, null ), 
        document.getElementsByTagName('body')[0]
    );
});