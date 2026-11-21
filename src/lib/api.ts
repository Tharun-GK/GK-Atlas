import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function success<T>(data: T, status = 200) {
  return NextResponse.json({ data, error: null }, { status });
}

export function validationError(error: ZodError) {
  return NextResponse.json(
    { data: null, error: { code: "VALIDATION_ERROR", message: "Invalid query parameters.", details: error.flatten() } },
    { status: 400 },
  );
}

export function databaseError(error: unknown) {
  console.error(error);
  return NextResponse.json(
    { data: null, error: { code: "DATABASE_ERROR", message: "Database unavailable. Configure DATABASE_URL and run migrations." } },
    { status: 503 },
  );
}
