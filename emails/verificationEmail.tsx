import { Html, Head, Font, Preview, Heading, Row, Section, Text } from "@react-email/components";

interface VerificationEmailProps {
    username: string;
    otp: string;
}

export default function VerificationEmail({username, otp}: VerificationEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>Verify your email address</Preview>
            <Section style={{padding: "20px", backgroundColor: "#f9f9f9"}}>
                <Heading style={{textAlign: "center"}}>Welcome {username}!</Heading>
                <Text style={{textAlign: "center"}}>Thank you for signing up. Please verify your email address using the code below:</Text>
                <Row style={{marginTop: "20px", textAlign: "center"}}>
                    <Text style={{fontSize: "24px", fontWeight: "bold"}}>{otp}</Text>
                </Row>
                <Text style={{textAlign: "center", marginTop: "20px"}}>If you didn't sign up, please ignore this email.</Text>
            </Section>
        </Html>
    );
}