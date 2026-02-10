// Create this new file: src/utils/apiInterceptor.js

/**
 * Global API error handler
 * Catches ACCOUNT_BLOCKED responses and force logs out the user
 */
export const handleApiResponse = async (response) => {
  if (!response.ok) {
    const data = await response.json();

    // 🚫 If account is blocked, force logout immediately
    if (data.code === "ACCOUNT_BLOCKED" || response.status === 403) {
      console.log("🚫 Account blocked detected via API");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/auth";

      throw new Error(data.message || "Account blocked");
    }

    throw new Error(data.message || "Request failed");
  }

  return response;
};

/**
 * Wrapper for fetch that includes auth token and error handling
 */
export const authenticatedFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  return handleApiResponse(response);
};
