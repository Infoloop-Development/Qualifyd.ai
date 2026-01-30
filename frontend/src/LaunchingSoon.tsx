import { useState, useEffect } from "react";
import qualifydLogo from "./assets/qualifyd-logo.png";

function LaunchingSoon() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const launchDate = new Date("2026-02-02T18:00:00").getTime();

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = launchDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, []);

  const TimeBox = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center justify-center bg-white rounded-xl border border-gray-200 shadow-lg p-3 sm:p-4 lg:p-6 min-w-[60px] sm:min-w-[80px] lg:min-w-[90px]">
      <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-primary-500">
        {String(value).padStart(2, "0")}
      </div>
      <div className="text-[10px] sm:text-xs lg:text-sm text-gray-600 mt-1 sm:mt-2 uppercase tracking-wide">
        {label}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-emerald-50 flex items-center justify-center p-3 sm:p-4 lg:p-6">
      <div className="max-w-4xl w-full text-center space-y-6 sm:space-y-8 lg:space-y-12">
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src={qualifydLogo}
            alt="Qualifyd.ai Logo"
            className="h-12 w-auto sm:h-16 lg:h-20 xl:h-24 object-contain"
          />
        </div>

        {/* Main Heading */}
        <div className="space-y-3 sm:space-y-4 px-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
            Launching Soon
          </h1>
          <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-2">
            We're putting the finishing touches on something amazing. Get ready to optimize your resume like never before!
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 lg:gap-6 px-2">
          <TimeBox value={timeLeft.days} label="Days" />
          <TimeBox value={timeLeft.hours} label="Hours" />
          <TimeBox value={timeLeft.minutes} label="Minutes" />
          <TimeBox value={timeLeft.seconds} label="Seconds" />
        </div>

        {/* Launch Date */}
        <div className="text-xs sm:text-sm lg:text-base text-gray-500 px-2">
          Launch Date: <span className="font-semibold text-gray-700">February 2, 2026 at 6:00 PM</span>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mt-6 sm:mt-8 lg:mt-12 px-2">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5 lg:p-6">
            <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">🎯</div>
            <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Resume Analysis</h3>
            <p className="text-xs sm:text-sm text-gray-600">Get instant Fit, ATS, and Writing scores</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5 lg:p-6">
            <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">📊</div>
            <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Actionable Insights</h3>
            <p className="text-xs sm:text-sm text-gray-600">Receive detailed recommendations to improve your resume</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5 lg:p-6">
            <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">🔒</div>
            <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Privacy First</h3>
            <p className="text-xs sm:text-sm text-gray-600">Your data stays secure and private</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LaunchingSoon;
