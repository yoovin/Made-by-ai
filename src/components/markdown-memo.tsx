"use client";

import { useEffect, useState } from "react";

type SavedMemo = {
  title: string;
  body: string;
  savedAt: string;
};

const STORAGE_KEY = "made-by-ai.markdown-memo";

function parseSavedMemo(raw: string | null): SavedMemo | null {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as SavedMemo;
    if (
      typeof parsed?.title === "string" &&
      typeof parsed?.body === "string" &&
      typeof parsed?.savedAt === "string"
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function MarkdownMemo() {
  const initialSavedMemo = parseSavedMemo(
    typeof window === "undefined" ? null : window.localStorage.getItem(STORAGE_KEY),
  );
  const [title, setTitle] = useState(initialSavedMemo?.title ?? "");
  const [body, setBody] = useState(initialSavedMemo?.body ?? "");
  const [savedAt, setSavedAt] = useState<string | null>(initialSavedMemo?.savedAt ?? null);
  const [error, setError] = useState("");

  function handleSave() {
    const nextTitle = title.trim();
    const nextBody = body.trim();

    if (!nextTitle || !nextBody) {
      setError("제목과 메모 내용을 모두 입력해 주세요.");
      return;
    }

    const nextSavedAt = new Date().toISOString();
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ title: nextTitle, body: nextBody, savedAt: nextSavedAt }),
    );
    setTitle(nextTitle);
    setBody(nextBody);
    setSavedAt(nextSavedAt);
    setError("");
  }

  function handleClear() {
    const confirmed = window.confirm("저장된 메모를 비울까요?");
    if (!confirmed) {
      return;
    }

    window.localStorage.removeItem(STORAGE_KEY);
    setTitle("");
    setBody("");
    setSavedAt(null);
    setError("");
  }

  return (
    <section className="panel">
      <h2 className="section-title">메모 작성</h2>
      <div className="memo-form">
        <input
          className="search-input"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="메모 제목"
        />
        <textarea
          className="memo-textarea"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder={"# 오늘 메모\n- 해야 할 일\n- 다음 아이디어"}
        />
        <div className="memo-actions">
          <button className="bookmark-submit" type="button" onClick={handleSave}>
            메모 저장
          </button>
          <button className="bookmark-remove" type="button" onClick={handleClear}>
            메모 비우기
          </button>
        </div>
      </div>
      {error ? <p className="bookmark-error">{error}</p> : null}
      <p className="section-desc">
        작성한 메모는 현재 브라우저의 localStorage에만 저장되며, 마크다운 원문 그대로 보관됩니다.
      </p>

      <div className="memo-preview">
        <h3>저장된 메모</h3>
        {savedAt ? (
          <>
            <p className="memo-saved-at">마지막 저장: {savedAt}</p>
            <div className="memo-saved-card">
              <strong>{title}</strong>
              <pre>{body}</pre>
            </div>
          </>
        ) : (
          <div className="bookmark-empty">
            <h3>저장된 메모가 없습니다</h3>
            <p className="section-desc">간단한 마크다운 메모를 작성하고 저장해 다음 방문 때 다시 이어서 보세요.</p>
          </div>
        )}
      </div>
    </section>
  );
}
