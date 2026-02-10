// src/services/listingService.js

const LISTING_API = "http://localhost:5000/api/listings";

/* ================= GET ALL LISTINGS (PUBLIC) ================= */
export const getAllListings = async () => {
  const res = await fetch(LISTING_API);

  const data = await res.json();

  if (!res.ok) {
    throw new Error("Failed to fetch listings");
  }

  return data;
};
