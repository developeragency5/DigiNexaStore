import { Link } from "wouter";
import { ArrowRight, Clock, Tag } from "lucide-react";

const posts = [
  {
    slug: "best-productivity-apps-2025",
    tag: "Productivity",
    tagColor: "bg-blue-50 text-blue-600",
    title: "The 10 Best Productivity Apps of 2025",
    excerpt:
      "From deep-work timers to AI-powered note-takers, these apps will help you get more done in less time — without the burnout.",
    date: "March 28, 2025",
    readTime: "6 min read",
    cover: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80",
  },
  {
    slug: "hidden-gem-games-mobile",
    tag: "Games",
    tagColor: "bg-purple-50 text-purple-600",
    title: "10 Hidden Gem Mobile Games You've Never Heard Of",
    excerpt:
      "Forget the top-grossing charts — these under-the-radar titles offer some of the most creative gameplay on iOS and Android right now.",
    date: "March 14, 2025",
    readTime: "5 min read",
    cover: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80",
  },
  {
    slug: "budget-finance-apps",
    tag: "Finance",
    tagColor: "bg-green-50 text-green-600",
    title: "Stop Guessing Where Your Money Goes: 5 Finance Apps That Actually Help",
    excerpt:
      "Budgeting apps can feel like homework — unless you pick the right one. We tested dozens so you don't have to.",
    date: "February 27, 2025",
    readTime: "7 min read",
    cover: "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?w=800&q=80",
  },
  {
    slug: "health-fitness-apps-beginners",
    tag: "Health & Fitness",
    tagColor: "bg-red-50 text-red-600",
    title: "Best Health & Fitness Apps for Complete Beginners",
    excerpt:
      "You don't need to be an athlete to benefit from a fitness app. These picks are beginner-friendly, motivating, and completely free to start.",
    date: "February 10, 2025",
    readTime: "5 min read",
    cover: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80",
  },
  {
    slug: "privacy-first-apps",
    tag: "Security",
    tagColor: "bg-gray-100 text-gray-600",
    title: "Your Phone Knows Too Much: Switch to These Privacy-First Apps",
    excerpt:
      "Big tech apps quietly collect your data. These alternatives give you the same functionality without selling your life to advertisers.",
    date: "January 22, 2025",
    readTime: "8 min read",
    cover: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
  },
  {
    slug: "best-music-apps",
    tag: "Music",
    tagColor: "bg-pink-50 text-pink-600",
    title: "Beyond Spotify: The Best Music Apps for Every Kind of Listener",
    excerpt:
      "Streaming giants aren't the only option. From lossless audio to DJ tools to music learning — there's a perfect app for your ears.",
    date: "January 8, 2025",
    readTime: "6 min read",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80",
  },
];

export function Blog() {
  const [featured, ...rest] = posts;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
            AppVault Blog
          </span>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">App Picks, Tips & Trends</h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            In-depth guides, curated lists, and honest takes on the apps shaping how we live, work, and play.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Featured post */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8 group cursor-pointer">
          <div className="md:flex">
            <div className="md:w-1/2 h-56 md:h-auto overflow-hidden">
              <img
                src={featured.cover}
                alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="md:w-1/2 p-8 flex flex-col justify-center">
              <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-4 w-fit ${featured.tagColor}`}>
                {featured.tag}
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-3 leading-snug group-hover:text-primary transition-colors">
                {featured.title}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">{featured.excerpt}</p>
              <div className="flex items-center gap-4 text-xs text-gray-400 mb-5">
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{featured.readTime}</span>
                <span>{featured.date}</span>
              </div>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                Read article <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </div>

        {/* Post grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map(post => (
            <div key={post.slug} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group cursor-pointer hover:shadow-md transition-shadow">
              <div className="h-44 overflow-hidden">
                <img
                  src={post.cover}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-3 ${post.tagColor}`}>
                  {post.tag}
                </span>
                <h3 className="font-bold text-gray-900 leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.readTime}</span>
                  <span>{post.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center bg-white rounded-3xl border border-gray-100 p-10">
          <Tag className="h-8 w-8 text-primary mx-auto mb-3" />
          <h3 className="text-xl font-extrabold text-gray-900 mb-2">Discover the apps we write about</h3>
          <p className="text-gray-500 text-sm mb-5">Browse our full curated directory — 487 apps and games across 18 categories.</p>
          <Link href="/apps" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-2xl hover:bg-primary/90 transition-colors">
            Browse Apps <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
