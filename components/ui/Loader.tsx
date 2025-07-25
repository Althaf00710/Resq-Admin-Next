export default function GooLoader() {
  return (
    <>
      <div className="container">
        <div className="dot dot-1" />
        <div className="dot dot-2" />
        <div className="dot dot-3" />
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" className="svg-filter">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7" />
          </filter>
        </defs>
      </svg>
      <style jsx>{`
        .container {
          width: 200px;
          height: 200px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          filter: url('#goo');
          animation: rotateMove 2s ease-in-out infinite;
        }
        .dot {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          margin: auto;
        }
        .dot-1 {
          background-color: #3014e8;
          animation: dot1Move 2s ease infinite, index 6s -2s ease infinite;
        }
        .dot-2 {
          background-color: #6071ff;
          animation: dot2Move 2s ease infinite, index 6s -4s ease infinite;
        }
        .dot-3 {
          background-color: #2447f7;
          animation: dot3Move 2s ease infinite, index 6s ease infinite;
        }
        @keyframes dot1Move {
          20% { transform: scale(1); }
          45% { transform: translate(16px, 12px) scale(0.45); }
          60% { transform: translate(80px, 60px) scale(0.45); }
          80% { transform: translate(80px, 60px) scale(0.45); }
          100% { transform: translateY(0) scale(1); }
        }
        @keyframes dot2Move {
          20% { transform: scale(1); }
          45% { transform: translate(-16px, 12px) scale(0.45); }
          60% { transform: translate(-80px, 60px) scale(0.45); }
          80% { transform: translate(-80px, 60px) scale(0.45); }
          100% { transform: translateY(0) scale(1); }
        }
        @keyframes dot3Move {
          20% { transform: scale(1); }
          45% { transform: translateY(-18px) scale(0.45); }
          60% { transform: translateY(-90px) scale(0.45); }
          80% { transform: translateY(-90px) scale(0.45); }
          100% { transform: translateY(0) scale(1); }
        }
        @keyframes rotateMove {
          55% { transform: translate(-50%, -50%) rotate(0deg); }
          80% { transform: translate(-50%, -50%) rotate(360deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes index {
          0%, 100% { z-index: 3; }
          33.3% { z-index: 2; }
          66.6% { z-index: 1; }
        }
      `}</style>
    </>
  );
}
