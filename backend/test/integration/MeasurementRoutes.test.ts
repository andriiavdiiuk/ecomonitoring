/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */

import request from "supertest";
import {Express, NextFunction, Request} from "express";
import {setupTestApp, teardownTestApp} from "backend_test/utilities/setupTestApp";
import Roles from "common/entities/Roles";

jest.mock("backend/api/middleware/authMiddleware", () => ({
    authMiddleware: (_jwtUtils: never, _roles: Roles[]) => (req: Request, res: Response, next: NextFunction) => {
        next()
    },
}));

function expectMeasurementObject(measurement: unknown): void {
    expect(measurement).toMatchObject({
        _id: expect.any(String),
        station_id: expect.any(String),
        status: expect.any(String),
        measurement_time: expect.any(String),
        pollutants: expect.any(Array),
    });
    
    if ((measurement as any).pollutants) {
        (measurement as any).pollutants.forEach((p: never) => {
            expect(p).toMatchObject({
                pollutant: expect.any(String),
                value: expect.any(Number),
                unit: expect.any(String),
                averaging_period: expect.any(String),
                quality_flag: expect.any(String),
            });
        });
    }
}

const sampleMeasurement = {
    station_id: "STATION_ID",
    status: "active",
    measurement_time: "2024-07-31T12:00:00Z",
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

const sampleUpdateMeasurement = {
    station_id: "STATION_ID2",
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

describe("Measurement Routes", () => {
    let app: Express;
    let measurement_id: string;

    beforeAll(async () => {
        app = await setupTestApp();
    });

    afterAll(async () => {
        await teardownTestApp();
    });

    it("GET /api/measurements should return list", async () => {
        const res = await request(app).get("/api/measurements");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        (res.body.data as []).forEach(m => { expectMeasurementObject(m); });
        expect(res.body).toHaveProperty("pagination");
        expect(res.body.pagination).toHaveProperty("page");
        expect(res.body.pagination).toHaveProperty("limit");
        expect(res.body.pagination).toHaveProperty("total");
        expect(res.body.pagination).toHaveProperty("pages");
    });

    it("POST /api/measurement should create measurement", async () => {
        const res = await request(app).post("/api/measurement").send(sampleMeasurement);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("measurement");
        expectMeasurementObject(res.body.measurement);
        expect(res.body).toHaveProperty("thresholds");
        measurement_id = res.body.measurement._id
    });


    it("GET /api/measurement/:id should return a measurement", async () => {
        const res = await request(app).get(`/api/measurement/${measurement_id}`);
        expect(res.status).toBe(200);
        expectMeasurementObject(res.body);
    });

    it("GET /api/measurement/:id should return 404 if not found", async () => {
        const res = await request(app).get("/api/measurement/nonexistent123");
        expect(res.status).toBe(404);
    });


    it("PUT /api/measurement/:id should update measurement", async () => {
        const res = await request(app).put(`/api/measurement/${measurement_id}`)
            .send(sampleUpdateMeasurement);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("measurement");
        expectMeasurementObject(res.body.measurement);
        expect(res.body.measurement).toHaveProperty("station_id", "STATION_ID2");
    });

    it("PUT /api/measurement/:id should not update bad request", async () => {
        const res = await request(app).put(`/api/measurement/${measurement_id}`)
            .send({station_id: "STATION_ID"});
        expect(res.status).toBe(400);
    });

    it("GET /api/measurements/latest should return latest measurements", async () => {
        const res = await request(app).get("/api/measurement/latest");
        expect(res.status).toBe(200);
        (res.body as []).forEach(m => { expectMeasurementObject(m); });
    });

    it("GET /api/measurement/statistics should return stats", async () => {
        const res = await request(app)
            .get("/api/measurement/statistics")
            .query({
                station_id: "STATION_ID2",
                startDate: "2020-09-27",
                endDate: "2026-09-27",
                pollutant: "PM10",
            })
        expect(res.status).toBe(200);
        (res.body as any[]).forEach(stat => {
            expect(stat).toHaveProperty("avg");
            expect(stat).toHaveProperty("max");
            expect(stat).toHaveProperty("min");
            expect(stat).toHaveProperty("count");
        });
    });

    it("DELETE /api/measurement/:id should delete measurement", async () => {
        const res = await request(app).delete(`/api/measurement/${measurement_id}`);
        expect(res.status).toBe(204);
    });

    it("DELETE /api/measurement/:id should return 404 after deletion", async () => {
        const res = await request(app).delete(`/api/measurement/${measurement_id}`);
        expect(res.status).toBe(404);
    });

});
