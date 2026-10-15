import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5001/api/todo';

export default function App() {
  const [data, setData] = useState([]);
  const [title, setTitle] = useState('');

  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');

  const [busyTaskId, setBusyTaskId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  // Read: fetch all tasks
  async function fetchData() {
    setIsFetching(true);
    setFetchError('');

    try {
      const response = await fetch(API_URL);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Could not load tasks.');
      }

      setData(result.data);
    } catch (err) {
      setFetchError(
        'Unable to load tasks. Check your connection and try again.',
      );
    } finally {
      setIsFetching(false);
    }
  }

  // Create: add a task
  async function addTask(e) {
    e.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError('Please enter a task before adding it.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: trimmedTitle }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to add task.');
      }

      setData((current) => [...current, result.data]);
      setTitle('');
    } catch (err) {
      setError(err.message || 'Could not add your task.');
    } finally {
      setLoading(false);
    }
  }

  // Update: change completion status
  async function toggleTask(task) {
    setBusyTaskId(task._id);
    setActionError('');

    try {
      const response = await fetch(`${API_URL}/${task._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || result.errorMsg || 'Update failed.');
      }

      setData((current) =>
        current.map((item) => (item._id === task._id ? result.data : item)),
      );
    } catch (err) {
      setActionError(err.message || 'Could not update the task.');
    } finally {
      setBusyTaskId(null);
    }
  }

  // Start editing a task title
  function startEditing(task) {
    setEditingId(task._id);
    setEditTitle(task.title);
    setActionError('');
  }

  // Update: save the edited title
  async function saveEdit(taskId) {
    const trimmedTitle = editTitle.trim();

    if (!trimmedTitle) {
      setActionError('Task title cannot be empty.');
      return;
    }

    setBusyTaskId(taskId);
    setActionError('');

    try {
      const response = await fetch(`${API_URL}/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: trimmedTitle }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || result.errorMsg || 'Update failed.');
      }

      setData((current) =>
        current.map((task) => (task._id === taskId ? result.data : task)),
      );

      setEditingId(null);
      setEditTitle('');
    } catch (err) {
      setActionError(err.message || 'Could not save your changes.');
    } finally {
      setBusyTaskId(null);
    }
  }

  // Delete: remove a task
  async function deleteTask(task) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${task.title}"?`,
    );

    if (!confirmed) return;

    setBusyTaskId(task._id);
    setActionError('');

    try {
      const response = await fetch(`${API_URL}/${task._id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || result.errorMsg || 'Delete failed.');
      }

      setData((current) => current.filter((item) => item._id !== task._id));

      if (editingId === task._id) {
        setEditingId(null);
        setEditTitle('');
      }
    } catch (err) {
      setActionError(err.message || 'Could not delete the task.');
    } finally {
      setBusyTaskId(null);
    }
  }

  function handleTitleChange(e) {
    setTitle(e.target.value);
    setError('');
  }

  useEffect(() => {
    fetchData();
  }, []);

  const completedCount = data.filter((task) => task.completed).length;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-800">
      <section className="mx-auto w-full max-w-2xl">
        <header className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-2xl text-white shadow-lg shadow-indigo-200">
            ✓
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            My Tasks
          </h1>

          <p className="mt-3 text-slate-500">
            A little progress every day adds up.
          </p>
        </header>

        {/* Create task */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Add a new task
          </h2>

          <form onSubmit={addTask} noValidate>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                placeholder="What do you need to do?"
                value={title}
                onChange={handleTitleChange}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'task-error' : undefined}
                className={`min-w-0 flex-1 rounded-xl border bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                  error
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                }`}
              />

              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Adding...' : '+ Add task'}
              </button>
            </div>

            {error && (
              <p
                id="task-error"
                role="alert"
                className="mt-3 text-sm text-red-600"
              >
                {error}
              </p>
            )}
          </form>
        </div>

        {/* Task list */}
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-slate-900">Your task list</h2>

            <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">
              {completedCount}/{data.length} completed
            </span>
          </div>

          {actionError && (
            <div
              role="alert"
              className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700"
            >
              {actionError}
              <button
                type="button"
                onClick={() => setActionError('')}
                className="ml-2 font-semibold underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {isFetching ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
              Loading your tasks...
            </div>
          ) : fetchError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
              <p role="alert">{fetchError}</p>
              <button
                type="button"
                onClick={fetchData}
                className="mt-3 font-semibold underline"
              >
                Try again
              </button>
            </div>
          ) : data.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white px-6 py-12 text-center">
              <div className="mb-3 text-4xl" aria-hidden="true">
                📝
              </div>
              <h3 className="font-semibold text-slate-800">
                Nothing on your list yet
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Add your first task above to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.map((task) => {
                const isBusy = busyTaskId === task._id;
                const isEditing = editingId === task._id;

                return (
                  <div
                    key={task._id}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-200 sm:p-5"
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        disabled={isBusy}
                        onChange={() => toggleTask(task)}
                        aria-label={`Mark ${task.title} as ${
                          task.completed ? 'pending' : 'completed'
                        }`}
                        className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-indigo-600 disabled:cursor-not-allowed"
                      />

                      <div className="min-w-0 flex-1">
                        {isEditing ? (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              saveEdit(task._id);
                            }}
                            className="flex flex-col gap-2 sm:flex-row"
                          >
                            <input
                              autoFocus
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              aria-label="Edit task title"
                              className="min-w-0 flex-1 rounded-lg border border-indigo-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-100"
                            />

                            <div className="flex gap-2">
                              <button
                                type="submit"
                                disabled={isBusy}
                                className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                              >
                                {isBusy ? 'Saving...' : 'Save'}
                              </button>

                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() => {
                                  setEditingId(null);
                                  setEditTitle('');
                                }}
                                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          <>
                            <p
                              className={`wrap-break-words font-medium ${
                                task.completed
                                  ? 'text-slate-400 line-through'
                                  : 'text-slate-800'
                              }`}
                            >
                              {task.title}
                            </p>

                            <span
                              className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                                task.completed
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {task.completed ? 'Done' : 'Pending'}
                            </span>
                          </>
                        )}
                      </div>

                      {!isEditing && (
                        <div className="flex shrink-0 gap-2">
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => startEditing(task)}
                            aria-label={`Edit ${task.title}`}
                            className="rounded-lg px-2 py-1 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 disabled:opacity-50"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => deleteTask(task)}
                            aria-label={`Delete ${task.title}`}
                            className="rounded-lg px-2 py-1 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            {isBusy ? '...' : 'Delete'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <footer className="mt-10 text-center text-sm text-slate-400">
          One task at a time. You've got this.
        </footer>
      </section>
    </main>
  );
}
