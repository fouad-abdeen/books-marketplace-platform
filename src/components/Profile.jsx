import { useState, useContext, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Container,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  HStack,
  Box,
  Image,
  useToast,
} from "@chakra-ui/react";
import { baseApiUrl } from "../api";
import { BookstoreContext } from "../contexts/BookstoreContext";

const Profile = () => {
  const { bookstore, setBookstore } = useContext(BookstoreContext);
  const toast = useToast();

  const [bookstoreDetails, setBookstoreDetails] = useState({
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

  const [logo, setLogo] = useState(null);
  const [logoVersion, setLogoVersion] = useState(Date.now());
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [deletingLogo, setDeletingLogo] = useState(false);

  useEffect(() => {
    if (bookstore) {
      setBookstoreDetails(bookstore);
      setLogo(bookstore.logo);
    }
  }, [bookstore]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookstoreDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target;
    setBookstoreDetails((prevDetails) => ({
      ...prevDetails,
      socialMedia: {
        ...prevDetails.socialMedia,
        [name]: value,
      },
    }));
  };

  const handleUpdateBookstore = async () => {
    try {
      const response = await axios.patch(
        baseApiUrl + `/bookstores`,
        bookstoreDetails,
        { withCredentials: true }
      );
      setBookstore(response.data.data);
      toast({
        title: "Bookstore updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to update bookstore.",
        description: error.response.data.error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleLogoUpload = async (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    setUploadingLogo(true);

    try {
      const response = await axios.post(
        baseApiUrl + `/bookstores/logo`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setBookstore((prevBookstore) => ({
        ...prevBookstore,
        logo: response.data.data,
      }));
      setLogo(response.data.data);
      setLogoVersion(Date.now());
      setUploadingLogo(false);
      toast({
        title: "Logo uploaded. Find it above.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      setUploadingLogo(false);
      toast({
        title: "Failed to upload logo.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleLogoDelete = async () => {
    setDeletingLogo(true);
    try {
      await axios.delete(baseApiUrl + `/bookstores/logo`, {
        withCredentials: true,
      });
      setBookstore((prevBookstore) => ({
        ...prevBookstore,
        logo: null,
      }));
      setLogo(null);
      setDeletingLogo(false);
      toast({
        title: "Logo deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      setDeletingLogo(false);
      toast({
        title: "Failed to delete logo.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <Heading as="h1" size="xl" mb={8} color="primary.500" textAlign="center">
        Bookstore Profile
      </Heading>
      <VStack spacing={4} align="stretch">
        {logo && (
          <Box>
            <Image
              src={logo && logo.url}
              alt="Bookstore Logo"
              boxSize="150px"
            />
          </Box>
        )}
        <FormControl id="name">
          <FormLabel>Name</FormLabel>
          <Input
            type="text"
            name="name"
            value={bookstoreDetails.name}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl id="description">
          <FormLabel>Description</FormLabel>
          <Input
            type="text"
            name="description"
            value={bookstoreDetails.description}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl id="phone">
          <FormLabel>Phone</FormLabel>
          <Input
            type="text"
            name="phone"
            value={bookstoreDetails.phone}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl id="shippingRate">
          <FormLabel>Shipping Rate</FormLabel>
          <Input
            type="number"
            name="shippingRate"
            value={bookstoreDetails.shippingRate}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl id="address">
          <FormLabel>Address</FormLabel>
          <Input
            type="text"
            name="address"
            value={bookstoreDetails.address}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl id="email">
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            name="email"
            value={bookstoreDetails.email}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl id="facebook">
          <FormLabel>Facebook</FormLabel>
          <Input
            type="text"
            name="facebook"
            value={bookstoreDetails.socialMedia.facebook}
            onChange={handleSocialMediaChange}
          />
        </FormControl>
        <FormControl id="instagram">
          <FormLabel>Instagram</FormLabel>
          <Input
            type="text"
            name="instagram"
            value={bookstoreDetails.socialMedia.instagram}
            onChange={handleSocialMediaChange}
          />
        </FormControl>
        <FormControl id="twitter">
          <FormLabel>Twitter</FormLabel>
          <Input
            type="text"
            name="twitter"
            value={bookstoreDetails.socialMedia.twitter}
            onChange={handleSocialMediaChange}
          />
        </FormControl>
        <FormControl id="linkedIn">
          <FormLabel>LinkedIn</FormLabel>
          <Input
            type="text"
            name="linkedIn"
            value={bookstoreDetails.socialMedia.linkedIn}
            onChange={handleSocialMediaChange}
          />
        </FormControl>
        <Box textAlign="center">
          <Button colorScheme="teal" size="md" onClick={handleUpdateBookstore}>
            Update Bookstore
          </Button>
        </Box>

        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          id="upload-logo"
          onChange={handleLogoUpload}
        />
        <HStack spacing={4} justifyContent="center">
          <Button
            colorScheme="blue"
            size="md"
            as="label"
            htmlFor="upload-logo"
            isLoading={uploadingLogo}
          >
            {logo ? "Change Logo" : "Upload Logo"}
          </Button>
          {logo && (
            <Button
              colorScheme="red"
              size="md"
              onClick={handleLogoDelete}
              isLoading={deletingLogo}
            >
              Delete Logo
            </Button>
          )}
        </HStack>
      </VStack>
    </Container>
  );
};

export default Profile;
