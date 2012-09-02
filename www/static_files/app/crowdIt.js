Ext.setup({
	tabletStartupScreen: 'tablet_startup.png',
	phoneStartupScreen: 'phone_startup.png',
	icon: 'icon.png',
	glossOnIcon: false,
	onReady: function () {

		var fbAccessToken = getCookie('fbAccessToken');
		var fsAccessToken = getCookie('fsAccessToken');
		var gpAccessToken = getCookie('gpAccessToken');

        var getStartedButton = createButton('Get Started', function() {
            window.location = 'http://johnnyecon.appspot.com/index.html?getStarted=true';
        }, 'back');
        getStartedButton.id = 'getStartedButton';

        var gpLogin = createButton('', function(){
			window.location = 'https://accounts.google.com/o/oauth2/auth?scope=http://maps.google.com/maps/feeds/&client_id={your_google_app_client_id}.apps.googleusercontent.com&response_type=token&redirect_uri=http://johnnyecon.appspot.com/index.html';
		}, 'round', 'gpBtn', Ext.is.Phone ? '' : 'margin: auto;');
        gpLogin.id = 'gpLogin';

        var fsLogin = createButton('', function(){
			window.location = 'https://foursquare.com/touch/login?continue=%2Foauth2%2Fauthenticate%3Fdisplay%3Dtouch%26client_id%3DWLE4S30UCYMWQNR4NUXFVWBIWXJ21KSE43FMOHMNVUA0USAC%26response_type%3Dtoken%26redirect_uri%3Dhttp%3A%2F%2Fjohnnyecon.appspot.com%2Findex.html&F3436579741913RVNPH=_';
		}, 'round', 'fsBtn', Ext.is.Phone ? '' : 'margin: auto;');
        fsLogin.id = 'fsLogin';

        var fbLogin = createButton('', function(){
			window.location = 'https://www.facebook.com/dialog/oauth/?scope=publish_checkins&client_id={your_facebook_app_client_id}&redirect_uri=http://johnnyecon.appspot.com/index.html&response_type=token';
		}, 'round', 'fbBtn', Ext.is.Phone ? '' : 'margin: auto;');
        fbLogin.id = 'fbLogin';

   
 
        var accountsText ="<div align='center'><p>With crowd-it you can view your favourite artists profiles and their upcoming concerts,</p>" +
            "<p>invite all your friends and have them verify their presence through QR codes.</p>" +
            "<p>For each friend who attends the event you earn points. The goal?</p>" +
            "<p>To be the top invitor of the city by earning the most points.</p>" +
            "<p>Of course, there is high competition! But crowd it gives you the option to</p>" +
            "<p>form your own strategy and knock-out other ambitious users!</p><br/>" +
            "<p>And if you are on a rush, buy some extra points from crowd it store</p>" +
            "<p>or borrow from your crowd it friends. Your award? Meet live your favourite artist!!!</p><br/>" +
            "<p>On the other hand, artists have the option to edit their profile,</p>" +
            "<p>set the point standard a user has to achieve in order to meet them </p>" +
            "<p>and connect directly with their fans as well as get more interactive!</p><br/>";

        function getDockedItems() {
            var dockedItems = [{
                xtype: 'toolbar',
                title: 'Crowd It',
                ui: 'dark',
                dock: 'top',
                items: getStartedButton
            }, {
                xtype: 'toolbar',
                ui: 'dark',
                dock: 'bottom',
                layout:{
                    pack: 'center'
                }
            }];
			return dockedItems;
		}

        new Ext.Panel({
            title: 'Accounts',
            scroll: true,
            fullscreen: true,
            dockedItems: getDockedItems(),
            items: [{
                cls: 'card card1',
                html: "<big>Welcome to Crowd It application!</big><br/>"
            }, (!fbAccessToken || !fsAccessToken || !gpAccessToken) ? {
                    html: "<p align='center'>Please login to the following services and read the instructions bellow..</p><br/>"
            } : {
                html: "<p>You have already logged in to all the available services.</p>"
            },
            fbAccessToken ? {
                cls: 'card card2',
                html: "You have succesfully logged in through Facebook"
            } : fbLogin,
            {html: "<br/>"},
            fsAccessToken ? {
                cls: 'card card2',
                html: "You have succesfully logged in through Foursquare"
            } : fsLogin, {html: "<br/>"},
            gpAccessToken ? {
                cls: 'card card2',
                html: "You have succesfully logged in through Google +"
            } : gpLogin, {html: "<br/>"}, {
            html: accountsText
            }]
        });

	}
});