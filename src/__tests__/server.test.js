const { app } = require("../server.js");
const request = require("supertest");

describe("Testing the root API route", () => {

        // Test for the homepage route
        test("GET / should return Hello, world!", async () => {
            const response = await request(app).get("/");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                message: "Hello, world!",
            });
        });

        // Test regarding auth headers
        test("Server returns a response with no auth headers because we are not sending auth data", async () => {
            const response = await request(app).get("/");

            expect(response.header["Authorization"]).toBeFalsy();
        });
});

describe("Testing cors validation", () => {
    // Test for the homepage route
    test("GET / should have correct CORS headers for valid origin", async () => {
        const response = await request(app)
            .get("/")
            .set("Origin", "http://localhost:3000");
        expect(response.statusCode).toBe(200);
        expect(response.header["access-control-allow-origin"]).toBe("http://localhost:3000");
    });

    // Test regarding auth headers
    test("GET / should reject disallowed CORS origin", async () => {
        const response = await request(app)
            .get("/")
            .set("Origin", "http://invalid-origin.com");
        expect(response.statusCode).toBe(403);
    });
});



describe("Testing Controller API endpoints in server", () => {

    // Test for the AuthController endpoint
    test("GET /account should respond with 404 for unhandled route", async () => {
        const response = await request(app).get("/account");
        expect(response.statusCode).toBe(404);
    });

    //Test for the UserController endpoint
    test("GET /user should respond with 404 for unhandled route", async () => {
        const response = await request(app).get("/user");
        expect(response.statusCode).toBe(404);
    });

    //Test for the EventController endpoint
    test("GET /event should respond with 404 for unhandled route", async () => {
        const response = await request(app).get("/event");
        expect(response.statusCode).toBe(404);
    });

    //Test for the RSVPController endpoint
    test("GET /rsvp should respond with 404 for unhandled route", async () => {
        const response = await request(app).get("/rsvp");
        expect(response.statusCode).toBe(404);
    });

    //Test for the RSVPController endpoint
    test("GET /rsvp should respond with 404 for unhandled route", async () => {
        const response = await request(app).get("/rsvp");
        expect(response.statusCode).toBe(404);
    });

    //Test for the FollowController endpoint
    test("GET /follow should respond with 404 for unhandled route", async () => {
        const response = await request(app).get("/follow");
        expect(response.statusCode).toBe(404);
    });

    //Test for the ThemeController endpoint
    test("GET /themes should respond with 404 for unhandled route", async () => {
        const response = await request(app).get("/themes");
        expect(response.statusCode).toBe(404);
    });

    //Test for the EventSearchController endpoint
    test("GET /EventSearch should respond with 404 for unhandled route", async () => {
        const response = await request(app).get("/search");
        expect(response.statusCode).toBe(404);
    });
});