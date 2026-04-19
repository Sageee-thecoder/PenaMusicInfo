import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Music, Lock } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

const COMMON_PASSWORD = "Muzik2024"; // Ortak parola

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch band members for member code verification
  const { data: bandMembers } = trpc.bandMembers.list.useQuery();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      toast.error("Lütfen parola veya kodu girin");
      return;
    }

    setIsLoading(true);

    try {
      // Kontrol 1: Ortak parola mı?
      if (password === COMMON_PASSWORD) {
        toast.success("Ortak panele hoş geldiniz");
        // Ortak admin paneline yönlendir
        navigate("/admin-panel-secret-xyz");
        return;
      }

      // Kontrol 2: Kişisel kod mu?
      try {
        // Veritabanında kod kontrolü yap
        // Şu an client-side kontrol yapıyoruz
        if (password.length >= 6) {
          toast.success("Üye panelinize hoş geldiniz");
          // Kişisel panele yönlendir
          navigate("/member-panel", { state: { accessCode: password } });
          return;
        }
      } catch (error) {
        // Kod geçersiz, devam et
      }

      // Hiçbiri eşleşmedi
      toast.error("Geçersiz parola veya kod");
    } catch (error) {
      toast.error("Giriş sırasında hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700 p-8">
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          <Music className="w-8 h-8 text-amber-400 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-white">Müzik Grubu</h1>
            <p className="text-xs text-gray-400">Yönetim Sistemi</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-semibold text-white mb-3 block">
              Parola veya Kod
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Giriş yapın..."
                className="bg-slate-700 border-slate-600 text-white placeholder-gray-500 pl-10"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-amber-400 hover:bg-amber-500 text-black font-bold py-2"
          >
            {isLoading ? "Kontrol ediliyor..." : "Giriş Yap"}
          </Button>
        </form>

        {/* Info */}
        <div className="mt-8 pt-6 border-t border-slate-700 space-y-3">
          <div className="text-xs text-gray-400">
            <p className="font-semibold text-white mb-2">Giriş Türleri:</p>
            <ul className="space-y-2">
              <li>
                <span className="text-amber-400">🔐 Ortak Parola:</span>
                <br />
                Tüm üyelerin kullandığı ortak panele giriş
              </li>
              <li>
                <span className="text-amber-400">👤 Kişisel Kod:</span>
                <br />
                Sadece kendi paneline giriş
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-slate-700 text-center">
          <p className="text-xs text-gray-500">
            Parola veya kodunuzu unuttuysanız grup yöneticisine başvurun
          </p>
        </div>
      </Card>
    </div>
  );
}
