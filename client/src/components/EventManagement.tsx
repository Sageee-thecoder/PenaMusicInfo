import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar, Plus, Trash2, Edit2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function EventManagement() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventDate: "",
    eventTime: "19:00",
    location: "",
    eventType: "konser" as "prova" | "konser" | "diger",
  });

  const { data: events, refetch } = trpc.events.list.useQuery();
  const { data: bandMembers } = trpc.bandMembers.list.useQuery();
  const [selectedParticipants, setSelectedParticipants] = useState<number[]>([]);

  const createMutation = trpc.events.create.useMutation({
    onSuccess: () => {
      toast.success("Etkinlik oluşturuldu");
      refetch();
      resetForm();
    },
    onError: () => toast.error("Etkinlik oluşturulamadı"),
  });

  const updateMutation = trpc.events.update.useMutation({
    onSuccess: () => {
      toast.success("Etkinlik güncellendi");
      refetch();
      resetForm();
    },
    onError: () => toast.error("Etkinlik güncellenemedi"),
  });

  const deleteMutation = trpc.events.delete.useMutation({
    onSuccess: () => {
      toast.success("Etkinlik silindi");
      refetch();
    },
    onError: () => toast.error("Etkinlik silinemedi"),
  });

  const addParticipantMutation = trpc.events.addParticipant.useMutation({
    onSuccess: () => {
      toast.success("Katılımcı eklendi");
      refetch();
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      eventDate: "",
      eventTime: "19:00",
      location: "",
      eventType: "konser",
    });
    setSelectedParticipants([]);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.eventDate) {
      toast.error("Etkinlik adı ve tarihi gerekli");
      return;
    }

    const eventDateTime = new Date(`${formData.eventDate}T${formData.eventTime}`);

    if (editingId) {
      await updateMutation.mutateAsync({
        id: editingId,
        title: formData.title,
        description: formData.description,
        eventDate: eventDateTime,
        location: formData.location,
        eventType: formData.eventType,
      });
    } else {
      await createMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        eventDate: eventDateTime,
        location: formData.location,
        eventType: formData.eventType,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Calendar className="w-6 h-6 text-amber-400" />
          Etkinlik Yönetimi
        </h2>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-amber-400 hover:bg-amber-500 text-black font-bold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Etkinlik Ekle
        </Button>
      </div>

      {showForm && (
        <Card className="bg-slate-700 border-slate-600 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-white mb-2 block">
                Etkinlik Adı
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Prova / Konser adı"
                className="bg-slate-600 border-slate-500 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-white mb-2 block">
                  Tarih
                </label>
                <Input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className="bg-slate-600 border-slate-500 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-white mb-2 block">
                  Saat
                </label>
                <Input
                  type="time"
                  value={formData.eventTime}
                  onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                  className="bg-slate-600 border-slate-500 text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-white mb-2 block">
                Mekan
              </label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Mekan adı"
                className="bg-slate-600 border-slate-500 text-white"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-white mb-2 block">
                Etkinlik Türü
              </label>
              <select
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value as any })}
                className="w-full bg-slate-600 border border-slate-500 text-white rounded px-3 py-2"
              >
                <option value="prova">Prova</option>
                <option value="konser">Konser</option>
                <option value="diger">Diğer</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-white mb-2 block">
                Açıklama
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Etkinlik hakkında notlar"
                className="w-full bg-slate-600 border border-slate-500 text-white rounded px-3 py-2 h-24"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                {editingId ? "Güncelle" : "Oluştur"}
              </Button>
              <Button
                type="button"
                onClick={resetForm}
                variant="outline"
                className="text-white border-gray-400"
              >
                İptal
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-4">
        {events && events.length > 0 ? (
          events.map((event) => (
            <Card key={event.id} className="bg-slate-700 border-slate-600 p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">{event.title}</h3>
                  <p className="text-sm text-gray-300 mt-1">
                    📅 {new Date(event.eventDate).toLocaleDateString("tr-TR")} •
                    🕐 {new Date(event.eventDate).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                  {event.location && (
                    <p className="text-sm text-gray-300">📍 {event.location}</p>
                  )}
                  {event.description && (
                    <p className="text-sm text-gray-400 mt-2">{event.description}</p>
                  )}
                  <span className="inline-block mt-2 px-2 py-1 bg-amber-400/20 text-amber-300 text-xs rounded">
                    {event.eventType === "prova" ? "🎵 Prova" : event.eventType === "konser" ? "🎤 Konser" : "📌 Diğer"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => deleteMutation.mutate({ id: event.id })}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-gray-400 text-center py-8">Henüz etkinlik eklenmedi</p>
        )}
      </div>
    </div>
  );
}
