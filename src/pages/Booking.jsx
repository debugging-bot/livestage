import { useState } from "react";
import Stepper from "../components/Stepper";

export default function Booking() {
  const [step, setStep] = useState(1);

  return (
    <div className="container page">
      <h1>예약하기</h1>
      <Stepper
        steps={["날짜/시간 선택", "정보 입력", "예약 확인", "완료"]}
        current={step}
      />
      <p>현재 {step}단계</p>
      {step > 1 && <button onClick={() => setStep(step - 1)}>이전 단계</button>}
      {step < 4 && <button onClick={() => setStep(step + 1)}>다음 단계</button>}
    </div>
  );
}