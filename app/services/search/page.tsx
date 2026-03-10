import Link from "next/link";
import { getVisibleServices } from "@/lib/service-registry";
import { getCategorySummaries, getRecommendationBundles, getTagSummaries } from "@/lib/search-discovery";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const query = q.trim().toLowerCase();
  const services = getVisibleServices().filter((service) => service.slug !== "search");
  const categorySummaries = getCategorySummaries(services);
  const tagSummaries = getTagSummaries(services);
  const recommendationBundles = getRecommendationBundles(services, query);
  const results = query
    ? services.filter((service) => {
        const haystack = [
          service.title,
          service.shortDescription,
          service.category,
          service.tags.join(" "),
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(query);
      })
    : services;

  return (
    <main>
      <div className="page-header">
        <div>
          <div className="badge-row">
            <span className="badge active">active</span>
            <span className="badge">core</span>
          </div>
          <h1>허브 검색</h1>
          <p className="section-desc">
            허브에 등록된 서비스를 키워드로 찾고 바로 이동할 수 있습니다.
          </p>
        </div>
        <Link className="back-link" href="/">
          ← 허브로 돌아가기
        </Link>
      </div>

      <section className="panel">
        <h2 className="section-title">서비스 찾기</h2>
        <form className="search-form" action="/services/search" method="get">
          <input
            className="search-input"
            type="search"
            name="q"
            defaultValue={q}
            placeholder="서비스 이름, 설명, 태그로 검색"
          />
          <button className="back-link" type="submit">
            검색
          </button>
        </form>
        <p className="section-desc">
          {query ? `"${q}" 검색 결과 ${results.length}개` : `전체 서비스 ${results.length}개`}
        </p>

        <div className="hint-group">
          <p className="hint-label">추천 서비스 묶음</p>
          <div className="search-bundle-grid">
            {recommendationBundles.map((bundle) => (
              <section className="search-bundle-card" key={bundle.key}>
                <div className="badge-row">
                  <span className="badge active">추천</span>
                  {query ? <span className="badge">일치 {bundle.matchCount}개</span> : null}
                </div>
                <h3>{bundle.title}</h3>
                <p>{bundle.description}</p>
                <div className="search-bundle-links">
                  {bundle.services.map((service) => (
                    <Link className="hint-chip" key={service.key} href={service.route}>
                      {service.title}
                    </Link>
                  ))}
                </div>
                <Link className="back-link search-bundle-query" href={`/services/search?q=${encodeURIComponent(bundle.query)}`}>
                  이 묶음으로 다시 찾기
                </Link>
              </section>
            ))}
          </div>
        </div>

        <div className="hint-group">
          <p className="hint-label">카테고리별 둘러보기</p>
          <div className="search-category-grid">
            {categorySummaries.map((summary) => (
              <Link
                className="search-category-card"
                key={summary.category}
                href={`/services/search?q=${encodeURIComponent(summary.category)}`}
              >
                <strong>{summary.category}</strong>
                <span>{summary.count}개 서비스</span>
                <small>{summary.examples.join(" · ")}</small>
              </Link>
            ))}
          </div>
        </div>

        <div className="hint-group">
          <p className="hint-label">태그로 바로 찾기</p>
          <div className="hint-chip-row">
            {tagSummaries.map((tag) => (
              <Link className="hint-chip" key={tag.tag} href={`/services/search?q=${encodeURIComponent(tag.tag)}`}>
                #{tag.tag} <span className="hint-chip-count">{tag.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {results.length > 0 ? (
        <section className="panel">
          <h2 className="section-title">검색 결과</h2>
          <div className="grid">
            {results.map((service) => (
              <Link className="card" key={service.key} href={service.route}>
                <div className="badge-row">
                  <span className={`badge ${service.status}`}>{service.status}</span>
                  <span className="badge">{service.category}</span>
                </div>
                <h3>{service.title}</h3>
                <p>{service.shortDescription}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <section className="panel">
          <h2 className="section-title">검색 결과</h2>
          <p className="section-desc">
            일치하는 서비스가 없습니다. 다른 키워드로 다시 검색해 보세요.
          </p>
          <div className="hint-group">
            <p className="hint-label">다른 방식으로 둘러보기</p>
            <div className="hint-chip-row">
              {categorySummaries.slice(0, 3).map((summary) => (
                <Link
                  className="hint-chip"
                  key={summary.category}
                  href={`/services/search?q=${encodeURIComponent(summary.category)}`}
                >
                  {summary.category}
                </Link>
              ))}
            </div>
          </div>
          <div className="hint-group">
            <p className="hint-label">추천 서비스 묶음</p>
            <div className="search-bundle-grid">
              {recommendationBundles.map((bundle) => (
                <section className="search-bundle-card" key={bundle.key}>
                  <div className="badge-row">
                    <span className="badge active">추천</span>
                  </div>
                  <h3>{bundle.title}</h3>
                  <p>{bundle.description}</p>
                  <div className="search-bundle-links">
                    {bundle.services.map((service) => (
                      <Link className="hint-chip" key={service.key} href={service.route}>
                        {service.title}
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
