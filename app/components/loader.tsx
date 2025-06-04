export default function Loader() {
  return (
    <>
      {/* Interaction Blocker */}
      <div className="fixed inset-0 z-40 cursor-wait bg-transparent" />

      {/* Top Loading Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 shadow-md">
        <div className="bg-white h-full animate-pulse" />
      </div>
    </>
  );
}
