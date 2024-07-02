import { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Heading,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
} from "@chakra-ui/react";
import { baseApiUrl } from "../api";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await axios.post(baseApiUrl + "/auth/signup", {
        name,
        email,
        password,
        role,
      });
      setSuccess(
        "Signup successful. Verification email has been sent. Please verify your email within 24 hours to activate your account."
      );
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setRole("customer");
    } catch (error) {
      setError(`Failed to sign up. ${error.response.data.error.message}`);
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
    <Container centerContent mb={4}>
      <Heading as="h1" size="xl" mb="4" color="primary.500">
        Sign Up
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
        <FormLabel>Name</FormLabel>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl mb="4">
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl mb="4">
        <FormLabel>Password</FormLabel>
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
      <FormControl mb="4">
        <FormLabel>Register as</FormLabel>
        <Select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="customer">Customer</option>
          <option value="owner">Bookstore Owner</option>
        </Select>
      </FormControl>
      <Button onClick={handleSignup} colorScheme="primary">
        Sign Up
      </Button>
    </Container>
  );
};

export default Signup;
