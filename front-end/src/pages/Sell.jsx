import { useState, useEffect } from "react";
import {
  FiUser,
  FiBriefcase,
  FiCheckCircle,
  FiUpload,
  FiChevronDown
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Sell() {
  const [images, setImages] = useState([]);
  const [sellerType, setSellerType] = useState("individual");

  const [location, setLocation] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [km, setKm] = useState("");

  const [fuel, setFuel] = useState("");
  const [transmission, setTransmission] = useState("");
  const [description, setDescription] = useState("");
  const [owners, setOwners] = useState("");
  const [body, setBody] = useState("");
  const [engine, setEngine] = useState("");

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]); // ✅ FIXED: Append instead of replace
  };

  const handlePostListing = async () => {
    if (!user) {
      toast.error("Please login first");
      return;
    }

    // ✅ VALIDATION
    if (!brand || !model || !year || !price || !km || !location) {
      toast.error("Please fill all required fields");
      return;
    }

    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    const formData = new FormData();
    formData.append("title", `${brand} ${model}`);
    formData.append("price", price);
    formData.append("location", location);
    formData.append("year", year);
    formData.append("km", km);
    formData.append("brand", brand);
    formData.append("model", model);
    formData.append("fuel", fuel);
    formData.append("transmission", transmission);
    formData.append("description", description);
    formData.append("engine", engine);
    formData.append("owners", owners);
    formData.append("body", body);
    formData.append("sellerType", sellerType);

    images.forEach((img) => {
      formData.append("images", img);
    });

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/listings`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Create failed");
      }

      toast.success("Listing posted successfully");

      navigate("/my-ads", {
        replace: true,
        state: { refresh: Date.now() },
      });
    } catch (err) {
      console.error("Post listing error:", err);
      toast.error(err.message || "Failed to post listing");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] transition-colors pt-18">
      <div className="max-w-[900px] mx-auto px-6 py-16">

        {/* HEADER */}
        <h1 className="text-[36px] font-semibold text-black dark:text-white">
          Sell Your Car
        </h1>
        <p className="mt-3 text-[16px] text-gray-600 dark:text-neutral-400 max-w-[620px]">
          List your car for sale and reach verified buyers across India.
          Whether you're an individual owner or a dealer, DriveVerse helps you
          sell with clarity and confidence.
        </p>

        {/* SELLER TYPE */}
        <div className="mt-12">
          <h2 className="text-[18px] font-medium text-black dark:text-white mb-4">
            You are selling as
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SellerCard
              active={sellerType === "individual"}
              icon={<FiUser size={20} />}
              title="Individual Seller"
              desc="Sell your personal car directly"
              onClick={() => setSellerType("individual")}
            />

            <SellerCard
              active={sellerType === "dealer"}
              icon={<FiBriefcase size={20} />}
              title="Dealer / Business"
              desc="List vehicles as a showroom"
              onClick={() => setSellerType("dealer")}
            />
          </div>
        </div>

        {/* VEHICLE FORM */}
        <div className="mt-16 bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-[#333333] rounded-lg p-6 space-y-6 shadow-sm">
          <h3 className="text-[18px] font-semibold text-black dark:text-white">
            Vehicle Details
          </h3>

          {/* BASIC INFO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Brand (BMW, Audi…)"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
            <Input
              placeholder="Model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
            <Input
              placeholder="Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
            <Input
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <Input
              placeholder="Kilometers Driven"
              value={km}
              onChange={(e) => setKm(e.target.value)}
            />
            <Input
              placeholder="Location (City, State)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            {/* MAP PREVIEW - FIXED */}
            {location && (
              <div className="md:col-span-2 mt-4 rounded-lg overflow-hidden border border-gray-200 dark:border-[#333333]">
                <iframe
                  title="map"
                  className="w-full h-[260px]"
                  loading="lazy"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    location
                  )}&z=13&output=embed`}
                />
              </div>
            )}
          </div>

          {/* EXTRA DETAILS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Transmission"
              options={["Manual", "Automatic", "CVT", "Robotic", "iMT", "AMT"]}
              value={transmission}
              onChange={(v) => setTransmission(v)}
            />

            <Select
              label="Number of Owners"
              options={["First", "Second", "Third", "More than Three"]}
              value={owners}
              onChange={(v) => setOwners(v)}
            />

            <Select
              label="Fuel Type"
              options={["Petrol", "Diesel", "Electric", "Hybrid", "CNG"]}
              value={fuel}
              onChange={(v) => setFuel(v)}
            />

            <Select
              label="Body Type"
              options={["Hatchback", "Sedan", "SUV", "Coupe", "Convertible", "Pickup", "Van", "MUV"]}
              value={body}
              onChange={(v) => setBody(v)}
            />

            <div className="space-y-1">
              <label className="text-xs text-gray-500 dark:text-neutral-400">
                Engine
              </label>
              <input
                placeholder="e.g. 2.0L Turbo, V8 4.0L, Dual Motor EV"
                value={engine}
                onChange={(e) => setEngine(e.target.value)}
                className="w-full px-4 py-2.5 rounded-md border border-gray-300 dark:border-[#333333] bg-white dark:bg-[#121212] text-black dark:text-white outline-none focus:border-black dark:focus:border-white"
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your vehicle condition, ownership, service history…"
            className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-[#333333] bg-white dark:bg-[#121212] text-black dark:text-white outline-none"
          />

          {/* IMAGE UPLOAD */}
          <div>
            <p className="text-sm font-medium text-black dark:text-white mb-2">
              Upload Photos
            </p>

            <label className="flex items-center justify-center gap-2 w-full h-[120px] border border-dashed border-gray-300 dark:border-[#333333] rounded-lg cursor-pointer text-gray-600 dark:text-neutral-400 bg-white dark:bg-[#121212] hover:border-black dark:hover:border-white transition">
              <FiUpload />
              Upload car images
              <input
                type="file"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                accept="image/*"
              />
            </label>

            {images.length > 0 && (
              <>
                <p className="mt-2 text-xs text-gray-500 dark:text-neutral-400">
                  {images.length} image(s) selected
                </p>

                {/* IMAGE PREVIEW */}
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className="relative group rounded-md overflow-hidden border border-gray-200 dark:border-[#333333]"
                    >
                      <img
                        src={img instanceof File ? URL.createObjectURL(img) : `${import.meta.env.VITE_API_URL}${img}`}
                        alt="preview"
                        className="h-[100px] w-full object-cover"
                      />

                      {/* DELETE BUTTON */}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-black/70 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                        title="Remove image"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* CTA */}
          <button
            onClick={handlePostListing}
            className="w-full sm:w-auto mt-4 px-8 py-3 rounded-lg bg-black text-white dark:bg-white dark:text-black text-sm font-medium flex items-center gap-2 hover:opacity-90 transition"
          >
            <FiCheckCircle />
            Post Listing
          </button>

          <p className="text-xs text-gray-500 dark:text-neutral-400">
            *Fully engineered with backend integration and verification.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function SellerCard({ icon, title, desc, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-start gap-4 p-5 rounded-lg border text-left ${active
          ? "border-black dark:border-white"
          : "border-gray-300 dark:border-[#333333]"
        } bg-white dark:bg-[#0F0F0F]`}
    >
      <div className="text-black dark:text-white">{icon}</div>
      <div>
        <p className="font-medium text-black dark:text-white">{title}</p>
        <p className="text-sm text-gray-600 dark:text-neutral-400 mt-1">
          {desc}
        </p>
      </div>
    </button>
  );
}

function Input({ placeholder, value, onChange }) {
  return (
    <input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-[#333333] bg-white dark:bg-[#121212] text-black dark:text-white outline-none focus:border-black dark:focus:border-white"
    />
  );
}

function Select({ label, options, value, onChange }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-gray-500 dark:text-neutral-400">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-[44px] px-3 pr-10 text-sm rounded-md border border-gray-300 dark:border-[#333333] bg-white dark:bg-[#121212] text-black dark:text-white outline-none appearance-none"
        >
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        <FiChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500"
        />
      </div>
    </div>
  );
}