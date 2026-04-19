import { Calendar, MapPin, Clock } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";

export default function UpcomingEvents() {
  const { data: events } = trpc.events.list.useQuery();

  // Filter upcoming events (next 30 days)
  const upcomingEvents = events?.filter((event) => {
    const eventDate = new Date(event.eventDate);
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return eventDate >= today && eventDate <= thirtyDaysFromNow;
  }).sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()).slice(0, 3);

  if (!upcomingEvents || upcomingEvents.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
          Yaklaşan Etkinlikler
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {upcomingEvents.map((event) => (
            <Card
              key={event.id}
              className="bg-slate-700/50 border-slate-600 hover:border-amber-400/50 transition-all duration-300 p-6"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-bold text-white flex-1">{event.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${
                    event.eventType === "konser" 
                      ? "bg-red-500/20 text-red-400" 
                      : event.eventType === "prova"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}>
                    {event.eventType === "konser" ? "🎤 Konser" : event.eventType === "prova" ? "🎵 Prova" : "📌 Diğer"}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>{new Date(event.eventDate).toLocaleDateString("tr-TR", { 
                      weekday: "long", 
                      year: "numeric", 
                      month: "long", 
                      day: "numeric" 
                    })}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>{new Date(event.eventDate).toLocaleTimeString("tr-TR", { 
                      hour: "2-digit", 
                      minute: "2-digit" 
                    })}</span>
                  </div>

                  {event.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-amber-400" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>

                {event.description && (
                  <p className="text-sm text-gray-400 line-clamp-2">{event.description}</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
