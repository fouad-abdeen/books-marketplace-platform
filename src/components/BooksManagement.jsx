import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import {
  Button,
  Container,
  Heading,
  HStack,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  useDisclosure,
  Tag,
  TagLabel,
  TagCloseButton,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Image,
} from "@chakra-ui/react";
import { baseApiUrl } from "../api";
import { UserContext } from "../contexts/UserContext";
import { BookstoreContext } from "../contexts/BookstoreContext";
import { useNavigate } from "react-router-dom";

const BooksManagement = () => {
  const navigate = useNavigate();
  const { bookstore } = useContext(BookstoreContext);
  const { user } = useContext(UserContext);
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newGenreName, setNewGenreName] = useState("");
  const [selectedBook, setSelectedBook] = useState(false);
  // Book Creation or Update
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [bookDetails, setBookDetails] = useState({
    title: "",
    description: "",
    author: "",
    genre: "",
    price: 0,
    availability: true,
    stock: 0,
  });
  // Deletion Alerts
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isDeleteCoverAlertOpen, setIsDeleteCoverAlertOpen] = useState(false);
  const cancelRef = useRef();
  const toast = useToast();
  // Book Archives
  const [archives, setArchives] = useState([]);
  const {
    isOpen: isArchivesOpen,
    onOpen: onArchivesOpen,
    onClose: onArchivesClose,
  } = useDisclosure();
  // Book Details
  const [selectedBookDetails, setSelectedBookDetails] = useState(null);
  const {
    isOpen: isDetailsOpen,
    onOpen: onDetailsOpen,
    onClose: onDetailsClose,
  } = useDisclosure();

  useEffect(() => {
    if (user && user.role !== "bookstore_owner") navigate("/");

    if (bookstore) {
      (async () => {
        try {
          const genresResponse = await axios.get(
            baseApiUrl + `/bookstores/${bookstore._id}/genres`,
            { withCredentials: true }
          );

          const booksResponse = await axios.get(
            baseApiUrl + `/bookstores/${bookstore._id}/books`,
            { withCredentials: true }
          );

          setGenres(genresResponse.data.data);
          setBooks(booksResponse.data.data);
          setLoading(false);
        } catch (error) {
          console.error(error);
          setLoading(false);
        }
      })();
    }
  }, [user, navigate, bookstore]);

  const handleGenreCreation = async () => {
    try {
      const response = await axios.post(
        baseApiUrl + `/genres`,
        { name: newGenreName },
        { withCredentials: true }
      );
      setNewGenreName("");
      setGenres((prevGenres) => [...prevGenres, response.data.data]);
      toast({
        title: "Genre added.",
        description: "The genre has been added successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error adding genre.",
        description: error.response.data.error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleGenreDeletion = async (genreId) => {
    try {
      await axios.delete(baseApiUrl + `/genres/${genreId}`, {
        withCredentials: true,
      });
      setGenres((prevGenres) =>
        prevGenres.filter((genre) => genre._id !== genreId)
      );
      toast({
        title: "Genre deleted.",
        description: "The genre has been deleted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error deleting genre.",
        description: error.response.data.error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleBookCreation = async () => {
    try {
      const response = await axios.post(baseApiUrl + "/books", bookDetails, {
        withCredentials: true,
      });

      setBooks((prevBooks) => [response.data.data, ...prevBooks]);

      onClose();
      toast({
        title: "Book added.",
        description: "The book has been added successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error adding book.",
        description: error.response.data.error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleBookUpdate = async () => {
    try {
      bookDetails.price = parseFloat(bookDetails.price);
      bookDetails.stock = parseInt(bookDetails.stock);
      bookDetails.availability = bookDetails.availability === "true";
      if (typeof bookDetails.genre !== "string")
        bookDetails.genre = bookDetails.genre._id;

      const response = await axios.patch(
        baseApiUrl + `/books/${bookDetails._id}`,
        bookDetails,
        { withCredentials: true }
      );

      const index = books.findIndex((book) => book._id === bookDetails._id);
      const genre = genres.find(
        (genre) => genre._id === response.data.data.genre
      );
      books[index] = { ...books[index], ...response.data.data, genre };
      setBooks([...books]);
      onClose();

      toast({
        title: "Book updated.",
        description: "The book has been updated successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error updating book.",
        description: error.response.data.error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const restoreBook = async (archivedBook) => {
    try {
      const response = await axios.patch(
        baseApiUrl + `/books/${archivedBook._id}`,
        archivedBook,
        { withCredentials: true }
      );

      const index = books.findIndex((book) => book._id === archivedBook._id);
      const genre = genres.find(
        (genre) => genre._id === response.data.data.genre
      );
      books[index] = { ...books[index], ...response.data.data, genre };
      setBooks([...books]);

      onClose();
      toast({
        title: "Book restored.",
        description: "The book has been restored successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error restoring book.",
        description: error.response.data.error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleBookDeletion = async () => {
    try {
      await axios.delete(baseApiUrl + `/books/${selectedBook}`, {
        withCredentials: true,
      });
      setBooks((prevBooks) =>
        prevBooks.filter((book) => book._id !== selectedBook)
      );
      setIsDeleteAlertOpen(false);
      toast({
        title: "Book deleted.",
        description: "The book has been deleted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error deleting book.",
        description: error.response.data.error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCoverUpload = async (bookId, coverFile) => {
    const formData = new FormData();
    formData.append("file", coverFile);

    try {
      const response = await axios.post(
        baseApiUrl + `/books/${bookId}/cover`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const index = books.findIndex((book) => book._id === bookId);
      books[index] = { ...books[index], cover: response.data.data };
      setBooks([...books]);
      toast({
        title: "Cover uploaded.",
        description: "The cover has been uploaded successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error uploading cover.",
        description: error.response.data.error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCoverDelete = async () => {
    try {
      await axios.delete(baseApiUrl + `/books/${selectedBook}/cover`, {
        withCredentials: true,
      });
      const index = books.findIndex((book) => book._id === selectedBook);
      books[index] = { ...books[index], cover: null };
      setBooks([...books]);
      setIsDeleteCoverAlertOpen(false);
      toast({
        title: "Cover deleted.",
        description: "The cover has been deleted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error deleting cover.",
        description: error.response.data.error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const confirmBookDeletion = (bookId) => {
    setSelectedBook(bookId);
    setIsDeleteAlertOpen(true);
  };

  const confirmCoverDeletion = (bookId) => {
    setSelectedBook(bookId);
    setIsDeleteCoverAlertOpen(true);
  };

  const openBookUpdateModal = (book) => {
    setSelectedBook(!!book._id);
    setBookDetails(book);
    onOpen();
  };

  const closeBookUpdateModal = () => {
    setSelectedBook(false);
    setBookDetails({
      title: "",
      description: "",
      author: "",
      genre: "",
      price: 0,
      availability: true,
      stock: 0,
    });
    onClose();
  };

  const viewArchives = async (bookId) => {
    try {
      const response = await axios.get(
        baseApiUrl + `/books/${bookId}/archives`,
        { withCredentials: true }
      );
      setArchives(response.data.data);
      onArchivesOpen();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error getting archives.",
        description: error.response.data.error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const viewBookDetails = (book) => {
    setSelectedBookDetails(book);
    onDetailsOpen();
  };

  if (loading) {
    return (
      <Container centerContent>
        <Spinner size="xl" />
      </Container>
    );
  }

  return (
    <Container maxW="container.lg">
      <Heading as="h1" size="xl" mb="4" color="primary.500">
        Books Management
      </Heading>
      <HStack spacing={4} mb={4}>
        <Input
          placeholder="New Genre"
          value={newGenreName}
          onChange={(e) => setNewGenreName(e.target.value)}
        />
        <Button colorScheme="primary" onClick={handleGenreCreation}>
          Add Genre
        </Button>
      </HStack>
      <HStack spacing={2} mb={4}>
        {genres.map((genre) => (
          <Tag size="lg" key={genre._id} colorScheme="teal">
            <TagLabel>{genre.name}</TagLabel>
            <TagCloseButton onClick={() => handleGenreDeletion(genre._id)} />
          </Tag>
        ))}
      </HStack>
      <Button
        colorScheme="primary"
        onClick={() =>
          openBookUpdateModal({
            title: "",
            description: "",
            author: "",
            genre: "",
            price: 0,
            availability: true,
            stock: 0,
          })
        }
        mb={4}
      >
        Add New Book
      </Button>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Title</Th>
            <Th>Author</Th>
            <Th>Genre</Th>
            <Th>Price</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {books.map((book) => (
            <Tr
              key={book._id}
              onClick={(e) => {
                if (!["BUTTON", "LABEL", "INPUT"].includes(e.target.tagName)) {
                  viewBookDetails(book);
                }
              }}
              _hover={{ cursor: "pointer", backgroundColor: "gray.100" }}
            >
              <Td>{book.title}</Td>
              <Td>{book.author}</Td>
              <Td>{book.genre.name}</Td>
              <Td>${book.price}</Td>
              <Td>
                <HStack spacing={2}>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={() =>
                      openBookUpdateModal({
                        _id: book._id,
                        title: book.title,
                        description: book.description,
                        author: book.author,
                        genre: book.genre,
                        price: book.price,
                        availability: book.availability,
                        stock: book.stock,
                        publisher: book.publisher,
                        publicationYear: book.publicationYear,
                      })
                    }
                  >
                    Update
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => confirmBookDeletion(book._id)}
                  >
                    Delete
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    id={`upload-cover-${book._id}`}
                    onChange={(e) =>
                      handleCoverUpload(book._id, e.target.files[0])
                    }
                  />
                  <Button
                    as="label"
                    htmlFor={`upload-cover-${book._id}`}
                    size="sm"
                    style={{ cursor: "pointer" }}
                  >
                    Upload Cover
                  </Button>
                  {book.cover && (
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => confirmCoverDeletion(book._id)}
                    >
                      Delete Cover
                    </Button>
                  )}
                  <Button size="sm" onClick={() => viewArchives(book._id)}>
                    View Archives
                  </Button>
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedBook ? "Update Book" : "Add New Book"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl id="title" isRequired={!selectedBook}>
                <FormLabel>Title</FormLabel>
                <Input
                  type="text"
                  name="title"
                  value={bookDetails.title}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl id="description" isRequired={!selectedBook}>
                <FormLabel>Description</FormLabel>
                <Input
                  type="text"
                  name="description"
                  value={bookDetails.description}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl id="author" isRequired={!selectedBook}>
                <FormLabel>Author</FormLabel>
                <Input
                  type="text"
                  name="author"
                  value={bookDetails.author}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl id="genre" isRequired={!selectedBook}>
                <FormLabel>Genre</FormLabel>
                <Select
                  name="genre"
                  value={bookDetails.genre_id}
                  defaultValue={bookDetails.genre._id}
                  onChange={handleInputChange}
                >
                  {genres.map((genre) => (
                    <option key={genre._id} value={genre._id}>
                      {genre.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl id="price" isRequired={!selectedBook}>
                <FormLabel>Price</FormLabel>
                <Input
                  type="number"
                  name="price"
                  value={bookDetails.price}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl id="availability" isRequired={!selectedBook}>
                <FormLabel>Availability</FormLabel>
                <Select
                  name="availability"
                  value={bookDetails.availability}
                  onChange={handleInputChange}
                >
                  <option value={true}>Available</option>
                  <option value={false}>Unavailable</option>
                </Select>
              </FormControl>
              <FormControl id="stock" isRequired={!selectedBook}>
                <FormLabel>Stock</FormLabel>
                <Input
                  type="number"
                  name="stock"
                  value={bookDetails.stock}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl id="publisher">
                <FormLabel>Publisher</FormLabel>
                <Input
                  type="text"
                  name="publisher"
                  value={bookDetails.publisher}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl id="publicationYear">
                <FormLabel>Publication Year</FormLabel>
                <Input
                  type="number"
                  name="publicationYear"
                  value={bookDetails.publicationYear}
                  onChange={handleInputChange}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="green"
              mr={3}
              onClick={selectedBook ? handleBookUpdate : handleBookCreation}
            >
              {selectedBook ? "Update" : "Add"}
            </Button>
            <Button variant="ghost" onClick={closeBookUpdateModal}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isArchivesOpen} onClose={onArchivesClose} size="7xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Book Archives</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Title</Th>
                    <Th>Author</Th>
                    <Th>Genre</Th>
                    <Th>Price</Th>
                    <Th>Publisher</Th>
                    <Th>Publication Year</Th>
                    <Th>Stock</Th>
                    <Th>Created At</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {archives.map((archive) => (
                    <Tr key={archive._id}>
                      <Td>{archive.title}</Td>
                      <Td>{archive.author}</Td>
                      <Td>{archive.genre.name}</Td>
                      <Td>{archive.price}</Td>
                      <Td>{archive.publisher}</Td>
                      <Td>{archive.publicationYear}</Td>
                      <Td>{archive.stock}</Td>
                      <Td>{new Date(archive.createdAt).toLocaleString()}</Td>
                      <Td>
                        <Button
                          size="sm"
                          colorScheme="blue"
                          onClick={() => {
                            restoreBook({
                              _id: archive.book,
                              title: archive.title,
                              description: archive.description,
                              author: archive.author,
                              genre: archive.genre._id,
                              price: archive.price,
                              availability: archive.availability,
                              stock: archive.stock,
                              publisher: archive.publisher,
                              publicationYear: archive.publicationYear,
                            });
                          }}
                        >
                          Restore
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onArchivesClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isDetailsOpen} onClose={onDetailsClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Book Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedBookDetails && (
              <VStack spacing={4} align="stretch">
                {selectedBookDetails.cover && (
                  <Image
                    src={selectedBookDetails.cover.url}
                    alt={selectedBookDetails.title}
                    boxSize="200px"
                    borderRadius="md"
                    alignSelf="center"
                    mb={4}
                  />
                )}
                <FormControl>
                  <FormLabel>Title</FormLabel>
                  <Input value={selectedBookDetails.title} isReadOnly />
                </FormControl>
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Input value={selectedBookDetails.description} isReadOnly />
                </FormControl>
                <FormControl>
                  <FormLabel>Author</FormLabel>
                  <Input value={selectedBookDetails.author} isReadOnly />
                </FormControl>
                <FormControl>
                  <FormLabel>Genre</FormLabel>
                  <Input value={selectedBookDetails.genre.name} isReadOnly />
                </FormControl>
                <FormControl>
                  <FormLabel>Price</FormLabel>
                  <Input value={selectedBookDetails.price} isReadOnly />
                </FormControl>
                <FormControl>
                  <FormLabel>Availability</FormLabel>
                  <Input
                    value={
                      selectedBookDetails.availability
                        ? "Available"
                        : "Unavailable"
                    }
                    isReadOnly
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Stock</FormLabel>
                  <Input value={selectedBookDetails.stock} isReadOnly />
                </FormControl>
                <FormControl>
                  <FormLabel>Publisher</FormLabel>
                  <Input value={selectedBookDetails.publisher} isReadOnly />
                </FormControl>
                <FormControl>
                  <FormLabel>Publication Year</FormLabel>
                  <Input
                    value={selectedBookDetails.publicationYear}
                    isReadOnly
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Created At</FormLabel>
                  <Input
                    value={new Date(
                      selectedBookDetails.createdAt
                    ).toLocaleString()}
                    isReadOnly
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Updated At</FormLabel>
                  <Input
                    value={new Date(
                      selectedBookDetails.updatedAt
                    ).toLocaleString()}
                    isReadOnly
                  />
                </FormControl>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onDetailsClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={isDeleteAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Book
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this book? This action cannot be
              undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => setIsDeleteAlertOpen(false)}
              >
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleBookDeletion} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog
        isOpen={isDeleteCoverAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteCoverAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Cover
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this cover? This action cannot be
              undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => setIsDeleteCoverAlertOpen(false)}
              >
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleCoverDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
};

export default BooksManagement;
