const request = require("supertest");
const { app } = require("../server.js");

const { UserModel } = require("../models/UserModel.js");
const { hashPassword, comparePassword, validateEmail, validatePassword } = require("../functions/helperFunctions.js");
const { generateJWT } = require("../functions/jwtFunctions.js");

jest.mock("../models/UserModel.js");
jest.mock("../functions/helperFunctions.js");
jest.mock("../functions/jwtFunctions.js");


hashPassword.mockImplementation((password) => `hashed_${password}`);
validateEmail.mockImplementation((email) => /\S+@\S+\.\S+/.test(email));
validatePassword.mockImplementation((password) => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password));
generateJWT.mockImplementation((id, username) => `jwt_${id}_${username}`);

describe("POST /account/signup - User Registration", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("Should register a new user successfully", async () => {
        const mockRequestBody = {
            username: "newUser",
            email: "newuser@example.com",
            password: "ValidP@ssw0rd",
        };

        const mockUser = {
            _id: "507f1f77bcf86cd799439011",
            username: mockRequestBody.username,
            email: mockRequestBody.email,
            password: `hashed_${mockRequestBody.password}`,
            isAdmin: false,
        };

        UserModel.findOne.mockResolvedValue(null);
        UserModel.create.mockResolvedValue(mockUser);
        generateJWT.mockReturnValue("jwt_507f1f77bcf86cd799439011_newUser");

        const response = await request(app)
            .post("/account/signup")
            .send(mockRequestBody);
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            message: "User registered successfully.",
            data: {
                jwt: expect.any(String),
                user: {
                    id: mockUser._id,
                    username: mockUser.username
                }
            }
        });

        expect(UserModel.findOne).toHaveBeenCalledWith({
            $or: [{ email: mockRequestBody.email}, {username: mockRequestBody.username}],
        });
        expect(hashPassword).toHaveBeenCalledWith(mockRequestBody.password);
        expect(UserModel.create).toHaveBeenCalledWith({
            username: mockRequestBody.username,
            email: mockRequestBody.email,
            password: `hashed_${mockRequestBody.password}`,
            isAdmin: false
        });
    });
})

