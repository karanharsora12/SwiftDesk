import { createServer } from "node:http";
import cors from "cors";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { Server } from "socket.io";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData,
} from "@swiftdesk/types";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { env } from "./config/env";
import { DeviceRegistry } from "./services/deviceRegistry";
import { SessionManager } from "./services/sessionManager";
import {
  handlePendingSessionTimeout,
  registerSocketHandlers,
} from "./socket/handlers/registerSocketHandlers";
import { logger } from "./utils/logger";

const app = express();
const httpServer = createServer(app);
const acceptedOrigins = new Set(
  env.CLIENT_ORIGIN.split(",").map((origin) => origin.trim()),
);

app.disable("x-powered-by");
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10kb" }));
app.use(
  rateLimit({
    windowMs: 60_000,
    limit: 120,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  }),
);

app.get("/health", (_request: Request, response: Response) => {
  response.status(200).json({ status: "ok", service: "swiftdesk-signaling" });
});

app.use((_request: Request, response: Response) => {
  response.status(404).json({ error: "Not found" });
});

app.use(
  (
    error: unknown,
    _request: Request,
    response: Response,
    _next: NextFunction,
  ) => {
    logger.warn(
      {
        event: "http.error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      "HTTP request failed",
    );
    response.status(500).json({ error: "Internal server error" });
  },
);

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  DefaultEventsMap,
  SocketData
>(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: false,
  },
  maxHttpBufferSize: 10_000,
  transports: ["websocket"],
  pingTimeout: 20_000,
  connectTimeout: 10_000,
});

const registry = new DeviceRegistry();
const sessionManager = new SessionManager(
  env.PENDING_REQUEST_TIMEOUT_MS,
  (session) => {
    handlePendingSessionTimeout(io, registry, session);
  },
);

io.use((socket, next) => {
  const origin = socket.handshake.headers.origin;
  if (origin && !acceptedOrigins.has(origin))
    return next(new Error("Origin is not allowed."));

  next();
});

io.on("connection", (socket) => {
  registerSocketHandlers(socket, {
    io,
    deviceRegistry: registry,
    sessionManager,
  });
});

httpServer.listen(env.PORT, () => {
  logger.info(
    { event: "server.started", port: env.PORT },
    `SwiftDesk signaling server running on port ${env.PORT}`,
  );
});

function createOriginValidator(): (
  origin: string | undefined,
  callback: (error: Error | null, allow?: boolean) => void,
) => void {
  return (origin, callback) => {
    if (!origin || acceptedOrigins.has(origin)) return callback(null, true);
    callback(new Error("Origin is not allowed."));
  };
}
