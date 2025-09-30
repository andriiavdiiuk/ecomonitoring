import {createDefaultConfig} from 'backend/api/configuration/config';
import { createServer } from "backend/server";

await createServer(createDefaultConfig());
