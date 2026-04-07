import { useState } from "react";
import { useParams, Link } from "wouter";
import { useGetApp, useListApps, getGetAppQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AppCard } from "@/components/app-card";
import {
  Star, Download, Share2, Globe, Shield,
  Smartphone, ChevronRight, Zap, Award, Link2
} from "lucide-react";

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`h-4 w-4 ${
          i <= full ? "fill-amber-400 text-amber-400" :
          i === full + 1 && half ? "fill-amber-200 text-amber-400" :
          "fill-gray-200 text-gray-200"
        }`} />
      ))}
    </div>
  );
}

function StoreBadge({ href, store }: { href: string | null | undefined; store: "play" | "apple" }) {
  if (!href) return null;
  const isPlay = store === "play";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-900 active:scale-[0.98] transition-all duration-150 shadow-md hover:shadow-lg min-w-[160px]"
    >
      {isPlay ? (
        <svg className="h-7 w-7 shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3.18 23.76a1.48 1.48 0 001.08.14l.06-.03L16.6 16.7l-2.77-2.77zM20.06 10.37a2 2 0 000-2.74l-2.3-1.33L14.9 9.17l2.85 2.85zM3.07.36a1.5 1.5 0 00-.07.46v22.36c0 .16.03.32.07.46l.12.11 12.5-12.5v-.29L3.18.25z"/>
          <path d="M16.6 13.83l-2.77-2.77-9.75 9.75a1.5 1.5 0 001.97.14l.06-.04 10.5-7.08z"/>
        </svg>
      ) : (
        <svg className="h-7 w-7 shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
      )}
      <div className="text-left leading-tight">
        <div className="text-[10px] font-normal opacity-80 tracking-wide">{isPlay ? "GET IT ON" : "Download on the"}</div>
        <div className="text-[17px] font-bold tracking-tight leading-none mt-0.5">{isPlay ? "Google Play" : "App Store"}</div>
      </div>
    </a>
  );
}

