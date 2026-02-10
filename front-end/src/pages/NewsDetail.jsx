import { useParams, Link } from "react-router-dom";
import { news } from "../data/news";

export default function NewsDetail() {
  const { id } = useParams();
  const article = news.find(n => n.id === id);

  if (!article) {
    return (
      <div className="p-10 text-black dark:text-white">
        Article not found
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0A0A0A] transition-colors">
      <div className="max-w-[880px] mx-auto px-6 py-20">

        {/* Back */}
        <Link
          to="/news"
          className="text-[14px] text-gray-500 hover:text-black dark:hover:text-white"
        >
          ← Back to Insights
        </Link>

        {/* Title */}
        <h1 className="mt-8 text-[39px] font-semibold text-black dark:text-white leading-[52px]">
          {article.title}
        </h1>

        {/* Meta */}
        <p className="mt-4 text-[12px] tracking-widest uppercase text-gray-500">
          {article.date}
        </p>

        {/* Hero Image */}
        <div className="mt-14 rounded-3xl overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-[460px] object-cover"
          />
        </div>

        {/* CONTENT */}
        <article className="mt-16 space-y-10">

          {article.content.trim().split("\n\n").map((para, i) => (
            <p
              key={i}
              className={
                i === 0
                  ? `
                    text-[19px]
                    leading-[30px]
                    text-gray-800 dark:text-gray-200
                    font-medium
                  `
                  : `
                    text-[15px]
                    leading-[26px]
                    text-gray-700 dark:text-gray-300
                  `
              }
            >
              {para}
            </p>
          ))}

        </article>

      </div>
    </div>
  );
}
