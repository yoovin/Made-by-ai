"use client";

import { useEffect, useMemo, useState } from "react";

type BookmarkItem = {
  id: string;
  title: string;
  url: string;
  createdAt: string;
};

const STORAGE_KEY = "made-by-ai.bookmarks";

function parseBookmarks(raw: string | null): BookmarkItem[] {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as BookmarkItem[];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(
      (item) =>
        typeof item?.id === "string" &&
        typeof item?.title === "string" &&
        typeof item?.url === "string" &&
        typeof item?.createdAt === "string",
    );
  } catch {
    return [];
  }
}

function normalizeTitle(value: string) {
  return value.trim();
}

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return trimmed;
  }
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function validateUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function BookmarkManager() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() =>
    parseBookmarks(typeof window === "undefined" ? null : window.localStorage.getItem(STORAGE_KEY)),
  );
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const sortedBookmarks = useMemo(
    () => [...bookmarks].sort((left, right) => right.createdAt.localeCompare(left.createdAt)),
    [bookmarks],
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedTitle = normalizeTitle(title);
    const normalizedUrl = normalizeUrl(url);

    if (!normalizedTitle || !normalizedUrl) {
      setError("제목과 URL을 모두 입력해 주세요.");
      return;
    }

    if (!validateUrl(normalizedUrl)) {
      setError("URL 형식이 올바르지 않습니다. 예: https://example.com");
      return;
    }

    setBookmarks((current) => [
      {
        id: `${Date.now()}`,
        title: normalizedTitle,
        url: normalizedUrl,
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);
    setTitle("");
    setUrl("");
    setError("");
  }

  function handleRemove(id: string) {
    setBookmarks((current) => current.filter((item) => item.id !== id));
  }

  return (
    <section className="panel">
      <h2 className="section-title">북마크 저장</h2>
      <form className="bookmark-form" onSubmit={handleSubmit}>
        <input
          className="search-input"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="북마크 제목"
        />
        <input
          className="search-input"
          type="text"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://example.com"
        />
        <button className="bookmark-submit" type="submit">
          북마크 추가
        </button>
      </form>
      {error ? <p className="bookmark-error">{error}</p> : null}
      <p className="section-desc">저장한 북마크는 현재 브라우저의 로컬 저장소에만 남습니다.</p>

      <div className="bookmark-list">
        {sortedBookmarks.length > 0 ? (
          sortedBookmarks.map((bookmark) => (
            <article className="bookmark-item" key={bookmark.id}>
              <div>
                <h3>{bookmark.title}</h3>
                <a href={bookmark.url} rel="noreferrer" target="_blank">
                  {bookmark.url}
                </a>
              </div>
              <button className="bookmark-remove" type="button" onClick={() => handleRemove(bookmark.id)}>
                제거
              </button>
            </article>
          ))
        ) : (
          <div className="bookmark-empty">
            <h3>저장된 북마크가 없습니다</h3>
            <p className="section-desc">자주 여는 링크를 저장해 두고 허브 안에서 다시 찾아오세요.</p>
          </div>
        )}
      </div>
    </section>
  );
}
