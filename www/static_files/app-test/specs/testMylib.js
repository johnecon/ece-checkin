describe("MyLib", function() {

    it("Has All Functions Needed", function() {
        expect(getUrlParameter).toBeDefined();
        expect(getDecodedUrlParameter).toBeDefined();
        expect(getCookie).toBeDefined();
        expect(toUpperLatinChar).toBeDefined();
        expect(translitToUpperLatin).toBeDefined();
        expect(mailInvalid).toBeDefined();
        expect(compareItems).toBeDefined();
        expect(nameCriterion).toBeDefined();
        expect(distanceCriterion).toBeDefined();
        expect(distance).toBeDefined();
        expect(removeQuoteMarks).toBeDefined();
        expect(removeMarks).toBeDefined();
        expect(createButton).toBeDefined();
    });

    it("Gets Url Parameter", function() {
        var urlParameter = getUrlParameter('s', 'http://johnnyecon.appspot.com/index.html?s=1&f=2');
        expect(urlParameter).toEqual('1');
        var urlParameter = getUrlParameter('s342a', 'http://johnnyecon.appspot.com/index.html?s342a=1&f=2');
        expect(urlParameter).toEqual('1');
        var urlParameter = getUrlParameter('f', 'http://johnnyecon.appspot.com/index.html?s342a=1&f=2');
        expect(urlParameter).toEqual('2');
        var urlParameter = getUrlParameter('bar', 'www.foo.com/file?bar=%25ozog');
        expect(urlParameter=='%ozog').toBeFalsy();
    });

    it("Decodes Url Parameter", function() {
         var urlParameter = getDecodedUrlParameter('bar', 'www.foo.com/file?bar=%25ozog');
        expect(urlParameter).toEqual('%ozog');
    });

    it("Sets And Gets Cookies", function() {
         expect(getCookie('foo')).toBeUndefined();
         setCookie('foo', 'bar', 1);
         expect(getCookie('foo')).toEqual('bar');
    });

    it("Delete All Cookies", function() {
        setCookie('fbAccessToken', 'bar', 1);
        deleteAllCookies();
        expect(getCookie('fbAccessToken')).toBeUndefined();
    });

    it("Translites A Char To Upper Latin Char", function() {
//         expect(toUpperLatinChar('f')).toEqual('F');
//        expect(toUpperLatinChar('F')).toEqual('F');
//         expect(toUpperLatinChar('φ')).toEqual('F');
//        expect(toUpperLatinChar('ά')).toEqual('A');
//         expect(toUpperLatinChar('./')).toEqual('./');
//        todo: FIXME
    });

    it("Translites A String To Upper Latin String", function() {
//        expect(translitToUpperLatin('α')).toEqual('A');
//        todo: FIXME
    });

    it("Validates An Email", function() {
        expect(mailInvalid('123joil.com')).toBeTruthy();
        expect(mailInvalid('123@joilcom')).toBeFalsy();
    });

    it("Compare Items According To The Name Criterion", function() {
        testItem1 = new Object();
        testItem1.data = new Object();
        testItem2 = new Object();
        testItem2.data = new Object();
        testItem1.data.name = 'Foo!';
        testItem1.data.distance = '4';
        testItem2.data.name = 'Foo';
        testItem2.data.distance = '3';
        expect(compareItems(testItem1, testItem2)).toBeTruthy();
        testItem1.data.name = 'Foo!';
        testItem1.data.distance = '4';
        testItem2.data.name = 'Fo';
        testItem2.data.distance = '3';
        expect(compareItems(testItem1, testItem2)).toBeFalsy();
        testItem1.data.name = '!Foo - !';
        testItem1.data.distance = '4';
        testItem2.data.name = '!- Foo';
        testItem2.data.distance = '3';
        expect(compareItems(testItem1, testItem2)).toBeTruthy();
    });

    it("Compare Items According To The Distance Criterion", function() {
        testItem1 = new Object();
        testItem1.data = new Object();
        testItem2 = new Object();
        testItem2.data = new Object();
        testItem1.data.name = 'Foo!';
        testItem1.data.distance = '59';
        testItem2.data.name = 'Foo';
        testItem2.data.distance = '0';
        expect(compareItems(testItem1, testItem2)).toBeTruthy();
        testItem1.data.name = 'Foo!';
        testItem1.data.distance = '60';
        testItem2.data.name = 'Foo';
        testItem2.data.distance = '0';
        expect(compareItems(testItem1, testItem2)).toBeFalsy();
    });

    it("Calculate Geospatial Distance", function() {
        expect(distance(10.112233, 10.332211, 10.332211, 10.112233)).toEqual(34317);
        expect(distance(10.112233, 10.332211, 10.112233, 10.332211)).toEqual(0);
    });

    it("Remove Marks From String", function() {
        expect(removeMarks("f!o-o !b'a" + '"' + 'r')).toEqual('foobar');
    });
});