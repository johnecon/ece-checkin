Ext.setup({
	tabletStartupScreen: 'tablet_startup.png',
	phoneStartupScreen: 'phone_startup.png',
	icon: 'icon.png',
	glossOnIcon: false,
	onReady: function () {

		var service = getUrlParameter('service');
		var lon = getUrlParameter('lon');
		var lat = getUrlParameter('lat');
        var fsId = getUrlParameter('fsId');
        var fsName = getDecodedUrlParameter('fsName');
        var fbId = getUrlParameter('fbId');
        var fbName = getDecodedUrlParameter('fbName');

		var dockedItems = [{
			xtype: 'toolbar',
			title: 'Check In',
			ui: 'dark',
			dock: 'top'
		}, {
			xtype: 'toolbar',
			ui: 'dark',
			dock: 'bottom'
		}];

		backToIndex = new Ext.Button({
			ui: 'round',
			text: 'Search For Places',
			cls: 'demobtn'
		});

		backToIndex.on('tap', function(){
			var redirect = 'http://johnnyecon.appspot.com/index.html';
			window.location = redirect;
		});

		var services = (service == 'Mixed' || service == 'Multi') ? 'Foursquare and Facebook' : service;
		var pnlToAdd = new Ext.Panel({
			html: 'Successfully Checked In <br /> Through ' + services + '!',
			cls: 'card card2'
		});

		new Ext.Panel({
			id: 'buttonsPanel',
			fullscreen: true,
			dockedItems: dockedItems,
			layout: {
				type: 'vbox',
				pack: 'center',
				align: 'stretch'
			},
			items: [pnlToAdd, backToIndex]
		});
	}
});