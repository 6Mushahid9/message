const Loader = () => {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="w-40 h-1 bg-gray-700 overflow-hidden rounded-full relative">
          <div className="absolute h-full w-1/3 bg-white animate-loader" />
        </div>
      </div>
    );
  };
  
  export default Loader;
  