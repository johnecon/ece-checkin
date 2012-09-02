/**
 * Credits to http://www.sencha.com/forum/showthread.php?144451-How-to-ger-Url-parameters-with-Sencha-Touch
 */

function getUrlParameter(name, url){
	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var regexS = "[\\#?&]"+name+"=([^&#]*)";
	var regex = new RegExp( regexS );
	var results = regex.exec( url ? url : window.location.href );
	if( results == null )
		return "";
	else
		return results[1];
}





/**
 * Credits to http://www.tek-tips.com/faqs.cfm?fid=5442
 */

function getDecodedUrlParameter(varname, url)
{
	var url = url ? url : window.location.href;
	var qparts = url.split("?");
	if (qparts.length == 0)
	{
		return "";
	}
	var query = qparts[1];
	var vars = query.split("&");
	var value = "";
	for (var i=0;i<vars.length;i++)
	{
		var parts = vars[i].split("=");
		if (parts[0] == varname) {
			value = parts[1];
			break;
		}
	}
	value = decodeURI(value);
	return value;
}

/**
 *
 * Credits to http://www.w3schools.com/js/js_cookies.asp
 */
function setCookie(c_name,value,expireseconds)
{
    var exdate=new Date();
//    exdate.setDate(exdate.getDate() + exdays);
    exdate.setTime(exdate.getTime()+(expireseconds*1000))
    var c_value=escape(value) + ((expireseconds==null) ? "" : "; expires="+exdate.toUTCString());
    document.cookie=c_name + "=" + c_value;
}

function getCookie(c_name)
{
    var i,x,y,ARRcookies=document.cookie.split(";");
    for (i=0;i<ARRcookies.length;i++)
    {
        x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
        y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
        x=x.replace(/^\s+|\s+$/g,"");
        if (x==c_name)
        {
            return unescape(y);
        }
    }
}

function deleteAllCookies()
{
    var mydate = new Date();
    mydate.setTime(mydate.getTime() - 1);
    document.cookie = "fbAccessToken=; expires=" + mydate.toGMTString();
    document.cookie = "fsAccessToken=; expires=" + mydate.toGMTString();
    document.cookie = "gpAccessToken=; expires=" + mydate.toGMTString();
}

 function sleep(delay)
 {
     var start = new Date().getTime();
     while (new Date().getTime() < start + delay);
 }

/**
 * Credits to http://www.translatum.gr/converter/greek-transliteration.htm
 */

function toUpperLatinChar(char) {
    return ((char == 'α') ||
        (char == 'ά') ||
        (char == 'Α') ||
        (char == 'Ά')) ? 'A' :
        ((char == 'β') ||
            (char == 'Β')) ? 'B' :
            ((char == 'γ') ||
                (char == 'Γ')) ? 'G' :
                ((char == 'δ') ||
                    (char == 'Δ')) ? 'D' :
                    ((char == 'ε') ||
                        (char == 'έ') ||
                        ((char == 'Ε')) ||
                        (char == 'Έ')) ? 'E' :
                        ((char == 'ζ') ||
                            (char == 'Ζ')) ? 'Z' :
                            ((char == 'η') ||
                                (char == 'ή') ||
                                (char == 'Η') ||
                                (char == 'Ή')) ? 'I' :
                                ((char == 'θ') ||
                                    (char == 'Θ')) ? 'TH' :
                                    ((char == 'ι') ||
                                        (char == 'ϊ') ||
                                        (char == 'ί') ||
                                        (char == 'Ι') ||
                                        (char == 'Ί')) ? 'I' :
                                        ((char == 'κ') ||
                                            (char == 'Κ')) ? 'K' :
                                            ((char == 'λ') ||
                                                (char == 'Λ')) ? 'L' :
                                                ((char == 'μ') ||
                                                    (char == 'Μ')) ? 'M' :
                                                    ((char == 'ν') ||
                                                        (char == 'Ν')) ? 'N' :
                                                        ((char == 'ξ') ||
                                                            (char == 'Ξ')) ? 'X' :
                                                            ((char == 'ο') ||
                                                                (char == 'ό') ||
                                                                (char == 'Ο') ||
                                                                (char == 'Ό')) ? 'O' :
                                                                ((char == 'π') ||
                                                                    (char == 'Π')) ? 'P' :
                                                                    ((char == 'ρ') ||
                                                                        (char == 'Ρ')) ? 'R' :
                                                                        ((char == 'σ') ||
                                                                            (char == 'ς') ||
                                                                            (char == 'Σ')) ? 'S' :
                                                                            ((char == 'τ') ||
                                                                                (char == 'Τ')) ? 'T' :
                                                                                ((char == 'υ') ||
                                                                                    (char == 'ύ') ||
                                                                                    (char == 'Υ') ||
                                                                                    (char == 'Ύ')) ? 'I' :
                                                                                    ((char == 'φ') ||
                                                                                        (char == 'Φ')) ? 'F' :
                                                                                        ((char == 'χ') ||
                                                                                            (char == 'Χ')) ? 'CH' :
                                                                                            ((char == 'ψ') ||
                                                                                                (char == 'Ψ')) ? 'PS' :
                                                                                                ((char == 'ω') ||
                                                                                                    (char == 'ώ') ||
                                                                                                    (char == 'Ω') ||
                                                                                                    (char == 'Ώ')) ? 'O' :
                                                                                                    ((char == 'a') ||
                                                                                                        (char == 'à') ||
                                                                                                        (char == 'á') ||
                                                                                                        (char == 'ä') ||
                                                                                                        (char == 'â')) ? 'A' :
                                                                                                        (char == 'b') ? 'B' :
                                                                                                            (char == 'c') ? 'C' :
                                                                                                                (char == 'd') ? 'D' :
                                                                                                                    ((char == 'e') ||
                                                                                                                        (char == 'ë') ||
                                                                                                                        (char == 'ê') ||
                                                                                                                        (char == 'é') ||
                                                                                                                        (char == 'è')) ? 'E' :
                                                                                                                        (char == 'f') ? 'F' :
                                                                                                                            (char == 'g') ? 'G':
                                                                                                                                (char == 'h') ? 'H' :
                                                                                                                                    ((char == 'i') ||
                                                                                                                                        (char == 'ì') ||
                                                                                                                                        (char == 'í') ||
                                                                                                                                        (char == 'ï') ||
                                                                                                                                        (char == 'î')) ? 'I' :
                                                                                                                                        (char == 'j') ? 'J' :
                                                                                                                                            (char == 'k') ? 'K' :
                                                                                                                                                (char == 'l') ? 'L' :
                                                                                                                                                    (char == 'm') ? 'M' :
                                                                                                                                                        (char == 'n') ? 'N' :
                                                                                                                                                            ((char == 'o') ||
                                                                                                                                                                (char == 'ó') ||
                                                                                                                                                                (char == 'ò') ||
                                                                                                                                                                (char == 'ö') ||
                                                                                                                                                                (char == 'ô')) ? 'O' :
                                                                                                                                                                (char == 'p') ? 'P' :
                                                                                                                                                                    (char == 'q') ? 'Q' :
                                                                                                                                                                        (char == 'r') ? 'R' :
                                                                                                                                                                            (char == 's') ? 'S' :
                                                                                                                                                                                (char == 't') ? 'T' :
                                                                                                                                                                                    ((char == 'u') ||
                                                                                                                                                                                        (char == 'ù') ||
                                                                                                                                                                                        (char == 'ú') ||
                                                                                                                                                                                        (char == 'ü') ||
                                                                                                                                                                                        (char == 'û'))? 'U' :
                                                                                                                                                                                        (char == 'v') ? 'V' :
                                                                                                                                                                                            (char == 'w') ? 'W' :
                                                                                                                                                                                                (char == 'x') ? 'X' :
                                                                                                                                                                                                    (char == 'y') ? 'Y' :
                                                                                                                                                                                                        (char == 'z') ? 'Z' : char;
}

