AuctionAppWeb
=============

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
