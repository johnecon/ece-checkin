describe("Basic Assumptions", function() {

    it("all the buttons are there", function() {
        deleteAllCookies();
        expect(getStartedButton).toBeDefined();
        expect(fbLogin).toBeDefined();
        expect(fsLogin).toBeDefined();
        expect(gpLogin).toBeDefined();
    });
});