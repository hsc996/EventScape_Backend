const { app } =require("../server.js");
const request = require("supertest");
const { UserModel } = require("../models/UserModel.js");
const validateUserAuth = require("../middleware/validateUserAuth.js");

// Mock the User to simulate the database

jest.mock("../models/UserModel.js");
jest.mock("../middlewares/validateUserAuth", () => ({
    validateUserAuth: jest.fn((request, response, next) => {
        request.authUserData = { userId: "507f1f77bcf86cd799439011" };
        next();
    })
}));

describe("GET /user/view/:userId - Fetch User Profile", () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("Should return user profile and status code 200", async () => {
        const mockUserId = "507f1f77bcf86cd799439011";
        const mockUser = {
            _id: mockUserId,
            username: "mockUser123",
            email: "mockuser@example.com",
            password: "hashedPassword123!",
            isAdmin: false,
            followers: ["507f1f77bcf86cd799439012"],
            following: ["507f1f77bcf86cd799439013"],
            __v: 1
        };

        UserModel.findOne.mockResolvedValue(mockUser);

        const response = await request(app).get(`/user/view/${mockUserId}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            message: `User profile with ID ${mockUserId} found successfully.`,
            data: mockUser,
        });
        expect(UserModel.findOne).toHaveBeenCalledWith({ _id: mockUserId });
    });

    test("Should return 404 if user not found", async () => {
        const mockUserId = "507f1f77bcf86cd799439011";
        UserModel.findOne.mockResolvedValue(null);

        const response = await request(app).get(`/user/view/${mockUserId}`);

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({
            success: false,
            message: "User not found."
        });
        expect(UserModel.findOne).toHaveBeenCalledWith({ _id: mockUserId });
    });

    test("Should return 500 on a database error", async () => {
        jest.setTimeout(10000);

        const mockUserId = "507f1f77bcf86cd799439011";
        UserModel.findOne.mockRejectedValue(new Error("Database error"));

        const response = await request(app).get(`/user/view/${mockUserId}`);

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({
            success: false,
            message: "Internal Server Error.",
        });
        expect(UserModel.findOne).toHaveBeenCalledWith({ _id: mockUserId });
    });
})




describe("PATCH /user/edit - Update User Profile", () => {
    let mockUser;
    let mockUserData;

    beforeEach(() => {
        mockUserId = "507f1f77bcf86cd799439011";
        mockUserData = { username: "newUsername", password: "NewP@ssw0rd!" };
    })

    test("Should status code 400 if username already taken", async () => {
        const mockDuplicateData = { _id: "507f1f77bcf86cd799439010", username: "newUsername" };

        UserModel.findOne.mockResolvedValue(mockDuplicateData);
        
        const response = await request(app)
            .patch("/user/edit")
            .set("Authorization", "Bearer valid_token")
            .send(mockUserData);
        
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            success: false,
            message: "Username already taken. Please choose a different one."
        });
    });

    // test("Should return status code 400 if password does not meet criteria", async () => {

    // });

    // test("Should return status code 404 if user does not exist", async () => {

    // });

    // test("Should return status code 200 and update profile successfully", async () => {

    // });
})