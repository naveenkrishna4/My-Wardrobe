import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from "path";

const __dirname = path.resolve();

const app = express();
const PORT = 5000;

// Apply middleware
app.use(cors());
app.use(bodyParser.json());

// Endpoint to verify reCAPTCHA token
app.post('/verify-recaptcha', async (req, res) => {
    const { token } = req.body;
    const secretKey ='JO4pAAAAAIcr9Y5dbCcok0_dX0NHh7DvHW7B'; 

    try {
        console.log('Received reCAPTCHA token:', token);
        const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
            params: {
                secret: secretKey,
                response: token,
            },
        });
        const { success } = response.data;
        console.log('reCAPTCHA verification response:', response.data);
        if (success) {
            res.status(200).json({ success: true, message: 'reCAPTCHA token verified successfully' });
        } else {
            res.status(400).json({ success: false, error: 'Invalid reCAPTCHA token' });
        }
    } catch (error) {
        console.error('Error verifying reCAPTCHA token:', error);
        res.status(500).json({ success: false, error: 'An internal server error occurred' });
    }
});

app.use(express.static(path.join(__dirname, "frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "build", "public/index.html"));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
