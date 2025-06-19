import { Prisma } from "@prisma/client";
import { TErrorSources, TGenericErrorResponse } from "../interface/error";

const handlePrismaClientError = (
  err: Prisma.PrismaClientKnownRequestError
): TGenericErrorResponse => {
  let message = "Database error occurred";
  const errorSources: TErrorSources = [];

  switch (err.code) {
    case "P2002": {
      // Unique constraint failed
      const target =
        Array.isArray(err.meta?.target) &&
        err.meta?.target.every((t) => typeof t === "string")
          ? (err.meta.target as string[]).join(", ")
          : "";
      message = `${target} must be unique`;
      errorSources.push({
        path: target || "unknown_field",
        message,
      });
      break;
    }
    case "P2003": {
      // Foreign key constraint failed
      const field =
        typeof err.meta?.field_name === "string"
          ? err.meta.field_name
          : "unknown_field";
      message = `Foreign key constraint failed on field: ${field}`;
      errorSources.push({
        path: field,
        message,
      });
      break;
    }
    case "P2025": {
      // Record to update/delete does not exist
      message =
        typeof err.meta?.cause === "string"
          ? err.meta.cause
          : "Record not found";
      errorSources.push({
        path: "",
        message,
      });
      break;
    }
    default: {
      errorSources.push({
        path: "",
        message: err.message,
      });
    }
  }

  return {
    statusCode: 400,
    message,
    errorSources,
  };
};

export default handlePrismaClientError;
