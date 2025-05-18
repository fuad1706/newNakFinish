const Spinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="w-6 h-6 bg-black animate-ping rounded-sm" />
    </div>
  );
};

export default Spinner;
