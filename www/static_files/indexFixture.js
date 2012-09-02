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

		if (false) {
			window.location = 'http://johnnyecon.appspot.com/accounts.html';
		} else {
			var myMask = new Ext.LoadMask(Ext.getBody(), {msg:"Please wait..."});
			myMask.show();

            var searchForGpPlacesButton = createButton('Search For Google + Places', function() {
				window.location = 'https://accounts.google.com/o/oauth2/auth?scope=http://maps.google.com/maps/feeds/&client_id={your_google_app_client_id}.apps.googleusercontent.com&response_type=token&redirect_uri=http://johnnyecon.appspot.com/index.html';
			}, null, null, null);

            var searchForFsPlacesButton = createButton('Search For Foursquare Places', function() {
				window.location = 'https://foursquare.com/oauth2/authenticate?client_id=WLE4S30UCYMWQNR4NUXFVWBIWXJ21KSE43FMOHMNVUA0USAC&response_type=token&redirect_uri=http://johnnyecon.appspot.com/index.html';
			}, null, null, null);

            var searchForFbPlacesButton = createButton('Search For Facebook Places', function() {
				window.location = 'https://www.facebook.com/dialog/oauth/?scope=publish_checkins&client_id={your_facebook_app_client_id}&redirect_uri=http://johnnyecon.appspot.com/index.html&response_type=token';
			}, null, null, null);

            var accountsBtn = createButton('Accounts', function() {
				window.location = 'http://johnnyecon.appspot.com/accounts.html';
			}, null, null, null);
            accountsBtn.id = 'accountsBtn';

            var feedbackBtn = createButton('Give us some feedback!', function() {
                window.location = 'http://johnnyecon.appspot.com/feedback.html';
			}, null, null, null);

            var validateBtn = createButton('Common Places Validate', function() {
                if (!(((fbSelectedItems.data.items.length > 0) && (fsSelectedItems.data.items.length > 0 )) || ((fbSelectedItems.data.items.length > 0) && (gpSelectedItems.data.items.length > 0 )) || ((fsSelectedItems.data.items.length > 0) && (gpSelectedItems.data.items.length > 0)))) {
					Ext.Msg.alert('Error', 'You have to select places from at least two services if you want to use this functionality');
				} else {
					var commonPlaces = (fbSelectedItems.data.items.length > 0 ? " Facebook's " + fbSelectedItems.data.items[0].data.name + ((fsSelectedItems.data.items.length > 0 || gpSelectedItems.data.items.length > 0) ? ' and' : '') : '') +
						(fsSelectedItems.data.items.length > 0 ? " Foursquare's " + fsSelectedItems.data.items[0].data.name + ((gpSelectedItems.data.items.length > 0) ? ' and' : '') : '') +
						(gpSelectedItems.data.items.length > 0 ? " Google's " + gpSelectedItems.data.items[0].data.name : '');
					Ext.Msg.confirm("Help the community!!", "Do you want to validate that" + commonPlaces + " are the same place?", validateData);
					function validateData(btn) {
						if (btn == 'yes') {
							if ((fbSelectedItems.data.items.length > 0) && (fsSelectedItems.data.items.length > 0 ) && (gpSelectedItems.data.items.length > 0 )) {
								Ext.util.JSONP.request({
									url: 'http://johnnyecon.appspot.com/db/',
									callbackKey: 'callback',
									params: {
										service: 'communityValidateFbFsGp',
										transaction: 'write',
										fsId: fsSelectedItems.data.items[0].data.id,
										fsName: removeQuoteMarks(fsSelectedItems.data.items[0].data.name),
										fsLat: fsSelectedItems.data.items[0].data.lat,
										fsLon: fsSelectedItems.data.items[0].data.lon,
										gpId: gpSelectedItems.data.items[0].data.id,
										gpName: removeQuoteMarks(gpSelectedItems.data.items[0].data.name),
										gpLat: gpSelectedItems.data.items[0].data.lat,
										gpLon: gpSelectedItems.data.items[0].data.lon,
										gpRef: gpSelectedItems.data.items[0].data.reference,
										fbId: fbSelectedItems.data.items[0].data.id,
										fbName: removeQuoteMarks(fbSelectedItems.data.items[0].data.name),
										fbLat: fbSelectedItems.data.items[0].data.lat,
										fbLon: fbSelectedItems.data.items[0].data.lon
									},
									callback: function() {
										Ext.Msg.alert("Success!", "You successfully submitted your Common Places Validation request!");
									}
								});
							} else if ((fbSelectedItems.data.items.length > 0) && (fsSelectedItems.data.items.length > 0 )) {
								Ext.util.JSONP.request({
									url: 'http://johnnyecon.appspot.com/db/',
									callbackKey: 'callback',
									params: {
										service: 'communityValidateFbFs',
										transaction: 'write',
										fsId: fsSelectedItems.data.items[0].data.id,
										fsName: removeQuoteMarks(fsSelectedItems.data.items[0].data.name),
										fsLat: fsSelectedItems.data.items[0].data.lat,
										fsLon: fsSelectedItems.data.items[0].data.lon,
										fbId: fbSelectedItems.data.items[0].data.id,
										fbName: removeQuoteMarks(fbSelectedItems.data.items[0].data.name),
										fbLat: fbSelectedItems.data.items[0].data.lat,
										fbLon: fbSelectedItems.data.items[0].data.lon
									},
									callback: function() {
										Ext.Msg.alert("Success!", "You successfully submitted your Feedback!");
									}
								});
							} else if ((fsSelectedItems.data.items.length > 0) && (gpSelectedItems.data.items.length > 0 )) {
								Ext.util.JSONP.request({
									url: 'http://johnnyecon.appspot.com/db/',
									callbackKey: 'callback',
									params: {
										service: 'communityValidateFsGp',
										transaction: 'write',
										fsId: fsSelectedItems.data.items[0].data.id,
										fsName: removeQuoteMarks(fsSelectedItems.data.items[0].data.name),
										fsLat: fsSelectedItems.data.items[0].data.lat,
										fsLon: fsSelectedItems.data.items[0].data.lon,
										gpId: gpSelectedItems.data.items[0].data.id,
										gpName: removeQuoteMarks(gpSelectedItems.data.items[0].data.name),
										gpLat: gpSelectedItems.data.items[0].data.lat,
										gpLon: gpSelectedItems.data.items[0].data.lon,
										gpRef: gpSelectedItems.data.items[0].data.reference
									},
									callback: function() {
										Ext.Msg.alert("Success!", "You successfully submitted your Feedback!");
									}
								});
							} else if ((fbSelectedItems.data.items.length > 0) && (gpSelectedItems.data.items.length > 0 )) {
								Ext.util.JSONP.request({
									url: 'http://johnnyecon.appspot.com/db/',
									callbackKey: 'callback',
									params: {
										service: 'communityValidateFbGp',
										transaction: 'write',
										fbId: fbSelectedItems.data.items[0].data.id,
										fbName: removeQuoteMarks(fbSelectedItems.data.items[0].data.name),
										fbLat: fbSelectedItems.data.items[0].data.lat,
										fbLon: fbSelectedItems.data.items[0].data.lon,
										gpId: gpSelectedItems.data.items[0].data.id,
										gpName: removeQuoteMarks(gpSelectedItems.data.items[0].data.name),
										gpLat: gpSelectedItems.data.items[0].data.lat,
										gpLon: gpSelectedItems.data.items[0].data.lon,
										gpRef: gpSelectedItems.data.items[0].data.reference
									},
									callback: function() {
										Ext.Msg.alert("Success!", "You successfully submitted your Feedback!");
									}
								});
							}
						}
					}
				}
			}, null, null, null);

			var multipleCheckinBtn = createButton('Multiple Checkin', function(){
				if (!(((fbSelectedItems.data.items.length > 0) && (fsSelectedItems.data.items.length > 0 )) || ((fbSelectedItems.data.items.length > 0) && (gpSelectedItems.data.items.length > 0 )) || ((fsSelectedItems.data.items.length > 0) && (gpSelectedItems.data.items.length > 0)))) {
					Ext.Msg.alert('Error', 'You have to select places from at least two services if you want to use this functionality');
                } else {
                    if ((fbSelectedItems.data.items.length > 0) && (fsSelectedItems.data.items.length > 0 ) && (gpSelectedItems.data.items.length > 0 )) {
                        window.location = 'http://johnnyecon.appspot.com/checkin.html?service=MultiFbFsGp' +
                            '&fbName=' + fbSelectedItems.data.items[0].data.name +
                            '&fsName=' + fsSelectedItems.data.items[0].data.name +
                            '&gpName=' + gpSelectedItems.data.items[0].data.name +
                            '&fbId=' + fbSelectedItems.data.items[0].data.id +
                            '&fsId=' + fsSelectedItems.data.items[0].data.id +
                            '&gpId=' + gpSelectedItems.data.items[0].data.id +
                            '&fbLon=' + fbSelectedItems.data.items[0].data.lon +
                            '&fbLat=' + fbSelectedItems.data.items[0].data.lat +
                            '&fsLon=' + fsSelectedItems.data.items[0].data.lon +
                            '&fsLat=' + fsSelectedItems.data.items[0].data.lat +
                            '&gpLon=' + gpSelectedItems.data.items[0].data.lon +
                            '&gpLat=' + gpSelectedItems.data.items[0].data.lat +
                            '&curLat=' + getLat() +
                            '&curLon=' + getLon() +
                            '&gpReference=' + gpSelectedItems.data.items[0].data.reference +
                            '&fbAccessToken=' + fbAccessToken + '&fsAccessToken=' + fsAccessToken;
                    } else if ((fbSelectedItems.data.items.length > 0) && (fsSelectedItems.data.items.length > 0 )) {
                        window.location = 'http://johnnyecon.appspot.com/checkin.html?service=MultiFbFs' +
                            '&fbName=' + fbSelectedItems.data.items[0].data.name +
                            '&fsName=' + fsSelectedItems.data.items[0].data.name +
                            '&fbId=' + fbSelectedItems.data.items[0].data.id +
                            '&fsId=' + fsSelectedItems.data.items[0].data.id +
                            '&fbLon=' + fbSelectedItems.data.items[0].data.lon +
                            '&fbLat=' + fbSelectedItems.data.items[0].data.lat +
                            '&fsLon=' + fsSelectedItems.data.items[0].data.lon +
                            '&fsLat=' + fsSelectedItems.data.items[0].data.lat +
                            '&curLat=' + getLat() +
                            '&curLon=' + getLon() +
                            '&fbAccessToken=' + fbAccessToken + '&fsAccessToken=' + fsAccessToken;
                    } else if ((fsSelectedItems.data.items.length > 0) && (gpSelectedItems.data.items.length > 0 )) {
                        window.location = 'http://johnnyecon.appspot.com/checkin.html?service=MultiFsGp' +
                            '&fsName=' + fsSelectedItems.data.items[0].data.name +
                            '&gpName=' + gpSelectedItems.data.items[0].data.name +
                            '&fsId=' + fsSelectedItems.data.items[0].data.id +
                            '&gpId=' + gpSelectedItems.data.items[0].data.id +
                            '&fsLon=' + fsSelectedItems.data.items[0].data.lon +
                            '&fsLat=' + fsSelectedItems.data.items[0].data.lat +
                            '&gpLon=' + gpSelectedItems.data.items[0].data.lon +
                            '&gpLat=' + gpSelectedItems.data.items[0].data.lat +
                            '&curLat=' + getLat() +
                            '&curLon=' + getLon() +
                            '&gpReference=' + gpSelectedItems.data.items[0].data.reference +
                            '&fsAccessToken=' + fsAccessToken;
                    } else if ((fbSelectedItems.data.items.length > 0) && (gpSelectedItems.data.items.length > 0 )) {
                        window.location = 'http://johnnyecon.appspot.com/checkin.html?service=MultiFbGp' +
                            '&fbName=' + fbSelectedItems.data.items[0].data.name +
                            '&gpName=' + gpSelectedItems.data.items[0].data.name +
                            '&fbId=' + fbSelectedItems.data.items[0].data.id +
                            '&gpId=' + gpSelectedItems.data.items[0].data.id +
                            '&fbLon=' + fbSelectedItems.data.items[0].data.lon +
                            '&fbLat=' + fbSelectedItems.data.items[0].data.lat +
                            '&gpLon=' + gpSelectedItems.data.items[0].data.lon +
                            '&gpLat=' + gpSelectedItems.data.items[0].data.lat +
                            '&curLat=' + getLat() +
                            '&curLon=' + getLon() +
                            '&gpReference=' + gpSelectedItems.data.items[0].data.reference +
                            '&fbAccessToken=' + fbAccessToken;
                    }
                }
            }, null, null, null);

            var more = createButton('More',function() {
				if (!this.actions) {
					var items = shouldMix() ?
					[multipleCheckinBtn,validateBtn,feedbackBtn,
					{
						text : 'Cancel',
						scope : this,
						handler : function(){
							this.actions.hide();
						}
					}] :
					[feedbackBtn,
					{
						text : 'Cancel',
						scope : this,
						handler : function(){
							this.actions.hide();
						}
					}];
					this.actions = new Ext.ActionSheet({
						items: items
					});
				}
				this.actions.show();
			}, null, null, null);
            more.id = 'moreButton';

			var buttonsGroup = [{
				xtype: 'segmentedbutton',
				allowMultiple: true,
				dock: 'top',
				layout: {
					pack: 'center'
						},
				items: [{
					text: 'Facebook',
					pressed : Boolean(fbAccessToken)
				}, {
					text: 'Foursquare',
					pressed : Boolean(fsAccessToken)
				}, {
					text: 'Google +',
					pressed : Boolean(gpAccessToken)
				}],
				listeners : {
					toggle : function(container, button, active){
						fbPressed = (button.text == 'Facebook') ? active : checkIfBtnPressed('Facebook', container.pressedButtons);
						fsPressed = (button.text == 'Foursquare') ? active : checkIfBtnPressed('Foursquare', container.pressedButtons);
						gpPressed = (button.text == 'Google +') ? active : checkIfBtnPressed('Google +', container.pressedButtons);
						if (fbPressed && fsPressed && gpPressed) {
							if (fbAccessToken && fsAccessToken && gpAccessToken) {
								mixedTab = getFbFsGpMixedPlacesTab(fbStore, fsStore, gpStore);
								getMixedTabPanel(fbTab, fsTab, gpTab, mixedTab, getDockedItems());
							} else {
								Ext.Msg.alert("Error!", "You have to sign in to " + (fbAccessToken ? '' : 'Facebook') + (fsAccessToken ? '' : (fbAccessToken ? ' Foursquare' : ' and Foursquare')) + (gpAccessToken ? '' : (fbAccessToken && fsAccessToken ? ' Google' : ' and Google')) + ' , in order to see the common places of these services');
								redirectTab = fbAccessToken ? (fsAccessToken ? gpTab : fsTab) : fbTab;
								tabPanel.setActiveItem(redirectTab);
							}
						} else if (fbPressed && fsPressed) {
							if (fbAccessToken && fsAccessToken) {
								mixedTab = getFbFsMixedPlacesTab(fbStore, fsStore);
								getMixedTabPanel(fbTab, fsTab, gpTab, mixedTab, getDockedItems());
							} else {
								Ext.Msg.alert("Error!", "You have to sign in to " + (fbAccessToken ? '' : 'Facebook') + (fsAccessToken ? '' : (fbAccessToken ? ' Foursquare' : ' and Foursquare')) + ' , in order to see the common places of these services');
								redirectTab = fbAccessToken ? fsTab : fbTab;
								tabPanel.setActiveItem(redirectTab);
							}
						} else if (fsPressed && gpPressed) {
							if (fsAccessToken && gpAccessToken) {
								mixedTab = getFsGpMixedPlacesTab(fsStore, gpStore);
								getMixedTabPanel(fbTab, fsTab, gpTab, mixedTab, getDockedItems());
							} else {
								Ext.Msg.alert("Error!", "You have to sign in to " + (fsAccessToken ? '' : 'Foursquare') + (gpAccessToken ? '' : (fsAccessToken ? ' Google' : ' and Google')) + ' , in order to see the common places of these services');
								redirectTab = fsAccessToken ? gpTab : fsTab;
								tabPanel.setActiveItem(redirectTab);
							}
						} else if (fbPressed && gpPressed) {
							if (fbAccessToken && gpAccessToken) {
								mixedTab = getFbGpMixedPlacesTab(fbStore, gpStore);
								getMixedTabPanel(fbTab, fsTab, gpTab, mixedTab, getDockedItems());
							} else {
								Ext.Msg.alert("Error!", "You have to sign in to " + (fbAccessToken ? '' : 'Facebook') + (gpAccessToken ? '' : (fbAccessToken ? ' Google' : ' and Google')) + ' , in order to see the common places of these services');
								redirectTab = fbAccessToken ? gpTab : fbTab;
								tabPanel.setActiveItem(redirectTab);
							}
						}
//                        else if (fbPressed) {
//                            if (fbAccessToken) {
//                                getMixedTabPanel(fbTab, fsTab, gpTab, fbTab, getDockedItems());
//                            } else {
//                                Ext.Msg.alert("Error!", "You have to sign in to Facebook, in order to see Facebook's places'");
//                            }
//                        } else if (fsPressed) {
//                            if (fsAccessToken) {
//                                getMixedTabPanel(fbTab, fsTab, gpTab, fsTab, getDockedItems());
//                            } else {
//                                Ext.Msg.alert("Error!", "You have to sign in to Foursquare, in order to see Foursquare's places'");
//                            }
//                        } else if (gpPressed) {
//                            if (gpAccessToken) {
//                                getMixedTabPanel(fbTab, fsTab, gpTab, gpTab, getDockedItems());
//                            } else {
//                                Ext.Msg.alert("Error!", "You have to sign in to Google, in order to see Google's places'");
//                            }
//                        }
					}
				}
			}];

			var lat;
			function setLat(latitude) {
				lat = latitude;
			}
			function getLat() {
				return lat;
			}

			var lon;
			function setLon(longitude) {
				lon = longitude;
			}
			function getLon() {
				return lon;
			}

            var tabPanel;
			function setTabPanel(panel) {
				tabPanel = panel;
			}

			var mixedTab;
			function setMixedTab(mixed) {
				mixedTab = mixed;
			}

			var fbStore;
			function setFbStore(fbSto) {
				fbStore = fbSto;
			}

			var fsStore;
			function setFsStore(fsSto) {
				fsStore = fsSto;
			}

			var gpStore;
			function setGpStore(gpSto) {
				gpStore = gpSto;
			}

			var fbTab;
			function setFbTab(fbSto) {
				fbTab = fbSto;
			}

			var fsTab;
			function setFsTab(fsSto) {
				fsTab = fsSto;
			}

			var gpTab;
			function setGpTab(gpSto) {
				gpTab = gpSto;
			}

			function getFbBtnTab() {
				var fbTab = new Ext.Panel({
					title: 'Facebook',
					layout: {
						type: 'vbox',
						pack: 'center',
						align: 'stretch'
					},
					defaults: {
						xtype: 'button',
						cls: 'demobtn',
						ui: 'round'
					},
					iconCls: 'fbTab',
					items: searchForFbPlacesButton
				});
				setFbTab(fbTab);
				return fbTab;
			}

			function getFsBtnTab() {
				var fsTab = new Ext.Panel({
					title: 'Foursquare',
					layout: {
						type: 'vbox',
						pack: 'center',
						align: 'stretch'
					},
					defaults: {
						xtype: 'button',
						cls: 'demobtn',
						ui: 'round'
					},
					iconCls: 'fsTab',
					items: searchForFsPlacesButton

				});
				setFsTab(fsTab);
				return fsTab;
			}

			function getGpBtnTab() {
				var gpTab = new Ext.Panel({
					title: 'Google +',
					layout: {
						type: 'vbox',
						pack: 'center',
						align: 'stretch'
					},
					defaults: {
						xtype: 'button',
						cls: 'demobtn',
						ui: 'round'
					},
					iconCls: 'gpTab',
					items: searchForGpPlacesButton
				});
				setGpTab(gpTab);
				return gpTab;
			}

			function getFbPlacesTab(store, list){
				var fbTab = new Ext.Panel({
					title: 'Facebook',
					layout: 'fit',
					defaults: {
						xtype: 'list',
						store: store
					},
					iconCls: 'fbTab',
					items: list
				});
				setFbTab(fbTab);
				return fbTab;
			}

			function getFsPlacesTab(store, list){
				var fsTab = new Ext.Panel({
					title: 'Foursquare',
					layout: 'fit',
					defaults: {
						xtype: 'list',
						store: store
					},
					iconCls: 'fsTab',
					items: list
				});
				setFsTab(fsTab);
				return fsTab;
			}

			function getGpPlacesTab(store, list){
				var gpTab = new Ext.Panel({
					title: 'Google +',
					layout: 'fit',
					defaults: {
						xtype: 'list',
						store: store
					},
					iconCls: 'gpTab',
					items: list
				});
				setGpTab(gpTab);
				return gpTab;
			}

			function getFbFsMixedPlacesTab(fbStore, fsStore) {
				setFbStore(fbStore);
				setFsStore(fsStore);
				Ext.regModel('Place', {
					fields: ['fbName', 'fsName', 'distance', 'fsLat', 'fsLon', 'fbLat', 'fbLon', 'category', 'fbId', 'fsId', 'communityValidated', 'counter']
				});
				var tpl = new Ext.XTemplate(
					'<div><strong class="list-item-property">Fb Name:</strong> {fbName},' +
						'<strong class="list-item-property">Fs Name:</strong> {fsName},' +
						'<strong class="list-item-property">Distance:</strong> {distance} meters' +
						'<tpl if="communityValidated">   <strong class="list-item-property">********************  Community Validated -- {counter} votes</strong> </tpl></div>'
				);
				var placeList = {
					itemTpl: tpl,
					selModel: {
						mode: 'SINGLE',
						allowDeselect: true
					},
					indexBar: false,
					onItemDisclosure: {
						scope: 'test',
						handler: function(record, btn, index) {
							window.location = 'http://johnnyecon.appspot.com/checkin.html?' +
								'service=MixedFbFs&' +
								'fbName=' + record.get('fbName') +
								'&fsName=' + record.get('fsName') +
								'&fsLat=' + record.get('fsLat') +
								'&fsLon=' + record.get('fsLon') +
								'&fbLat=' + record.get('fbLat') +
								'&fbLon=' + record.get('fbLon') +
								'&distance=' + record.get('distance') +
								'&address=' + record.get('address') +
								'&category=' + record.get('category') +
								'&fbId=' + record.get('fbId') +
								'&fsId=' + record.get('fsId') +
								'&curLat=' + getLat() +
								'&curLon=' + getLon() +
								'&fbAccessToken=' + fbAccessToken +
								'&fsAccessToken=' + fsAccessToken;
						}
					},
					store: new Ext.data.Store({
						model: 'Place'
					})
				};

				placeList.store = getFbFsFilteredStore(placeList.store, fbStore.data.items, fsStore.data.items);
				Ext.util.JSONP.request({
					url: 'http://johnnyecon.appspot.com/db/',
					callbackKey: 'callback',
					params: {
						currentLat: getLat(),
						currentLon: getLon(),
						transaction: 'readFbFs'
					},
					callback: function(communityValidatedCommonPlaces) {
                        console.log(communityValidatedCommonPlaces)
						for (i=0; i < communityValidatedCommonPlaces.data.length; i++) {
							var dist = distance(getLat(), getLon(), communityValidatedCommonPlaces.data[i].fbLat, communityValidatedCommonPlaces.data[i].fbLon);
							if (dist < 500) {
								placeList.store.add({fbName: communityValidatedCommonPlaces.data[i].fbName, fsName: communityValidatedCommonPlaces.data[i].fsName, distance: dist, fbLat: communityValidatedCommonPlaces.data[i].fbLat, fbLon: communityValidatedCommonPlaces.data[i].fbLon, category: 'undefined', fbId: communityValidatedCommonPlaces.data[i].fbId, fsId: communityValidatedCommonPlaces.data[i].fsId, fsLat: communityValidatedCommonPlaces.data[i].fsLat, fsLon: communityValidatedCommonPlaces.data[i].fsLon, communityValidated: true, counter: communityValidatedCommonPlaces.data[i].counter});
							}
						}
					}
				});
				var list = new Ext.List(Ext.apply(placeList, {}));
				var mixedTab = new Ext.Panel({
					title: 'Fb-Fs Common Places',
					layout: 'fit',
					dockedItems: buttonsGroup,
					defaults: {
						xtype: 'list',
						store: placeList.store
					},
					iconCls: 'mixedTab',
					items: list
				});
				setMixedTab(mixedTab);
				return mixedTab;
			}

			function getFbGpMixedPlacesTab(fbStore, gpStore) {
				setFbStore(fbStore);
				setGpStore(gpStore);
				Ext.regModel('Place', {
					fields: ['fbName', 'gpName', 'distance', 'gpLat', 'gpLon', 'fbLat', 'fbLon', 'category', 'fbId', 'gpId', 'gpReference', 'communityValidated', 'counter']
				});
				var tpl = new Ext.XTemplate(
					'<div><strong class="list-item-property">Fb Name:</strong> {fbName},' +
						'<strong class="list-item-property">Gp Name:</strong> {gpName},' +
						'<strong class="list-item-property">Distance:</strong> {distance} meters' +
						'<tpl if="communityValidated">   <strong class="list-item-property">********************  Community Validated -- {counter} votes</strong> </tpl></div>'
				);
				var placeList = {
					itemTpl: tpl,
					selModel: {
						mode: 'SINGLE',
						allowDeselect: true
					},
					indexBar: false,
					onItemDisclosure: {
						scope: 'test',
						handler: function(record, btn, index) {
							window.location = 'http://johnnyecon.appspot.com/checkin.html?' +
								'service=MixedFbGp' +
								'&fbName=' + record.get('fbName') +
								'&gpName=' + record.get('gpName') +
								'&gpReference=' + record.get('gpReference') +
								'&gpLat=' + record.get('gpLat') +
								'&gpLon=' + record.get('gpLon') +
								'&fbLat=' + record.get('fbLat') +
								'&fbLon=' + record.get('fbLon') +
								'&distance=' + record.get('distance') +
								'&address=' + record.get('address') +
								'&category=' + record.get('category') +
								'&fbId=' + record.get('fbId') +
								'&gpId=' + record.get('gpId') +
								'&curLat=' + getLat() +
								'&curLon=' + getLon() +
								'&fbAccessToken=' + fbAccessToken +
								'&gpAccessToken=' + gpAccessToken;
						}
					},
					store: new Ext.data.Store({
						model: 'Place'
					})
				};

				placeList.store = getFbGpFilteredStore(placeList.store, fbStore.data.items, gpStore.data.items);
				Ext.util.JSONP.request({
					url: 'http://johnnyecon.appspot.com/db/',
					callbackKey: 'callback',
					params: {
						currentLat: getLat(),
						currentLon: getLon(),
						transaction: 'readFbGp'
					},
					callback: function(communityValidatedCommonPlaces) {
						for (i=0; i < communityValidatedCommonPlaces.data.length; i++) {
							var dist = distance(getLat(), getLon(), communityValidatedCommonPlaces.data[i].fbLat, communityValidatedCommonPlaces.data[i].fbLon);
							if (dist < 500) {
								placeList.store.add({fbName: communityValidatedCommonPlaces.data[i].fbName, gpName: communityValidatedCommonPlaces.data[i].gpName, distance: dist, fbLat: communityValidatedCommonPlaces.data[i].fbLat, fbLon: communityValidatedCommonPlaces.data[i].fbLon, category: 'undefined', fbId: communityValidatedCommonPlaces.data[i].fbId, gpId: communityValidatedCommonPlaces.data[i].gpId, gpLat: communityValidatedCommonPlaces.data[i].gpLat, gpLon: communityValidatedCommonPlaces.data[i].gpLon, gpReference: communityValidatedCommonPlaces.data[i].gpRef, communityValidated: true, counter: communityValidatedCommonPlaces.data[i].counter});
							}
						}
					}
				});
				var list = new Ext.List(Ext.apply(placeList, {}));
				var mixedTab = new Ext.Panel({
					title: 'Fb-G+ Common Places',
					layout: 'fit',
					dockedItems: buttonsGroup,
					defaults: {
						xtype: 'list',
						store: placeList.store
					},
					iconCls: 'mixedTab',
					items: list
				});
				setMixedTab(mixedTab);
				return mixedTab;
			}

			function getFsGpMixedPlacesTab(fsStore, gpStore) {
				setFsStore(fsStore);
				setGpStore(gpStore);
				Ext.regModel('Place', {
					fields: ['fsName', 'gpName', 'distance', 'gpLat', 'gpLon', 'fsLat', 'fsLon', 'category', 'fsId', 'gpId', 'gpReference', 'communityValidated', 'counter']
				});
				var tpl = new Ext.XTemplate(
					'<div><strong class="list-item-property">Fs Name:</strong> {fsName},' +
						'<strong class="list-item-property">Gp Name:</strong> {gpName},' +
						'<strong class="list-item-property">Distance:</strong> {distance} meters' +
						'<tpl if="communityValidated">   <strong class="list-item-property">********************  Community Validated -- {counter} votes</strong> </tpl></div>'
				);
				var placeList = {
					itemTpl: tpl,
					selModel: {
						mode: 'SINGLE',
						allowDeselect: true
					},
					indexBar: false,
					onItemDisclosure: {
						scope: 'test',
						handler: function(record) {
							window.location = 'http://johnnyecon.appspot.com/checkin.html?' +
								'service=MixedFsGp' +
								'&fsName=' + record.get('fsName') +
								'&gpName=' + record.get('gpName') +
								'&gpReference=' + record.get('gpReference') +
								'&gpLat=' + record.get('gpLat') +
								'&gpLon=' + record.get('gpLon') +
								'&fsLat=' + record.get('fsLat') +
								'&fsLon=' + record.get('fsLon') +
								'&distance=' + record.get('distance') +
								'&address=' + record.get('address') +
								'&category=' + record.get('category') +
								'&fsId=' + record.get('fsId') +
								'&gpId=' + record.get('gpId') +
								'&curLat=' + getLat() +
								'&curLon=' + getLon() +
								'&fsAccessToken=' + fsAccessToken +
								'&gpAccessToken=' + gpAccessToken;
						}
					},
					store: new Ext.data.Store({
						model: 'Place'
					})
				};

				placeList.store = getFsGpFilteredStore(placeList.store, fsStore.data.items, gpStore.data.items);
				Ext.util.JSONP.request({
					url: 'http://johnnyecon.appspot.com/db/',
					callbackKey: 'callback',
					params: {
						currentLat: getLat(),
						currentLon: getLon(),
						transaction: 'readFsGp'
					},
					callback: function(communityValidatedCommonPlaces) {
						for (i=0; i < communityValidatedCommonPlaces.data.length; i++) {
							var dist = distance(getLat(), getLon(), communityValidatedCommonPlaces.data[i].fsLat, communityValidatedCommonPlaces.data[i].fsLon);
							if (dist < 500) {
								placeList.store.add({fsName: communityValidatedCommonPlaces.data[i].fsName, gpName: communityValidatedCommonPlaces.data[i].gpName, distance: dist, fsLat: communityValidatedCommonPlaces.data[i].fsLat, fsLon: communityValidatedCommonPlaces.data[i].fsLon, category: 'undefined', fsId: communityValidatedCommonPlaces.data[i].fsId, gpId: communityValidatedCommonPlaces.data[i].gpId, gpLat: communityValidatedCommonPlaces.data[i].gpLat, gpLon: communityValidatedCommonPlaces.data[i].gpLon, gpReference: communityValidatedCommonPlaces.data[i].gpRef, communityValidated: true, counter: communityValidatedCommonPlaces.data[i].counter});
							}
						}
					}
				});
				var list = new Ext.List(Ext.apply(placeList, {}));
				var mixedTab = new Ext.Panel({
					title: 'Fs-G+ Common Places',
					layout: 'fit',
					dockedItems: buttonsGroup,
					defaults: {
						xtype: 'list',
						store: placeList.store
					},
					iconCls: 'mixedTab',
					items: list
				});
				setMixedTab(mixedTab);
				return mixedTab;
			}

			function getFbFsGpMixedPlacesTab(fbStore, fsStore, gpStore) {
				setFbStore(fbStore);
				setFsStore(fsStore);
				setGpStore(gpStore);
				Ext.regModel('Place', {
					fields: ['fbName', 'fsName', 'gpName', 'distance', 'fsLat', 'fsLon', 'fbLat', 'fbLon', 'gpLat', 'gpLon', 'category', 'fbId', 'fsId', 'gpId', 'gpReference', 'communityValidated', 'counter']
				});
				var tpl = new Ext.XTemplate(
					'<div><strong class="list-item-property">Fb Name:</strong> {fbName}, <strong class="list-item-property">Fs Name:</strong> {fsName}, <strong class="list-item-property">Gp Name:</strong> {gpName}, <strong class="list-item-property">Distance:</strong> {distance} meters <tpl if="communityValidated">   <strong class="list-item-property">********************  Community Validated -- {counter} votes</strong> </tpl></div>'
				);
				var placeList = {
					itemTpl: tpl,
					selModel: {
						mode: 'SINGLE',
						allowDeselect: true
					},
					indexBar: false,
					onItemDisclosure: {
						scope: 'test',
						handler: function(record, btn, index) {
							window.location = 'http://johnnyecon.appspot.com/checkin.html' +
								'?service=MixedFbFsGp' +
								'&gpReference=' + record.get('gpReference') +
								'&fbName=' + record.get('fbName') +
								'&fsName=' + record.get('fsName') +
								'&gpName=' + record.get('gpName') +
								'&gpLat=' + record.get('gpLat') +
								'&gpLon=' + record.get('gpLon') +
								'&fsLat=' + record.get('fsLat') +
								'&fsLon=' + record.get('fsLon') +
								'&fbLat=' + record.get('fbLat') +
								'&fbLon=' + record.get('fbLon') +
								'&distance=' + record.get('distance') +
								'&address=' + record.get('address') +
								'&category=' + record.get('category') +
								'&fbId=' + record.get('fbId') +
								'&fsId=' + record.get('fsId') +
								'&gpId=' + record.get('gpId') +
								'&curLat=' + getLat() +
								'&curLon=' + getLon() +
								'&fbAccessToken=' + fbAccessToken +
								'&fsAccessToken=' + fsAccessToken +
								'&gpAccessToken=' + gpAccessToken;
						}
					},
					store: new Ext.data.Store({
						model: 'Place'
					})
				};
				placeList.store = getFbFsGpFilteredStore(placeList.store, fbStore.data.items, fsStore.data.items, gpStore.data.items);
				Ext.util.JSONP.request({
					url: 'http://johnnyecon.appspot.com/db/',
					callbackKey: 'callback',
					params: {
						currentLat: getLat(),
						currentLon: getLon(),
						transaction: 'readFbFsGp'
					},
					callback: function(communityValidatedCommonPlaces) {
						for (i=0; i < communityValidatedCommonPlaces.data.length; i++) {
							var dist = distance(getLat(), getLon(), communityValidatedCommonPlaces.data[i].fbLat, communityValidatedCommonPlaces.data[i].fbLon);
							if (dist < 500) {
								placeList.store.add({fbName: communityValidatedCommonPlaces.data[i].fbName,
									fsName: communityValidatedCommonPlaces.data[i].fsName,
									gpName: communityValidatedCommonPlaces.data[i].gpName,
									distance: dist, fbLat: communityValidatedCommonPlaces.data[i].fbLat,
									fbLon: communityValidatedCommonPlaces.data[i].fbLon,
									category: 'undefined',
									fbId: communityValidatedCommonPlaces.data[i].fbId,
									gpId: communityValidatedCommonPlaces.data[i].gpId,
									fsId: communityValidatedCommonPlaces.data[i].fsId,
									fsLat: communityValidatedCommonPlaces.data[i].fsLat,
									fsLon: communityValidatedCommonPlaces.data[i].fsLon,
									gpLat: communityValidatedCommonPlaces.data[i].gpLat,
									gpLon: communityValidatedCommonPlaces.data[i].gpLon,
									gpReference: communityValidatedCommonPlaces.data[i].gpRef,
									communityValidated: true,
									counter: communityValidatedCommonPlaces.data[i].counter});
							}
						}
					}
				});
				var list = new Ext.List(Ext.apply(placeList, {}));
				var mixedTab = new Ext.Panel({
					title: 'Fb-Fs-G+ Common Places',
					layout: 'fit',
					dockedItems: buttonsGroup,
					defaults: {
						xtype: 'list',
						store: placeList.store
					},
					iconCls: 'mixedTab',
					items: list
				});
				setMixedTab(mixedTab);
				return mixedTab;
			}

			function getFbFsGpFilteredStore(store, fbItems, fsItems, gpItems)
			{
				var i = 0;
				for (fbKey=0;fbKey<fbItems.length;fbKey++) {
					for (fsKey=0;fsKey<fsItems.length;fsKey++) {
						for (gpKey=0;gpKey<gpItems.length;gpKey++) {
							if (compareItems(fbItems[fbKey], fsItems[fsKey]) && compareItems(fbItems[fbKey], gpItems[gpKey])) {
								store.add({fbName: fbItems[fbKey].data.name,
									fsName: fsItems[fsKey].data.name,
									gpName: gpItems[gpKey].data.name,
									distance: fsItems[fsKey].data.distance,
									fbLat: fbItems[fbKey].data.lat,
									fbLon: fbItems[fbKey].data.lon,
									category: fbItems[fbKey].data.category,
									fbId: fbItems[fbKey].data.id,
									fsId: fsItems[fsKey].data.id,
									gpId: gpItems[gpKey].data.id,
									fsLat: fsItems[fsKey].data.lat,
									fsLon: fsItems[fsKey].data.lon,
									gpLat: fsItems[gpKey].data.lat,
									gpLon: gpItems[gpKey].data.lon,
									gpReference: gpItems[gpKey].data.reference});
							}
						}
						i++;
					}
				}
				return store;
			}

			function getFbGpFilteredStore(store, fbItems, gpItems)
			{
				var i = 0;
				for (fbKey=0;fbKey<fbItems.length;fbKey++) {
					for (gpKey=0;gpKey<gpItems.length;gpKey++) {
						if (compareItems(fbItems[fbKey], gpItems[gpKey])) {
							store.add({fbName: fbItems[fbKey].data.name,
								gpName: gpItems[gpKey].data.name,
								distance: distance(fbItems[fbKey].data.lat, fbItems[fbKey].data.lon, getLat(), getLon()),
								fbLat: fbItems[fbKey].data.lat,
								fbLon: fbItems[fbKey].data.lon,
								category: fbItems[fbKey].data.category,
								fbId: fbItems[fbKey].data.id,
								gpId: gpItems[gpKey].data.id,
								gpLat: gpItems[gpKey].data.lat,
								gpLon: gpItems[gpKey].data.lon,
								gpReference: gpItems[gpKey].data.reference});
						}
						i++;
					}
				}
				return store;
			}

			function getFsGpFilteredStore(store, fsItems, gpItems)
			{
				var i = 0;
				for (gpKey=0;gpKey<gpItems.length;gpKey++) {
					for (fsKey=0;fsKey<fsItems.length;fsKey++) {
						if (compareItems(gpItems[gpKey], fsItems[fsKey])) {
							store.add({gpName: gpItems[gpKey].data.name,
								fsName: fsItems[fsKey].data.name,
								distance: fsItems[fsKey].data.distance,
								gpLat: gpItems[gpKey].data.lat,
								gpLon: gpItems[gpKey].data.lon,
								category: gpItems[gpKey].data.category,
								gpId: gpItems[gpKey].data.id,
								fsId: fsItems[fsKey].data.id,
								fsLat: fsItems[fsKey].data.lat,
								fsLon: fsItems[fsKey].data.lon,
								gpReference: gpItems[gpKey].data.reference})
						}
						i++;
					}
				}
				return store;
			}

			function getFbFsFilteredStore(store, fbItems, fsItems)
			{
				var i = 0;
				for (fbKey=0;fbKey<fbItems.length;fbKey++) {
					for (fsKey=0;fsKey<fsItems.length;fsKey++) {
						if (compareItems(fbItems[fbKey], fsItems[fsKey])) {
							store.add({fbName: fbItems[fbKey].data.name,
								fsName: fsItems[fsKey].data.name,
								distance: fsItems[fsKey].data.distance,
								fbLat: fbItems[fbKey].data.lat,
								fbLon: fbItems[fbKey].data.lon,
								category: fbItems[fbKey].data.category,
								fbId: fbItems[fbKey].data.id,
								fsId: fsItems[fsKey].data.id,
								fsLat: fsItems[fsKey].data.lat,
								fsLon: fsItems[fsKey].data.lon});
						}
						i++;
					}
				}
				return store;
			}

			function shouldMix() {
				return ((fbAccessToken && fsAccessToken) || (fsAccessToken && gpAccessToken) || (gpAccessToken && fbAccessToken));
			}

			Ext.regModel('Places', {
				fields: [
					{name: 'id', type: 'string'},
					{name: 'name',  type: 'string'},
					{name: 'lon',  type: 'string'},
					{name: 'lat',  type: 'string'}
				]
			});

			Ext.regModel('GooglePlaces', {
				fields: [
					{name: 'id', type: 'string'},
					{name: 'name',  type: 'string'},
					{name: 'lon',  type: 'string'},
					{name: 'lat',  type: 'string'},
					{name: 'reference',  type: 'string'}
				]
			});

			var fbSelectedItems = new Ext.data.Store({
				model: 'Places',
				data : [
				]
			});

			var fsSelectedItems = new Ext.data.Store({
				model: 'Places',
				data : [
				]
			});

			var gpSelectedItems = new Ext.data.Store({
				model: 'GooglePlaces',
				data : [
				]
			});

			function checkIfBtnPressed(service, buttons) {
				for (i=0; i < buttons.length; i++) {
					if (service == buttons[i].text) {
						return true;
					}
				}
				return false;
			}

			function getDockedItems() {
				var items = [accountsBtn,{xtype: 'spacer'},more];
				var dockedItems = [
                    {
                        xtype: 'toolbar',
                        title: 'Check In',
                        ui: 'dark',
                        dock: 'top',
                        items: items
                    }
                ];
				return dockedItems;
			}

			function getTabPanel(fbTab, fsTab, gpTab, dockedItems, stopLoading) {
				var tabPanel = new Ext.TabPanel({
					tabBar: {
						dock: 'bottom',
						layout: {
							pack: 'center'
						}
					},
					fullscreen: true,
					type: 'dark',
					sortable: true,
					dockedItems: dockedItems,
					items: [fbTab, fsTab, gpTab]
				});
				if (fbCallback || fbAccessToken) {
					tabPanel.setActiveItem(fbTab);
				} else if (fsCallback || fsAccessToken) {
					tabPanel.setActiveItem(fsTab);
				} else if (gpCallback || gpAccessToken) {
					tabPanel.setActiveItem(gpTab);
				}
				setTabPanel(tabPanel);
				if (stopLoading)
                    myMask.hide();
				return tabPanel;
			}

			function getMixedTabPanel(fbTab, fsTab, gpTab, mixedTab, dockedItems) {
				var mixedTabPanel = new Ext.TabPanel({
					fullscreen: true,
					type: 'dark',
					sortable: true,
					dockedItems: dockedItems,
					tabBar: {
						dock: 'bottom',
						layout: {
							pack: 'center'
						}
					},
					items: [fbTab, fsTab, gpTab, mixedTab]
				});
				mixedTabPanel.setActiveItem(mixedTab);
				setTabPanel(mixedTabPanel);
				myMask.hide();
				return mixedTabPanel;
			}

			function getGpCompleteTabPanel(fbTab, fsTab)
			{
				Ext.util.JSONP.request({
					url: 'http://johnnyecon.appspot.com/db/',
					callbackKey: 'callback',
					params: {
						currentLat: getLat(),
						currentLon: getLon(),
						transaction: 'getGpPlaces'
					},
					callback: function(result) {
						Ext.regModel('Place', {
							fields: ['name', 'distance', 'lat', 'lon', 'address', 'category', 'id', 'iconUrl']
						});
						var googlePlaces = result.results;
						var places = [];
						var placeList = {
							itemTpl: '<div class="contact2"><strong>{name}</strong>, {distance} meters</div>',
							selModel: {
								mode: 'SINGLE',
								allowDeselect: true
							},
							indexBar: false,

							onItemDisclosure: {
								scope: 'test',
								handler: function(record) {
									window.location = 'http://johnnyecon.appspot.com/checkin.html?' +
										'service=GoogleP' +
										'&gpName=' + record.get('name') +
										'&lat=' + record.get('lat') +
										'&lon=' + record.get('lon') +
										'&distance=' + record.get('distance') +
										'&category=' + record.get('category') +
										'&id=' + record.get('id') +
										'&gpReference=' + record.get('reference') +
										'&iconUrl=' + record.get('iconUrl') +
										'&curLat=' + getLat() +
										'&curLon=' + getLon() +
										'&gpAccessToken=' + gpAccessToken;
								}
							},

							store: new Ext.data.Store({
								model: 'Place',
								sorters: 'distance',
								getGroupString : function(record) {
									return record.get('distance');
								},

								data: places
							})
						};
						for (i=0; i<googlePlaces.length; i++) {
							placeList.store.add({name: googlePlaces[i].name, distance: distance(googlePlaces[i].geometry.location.lat, googlePlaces[i].geometry.location.lng, getLat(), getLon()), lat: googlePlaces[i].geometry.location.lat, lon: googlePlaces[i].geometry.location.lng, category: googlePlaces[i].types[0], reference: googlePlaces[i].reference, id: googlePlaces[i].id, iconUrl: googlePlaces[i].icon});
						}
						list = new Ext.List(Ext.apply(placeList, {
							onItemSelect: function(item) {
								gpSelectedItems.removeAll(true);
								gpSelectedItems.add({id: item.data.id, lat: item.data.lat, lon: item.data.lon, name: item.data.name, reference: item.data.reference});
								var text = "Multiple Checkin" + (fbSelectedItems.data.length == 0 ? "" : " to Facebook's " + fbSelectedItems.data.items[0].data.name + ' and ') + (fsSelectedItems.data.length == 0 ? "" : " to Foursquare's " + fsSelectedItems.data.items[0].data.name + ' and') + " to Google's " + item.data.name;
								multipleCheckinBtn.setText(text);
								var node = this.getNode(item);
								Ext.fly(node).addCls(this.selectedItemCls);
							},
							onItemDeselect: function(item) {
								gpSelectedItems.removeAll(true);
								var text = "Multiple Checkin" + (fbSelectedItems.data.length == 0 ? "" : " to Facebook's " + fbSelectedItems.data.items[0].data.name + (fsSelectedItems.data.length == 0 ? "" : ' and ')) + (fsSelectedItems.data.length == 0 ? "" : " to Foursquare's " + fsSelectedItems.data.items[0].data.name);
								multipleCheckinBtn.setText(text);
								var node = this.getNode(item);
								Ext.fly(node).removeCls(this.selectedItemCls);
							}
						}));
						var gpTab = getGpPlacesTab(placeList.store, list);
						var dockedItems = getDockedItems();
						setGpStore(placeList.store);
						 if (shouldMix()) {
							var mixedTab = (fbAccessToken && fsAccessToken && gpAccessToken) ? getFbFsGpMixedPlacesTab(fbTab.defaults.store, fsTab.defaults.store, placeList.store) :
								(fbAccessToken && fsAccessToken) ? getFbFsMixedPlacesTab(fbTab.defaults.store, fsTab.defaults.store) :
								(fbAccessToken && gpAccessToken) ? getFbGpMixedPlacesTab(fbTab.defaults.store, placeList.store) : getFsGpMixedPlacesTab(fsTab.defaults.store, placeList.store);
							var tabPanel = getMixedTabPanel(fbTab, fsTab, gpTab, mixedTab, dockedItems);

						} else {
							var tabPanel = getTabPanel(fbTab, fsTab, gpTab, dockedItems, true);
							if (fbCallback) {
								tabPanel.setActiveItem(fbTab);
							} else if (fsCallback) {
								tabPanel.setActiveItem(fsTab);
							} else if (gpCallback) {
								tabPanel.setActiveItem(gpTab);
							}
						}
						return tabPanel;
					}
				});
			}

            function generatePanel() {
                if (fsAccessToken) {
                    Ext.util.JSONP.request({
                        url: 'https://api.foursquare.com/v2/venues/search',
                        callbackKey: 'callback',
                        params: {
                            ll: getLat() + ',' + getLon(),
                            oauth_token: fsAccessToken,
                            v: '20111218'
                        },
                        callback: function(result) {
                            Ext.regModel('Place', {
                                fields: ['name', 'distance', 'lat', 'lon', 'address', 'category', 'id', 'iconUrl']
                            });
                            var venues = result.response.venues;
                            var places = [];
                            var placeList = {
                                itemTpl: '<div class="contact2"><strong>{name}</strong>, {distance} meters</div>',
                                selModel: {
                                    mode: 'SINGLE',
                                    allowDeselect: true
                                },
                                indexBar: false,

                                onItemDisclosure: {
                                    scope: 'test',
                                    handler: function(record) {
                                        window.location = 'http://johnnyecon.appspot.com/checkin.html?' +
                                            'service=Foursquare' +
                                            '&fsName=' + record.get('name') +
                                            '&lat=' + record.get('lat') +
                                            '&lon=' + record.get('lon') +
                                            '&distance=' + record.get('distance') +
                                            '&address=' + record.get('address') +
                                            '&category=' + record.get('category') +
                                            '&id=' + record.get('id') +
                                            '&iconUrl=' + record.get('iconUrl') +
                                            '&curLat=' + getLat() +
                                            '&curLon=' + getLon() +
                                            '&fsAccessToken=' + fsAccessToken;
                                    }
                                },

                                store: new Ext.data.Store({
                                    model: 'Place',
                                    sorters: 'distance',
                                    getGroupString : function(record) {
                                        return record.get('distance');
                                    },

                                    data: places
                                })
                            };
                            for (i=0; i<venues.length; i++) {
                                venues[i].categories.length > 0 ?
                                placeList.store.add({name: venues[i].name, distance: venues[i].location.distance, lat: venues[i].location.lat, lon: venues[i].location.lng, address: venues[i].location.address, category: venues[i].categories.name, iconUrl: venues[i].categories[0].icon.prefix + venues[i].categories[0].icon.sizes[0] + venues[i].categories[0].icon.name, id: venues[i].id}) :
                                placeList.store.add({name: venues[i].name, distance: venues[i].location.distance, lat: venues[i].location.lat, lon: venues[i].location.lng, address: venues[i].location.address, category: venues[i].categories.name, id: venues[i].id});
                            }
                            list = new Ext.List(Ext.apply(placeList, {
                                onItemSelect: function(item) {
                                    fsSelectedItems.removeAll(true);
                                    fsSelectedItems.add({id: item.data.id, name: item.data.name, accessToken: fsAccessToken, lat: item.data.lat, lon: item.data.lon});
                                    var text = "Multiple Checkin" + (fbSelectedItems.data.length == 0 ? "" : " to Facebook's " + fbSelectedItems.data.items[0].data.name + ' and ') + " to Foursquare's " + item.data.name + (gpSelectedItems.data.length == 0 ? "" : " and to Google's " + gpSelectedItems.data.items[0].data.name);
                                    multipleCheckinBtn.setText(text);
                                    var node = this.getNode(item);
                                    Ext.fly(node).addCls(this.selectedItemCls);
                                },
                                onItemDeselect: function(item) {
                                    fsSelectedItems.removeAll(true);
                                    var text = "Multiple Checkin" + (fbSelectedItems.data.length == 0 ? "" : " to Facebook's " + fbSelectedItems.data.items[0].data.name + (gpSelectedItems.data.length == 0 ? "" : ' and ')) + (gpSelectedItems.data.length == 0 ? "" : " to Google's " + gpSelectedItems.data.items[0].data.name);
                                    multipleCheckinBtn.setText(text);
                                    var node = this.getNode(item);
                                    Ext.fly(node).removeCls(this.selectedItemCls);
                                }
                            }));
                            var fsTab = getFsPlacesTab(placeList.store, list);
                            if (fbAccessToken) {
                                Ext.util.JSONP.request({
                                    url: 'https://graph.facebook.com/search',
                                    callbackKey: 'callback',
                                    params: {
                                        type: 'place',
                                        center: getLat() + ',' + getLon(),
                                        distance: '500',
                                        access_token: fbAccessToken
                                    },
                                    callback: function(result) {
                                        Ext.regModel('Place', {
                                            fields: ['name', 'distance', 'lat', 'lon', 'category', 'id']
                                        });
                                        var fbPlaces = result.data;
                                        var places = [];
                                        var placeList = {
                                            itemTpl: '<div class="contact2"><strong>{name}</strong>, {distance} meters</div>',
                                            selModel: {
                                                mode: 'SINGLE',
                                                allowDeselect: true
                                            },
                                            indexBar: false,

                                            onItemDisclosure: {
                                                scope: 'test',
                                                handler: function(record, btn, index) {
                                                    window.location = 'http://johnnyecon.appspot.com/checkin.html?' +
                                                        'service=Facebook&fbName=' + record.get('name') + '' +
                                                        '&lat=' + record.get('lat') +
                                                        '&lon=' + record.get('lon') +
                                                        '&distance=' + record.get('distance') +
                                                        '&address=' + record.get('address') +
                                                        '&category=' + record.get('category') +
                                                        '&id=' + record.get('id') +
                                                        '&curLat=' + getLat() +
                                                        '&curLon=' + getLon() +
                                                        '&fbAccessToken=' + fbAccessToken;
                                                }
                                            },

                                            store: new Ext.data.Store({
                                                model: 'Place',
                                                sorters: 'distance',
                                                getGroupString : function(record) {
                                                    return record.get('distance');
                                                },

                                                data: places
                                            })
                                        };
                                        for (i=0; i<fbPlaces.length; i++) {
                                            placeList.store.add({name: fbPlaces[i].name, distance: distance(fbPlaces[i].location.latitude, fbPlaces[i].location.longitude, getLat(), getLon()), lat: fbPlaces[i].location.latitude, lon: fbPlaces[i].location.longitude, category: fbPlaces[i].category, id: fbPlaces[i].id});
                                        }
                                        var list = new Ext.List(Ext.apply(placeList, {
                                            onItemSelect: function(item) {
                                                fbSelectedItems.removeAll(true);
                                                fbSelectedItems.add({id: item.data.id, name: item.data.name, lat: item.data.lat, lon: item.data.lon});
                                                var text = "Multiple Checkin" + " to Facebook's " + item.data.name + (fsSelectedItems.data.length == 0 ? "" : " and to Foursquare's " + fsSelectedItems.data.items[0].data.name) + (gpSelectedItems.data.length == 0 ? "" : " and to Google's " + gpSelectedItems.data.items[0].data.name);
                                                multipleCheckinBtn.setText(text);
                                                var node = this.getNode(item);
                                                Ext.fly(node).addCls(this.selectedItemCls);
                                            },
                                            onItemDeselect: function(item) {
                                                fbSelectedItems.removeAll(true);
                                                var text = "Multiple Checkin" + (fsSelectedItems.data.length == 0 ? "" : " to Foursquare's " + fsSelectedItems.data.items[0].data.name + (gpSelectedItems.data.length == 0 ? "" : ' and ')) + (gpSelectedItems.data.length == 0 ? "" : " to Google's " + gpSelectedItems.data.items[0].data.name);
                                                multipleCheckinBtn.setText(text);
                                                var node = this.getNode(item);
                                                Ext.fly(node).removeCls(this.selectedItemCls);
                                            }
                                        }));
                                        var fbTab = getFbPlacesTab(placeList.store, list);
                                        if (gpAccessToken) {
                                            getGpCompleteTabPanel(fbTab, fsTab);
                                        } else {
                                            mixedTab = getFbFsMixedPlacesTab(fbTab.defaults.store, fsTab.defaults.store);
                                            getMixedTabPanel(fbTab, fsTab, getGpBtnTab(), mixedTab, dockedItems);
                                        }
                                    }
                                });
                            } else {
                                var fbTab = getFbBtnTab();
                                gpAccessToken ? getGpCompleteTabPanel(fbTab, fsTab) : getTabPanel(fbTab, fsTab, getGpBtnTab(), dockedItems, true);
                            }
                        }
                    });
                } else {
                    var fsTab = getFsBtnTab();
                    if (fbAccessToken) {
                        Ext.util.JSONP.request({
                            url: 'https://graph.facebook.com/search',
                            callbackKey: 'callback',
                            params: {
                                type: 'place',
                                center: getLat() + ',' + getLon(),
                                distance: '500',
                                access_token: fbAccessToken
                            },
                            callback: function(result) {
                                Ext.regModel('Place', {
                                    fields: ['name', 'distance', 'lat', 'lon', 'category', 'id']
                                });
                                var fbPlaces = result.data;
                                var places = [];
                                var placeList = {
                                    itemTpl: '<div class="contact2"><strong>{name}</strong>, {distance} meters</div>',
                                    selModel: {
                                        mode: 'SINGLE',
                                        allowDeselect: true
                                    },
                                    indexBar: false,

                                    onItemDisclosure: {
                                        scope: 'test',
                                        handler: function(record, btn, index) {
                                            window.location = 'http://johnnyecon.appspot.com/checkin.html?' +
                                                'service=Facebook&fbName=' + record.get('name') +
                                                '&lat=' + record.get('lat') +
                                                '&lon=' + record.get('lon') +
                                                '&distance=' + record.get('distance') +
                                                '&address=' + record.get('address') +
                                                '&category=' + record.get('category') +
                                                '&id=' + record.get('id') +
                                                '&curLat=' + getLat() +
                                                '&curLon=' + getLon() +
                                                '&fbAccessToken=' + fbAccessToken;
                                        }
                                    },

                                    store: new Ext.data.Store({
                                        model: 'Place',
                                        sorters: 'distance',
                                        getGroupString : function(record) {
                                            return record.get('distance');
                                        },

                                        data: places
                                    })
                                };
                                for (i=0; i<fbPlaces.length; i++) {
                                    placeList.store.add({name: fbPlaces[i].name, distance: distance(fbPlaces[i].location.latitude, fbPlaces[i].location.longitude, getLat(), getLon()), lat: fbPlaces[i].location.latitude, lon: fbPlaces[i].location.longitude, category: fbPlaces[i].category, id: fbPlaces[i].id});
                                }
                                var list = new Ext.List(Ext.apply(placeList, {
                                    onItemSelect: function(item) {
                                        fbSelectedItems.removeAll(true);
                                        fbSelectedItems.add({id: item.data.id, name: item.data.name, lat: item.data.lat, lon: item.data.lon});
                                        var text = "Multiple Checkin" + " to Facebook's " + item.data.name + (fsSelectedItems.data.length == 0 ? "" : " and Foursquare's " + fsSelectedItems.data.items[0].data.name) + (gpSelectedItems.data.length == 0 ? "" : " and Google's " + gpSelectedItems.data.items[0].data.name);
                                        multipleCheckinBtn.setText(text);
                                        var node = this.getNode(item);
                                        Ext.fly(node).addCls(this.selectedItemCls);
                                    },
                                    onItemDeselect: function(item) {
                                        fbSelectedItems.removeAll(true);
                                        var text = "Multiple Checkin" + (fsSelectedItems.data.length == 0 ? "" : " to Foursquare's " + fsSelectedItems.data.items[0].data.name + (gpSelectedItems.data.length == 0 ? "" : ' and ')) + (gpSelectedItems.data.length == 0 ? "" : " Google's " + gpSelectedItems.data.items[0].data.name);
                                        multipleCheckinBtn.setText(text);
                                        var node = this.getNode(item);
                                        Ext.fly(node).removeCls(this.selectedItemCls);
                                    }
                                }));
                                var fbTab = getFbPlacesTab(placeList.store, list);
                                gpAccessToken ? getGpCompleteTabPanel(fbTab, fsTab) : getTabPanel(fbTab, fsTab, getGpBtnTab(), dockedItems, true)
                            }
                        });
                    } else {
                        var fbTab = getFbBtnTab();
                        gpAccessToken ? getGpCompleteTabPanel(fbTab, fsTab) : getTabPanel(fbTab, fsTab, getGpBtnTab(), dockedItems, true)
                    }
                }
            }

            function getLoadingPanel() {
                var dockedItems = [
                    {
                        xtype: 'toolbar',
                        title: 'Check In',
                        ui: 'dark',
                        dock: 'top',
                        items: [accountsBtn,{xtype: 'spacer'},more]
                    },
                    {
                        xtype: 'toolbar',
                        ui: 'dark',
                        dock: 'bottom'
                    }
                ];
                new Ext.TabPanel({
                    tabBar: {
                        dock: 'bottom',
                        layout: {
                            pack: 'center'
                        }
                    },
                    fullscreen: true,
                    type: 'dark',
                    sortable: true,
                    dockedItems: dockedItems
                });
            }

			var dockedItems = getDockedItems();
			var geo = new Ext.util.GeoLocation({
				autoUpdate: false,
				listeners: {
					locationupdate: function(geo) {
                        jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
                        jasmine.getEnv().execute();
                        getLoadingPanel();
						setLat(geo.latitude);
						setLon(geo.longitude);
						generatePanel();
					},
					locationerror: function(geo, bTimeout, bPermissionDenied, bLocationUnavailable, message) {
						if (bTimeout) {
							var msg = 'Timeout occurred.'
						} else if (bPermissionDenied) {
							var msg = 'Permission Denied. Please check your browser settings and try again'
						} else {
							var msg = 'Location Unavailable. Google APIS is currently not responding because your machine reached the maximum allowed requests..The places fetched and displayed are in Athens.. Please try again later.'
						}
						getLoadingPanel();
                        myMask.hide();
                        Ext.Msg.alert('Error', msg);
						console.log(msg + '(' + message + ')');
                        setLat(37.97918);
                        setLon(23.716647);
                        generatePanel();
					}
				}
			});
			geo.updateLocation();
        }
    }
});