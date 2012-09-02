Ext.setup({
	tabletStartupScreen: 'tablet_startup.png',
	phoneStartupScreen: 'phone_startup.png',
	icon: 'icon.png',
	glossOnIcon: false,
	onReady: function () {

		var accessToken = getUrlParameter('access_token');
		var getStarted = getUrlParameter('getStarted');
		var gpCallback = Boolean(getUrlParameter('token_type'));
        var fbCallback = Boolean(getUrlParameter('expires_in') && !gpCallback);
        var fsCallback = Boolean(accessToken) && !fbCallback && !gpCallback;
		console.log(fbCallback);
		console.log(fsCallback);
		console.log(gpCallback);

        if (fsCallback) {
			setCookie('fsAccessToken', accessToken, 3600);
		}

		if (fbCallback) {
			setCookie('fbAccessToken', accessToken, 3600);
		}

		if (gpCallback) {
			setCookie('gpAccessToken', accessToken, 3600);
		}

		var fbAccessToken = getCookie('fbAccessToken');
		var fsAccessToken = getCookie('fsAccessToken');
		var gpAccessToken = getCookie('gpAccessToken');
        var redirect='NtuaEceCheckin://index.html?' + 'fbAccessToken=' + (fbAccessToken ? fbAccessToken : '') + '&fsAccessToken=' + (fsAccessToken ? fsAccessToken : '') + '&gpAccessToken=' + (gpAccessToken ? gpAccessToken : '')
        window.location=redirect;
    }
});