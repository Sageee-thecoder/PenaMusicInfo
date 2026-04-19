import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Lock, LogOut, Plus, Edit2, Trash2, Check, X } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import EventManagement from "@/components/EventManagement";

const ADMIN_PASSWORD = "admin123"; // This should be changed to a secure password

export default function AdminDashboard() {
  const { user, logout, loading } = useAuth();
  const [, navigate] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPasswordDialog, setShowPasswordDialog] = useState(true);

  const { data: applications, refetch: refetchApplications } = trpc.applications.list.useQuery(
    { status: undefined },
    { enabled: isAuthenticated }
  );
  const { data: bandMembers, refetch: refetchBandMembers } = trpc.bandMembers.list.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const createApplicationMutation = trpc.applications.create.useMutation();
  const updateApplicationMutation = trpc.applications.update.useMutation();
  const createBandMemberMutation = trpc.bandMembers.create.useMutation();
  const updateBandMemberMutation = trpc.bandMembers.update.useMutation();
  const deleteBandMemberMutation = trpc.bandMembers.delete.useMutation();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const handlePasswordSubmit = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setShowPasswordDialog(false);
      toast.success("Başarıyla giriş yaptınız");
    } else {
      toast.error("Yanlış parola");
      setPassword("");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Yükleniyor...</div>;

  if (!user) return null;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-800 border-slate-700">
          <div className="p-8">
            <div className="flex items-center justify-center mb-6">
              <Lock className="w-8 h-8 text-amber-400" />
            </div>
            <h1 className="text-2xl font-bold text-white text-center mb-6">Yönetim Paneli</h1>
            <p className="text-gray-400 text-center mb-6">Bu alanı kullanmak için parolayı girin</p>
            
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Parola"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handlePasswordSubmit()}
                className="bg-slate-700 border-slate-600 text-white placeholder-gray-500"
              />
              <Button
                onClick={handlePasswordSubmit}
                className="w-full bg-amber-400 hover:bg-amber-500 text-black font-bold"
              >
                Giriş Yap
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Yönetim Paneli</h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-red-500 text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Çıkış Yap
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="applications" className="text-white">Başvurular</TabsTrigger>
            <TabsTrigger value="members" className="text-white">Üyeler</TabsTrigger>
            <TabsTrigger value="events" className="text-white">Etkinlikler</TabsTrigger>
          </TabsList>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Başvuru Yönetimi</h2>
                
                <div className="space-y-4">
                  {applications?.map((app) => (
                    <div key={app.id} className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 hover:border-amber-400/50 transition">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white">{app.name}</h3>
                          <p className="text-sm text-gray-400">{app.email}</p>
                          <p className="text-sm text-amber-400 mt-1">Rol: {app.appliedRole}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          app.status === "accepted" ? "bg-green-500/20 text-green-400" :
                          app.status === "rejected" ? "bg-red-500/20 text-red-400" :
                          app.status === "reviewed" ? "bg-blue-500/20 text-blue-400" :
                          "bg-yellow-500/20 text-yellow-400"
                        }`}>
                          {app.status === "pending" ? "Beklemede" :
                           app.status === "reviewed" ? "İncelendi" :
                           app.status === "accepted" ? "Kabul Edildi" :
                           "Reddedildi"}
                        </span>
                      </div>

                      {app.message && (
                        <div className="mb-3 p-2 bg-slate-600/50 rounded text-sm text-gray-300">
                          <p className="font-semibold mb-1">Mesaj:</p>
                          <p>{app.message}</p>
                        </div>
                      )}

                      {app.notes && (
                        <div className="mb-3 p-2 bg-slate-600/50 rounded text-sm text-gray-300">
                          <p className="font-semibold mb-1">Notlar:</p>
                          <p>{app.notes}</p>
                        </div>
                      )}

                      <div className="flex gap-2 flex-wrap">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="border-slate-500 text-gray-300">
                              <Edit2 className="w-4 h-4 mr-1" />
                              Düzenle
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-slate-800 border-slate-700">
                            <DialogHeader>
                              <DialogTitle className="text-white">Başvuruyu Düzenle</DialogTitle>
                            </DialogHeader>
                            <ApplicationEditForm
                              application={app}
                              onSubmit={async (data) => {
                                await updateApplicationMutation.mutateAsync(data);
                                await refetchApplications();
                                toast.success("Başvuru güncellendi");
                              }}
                            />
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Üye Yönetimi</h2>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-amber-400 hover:bg-amber-500 text-black font-bold">
                        <Plus className="w-4 h-4 mr-2" />
                        Yeni Üye
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-800 border-slate-700">
                      <DialogHeader>
                        <DialogTitle className="text-white">Yeni Üye Ekle</DialogTitle>
                      </DialogHeader>
                      <BandMemberForm
                        onSubmit={async (data) => {
                          await createBandMemberMutation.mutateAsync(data);
                          await refetchBandMembers();
                          toast.success("Üye eklendi");
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bandMembers?.map((member) => (
                    <div key={member.id} className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 hover:border-amber-400/50 transition">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white">{member.name}</h3>
                          <p className="text-sm text-amber-400">{member.role}</p>
                        </div>
                        <div className="flex gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-blue-400 hover:bg-blue-500/20"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-slate-800 border-slate-700">
                              <DialogHeader>
                                <DialogTitle className="text-white">Üyeyi Düzenle</DialogTitle>
                              </DialogHeader>
                              <BandMemberEditForm
                                member={member}
                                onSubmit={async (data) => {
                                  await updateBandMemberMutation.mutateAsync(data);
                                  await refetchBandMembers();
                                  toast.success("Üye güncellendi");
                                }}
                              />
                            </DialogContent>
                          </Dialog>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={async () => {
                              await deleteBandMemberMutation.mutateAsync({ id: member.id });
                              await refetchBandMembers();
                              toast.success("Üye silindi");
                            }}
                            className="text-red-400 hover:bg-red-500/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      {member.bio && <p className="text-sm text-gray-400">{member.bio}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ApplicationEditForm({ application, onSubmit }: { application: any; onSubmit: (data: any) => Promise<void> }) {
  const [status, setStatus] = useState(application.status);
  const [notes, setNotes] = useState(application.notes || "");

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-semibold text-white mb-2 block">Durum</label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-700 border-slate-600">
            <SelectItem value="pending" className="text-white">Beklemede</SelectItem>
            <SelectItem value="reviewed" className="text-white">İncelendi</SelectItem>
            <SelectItem value="accepted" className="text-white">Kabul Edildi</SelectItem>
            <SelectItem value="rejected" className="text-white">Reddedildi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-semibold text-white mb-2 block">Notlar</label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notlar ekleyin..."
          className="bg-slate-700 border-slate-600 text-white placeholder-gray-500"
        />
      </div>

      <Button
        onClick={() => onSubmit({ id: application.id, status, notes: notes || undefined })}
        className="w-full bg-amber-400 hover:bg-amber-500 text-black font-bold"
      >
        Kaydet
      </Button>
    </div>
  );
}

function BandMemberForm({ onSubmit }: { onSubmit: (data: any) => Promise<void> }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("vokal");
  const [bio, setBio] = useState("");

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-semibold text-white mb-2 block">Ad</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Üye adı"
          className="bg-slate-700 border-slate-600 text-white placeholder-gray-500"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-white mb-2 block">Rol</label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-700 border-slate-600">
            <SelectItem value="vokal" className="text-white">Vokal</SelectItem>
            <SelectItem value="gitarist" className="text-white">Gitarist</SelectItem>
            <SelectItem value="baterist" className="text-white">Baterist</SelectItem>
            <SelectItem value="kemancı" className="text-white">Kemancı</SelectItem>
            <SelectItem value="piyanist" className="text-white">Piyanist</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-semibold text-white mb-2 block">Biyografi</label>
        <Textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Üye hakkında bilgi"
          className="bg-slate-700 border-slate-600 text-white placeholder-gray-500"
        />
      </div>

      <Button
        onClick={() => onSubmit({ name, role, bio: bio || undefined })}
        className="w-full bg-amber-400 hover:bg-amber-500 text-black font-bold"
      >
        Ekle
      </Button>
    </div>
  );
}


function BandMemberEditForm({ member, onSubmit }: { member: any; onSubmit: (data: any) => Promise<void> }) {
  const [name, setName] = useState(member.name);
  const [role, setRole] = useState(member.role);
  const [bio, setBio] = useState(member.bio || "");

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-semibold text-white mb-2 block">Ad</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Üye adı"
          className="bg-slate-700 border-slate-600 text-white placeholder-gray-500"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-white mb-2 block">Rol</label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-700 border-slate-600">
            <SelectItem value="vokal" className="text-white">Vokal</SelectItem>
            <SelectItem value="gitarist" className="text-white">Gitarist</SelectItem>
            <SelectItem value="baterist" className="text-white">Baterist</SelectItem>
            <SelectItem value="kemancı" className="text-white">Kemancı</SelectItem>
            <SelectItem value="piyanist" className="text-white">Piyanist</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-semibold text-white mb-2 block">Biyografi</label>
        <Textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Üye hakkında bilgi"
          className="bg-slate-700 border-slate-600 text-white placeholder-gray-500"
        />
      </div>

      <Button
        onClick={() => onSubmit({ id: member.id, name, role, bio: bio || undefined })}
        className="w-full bg-amber-400 hover:bg-amber-500 text-black font-bold"
      >
        Kaydet
      </Button>
    </div>
  );
}

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <EventManagement />
          </TabsContent>
