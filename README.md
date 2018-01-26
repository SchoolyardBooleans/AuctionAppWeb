AuctionAppWeb
=============
## Intro
This is the web app portion of the bidfresh service. It acts a management tool used for planning, administering, and logging silent auctions.  

The goal of bidfresh was to replace paper, pencils, and spreadsheets in the process of silent auction participation, administration, and planning. Salesforce had approached our class with this challenge since they wanted a good silent auction solution for Nonprofit organizations using their system. bidfresh consists of a full-stack API and web application for auction administration, an iOS application for bidding, and a saleforce app for persisting all useful auction data in a saleforce organization.    

## Installation

You must complete the saleforce app installation instructions before you can access the web app. Access instructions are also included. Installation instructions: https://salesforcecapstone2015.github.io/schoolyard-booleans.html

**UPDATE 1/26/2018:** I can't download the app package listed in the above instructions anymore. Saleforce updates their organization service regularly, so it's possible the app was removed from the marketplace because it's not compatible with current organizations. No updates are planned at this time.

## API endpoints
/auctions         					GET   get all auctions           
/auctions         					PUT   create auctions 					(Authenticated)
/auctions/:id     					GET   get single auction 				
/auctions/:id/items     			GET   get auction items
/auctions/:id/items     			PUT   create auction item 				(Authenticated)
/auctions/:id/items/:id     		GET   get auction item 					
/auctions/:id/items/:id/bids  	GET   get auction item bids
/auctions/:id/items/:id/bids  	PUT   put auction item bid
/auctions/:id/bidders            GET   get auction bidders           (Authenticated)
/auctions/:id/stats           	GET   get auction stats					(Authenticated)
/auctions/:id/items/:id/stats    GET   get item stats						(Authenticated)



Web Auction App for Capstone 2014-15
