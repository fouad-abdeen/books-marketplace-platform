import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Heading,
  Text,
  Spinner,
  Container,
  Image,
  SimpleGrid,
  Flex,
} from "@chakra-ui/react";
import { baseApiUrl } from "../api";
import bookstoreDefaultImage from "../assets/bookstore.png";
import { Link } from "react-router-dom";

const Homepage = () => {
  const [bookstores, setBookstores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(baseApiUrl + "/bookstores/active");
        setBookstores(response.data.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <Container centerContent>
        <Spinner size="xl" color="primary.500" />
      </Container>
    );
  }

  return (
    <Container centerContent>
      <Heading as="h1" size="xl" mb="4" color="primary.500">
        Bookstores
      </Heading>
      {bookstores.length === 0 ? (
        <Text>No bookstores available.</Text>
      ) : (
        <SimpleGrid
          columns={{ base: 1, lg: 2 }}
          spacing="10"
          columnGap={{ base: "20px", md: "200px" }}
          mb={4}
          key="{store._id}"
        >
          {bookstores.map((store) => (
            <Link
              to={`/bookstores/${store._id}`}
              style={{ textDecoration: "none" }}
              key={store._id}
            >
              <Box
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                boxShadow="md"
                width="320px"
                height="320px"
                bg="white"
                _hover={{ bg: "gray.100", cursor: "pointer" }}
              >
                <Flex direction="column" height="100%">
                  <Image
                    src={
                      store.logo && store.logo.url
                        ? store.logo.url
                        : bookstoreDefaultImage
                    }
                    alt={store.name}
                    objectFit="cover"
                    height="200px"
                    width="100%"
                  />
                  <Box p="4" flex="1">
                    <Heading
                      as="h3"
                      size="md"
                      color="primary.500"
                      mb="2"
                      noOfLines={1}
                    >
                      {store.name}
                    </Heading>
                    <Text noOfLines={2}>{store.description}</Text>
                  </Box>
                </Flex>
              </Box>
            </Link>
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
};

export default Homepage;
