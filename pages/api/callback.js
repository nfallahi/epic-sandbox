import fetch from 'isomorphic-unfetch';

export default async function callback(req, res) {
    console.log("HERE");
    if (req.method === 'GET') {
        const { code } = req.query;

        // Replace with your actual client credentials and endpoint
        const tokenEndpoint = 'https://vendorservices.epic.com/interconnect-amcurprd-oauth/oauth2/token';
        const clientId = process.env.EPIC_MYCHART_CLIENT_ID;;
        const clientSecret = process.env.EPIC_MYCHART_CLIENT_SECRET;
        const redirectUri = 'http://localhost:3000/callback';

        const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

        const formData = new URLSearchParams();
        formData.append('grant_type', 'authorization_code');
        formData.append('code', code);
        formData.append('redirect_uri', redirectUri);

        try {
            const tokenResponse = await fetch(tokenEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${auth}`
                },
                body: formData
            });

            if (!tokenResponse.ok) {
                console.error('Token request failed:', error);
                const error = await tokenResponse.json();
                throw new Error(`Failed to redeem a launch token for an authorization code: ${error.error_description}`);
            }

            const tokenData = await tokenResponse.json();
            res.status(200).json(tokenData);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}
