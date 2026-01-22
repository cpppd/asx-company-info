export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-10 h-10 border-4 border-[#e9ecef] border-t-[#20705c] rounded-full animate-spin mb-4"></div>
      <p className="text-[#6c757d] text-sm">Loading company information...</p>
    </div>
  );
}
