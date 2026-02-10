import {
  FiShield,
  FiMapPin,
  FiTrendingUp,
  FiUsers,
  FiTruck,
} from "react-icons/fi";

export default function About() {
  return (
    <div className="bg-white dark:bg-[#0A0A0A] transition-colors pt-19">
      <div className="max-w-[1100px] mx-auto px-6 py-20">

        {/* ===== PAGE TITLE ===== */}
        <div>
          <h1 className="text-[32px] font-semibold text-black dark:text-white">
            About Drive Verse India
          </h1>

          <p className="mt-4 text-[15px] leading-[30px] text-gray-600 dark:text-gray-400 max-w-[720px]">
            A modern automotive platform built for Indian buyers, sellers,
            collectors, and enthusiasts — focused on clarity, trust,
            and thoughtful design.
          </p>
        </div>

        {/* ===== IMAGE STRIP ===== */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            "https://hips.hearstapps.com/hmg-prod/images/13-w24-7017-669829b067176.jpg?crop=0.669xw:1.00xh;0.166xw,0&resize=1200:*",
            "https://gaadiwaadi.com/wp-content/uploads/2025/06/VW-Golf-GTI-Edition-50.jpg",
            "https://images.cdn.autocar.co.uk/sites/autocar.co.uk/files/styles/gallery_slide/public/honda-civic-type-r-front-tracking_0.jpg?itok=mGtercfe",
          ].map((img, i) => (
            <div key={i} className="overflow-hidden rounded-2xl">
              <img
                src={img}
                alt="Automotive"
                className="w-full h-[240px] object-cover"
              />
            </div>
          ))}
        </div>

        {/* ===== STORY ===== */}
        <article className="mt-20 space-y-12">
          <Section icon={<FiMapPin />} title="Built for the Indian Automotive Market">
            India’s car market is unlike any other. It spans everyday commuters,
            passionate enthusiasts, luxury collectors, and first-time buyers
            navigating complex ownership decisions. Drive Verse India exists
            to serve this entire spectrum — not by volume, but by quality.
          </Section>

          <Section icon={<FiShield />} title="Trust Over Noise">
            We believe buying or selling a car should feel calm, informed,
            and respectful. That’s why our platform emphasizes transparent
            listings, honest pricing, and clear presentation. No clutter,
            no pressure — just information that helps people decide confidently.
          </Section>

          <Section icon={<FiTruck />} title="From Daily Drives to Dream Machines">
            Whether it’s a city hatchback, a performance sedan, a classic,
            or a collector-grade supercar, every vehicle deserves clarity.
            We design listings to tell the full story — not just the highlights.
          </Section>

          <Section icon={<FiUsers />} title="Designed for Buyers and Sellers">
            Buyers get the confidence to compare, evaluate, and connect.
            Sellers get a platform that values presentation and authenticity
            over aggressive promotion. When both sides feel respected,
            better decisions happen.
          </Section>

          <Section icon={<FiTrendingUp />} title="Looking Ahead">
            As India’s automotive landscape evolves — with electric vehicles,
            new ownership models, and changing buyer expectations —
            Drive Verse India evolves with it. Our focus remains simple:
            thoughtful design, reliable information, and a premium experience
            that grows with the market.
          </Section>
        </article>

        {/* ===== CONTEXT ROW ===== */}
        <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-12">
          <Info
            icon={<FiMapPin />}
            title="India-Focused"
            text="Built around Indian cities, roads, ownership patterns, and buyers."
          />
          <Info
            icon={<FiShield />}
            title="Trust First"
            text="Transparency and clarity over hype and noise."
          />
          <Info
            icon={<FiTrendingUp />}
            title="Market Aware"
            text="Informed by real pricing trends and buyer behavior."
          />
        </div>

      </div>
    </div>
  );
}

/* ===== COMPONENTS ===== */

function Section({ icon, title, children }) {
  return (
    <div className="flex gap-6">
      <div className="text-gray-400 mt-1">{icon}</div>
      <div>
        <h3 className="text-[18px] font-medium text-black dark:text-white mb-4">
          {title}
        </h3>
        <p className="text-[15px] leading-[32px] text-gray-700 dark:text-gray-300">
          {children}
        </p>
      </div>
    </div>
  );
}

function Info({ icon, title, text }) {
  return (
    <div>
      <div className="mb-3 text-gray-400">{icon}</div>
      <h4 className="text-[16px] font-medium text-black dark:text-white mb-2">
        {title}
      </h4>
      <p className="text-[14px] leading-[24px] text-gray-600 dark:text-gray-400">
        {text}
      </p>
    </div>
  );
}
