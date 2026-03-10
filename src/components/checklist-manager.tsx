"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChecklistItem,
  createChecklistItem,
  normalizeChecklistText,
  parseChecklist,
  removeChecklistItem,
  sortChecklistItems,
  toggleChecklistItem,
} from "@/lib/checklist-storage";

const STORAGE_KEY = "made-by-ai.checklist";

export function ChecklistManager() {
  const [items, setItems] = useState<ChecklistItem[]>(() =>
    parseChecklist(typeof window === "undefined" ? null : window.localStorage.getItem(STORAGE_KEY)),
  );
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const sortedItems = useMemo(() => sortChecklistItems(items), [items]);
  const completedCount = sortedItems.filter((item) => item.completed).length;

  function handleAdd(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextText = normalizeChecklistText(input);
    if (!nextText) {
      setError("할 일 내용을 입력해 주세요.");
      return;
    }

    setItems((current) => [createChecklistItem(nextText), ...current]);
    setInput("");
    setError("");
  }

  return (
    <section className="panel">
      <h2 className="section-title">할 일 작성</h2>
      <form className="checklist-form" onSubmit={handleAdd}>
        <input
          className="search-input"
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="예: 릴리즈 로그 점검"
        />
        <button className="bookmark-submit" type="submit">
          할 일 추가
        </button>
      </form>
      {error ? <p className="bookmark-error">{error}</p> : null}

      <div className="checklist-summary">
        <div className="kpi">
          <strong>{sortedItems.length}</strong>
          <span>전체 할 일</span>
        </div>
        <div className="kpi">
          <strong>{completedCount}</strong>
          <span>완료</span>
        </div>
        <div className="kpi">
          <strong>{sortedItems.length - completedCount}</strong>
          <span>남은 할 일</span>
        </div>
      </div>

      <div className="checklist-list">
        {sortedItems.length > 0 ? (
          sortedItems.map((item) => (
            <article className={`checklist-item${item.completed ? " completed" : ""}`} key={item.id}>
              <label className="checklist-item-main">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => setItems((current) => toggleChecklistItem(current, item.id))}
                />
                <span>{item.text}</span>
              </label>
              <button
                className="bookmark-remove"
                type="button"
                onClick={() => setItems((current) => removeChecklistItem(current, item.id))}
              >
                삭제
              </button>
            </article>
          ))
        ) : (
          <div className="bookmark-empty">
            <h3>저장된 할 일이 없습니다</h3>
            <p className="section-desc">짧은 할 일을 추가해 허브 안에서 바로 체크해 보세요.</p>
          </div>
        )}
      </div>
    </section>
  );
}
