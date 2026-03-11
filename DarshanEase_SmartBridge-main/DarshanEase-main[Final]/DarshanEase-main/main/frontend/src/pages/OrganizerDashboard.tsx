import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ChevronDown, ChevronUp, Trash2, Loader2, Building2, Clock, MapPin, Image } from "lucide-react";
import { PageWrapper } from "@/components/animations";
import { useAuth } from "@/context/AuthContext";
import { addTemple, addDarshan, getMyTemples, deleteDarshan, getOrganizerBookings } from "@/services/organizerService";
import { getDarshansByTemple } from "@/services/darshanService";
import { Search, Calendar, User as UserIcon, IndianRupee, FileText } from "lucide-react";

const OrganizerDashboard = () => {
  const { user } = useAuth();
  const [temples, setTemples] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedTemple, setExpandedTemple] = useState<string | null>(null);
  const [darshansMap, setDarshansMap] = useState<Record<string, any[]>>({});
  const [showAddTemple, setShowAddTemple] = useState(false);
  const [addDarshanFor, setAddDarshanFor] = useState<string | null>(null);
  const [editingTempleId, setEditingTempleId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState<"temples" | "bookings">("temples");
  const [bookings, setBookings] = useState<any[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [templeForm, setTempleForm] = useState({
    templeName: "", description: "", location: "", openTime: "", closeTime: "", image: "", liveStreamUrl: ""
  });
  const [darshanForm, setDarshanForm] = useState({
    darshanName: "", description: "", openTime: "", closeTime: "", normalPrice: "", vipPrice: "", capacity: "100"
  });

  useEffect(() => {
    fetchTemples();
    if (activeTab === "bookings") {
      fetchBookings();
    }
  }, [activeTab]);

  const fetchTemples = async () => {
    try {
      const res = await getMyTemples();
      const myTemples = res.data.filter((t: any) => t.organizerId?._id === user?._id || t.organizerId === user?._id);
      setTemples(myTemples);
    } catch { setError("Failed to load temples."); }
    finally { setLoading(false); }
  };

  const fetchBookings = async () => {
    setBookingsLoading(true);
    try {
      const res = await getOrganizerBookings();
      setBookings(res.data);
    } catch {
      setError("Failed to load bookings.");
    } finally {
      setBookingsLoading(false);
    }
  };

  const loadDarshans = async (templeId: string) => {
    if (darshansMap[templeId]) return;
    try {
      const res = await getDarshansByTemple(templeId);
      setDarshansMap((prev) => ({ ...prev, [templeId]: res.data }));
    } catch {}
  };

  const toggleTemple = (id: string) => {
    if (expandedTemple === id) {
      setExpandedTemple(null);
    } else {
      setExpandedTemple(id);
      loadDarshans(id);
    }
  };

  const handleAddTemple = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setError("");
    try {
      if (editingTempleId) {
        const { updateTemple } = await import("@/services/organizerService");
        await updateTemple(editingTempleId, templeForm);
        setSuccess("Temple updated successfully! ✨");
      } else {
        await addTemple(templeForm);
        setSuccess("Temple added successfully! 🎉");
      }
      setTempleForm({ templeName: "", description: "", location: "", openTime: "", closeTime: "", image: "", liveStreamUrl: "" });
      setShowAddTemple(false);
      setEditingTempleId(null);
      fetchTemples();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save temple.");
    } finally { setSubmitting(false); }
  };

  const handleEditClick = (temple: any) => {
    setTempleForm({
      templeName: temple.templeName,
      description: temple.description,
      location: temple.location,
      openTime: temple.openTime,
      closeTime: temple.closeTime,
      image: temple.image || "",
      liveStreamUrl: temple.liveStreamUrl || "",
    });
    setEditingTempleId(temple._id);
    setShowAddTemple(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddDarshan = async (e: React.FormEvent, templeId: string) => {
    e.preventDefault();
    setSubmitting(true); setError("");
    try {
      await addDarshan({
        templeId,
        ...darshanForm,
        normalPrice: Number(darshanForm.normalPrice),
        vipPrice: Number(darshanForm.vipPrice),
        capacity: Number(darshanForm.capacity),
        availableSeats: Number(darshanForm.capacity), // Start with all seats available
      });
      setSuccess("Darshan slot added! 🙏");
      setDarshansMap((prev) => ({ ...prev, [templeId]: [] }));
      loadDarshans(templeId);
      setAddDarshanFor(null);
      setDarshanForm({ darshanName: "", description: "", openTime: "", closeTime: "", normalPrice: "", vipPrice: "", capacity: "100" });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add darshan.");
    } finally { setSubmitting(false); }
  };

  const handleDeleteDarshan = async (darshanId: string, templeId: string) => {
    try {
      await deleteDarshan(darshanId);
      setDarshansMap((prev) => ({ ...prev, [templeId]: prev[templeId].filter((d) => d._id !== darshanId) }));
    } catch {}
  };

  const inputClass = "w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <PageWrapper>
      <div className="pt-24 pb-16 px-4 min-h-screen">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Organizer <span className="text-gradient-saffron">Dashboard</span></h1>
              <p className="text-muted-foreground mt-1 text-sm">Manage your temples and track incoming bookings 🙏</p>
            </div>
            
            <div className="flex bg-muted p-1 rounded-xl shrink-0">
              <button 
                onClick={() => setActiveTab("temples")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "temples" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                My Temples
              </button>
              <button 
                onClick={() => setActiveTab("bookings")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "bookings" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                Recent Bookings
              </button>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {activeTab === "temples" ? (
              <motion.div
                key="temples"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    Manage Temples
                  </h2>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setEditingTempleId(null);
                      setTempleForm({ templeName: "", description: "", location: "", openTime: "", closeTime: "", image: "", liveStreamUrl: "" });
                      setShowAddTemple(!showAddTemple);
                    }}
                    className="flex items-center gap-2 px-4 py-2 gradient-saffron text-primary-foreground rounded-lg text-sm font-semibold shadow-saffron">
                    <Plus className="w-4 h-4" /> Add Temple
                  </motion.button>
                </div>

          {success && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-green-100 text-green-700 rounded-lg px-4 py-3 mb-4 text-sm font-medium">
              {success}
            </motion.div>
          )}
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-100 text-red-600 rounded-lg px-4 py-3 mb-4 text-sm">
              {error}
            </motion.div>
          )}

          {/* Add Temple Form */}
          <AnimatePresence>
            {showAddTemple && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="bg-card rounded-xl shadow-card p-6 mb-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" /> 
                  {editingTempleId ? "Edit Temple" : "Add New Temple"}
                </h2>
                <form onSubmit={handleAddTemple} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Temple Name *</label>
                    <input required placeholder="e.g. Somnath Temple" value={templeForm.templeName}
                      onChange={(e) => setTempleForm({ ...templeForm, templeName: e.target.value })} className={inputClass} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Description *</label>
                    <textarea required rows={3} placeholder="Describe the temple..."
                      value={templeForm.description}
                      onChange={(e) => setTempleForm({ ...templeForm, description: e.target.value })}
                      className={inputClass + " resize-none"} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1"><MapPin className="inline w-3.5 h-3.5 mr-1" />Location *</label>
                    <input required placeholder="City, State" value={templeForm.location}
                      onChange={(e) => setTempleForm({ ...templeForm, location: e.target.value })} className={inputClass} />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1"><Image className="w-3.5 h-3.5" />Image URL</span>
                      {templeForm.image && (
                        <button 
                          type="button" 
                          onClick={() => window.open(templeForm.image, '_blank')}
                          className="text-[10px] text-primary hover:underline font-semibold"
                        >
                          Test Link ↗
                        </button>
                      )}
                    </label>
                    <input 
                      placeholder="https://..." 
                      value={templeForm.image}
                      onChange={(e) => setTempleForm({ ...templeForm, image: e.target.value })} 
                      className={inputClass + (templeForm.image.includes('share.google') ? " border-red-300 bg-red-50" : "")} 
                    />
                    {templeForm.image.includes('share.google') && (
                      <p className="text-[10px] text-red-500 mt-1 font-medium">⚠️ This looks like a share link. Please use a direct image link.</p>
                    )}
                    <p className="text-[10px] text-muted-foreground mt-1">
                      <strong>Tip:</strong> RIGHT-CLICK an image and select <strong>"Copy Image Address"</strong>. 
                      <button type="button" onClick={() => alert("Please do NOT use 'Copy Link Address'.\n\n1. Right-click the image\n2. Select 'Copy IMAGE Address'\n3. Paste it here.\n\nA correct link usually ends in .jpg or .png")} className="ml-1 text-primary underline">Learn more</button>
                    </p>
                  </div>
                  <div className="md:col-span-1">
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-medium">Image Preview</label>
                      <button 
                        type="button" 
                        onClick={() => alert("1. Search image on Google\n2. Click on the image\n3. RIGHT-CLICK the actual image\n4. Select 'Copy image address'\n5. Paste that link here.")}
                        className="text-[10px] bg-primary/10 text-primary px-1.5 rounded"
                      >
                        Help?
                      </button>
                    </div>
                    <div className="h-[42px] border border-border rounded-lg overflow-hidden bg-muted flex items-center justify-center relative">
                      {templeForm.image ? (
                        <>
                          <img 
                            src={templeForm.image} 
                            alt="Preview" 
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const parent = e.currentTarget.parentElement;
                              if (parent && !parent.querySelector('.error-msg')) {
                                const placeholder = document.createElement('div');
                                placeholder.className = "error-msg text-[10px] text-red-500 font-medium px-2 text-center";
                                placeholder.innerText = "Broken/Invalid Link";
                                parent.appendChild(placeholder);
                              }
                            }}
                            onLoad={(e) => {
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                const errorMsg = parent.querySelector('.error-msg');
                                if (errorMsg) errorMsg.remove();
                                e.currentTarget.style.display = 'block';
                              }
                            }}
                          />
                        </>
                      ) : (
                        <span className="text-[10px] text-muted-foreground italic">No image provided</span>
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Live Stream URL (YouTube) <span className="text-xs text-muted-foreground font-normal">(Optional)</span></label>
                    <input placeholder="https://youtube.com/watch?v=..." value={templeForm.liveStreamUrl}
                      onChange={(e) => setTempleForm({ ...templeForm, liveStreamUrl: e.target.value })} className={inputClass} />
                    <p className="text-[10px] text-muted-foreground mt-1">
                      <strong>Tip:</strong> Paste the link of your YouTube Live stream or a video.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1"><Clock className="inline w-3.5 h-3.5 mr-1" />Opening Time *</label>
                    <input required type="time" value={templeForm.openTime}
                      onChange={(e) => setTempleForm({ ...templeForm, openTime: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1"><Clock className="inline w-3.5 h-3.5 mr-1" />Closing Time *</label>
                    <input required type="time" value={templeForm.closeTime}
                      onChange={(e) => setTempleForm({ ...templeForm, closeTime: e.target.value })} className={inputClass} />
                  </div>
                  <div className="md:col-span-2 flex gap-3 justify-end">
                    <button type="button" onClick={() => { setShowAddTemple(false); setEditingTempleId(null); }}
                      className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground">
                      Cancel
                    </button>
                    <motion.button type="submit" disabled={submitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="px-6 py-2 gradient-saffron text-primary-foreground rounded-lg text-sm font-semibold shadow-saffron disabled:opacity-60">
                      {submitting ? "Saving..." : (editingTempleId ? "Update Temple" : "Add Temple")}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Temple List */}
          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : temples.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-xl shadow-card">
              <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No temples added yet. Click "Add Temple" to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {temples.map((temple, i) => (
                <motion.div key={temple._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }} className="bg-card rounded-xl shadow-card overflow-hidden">
                  {/* Temple Header */}
                  <button onClick={() => toggleTemple(temple._id)} className="w-full flex items-center justify-between p-5 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4 text-left">
                      {temple.image ? (
                        <img 
                          src={temple.image} 
                          alt={temple.templeName} 
                          className="w-14 h-14 rounded-lg object-cover" 
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=200";
                            e.currentTarget.onerror = null;
                          }}
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg gradient-saffron flex items-center justify-center">
                          <Building2 className="w-7 h-7 text-primary-foreground" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg">{temple.templeName}</h3>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleEditClick(temple); }}
                            className="text-xs bg-muted hover:bg-muted-foreground/10 px-2 py-0.5 rounded text-muted-foreground transition-colors"
                          >
                            Edit
                          </button>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{temple.location}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          <Clock className="inline w-3 h-3 mr-1" />{temple.openTime} – {temple.closeTime}
                        </p>
                      </div>
                    </div>
                    {expandedTemple === temple._id ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                  </button>

                  {/* Darshan Slots */}
                  <AnimatePresence>
                    {expandedTemple === temple._id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} className="border-t border-border">
                        <div className="p-5">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Darshan Slots</h4>
                            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setAddDarshanFor(addDarshanFor === temple._id ? null : temple._id)}
                              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold gradient-saffron text-primary-foreground rounded-lg shadow-saffron">
                              <Plus className="w-3.5 h-3.5" /> Add Darshan
                            </motion.button>
                          </div>

                          {/* Add Darshan Form */}
                          <AnimatePresence>
                            {addDarshanFor === temple._id && (
                              <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                onSubmit={(e) => handleAddDarshan(e, temple._id)}
                                className="bg-muted rounded-xl p-4 mb-4 grid grid-cols-2 gap-3">
                                <div className="col-span-2">
                                  <label className="block text-xs font-medium mb-1">Darshan Name *</label>
                                  <input required placeholder="e.g. Morning Darshan" value={darshanForm.darshanName}
                                    onChange={(e) => setDarshanForm({ ...darshanForm, darshanName: e.target.value })} className={inputClass} />
                                </div>
                                <div className="col-span-2">
                                  <label className="block text-xs font-medium mb-1">Description</label>
                                  <input placeholder="Brief description..." value={darshanForm.description}
                                    onChange={(e) => setDarshanForm({ ...darshanForm, description: e.target.value })} className={inputClass} />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium mb-1">Open Time *</label>
                                  <input required type="time" value={darshanForm.openTime}
                                    onChange={(e) => setDarshanForm({ ...darshanForm, openTime: e.target.value })} className={inputClass} />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium mb-1">Close Time *</label>
                                  <input required type="time" value={darshanForm.closeTime}
                                    onChange={(e) => setDarshanForm({ ...darshanForm, closeTime: e.target.value })} className={inputClass} />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium mb-1">Normal Price (₹) *</label>
                                  <input required type="number" min="0" placeholder="0" value={darshanForm.normalPrice}
                                    onChange={(e) => setDarshanForm({ ...darshanForm, normalPrice: e.target.value })} className={inputClass} />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium mb-1">VIP Price (₹) *</label>
                                  <input required type="number" min="0" placeholder="0" value={darshanForm.vipPrice}
                                    onChange={(e) => setDarshanForm({ ...darshanForm, vipPrice: e.target.value })} className={inputClass} />
                                </div>
                                <div className="col-span-2">
                                  <label className="block text-xs font-medium mb-1">Slot Capacity *</label>
                                  <input required type="number" min="1" placeholder="100" value={darshanForm.capacity}
                                    onChange={(e) => setDarshanForm({ ...darshanForm, capacity: e.target.value })} className={inputClass} />
                                </div>
                                <div className="col-span-2 flex gap-2 justify-end">
                                  <button type="button" onClick={() => setAddDarshanFor(null)}
                                    className="px-3 py-1.5 text-xs border border-border rounded-lg text-muted-foreground">Cancel</button>
                                  <button type="submit" disabled={submitting}
                                    className="px-4 py-1.5 text-xs gradient-saffron text-primary-foreground rounded-lg font-semibold disabled:opacity-60">
                                    {submitting ? "Saving..." : "Save Darshan"}
                                  </button>
                                </div>
                              </motion.form>
                            )}
                          </AnimatePresence>

                          {/* Darshan Cards */}
                          {darshansMap[temple._id] ? (
                            darshansMap[temple._id].length === 0 ? (
                              <p className="text-sm text-muted-foreground text-center py-6">No darshan slots yet. Add one above.</p>
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {darshansMap[temple._id].map((d) => (
                                  <motion.div key={d._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="bg-background border border-border rounded-lg p-4 relative">
                                    <button onClick={() => handleDeleteDarshan(d._id, temple._id)}
                                      className="absolute top-3 right-3 text-muted-foreground hover:text-red-500 transition-colors">
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                    <h5 className="font-semibold mb-1">{d.darshanName}</h5>
                                    {d.description && <p className="text-xs text-muted-foreground mb-2">{d.description}</p>}
                                    <p className="text-xs text-muted-foreground mb-2">
                                      <Clock className="inline w-3 h-3 mr-1" />{d.openTime} – {d.closeTime}
                                    </p>
                                    <p className="text-xs text-muted-foreground mb-3 font-medium bg-secondary/20 inline-block px-2 py-0.5 rounded text-secondary-foreground">
                                      {d.availableSeats} / {d.capacity} Seats Available
                                    </p>
                                    <div className="flex gap-4 text-sm">
                                      <div><span className="text-muted-foreground text-xs">Normal</span><br /><strong>₹{d.normalPrice}</strong></div>
                                      <div><span className="text-muted-foreground text-xs">VIP</span><br /><strong className="text-primary">₹{d.vipPrice}</strong></div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            )
                          ) : (
                            <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      ) : (
            <motion.div
              key="bookings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Visitor Bookings
                </h2>
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    placeholder="Search by visitor name or temple..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-card border border-border rounded-xl text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                  />
                </div>
              </div>

              {bookingsLoading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-card rounded-2xl border border-border/50">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground text-sm font-medium">Fetching booking records...</p>
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-20 bg-card rounded-2xl border border-border/50 shadow-sm">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-muted-foreground/60" />
                  </div>
                  <h3 className="text-lg font-bold mb-1">No bookings found</h3>
                  <p className="text-muted-foreground text-sm max-w-xs mx-auto">Once visitors book darshan at your temples, their information will appear here.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {bookings
                    .filter(b => 
                      b.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      b.templeId?.templeName?.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((booking, idx) => (
                      <motion.div
                        key={booking._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group"
                      >
                        <div className="flex flex-col md:flex-row gap-6 md:items-center">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 bg-muted px-2 py-0.5 rounded">
                                ID: {booking._id.slice(-8)}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                booking.status === "CONFIRMED" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                              }`}>
                                {booking.status}
                              </span>
                            </div>
                            
                            <div>
                              <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                                {booking.userId?.name || "Anonymous Visitor"}
                              </h3>
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                <Building2 className="w-3 h-3" /> {booking.templeId?.templeName}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2">
                              <div className="flex items-center gap-2 text-sm">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                  <Calendar className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Date & Time</p>
                                  <p className="font-semibold text-xs whitespace-nowrap">{booking.bookingDate || "N/A"} • {booking.darshanTime || "N/A"}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                  <UserIcon className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Tickets</p>
                                  <p className="font-semibold text-xs">{booking.tickets} × {booking.ticketType}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="md:w-px md:h-16 bg-border/50 hidden md:block" />

                          <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center md:min-w-[120px] gap-1 bg-muted/30 md:bg-transparent p-3 md:p-0 rounded-xl">
                            <p className="text-[10px] text-muted-foreground uppercase font-bold md:mb-1">Amount Paid</p>
                            <div className="flex items-center gap-1 text-primary">
                              <IndianRupee className="w-5 h-5" />
                              <span className="text-2xl font-black tracking-tighter">{booking.price}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              )}
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </div>
    </PageWrapper>
  );
};

export default OrganizerDashboard;
