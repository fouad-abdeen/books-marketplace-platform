import { useState } from "react";
import axios from "axios";
import {
  Button,
  Container,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { baseApiUrl } from "../api";
import { useNavigate } from "react-router-dom";

const RegisterBookstore = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [bookstore, setBookstore] = useState({
    name: "",
    description: "",
    phone: "",
    shippingRate: 0,
    address: "",
    email: "",
    socialMedia: {
      facebook: "",
      instagram: "",
      twitter: "",
      linkedIn: "",
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookstore((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target;
    setBookstore((prev) => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      bookstore.shippingRate = parseInt(bookstore.shippingRate);
      await axios.post(baseApiUrl + "/bookstores", bookstore, {
        withCredentials: true,
      });
      toast({
        title: "Bookstore registered.",
        description:
          "Your bookstore has been successfully registered. Please wait for approval to access the dashboard.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "An error occurred.",
        description: error.response.data.error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      console.error(error);
    }
  };

  return (
    <Container maxW="container.md" mt={10} mb={4}>
      <Heading as="h1" size="xl" mb="4" color="primary.500">
        Register Your Bookstore
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              name="name"
              value={bookstore.name}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl id="description" isRequired>
            <FormLabel>Description</FormLabel>
            <Input
              type="text"
              name="description"
              value={bookstore.description}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl id="phone" isRequired>
            <FormLabel>Phone</FormLabel>
            <Input
              type="tel"
              name="phone"
              value={bookstore.phone}
              placeholder="+9613000000"
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl id="shippingRate" isRequired>
            <FormLabel>Shipping Rate</FormLabel>
            <Input
              type="number"
              name="shippingRate"
              value={bookstore.shippingRate}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl id="address" isRequired>
            <FormLabel>Address</FormLabel>
            <Input
              type="text"
              name="address"
              value={bookstore.address}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              value={bookstore.email}
              onChange={handleInputChange}
            />
          </FormControl>
          <Heading as="h3" size="md" mt="4" mb="2">
            Social Media
          </Heading>
          <FormControl id="facebook">
            <FormLabel>Facebook</FormLabel>
            <Input
              type="text"
              name="facebook"
              value={bookstore.socialMedia.facebook}
              onChange={handleSocialMediaChange}
            />
          </FormControl>
          <FormControl id="instagram">
            <FormLabel>Instagram</FormLabel>
            <Input
              type="text"
              name="instagram"
              value={bookstore.socialMedia.instagram}
              onChange={handleSocialMediaChange}
            />
          </FormControl>
          <FormControl id="twitter">
            <FormLabel>Twitter</FormLabel>
            <Input
              type="text"
              name="twitter"
              value={bookstore.socialMedia.twitter}
              onChange={handleSocialMediaChange}
            />
          </FormControl>
          <FormControl id="linkedIn">
            <FormLabel>LinkedIn</FormLabel>
            <Input
              type="text"
              name="linkedIn"
              value={bookstore.socialMedia.linkedIn}
              onChange={handleSocialMediaChange}
            />
          </FormControl>
          <Button colorScheme="primary" type="submit">
            Register
          </Button>
        </VStack>
      </form>
    </Container>
  );
};

export default RegisterBookstore;
