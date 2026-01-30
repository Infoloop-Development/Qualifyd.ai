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
    <div className="flex flex-col items-center justify-center bg-white rounded-xl border border-gray-200 shadow-lg p-4 sm:p-6 min-w-[70px] sm:min-w-[90px]">
      <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-500">
        {String(value).padStart(2, "0")}
      </div>
      <div className="text-xs sm:text-sm text-gray-600 mt-2 uppercase tracking-wide">
        {label}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center space-y-8 sm:space-y-12">
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src={qualifydLogo}
            alt="Qualifyd.ai Logo"
            className="h-16 w-auto sm:h-20 lg:h-24 object-contain"
          />
        </div>

        {/* Main Heading */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900">
            Launching Soon
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-2xl mx-auto">
            We're putting the finishing touches on something amazing. Get ready to optimize your resume like never before!
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          <TimeBox value={timeLeft.days} label="Days" />
          <TimeBox value={timeLeft.hours} label="Hours" />
          <TimeBox value={timeLeft.minutes} label="Minutes" />
          <TimeBox value={timeLeft.seconds} label="Seconds" />
        </div>

        {/* Launch Date */}
        <div className="text-sm sm:text-base text-gray-500">
          Launch Date: <span className="font-semibold text-gray-700">February 2, 2026 at 6:00 PM</span>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-semibold text-gray-900 mb-2">Resume Analysis</h3>
            <p className="text-sm text-gray-600">Get instant Fit, ATS, and Writing scores</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-semibold text-gray-900 mb-2">Actionable Insights</h3>
            <p className="text-sm text-gray-600">Receive detailed recommendations to improve your resume</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="font-semibold text-gray-900 mb-2">Privacy First</h3>
            <p className="text-sm text-gray-600">Your data stays secure and private</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LaunchingSoon;
