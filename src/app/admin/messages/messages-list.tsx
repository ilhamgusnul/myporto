"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Mail, MailOpen } from "lucide-react";
import { deleteMessage, deleteMessages, markAsRead } from "./actions";

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export function MessagesList({ initialMessages }: { initialMessages: Message[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(messages.map((m) => m.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    const result = await deleteMessage(id);
    if (result.success) {
      setMessages(messages.filter((m) => m.id !== id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} message(s)?`)) return;

    setIsDeleting(true);
    const result = await deleteMessages(selectedIds);
    if (result.success) {
      setMessages(messages.filter((m) => !selectedIds.includes(m.id)));
      setSelectedIds([]);
    }
    setIsDeleting(false);
  };

  const handleMarkAsRead = async (id: string, read: boolean) => {
    const result = await markAsRead(id, read);
    if (result.success) {
      setMessages(
        messages.map((m) => (m.id === id ? { ...m, read } : m))
      );
    }
  };

  const allSelected = messages.length > 0 && selectedIds.length === messages.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < messages.length;

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {messages.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-white rounded-lg border">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={(e) => handleSelectAll(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <span className="text-sm text-muted-foreground">
            {selectedIds.length > 0
              ? `${selectedIds.length} selected`
              : "Select all"}
          </span>
          {selectedIds.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeleting ? "Deleting..." : `Delete ${selectedIds.length}`}
            </Button>
          )}
        </div>
      )}

      {/* Messages */}
      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`bg-white p-6 rounded-lg border transition-colors ${
              msg.read ? "bg-gray-50" : "bg-white"
            }`}
          >
            <div className="flex items-start gap-4">
              <input
                type="checkbox"
                checked={selectedIds.includes(msg.id)}
                onChange={(e) => handleSelect(msg.id, e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 mt-1"
              />

              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">{msg.name}</div>
                      {!msg.read && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">{msg.email}</div>
                    {msg.subject && (
                      <div className="text-sm font-medium mt-1">Subject: {msg.subject}</div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                    {new Date(msg.createdAt).toLocaleString()}
                  </div>
                </div>
                <p className="text-sm whitespace-pre-wrap mb-4">{msg.message}</p>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMarkAsRead(msg.id, !msg.read)}
                  >
                    {msg.read ? (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Mark Unread
                      </>
                    ) : (
                      <>
                        <MailOpen className="h-4 w-4 mr-2" />
                        Mark Read
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(msg.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
