import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import {
  Container,
  Heading,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
} from "@chakra-ui/react";
import { baseApiUrl } from "../api";

const VerifyEmail = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await axios.put(baseApiUrl + `/auth/email/verify?token=${token}`);
        setSuccess(
          "Verified your email successfully. You can now log into your account."
        );
      } catch (error) {
        setError(error.response.data.error.message);
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token]);

  const handleCloseAlert = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <Container centerContent>
      <Heading as="h1" size="xl" mb="4" color="primary.500">
        Verify Email
      </Heading>
      {error && (
        <Alert status="error" mb="4">
          <AlertIcon />
          <AlertTitle mr={2}>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <CloseButton
            position="absolute"
            right="8px"
            top="8px"
            onClick={handleCloseAlert}
          />
        </Alert>
      )}
      {success && (
        <Alert status="success" mb="4">
          <AlertIcon />
          <AlertTitle mr={2}>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
          <CloseButton
            position="absolute"
            right="8px"
            top="8px"
            onClick={handleCloseAlert}
          />
        </Alert>
      )}
    </Container>
  );
};

export default VerifyEmail;
