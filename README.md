# epic-sandbox
Testing standalone and EHR launch for epic app on vendor services. 

This is a POC of a health app working through both EHR and sandalone launch 

## Setup
Create an application on vendorservices
Configure `client_id` & `client_secret` on .env

## EHR Launch

![Screenshot 2024-06-19 at 12 20 46 PM](https://github.com/nfallahi/epic-sandbox/assets/124065159/1997626b-11d5-4214-8241-986918d2ae3c)


### How to run
`npm install && npm run dev`
Go to vendor services -> simulator -> Smart on FHIR -> choose the app you configured

Set the launch url as `http://localhost:3000/launch` and choose one of the options and click on run. Copy/paste the url in a new tab on browser, and you should be logged in!


## Standalone Launch

![Screenshot 2024-06-19 at 12 20 56 PM](https://github.com/nfallahi/epic-sandbox/assets/124065159/6f798028-0aa8-4ab5-b748-3398aa3b8f6b)

### How to run
`npm install && npm run dev`
Go to `http://localhost:3000` -> click on login -> you are taken to myChart -> login with Epic sandbox credentials (myChartTeddy / epic) 
You should be logged in!

## References
https://fhir.epic.com/Documentation?docId=oauth2&section=EmbeddedOauth2Launch
https://fhir.epic.com/Documentation?docId=oauth2&section=standaloneOauth2Launch
