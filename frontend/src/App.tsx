import Header from "./components/UI/Header";

function App() {
  // Just for testing not as part of task
  async function restoreNotifications() {
    try {
      await fetch("http://localhost:3009/api/notifications/reset");
      window.location.reload();
    } catch {
      return null;
    }
  }

  return (
    <div className="flex h-screen w-full flex-col gap-0.5">
      <Header />
      <main className="container mx-auto flex min-h-[calc(100vh-4.5rem)]">
        <button
          className="ms-auto mt-auto h-10 rounded-full bg-amber-200 px-10 text-center text-red-500"
          onClick={() => restoreNotifications()}
        >
          Restore notification
        </button>
      </main>
    </div>
  );
}

export default App;
