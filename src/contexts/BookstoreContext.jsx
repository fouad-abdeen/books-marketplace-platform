import { createContext } from "react";

export const BookstoreContext = createContext({
  bookstore: null,
  setBookstore: (bookstore) => bookstore,
});
