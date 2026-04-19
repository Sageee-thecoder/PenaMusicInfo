import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";

export default function MemberCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { data: events } = trpc.events.list.useQuery();

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const monthDays = useMemo(() => {
    const days = [];
    const firstDay = firstDayOfMonth(currentDate);
    const totalDays = daysInMonth(currentDate);

    // Önceki ayın günleri
    const prevMonthDays = daysInMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, prevMonthDays - i),
      });
    }

    // Bu ayın günleri
    for (let i = 1; i <= totalDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i),
      });
    }

    // Sonraki ayın günleri
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i),
      });
    }

    return days;
  }, [currentDate]);

  const getEventsForDate = (date: Date) => {
    return events?.filter((event) => {
      const eventDate = new Date(event.eventDate);
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      );
    }) || [];
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const monthName = currentDate.toLocaleDateString("tr-TR", { month: "long", year: "numeric" });
  const dayNames = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];

  // Yaklaşan etkinlikler (sonraki 7 gün)
  const upcomingEvents = useMemo(() => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    return (events || [])
      .filter((event) => {
        const eventDate = new Date(event.eventDate);
        return eventDate >= today && eventDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
  }, [events]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <Calendar className="w-6 h-6 text-amber-400" />
        Takvim ve Etkinlikler
      </h2>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Takvim */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-700 border-slate-600 p-6">
            {/* Ay Başlığı */}
            <div className="flex items-center justify-between mb-6">
              <Button
                onClick={previousMonth}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-slate-600"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <h3 className="text-lg font-bold text-white capitalize">{monthName}</h3>
              <Button
                onClick={nextMonth}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-slate-600"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Gün Başlıkları */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {dayNames.map((day) => (
                <div key={day} className="text-center text-sm font-semibold text-amber-400 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Takvim Günleri */}
            <div className="grid grid-cols-7 gap-2">
              {monthDays.map((dayObj, idx) => {
                const dayEvents = getEventsForDate(dayObj.date);
                const isToday =
                  dayObj.date.toDateString() === new Date().toDateString();

                return (
                  <div
                    key={idx}
                    className={`aspect-square rounded-lg p-2 text-sm font-semibold flex flex-col items-center justify-start transition-all ${
                      dayObj.isCurrentMonth
                        ? isToday
                          ? "bg-amber-400 text-black"
                          : "bg-slate-600 text-white hover:bg-slate-500"
                        : "bg-slate-800 text-gray-500"
                    } ${dayEvents.length > 0 ? "ring-2 ring-amber-400" : ""}`}
                  >
                    <span>{dayObj.day}</span>
                    {dayEvents.length > 0 && (
                      <div className="text-xs mt-1">
                        {dayEvents.length > 1 ? (
                          <span className="bg-amber-400 text-black px-1 rounded">
                            {dayEvents.length}
                          </span>
                        ) : (
                          <span className="w-1 h-1 bg-amber-400 rounded-full"></span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Yaklaşan Etkinlikler */}
        <div>
          <Card className="bg-slate-700 border-slate-600 p-6 h-full">
            <h3 className="text-lg font-bold text-white mb-4">Yaklaşan Etkinlikler</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-slate-600/50 border border-slate-500 rounded-lg p-3 hover:border-amber-400/50 transition"
                  >
                    <h4 className="font-semibold text-white text-sm line-clamp-2">
                      {event.title}
                    </h4>
                    <div className="space-y-1 mt-2 text-xs text-gray-300">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>
                          {new Date(event.eventDate).toLocaleDateString("tr-TR")}
                          {" "}
                          {new Date(event.eventDate).toLocaleTimeString("tr-TR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-400" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      )}
                    </div>
                    <span
                      className={`inline-block mt-2 px-2 py-1 text-xs rounded font-semibold ${
                        event.eventType === "konser"
                          ? "bg-red-500/20 text-red-400"
                          : event.eventType === "prova"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {event.eventType === "konser"
                        ? "🎤 Konser"
                        : event.eventType === "prova"
                        ? "🎵 Prova"
                        : "📌 Diğer"}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm text-center py-8">
                  Yaklaşan etkinlik yok
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
