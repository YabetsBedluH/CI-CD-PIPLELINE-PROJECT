"use client";

import { useState, useEffect, useCallback } from "react";

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Fetch all contacts - wrapped in useCallback to fix dependency warning
  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/contacts`);
      const data = await response.json();
      setContacts(data);
      setError("");
    } catch {
      setError("Failed to fetch contacts try again later");
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  // Create contact
  const createContact = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const newContact = await response.json();
      setContacts([...contacts, newContact]);
      resetForm();
      setError("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create contact ");
    }
  };

  // Update contact
  const updateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContact) return;

    try {
      const response = await fetch(`${API_URL}/contacts/${editingContact.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error("Failed to update Contact");

      const updatedContact = await response.json();
      setContacts(contacts.map(c => c.id === updatedContact.id ? updatedContact : c));
      resetForm();
      setError("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update Contact");
    }
  };

  // Delete contact
  const deleteContact = async (id: number) => {
    if (!confirm("Are you sure you want to delete this contact?")) return;

    try {
      const response = await fetch(`${API_URL}/contacts/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Failed to delete contact");

      setContacts(contacts.filter(c => c.id !== id));
      setError("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to delete contact");
    }
  };

  // Edit handler
  const startEdit = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      email: contact.email,
      phone: contact.phone
    });
    setShowForm(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({ name: "", email: "", phone: "" });
    setEditingContact(null);
    setShowForm(false);
  };

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              📇 Contact Manager
            </h2>
            <p className="text-blue-100 text-lg">
              Organize and manage your contacts easily
            </p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl text-sm font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <span className="text-xl">+</span> Add Contact
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-6 py-4 rounded-lg shadow-md flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Contacts</h3>
              <p className="text-4xl font-bold text-gray-900 mt-2">{contacts.length}</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-full">
              <span className="text-3xl">👥</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Backend Status</h3>
              <p className="text-2xl font-bold text-green-600 mt-2 flex items-center gap-2">
                {loading ? "..." : <><span className="animate-pulse">●</span> Connected</>}
              </p>
            </div>
            <div className="bg-green-100 p-4 rounded-full">
              <span className="text-3xl">✓</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">API Endpoint</h3>
              <p className="text-sm font-mono text-gray-900 mt-2 break-all">https://contact-manager-up3z.onrender.com</p>
            </div>
            <div className="bg-purple-100 p-4 rounded-full">
              <span className="text-3xl">🔗</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-blue-600">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              {editingContact ? "✏️ Edit Contacts" : "➕ Add New Contact"}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ✕
            </button>
          </div>
          
          <form onSubmit={editingContact ? updateContact : createContact} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                👤 Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 bg-gray-50"
                placeholder="John Doe"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📧 Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 bg-gray-50"
                placeholder="john@example.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📱 Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 bg-gray-50"
                placeholder="+1 (555) 000-0000"
                required
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                {editingContact ? "💾 Update Contact" : "✨ Create Contact"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Contact List */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            📋 Your Contacts
          </h3>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-500 font-medium">Loading contacts...</p>
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-7xl">📭</span>
            <p className="mt-4 text-xl text-gray-500 font-medium">No contacts yet</p>
            <p className="text-gray-400 mt-2">Click &quot;Add Contact&quot; to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-8 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {contacts.map((contact, index) => (
                  <tr 
                    key={contact.id} 
                    className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                          {contact.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">{contact.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="text-sm text-gray-700 font-medium">{contact.email}</div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="text-sm text-gray-700 font-medium">{contact.phone}</div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => startEdit(contact)}
                        className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg mr-2 transition-colors font-semibold"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => deleteContact(contact.id)}
                        className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors font-semibold"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
