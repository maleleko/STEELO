## functionality bugs & to do

**navbar:**
- add a drawer for shop onhover/onclick

**toggling cart drawer:**
- remove href functionality and change to show onclick and hide onblur - also solves ugly disappearing
- onclick change cart logo to x to close drawer
- maybe remove cart drawer pop up when something is added to cart(doesnt happen already, but url gets an added #cart href )

**search drawer:**
- for mobile: remove href functionality - idk why hydrogen devs thought this was a good idea
- get rid of recommended products for good

**login/reg:**
- make this look better
- implement footer

**index:**
- implement footer section
- ~~implement more "collections" | griptape, hats, shirts, sweaters~~
- implement onHover for desktop view to show collection title and collection description
- figure out how to implement a "best sellers/most popular" product list
- change "recommended products" to something else or just flat out remove it

**cart page:**
- ~~add a recommended/most viewed product section so the cart page doesnt look so bare~~
- ~~change code layout from CartDrawer.jsx to Cart.jsx and vice versa~~
- implement footer

**product page**
- make this look better
- make sure options selector/add to bag is sticky - to ensure products with multiple images can flow right
- add related items section

**search query page:**
- make this look better
- include images, price, etc
- get rid of "load more" just load every item - paginiation might be required
- get rid of the search bar? why is that there
- change "search" h1 to "results for ____"
- potentially implement an actual filter section

**about page:**
- implement this

**team page:**
- implement this


## styling bugs & to do

**body:**
- make entire page 80vw - navbar included

**navbar:**
- add margin or padding to match layout for desktop view
- fix weird issues with mobile viewportScale

**cart drawer:**
- ~~realign items back to how they were before implementing cart page styling~~
- fix cart summary overflow across all mobile devices
- fix weird overflow on li items
- ~~fix padding for cart-summary~~

**search drawer:**
- add proper dropdown animation
- for mobile: search drawer has css grid. 2 items horizontally, 3 sets vertically. essentially a 2x3
- for mobile: add dropdown animation when search icon is clicked/tapped

**cart page** 
- ~~figure out how to make cart-summary div fixed within parent container~~
- ~~1024px or below, pretty much recreate cart drawer layout but still have the cart summary on the side~~
- ~~768px or below, move cart-summary to the bottom of the page~~
- style recommended products div
- for mobile, figure out how to make cart-summary width stay consistent but shrink cart-main width


