require('dotenv').config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

// Add CORS middleware
app.use(cors({
  origin: process.env.FRONTEND_URL
}));

// Add morgan middleware for logging
app.use(morgan('dev'));
app.use(express.json());

// In-memory data store
let contacts = [];
let idCounter = 1;

// ROOT endpoint - Welcome message
app.get("/", (req, res) => {
  res.status(200).json({ 
    message: "Backend Deployed Successfully"
  });
});

// CREATE contact
app.post("/contacts", (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const contact = {
    id: idCounter++,
    name,
    email,
    phone
  };

  contacts.push(contact);
  res.status(201).json(contact);
});

// READ all contacts
app.get("/contacts", (req, res) => {
  res.json(contacts);
});

// READ single contact
app.get("/contacts/:id", (req, res) => {
  const contact = contacts.find(c => c.id === parseInt(req.params.id));

  if (!contact) {
    return res.status(404).json({ message: "Contact not found" });
  }

  res.json(contact);
});

// UPDATE contact
app.put("/contacts/:id", (req, res) => {
  const contact = contacts.find(c => c.id === parseInt(req.params.id));

  if (!contact) {
    return res.status(404).json({ message: "Contact not found" });
  }

  const { name, email, phone } = req.body;

  contact.name = name || contact.name;
  contact.email = email || contact.email;
  contact.phone = phone || contact.phone;

  res.json(contact);
});

// DELETE contact
app.delete("/contacts/:id", (req, res) => {
  const index = contacts.findIndex(c => c.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ message: "Contact not found" });
  }

  contacts.splice(index, 1);
  res.json({ message: "Contact deleted" });
});

// Export for testing
module.exports = app;

// Start-server
if (require.main === module) {
  const PORT = 8000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
