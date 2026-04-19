import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function ApplicationForm() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    appliedRole: "vokal" | "gitarist" | "baterist" | "kemancı" | "piyanist";
    message: string;
  }>({
    name: "",
    email: "",
    phone: "",
    appliedRole: "gitarist",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const createApplicationMutation = trpc.applications.create.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      toast.error("Lütfen adınız ve e-postanızı girin");
      return;
    }

    try {
      await createApplicationMutation.mutateAsync({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        appliedRole: formData.appliedRole,
        message: formData.message || undefined,
      });

      setSubmitted(true);
      toast.success("Başvurunuz başarıyla gönderildi!");

      // Redirect to home after 3 seconds
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      toast.error("Başvuru gönderilirken hata oluştu");
      console.error(error);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-800 border-slate-700">
          <div className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-white mb-4">Başvurunuz Alındı!</h1>
            <p className="text-gray-300 mb-6">
              Başvurunuz başarıyla gönderildi. Yakında sizinle iletişime geçeceğiz.
            </p>
            <p className="text-sm text-gray-400">Ana sayfaya yönlendiriliyorsunuz...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Geri Dön
        </button>

        <Card className="bg-slate-800 border-slate-700">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-2">Başvuru Formu</h1>
            <p className="text-gray-400 mb-8">Müzik grubumuz hakkında daha fazla bilgi almak ve başvurunuzu göndermek için formu doldurun.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-white mb-2 block">Adınız *</label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Adınızı girin"
                  className="bg-slate-700 border-slate-600 text-white placeholder-gray-500"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-white mb-2 block">E-posta *</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="E-posta adresiniz"
                  className="bg-slate-700 border-slate-600 text-white placeholder-gray-500"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-white mb-2 block">Telefon</label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Telefon numaranız"
                  className="bg-slate-700 border-slate-600 text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-white mb-2 block">Katılmak İstediğiniz Rol *</label>
                <Select
                  value={formData.appliedRole}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      appliedRole: value as any,
                    })
                  }
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="vokal" className="text-white">
                      Vokal
                    </SelectItem>
                    <SelectItem value="gitarist" className="text-white">
                      Gitarist
                    </SelectItem>
                    <SelectItem value="baterist" className="text-white">
                      Baterist
                    </SelectItem>
                    <SelectItem value="kemancı" className="text-white">
                      Kemancı
                    </SelectItem>
                    <SelectItem value="piyanist" className="text-white">
                      Piyanist
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-semibold text-white mb-2 block">Hakkınızda Bilgi</label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Müzik deneyiminiz, hedefleriniz ve neden grubumuzda olmak istediğinizi anlatın..."
                  className="bg-slate-700 border-slate-600 text-white placeholder-gray-500 min-h-32"
                />
              </div>

              <Button
                type="submit"
                disabled={createApplicationMutation.isPending}
                className="w-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-black font-bold py-3 rounded-lg text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createApplicationMutation.isPending ? "Gönderiliyor..." : "Başvuruyu Gönder"}
              </Button>
            </form>

            <p className="text-xs text-gray-500 mt-6 text-center">
              Başvurunuz gönderildikten sonra, grubumuzun yöneticileri tarafından incelenecektir.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
