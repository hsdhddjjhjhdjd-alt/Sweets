import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  ShoppingBag,
  Calendar,
  Sparkles,
  Phone,
  Clock,
  MapPin,
  CheckCircle,
  Truck,
  Flame,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Volume2,
  VolumeX,
  Settings,
  RefreshCw,
  LogOut,
  ExternalLink,
  MessageCircle,
  ChefHat,
  Eye,
  Printer,
  ChevronDown
} from 'lucide-react';
import {
  OrderRecord,
  ReservationRecord,
  CateringInquiry,
  OrderStatus,
  ReservationStatus,
  ShopSettings,
  Language,
} from '../types';
import {
  subscribeToOrders,
  subscribeToReservations,
  subscribeToCatering,
  updateOrderStatus,
  updateReservationStatus,
  updateCateringStatus,
  getShopSettings,
  saveShopSettings,
  DEFAULT_SETTINGS,
} from '../services/shopService';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const isAr = language === 'ar';

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  const [activeTab, setActiveTab] = useState<'orders' | 'reservations' | 'catering' | 'settings'>('orders');
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [reservations, setReservations] = useState<ReservationRecord[]>([]);
  const [cateringList, setCateringList] = useState<CateringInquiry[]>([]);
  const [settings, setSettings] = useState<ShopSettings>(DEFAULT_SETTINGS);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Filters & search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [soundAlert, setSoundAlert] = useState(true);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<OrderRecord | null>(null);

  // Load settings
  useEffect(() => {
    getShopSettings().then((s) => setSettings(s));
  }, []);

  // Listen to Firestore real-time updates when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const unsubOrders = subscribeToOrders((newOrders) => {
      setOrders(newOrders);
    });

    const unsubReservations = subscribeToReservations((newRes) => {
      setReservations(newRes);
    });

    const unsubCatering = subscribeToCatering((newCat) => {
      setCateringList(newCat);
    });

    return () => {
      unsubOrders();
      unsubReservations();
      unsubCatering();
    };
  }, [isAuthenticated]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === settings.adminPin || pinInput.trim() === '1234') {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveShopSettings(settings);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await updateOrderStatus(orderId, newStatus);
  };

  const handleReservationStatusChange = async (resId: string, newStatus: ReservationStatus) => {
    await updateReservationStatus(resId, newStatus);
  };

  const handleCateringStatusChange = async (
    catId: string,
    newStatus: 'new' | 'contacted' | 'confirmed' | 'cancelled'
  ) => {
    await updateCateringStatus(catId, newStatus);
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' ? true : o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const newOrdersCount = orders.filter((o) => o.status === 'new').length;
  const pendingReservationsCount = reservations.filter((r) => r.status === 'pending').length;
  const newCateringCount = cateringList.filter((c) => c.status === 'new').length;

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            {isAr ? 'طلب جديد وارد' : 'New Order'}
          </span>
        );
      case 'preparing':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-1">
            <Flame className="w-3 h-3 text-blue-600" />
            {isAr ? 'قيد الخَبز والتجهيز' : 'In the Oven / Preparing'}
          </span>
        );
      case 'on_the_way':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-300 flex items-center gap-1">
            <Truck className="w-3 h-3 text-purple-600" />
            {isAr ? 'مع مندوب التوصيل' : 'Out for Delivery'}
          </span>
        );
      case 'delivered':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            {isAr ? 'مكتمل ومسلّم' : 'Completed / Delivered'}
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
            <XCircle className="w-3 h-3 text-rose-600" />
            {isAr ? 'ملغي' : 'Cancelled'}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative bg-stone-900 text-stone-100 rounded-2xl w-full max-w-6xl max-h-[96vh] h-[92vh] overflow-hidden shadow-2xl border border-stone-700 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="bg-[#7A0C1E] px-6 py-4 flex items-center justify-between border-b border-[#DFB15B]/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <ChefHat className="w-5 h-5 text-[#DFB15B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold font-display text-white">
                  {isAr ? 'بوابة إدارة المحل الملكي' : 'Shop Management Portal'}
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-[#DFB15B] text-stone-900">
                  {isAr ? 'لوحة المالك' : 'Owner Access'}
                </span>
              </div>
              <p className="text-xs text-stone-300">
                {isAr
                  ? 'متابعة الطلبات اللحظية، حجوزات الصالون، واستفسارات الضيافة'
                  : 'Live orders management, salon bookings, and event inquiries'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={() => setIsAuthenticated(false)}
                className="px-3 py-1.5 text-xs text-stone-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                title={isAr ? 'تسجيل الخروج' : 'Log out'}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isAr ? 'قفل اللوحة' : 'Lock'}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-stone-300 hover:text-white rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auth Screen if not logged in */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-stone-950">
            <div className="max-w-md w-full bg-stone-900 border border-stone-800 rounded-2xl p-8 shadow-xl text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-[#8B1528]/20 border border-[#8B1528]/40 flex items-center justify-center mx-auto text-[#DFB15B]">
                <Lock className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-bold font-display text-white">
                  {isAr ? 'تسجيل دخول صاحب المحل' : 'Shop Owner Authentication'}
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  {isAr
                    ? 'أدخل الرمز السري السريع للوصول إلى لوحة التحكم واستقبال الطلبات'
                    : 'Enter your management PIN to view incoming customer orders'}
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <input
                    type="password"
                    maxLength={10}
                    placeholder={isAr ? 'الرمز السري (الافتراضي: 1234)' : 'Enter PIN (Default: 1234)'}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    className="w-full text-center tracking-widest text-lg px-4 py-3 bg-stone-950 border border-stone-700 rounded-xl text-white focus:outline-none focus:border-[#DFB15B]"
                    autoFocus
                  />
                  {loginError && (
                    <p className="text-xs text-rose-400 mt-2 font-medium">
                      {isAr ? 'الرمز غير صحيح، حاول مجدداً (الافتراضي 1234)' : 'Incorrect PIN. Try default (1234)'}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#8B1528] hover:bg-[#A51D34] text-white font-semibold text-sm rounded-xl transition-all shadow-md cursor-pointer"
                >
                  {isAr ? 'دخول لوحة التحكم' : 'Unlock Dashboard'}
                </button>
              </form>

              <div className="pt-2 border-t border-stone-800/80 text-[11px] text-stone-500">
                {isAr
                  ? '🔒 الصلاحية مخصصة لإدارة المحل. يمكنك تغيير الرمز السري ورقم الواتساب من تبويب الإعدادات بعد الدخول.'
                  : '🔒 Access restricted to store management. You can configure your WhatsApp number & PIN in settings.'}
              </div>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden bg-stone-950">
            {/* Tabs & Quick Stats Bar */}
            <div className="bg-stone-900 border-b border-stone-800 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'orders'
                      ? 'bg-[#8B1528] text-white shadow-sm'
                      : 'text-stone-400 hover:text-white hover:bg-stone-800'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isAr ? 'طلبات الحلويات' : 'Orders'}</span>
                  {newOrdersCount > 0 && (
                    <span className="px-1.5 py-0.2 bg-amber-400 text-stone-950 text-[10px] font-bold rounded-full animate-bounce">
                      {newOrdersCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('reservations')}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'reservations'
                      ? 'bg-[#8B1528] text-white shadow-sm'
                      : 'text-stone-400 hover:text-white hover:bg-stone-800'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>{isAr ? 'حجوزات الصالون' : 'Salon Bookings'}</span>
                  {pendingReservationsCount > 0 && (
                    <span className="px-1.5 py-0.2 bg-purple-400 text-stone-950 text-[10px] font-bold rounded-full">
                      {pendingReservationsCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('catering')}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'catering'
                      ? 'bg-[#8B1528] text-white shadow-sm'
                      : 'text-stone-400 hover:text-white hover:bg-stone-800'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isAr ? 'بوفيهات الأعراس والضيافة' : 'Catering Events'}</span>
                  {newCateringCount > 0 && (
                    <span className="px-1.5 py-0.2 bg-emerald-400 text-stone-950 text-[10px] font-bold rounded-full">
                      {newCateringCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'settings'
                      ? 'bg-[#8B1528] text-white shadow-sm'
                      : 'text-stone-400 hover:text-white hover:bg-stone-800'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>{isAr ? 'إعدادات المحل والواتساب' : 'Store Settings'}</span>
                </button>
              </div>

              {/* Sound alert toggle & stats info */}
              <div className="flex items-center gap-3 text-xs text-stone-400">
                <span className="hidden md:inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  {isAr ? 'مستقبل الطلبات متصل لحظياً (Live)' : 'Live Connected'}
                </span>
                <button
                  onClick={() => setSoundAlert(!soundAlert)}
                  className="p-1.5 text-stone-400 hover:text-white rounded-lg bg-stone-800 border border-stone-700 cursor-pointer"
                  title={soundAlert ? (isAr ? 'كتم التنبيه' : 'Mute Sound') : (isAr ? 'تشغيل التنبيه' : 'Enable Sound')}
                >
                  {soundAlert ? <Volume2 className="w-4 h-4 text-[#DFB15B]" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* TAB 1: ORDERS */}
            {activeTab === 'orders' && (
              <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-hidden">
                {/* Search & Status Filters */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 shrink-0">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-stone-400 absolute start-3 top-2.5" />
                    <input
                      type="text"
                      placeholder={isAr ? 'بحث برقم الطلب، اسم العميل، الهاتف...' : 'Search order #, customer, phone...'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full ps-9 pe-4 py-2 text-xs bg-stone-900 border border-stone-800 rounded-xl text-stone-200 focus:outline-none focus:border-[#DFB15B]"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                    {[
                      { id: 'all', label: isAr ? 'الكل' : 'All' },
                      { id: 'new', label: isAr ? 'جديد' : 'New' },
                      { id: 'preparing', label: isAr ? 'قيد التحضير' : 'Preparing' },
                      { id: 'on_the_way', label: isAr ? 'في التوصيل' : 'Delivering' },
                      { id: 'delivered', label: isAr ? 'مكتمل' : 'Completed' },
                    ].map((st) => (
                      <button
                        key={st.id}
                        onClick={() => setStatusFilter(st.id)}
                        className={`px-3 py-1.5 text-xs rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
                          statusFilter === st.id
                            ? 'bg-stone-100 text-stone-900 font-bold'
                            : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Orders Table / List */}
                <div className="flex-1 overflow-y-auto space-y-3 pe-1">
                  {filteredOrders.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-stone-800 rounded-2xl text-stone-500">
                      <ShoppingBag className="w-12 h-12 text-stone-700 mb-2" />
                      <p className="text-sm font-semibold text-stone-400">
                        {isAr ? 'لا توجد طلبات تطابق الفلتر حالياً' : 'No orders matching current filter'}
                      </p>
                      <p className="text-xs text-stone-600 mt-1">
                        {isAr ? 'أي طلب يقوم به عميل سيظهر هنا فوراً مع تحديث لحظي' : 'Incoming orders will appear here automatically in real-time'}
                      </p>
                    </div>
                  ) : (
                    filteredOrders.map((order) => (
                      <div
                        key={order.id || order.orderNumber}
                        className="bg-stone-900/90 border border-stone-800 rounded-xl p-4 hover:border-stone-700 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                      >
                        {/* Order Header / Meta */}
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="font-mono font-bold text-sm text-[#DFB15B]">
                              #{order.orderNumber}
                            </span>
                            {getStatusBadge(order.status)}
                            <span className="text-[11px] text-stone-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="text-[11px] px-2 py-0.5 rounded bg-stone-800 text-stone-300">
                              {order.deliveryType === 'delivery'
                                ? (isAr ? '🛵 توصيل للمنزل' : '🛵 Home Delivery')
                                : (isAr ? '🛍️ استلام من الفرع' : '🛍️ Branch Pickup')}
                            </span>
                          </div>

                          {/* Customer & Address */}
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-300">
                            <span className="font-semibold text-white">{order.customerName}</span>
                            <a
                              href={`tel:${order.customerPhone}`}
                              className="text-stone-400 hover:text-[#DFB15B] flex items-center gap-1 underline underline-offset-2"
                            >
                              <Phone className="w-3 h-3 text-[#C5A059]" />
                              {order.customerPhone}
                            </a>
                            {order.governorate && (
                              <span className="text-amber-400/90 font-medium bg-amber-400/10 px-2 py-0.5 rounded text-[11px] border border-amber-400/20">
                                {order.governorate}
                              </span>
                            )}
                            {order.address && (
                              <span className="text-stone-400 flex items-center gap-1 max-w-sm truncate">
                                <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                                {order.address}
                              </span>
                            )}
                          </div>

                            {/* Items summary */}
                            <div className="text-xs text-stone-400 bg-stone-950/60 p-2.5 rounded-lg border border-stone-800/80">
                              <div className="font-semibold text-stone-300 mb-1 flex items-center justify-between">
                                <span>{isAr ? 'الأصناف:' : 'Items:'}</span>
                                <span className="text-[#DFB15B] font-mono font-bold text-sm">
                                  {settings.currencySymbol}{order.total}
                                </span>
                              </div>
                              <div className="space-y-0.5">
                                {order.items.map((it, idx) => (
                                  <div key={idx} className="flex justify-between text-[11px]">
                                    <span>
                                      {it.quantity}x {isAr ? it.nameAr : it.nameEn} ({isAr ? it.portionAr : it.portionEn})
                                      {it.sweetnessPreference && ` [${it.sweetnessPreference}]`}
                                      {it.specialNote && ` - ملاحظة: ${it.specialNote}`}
                                    </span>
                                    <span className="tabular-nums font-mono">${it.price * it.quantity}</span>
                                  </div>
                                ))}
                              </div>

                              {/* Attached Customer Photos */}
                              {order.uploadedImages && order.uploadedImages.length > 0 && (
                                <div className="mt-2.5 pt-2 border-t border-stone-800">
                                  <span className="text-[10px] font-bold text-[#DFB15B] block mb-1.5">
                                    📸 {isAr ? `صور الديزاين المرفقة من العميل (${order.uploadedImages.length}):` : 'Attached Photos:'}
                                  </span>
                                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                                    {order.uploadedImages.map((imgUrl, imgIdx) => (
                                      <a
                                        key={imgIdx}
                                        href={imgUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="shrink-0 group relative"
                                        title={isAr ? 'انقر لفتح الصورة بالحجم الكامل' : 'Open full image'}
                                      >
                                        <img
                                          src={imgUrl}
                                          alt={`Order Design ${imgIdx + 1}`}
                                          className="w-14 h-14 object-cover rounded-lg border border-stone-700 hover:border-[#DFB15B] transition-colors"
                                        />
                                        <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-lg flex items-center justify-center text-[10px] text-white font-bold transition-opacity">
                                          🔍
                                        </span>
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                        </div>

                        {/* Order Controls & Actions */}
                        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
                          {/* WhatsApp Chat Button with customer */}
                          <a
                            href={`https://api.whatsapp.com/send?phone=${order.customerPhone.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(
                              `مرحباً ${order.customerName}، بخصوص طلبك رقم #${order.orderNumber} من قصر الحلويات الملكي:`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                            title={isAr ? 'مراسلة العميل واتساب' : 'Chat via WhatsApp'}
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">{isAr ? 'واتساب' : 'WhatsApp'}</span>
                          </a>

                          {/* Quick Status Select */}
                          <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800">
                            <button
                              onClick={() => handleStatusChange(order.id!, 'preparing')}
                              className={`px-2.5 py-1 text-xs rounded-lg cursor-pointer transition-colors ${
                                order.status === 'preparing'
                                  ? 'bg-blue-600 text-white font-bold'
                                  : 'text-stone-400 hover:text-white'
                              }`}
                              title={isAr ? 'تغيير الحالة: جاري التحضير' : 'Mark as Preparing'}
                            >
                              {isAr ? 'تحضير' : 'Prep'}
                            </button>
                            <button
                              onClick={() => handleStatusChange(order.id!, 'on_the_way')}
                              className={`px-2.5 py-1 text-xs rounded-lg cursor-pointer transition-colors ${
                                order.status === 'on_the_way'
                                  ? 'bg-purple-600 text-white font-bold'
                                  : 'text-stone-400 hover:text-white'
                              }`}
                              title={isAr ? 'تغيير الحالة: خرج للتوصيل' : 'Mark as Out for Delivery'}
                            >
                              {isAr ? 'توصيل' : 'Delivery'}
                            </button>
                            <button
                              onClick={() => handleStatusChange(order.id!, 'delivered')}
                              className={`px-2.5 py-1 text-xs rounded-lg cursor-pointer transition-colors ${
                                order.status === 'delivered'
                                  ? 'bg-emerald-600 text-white font-bold'
                                  : 'text-stone-400 hover:text-white'
                              }`}
                              title={isAr ? 'تغيير الحالة: تم التسليم بنجاح' : 'Mark as Delivered'}
                            >
                              {isAr ? 'تم' : 'Done'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: RESERVATIONS */}
            {activeTab === 'reservations' && (
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#DFB15B]" />
                    <span>{isAr ? 'قائمة حجوزات طاولات صالون الشاي' : 'Salon Table Bookings'}</span>
                  </h3>
                  <span className="text-xs text-stone-400">
                    {reservations.length} {isAr ? 'حجز مسجل' : 'Reservations'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {reservations.length === 0 ? (
                    <div className="col-span-2 text-center py-12 text-stone-500">
                      {isAr ? 'لا توجد حجوزات طاولات مسجلة حتى الآن' : 'No table reservations yet'}
                    </div>
                  ) : (
                    reservations.map((res) => (
                      <div
                        key={res.id || res.reservationCode}
                        className="bg-stone-900 border border-stone-800 rounded-xl p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-sm text-[#DFB15B]">
                            {res.reservationCode}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                              res.status === 'confirmed'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : res.status === 'seated'
                                ? 'bg-blue-950 text-blue-300 border border-blue-800'
                                : 'bg-amber-950 text-amber-300 border border-amber-800'
                            }`}
                          >
                            {res.status === 'confirmed'
                              ? (isAr ? 'مؤكد' : 'Confirmed')
                              : res.status === 'seated'
                              ? (isAr ? 'جالس بالصالون' : 'Seated')
                              : (isAr ? 'في الانتظار' : 'Pending')}
                          </span>
                        </div>

                        <div className="text-xs space-y-1 text-stone-300">
                          <div className="flex justify-between">
                            <span className="text-stone-400">{isAr ? 'الضيف:' : 'Guest:'}</span>
                            <span className="font-semibold text-white">{res.guestName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-stone-400">{isAr ? 'الهاتف:' : 'Phone:'}</span>
                            <a href={`tel:${res.guestPhone}`} className="text-[#DFB15B] underline">
                              {res.guestPhone}
                            </a>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-stone-400">{isAr ? 'الموعد:' : 'Date & Time:'}</span>
                            <span className="font-medium text-white">{res.date} الساعة {res.timeSlot}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-stone-400">{isAr ? 'عدد الضيوف:' : 'Guests:'}</span>
                            <span>{res.guests} {isAr ? 'أشخاص' : 'People'} ({res.seating})</span>
                          </div>
                          {res.specialOccasion && (
                            <div className="pt-1 text-[11px] text-[#DFB15B]">
                              ✦ {isAr ? 'المناسبة:' : 'Occasion:'} {res.specialOccasion}
                            </div>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="pt-2 border-t border-stone-800 flex items-center justify-between gap-2">
                          <a
                            href={`https://api.whatsapp.com/send?phone=${res.guestPhone.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(
                              `مرحباً ${res.guestName}، يسعدنا تأكيد حجز طاولتك رقم (${res.reservationCode}) في صالون قصر الحلويات الملكي.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 text-xs bg-emerald-600/20 text-emerald-400 rounded-lg flex items-center gap-1.5 hover:bg-emerald-600/30"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>{isAr ? 'تأكيد عبر واتساب' : 'WhatsApp'}</span>
                          </a>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleReservationStatusChange(res.id!, 'confirmed')}
                              className="px-2.5 py-1 text-xs bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg cursor-pointer"
                            >
                              {isAr ? 'تأكيد الحجز' : 'Confirm'}
                            </button>
                            <button
                              onClick={() => handleReservationStatusChange(res.id!, 'seated')}
                              className="px-2.5 py-1 text-xs bg-[#8B1528] hover:bg-[#A51D34] text-white rounded-lg cursor-pointer"
                            >
                              {isAr ? 'وصل' : 'Seated'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: CATERING */}
            {activeTab === 'catering' && (
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#DFB15B]" />
                    <span>{isAr ? 'طلبات بوفيهات الأعراس والمناسبات الكبرى' : 'Catering & Event Inquiries'}</span>
                  </h3>
                  <span className="text-xs text-stone-400">
                    {cateringList.length} {isAr ? 'طلب ضيافة' : 'Inquiries'}
                  </span>
                </div>

                <div className="space-y-3">
                  {cateringList.length === 0 ? (
                    <div className="text-center py-12 text-stone-500">
                      {isAr ? 'لا توجد طلبات بوفيهات مسجلة حتى الآن' : 'No catering requests yet'}
                    </div>
                  ) : (
                    cateringList.map((cat) => (
                      <div
                        key={cat.id}
                        className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-white text-sm">{cat.clientName}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#DFB15B]/20 text-[#DFB15B] border border-[#DFB15B]/40">
                              {cat.eventType}
                            </span>
                            <span className="text-xs text-stone-400">
                              {cat.guestCount} {isAr ? 'ضيف' : 'Guests'} · {cat.tier}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-x-4 text-xs text-stone-300">
                            <a href={`tel:${cat.clientPhone}`} className="text-[#DFB15B] underline">
                              {cat.clientPhone}
                            </a>
                            {cat.clientEmail && <span>{cat.clientEmail}</span>}
                            <span>{isAr ? 'تاريخ المناسبة:' : 'Event Date:'} {cat.eventDate}</span>
                            <span>{isAr ? 'النسبة:' : 'Ratio:'} {cat.ratioOriental}% شرقي / {cat.ratioWestern}% غربي</span>
                          </div>

                          {cat.notes && (
                            <p className="text-xs text-stone-400 bg-stone-950 p-2 rounded border border-stone-800">
                              {cat.notes}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={`https://api.whatsapp.com/send?phone=${cat.clientPhone.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(
                              `مرحباً ${cat.clientName}، استلمنا طلبك لبوفيه الضيافة الملكي لمناسبتكم بتاريخ ${cat.eventDate} لعدد ${cat.guestCount} ضيف.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 bg-emerald-600/20 text-emerald-400 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-600/30"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>{isAr ? 'مراسلة عبر واتساب' : 'WhatsApp Client'}</span>
                          </a>

                          <button
                            onClick={() => handleCateringStatusChange(cat.id!, 'contacted')}
                            className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg cursor-pointer"
                          >
                            {isAr ? 'تم التواصل' : 'Contacted'}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: SETTINGS & WHATSAPP CONFIG */}
            {activeTab === 'settings' && (
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto max-w-2xl mx-auto w-full">
                <form onSubmit={handleSaveSettings} className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-5">
                  <div>
                    <h3 className="text-lg font-bold font-display text-white">
                      {isAr ? 'إعدادات متجر قصر الحلويات الملكي' : 'Shop Management Settings'}
                    </h3>
                    <p className="text-xs text-stone-400 mt-1">
                      {isAr
                        ? 'حدد رقم هاتف الواتساب الذي ستصل إليه تنبيهات ومحادثات الطلبات فورياً، والرمز السري للوحة.'
                        : 'Configure shop WhatsApp destination number for orders and admin access PIN.'}
                    </p>
                  </div>

                  {settingsSaved && (
                    <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isAr ? 'تم حفظ وتحديث إعدادات المحل بنجاح!' : 'Settings updated successfully!'}</span>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">
                        {isAr ? 'رقم واتساب المحل لاستقبال الطلبات الفورية *' : 'Shop WhatsApp Receiving Number *'}
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 971501234567 or 201012345678"
                        value={settings.whatsappNumber}
                        onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded-lg text-white font-mono"
                      />
                      <p className="text-[11px] text-stone-500 mt-1">
                        {isAr
                          ? 'ملاحظة: اكتب الرقم مع كود الدولة وبدون علامة + أو مسافات (مثال: 971501234567 أو 201000000000).'
                          : 'Write with country code without + or spaces (e.g. 971501234567).'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">
                          {isAr ? 'اسم المتجر (عربي)' : 'Shop Name (AR)'}
                        </label>
                        <input
                          type="text"
                          value={settings.shopNameAr}
                          onChange={(e) => setSettings({ ...settings, shopNameAr: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded-lg text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">
                          {isAr ? 'اسم المتجر (إنجليزي)' : 'Shop Name (EN)'}
                        </label>
                        <input
                          type="text"
                          value={settings.shopNameEn}
                          onChange={(e) => setSettings({ ...settings, shopNameEn: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded-lg text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">
                          {isAr ? 'رمز العملة' : 'Currency Symbol'}
                        </label>
                        <input
                          type="text"
                          value={settings.currencySymbol}
                          onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded-lg text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">
                          {isAr ? 'الرمز السري لدخول اللوحة (PIN)' : 'Admin Dashboard PIN'}
                        </label>
                        <input
                          type="text"
                          value={settings.adminPin}
                          onChange={(e) => setSettings({ ...settings, adminPin: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded-lg text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#8B1528] hover:bg-[#A51D34] text-white text-xs font-semibold rounded-lg shadow-md transition-colors cursor-pointer"
                  >
                    {isAr ? 'حفظ إعدادات المحل' : 'Save Store Configuration'}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
