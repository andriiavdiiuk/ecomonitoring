/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
 
 

import {User} from "backend/dal/entities/User";
import {createDefaultConfig} from "backend/api/configuration/config";
import {Express} from "express";
import {setupTestApp, teardownTestApp} from "backend_test/utilities/setupTestApp";
import UserRepositoryImpl from "backend/dal/repositories/impl/UserRepositoryImpl";
import JwtUtils from "backend/api/security/JwtUtils";
import PasswordUtils from "backend/api/security/PasswordUtils";
import {Roles} from "backend/dal/entities/Roles";
import request from "supertest";

const sampleMeasurement = {
    station_id: "STATION_ID23",
    status: "active",
    measurement_time: "2025-07-31T12:00:00Z",
    pollutants: [
        {
            pollutant: "PM10",
            value: 315.0,
            unit: "ug/m3",
            averaging_period: "1 hour",
            quality_flag: "valid"
        }
    ]
};

describe("Measurement Routes access control", () => {
    let app: Express;
    let adminToken: string;
    let userToken: string;
    let measurement_id: string;
    const config = createDefaultConfig();

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

    it("POST /api/measurement should allow admin", async () => {
        const res = await request(app)
            .post("/api/measurement")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(sampleMeasurement);

        expect(res.status).toBe(201);
        measurement_id = res.body.measurement._id;
    });

    it("POST /api/measurement should NOT allow non-admin", async () => {
        const res = await request(app)
            .post("/api/measurement")
            .set("Authorization", `Bearer ${userToken}`)
            .send(sampleMeasurement);

        expect(res.status).toBe(403);
    });

    it("PUT /api/measurement/:id should NOT allow non-admin", async () => {
        const res = await request(app)
            .put(`/api/measurement/${measurement_id}`)
            .set("Authorization", `Bearer ${userToken}`)
            .send(sampleMeasurement);

        expect(res.status).toBe(403);
    });

    it("DELETE /api/measurement/:id should NOT allow non-admin", async () => {
        const res = await request(app)
            .delete(`/api/measurement/${measurement_id}`)
            .set("Authorization", `Bearer ${userToken}`);

        expect(res.status).toBe(403);
    });

    it("PUT /api/measurement/:id should allow admin", async () => {
        const res = await request(app)
            .put(`/api/measurement/${measurement_id}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send(sampleMeasurement);

        expect(res.status).toBe(200);
    });

    it("DELETE /api/measurement/:id should allow admin", async () => {
        const res = await request(app)
            .delete(`/api/measurement/${measurement_id}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.status).toBe(204);
    });
});
