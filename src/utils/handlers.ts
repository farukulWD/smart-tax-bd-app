import { Colors } from "@/context/ThemeProvider";
import { showToast } from "./commonFunction";

export interface FieldError {
  message: string;
  field: string;
}

export const handleErrorResponse = (response: any, source: string) => {
  const errorData = response?.data || response;
  const config = response?.config;

  const errorDetails =
    errorData.errors?.map((err: FieldError) => ({
      field: err.field,
      message: err.message,
    })) || [];
  showToast({
    message: response.response.data.message || response.response.data.error,
    background: Colors.error,
  });
  console.log("error.response.data", JSON.stringify(response.response.data, null, 2));
  console.log({
    success: false,
    from: source,
    error: response.response.data.error || "Error",
    message: response.response.data.message || "Message",
  });
  return {
    success: false as const,
    message: errorData.message || "Something went wrong",
    statusCode: errorData.statusCode || response?.status || 500,
    data: null, // ✅ Ensures ApiResponse structure is complete
    errors: errorDetails,
    source: source || (config ? `${config.method?.toUpperCase()} ${config.url}` : undefined),
  };
};
