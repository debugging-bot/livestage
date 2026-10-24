export default function VenueCard() {
  return (
    <article className="vcard">
      <div className="vcard-body">
        <h3>홍대 클럽 FF</h3>
        <div className="rating">
          ★ 4.8 <span>(124)</span>
        </div>
        <dl className="vinfo">
          <div>
            <dt>수용 인원</dt>
            <dd>200명</dd>
          </div>
          <div>
            <dt>대관료</dt>
            <dd>평일 700,000원</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}