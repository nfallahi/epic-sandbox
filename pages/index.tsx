import { Button, Link, Page, Text} from '@vercel/examples-ui'

const initiateEpicAuth = () => {
    const clientId = process.env.NEXT_PUBLIC_EPIC_MYCHART_CLIENT_ID;
    const redirectUri = encodeURIComponent('http://localhost:3000/callback'); // Replace with your registered redirect URI
    const state = Math.random().toString(36).substring(2); // Generate a random state
    const scope = encodeURIComponent('openid fhirUser Patient.read'); // Add scopes as required
    const aud = encodeURIComponent('https://vendorservices.epic.com/interconnect-amcurprd-oauth'); // Epic FHIR base URL

    const authorizationUrl = `https://vendorservices.epic.com/interconnect-amcurprd-oauth/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}&aud=${aud}`;

    // Redirect user to the authorization URL
    window.location.href = authorizationUrl;
};


// Your Next.js component
export default function Home() {

    // Function to handle redirection to MyChart with SSO
    const redirectToMyChartBilling = () => {
        const myChartBaseUrl = 'https://vendorservices.epic.com/mychart-amcurprd'
        const relayState = JSON.stringify({
            PatientID: '', // Add patient ID if accessing another patient's record
            Resource: '/Billing/Summary' // Example resource URL
        })

        // Construct the redirect URL
        //const redirectUrl = `${myChartBaseUrl}/saml/login?SAMLRequest=${encodeURIComponent(base64Encode(samlRequest))}&RelayState=${encodeURIComponent(encodedRelayState)}`;
        const redirectUrl = 'https://vendorservices.epic.com/mychart-amcurprd/Billing/Summary'
        // Redirect to MyChart with the SAML request and relayState
        window.location.href = redirectUrl
    }

    const redirectToMyChartAppointments = () => {
        const myChartBaseUrl = 'https://vendorservices.epic.com/mychart-amcurprd'
        const relayState = JSON.stringify({
            PatientID: '', // Add patient ID if accessing another patient's record
            Resource: '/Visits/' // Example resource URL
        })

        // Construct the redirect URL
        //const redirectUrl = `${myChartBaseUrl}/saml/login?SAMLRequest=${encodeURIComponent(base64Encode(samlRequest))}&RelayState=${encodeURIComponent(encodedRelayState)}`;
        const redirectUrl = 'https://vendorservices.epic.com/mychart-amcurprd/visits'
        // Redirect to MyChart with the SAML request and relayState
        window.location.href = redirectUrl
    }

    return (
        <Page>
            <section className="flex flex-col gap-6">
                <Text variant="h1">Epic Sandbox</Text>
            </section>
            <hr className="border-t border-accents-2 my-3" />

            <section className="flex flex-col gap-3">
                    <section className="text-center">
                        <Text className="text-lg my-3">Please login using Epic MyChart credentials. Click <Link target='_blank' href="https://fhir.epic.com/Documentation?docId=testpatients">
                            here
                        </Link> to access Epic MyChart Sandbox test data.</Text>
                        <Button size="lg" onClick={initiateEpicAuth}>
                            Sign in with Epic MyChart
                        </Button>
                    </section>
            </section>
        </Page>
    )
}

// Home.Layout = Layout
