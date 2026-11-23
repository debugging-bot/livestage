import SearchBar from "../components/SearchBar";
import VenueCard from "../components/VenueCard";
import { VENUES } from "../data/venues";

const FEATURES = [
  ["🎸", "다양한 공연장"],
  ["💰", "가격 비교"],
  ["🎛️", "장비 정보"],
  ["📅", "실시간 예약 현황"],
  ["⭐", "후기 확인"],
];

export default function Home() {
  const popular = [...VENUES]
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 4);

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">
            당신의 음악이 <br />
            무대에 오르는 순간,
            <br />
            <em>LiveStage</em>
          </h1>
          <p className="hero-sub">
            밴드를 위한 공연장 예약 플랫폼
            <br />
            다양한 공연장을 비교하고, 가장 좋은 무대를 찾아보세요.
          </p>
          <SearchBar variant="hero" />
          <ul className="features">
            {FEATURES.map(([icon, label]) => (
              <li key={label}>
                <span className="feat-icon">{icon}</span>
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container section">
        <h2 className="section-title">지금 인기 있는 공연장</h2>
        <div className="vgrid">
          {popular.map((v) => (
            <VenueCard key={v.id} venue={v} />
          ))}
        </div>
      </section>
    </>
  );
}