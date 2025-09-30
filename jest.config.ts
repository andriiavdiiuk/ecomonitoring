/** @jest-config-loader esbuild-register */
import type {Config} from '@jest/types';
import {createDefaultPreset} from "ts-jest";

const config: Config.InitialOptions = {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    testMatch: ['**/test/**/*.test.ts'],
    extensionsToTreatAsEsm: [".ts"],
    transform: {
        '^.+\\.[tj]sx?$': [
            'ts-jest',
            {
                useESM: true,
            },
        ],
    },
    moduleNameMapper: {
        '^backend/(.*)$': '<rootDir>/backend/src/$1',
        '^backend_test/(.*)$': '<rootDir>/backend/test/$1',
    },
    setupFilesAfterEnv: ["./backend/test/utilities/disableLogging.ts"]
};

export default config;
