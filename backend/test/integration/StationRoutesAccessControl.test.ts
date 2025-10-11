
import {User} from "common/entities/User";
import {createDefaultConfig} from "backend/api/configuration/config";
import {Express} from "express";
import {setupTestApp, teardownTestApp} from "backend_test/utilities/setupTestApp";
import UserRepositoryImpl from "backend/dal/repositories/impl/UserRepositoryImpl";
import JwtUtils from "backend/api/security/JwtUtils";
import PasswordUtils from "backend/api/security/PasswordUtils";
import Roles from "common/entities/Roles";
import request from "supertest";

const stationData = {
    station_id: "CENTRAL_STATION",
    city_name: "Kyiv",
    station_name: "Central Station",
    local_name: "Центральна станція",
    timezone: "Europe/Kiev",
    geolocation: {
        type: "Point",
        coordinates: [10, 20]
    },
    platform_name: "Platform A",
    status: "active",
    measured_parameters: ["PM10", "NO2"]
};

const updatedData = {
    station_id: "CENTRAL_STATION",
    city_name: "Updated Station",
    station_name: "Central Station",
    local_name: "Центральна станція",
    timezone: "Europe/Kiev",
    geolocation: {
        type: "Point",
        coordinates: [10, 20]
    },
    platform_name: "Platform A",
    status: "active",
    measured_parameters: ["PM10", "NO2"]
};

describe("Station Routes access control", () => {
    const config = createDefaultConfig();
    let app: Express;
    let adminToken: string;
    let userToken: string;

    beforeAll(async () => {
        app = await setupTestApp(config);
        const userRepository = new UserRepositoryImpl();
        const jwtUtils = new JwtUtils(config);
        const passwordUtils = new PasswordUtils(config);

        await userRepository.create({
            username: "admin",
            email: "admin@admin.com",
            password: await passwordUtils.encrypt("Secret123"),
            roles: [Roles.Admin]
        });

        await userRepository.create({
            username: "user",
            email: "user@user.com",
            password: await passwordUtils.encrypt("Secret123"),
            roles: [Roles.User]
        });

        adminToken = jwtUtils.getToken(await userRepository.getUserByUsernameOrEmail("admin") as User);
        userToken = jwtUtils.getToken(await userRepository.getUserByUsernameOrEmail("user") as User);
    });

    afterAll(async () => {
        await teardownTestApp();
    });

    it("POST /api/station should allow admin", async () => {
        const res = await request(app)
            .post("/api/station")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(stationData);

        expect(res.status).toBe(201);
    });

    it("POST /api/station should return 403 for non-admin", async () => {
        const res = await request(app)
            .post("/api/station")
            .set("Authorization", `Bearer ${userToken}`)
            .send(stationData);

        expect(res.status).toBe(403);
    });

    it("PUT /api/station/:id should return 403 for non-admin", async () => {
        const res = await request(app)
            .put("/api/station/CENTRAL_STATION")
            .set("Authorization", `Bearer ${userToken}`)
            .send(updatedData);

        expect(res.status).toBe(403);
    });

    it("DELETE /api/station/:id should return 403 for non-admin", async () => {
        const res = await request(app)
            .delete("/api/station/CENTRAL_STATION")
            .set("Authorization", `Bearer ${userToken}`);

        expect(res.status).toBe(403);
    });

    it("PUT /api/station/:id should allow admin to update the station", async () => {
        const res = await request(app)
            .put("/api/station/CENTRAL_STATION")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(updatedData);

        expect(res.status).toBe(200);
    });

    it("DELETE /api/station/:id should allow admin to delete the station", async () => {
        const res = await request(app)
            .delete("/api/station/CENTRAL_STATION")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.status).toBe(204);
    });

});