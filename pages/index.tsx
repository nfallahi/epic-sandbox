import { signIn, signOut, useSession } from 'next-auth/react'
import { Button, Layout, Link, Page, Text, List, Code } from '@vercel/examples-ui'
import { useEffect } from 'react'
import xmlbuilder from 'xmlbuilder'
import { SignedXml } from 'xml-crypto'
import crypto from 'crypto'

// Simple base64 encoding function
const base64Encode = (str) => Buffer.from(str).toString('base64')

const privateKey = process.env.PRIVATE_KEY;

// Function to create a SAML Request
const generateSamlRequest = () => {
    const id = `_${crypto.randomBytes(10).toString('hex')}`
    const issueInstant = new Date().toISOString()

    const samlRequest = xmlbuilder.create('samlp:AuthnRequest')
        .att('xmlns:samlp', 'urn:oasis:names:tc:SAML:2.0:protocol')
        .att('ID', id)
        .att('Version', '2.0')
        .att('IssueInstant', issueInstant)
        .att('Destination', 'https://vendorservices.epic.com/mychart-amcurprd/saml/login')
        .att('AssertionConsumerServiceURL', 'http://localhost:3000/api/saml/acs')
        .ele('saml:Issuer', { xmlns: 'urn:oasis:names:tc:SAML:2.0:assertion' }, 'http://localhost:3000')
        .up()
        .ele('samlp:NameIDPolicy', { Format: 'urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified', AllowCreate: 'true' })
        .up()
        .ele('samlp:RequestedAuthnContext', { Comparison: 'exact' })
        .ele('saml:AuthnContextClassRef', { xmlns: 'urn:oasis:names:tc:SAML:2.0:assertion' }, 'urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport')
        .end({ pretty: true });

    const signedXml = new SignedXml();
    signedXml.addReference({
        xpath: "//*[local-name(.)='AuthnRequest']",
        transforms: ['http://www.w3.org/2000/09/xmldsig#enveloped-signature'],
        digestAlgorithm: 'http://www.w3.org/2001/04/xmlenc#sha256'
    });
    signedXml.signingKey = privateKey;
    signedXml.signatureAlgorithm = 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256';
    signedXml.keyInfoProvider = {
        getKeyInfo: () => '<X509Data></X509Data>',
        getKey: () => privateKey,
    };
    signedXml.canonicalizationAlgorithm = 'http://www.w3.org/2001/10/xml-exc-c14n#'; // Added canonicalization algorithm
    signedXml.privateKey = privateKey

    signedXml.computeSignature(samlRequest);

    return signedXml.getSignedXml();
};

const initiateEpicAuth = () => {
    const clientId = '1e79c712-8e45-486d-a0b2-797a8865005c'
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
    const { data, status } = useSession()

    // Function to handle redirection to MyChart with SSO
    const redirectToMyChartBilling = () => {
        const myChartBaseUrl = 'https://vendorservices.epic.com/mychart-amcurprd'
        const relayState = JSON.stringify({
            PatientID: '', // Add patient ID if accessing another patient's record
            Resource: '/Billing/Summary' // Example resource URL
        })

        const encodedRelayState = base64Encode(relayState);
        const samlRequest = generateSamlRequest();

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

        const encodedRelayState = base64Encode(relayState);
        const samlRequest = generateSamlRequest();

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
                {status === 'authenticated' ? (
                    <section className="flex flex-col gap-3">
                        <List>
                            <li>
                                <Link href="/Patient.Get">
                                    Patient.Read (R4)
                                </Link>
                            </li>
                        </List>
                        <hr className="border-t border-accents-2 my-3" />
                        <Text className="text-lg">Welcome {data?.user?.name}!{' '} ({data?.user?.email})</Text>

                        <Button onClick={() => signOut()}>Sign out</Button>
                        <Button onClick={redirectToMyChartBilling}>Go to MyChart Billing</Button>
                        <Button onClick={redirectToMyChartAppointments}>Go to MyChart Appointments</Button>
                    </section>
                ) : status === 'loading' ? (
                    <section className="text-center">
                        <Text>Loading...</Text>
                    </section>
                ) : (
                    <section className="text-center">
                        <Text className="text-lg my-3">Please login using Epic MyChart credentials. Click <Link target='_blank' href="https://fhir.epic.com/Documentation?docId=testpatients">
                            here
                        </Link> to access Epic MyChart Sandbox test data.</Text>
                        <Button size="lg" onClick={initiateEpicAuth}>
                            Sign in with Epic MyChart
                        </Button>
                    </section>
                )}
            </section>
        </Page>
    )
}

// Home.Layout = Layout
