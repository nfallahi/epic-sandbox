// pages/api/launch.js

export default async function handler(req, res) {
    const { iss, launch } = req.query;

    if (!iss || !launch) {
        res.status(400).send('Missing iss or launch parameter');
        return;
    }

    // Define the allowed iss URLs
    const ALLOWED_ISS = [
        'https://vendorservices.epic.com/interconnect-amcurprd-oauth/api/FHIR/R4',
        // add other allowed iss URLs here
    ];

    if (!ALLOWED_ISS.includes(iss)) {
        res.status(400).send('Invalid iss parameter');
        return;
    }

    try {
        // Fetch the OAuth2 authorization endpoint from the iss server
        const configResponse = await fetch(`${iss}/.well-known/smart-configuration`);
        if (!configResponse.ok) {
            throw new Error('Failed to fetch SMART configuration');
        }
        const config = await configResponse.json();
        const authorizationEndpoint = config.authorization_endpoint;


        // Redirect to the authorization URL
        const clientId = process.env.EPIC_MYCHART_CLIENT_ID;
        const redirectUri = 'http://localhost:3000/callback';
        const scope = 'launch';

        const authUrl = `${authorizationEndpoint}?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&launch=${launch}&aud=${iss}&state=abc123`;

        res.redirect(authUrl);
    } catch (error) {
        console.error('Error during launch:', error);
        res.status(500).send('Internal Server Error');
    }
}
