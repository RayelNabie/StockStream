import { Link } from "react-router-dom";
// import { FaExchangeAlt, FaClock, FaShieldAlt } from "react-icons/fa";
// import Feature from "../components/Feature.jsx";

export default function Home() {
  return (
    <div className="flex flex-col h-full md:py-36 md:px-32 pt-11 pb-24 px-8 w-full items-center text-center gap-12">
      <div className="flex flex-col gap-6 items-center">
        <h1 className="max-w-2xl text-3xl md:text-5xl font-extrabold tracking-tight scroll-m-20">
          Information you need during on-call emergencies
        </h1>
        <h5 className="max-w-2xl text-lg md:text-xl font-medium leading-7 text-gray-600">
          Quickly link new on-call tickets to similar past incidents and their
          solutions. All directly in Slack the moment an incident happens.
        </h5>
        <Link to="https://github.com/Rayel2002" target="_blank">
          <button
            className="px-6 py-3 text-white bg-blue-600 rounded-md text-sm font-medium transition-all duration-200 ease-in-out 
hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 
active:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
}
