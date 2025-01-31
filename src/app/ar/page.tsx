export default function ArabicHome() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold">البحث عن العقارات</h1>
        <input
          type="text"
          placeholder="ابحث عن العقارات..."
          className="w-full p-4 border border-gray-300 rounded-lg mt-4 rtl text-right"
        />
      </div>
    </div>
  );
} 