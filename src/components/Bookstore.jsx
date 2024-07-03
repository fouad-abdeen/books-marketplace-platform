import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  Image,
  Text,
  Button,
  VStack,
  HStack,
  Tag,
  TagLabel,
  Spinner,
  SimpleGrid,
} from "@chakra-ui/react";
import { baseApiUrl } from "../api";
import BookDefaultImage from "../assets/book.png";
import AddToCartIcon from "../assets/add-to-cart.png";

const Bookstore = () => {
  const booksLimit = 5;
  const { id } = useParams();
  const [bookstore, setBookstore] = useState(null);
  const [genres, setGenres] = useState([]);
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState({ name: "All" });
  const [loading, setLoading] = useState(true);
  const [noMoreBooks, setNoMoreBooks] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const bookstoreResponse = await axios.get(
          baseApiUrl + `/bookstores/${id}?limit=${booksLimit}`
        );
        const genresResponse = await axios.get(
          baseApiUrl + `/bookstores/${id}/genres`
        );
        const booksResponse = await axios.get(
          baseApiUrl + `/bookstores/${id}/books`
        );

        setBookstore(bookstoreResponse.data.data);
        setGenres(genresResponse.data.data);
        setBooks(booksResponse.data.data);
        setFilteredBooks(booksResponse.data.data);
        if (booksResponse.data.data.length < 1) setNoMoreBooks(true);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    })();
  }, [id]);

  const filterBooksByGenre = async (genre) => {
    if (selectedGenre.name === genre.name) return;

    setSelectedGenre(genre);

    const booksResponse = await axios.get(
      baseApiUrl +
        `/bookstores/${id}/books` +
        (genre._id ? `?genre=${genre._id}&` : "?") +
        `limit=${booksLimit}`
    );

    setBooks(booksResponse.data.data);
    setFilteredBooks(booksResponse.data.data);
    if (booksResponse.data.data.length < 1) setNoMoreBooks(true);
    else setNoMoreBooks(false);
  };

  const loadMoreBooks = async () => {
    const booksResponse = await axios.get(
      baseApiUrl +
        `/bookstores/${id}/books` +
        (selectedGenre._id ? `?genre=${selectedGenre._id}&` : `?`) +
        `limit=${booksLimit}&lastDocumentId=${
          filteredBooks[filteredBooks.length - 1]._id
        }`
    );
    setFilteredBooks([...books, ...booksResponse.data.data]);
    if (booksResponse.data.data.length < 1) setNoMoreBooks(true);
  };

  const handleAddToCart = (bookId) => {
    // To be implemented
    console.log(`Book with ID ${bookId} added to cart`);
  };

  if (loading) {
    return (
      <Container centerContent>
        <Spinner size="xl" />
      </Container>
    );
  }

  if (!bookstore) {
    return (
      <Container centerContent>
        <Heading as="h1" size="xl" mb="4" color="primary.500">
          Bookstore not found
        </Heading>
      </Container>
    );
  }

  return (
    <Container maxW="container.lg" mb={4}>
      <VStack spacing={6} align="start">
        <Box w="100%" bg="gray.100" p={6} rounded="md" boxShadow="md">
          <HStack spacing={4}>
            {bookstore.logo && (
              <Image
                src={bookstore.logo.url}
                alt={bookstore.name}
                boxSize="100px"
                objectFit="cover"
                rounded="full"
              />
            )}
            <Box>
              <Heading as="h1" size="xl" color="primary.500">
                {bookstore.name}
              </Heading>
              <Text fontSize="lg">{bookstore.description}</Text>
              <Text>{bookstore.address}</Text>
              <Text>{bookstore.phone}</Text>
              {bookstore.email && <Text>{bookstore.email}</Text>}
            </Box>
          </HStack>
        </Box>

        <Box w="100%">
          <Heading as="h2" size="lg" mb={4} color="primary.500">
            Genres
          </Heading>
          <HStack spacing={4}>
            <Tag
              size="lg"
              key="All"
              variant="solid"
              colorScheme={selectedGenre.name === "All" ? "primary" : "gray"}
              onClick={() => filterBooksByGenre({ name: "All" })}
              cursor="pointer"
            >
              <TagLabel>All</TagLabel>
            </Tag>
            {genres.map((genre) => (
              <Tag
                size="lg"
                key={genre._id}
                variant="solid"
                colorScheme={
                  selectedGenre.name === genre.name ? "primary" : "gray"
                }
                onClick={() => filterBooksByGenre(genre)}
                cursor="pointer"
              >
                <TagLabel>{genre.name}</TagLabel>
              </Tag>
            ))}
          </HStack>
        </Box>

        <Box w="100%">
          <Heading as="h2" size="lg" mb={4} color="primary.500">
            Books
          </Heading>
          <SimpleGrid columns={[1, 2, 3]} spacing={6}>
            {filteredBooks.map((book) => (
              <Link key={book._id} to={`/books/${book._id}`}>
                <Box p={4} bg="white" boxShadow="md" rounded="md">
                  <Image
                    src={
                      book.cover && book.cover.url
                        ? book.cover.url
                        : BookDefaultImage
                    }
                    alt={book.title}
                    boxSize="300px"
                    mb={4}
                  />
                  <Heading as="h3" size="md" mb={2}>
                    {book.title}
                  </Heading>
                  <Text>Author: {book.author}</Text>
                  <Text>Price: ${book.price}</Text>
                  <Text>Genre: {book.genre.name}</Text>
                  {!book.availability ? (
                    <Button isDisabled colorScheme="red" variant="solid" mt={2}>
                      Not Available for Purchase
                    </Button>
                  ) : book.stock === 0 ? (
                    <Button
                      isDisabled
                      colorScheme="yellow"
                      variant="solid"
                      mt={2}
                    >
                      Out of Stock
                    </Button>
                  ) : (
                    <Button
                      leftIcon={<Image src={AddToCartIcon} boxSize="20px" />}
                      colorScheme="primary"
                      variant="solid"
                      onClick={() => handleAddToCart(book._id)}
                      mt={2}
                    >
                      Add to Cart
                    </Button>
                  )}
                </Box>
              </Link>
            ))}
            {filteredBooks.length === 0 && <Text>No books available.</Text>}
          </SimpleGrid>
          {filteredBooks.length > 0 && !noMoreBooks && (
            <Button mt={4} colorScheme="primary" onClick={loadMoreBooks}>
              Load More Books
            </Button>
          )}
        </Box>
      </VStack>
    </Container>
  );
};

export default Bookstore;
