import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

/**
 * Component to display a 404 Not Found page.
 * Logs the attempted route path on render.
 * @returns {JSX.Element} The 404 page component.
 */
const NotFound = (): JSX.Element => {
  const location = useLocation();

  useEffect(() => {
    // Log the 404 error with the path the user tried to access
    console.error(
      `404 Error: User attempted to access non-existent route: "${location.pathname}"`,
    );
  }, [location.pathname]); // Dependency array ensures this runs when path changes

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found.</p>
        {/* Use Link component for client-side navigation */}
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-800 underline transition duration-150 ease-in-out"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
