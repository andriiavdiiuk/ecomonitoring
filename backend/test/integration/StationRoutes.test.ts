/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import request from "supertest";
import {Express, NextFunction, Request} from "express";
import {setupTestApp, teardownTestApp} from "backend_test/utilities/setupTestApp";
import Roles from "common/entities/Roles";

function expectStationObject(station: unknown): void {

    expect(station).toMatchObject({
        station_id: expect.any(String),
        city_name: expect.any(String),
        station_name: expect.any(String),
        local_name: expect.any(String),
        timezone: expect.any(String),
        geolocation: {
            type: expect.any(String),
            coordinates: expect.any(Array),
        },
        platform_name: expect.any(String),
        status: expect.any(String),
        measured_parameters: expect.any(Array),
    });
}

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
jest.mock("backend/api/middleware/authMiddleware", () => ({
    authMiddleware: (_jwtUtils: never, _roles: Roles[]) => (req: Request, res: Response, next: NextFunction) => {
        next()
    },
}));

describe("Station Routes", () => {
    let app: Express;

    beforeAll(async (): Promise<void> => {

        app = await setupTestApp();
    });

    afterEach(async () => {

    });

    afterAll(async () => {
        await teardownTestApp();
    });


    it("POST /api/station should create a station", async () => {
        const res = await request(app).post("/api/station").send(stationData);
        expect(res.status).toBe(201);
        expectStationObject(res.body as unknown);
    });


    it("POST /api/station should not create a station", async () => {
        const res = await request(app).post("/api/station").send({ station_id: "CENTRAL_STATION" });
        expect(res.status).toBe(400);
    });


    it("GET /api/stations should return stations array", async () => {
        const res = await request(app).get("/api/stations");
        expect(res.status).toBe(200);

        expect(res.body).toHaveProperty("data");
        expect(Array.isArray(res.body.data)).toBe(true);

        (res.body.data as []).forEach((station: unknown) => {
            expectStationObject(station);
        });

        expect(res.body).toHaveProperty("pagination");
        expect(res.body.pagination).toHaveProperty("page");
        expect(res.body.pagination).toHaveProperty("limit");
        expect(res.body.pagination).toHaveProperty("total");
        expect(res.body.pagination).toHaveProperty("pages");
    });


    it("GET /api/stations?city=Kyiv&status=active&page=1&limit=10 should return stations array", async () => {
        const res = await request(app).get("/api/stations?city=Kyiv&status=active&page=1&limit=10");
        expect(res.status).toBe(200);

        expect(res.body).toHaveProperty("data");
        expect(Array.isArray(res.body.data)).toBe(true);

        (res.body.data as []).forEach((station: unknown) => {
            expectStationObject(station);
        });

        expect(res.body).toHaveProperty("pagination");
        expect(res.body.pagination).toHaveProperty("page");
        expect(res.body.pagination).toHaveProperty("limit");
        expect(res.body.pagination).toHaveProperty("total");
        expect(res.body.pagination).toHaveProperty("pages");
    });

    it("GET /api/station/:id should return created station", async () => {
        const res = await request(app).get(`/api/station/CENTRAL_STATION`);
        expect(res.status).toBe(200);
        expectStationObject(res.body as unknown);
    });

    it("PUT /api/station/:id should update station", async () => {
        const res = await request(app).put(`/api/station/CENTRAL_STATION`).send(updatedData);
        expect(res.status).toBe(200);
        expectStationObject(res.body as unknown);
        expect(res.body).toHaveProperty("city_name", "Updated Station");
    });

    it("PUT /api/station/:id should not update station", async () => {
        const res = await request(app).put(`/api/station/CENTRAL_STATION`).send({station_id: "CENTRAL_STATION"});
        expect(res.status).toBe(400);
    });

    it("GET /api/station/nearby/:longitude/:latitude/:maxDistance should return nearby stations", async () => {
        const res = await request(app).get("/api/station/nearby/10/20/1000");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        (res.body as []).forEach((station: unknown) => {
            expectStationObject(station);
        });
    });

    it("GET /api/station/nearby/:longitude/:latitude/:maxDistance should not return nearby stations", async () => {
        const res = await request(app).get("/api/station/nearby/10");
        expect(res.status).toBe(404);
    });

    it("DELETE /api/station/:id should delete the station", async () => {
        const res = await request(app).delete(`/api/station/CENTRAL_STATION`);
        expect(res.status).toBe(204);
    })


    it("GET /api/station/:id should return 404 after deletion", async () => {
        const res = await request(app).get(`/api/station/CENTRAL_STATION`);
        expect(res.status).toBe(404);
    });
});


