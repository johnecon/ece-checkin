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
			window.location = 'https://foursquare.com/touch/login?continue=%2Foauth2%2Fauthenticate%3Fdisplay%3Dtouch%26client_id%{your_foursquare_app_client_id}%26response_type%3Dtoken%26redirect_uri%3Dhttp%3A%2F%2Fjohnnyecon.appspot.com%2Findex.html&F3436579741913RVNPH=_';
		}, 'round', 'fsBtn', Ext.is.Phone ? '' : 'margin: auto;');
        fsLogin.id = 'fsLogin';

        var fbLogin = createButton('', function(){
			window.location = 'https://www.facebook.com/dialog/oauth/?scope=publish_checkins&client_id={your_facebook_app_client_id}&redirect_uri=http://johnnyecon.appspot.com/index.html&response_type=token';
		}, 'round', 'fbBtn', Ext.is.Phone ? '' : 'margin: auto;');
        fbLogin.id = 'fbLogin';

        var accountsText ="<div align='center'><p>You can use this software to checkin through Facebook, Foursquare and Google plus.</p><br/>" +
            "<p>Once you get authorised through a service, we fetch nearby places from it.</p>" +
            "<p>You can simply click to a place  of a service and proceed to the checkin process,</p>" +
            "<p>by pressing this button: <img src='http://johnnyecon.appspot.com/resources/img/simpleCheckin.png' align='middle'/>, which is next to the place.</p><br/>" +
            "<p>At the top right navigation bar, you can find the 'More' button <img src='http://johnnyecon.appspot.com/resources/img/moreButton.png' align='middle'/></p>" +
            "<p>When you click it, more options will appear:</p><br/>" +
            "<p> <img src='http://johnnyecon.appspot.com/resources/img/moreOptions.png' align='middle'/></p><br/><br/>" +
            "<p>Once you get authorised to more than one service,</p>" +
            "<p>we fetch nearby places from each service separately.</p>" +
            "<p>In this case we allow the use of 'Multiple Checkin' functionality,</p>" +
            "<p> the use of 'Common Places Validate' functionality</p>" +
            "<p> and we also display the 'Common Places' tab.</p>" +
            "<p>You can simply select places from different services</p>" +
            "<p>and press the 'Multiple Checkin' option or the 'Common Places Validate' option</p>" +
            "<p>You should help the community only if you wish to do so.</p><br/>" +
            "<p>In the 'Common Places' tab we display the common places from the services you have got authorised.</p>" +
            "<p>You can pick the services you want to be mixed by selecting them at the top of the tab from the buttons group:</p><p><img src='http://johnnyecon.appspot.com/resources/img/buttonsGroup.png' align='middle'/></p><br/>" +
            "<p>We also display the community validated places, if any, with the number of 'votes' on their right:</p>" +
            "<p><img src='http://johnnyecon.appspot.com/resources/img/communityValidatedPlace.png' align='middle'/> -- 2 votes</p><br/>" +
            "<p>Each time a user validates the similarity of some places with the 'Common Places Validate' functionality,</p>" +
            "<p> this similarity gets a vote. You can choose a place from the 'Common Places' tab, in order to </p>" +
            "<p>checkin to this place through the services you have selected from the buttons group.</p>" +
            "<p>You can also tag your facebook friends if you are about to checkin using facebook.</p><br/>" +
            "<p>Your checkins will be posted to all services from which you selected the places, except Google plus.</p><br/><br/><br/>" +
            "<p><small>**The mixing algorithm is based on the naming of the places and their geolocation**</small></p><br/>" +
            "<p><small>**This software is developped for educational purposes**</small></p><br/><br/></div>";

        function getDockedItems() {
            var dockedItems = [{
                xtype: 'toolbar',
                title: 'Check In',
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
                html: "<big>Welcome to Checkin application!</big><br/>"
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