import request from "supertest";
import {setupTestApp, teardownTestApp} from "backend_test/utilities/setupTestApp";
import {Express} from "express";

describe("User Routes", () => {
    let app: Express;

    beforeAll(async (): Promise<void> => {
        app = await setupTestApp();
    });

    afterEach(async () => {

    });

    afterAll(async () => {
        await teardownTestApp();
    });

    it("should not register invalid user", async () => {
        const res = await request(app).post("/api/user/register").send({});
        expect(res.status).toBe(400);
    });

    it("should not register user with invalid password", async () => {
        const res = await request(app)
            .post("/api/user/register")
            .send({ username: "senduser", password: "password" });

        expect(res.status).toBe(400);
    });

    it("should register a new user", async () => {
        const res = await request(app)
            .post("/api/user/register")
            .send({ username: "testuser", email:"email@email.com", password: "Secret123" });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("token");
    });

    it("should not register a new user with existing username", async () => {

        const res = await request(app)
            .post("/api/user/register")
            .send({ username: "testuser", email:"email1@email.com" , password: "Secret123" });

        expect(res.status).toBe(409);
    });

    it("should not register a new user with existing email", async () => {

        const res = await request(app)
            .post("/api/user/register")
            .send({ username: "testuser1", email:"email@email.com", password: "Secret123" });

        expect(res.status).toBe(409);
    });

    it("should not login an existing user", async () => {
        const res = await request(app)
            .post("/api/user/login")
            .send({ username: "testuser", password: "secret" });

        expect(res.status).toBe(401);
    });

    it("should not login non existing user", async () => {
        const res = await request(app)
            .post("/api/user/login")
            .send({ username: "user123", password: "Secret123" });

        expect(res.status).toBe(401);
    });


    it("should login an existing user", async () => {
        const res = await request(app)
            .post("/api/user/login")
            .send({ username: "testuser", password: "Secret123" });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("token");
    });


    it("should login an existing user by email", async () => {
        const res = await request(app)
            .post("/api/user/login")
            .send({ username: "email@email.com", password: "Secret123" });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("token");
    });
});
