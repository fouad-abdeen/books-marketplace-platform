/* eslint-disable react/prop-types */
import { Link, useNavigate } from "react-router-dom";
import { Box, Flex, Button, Heading, Spacer, Image } from "@chakra-ui/react";
import { UserContext } from "../contexts/UserContext";
import axios from "axios";
import { baseApiUrl } from "../api";
import { useContext } from "react";
import CartIcon from "../assets/cart.png";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const logout = async () => {
    await axios.get(baseApiUrl + "/auth/logout", { withCredentials: true });
    setUser(null);
    navigate("/");
  };

  return (
    <Box bg="primary.500" px={4} mb="4" color="white">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Heading as="h1" size="lg">
          <Link to="/">Souk el Kotob</Link>
        </Heading>
        <Spacer />
        {user ? (
          <>
            {user.role === "bookstore_owner" && (
              <Button
                as={Link}
                to="/books-management"
                variant="ghost"
                color="white"
              >
                Books
              </Button>
            )}
            {user && user.role === "bookstore_owner" && (
              <Button as={Link} to="/profile" variant="ghost" color="white">
                Profile
              </Button>
            )}
            {/* <Button as={Link} to="/settings" variant="ghost" color="white">
              Account Settings
            </Button> */}
            {user.role === "customer" && (
              <Button as={Link} to="/cart" variant="primary">
                <Image src={CartIcon} alt="Add to Cart" w="20px" h="20px" />
              </Button>
            )}
            <Button onClick={logout} colorScheme="gray">
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button as={Link} to="/login" colorScheme="whiteAlpha">
              Login
            </Button>
          </>
        )}
      </Flex>
    </Box>
  );
};

export default Navbar;
