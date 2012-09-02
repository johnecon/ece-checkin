Ext.setup({
	tabletStartupScreen: 'tablet_startup.png',
	phoneStartupScreen: 'phone_startup.png',
	icon: 'icon.png',
	glossOnIcon: false,
	onReady: function () {
		var fbAccessToken = getCookie('fbAccessToken');
		var fsAccessToken = getCookie('fsAccessToken');
		var gpAccessToken = getCookie('gpAccessToken');

        var backBtn = new Ext.Button({
            xtype: 'button',
			ui: 'back',
            text: 'Back'
        })

        backBtn.on('tap', function() {
            window.location = 'http://johnnyecon.appspot.com/index.html';
        })

        var submitBtn = new Ext.Button({
                ui: 'confirm-round',
                text: 'Submit your Feedback'
            });

        submitBtn.on('tap', function(){
            if ((form.getValues().name === '') || (form.getValues().email === '') || (form.getValues().description === '')) {
                Ext.Msg.alert('Error', 'All the fields are required and cannot be empty');
            } else if (mailInvalid(form.getValues().email)) {
                Ext.Msg.alert('Error', 'Please provide a valid email address');
            } else {
                function sendFeedback(btn) {
                    if (btn == 'yes') {
                        Ext.util.JSONP.request({
                            url: 'http://johnnyecon.appspot.com/db/',
                            callbackKey: 'callback',
                            params: {
                                transaction: 'feedback',
                                name: form.getValues().name,
                                email: form.getValues().email,
                                description: form.getValues().description
                            },
                            callback: function(feedback) {
                                console.log(feedback);
                                Ext.Msg.alert("Success!", "You successfully submitted your Feedback!");
                            }
                        });
                    }
                }
                Ext.Msg.confirm("Confirm", "Are you sure you want to submit this feedback to the community?", sendFeedback);
            }
        });

        var form;

        Ext.regModel('Feedback', {
            fields: [
                {name: 'name', type: 'string'},
                {name: 'email', type: 'string'},
                {name: 'description', type: 'string'}
            ]
        });

        var formBase = {
            scroll: 'vertical',
            standardSubmit : true,
            items: [{
                    xtype: 'fieldset',
                    title: 'Feedback Info',
                    instructions: 'Please enter the information above.',
                    defaults: {
                        required: true,
                        labelAlign: 'left',
                        labelWidth: '40%'
                    },
                    items: [
                    {
                        xtype: 'textfield',
                        name : 'name',
                        label: 'Name',
                        useClearIcon: true,
                        placeHolder: Ext.is.Phone ? '' : 'Please enter your first name here',
                        autoCapitalize : false
                    }, {
                        xtype: 'emailfield',
                        name : 'email',
                        label: 'Email',
                        placeHolder: Ext.is.Phone ? '' : 'Please enter a valid email here',
                        useClearIcon: true
                    }, {
                        xtype : 'textareafield',
                        name  : 'description',
                        placeHolder: Ext.is.Phone ? '' : 'Please enter a short feedback for us. If requested we will contact you.',
                        label : 'Description',
                        maxLength : 400,
                        maxRows : 6
                    }, submitBtn
                    ]
            }],
            listeners : {
                submit : function(form, result){
                    console.log('success', Ext.toArray(arguments));
                },
                exception : function(form, result){
                    console.log('failure', Ext.toArray(arguments));
                }
            }
        };
        form = new Ext.form.FormPanel(formBase);

        function getDockedItems() {
            var dockedItems = [{
                xtype: 'toolbar',
                title: 'Check In',
                ui: 'dark',
                dock: 'top',
                items: backBtn
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

        var feedbackTab = new Ext.Panel({
            title: 'Give us some Feedback!',
            scroll: true,
            fullscreen: true,
            dockedItems: getDockedItems(),
            items: [form]
        });
	}
});