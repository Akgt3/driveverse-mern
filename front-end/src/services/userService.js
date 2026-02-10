const USER_API = "http://localhost:5000/api/users";

export const changePasswordRequest = async (
  currentPassword,
  newPassword
) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${USER_API}/change-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Password update failed");
  }

  return data;
};