function translitToUpperLatin(string) {
    string = string.toLowerCase();
    var translitString = '';
    for (var i=0; i < string.length; i++) {
        var char = string[i];
        char = toUpperLatinChar(char);
        translitString += char;
    }
    return translitString;
}

function mailInvalid(mail) {
    for (var i=0; i<mail.length; i++) {
       if (mail[i] == '@') {
           return false;
       }
    }
    return true;
}

function compareItems(fbItem, fsItem) {
    return (nameCriterion(fbItem, fsItem) && distanceCriterion(fbItem, fsItem));
}

function nameCriterion(fbItem, fsItem) {
    return ((fbItem.data.name == fsItem.data.name) || (removeMarks(translitToUpperLatin(fbItem.data.name)) == removeMarks(translitToUpperLatin(fsItem.data.name))));
}

function distanceCriterion(fbItem, fsItem) {
    return (Math.abs(fbItem.data.distance-fsItem.data.distance) < 60);
}

/**
 *
 * Credits to http://www.zipcodeworld.com/samples/distance.js.html
 */

function distance(lat1, lon1, lat2, lon2) {
    var radlat1 = Math.PI * lat1/180;
    var radlat2 = Math.PI * lat2/180;
    var radlon1 = Math.PI * lon1/180;
    var radlon2 = Math.PI * lon2/180;
    var theta = lon1-lon2;
    var radtheta = Math.PI * theta/180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180/Math.PI;
    dist = dist * 60 * 1.1515;
    dist = dist * 1609.344;
    return parseInt(dist);
}

function removeQuoteMarks(string) {
    var stringWithoutQuotationMarks = '';
    for (var i=0; i < string.length; i++) {
        var char = string[i];
        if (!((char == '"') || (char == "'"))) {
            stringWithoutQuotationMarks += char;
        }
    }
    return stringWithoutQuotationMarks;
}

function removeMarks(string) {
    var stringWithoutMarks = '';
    for (var i=0; i < string.length; i++) {
        var char = string[i];
        if (!((char == "!") || (char == '-') || (char == ' '))) {
            stringWithoutMarks += char;
        }
    }
    return removeQuoteMarks(stringWithoutMarks);
}

function createButton(title, onTap, ui, cls, style) {
    var button = new Ext.Button({
        xtype: 'button',
        ui: ui? ui : 'round',
        style: style ? style : '',
        cls: cls ? cls : '',
        text: title ? title : '',
        layout: {
            pack: 'center'
        }
    });

    button.on('tap', onTap);
    return button;
}