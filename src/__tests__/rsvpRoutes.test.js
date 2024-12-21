const request = require("supertest");
const { app } = require("../server.js");
const { AppError } = require("../functions/errorFunctions.js");
const { RSVPModel } = require("../models/RSVPModel.js");

jest.mock("../models/EventModel.js");
jest.mock("../models/RSVPModel.js");
jest.mock("../models/UserModel.js");

jest.mock("../middleware/validateUserAuth.js", () => ({
    validateUserAuth: jest.fn((request, response, next) => {
        request.authUserData = { userId: "507f1f77bcf86cd799439011" };
        next();
    })
}));


describe("POST rsvp/attending/:eventId", () => {
    let eventId = "67626b08380cf23db3bd753f";
    let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzYyNmIwODM4MGNmMjNkYjNiZDc1M2YiLCJ1c2VybmFtZSI6IlVzZXIyIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTczNDU2MDM3NywiZXhwIjoxNzM1MTY1MTc3fQ.LlxJS2vq_4xzf8s82S13O1pelSwt4R0KzRjh9FoQTmI";

    test("should return 400 if status is missing", async () => {
        const response = await request(app)
            .post(`/rsvp/attending/${eventId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({});

        expect(response.status).toBe(400);  
        expect(response.body.message).toBe("Status is required.");
    });

    test("should return 400 if status is invalid", async () => {
        const response = await request(app)
            .post(`/rsvp/attending/${eventId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ status: "invalid" });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid response type. Status must be 'yes', 'maybe' or 'no'.");
    });

    test("should return 404 if event does not exist", async () => {
        const mockEventId = "nonexistentEventId";
        const response = await request(app)
            .post(`/rsvp/attending/${mockEventId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ status: "yes" });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Event not found.");
    });

})
