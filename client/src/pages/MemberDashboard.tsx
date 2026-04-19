import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Music, LogOut, Plus, Heart, MessageCircle, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import MemberCalendar from "@/components/MemberCalendar";

export default function MemberDashboard() {
  const [, navigate] = useLocation();
  const [accessCode, setAccessCode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [memberId, setMemberId] = useState<number | null>(null);
  const [memberName, setMemberName] = useState("");
  const [newSongTitle, setNewSongTitle] = useState("");
  const [newSongDescription, setNewSongDescription] = useState("");
  const [newSongYoutubeUrl, setNewSongYoutubeUrl] = useState("");

  // Fetch member data
  const { data: bandMembers } = trpc.bandMembers.list.useQuery();

  // Fetch songs for authenticated member
  const { data: memberSongs, refetch: refetchSongs } = trpc.songs.list.useQuery(
    { bandMemberId: memberId || undefined },
    { enabled: isAuthenticated && memberId !== null }
  );

  // Authenticate with access code
  const handleAccessCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim()) {
      toast.error("Lütfen erişim kodunuzu girin");
      return;
    }

    try {
      // Verify access code with server
      // For now, use a simple client-side check
      // In production, this should be server-side validated
      if (accessCode.length < 6) {
        toast.error("Geçersiz erişim kodu");
        return;
      }
      
      // Simulate finding a member (in production, server would return this)
      const member = bandMembers?.[0];
      if (!member) {
        toast.error("Üye bulunamadı");
        return;
      }
      
      const result = { memberId: member.id, accessCode };
      
      setIsAuthenticated(true);
      setMemberId(result.memberId);
      setMemberName(member.name);
      toast.success("Başarıyla giriş yaptınız");
    } catch (error) {
      toast.error("Geçersiz erişim kodu");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAccessCode("");
    setMemberId(null);
    setMemberName("");
    toast.success("Çıkış yapıldı");
  };

  // Create song mutation
  const createSongMutation = trpc.songs.create.useMutation({
    onSuccess: () => {
      toast.success("Şarkı eklendi");
      setNewSongTitle("");
      setNewSongDescription("");
      setNewSongYoutubeUrl("");
      refetchSongs();
    },
    onError: () => {
      toast.error("Şarkı eklenirken hata oluştu");
    },
  });

  const handleAddSong = async () => {
    if (!newSongTitle.trim() || !memberId) {
      toast.error("Lütfen şarkı başlığını girin");
      return;
    }

    await createSongMutation.mutateAsync({
      bandMemberId: memberId,
      title: newSongTitle,
      description: newSongDescription || undefined,
      youtubeUrl: newSongYoutubeUrl || undefined,
    });
  };

  // Delete song mutation
  const deleteSongMutation = trpc.songs.delete.useMutation({
    onSuccess: () => {
      toast.success("Şarkı silindi");
      refetchSongs();
    },
    onError: () => {
      toast.error("Şarkı silinirken hata oluştu");
    },
  });

  const handleDeleteSong = async (songId: number) => {
    if (confirm("Şarkıyı silmek istediğinize emin misiniz?")) {
      await deleteSongMutation.mutateAsync({ id: songId });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-800 border-slate-700 p-8">
          <div className="flex items-center justify-center mb-6">
            <Music className="w-8 h-8 text-amber-400 mr-2" />
            <h1 className="text-2xl font-bold text-white">Üye Paneli</h1>
          </div>

          <form onSubmit={handleAccessCodeSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-white mb-2 block">Erişim Kodu</label>
              <Input
                type="password"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="Erişim kodunuzu girin"
                className="bg-slate-700 border-slate-600 text-white placeholder-gray-500"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-amber-400 hover:bg-amber-500 text-black font-bold"
            >
              Giriş Yap
            </Button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-4">
            Erişim kodunuzu almak için grup yöneticisine başvurun.
          </p>
        </Card>
      </div>
    );
  }

  // Calculate stats
  const totalLikes = memberSongs?.reduce((sum, song) => sum + (song.likesCount || 0), 0) || 0;
  const totalComments = memberSongs?.reduce((sum, song) => sum + (song.commentsCount || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 border-b border-slate-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl font-bold text-white">Müzik Grubu - {memberName} Paneli</h1>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="text-gray-400 hover:text-white hover:bg-slate-700"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Çıkış
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Stats */}
          <Card className="bg-slate-800 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Şarkılarım</p>
                <p className="text-3xl font-bold text-white">{memberSongs?.length || 0}</p>
              </div>
              <Music className="w-10 h-10 text-amber-400/20" />
            </div>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Toplam Beğeni</p>
                <p className="text-3xl font-bold text-white">{totalLikes}</p>
              </div>
              <Heart className="w-10 h-10 text-red-400/20" />
            </div>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Toplam Yorum</p>
                <p className="text-3xl font-bold text-white">{totalComments}</p>
              </div>
              <MessageCircle className="w-10 h-10 text-blue-400/20" />
            </div>
          </Card>
        </div>

        {/* Calendar Section */}
        <div className="mb-8">
          <MemberCalendar />
        </div>

        {/* Songs Section */}
        <Card className="bg-slate-800 border-slate-700 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Şarkılarım</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-amber-400 hover:bg-amber-500 text-black font-bold">
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Şarkı
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Yeni Şarkı Ekle</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-white mb-2 block">Başlık</label>
                    <Input
                      value={newSongTitle}
                      onChange={(e) => setNewSongTitle(e.target.value)}
                      placeholder="Şarkı başlığı"
                      className="bg-slate-700 border-slate-600 text-white placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-white mb-2 block">Açıklama</label>
                    <Textarea
                      value={newSongDescription}
                      onChange={(e) => setNewSongDescription(e.target.value)}
                      placeholder="Şarkı açıklaması"
                      className="bg-slate-700 border-slate-600 text-white placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-white mb-2 block">YouTube URL</label>
                    <Input
                      value={newSongYoutubeUrl}
                      onChange={(e) => setNewSongYoutubeUrl(e.target.value)}
                      placeholder="https://youtube.com/..."
                      className="bg-slate-700 border-slate-600 text-white placeholder-gray-500"
                    />
                  </div>
                  <Button
                    onClick={handleAddSong}
                    disabled={createSongMutation.isPending}
                    className="w-full bg-amber-400 hover:bg-amber-500 text-black font-bold"
                  >
                    {createSongMutation.isPending ? "Ekleniyor..." : "Ekle"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {memberSongs && memberSongs.length > 0 ? (
              memberSongs.map((song) => (
                <div key={song.id} className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 hover:border-amber-400/50 transition">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white">{song.title}</h3>
                      {song.description && <p className="text-sm text-gray-400">{song.description}</p>}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="text-blue-400 hover:bg-blue-500/20">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteSong(song.id)}
                        disabled={deleteSongMutation.isPending}
                        className="text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2 text-red-400">
                      <Heart className="w-4 h-4" />
                      <span>{song.likesCount || 0} beğeni</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-400">
                      <MessageCircle className="w-4 h-4" />
                      <span>{song.commentsCount || 0} yorum</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Music className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Henüz şarkı eklemediniz</p>
              </div>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}
