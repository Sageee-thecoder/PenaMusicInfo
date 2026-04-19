import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Music, Users, Heart, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function Home() {
  const [, navigate] = useLocation();
  const { data: bandMembers } = trpc.bandMembers.list.useQuery();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleJoinClick = () => {
    navigate("/apply");
  };

  const roles = {
    vokal: "Vokal",
    gitarist: "Gitarist",
    baterist: "Baterist",
    kemancı: "Kemancı",
    piyanist: "Piyanist",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-slate-950/95 backdrop-blur-md shadow-lg" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Music className="w-8 h-8 text-amber-400" />
            <span className="text-xl font-bold text-white">Müzik Grubu</span>
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <a href="#about" className="text-gray-300 hover:text-white transition">Hakkımızda</a>
            <a href="#members" className="text-gray-300 hover:text-white transition">Üyeler</a>
            <a href="#join" className="text-gray-300 hover:text-white transition">Katıl</a>
            <button onClick={() => navigate('/admin-login')} className="text-gray-300 hover:text-white transition text-sm px-3 py-1 border border-gray-600 rounded hover:border-white">Giriş</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Müzik ile <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Hayat Bulur</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Yükselen bir müzik grubu olarak, tutkumuz müzik, misyonumuz ise insanları bir araya getirmek. Bize katılın ve bu müzik yolculuğunun parçası olun.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleJoinClick}
              className="bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-black font-bold py-6 px-8 rounded-lg text-lg flex items-center gap-2 transition-all transform hover:scale-105"
            >
              Bize Katıl <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              onClick={() => navigate('/admin-login')}
              variant="outline"
              className="border-gray-400 text-white hover:bg-white/10 py-6 px-8 rounded-lg text-lg"
            >
              Panele Gir
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">Hakkımızda</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-lg p-8 hover:border-amber-500/40 transition">
              <Music className="w-12 h-12 text-amber-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Müzik Tutkusu</h3>
              <p className="text-gray-300">Müzik sadece bir sanat değil, bir yaşam tarzı. Her notada, her ritimdeki tutkumuz hissedilir.</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-8 hover:border-purple-500/40 transition">
              <Users className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Birlik ve Uyum</h3>
              <p className="text-gray-300">Beş farklı enstrüman, bir kalp. Birlikte uyum içinde çalışarak, sihirli anlar yaratıyoruz.</p>
            </div>

            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-8 hover:border-cyan-500/40 transition">
              <Heart className="w-12 h-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Toplum Bağlantısı</h3>
              <p className="text-gray-300">Müzik aracılığıyla insanları bir araya getirmek, duygularını paylaşmak ve bağlantı kurmak.</p>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 md:p-12">
            <h3 className="text-2xl font-bold text-white mb-4">Vizyonumuz</h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              Müzik grubumuz, sadece şarkı söylemek ve çalmaktan öte, insanların kalplerine dokunmayı hedefler. Her performansımızda, her notamızda, izleyicilerimizin duygularını harekete geçirmek ve onları bir müzik yolculuğuna davet etmek istiyoruz. Yükselen bir grup olarak, büyümeyi ve gelişmeyi sürdürürken, müzik aracılığıyla topluma katkı sağlamak bizim en büyük amacımızdır.
            </p>
          </div>
        </div>
      </section>

      {/* Members Section */}
      <section id="members" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">Grup Üyeleri</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {bandMembers?.map((member) => (
              <div
                key={member.id}
                className="group bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600 rounded-lg overflow-hidden hover:border-amber-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-400/20"
              >
                {member.imageUrl && (
                  <div className="w-full h-40 bg-gradient-to-br from-amber-400 to-orange-400 overflow-hidden">
                    <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-amber-400 font-semibold mb-2">{roles[member.role as keyof typeof roles]}</p>
                  {member.bio && <p className="text-sm text-gray-400">{member.bio}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="join" className="py-20 px-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-y border-amber-500/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Müzik Yolculuğuna Katılın</h2>
          <p className="text-xl text-gray-300 mb-8">
            Müzik tutkusu taşıyorsanız ve bir grup içinde çalmak istiyorsanız, bize katılın. Yeni enstrümanlar, yeni sesler ve yeni dostluklar sizi bekliyor.
          </p>
          <Button
            onClick={handleJoinClick}
            className="bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-black font-bold py-6 px-12 rounded-lg text-lg flex items-center gap-2 transition-all transform hover:scale-105 mx-auto"
          >
            Bize Katıl <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p>&copy; 2026 Müzik Grubu. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}
