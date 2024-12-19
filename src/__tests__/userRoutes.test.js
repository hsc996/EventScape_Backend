const request = require("supertest");
const { app } =require("../server.js");

const { UserModel } = require("../models/UserModel.js");


jest.mock("../models/UserModel.js");

jest.mock("../middleware/validateUserAuth.js", () => ({
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
            message: "Error finding profile, please try again later.",
        });
        expect(UserModel.findOne).toHaveBeenCalledWith({ _id: mockUserId });
    });
})




describe("PATCH /user/edit - Update User Profile", () => {
    let mockUserId;
    let mockUserData;

    beforeEach(() => {
        mockUserId = "507f1f77bcf86cd799439011";
        mockUserData = { username: "newUsername", password: "NewP@ssw0rd!" };
    });

    test("Should status code 400 if username already taken", async () => {
        let mockDuplicateData = { _id: "507f1f77bcf86cd799439010", username: "newUsername" }

        UserModel.findOne.mockResolvedValue(mockDuplicateData);
        
        const response = await request(app)
            .patch("/user/edit")
            .set("Authorization", "Bearer valid_token")
            .send({ username: "newUsername" });
        
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            success: false,
            message: "Username already taken. Please choose a different one."
        });
    });

    test("Should return status code 400 if password does not meet criteria", async () => {
        let mockInvalidPassword = { password: "pw" };

        const response = await request(app)
            .patch("/user/edit")
            .set("Authorization", "Bearer valid_token")
            .send(mockInvalidPassword);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            success: false,
            message:  "Password must be at least 8 characters and include at least one letter, one number, and one special character."
        });
    });

    test("Should return status code 404 if user does not exist", async () => {    
        UserModel.findOne.mockResolvedValue(null);
        UserModel.findOneAndUpdate.mockResolvedValue(null);

        const response = await request(app)
            .patch("/user/edit")
            .set("Authorization", "Bearer valid_token")
            .send(mockUserData);
        
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({
            success: false,
            message: "User not found."
        });

        expect(UserModel.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: expect.any(Object) },
            expect.any(Object),
            { new: true }
        );
    });
    

    test("Should return status code 200 and update profile successfully", async () => {
        const updatedUserData = {
            _id: mockUserId,
            username: "newUsername",
            email: "mockuser@example.com",
            password: "hashedNewPassword123!",
            isAdmin: false
        };

        UserModel.findOneAndUpdate.mockResolvedValue(updatedUserData);

        const response = await request(app)
            .patch("/user/edit")
            .set("Authorization", "Bearer valid_token")
            .send(mockUserData);
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            message: "Profile data updated successfully.",
            data: updatedUserData
        });

        expect(UserModel.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: expect.any(Object) },
            expect.any(Object),
            { new: true }
        );
    });
})



describe("DELETE /user/delete - Delete User Profile", () => {

    const mockUserId = "507f1f77bcf86cd799439011";

    test("Should return status code 404 if user does not exist", async () => {
        UserModel.deleteOne.mockResolvedValue({ deletedCount: 0 });

        const response = await request(app)
            .delete("/user/delete")
            .set("Authorization", "Bearer valid_token");

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({
            success: false,
            message: "User not found."
        });
        expect(UserModel.deleteOne).toHaveBeenCalledWith({ _id: mockUserId });
    });

    test("Should return status code 200 and update profile succesfully", async () => {
        UserModel.deleteOne.mockResolvedValue({ deletedCount: 1 });

        const response = await request(app)
            .delete("/user/delete")
            .set("Authorization", "Bearer valid_token");

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            message:`Profile with ID ${mockUserId} deleted successfully.`,
            data: { deletedCount: 1 }
        })
    });
})