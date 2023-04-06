import express, { Request, Response } from "express";
import mongoose, { isValidObjectId } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Book from "../dist/models/books.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const dbURI = process.env.ATLAS_URI as string;

const connectToDB = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log("Connected to MongoDB");
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`Server started on port ${port}`));
  } catch (err) {
    console.log(err);
  }
};
connectToDB();

app.post("/api/addBook", async (req: Request, res: Response) => {
  const title = req.body.title.replace(/-/g, " ").toLowerCase();
  const genre = req.body.genre.replace(/-/g, " ").toLowerCase();
  const pages = req.body.pages;
  const author = req.body.author.replace(/-/g, " ").toLowerCase();
  const year = req.body.year;

  const book = new Book({
    title: title,
    genre: genre,
    pages: pages,
    author: author,
    year: year,
  });

  try {
    const result = await book.save();
    res.send(result);
    console.log("Book added");
  } catch (err) {
    console.log(err);
  }
});

app.get("/api/getAllBooks", async (req: Request, res: Response) => {
  try {
    const result = await Book.find();
    res.send(result);
    console.log("List of all of the books sent");
  } catch (err) {
    console.log(err);
  }
});

app.get("/api/getBookById/:id", async (req: Request, res: Response) => {
  const bookId = req.params.id;
  try {
    const result = await Book.findById(bookId);
    res.send(result);
    console.log("Book sent (by id)");
  } catch (err) {
    console.log(err);
  }
});

app.get("/api/getBookByTitle/:title", async (req: Request, res: Response) => {
  const bookTitle = req.params.title.replace(/-/g, " ").toLowerCase();
  try {
    const result = await Book.find({ title: bookTitle });
    res.send(result);
    console.log("Book sent (by title)");
  } catch (err) {
    console.log(err);
  }
});

app.delete("/api/deleteBookById/:id", async (req: Request, res: Response) => {
  const bookId = req.params.id;

  if (isValidObjectId(bookId) === false)
    return res.status(400).send("Invalid ID");

  try {
    const result = await Book.findByIdAndDelete(bookId);
    res.send(result);
    console.log("Book deleted (by id)");
  } catch (err) {
    console.log(err);
  }
});

app.patch("/api/updateBookById/:id", async (req: Request, res: Response) => {
  const updates = req.body;
  const bookId = req.params.id;

  try {
    const result = await Book.findByIdAndUpdate(bookId, updates, { new: true });
    if (!result) {
      return res.status(404).send("Book not found");
    }
    res.send(result);
    console.log("Book updated (by id)");
  } catch (err) {
    console.log(err);
  }
});