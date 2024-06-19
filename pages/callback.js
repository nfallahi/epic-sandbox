import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {Link} from "@vercel/examples-ui";

const Callback = () => {
    const router = useRouter();
    const { code, state, iss } = router.query;
    const [token, setToken] = useState(null);
    const [patient, setPatient] = useState(null);

    useEffect(() => {
        if (code && state) {
            fetch(`/api/callback?code=${code}`)
                .then(res => res.json())
                .then(data => {
                    setToken(data.access_token);

                    console.log("DATA", data);
                    fetch(`https://vendorservices.epic.com/interconnect-amcurprd-oauth/api/FHIR/R4/Patient/${data.patient}`, {
                        headers: {
                            "Content-Type": "application/fhir+json",
                            Accept: "application/json",
                            // @ts-ignore
                            Authorization: `Bearer ${data?.access_token}`,
                        },
                    })
                        .then(res => res.json())
                        .then(patientData => setPatient(patientData))
                        .catch(err => console.error('Error fetching patient data:', err));

                })
                .catch(err => console.error('Error:', err));
        }
    }, [code, state]);

    return (
        <div className="container">
            <h1>Callback Page</h1>
            <div className="content">
                {token ? (
                    <div>
                        <p><strong>Access Token:</strong> {token}</p>
                        {patient ? (
                            <div>
                                <h2>Patient Information</h2>
                                <p><strong>Name:</strong> {patient.name[0].text}</p>
                                <p><strong>Gender:</strong> {patient.gender}</p>
                                <p><strong>Birth Date:</strong> {patient.birthDate}</p>
                                {/* Render other relevant patient data */}
                            </div>
                        ) : (
                            <p>Loading patient data...</p>
                        )}
                    </div>
                ) : (
                    <p>Waiting for access token...</p>
                )}
            </div>
            <style jsx>{`
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f0f0f0;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }
                .content {
                    margin-top: 20px;
                }
                h1, h2 {
                    font-size: 1.5rem;
                    margin-bottom: 10px;
                }
                p {
                    margin: 5px 0;
                }
            `}</style>
        </div>
    );
};


export default Callback;
