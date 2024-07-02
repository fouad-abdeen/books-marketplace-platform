import { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import {
  Container,
  Heading,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
} from "@chakra-ui/react";
import { baseApiUrl } from "../api";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token");

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await axios.post(baseApiUrl + "/auth/password", {
        token,
        password,
      });
      setSuccess(
        "Password reset successful. You can now log in with your new password."
      );
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      setError(error.response.data.error.message);
    }
  };

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleCloseAlert = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <Container centerContent>
      <Heading as="h1" size="xl" mb="4" color="primary.500">
        Reset Password
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
        <FormLabel>New Password</FormLabel>
        <InputGroup>
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handlePasswordVisibility}>
              {showPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl mb="4">
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handlePasswordVisibility}>
              {showPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button onClick={handleResetPassword} colorScheme="primary">
        Reset Password
      </Button>
    </Container>
  );
};

export default ResetPassword;
