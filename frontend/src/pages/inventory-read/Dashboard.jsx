import { Link } from "react-router-dom";

export default function NotFound() {
  
  return (
    <div className="flex flex-col h-screen justify-center items-center text-center px-8 gap-6">
      <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
        Dashboard
      </h1>
      <p className="text-lg text-gray-600 max-w-xl">
        In progress
      </p>
      <Link
        to="/"
        className="px-6 py-3 text-white bg-blue-600 rounded-md text-sm font-medium transition-all duration-200 ease-in-out 
        hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 
        active:bg-blue-700"
      >
        Go Home
      </Link>
    </div>
  );
}