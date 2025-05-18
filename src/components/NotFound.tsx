const NotFound: React.FC = () => (
  <div className="container mx-auto py-20 text-center">
    <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
    <p className="mt-4">The page you're looking for doesn't exist.</p>
    <a
      href="/"
      className="mt-4 inline-block bg-yellow-600 cursor-pointer text-white px-4 py-2 rounded"
    >
      Go to Home
    </a>
  </div>
);
export default NotFound;
