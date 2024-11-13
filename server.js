const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

// Create express app
const app = express();
const port = 3000;

// Set up view engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('assets'));

// Use body-parser middleware to handle form data
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect('mongodb+srv://patrickgrayhurst:M3hb22xzf1ysBy04@cluster0.j1ack.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Movie review schema
const reviewSchema = new mongoose.Schema({
    movieName: String,
    releaseDate: Date,
    reviewText: String,
});

// Movie review model
const Review = mongoose.model('Review', reviewSchema);

// Home route: Display all reviews
app.get('/', async (req, res) => {
    try {
        const reviews = await Review.find();
        res.render('index', { reviews });
    } catch (error) {
        res.status(500).send('Error fetching reviews');
    }
});

// Add new review route
app.get('/add', (req, res) => {
    res.render('add');
});

app.post('/add', async (req, res) => {
    const { movieName, releaseDate, reviewText } = req.body;
    const newReview = new Review({
        movieName,
        releaseDate,
        reviewText,
    });
    
    try {
        await newReview.save();
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error saving the review');
    }
});

// Edit review route
app.get('/edit/:id', async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        res.render('edit', { review });
    } catch (error) {
        res.status(500).send('Error fetching the review');
    }
});

app.post('/edit/:id', async (req, res) => {
    const { movieName, releaseDate, reviewText } = req.body;
    try {
        await Review.findByIdAndUpdate(req.params.id, {
            movieName,
            releaseDate,
            reviewText,
        });
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error updating the review');
    }
});

// Delete review route
app.get('/delete/:id', async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error deleting the review');
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});