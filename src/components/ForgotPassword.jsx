import { useState } from "react";
import axios from "axios";
import {
  Container,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
} from "@chakra-ui/react";
import { baseApiUrl } from "../api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleForgotPassword = async () => {
    try {
      await axios.get(baseApiUrl + `/auth/password?email=${email}`);
      setSuccess("Password reset request sent. Please check your email.");
      setEmail("");
    } catch (error) {
      setError("Failed to send password reset request. Please try again.");
      console.log(error.response.data.error.message);
    }
  };

  const handleCloseAlert = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <Container centerContent>
      <Heading as="h1" size="xl" mb="4" color="primary.500">
        Forgot Password
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
      <FormControl mb="4">
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <Button onClick={handleForgotPassword} colorScheme="primary">
        Request Password Reset
      </Button>
    </Container>
  );
};

export default ForgotPassword;
