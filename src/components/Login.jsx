import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  FormControl,
  FormLabel,
  Text,
  Link,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
} from "@chakra-ui/react";
import { UserContext } from "../contexts/UserContext";
import axios from "axios";
import { baseApiUrl } from "../api";
import { BookstoreContext } from "../contexts/BookstoreContext";

const Login = () => {
  const { user, setUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setBookstore } = useContext(BookstoreContext);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogin = () => {
    (async () => {
      try {
        const response = await axios.post(
          baseApiUrl + "/auth/login",
          {
            email,
            password,
          },
          { withCredentials: true }
        );
        if (response.data.data.role === "bookstore_owner") {
          const response = await axios.get(baseApiUrl + `/bookstores`, {
            withCredentials: true,
          });
          setBookstore(response.data.data);
        }
        setUser(response.data.data);
        navigate("/");
      } catch (error) {
        setError(error.response.data.error.message);
      }
    })();
  };

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleCloseAlert = () => {
    setError(null);
  };

  return (
    <Container centerContent>
      <Heading as="h1" size="xl" mb="4" color="primary.500">
        Login
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
      <Box mb="4" width="100%">
        <Text>
          Not registered?{" "}
          <Button
            as={Link}
            variant="link"
            color="primary.500"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </Button>
        </Text>
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
      </Box>
      <Button onClick={handleLogin} colorScheme="primary">
        Login
      </Button>
      <Text>
        <Button
          as={Link}
          variant="link"
          color="primary.500"
          onClick={() => navigate("/forgot-password")}
        >
          Forgot password?
        </Button>
      </Text>
    </Container>
  );
};

export default Login;
