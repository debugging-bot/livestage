import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import VenueCard from "../components/VenueCard";
import { CATEGORIES, VENUES } from "../data/venues";
import { dayPrice } from "../utils";
const SORTS = [
  "추천순",
  "가격 낮은순",
  "가격 높은순",
  "수용 인원순",
  "후기 많은순",
];
export default function SearchResults() {
  const [sp] = useSearchParams();
  const region = sp.get("region") || "서울 전체";
  const date = sp.get("date") || "";
  const people = Number(sp.get("people") || 0);
  const budget = Number(sp.get("budget") || 0);
  const [cat, setCat] = useState("전체");
  const [sort, setSort] = useState("추천순");
  const results = useMemo(() => {
    const list = VENUES.filter(
      (v) =>
        (region === "서울 전체" || v.region === region) &&
        v.capacity >= people &&
        (budget === 0 || dayPrice(v, date) <= budget) &&
        (cat === "전체" || v.category === cat),
    );
    const sorters = {
      추천순: (a, b) => b.rating - a.rating,
      "가격 낮은순": (a, b) => dayPrice(a, date) - dayPrice(b, date),
      "가격 높은순": (a, b) => dayPrice(b, date) - dayPrice(a, date),
      "수용 인원순": (a, b) => b.capacity - a.capacity,
      "후기 많은순": (a, b) => b.reviewCount - a.reviewCount,
    };
    return [...list].sort(sorters[sort]);
  }, [region, date, people, budget, cat, sort]);
  return (
    <div className="container page">
      <SearchBar
        key={sp.toString()}
        variant="bar"
        initial={{
          region,
          date,
          people: String(people || 150),
          budget: String(budget),
        }}
      />
      <div className="filter-row">
        <strong>필터</strong>
        <div className="chips">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`chip ${cat === c ? "active" : ""}`}
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div className="results-head">
        <h2>
          검색 결과 <span className="accent">{results.length}개</span>
        </h2>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="sort-select"
        >
          {SORTS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      {results.length === 0 ? (
        <div className="empty">
          조건에 맞는 공연장이 없어요. 수용 인원이나 예산을 조정해 보세요.
        </div>
      ) : (
        <div className="vgrid">
          {results.map((v) => (
            <VenueCard key={v.id} venue={v} date={date} />
          ))}
        </div>
      )}
    </div>
  );
}