export function AppDetail() {
  const { id } = useParams();
  const appId = id ? parseInt(id, 10) : 0;
  const [screenshotModal, setScreenshotModal] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { data: app, isLoading } = useGetApp(appId, {
    query: { enabled: !!appId, queryKey: getGetAppQueryKey(appId) }
  });

  const { data: relatedApps } = useListApps(
    { category: app?.categorySlug, limit: 12 },
    { query: { enabled: !!app?.categorySlug } }
  );

  const similarApps = relatedApps?.filter(a => a.id !== app?.id).slice(0, 8) || [];

  async function handleShare() {
    const url = window.location.href;
    const title = app?.name ?? "Check out this app";
    const text = `${title} — discover it on appus`;
    if (navigator.share) {
      try { await navigator.share({ title, text, url }); return; } catch {}
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function resolvedPlayStoreUrl(storedUrl?: string | null): string | null {
    if (!storedUrl) return null;
    const url = storedUrl.trim();
    if (url.includes("play.google.com")) return url;
    return null;
  }

  function resolvedAppStoreUrl(storedUrl?: string | null): string | null {
    if (!storedUrl) return null;
    const url = storedUrl.trim();
    if (url.includes("apps.apple.com") && url.length > 30) return url;
    return null;
  }

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-5 w-24 mb-8" />
          <div className="bg-white rounded-3xl p-8 mb-6 flex gap-8">
            <Skeleton className="w-36 h-36 rounded-3xl shrink-0" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-9 w-2/3" />
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-5 w-40" />
              <div className="flex gap-3 pt-2">
                <Skeleton className="h-14 w-40 rounded-2xl" />
                <Skeleton className="h-14 w-40 rounded-2xl" />
              </div>
            </div>
          </div>
          <Skeleton className="h-64 w-full rounded-3xl mb-6" />
          <Skeleton className="h-48 w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📱</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">App not found</h2>
          <p className="text-gray-500 mb-6">This app doesn't exist or has been removed.</p>
          <Link href="/apps" className="px-6 py-3 bg-primary text-white rounded-2xl font-semibold hover:bg-primary/90 transition-colors">
            Browse Apps
          </Link>
        </div>
      </div>
    );
  }

  const screenshots = app.screenshotUrls || [];
  const hasScreenshots = screenshots.length > 0;

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Screenshot Modal */}
      {screenshotModal && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setScreenshotModal(null)}
        >
          <img src={screenshotModal} alt="Screenshot" className="max-h-full max-w-full rounded-2xl object-contain" />
          <button className="absolute top-4 right-4 text-white text-3xl font-light">&times;</button>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

        {/* ── Hero Card ── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-5">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Icon */}
              <img
                src={app.iconUrl}
                alt={`${app.name} icon`}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-[1.75rem] shadow-lg border border-gray-100 object-cover flex-shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).src = "https://img.icons8.com/color/96/smartphone.png"; }}
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-1">
                  <div>
                    <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full mb-2">
                      {app.categoryName}
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">{app.name}</h1>
                    <p className="text-base text-gray-500 mt-0.5 font-medium">{app.developer}</p>
                  </div>
                  <div className="relative">
                    <button
                      onClick={handleShare}
                      className="shrink-0 p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-500"
                      title="Share this app"
                    >
                      {copied ? <Link2 className="h-4 w-4 text-primary" /> : <Share2 className="h-4 w-4" />}
                    </button>
                    {copied && (
                      <span className="absolute -bottom-8 right-0 whitespace-nowrap text-xs font-semibold bg-gray-900 text-white px-2.5 py-1 rounded-full shadow-lg">
                        Link copied!
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats row */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 my-4">
                  <div className="flex items-center gap-1.5">
                    <StarRating rating={app.rating} />
                    <span className="text-sm font-bold text-gray-900">{app.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <Download className="h-4 w-4 text-gray-400" />
                    <span className="font-semibold text-gray-700">{app.downloadCount >= 1000000 ? `${(app.downloadCount/1000000).toFixed(0)}M+` : app.downloadCount.toLocaleString()}</span>
                    <span>downloads</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Smartphone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 capitalize">{app.platform === "both" ? "iOS & Android" : app.platform}</span>
                  </div>
                </div>

                {/* Download buttons — only shown when the app has that store's URL */}
                <div className="flex flex-wrap gap-3 mt-1">
                  <StoreBadge href={resolvedAppStoreUrl(app.appStoreUrl)} store="apple" />
                  <StoreBadge href={resolvedPlayStoreUrl(app.playStoreUrl)} store="play" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick stats strip */}
          <div className="border-t border-gray-100 grid grid-cols-3 divide-x divide-gray-100">
            {[
              { icon: Star, value: app.rating.toFixed(1), label: "Rating", color: "text-amber-500" },
              { icon: Award, value: app.categoryName, label: "Category", color: "text-primary" },
              { icon: Zap, value: app.isFree ? "Free" : `$${app.price}`, label: "Price", color: "text-green-600" },
            ].map(({ icon: Icon, value, label, color }) => (
              <div key={label} className="flex flex-col items-center py-4 gap-1">
                <Icon className={`h-4 w-4 ${color}`} />
                <span className="text-sm font-bold text-gray-900 truncate max-w-[90%]">{value}</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Screenshots ── */}
        {hasScreenshots && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-5">
            <div className="p-6 pb-0">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Screenshots</h2>
            </div>
            <div className="px-6 pb-6">
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
                {screenshots.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setScreenshotModal(url)}
                    className="shrink-0 snap-start relative group"
                  >
                    <img
                      src={url}
                      alt={`Screenshot ${i + 1}`}
                      className="h-72 sm:h-96 w-auto rounded-2xl border border-gray-100 shadow-sm object-cover group-hover:scale-[1.02] group-hover:shadow-md transition-all duration-200"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-xs font-semibold px-2.5 py-1 rounded-full transition-opacity">View</span>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">Tap any screenshot to enlarge</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-5 mb-5">
          {/* ── Description ── */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">About this {app.appType === "game" ? "game" : "app"}</h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3 whitespace-pre-line">
              {app.fullDescription || app.description}
            </div>
            {app.tags && app.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-gray-100">
                {app.tags.filter(t => t && t !== 'mobile').map(tag => (
                  <span key={tag} className="text-xs font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded-full capitalize">{tag}</span>
                ))}
              </div>
            )}
          </div>

          {/* ── Info Sidebar ── */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 h-fit">
            <h3 className="text-base font-bold text-gray-900 mb-4">App Info</h3>
            <dl className="space-y-3 text-sm">
              {[
                { label: "Developer", value: app.developer },
                { label: "Version", value: app.version || "Latest" },
                { label: "Size", value: app.size || "Varies" },
                { label: "Platform", value: app.platform === "both" ? "iOS & Android" : app.platform },
                { label: "Requirements", value: app.requirements || "Android 5.0+" },
                { label: "Price", value: app.isFree ? "Free" : `$${app.price}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                  <dt className="text-gray-400 shrink-0">{label}</dt>
                  <dd className="font-medium text-gray-800 text-right line-clamp-2">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 space-y-2">
              {app.website && (
                <a href={app.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-medium text-primary hover:underline">
                  <Globe className="h-3.5 w-3.5" /> Developer Website
                </a>
              )}
              {app.privacyPolicyUrl && (
                <a href={app.privacyPolicyUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-medium text-primary hover:underline">
                  <Shield className="h-3.5 w-3.5" /> Privacy Policy
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ── Similar Apps ── */}
        {similarApps.length > 0 && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Similar {app.appType === "game" ? "Games" : "Apps"}</h2>
                <p className="text-xs text-gray-400 mt-0.5">More from {app.categoryName}</p>
              </div>
              <Link
                href={app.appType === "game" ? `/games` : `/apps?category=${app.categorySlug}`}
                className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                See all <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {similarApps.map(relatedApp => (
                <AppCard key={relatedApp.id} app={relatedApp} variant="default" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
