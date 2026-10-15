import { site } from "@/data/site";
import { hasPublicAsset } from "@/lib/assets";
import { FallbackImage } from "@/components/fallback-image";
import { ViewCounter } from "@/components/view-counter";

export async function Profile() {
  const [avatar, banner] = await Promise.all([hasPublicAsset(site.avatar.src), hasPublicAsset(site.banner.src)]);
  return <>
    <div className="border-b border-dashed border-border"><div className="page-column p-2.5 pt-1">
      {banner ? <FallbackImage {...site.banner} sizes="(max-width: 1024px) 100vw, 980px" priority className="portfolio-banner"><div className="banner-art" /></FallbackImage> : <div className="portfolio-banner" aria-hidden="true"><div className="banner-art" /></div>}
    </div></div>
    <section aria-label={site.name} className="border-b border-dashed border-border"><div className="page-column relative flex items-center gap-5 px-5 py-6 sm:gap-8 sm:px-7 sm:py-7">
      {avatar ? <FallbackImage {...site.avatar} sizes="(max-width: 640px) 88px, 148px" priority className="profile-avatar"><span>{site.initials}</span></FallbackImage> : <div className="profile-avatar" aria-label={site.avatar.alt}><span>{site.initials}</span></div>}
      <div className="min-w-0 flex-1"><h1 className="font-display text-[38px] leading-none tracking-tight sm:text-[48px]">{site.name}</h1><p className="mt-2.5 text-sm font-semibold tracking-[0.045em] text-muted-foreground sm:text-[22px]">{site.role}</p><p className="mt-1.5 text-xs leading-5 text-muted-foreground sm:text-sm">{site.education} · {site.location}</p></div>
      <ViewCounter enabled={process.env.ENABLE_VIEW_COUNTER === "true"} />
    </div></section>
  </>;
}
