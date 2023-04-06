import mongoose, { Schema } from "mongoose";

const bookSchema = new Schema({
    title: { type: String, required: true },
    genre: { type: String, required: true },
    pages: { type: Number, required: true },
    author: { type: String, required: true },
    year: { type: Number, required: true }
}, { timestamps: true });

const Book: any = mongoose.model('Book', bookSchema);

export default Book;