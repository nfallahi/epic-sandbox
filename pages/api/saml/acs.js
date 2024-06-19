// pages/api/saml.js

export default function handler(req, res) {
    if (req.method === 'POST') {
        // Parse the incoming SAML request
        const { SAMLRequest } = req.body;

        // Process the SAML request as needed
        // For example, you can decode the base64-encoded SAMLRequest

        // Redirect the user to the Billing Summary page of MyChart
        const redirectUrl = 'https://vendorservices.epic.com/mychart-amcurprd/Billing/Summary'; // Change this URL to the appropriate MyChart page
        res.writeHead(302, { Location: redirectUrl });
        res.end();
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}