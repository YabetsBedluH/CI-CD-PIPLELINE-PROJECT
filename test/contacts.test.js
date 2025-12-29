const request = require("supertest");
const app = require("../app");

describe("Contact Management API", () => {

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
  });

  it("should get all contacts", async () => {
    const res = await request(app).get("/contacts");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

});
