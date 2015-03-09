/* The login_test.js file uses Selenium to test the functionality of logging into our application using
   SalesForce Authentication. Before the tests are run, the server is started. Then, a Selenium driver
   is used to click a few buttons and fill out a few form fields. Then, the one test that is run is an
   assertion to see if the title of the home screen (after authentication) is correct. Then the server
   is shut down*/


var assert = require('assert'),
	test = require('selenium-webdriver/testing'),
	webdriver = require('selenium-webdriver'),
	app = require('../app.js');

var TEN_SEC = 10000;

test.describe('Login page', function() {
	var server;
	before(function() {
    	server = app.listen(3000);
  	});

	test.it('should work', function() {
		this.timeout(TEN_SEC);

		var driver = new webdriver.Builder().
			withCapabilities(webdriver.Capabilities.chrome()).
			build();

		driver.get('http://localhost:3000');
		var loginButton = driver.findElement(webdriver.By.id('login_button'));
		loginButton.click();

		var usernameInput = driver.findElement(webdriver.By.name('username')),
			passwordInput = driver.findElement(webdriver.By.name('pw'));

		usernameInput.sendKeys('dev@schoolyardbooleans.org');
		passwordInput.sendKeys('penguin2');
		
		var sfLoginButton = driver.findElement(webdriver.By.name('Login'));
		sfLoginButton.click();

		var homepageTitle = driver.getTitle();

		driver.getTitle(function(title) {
           assertEquals("Auction", title);
           assert.equal("Auction App", title);
         });
		
		driver.quit();
	});

	after(function(){
    	server.close();
  	});
});