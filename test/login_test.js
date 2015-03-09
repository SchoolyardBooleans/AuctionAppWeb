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