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
        '^backend/(.*)$': '<rootDir>/src/$1',
        '^backend_test/(.*)$': '<rootDir>/test/$1',
    },
    setupFilesAfterEnv: ["./test/utilities/disableLogging.ts"]
};

export default config;
