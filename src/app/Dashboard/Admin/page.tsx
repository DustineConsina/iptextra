'use client';
import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid,
} from 'recharts';

const sidebarNav = [
  { label: 'Dashboard', key: 'dashboard' },
  { label: 'Users', key: 'users' },
  { label: 'Books', key: 'books' },
  { label: 'Borrow/Return', key: 'transactions' },
];

const stats = [
  { label: 'Total Books', value: 3200 },
  { label: 'Total Members', value: 450 },
  { label: 'Books Issued', value: 120 },
  { label: 'Books Returned', value: 110 },
];

const chartData = [
  { name: 'Jan', books: 3000, issued: 100, returned: 90 },
  { name: 'Feb', books: 3100, issued: 110, returned: 95 },
  { name: 'Mar', books: 3150, issued: 120, returned: 100 },
  { name: 'Apr', books: 3200, issued: 130, returned: 110 },
];

type Book = {
  id: number;
  title: string;
  author: string;
  category: string;
  image: string;
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [books, setBooks] = useState<Book[]>([
    {
      id: 1,
      title: 'React for Beginners',
      author: 'Alice Johnson',
      category: 'Fiction',
      image: 'https://placehold.co/100x140?text=React',
    },
    {
      id: 2,
      title: 'TypeScript Handbook',
      author: 'Bob Smith',
      category: 'Educational',
      image: 'https://placehold.co/100x140?text=TS',
    },
    {
      id: 3,
      title: 'Next.js in Action',
      author: 'Carol Lee',
      category: 'Fiction',
      image: 'https://placehold.co/100x140?text=Next.js',
    },
  ]);

  const [form, setForm] = useState<{ id?: number; title: string; author: string; category: string; image?: string }>({
    title: '',
    author: '',
    category: '',
    image: '',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim() || !form.category.trim()) {
      alert('Please fill in all fields.');
      return;
    }

    if (isEditing && form.id !== undefined) {
      setBooks((prev) =>
        prev.map((b) =>
          b.id === form.id ? { ...b, ...form } : b
        )
      );
      setIsEditing(false);
    } else {
      const newBook: Book = {
        id: Date.now(),
        title: form.title,
        author: form.author,
        category: form.category,
        image: form.image || 'https://placehold.co/100x140?text=Book',
      };
      setBooks((prev) => [newBook, ...prev]);
    }

    setForm({ title: '', author: '', category: '', image: '' });
  };

  const handleEdit = (book: Book) => {
    setForm(book);
    setIsEditing(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this book?')) {
      setBooks((prev) => prev.filter((b) => b.id !== id));
      if (isEditing && form.id === id) {
        setForm({ title: '', author: '', category: '', image: '' });
        setIsEditing(false);
      }
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-64px)] w-screen pt-16 bg-gray-100">
      <nav className="flex flex-col w-64 bg-blue-900 text-white rounded-tr-3xl rounded-br-3xl shadow-lg p-8 sticky top-16 h-[calc(100vh-64px)]">
        <h2 className="text-2xl font-bold mb-8">Admin Menu</h2>
        <ul className="flex flex-col gap-5 font-semibold text-white text-lg">
          {sidebarNav.map((item) => (
            <li key={item.key}>
              <button
                onClick={() => setActiveTab(item.key)}
                className={`w-full text-left px-3 py-2 rounded-md transition ${
                  activeTab === item.key ? 'bg-white text-blue-900 font-bold' : 'hover:bg-blue-700'
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex-1 container mx-auto px-6 py-12 max-w-7xl overflow-auto bg-gray-50 rounded-lg shadow-inner">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-800 flex items-center gap-3">
            <span>📊</span> {sidebarNav.find((n) => n.key === activeTab)?.label}
          </h1>
        </header>

        {activeTab === 'dashboard' && (
          <>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-14">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center">
                  <div className="text-4xl font-bold text-blue-700">{stat.value.toLocaleString()}</div>
                  <div className="text-gray-600 mt-2 uppercase tracking-wide text-sm">{stat.label}</div>
                </div>
              ))}
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-md mb-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Library Overview</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#3b82f6" />
                  <YAxis stroke="#3b82f6" />
                  <Tooltip />
                  <Bar dataKey="books" fill="#3b82f6" barSize={40} radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>

              <h3 className="text-xl font-semibold text-gray-700 mt-10 mb-4">Issuance Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#3b82f6" />
                  <YAxis stroke="#3b82f6" />
                  <Tooltip />
                  <Line type="monotone" dataKey="issued" stroke="#10b981" strokeWidth={3} />
                  <Line type="monotone" dataKey="returned" stroke="#6366f1" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </section>
          </>
        )}

        {activeTab === 'users' && (
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-blue-800">Users Section</h2>
            <table className="w-full text-left border rounded-xl overflow-hidden">
              <thead className="bg-blue-100 text-blue-800">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Jane Doe', email: 'jane@example.com', role: 'Librarian' },
                  { name: 'John Smith', email: 'john@example.com', role: 'Member' },
                  { name: 'Emily Davis', email: 'emily@example.com', role: 'Member' },
                ].map((user, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'books' && (
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-blue-800">{isEditing ? 'Edit Book' : 'Add New Book'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <input type="text" name="title" placeholder="Book Title" value={form.title} onChange={handleChange} className="border border-gray-300 p-3 rounded-xl" />
              <input type="text" name="author" placeholder="Author" value={form.author} onChange={handleChange} className="border border-gray-300 p-3 rounded-xl" />
              <input type="text" name="category" placeholder="Category" value={form.category} onChange={handleChange} className="border border-gray-300 p-3 rounded-xl" />
              <input type="text" name="image" placeholder="Image URL" value={form.image || ''} onChange={handleChange} className="border border-gray-300 p-3 rounded-xl md:col-span-2" />
              <button type="submit" className="md:col-span-3 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition">
                {isEditing ? 'Update Book' : 'Add Book'}
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
                <div key={book.id} className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
                  <img src={book.image} alt={book.title} className="h-40 w-full object-cover rounded-lg mb-4" />
                  <h3 className="text-lg font-bold text-gray-800">{book.title}</h3>
                  <p className="text-gray-600">by {book.author}</p>
                  <p className="text-sm text-gray-500 mb-4">Category: {book.category}</p>
                  <div className="flex justify-between">
                    <button onClick={() => handleEdit(book)} className="text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(book.id)} className="text-red-600 hover:underline">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-blue-800">Borrow / Return Section</h2>
            <table className="w-full text-left border rounded-xl overflow-hidden">
              <thead className="bg-green-100 text-green-800">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Book</th>
                  <th className="p-3">Date Borrowed</th>
                  <th className="p-3">Date Returned</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { user: 'Jane Doe', book: 'React for Beginners', borrowed: '2025-05-10', returned: '2025-05-15' },
                  { user: 'John Smith', book: 'Next.js in Action', borrowed: '2025-05-11', returned: '' },
                ].map((t, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-3">{t.user}</td>
                    <td className="p-3">{t.book}</td>
                    <td className="p-3">{t.borrowed}</td>
                    <td className="p-3">{t.returned || <span className="text-red-500">Not Returned</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
