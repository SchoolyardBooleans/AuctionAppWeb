/* The login_test.js file uses Selenium to test the functionality of logging into our application using
   SalesForce Authentication. Before the tests are run, the server is started. Then, a Selenium driver
   is used to click a few buttons and fill out a few form fields. Then, the one test that is run is an
   assertion to see if the title of the home screen (after authentication) is correct. Then the server
   is shut down*/


var assert = require('assert'),
	test = require('selenium-webdriver/testing'),
	util = require('util'),
	webdriver = require('selenium-webdriver'),
	app = require('../app.js');

var THIRTY_SEC = 30000;

test.describe('Login page', function() {
	var server;
	var driver;

	test.before(function() {
    	server = app.listen(3000);

    	driver = new webdriver.Builder().
			withCapabilities(webdriver.Capabilities.chrome()).
			build();
  	});

	test.it('should work', function() {
		this.timeout(THIRTY_SEC);

		driver.get('http://localhost:3000');
		var loginButton = driver.findElement(webdriver.By.id('login_button'));
		loginButton.click();

		var usernameInput = driver.findElement(webdriver.By.name('username')),
			passwordInput = driver.findElement(webdriver.By.name('pw'));

		usernameInput.sendKeys('dev@schoolyardbooleans.org');
		passwordInput.sendKeys('penguin5');
		
		var sfLoginButton = driver.findElement(webdriver.By.name('Login'));
		sfLoginButton.click();

		// var homepageTitle = driver.getTitle();
		// console.log("MOTHER FUCKER!")
		// return assert.equal("Web App", homepageTitle);


		driver.wait(function () {
    		return driver.isElementPresent(webdriver.By.id("delete_modal"));
		}, 5 * 1000);

		driver.getTitle().then(function(title) {
			console.log("title is: " + util.inspect(title, false, null));
			assert.equal("Auction App", title);
        	// test.assert.equal("Auction App", "No Worky");
           //return assert.equal("wrong title for sure", title, "The title is Auction App");
         });

		var create_auction_btn = driver.findElement(webdriver.By.className('create_auction_btn'));
		create_auction_btn.click();

		var auctionNameInput = driver.findElement(webdriver.By.name('auction_name')),
			startDateInput = driver.findElement(webdriver.By.name('start_date_input')),
			endDateInput = driver.findElement(webdriver.By.name('end_date_input')),
			locationInput = driver.findElement(webdriver.By.name('location_picklist')),
			createAuctionBtn = driver.findElement(webdriver.By.id('submit_auction'));

		auctionNameInput.sendKeys("Test Auction");
		startDateInput.sendKeys("05/13/19, 07:35 PM");
		startDateInput.sendKeys(webdriver.Key.TAB);
		endDateInput.sendKeys("05/15/19, 07:35 PM");
		endDateInput.sendKeys(webdriver.Key.TAB);
		locationInput.click();
		locationInput.sendKeys(webdriver.Key.Down);
		locationInput.sendKeys(webdriver.Key.Enter);
		locationInput.sendKeys(webdriver.Key.Down);
		// locationInput.sendKeys(webdriver.Key.Tab);

		// createAuctionBtn.click();

		driver.wait(function () {
    		return driver.isElementPresent(webdriver.By.id("delete_modal"));
		}, 5 * 1000);

	});

	test.after(function() {
		driver.quit();
    	server.close();
  	});
});