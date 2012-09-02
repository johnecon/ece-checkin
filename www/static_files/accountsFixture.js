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
		}, 'round', 'gpBtn', Ext.is.Phone ? '' : 'margin-left: 40%;');
        gpLogin.id = 'gpLogin';

        var fsLogin = createButton('', function(){
			window.location = 'https://foursquare.com/oauth2/authenticate?client_id=WLE4S30UCYMWQNR4NUXFVWBIWXJ21KSE43FMOHMNVUA0USAC&response_type=token&redirect_uri=http://johnnyecon.appspot.com/index.html';
		}, 'round', 'fsBtn', Ext.is.Phone ? '' : 'margin-left: 40%;');
        fsLogin.id = 'fsLogin';

        var fbLogin = createButton('', function(){
			window.location = 'https://www.facebook.com/dialog/oauth/?scope=publish_checkins&client_id={your_facebook_app_client_id}&redirect_uri=http://johnnyecon.appspot.com/index.html&response_type=token';
		}, 'round', 'fbBtn', Ext.is.Phone ? '' : 'margin-left: 40%;');
        fbLogin.id = 'fbLogin';

        var accountsText ="<div align='center'><p>You can use this software to checkin through Facebook, Foursquare and Google plus.</p><br/>" +
            "<p>Once you get authorised through a service, we fetch nearby places from it.</p>" +
//            ((!Ext.is.Phone) ? "<p>You can simply <a href='#' onMouseOver=" + '"showPicture' + "('toogleImage',1)" + '"' + 'onMouseOut="showPicture' + "('toogleImage',0)" + '"' + ">click<div id=" + '"toogleImage"' + "><img src='http://johnnyecon.appspot.com/resources/img/simpleCheckin.png'/></div></a> to a place  of a service and proceed to the checkin process,</p><br/>" :
            "<p>You can simply click to a place  of a service and proceed to the checkin process,</p>" +
            "<p>by pressing this button: <img src='http://johnnyecon.appspot.com/resources/img/simpleCheckin.png' align='middle'/>, which is next to the place.</p><br/>" +
            "<p>Once you get authorised to more than one service,</p>" +
            "<p>we fetch nearby places from each service separately.</p>" +
            "<p>In this case we allow the use of 'Multiple Checkin' functionality</p>" +
            "<p> and we also display the 'Common Places' tab.</p>" +
            "<p>You can simply select places from different services</p>" +
            "<p>and press the 'Multiple Checkin' button: <img src='http://johnnyecon.appspot.com/resources/img/multipleCheckin.png' align='middle'/>, at the top right navigation bar</p><br/>" +
            "<p>If you do so, we will first ask you to help the community by validating</p>" +
            "<p>that the places you are about to checkin, are actually the same place.</p>" +
            "<p>Pay attention, you are not obligated to help us, in means that you should help only if you wish to do so.</p>" +
            "<p>Either pressing 'Yes' or 'No' you then continue with the 'Multiple Checkin' process.</p><br/>" +
            "<p>In the 'Common Places' tab we display the common places from the services you have got authorised.</p>" +
            "<p>You can pick the services you want to be mixed by selecting them at the top of the tab from the buttons group:</p><p><img src='http://johnnyecon.appspot.com/resources/img/buttonsGroup.png' align='middle'/></p><br/>" +
            "<p>We also display the community validated places, if any, with the number of 'votes' on their right:</p>" +
            "<p><img src='http://johnnyecon.appspot.com/resources/img/communityValidatedPlace.png'/></p><br/>" +
            "<p>Each time a user validates the similarity of some places with the 'Multiple Checkin' functionality,</p>" +
            "<p> this similarity gets a vote. You can choose a place from the 'Common Places' tab, in order to </p>" +
            "<p>checkin to this place through the services you have selected from the buttons group.</p><br/>" +
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
//        var oTestCase = new YAHOO.tool.TestCase({
//
//        name: "TestCase Name",
//
//        //---------------------------------------------
//        // Setup and tear down
//        //---------------------------------------------
//
//        setUp : function () {
//            this.data = { name : "Nicholas", age : 28 };
//        },
//
//        tearDown : function () {
//            delete this.data;
//        },
//
//        //---------------------------------------------
//        // Tests
//        //---------------------------------------------
//
//        testName: function () {
//            YAHOO.util.Assert.areEqual("Nichosasdlas", this.data.name, "Name should be 'Nicholas'");
//        },
//
//        testAge: function () {
//            YAHOO.util.Assert.areEqual(28, this.data.age, "Age should be 28");
//        }
//    });
//    console.log('strange');
//    YAHOO.tool.TestRunner.add(oTestCase);
//    var oLogger = new YAHOO.tool.TestLogger();
//    YAHOO.tool.TestRunner.run();
        jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
        jasmine.getEnv().execute();
    }
});