import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Container,
  Heading,
  Image,
  Text,
  Button,
  VStack,
  Spinner,
  HStack,
} from "@chakra-ui/react";
import { baseApiUrl } from "../api";
import AddToCartIcon from "../assets/add-to-cart.png";

const Book = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(baseApiUrl + `/books/${id}`);
        setBook(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    })();
  }, [id]);

  const handleAddToCart = (bookId) => {
    // To be implementeds
    console.log(`Book with ID ${bookId} added to cart`);
  };

  if (loading) {
    return (
      <Container centerContent>
        <Spinner size="xl" />
      </Container>
    );
  }

  if (!book) {
    return (
      <Container centerContent>
        <Heading as="h1" size="xl" mb="4" color="primary.500">
          Book not found
        </Heading>
      </Container>
    );
  }

  return (
    <Container maxW="container.md" mb={4}>
      <VStack spacing={6} align="start">
        <HStack spacing={6} align="start">
          {book.cover && (
            <Image src={book.cover.url} alt={book.title} boxSize="300px" />
          )}
          <Box>
            <Heading as="h1" size="xl" color="primary.500" mb={4}>
              {book.title}
            </Heading>
            <Text fontSize="lg" mb={2}>
              Author: {book.author}
            </Text>
            <Text fontSize="lg" mb={2}>
              Genre: {book.genre.name}
            </Text>
            <Text fontSize="lg" mb={2}>
              Price: <b>${book.price}</b>
            </Text>
            <Text fontSize="lg" mb={2}>
              Publisher: {book.publisher}
            </Text>
            <Text fontSize="lg" mb={2}>
              Publication Year: {book.publicationYear}
            </Text>
            <Text mb={4}>{book.description}</Text>
            <Button
              leftIcon={<Image src={AddToCartIcon} boxSize="20px" />}
              colorScheme="primary"
              variant="solid"
              onClick={() => handleAddToCart(book._id)}
            >
              Add to Cart
            </Button>
          </Box>
        </HStack>
      </VStack>
    </Container>
  );
};

export default Book;
