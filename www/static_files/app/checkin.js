Ext.setup({
	tabletStartupScreen: 'tablet_startup.png',
	phoneStartupScreen: 'phone_startup.png',
	icon: 'icon.png',
	glossOnIcon: false,
	onReady: function () {

		function shouldDisplayProperty(place, property) {
			return (place[property] && place[property] != 'undefined' && property != 'id' && property != 'fbId' && property != 'fsId' && property != 'gpId' && property != 'reference' && property != 'fbLat' && property != 'fbLon' && property != 'fsLat' && property != 'fsLon' && property != 'gpLat' && property != 'gpLon' && property != 'lat' && property != 'lon');
		}

		var fsAccessToken = getUrlParameter('fsAccessToken');
		var fbAccessToken = getUrlParameter('fbAccessToken');
		var service = getUrlParameter('service');
		var iconUrl = getUrlParameter('iconUrl');
		var curLat = getUrlParameter('curLat');
		var curLon = getUrlParameter('curLon');
		var backBtnHandler = function(button, event) {
			window.location = 'http://johnnyecon.appspot.com/index.html';
		};

		var backBtn = [{
			text: 'Back',
			ui: 'back',
			handler: backBtnHandler
		}];

		var place = new Object();
		place.fsName = getDecodedUrlParameter("fsName");
		place.fbName = getDecodedUrlParameter("fbName");
		place.gpName = getDecodedUrlParameter("gpName");
		place.fsId = getUrlParameter("fsId");
		place.fbId = getUrlParameter("fbId");
		place.gpId = getUrlParameter("gpId");

		place.name = getDecodedUrlParameter("name");
		place.reference = getUrlParameter("gpReference");
		place.lat = getUrlParameter("lat");
		place.lon = getUrlParameter("lon");
		place.fbLon = getUrlParameter("fbLon");
		place.fsLon = getUrlParameter("fsLon");
		place.gpLon = getUrlParameter("gpLon");
		place.fbLat = getUrlParameter("fbLat");
		place.fsLat = getUrlParameter("fsLat");
		place.gpLat = getUrlParameter("gpLat");
		place.distance = getUrlParameter("distance");
		place.address = getDecodedUrlParameter("address");
		place.category = getDecodedUrlParameter("category");
		place.id = getUrlParameter("id");
		console.log(service);

		var checkin = createButton('Check In', function(){
			function sendData(btn){
				if (btn == 'yes') {
					if ((service == 'MixedFbFs') || (service == 'MixedFbFsGp') || (service == 'MultiFbFs') || (service == 'MultiFbFsGp')) {
						var form = document.createElement("form");
						form.action = "https://api.foursquare.com/v2/checkins/add";
						form.method = "POST";
						form.id = 'infoFormA';
						var input = document.createElement("input");
						input.type = "hidden";
						input.name = "venueId";
						input.value = place.fsId;
						form.appendChild(input);
						var input = document.createElement("input");
						input.type = "hidden";
						input.name = "oauth_token";
						input.value = fsAccessToken;
						form.appendChild(input);
						var input = document.createElement("input");
						input.type = "hidden";
						input.name = "v";
						input.value = '20111218';
						form.appendChild(input);
						formSubmitWithoutRedirect(form);
						Ext.util.JSONP.request({
							url: 'https://graph.facebook.com/me',
							callbackKey: 'callback',
							params: {
								access_token: fbAccessToken
							},
							callback: function(result) {
								var profileId = result.id;
								var form = document.createElement("form");
								form.action = 'https://graph.facebook.com/' + profileId + '/checkins';
								form.method = "POST";
								form.id = 'infoForm';
								var input = document.createElement("input");
								input.type = "hidden";
								input.name = "place";
								input.value = place.fbId;
								form.appendChild(input);
//								var input = document.createElement("input");
//								input.type = "hidden";
//								input.name = "message";
//								input.value = '@ ' + place.fbName;
//								form.appendChild(input);
								var input = document.createElement("input");
								input.type = "hidden";
								input.name = "coordinates";
								input.value = '{"latitude":"' + place.fbLat + '","longitude":"' + place.fbLon + '"}';
								form.appendChild(input);
                                if (taggedUsers.length > 0) {
									var input = document.createElement("input");
                                    input.type = "hidden";
                                    input.name = "tags";
                                    input.value = taggedUsers;
                                    form.appendChild(input);
                                }
								var input = document.createElement("input");
								input.type = "hidden";
								input.name = "access_token";
								input.value = fbAccessToken;
								form.appendChild(input);
								if ((service == 'MixedFbFsGp') || (service == 'MultiFbFsGp')) {
									Ext.util.JSONP.request({
										url: 'http://johnnyecon.appspot.com/db/',
										callbackKey: 'callback',
										params: {
											service: service,
											transaction: 'postGpCheckin',
											reference: place.reference
										},
										callback: function(result) {
											if (result.status == 'OK') {
												Ext.util.JSONP.request({
													url: 'http://johnnyecon.appspot.com/db/',
													callbackKey: 'callback',
													params: {
														service: service,
														transaction: 'write',
														fbId: place.fbId,
														fbName: place.fbName,
														fbLat: place.fbLat,
														fbLon: place.fbLon,
														fsId: place.fsId,
														fsName: place.fsName,
														fsLat: place.fsLat,
														fsLon: place.fsLon,
														gpId: place.gpId,
														gpName: place.gpName,
														gpLat: place.gpLat,
														gpLon: place.gpLon
													},
													callback: function(result) {
														formSubmit(form);
													}
												});
											} else {
												console.log('google error');
												console.log(result);
											}
										}
									});
								} else {
									Ext.util.JSONP.request({
										url: 'http://johnnyecon.appspot.com/db/',
										callbackKey: 'callback',
										params: {
											service: service,
											transaction: 'write',
											fsId: place.fsId,
											fsName: place.fsName,
											fsLat: place.fsLat,
											fsLon: place.fsLon,
											fbId: place.fbId,
											fbName: place.fbName,
											fbLat: place.fbLat,
											fbLon: place.fbLon
										},
										callback: function(result) {
											formSubmit(form);
										}
									});
								}
								/**
								* Credits to http://zacvineyard.com/blog/2011/06/19/post-data-to-a-remote-server-cross-domain-with-jquery-in-phonegap/
								*/
								}
							});

					} else if ((service == 'MixedFbGp') || (service == 'MultiFbGp')) {
						Ext.util.JSONP.request({
							url: 'http://johnnyecon.appspot.com/db/',
							callbackKey: 'callback',
							params: {
								service: service,
								transaction: 'postGpCheckin',
								reference: place.reference
							},
							callback: function(result) {
								if (result.status == 'OK') {
									Ext.util.JSONP.request({
										url: 'http://johnnyecon.appspot.com/db/',
										callbackKey: 'callback',
										params: {
											service: service,
											transaction: 'write',
											fbId: place.fbId,
											fbName: place.fbName,
											fbLat: place.fbLat,
											fbLon: place.fbLon,
											gpId: place.gpId,
											gpName: place.gpName,
											gpLat: place.gpLat,
											gpLon: place.gpLon
										},
										callback: function(result) {
											Ext.util.JSONP.request({
												url: 'https://graph.facebook.com/me',
												callbackKey: 'callback',
												params: {
													access_token: fbAccessToken
												},
												callback: function(result) {
													var profileId = result.id;
													var form = document.createElement("form");
													form.action = 'https://graph.facebook.com/' + profileId + '/checkins';
													form.method = "POST";
													form.id = 'infoForm';
													var place = document.createElement("input");
													place.type = "hidden";
													place.name = "place";
													place.value = place.fbId;
													form.appendChild(place);
//													var input = document.createElement("input");
//													input.type = "hidden";
//													input.name = "message";
//													input.value = '@ ' + place.fbName;
//													form.appendChild(input);
													var coordinates = document.createElement("input");
													coordinates.type = "hidden";
													coordinates.name = "coordinates";
													coordinates.value = '{"latitude":"' + place.fbLat + '","longitude":"' + place.fbLon + '"}';
													form.appendChild(coordinates);
                                                    if (taggedUsers.length > 0) {
                                                        var tags = document.createElement("input");
                                                        tags.type = "hidden";
                                                        tags.name = "tags";
                                                        tags.value = taggedUsers;
                                                        form.appendChild(tags);
                                                    }
													var access_token = document.createElement("input");
													access_token.type = "hidden";
													access_token.name = "access_token";
													access_token.value = fbAccessToken;
													form.appendChild(access_token);
													formSubmit(form);
												}
											});
										}
									});
								} else {
									console.log('google error');
								}
							}
						});
					} else if ((service == 'MixedFsGp') || (service == 'MultiFsGp')) {
						var form = document.createElement("form");
						form.action = "https://api.foursquare.com/v2/checkins/add";
						form.method = "POST";
						form.id = 'infoFormA';
						var venueId = document.createElement("input");
						venueId.type = "hidden";
						venueId.name = "venueId";
						venueId.value = place.fsId;
						form.appendChild(venueId);
						var oauth_token = document.createElement("input");
						oauth_token.type = "hidden";
						oauth_token.name = "oauth_token";
						oauth_token.value = fsAccessToken;
						form.appendChild(oauth_token);
						var v = document.createElement("input");
						v.type = "hidden";
						v.name = "v";
						v.value = '20111218';
						form.appendChild(v);
						formSubmitWithoutRedirect(form);
						Ext.util.JSONP.request({
							url: 'http://johnnyecon.appspot.com/db/',
							callbackKey: 'callback',
							params: {
								service: service,
								transaction: 'postGpCheckin',
								reference: place.reference
							},
							callback: function(result) {
								if (result.status == 'OK') {
									Ext.util.JSONP.request({
										url: 'http://johnnyecon.appspot.com/db/',
										callbackKey: 'callback',
										params: {
											service: service,
											transaction: 'write',
											fsId: place.fsId,
											fsName: place.fsName,
											fsLat: place.fsLat,
											fsLon: place.fsLon,
											gpId: place.gpId,
											gpName: place.gpName,
											gpLat: place.gpLat,
											gpLon: place.gpLon
										},
										callback: function(result) {
											myHandler = new Event();
											myHandler.addHandler(redirect);
											myHandler.execute();
										}
									});
								} else {
									console.log('google error');
								}
							}
						});
					} else if (service == 'Foursquare') {
						var form = document.createElement("form");
						form.action = "https://api.foursquare.com/v2/checkins/add";
						form.method = "POST";
						form.id = 'infoForm';
						var input = document.createElement("input");
						input.type = "hidden";
						input.name = "venueId";
						input.value = place.id;
						form.appendChild(input);
						var input = document.createElement("input");
						input.type = "hidden";
						input.name = "oauth_token";
						input.value = fsAccessToken;
						form.appendChild(input);
						var input = document.createElement("input");
						input.type = "hidden";
						input.name = "v";
						input.value = '20111218';
						form.appendChild(input);
						Ext.util.JSONP.request({
							url: 'http://johnnyecon.appspot.com/db/',
							callbackKey: 'callback',
							params: {
								service: service,
								transaction: 'write',
								fsId: place.id,
								fsName: place.fsName,
								fsLat: place.lat,
								fsLon: place.lon,
								fbId: place.id,
								fbName: place.fbName,
								fbLat: place.lat,
								fbLon: place.lon
							},
							callback: function() {
								formSubmit(form);
							}
						});
					} else  if (service == 'Facebook') {
						Ext.util.JSONP.request({
							url: 'https://graph.facebook.com/me',
							callbackKey: 'callback',
							params: {
								access_token: fbAccessToken
							},
							callback: function(result) {
								var profileId = result.id;
								var form = document.createElement("form");
								form.action = 'https://graph.facebook.com/' + profileId + '/checkins';
								form.method = "POST";
								form.id = 'infoForm';
								var input = document.createElement("input");
								input.type = "hidden";
								input.name = "place";
								input.value = place.id;
								form.appendChild(input);
								var input = document.createElement("input");
								input.type = "hidden";
								input.name = "coordinates";
								input.value = '{"latitude":"' + place.lat + '","longitude":"' + place.lon + '"}';
								form.appendChild(input);
								if (taggedUsers.length > 0) {
									var input = document.createElement("input");
                                    input.type = "hidden";
                                    input.name = "tags";
                                    input.value = taggedUsers;
                                    form.appendChild(input);
                                }
								var input = document.createElement("input");
								input.type = "hidden";
								input.name = "access_token";
								input.value = fbAccessToken;
								form.appendChild(input);
								Ext.util.JSONP.request({
									url: 'http://johnnyecon.appspot.com/db/',
									callbackKey: 'callback',
									params: {
										service: service,
										transaction: 'write',
										fsId: place.id,
										fsName: place.fsName,
										fsLat: place.lat,
										fsLon: place.lon,
										fbId: place.id,
										fbName: place.fbName,
										fbLat: place.lat,
										fbLon: place.lon
									},
									callback: function() {
										formSubmit(form);
									}
								});
								/**
								* Credits to http://zacvineyard.com/blog/2011/06/19/post-data-to-a-remote-server-cross-domain-with-jquery-in-phonegap/
								*/
							}
						});
					} else  if (service == 'GoogleP') {
						Ext.util.JSONP.request({
							url: 'http://johnnyecon.appspot.com/db/',
							callbackKey: 'callback',
							params: {
								service: service,
								transaction: 'postGpCheckin',
								reference: place.reference
							},
							callback: function(result) {
								if (result.status == 'OK') {
									Ext.util.JSONP.request({
										url: 'http://johnnyecon.appspot.com/db/',
										callbackKey: 'callback',
										params: {
											service: service,
											transaction: 'write',
											gpId: place.id,
											gpName: place.gpName,
											gpLat: place.lat,
											gpLon: place.lon
										},
										callback: function() {
											myHandler = new Event();
											myHandler.addHandler(redirect);
											myHandler.execute();
										}
									});
								} else {
									console.log('google error');
								}
							}
						});
					}
				}
			}
			for (i=0; i<fbSelectedFriends.length; i++) {

			}
			var name = (place.fbName) ? place.fbName + ' through Facebook' : '';
			name = place.fsName ? name + (place.fbName ? ' and ' : '') + place.fsName + ' through Foursquare' : name;
			name = (place.gpName) ? name + ((place.fsName || place.fbName) ? ' and ' : '') + place.gpName + ' through Google +' : name;
            var taggedUsers = [];
            var tags = '';
            for (i=0; i<fbSelectedFriends.length; i++) {
                taggedUsers.push(fbSelectedFriends[i].data.id);
                tags += fbSelectedFriends[i].data.name;
                ((i<fbSelectedFriends.length - 2) ? tags += ', ' : ((i==fbSelectedFriends.length-2) ? tags += ' and ' : ''));
            }
            tags = tags ? ' tagging ' + tags : '';
            Ext.Msg.confirm("Confirmation", 'Are you sure you want to check in to ' + name + tags + ' using this app?', sendData);

		}, 'confirm-round', null, null);

		function Event(){
			this.eventHandlers = new Array();
		}

		Event.prototype.addHandler = function(eventHandler){
			this.eventHandlers.push(eventHandler);
		};

		Event.prototype.execute = function(args){

			for(var i = 0; i < this.eventHandlers.length; i++){
				this.eventHandlers[i](args);
			}
		};

		function redirect(){
			if ((service == 'Mixed') || (service == 'Multi')) {
				window.location = 'http://johnnyecon.appspot.com/checkinSuccess.html?service=' + service + '&lat=' + place.lat+ '&lon=' + place.lon + '&fbName=' + place.fbName + '&fbId='+ place.fbId + '&fsName=' + place.fsName + '&fsId='+ place.fsId;
			} else {
				window.location = 'http://johnnyecon.appspot.com/checkinSuccess.html?service=' + service + '&lat=' + place.lat+ '&lon=' + place.lon + '&fbName=' + place.fbName + '&fbId='+ place.id + '&fsName=' + place.fsName + '&fsId='+ place.id;
			}
		}

		function formSubmit(form, reference) {
			document.body.appendChild(form);
			var d = document.createElement("div");
			d.innerHTML = '{ "reference" : ' + reference + ' } ';
			document.body.appendChild(d);
			$("<iframe id='test' />").appendTo(document.body);
			$("#infoForm").attr("target", "test");
			myHandler = new Event();
			myHandler.addHandler(redirect);
			myHandler.execute();
			form.submit();
		}

		function formSubmitWithoutRedirect(form) {
			document.body.appendChild(form);
			$("<iframe id='test' />").appendTo(document.body);
			$("#infoFormA").attr("target", "test");
			form.submit();
		}

		var dockedItems = [{
			xtype: 'toolbar',
			title: 'Check In',
			ui: 'dark',
			dock: 'top',
			items: [backBtn, {xtype: 'spacer'}, checkin]
		}];

		if ((service == 'MixedFbGp') || (service == 'MultiFbGp')) {
			mapsLat = place.fbLat;
			mapsLon = place.fbLon;
			contentText = 'Facebook: ' + place.fbName;
			titleName = 'Facebook';
		} else if ((service == 'MixedFsGp') || (service == 'MultiFsGp')) {
			mapsLat = place.fsLat;
			mapsLon = place.fsLon;
			contentText = 'Foursquare: ' + place.fsName;
			titleName = 'Foursquare';
		} else if ((service == 'MixedFbFs') || (service == 'MultiFbFs')) {
			mapsLat = place.fbLat;
			mapsLon = place.fbLon;
			contentText = 'Facebook: ' + place.fbName;
			titleName = 'Facebook';
		} else if ((service == 'MixedFbFsGp') || (service == 'MultiFbFsGp')) {
			mapsLat = place.fbLat;
			mapsLon = place.fbLon;
			contentText = 'Facebook: ' + place.fbName;
			titleName = 'Facebook';
		} else {
			mapsLat = place.lat;
			mapsLon = place.lon;
			contentText = ((service == 'GoogleP') ? 'Google: ' : service + ': ') + place.gpName;
			titleName = (service == 'GoogleP') ? 'Google +' : service;
		}

		var position = new google.maps.LatLng(mapsLat, mapsLon),  //Sencha HQ

			infowindow = new google.maps.InfoWindow({
				content: contentText
			}),

			trackingButton = Ext.create({
				xtype   : 'button',
				iconMask: true,
				iconCls : 'locate'
			} ),

			toolbar = new Ext.Toolbar({
				dock: 'top',
				xtype: 'toolbar',
				ui : 'light',
				defaults: {
					iconMask: true
				},
				items : [
				{
					position : position,
					iconCls  : 'home',
					handler : function(){
					//disable tracking
						trackingButton.ownerCt.setActive(trackingButton, false);
						mapdemo.map.panTo(this.position);
					}
				},{
				xtype : 'segmentedbutton',
				allowMultiple : true,
				listeners : {
					toggle : function(buttons, button, active){
						if(button.iconCls == 'maps' ){
							mapdemo.traffic[active ? 'show' : 'hide']();
						}else if(button.iconCls == 'locate'){
							mapdemo.geo[active ? 'resumeUpdates' : 'suspendUpdates']();
						}
					}
				},
				items : [
					trackingButton,
						{
							iconMask: true,
							iconCls: 'maps'
						}
					]
				}]
			});
		map = new Ext.Map({
			title: 'Map',
			iconCls: 'mapsTab',
			width: 300,
			height: 300,
			mapOptions : {
				center : new google.maps.LatLng(mapsLat, mapsLon),
				zoom : 16,
				mapTypeId : google.maps.MapTypeId.ROADMAP,
				navigationControl: true,
				navigationControlOptions: {
						style: google.maps.NavigationControlStyle.DEFAULT
					}
			},

			listeners : {
				maprender : function(comp, map){
					var marker = new google.maps.Marker({
									position: position,
									title : titleName,
									map: map
								});

					var curPosition = new google.maps.LatLng(curLat, curLon),
							curInfowindow = new google.maps.InfoWindow({
								content: 'You Are Here!'
							});

					var curMarker = new google.maps.Marker({
						position: curPosition,
						title : 'Current Location',
						map: map
					});
					curMarker.setIcon('http://johnnyecon.appspot.com/resources/img/currentLocation.png');

					if ((service == 'MixedFsGp') || (service == 'MultiFsGp') || (service == 'MixedFbGp') || (service == 'MultiFbGp')) {
						var secPosition = new google.maps.LatLng(place.gpLat, place.gpLon),
							secInfowindow = new google.maps.InfoWindow({
							content: 'Google: ' + place.gpName
						});

						google.maps.event.addListener(marker, 'click', function() {
							infowindow.open(map, marker);
							secInfowindow.close(map, secMarker);
							curInfowindow.close(map, curMarker);
						});

						var secMarker = new google.maps.Marker({
							position: secPosition,
							title : 'Google +',
							map: map
						});


						google.maps.event.addListener(secMarker, 'click', function() {
							infowindow.close(map, marker);
							secInfowindow.open(map, secMarker);
							curInfowindow.close(map, curMarker);
						});

						google.maps.event.addListener(curMarker, 'click', function() {
							curInfowindow.open(map, curMarker);
							infowindow.close(map, marker);
							secInfowindow.close(map, secMarker);
						});
					} else if ((service == 'MixedFbFs') || (service == 'MultiFbFs')) {
						var secPosition = new google.maps.LatLng(place.fsLat, place.fsLon),
							secInfowindow = new google.maps.InfoWindow({
							content: 'Foursquare: ' + place.fsName
						});

						google.maps.event.addListener(marker, 'click', function() {
							infowindow.open(map, marker);
							secInfowindow.close(map, secMarker);
							curInfowindow.close(map, curMarker);
						});

						var secMarker = new google.maps.Marker({
							position: secPosition,
							title : 'Foursquare',
							map: map
						});


						google.maps.event.addListener(secMarker, 'click', function() {
							infowindow.close(map, marker);
							secInfowindow.open(map, secMarker);
							curInfowindow.close(map, curMarker);
						});

						google.maps.event.addListener(curMarker, 'click', function() {
							curInfowindow.open(map, curMarker);
							infowindow.close(map, marker);
							secInfowindow.close(map, secMarker);
						});
					} else if ((service == 'MixedFbFsGp') || (service == 'MultiFbFsGp')) {
						var secPosition = new google.maps.LatLng(place.fsLat, place.fsLon),
							secInfowindow = new google.maps.InfoWindow({
								content: 'Foursquare: ' + place.fsName
							});

						var secMarker = new google.maps.Marker({
							position: secPosition,
							title : 'Foursquare +',
							map: map
						});

						var thirdPosition = new google.maps.LatLng(place.gpLat, place.gpLon),
							thirdInfowindow = new google.maps.InfoWindow({
								content: 'Google: ' + place.gpName
							});

						var thirdMarker = new google.maps.Marker({
							position: thirdPosition,
							title : 'Google +',
							map: map
						});

						google.maps.event.addListener(marker, 'click', function() {
							infowindow.open(map, marker);
							secInfowindow.close(map, secMarker);
							thirdInfowindow.close(map, thirdMarker);
							curInfowindow.close(map, curMarker);
						});

						google.maps.event.addListener(secMarker, 'click', function() {
							infowindow.close(map, marker);
							secInfowindow.open(map, secMarker);
							thirdInfowindow.close(map, thirdMarker);
							curInfowindow.close(map, curMarker);
						});

						google.maps.event.addListener(thirdMarker, 'click', function() {
							infowindow.close(map, marker);
							secInfowindow.close(map, secMarker);
							thirdInfowindow.open(map, thirdMarker);
							curInfowindow.close(map, curMarker);
						});

						google.maps.event.addListener(curMarker, 'click', function() {
							curInfowindow.open(map, curMarker);
							infowindow.close(map, marker);
							secInfowindow.close(map, secMarker);
							thirdInfowindow.close(map, thirdMarker);
						});
					} else {
						google.maps.event.addListener(marker, 'click', function() {
							infowindow.open(map, marker);
							curInfowindow.close(map, curMarker);
						});
						google.maps.event.addListener(curMarker, 'click', function() {
							curInfowindow.open(map, curMarker);
							infowindow.close(map, marker);
						});
					}
					setTimeout( function(){ map.panTo (position); } , 1000);
				}

			}
		});

		var details = new Ext.Panel({
			title: 'Details',
			iconCls: 'info',
			fullscreen: true,
			scroll: true
		});

		for (property in place) {
			if (shouldDisplayProperty(place, property)) {
				var display = property == 'distance' ? place[property] + ' m' : place[property];
				var html = '<div id="ext-comp-1011" class=" x-field x-label-align-left">' +
					'<div class="x-form-label" id="ext-gen1024" style="width: 40%; "><span>' + property + '</span></div>' +
					'<div class="x-form-label" style="width: 60%; background-color: #f8f8ff; "><span class="x-span-right">' + display + '</span></div>' +
					'</div></div>';
				details.add({html: html});
			}
		}

		if (service == 'Facebook') {
			var html = '<div id="ext-comp-1011" class=" x-field x-label-align-left">' +
					'<div class="x-form-label" id="ext-gen1024" style="width: 40%; "><span> logo </span></div>' +
					'<div class="x-form-label" style="width: 60%; background-color: #f8f8ff; "><span class="x-span-right"><img src="https://graph.facebook.com/' + place.id + '/picture&size=square?access_token=' + fbAccessToken + '"</span></div></div></div>';
				details.add({html: html});
		} else if (((service == 'Foursquare') || (service == 'GoogleP')) && iconUrl) {
			var html = '<div id="ext-comp-1011" class=" x-field x-label-align-left">' +
					'<div class="x-form-label" id="ext-gen1024" style="width: 40%; "><span> logo </span></div>' +
					'<div class="x-form-label" style="width: 60%; background-color: #f8f8ff; "><span class="x-span-right"><img src="' + iconUrl + '"</span></div></div></div>';
				details.add({html: html});
		} else if (service == 'Mixed') {
			var html = '<div id="ext-comp-1011" class=" x-field x-label-align-left">' +
					'<div class="x-form-label" id="ext-gen1024" style="width: 40%; "><span> fbLogo </span></div>' +
					'<div class="x-form-label" style="width: 60%; background-color: #f8f8ff; "><span class="x-span-right"><img src="https://graph.facebook.com/' + place.fbId + '/picture&size=square?access_token=' + fbAccessToken + '"</span></div></div></div>';
				details.add({html: html});
		}

		var friendsTab;
		function setFriendsTab(tab) {
			friendsTab = tab;
		}

		function getFriendsTab(store, list){
			var friendsTab = new Ext.Panel({
				title: 'Tag your Friends',
                iconCls: 'fbFriendsTab',
				layout: 'fit',
				defaults: {
					xtype: 'list',
					store: store
				},
				items: list
			});
			setFriendsTab(friendsTab);
			return friendsTab;
		}

		Ext.regModel('Facebook Friend', {
			fields: ['name', 'id']
		});

		var fbSelectedFriends = [];

		if ((service == 'Facebook') || (service == 'MixedFbFsGp') || (service == 'MultiFbFsGp') || (service == 'MixedFbFs') || (service == 'MultiFbFs') || (service == 'MixedFbGp') || (service == 'MultiFbGp')){
			Ext.util.JSONP.request({
				url: 'https://graph.facebook.com/me/friends',
				callbackKey: 'callback',
				params: {
					access_token: fbAccessToken
				},
				callback: function(result) {
					Ext.regModel('Facebook Friend', {
						fields: ['name', 'id']
					});
                    var fbFriends = result.data;
                    var friends = [];
                    for (i=0; i<fbFriends.length; i++) {
                        friends.push({name: fbFriends[i].name, id: fbFriends[i].id});
                    }
					var friendsList = {
						itemTpl: '<div class="contact2"><strong>{name}</strong></div>',
						selModel: {
							mode: 'SIMPLE'
						},
						indexBar: false,

						store: new Ext.data.JsonStore({
							model: 'Facebook Friend',
							sorters: 'name',
							getGroupString : function(record) {
								return record.get('name')[0];
							},
							data: friends
						})
					};
					var list = new Ext.List(Ext.apply(friendsList,{grouped: true, indexBar:true},
						{
							onItemSelect: function(item) {
								fbSelectedFriends = list.getSelectedRecords();
								var node = this.getNode(item);
								Ext.fly(node).addCls(this.selectedItemCls);
							},
							onItemDeselect: function(item) {
								fbSelectedFriends = list.getSelectedRecords();
								var node = this.getNode(item);
								Ext.fly(node).removeCls(this.selectedItemCls);
							}
						}
					));
					getFriendsTab(friendsList.store, list);
					new Ext.TabPanel({
						sortable: true,
						tabBar : {
							dock: 'bottom',
							layout : {
								pack : 'center'
							}
						},
						fullscreen: true,
						type: 'dark',
						dockedItems: dockedItems,
						items: [details,map,friendsTab]
					});
				}
			});
		} else {
			new Ext.TabPanel({
				sortable: true,
				tabBar : {
					dock: 'bottom',
					layout : {
						pack : 'center'
					}
				},
				fullscreen: true,
				type: 'dark',
				dockedItems: dockedItems,
				items: [details,map]
			});
		}
	}
});