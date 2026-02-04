const request = require("supertest");
const app = require("../app");

describe("Contact Management API", () => {
  
  // Test: Root endpoint
  it("should return welcome message at root", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Backend has been Deployed Successfully");
  });

  // Test: Create contact
  it("should create a contact", async () => {
    const res = await request(app)
      .post("/contacts")
      .send({
        name: "John Doe",
        email: "john@example.com",
        phone: "123456789"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("John Doe");
    expect(res.body.email).toBe("john@example.com");
  });

  // Test: Get all contacts
  it("should get all contacts", async () => {
    const res = await request(app).get("/contacts");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Test: Missing fields validation
  it("should return 400 when creating contact with missing fields", async () => {
    const res = await request(app)
      .post("/contacts")
      .send({
        name: "Jane Doe"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("All fields are required");
  });

});
