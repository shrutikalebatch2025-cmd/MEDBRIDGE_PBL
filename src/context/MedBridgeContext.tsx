import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Equipment,
  CartItem,
  RequestItem,
  EReceipt,
  Activity,
  UserRole,
} from '../types';
import {
  INITIAL_EQUIPMENT,
  INITIAL_REQUESTS,
  INITIAL_RECEIPTS,
  INITIAL_ACTIVITIES,
  DEMO_DONOR_USER,
  DEMO_NGO_USER,
  getRealEquipmentImage,
} from '../data/initialData';
import { supabase } from '../supabase';

type AppPage =
  | 'home'
  | 'equipment'
  | 'cart'
  | 'requests'
  | 'donate'
  | 'receipts'
  | 'dashboard'
  | 'about'
  | 'details'
  | 'request'
  | 'database';

interface MedBridgeContextType {
  currentUser: User | null;
  currentPage: AppPage;
  selectedRoleForAuth: 'donor' | 'ngo' | null;
  authMode: 'login' | 'signup';
  setAuthMode: (mode: 'login' | 'signup') => void;
  openAuth: (role: 'donor' | 'ngo') => void;
  backToRoles: () => void;
  quickDemoLogin: (role: 'donor' | 'ngo') => void;
  login: (role: 'donor' | 'ngo', email: string, pass: string) => Promise<boolean>;
  signup: (role: 'donor' | 'ngo', data: any) => Promise<boolean>;
  logout: () => void;
  showPage: (page: AppPage) => void;
  equipment: Equipment[];
  selectedEquipment: Equipment | null;
  setSelectedEquipment: (item: Equipment | null) => void;
  showDetails: (id: string) => void;
  openRequest: (id: string) => void;
  addEquipment: (
    itemData: Omit<Equipment, 'id' | 'created_at' | 'status' | 'owner_id' | 'owner_name' | 'owner_organization' | 'owner_role'>,
    generateReceiptImmediately?: boolean
  ) => Promise<void>;
  deleteEquipment: (id: string) => Promise<void>;
  cart: CartItem[];
  addToCart: (item: Equipment) => void;
  removeFromCart: (equipmentId: string) => void;
  clearCart: () => void;
  checkoutCart: (checkoutData: {
    clinicBranch: string;
    urgency: 'Routine' | 'Urgent' | 'Critical Emergency';
    clinicalNotes: string;
  }) => EReceipt;
  requests: RequestItem[];
  submitRequest: (duration: string, reason: string) => void;
  approveRequest: (requestId: string) => void;
  receipts: EReceipt[];
  activeReceiptModal: EReceipt | null;
  setActiveReceiptModal: (receipt: EReceipt | null) => void;
  openReceiptForEquipment: (equipmentId: string) => EReceipt;
  generateSampleReceipt: (type?: 'donation_tax_exempt' | 'consignment_handover') => EReceipt;
  generateTaxReceiptForDonorItem: (equipmentId: string) => EReceipt;
  activities: Activity[];
  toastMessage: string | null;
  showToast: (msg: string) => void;
  switchRolePersona: (role: UserRole) => void;
}

const MedBridgeContext = createContext<MedBridgeContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'medbridge_current_user',
  EQUIPMENT: 'medbridge_equipment_list',
  REQUESTS: 'medbridge_requests',
  RECEIPTS: 'medbridge_receipts',
  ACTIVITIES: 'medbridge_activities',
  CART: 'medbridge_cart',
};

function normalizeReceipt(r: any): EReceipt {
  return {
    receiptNumber: r.receiptNumber || `MB-REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    receiptType: r.receiptType === 'donation_tax_exempt' ? 'donation_tax_exempt' : 'consignment_handover',
    createdAt: r.createdAt || new Date().toISOString(),
    donor: {
      id: r.donor?.id || 'donor-1',
      name: r.donor?.name || 'Dr. Marcus Vance, MD',
      organization: r.donor?.organization || r.donor?.org || 'Apex Biomedical Relief Alliance',
      email: r.donor?.email || r.donor?.contactEmail || 'donor@apexhealth.org',
      phone: r.donor?.phone || '9876543210',
      location: r.donor?.location || 'Metropolitan Central Depot',
      taxId: r.donor?.taxId || r.donor?.taxExemptId || 'EIN-47-8921408',
    },
    ngo: {
      id: r.ngo?.id || 'ngo-1',
      name: r.ngo?.name || 'Sarah Chen, RN',
      organization: r.ngo?.organization || r.ngo?.org || 'Hope Horizon Rural Health Foundation',
      email: r.ngo?.email || 'schen@hopehorizonhealth.org',
      phone: r.ngo?.phone || '9876543211',
      location: r.ngo?.location || 'District Ward 7 Clinic',
      clinicBranch: r.ngo?.clinicBranch || r.ngo?.clinicName || 'Maternal & Outreach Triage Ward',
      registrationNumber: r.ngo?.registrationNumber || 'NGO-FCRA-8829-MED',
    },
    items: Array.isArray(r.items)
      ? r.items.map((it: any) => {
          let val = it.estimatedValue ?? it.estimated_value;
          if (val === undefined || val === null || Number(val) < 5000) {
            const match = INITIAL_EQUIPMENT.find((e) => e.id === it.id || e.name === it.name);
            val = match ? match.estimated_value : 48000;
          }
          return {
            id: it.id || 'eq-1',
            name: it.name || it.title || 'Medical Equipment Unit',
            category: it.category || 'Medical Equipment',
            condition: it.condition || 'Good',
            sharing_type: it.sharing_type || 'Donate',
            quantity: it.quantity || 1,
            estimatedValue: Number(val),
            serialNumber: it.serialNumber || it.serial_number || 'SN-MED-9941',
          };
        })
      : [],
    totalValue: (() => {
      const calc = (Array.isArray(r.items) ? r.items : []).reduce(
        (sum: number, it: any) => sum + (it.estimatedValue || it.estimated_value || 48000) * (it.quantity || 1),
        0
      );
      if (calc > 0) return calc;
      return r.totalValue && r.totalValue >= 5000 ? r.totalValue : 48000;
    })(),
    verificationHash: r.verificationHash || '0x8f2a64c01e9d84b238f9a21c54b79e831a29f8c4',
    qrPayload: r.qrPayload || `https://medbridge.health/verify/receipt/${r.receiptNumber || 'MB-REC-2026-8812'}?auth=valid`,
    clinicalNotes: r.clinicalNotes || r.notes || 'Official medical consignment verified for patient healthcare delivery.',
    sanitizationCertified: r.sanitizationCertified !== false,
    donorSignatory: r.donorSignatory || 'Dr. Marcus Vance (Donor Logistics Officer)',
    ngoSignatory: r.ngoSignatory || 'Sarah Chen, RN (Authorizing Executive)',
  };
}

export const MedBridgeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : DEMO_NGO_USER; // Start with active user for instant exploration
    } catch {
      return DEMO_NGO_USER;
    }
  });

  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [selectedRoleForAuth, setSelectedRoleForAuth] = useState<'donor' | 'ngo' | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const [equipment, setEquipment] = useState<Equipment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EQUIPMENT);
      if (saved) {
        const parsed: Equipment[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Seamlessly migrate legacy items with AI images or low dollar prices to authentic photos & Indian Rupees
          return parsed.map((item) => {
            const initialMatch = INITIAL_EQUIPMENT.find((e) => e.id === item.id);
            if (initialMatch) {
              return {
                ...item,
                image_url: initialMatch.image_url,
                estimated_value: (item.estimated_value && item.estimated_value >= 5000) ? item.estimated_value : initialMatch.estimated_value,
              };
            }
            const needsRealImage = !item.image_url || item.image_url.includes('/src/assets/images/') || item.image_url.includes('unsplash');
            return {
              ...item,
              image_url: needsRealImage ? getRealEquipmentImage(item.category, item.name) : item.image_url,
              estimated_value: (item.estimated_value && item.estimated_value >= 5000) ? item.estimated_value : 48000,
            };
          });
        }
      }
      return INITIAL_EQUIPMENT;
    } catch {
      return INITIAL_EQUIPMENT;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      if (saved) {
        const parsed: CartItem[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((c) => {
            const initialMatch = INITIAL_EQUIPMENT.find((e) => e.id === c.equipment?.id || e.id === c.equipmentId);
            return {
              ...c,
              equipment: {
                ...c.equipment,
                image_url: initialMatch ? initialMatch.image_url : (c.equipment?.image_url || getRealEquipmentImage(c.equipment?.category, c.equipment?.name)),
                estimated_value: (c.equipment?.estimated_value && c.equipment.estimated_value >= 5000) ? c.equipment.estimated_value : (initialMatch?.estimated_value || 48000),
              },
            };
          });
        }
      }
      return [];
    } catch {
      return [];
    }
  });


  const [requests, setRequests] = useState<RequestItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
    } catch {
      return INITIAL_REQUESTS;
    }
  });

  const [receipts, setReceipts] = useState<EReceipt[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RECEIPTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(normalizeReceipt);
        }
      }
      return INITIAL_RECEIPTS.map(normalizeReceipt);
    } catch {
      return INITIAL_RECEIPTS.map(normalizeReceipt);
    }
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  });

  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [activeReceiptModal, setActiveReceiptModal] = useState<EReceipt | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(equipment));
    } catch (e) {
      console.error(e);
    }
  }, [equipment]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
    } catch (e) {
      console.error(e);
    }
  }, [requests]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RECEIPTS, JSON.stringify(receipts));
    } catch (e) {
      console.error(e);
    }
  }, [receipts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
    } catch (e) {
      console.error(e);
    }
  }, [activities]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const showPage = (page: AppPage) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAuth = (role: 'donor' | 'ngo') => {
    setSelectedRoleForAuth(role);
    setAuthMode('login');
    window.scrollTo(0, 0);
  };

  const backToRoles = () => {
    setSelectedRoleForAuth(null);
    window.scrollTo(0, 0);
  };

  const quickDemoLogin = (role: 'donor' | 'ngo') => {
    const user = role === 'donor' ? DEMO_DONOR_USER : DEMO_NGO_USER;
    setCurrentUser(user);
    setSelectedRoleForAuth(null);
    showPage('home');
    showToast(`Logged in as ${user.name} (${user.role})`);
  };

  const switchRolePersona = (role: UserRole) => {
    const user = role === 'Donor' ? DEMO_DONOR_USER : DEMO_NGO_USER;
    setCurrentUser(user);
    showToast(`Switched active profile to ${user.name} (${user.role})`);
  };

  const login = async (role: 'donor' | 'ngo', email: string, pass: string): Promise<boolean> => {
    try {
      // Attempt supabase login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (!error && data?.user) {
        const roleLabel: UserRole = role === 'donor' ? 'Donor' : 'NGO / Hospital';
        const userObj: User = {
          id: data.user.id,
          name: data.user.user_metadata?.name || email.split('@')[0],
          email: data.user.email || email,
          phone: data.user.user_metadata?.phone || '9876543210',
          organization: data.user.user_metadata?.organization || (role === 'donor' ? 'Donor Foundation' : 'Medical NGO'),
          organizationType: data.user.user_metadata?.organization_type || (role === 'donor' ? 'Foundation' : 'NGO'),
          role: roleLabel,
          location: data.user.user_metadata?.location || 'Central City',
        };
        setCurrentUser(userObj);
        setSelectedRoleForAuth(null);
        showPage('home');
        showToast('Welcome back to MedBridge!');
        return true;
      }
    } catch (e) {
      console.warn('Supabase auth network issue, falling back to local session', e);
    }

    // Local authentication fallback for convenience
    const roleLabel: UserRole = role === 'donor' ? 'Donor' : 'NGO / Hospital';
    const fallbackUser: User = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0].toUpperCase(),
      email,
      phone: '9876543210',
      organization: role === 'donor' ? 'Surplus Biomedical Donor' : 'Community Clinic Network',
      organizationType: role === 'donor' ? 'Foundation' : 'Hospital',
      role: roleLabel,
      location: 'Metropolitan District',
    };
    setCurrentUser(fallbackUser);
    setSelectedRoleForAuth(null);
    showPage('home');
    showToast(`Welcome! Logged in as ${roleLabel}`);
    return true;
  };

  const signup = async (role: 'donor' | 'ngo', formData: any): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            phone: formData.phone,
            organization: formData.organization || formData.name,
            role: role === 'donor' ? 'Donor' : 'NGO / Hospital',
            location: formData.location,
            organization_type: formData.organizationType || 'NGO',
          },
        },
      });

      if (!error && data?.user) {
        const roleLabel: UserRole = role === 'donor' ? 'Donor' : 'NGO / Hospital';
        const userObj: User = {
          id: data.user.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          organization: formData.organization || formData.name,
          organizationType: formData.organizationType || (role === 'donor' ? 'Donor Foundation' : 'NGO'),
          role: roleLabel,
          location: formData.location,
        };
        setCurrentUser(userObj);
        setSelectedRoleForAuth(null);
        showPage('home');
        showToast('Account created successfully!');
        return true;
      }
    } catch (e) {
      console.warn('Supabase signup fallback', e);
    }

    // Fallback user creation
    const roleLabel: UserRole = role === 'donor' ? 'Donor' : 'NGO / Hospital';
    const userObj: User = {
      id: `user-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      organization: formData.organization || formData.name,
      organizationType: formData.organizationType || (role === 'donor' ? 'Donor Foundation' : 'NGO'),
      role: roleLabel,
      location: formData.location,
    };
    setCurrentUser(userObj);
    setSelectedRoleForAuth(null);
    showPage('home');
    showToast('Account created successfully!');
    return true;
  };

  const logout = () => {
    supabase.auth.signOut().catch(console.error);
    setCurrentUser(null);
    setSelectedRoleForAuth(null);
    showToast('Logged out successfully.');
  };

  const showDetails = (id: string) => {
    const item = equipment.find((e) => String(e.id) === String(id));
    if (item) {
      setSelectedEquipment(item);
      showPage('details');
    }
  };

  const openRequest = (id: string) => {
    if (!currentUser) {
      showToast('Please log in first.');
      return;
    }
    if (currentUser.role === 'Donor') {
      showToast('Donors cannot request equipment.');
      return;
    }
    const item = equipment.find((e) => String(e.id) === String(id));
    if (item) {
      setSelectedEquipment(item);
      showPage('request');
    }
  };

  const addActivity = (title: string, details: string, extra: string = '') => {
    if (!currentUser) return;
    const newAct: Activity = {
      id: Date.now(),
      userId: currentUser.id,
      email: currentUser.email,
      title,
      details,
      extra,
      date: new Date().toISOString(),
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  const addEquipment = async (
    itemData: Omit<Equipment, 'id' | 'created_at' | 'status' | 'owner_id' | 'owner_name' | 'owner_organization' | 'owner_role'>,
    generateReceiptImmediately: boolean = true
  ) => {
    if (!currentUser) {
      showToast('Please log in first.');
      return;
    }
    if (currentUser.role !== 'Donor') {
      showToast('Only donors can list equipment.');
      return;
    }

    const newId = `eq-${Date.now()}`;
    const isoDate = new Date().toISOString();
    const serial = itemData.serial_number || `SN-${Math.floor(10000 + Math.random() * 90000)}`;

    const newItem: Equipment = {
      ...itemData,
      id: newId,
      status: 'Available',
      created_at: isoDate,
      serial_number: serial,
      image_url: itemData.image_url || getRealEquipmentImage(itemData.category, itemData.name),
      owner_id: currentUser.id,
      owner_name: currentUser.name,
      owner_organization: currentUser.organization,
      owner_role: currentUser.role,
    };


    setEquipment((prev) => [newItem, ...prev]);

    addActivity(
      'Equipment Listed',
      `${newItem.name} was added to MedBridge.`,
      `You listed ${newItem.quantity} unit(s) in ${newItem.location}.`
    );

    // If requested, generate Tax E-Receipt immediately
    if (generateReceiptImmediately) {
      const receiptNumber = `MB-REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newReceipt: EReceipt = {
        receiptNumber,
        receiptType: 'donation_tax_exempt',
        createdAt: isoDate,
        donor: {
          name: currentUser.name,
          organization: currentUser.organization,
          email: currentUser.email,
          phone: currentUser.phone,
          location: newItem.location,
          taxId: 'EIN-47-8921408',
        },
        ngo: {
          name: 'MedBridge Relief Consortium',
          organization: 'Verified NGO Hospital Alliance',
          email: 'consortium@medbridge.health',
          phone: '18005556332',
          location: 'Central Medical Reserve',
          clinicBranch: 'Regional Medical Depot',
          registrationNumber: 'MED-NGO-FCRA-8829',
        },
        items: [
          {
            id: newItem.id,
            name: newItem.name,
            category: newItem.category,
            condition: newItem.condition,
            sharing_type: newItem.sharing_type,
            quantity: newItem.quantity,
            estimatedValue: newItem.estimated_value || 1000,
            serialNumber: serial,
          },
        ],
        totalValue: (newItem.estimated_value || 1000) * newItem.quantity,
        verificationHash: `0x${Array.from({ length: 40 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join('')}`,
        qrPayload: `https://medbridge.health/verify/receipt/${receiptNumber}?auth=valid&ts=${Date.now()}`,
        clinicalNotes: 'Charitable in-kind equipment donation certified for Section 80G and IRS 501(c)(3) tax exemption.',
        sanitizationCertified: true,
        donorSignatory: `${currentUser.name} (Authorized Donor)`,
        ngoSignatory: 'MedBridge Clinical Inspection Authority',
      };

      setReceipts((prev) => [newReceipt, ...prev]);
      setActiveReceiptModal(newReceipt);
    }

    showToast('Equipment listed successfully!');
    showPage('dashboard');
  };

  const deleteEquipment = async (id: string) => {
    const item = equipment.find((e) => String(e.id) === String(id));
    if (!item) return;

    if (!currentUser || item.owner_id !== currentUser.id && item.owner_name !== currentUser.name) {
      showToast('You can only delete your own equipment.');
      return;
    }

    setEquipment((prev) => prev.filter((e) => String(e.id) !== String(id)));

    addActivity(
      'Equipment Deleted',
      `${item.name} was deleted.`,
      'You removed this equipment listing.'
    );

    showToast('Equipment deleted.');
  };

  const addToCart = (item: Equipment) => {
    if (!currentUser) {
      showToast('Please log in as an NGO or Hospital to use the request cart.');
      return;
    }
    if (currentUser.role === 'Donor') {
      showToast('Request cart is for NGOs and Hospitals requesting equipment.');
      return;
    }
    if (cart.some((c) => c.equipmentId === item.id)) {
      showToast('Item is already in your Request Cart.');
      showPage('cart');
      return;
    }

    const newCartItem: CartItem = {
      equipmentId: item.id,
      equipment: item,
      quantityRequested: 1,
      urgency: 'Urgent',
      clinicBranch: currentUser.organization || 'Primary Healthcare Unit',
      purpose: 'Urgent clinic equipment allocation for outreach patients.',
    };

    setCart((prev) => [...prev, newCartItem]);
    showToast(`Added "${item.name}" to Request Cart!`);
  };

  const removeFromCart = (equipmentId: string) => {
    setCart((prev) => prev.filter((c) => c.equipmentId !== equipmentId));
    showToast('Item removed from cart.');
  };

  const clearCart = () => {
    setCart([]);
    showToast('Request cart cleared.');
  };

  const checkoutCart = (checkoutData: {
    clinicBranch: string;
    urgency: 'Routine' | 'Urgent' | 'Critical Emergency';
    clinicalNotes: string;
  }): EReceipt => {
    if (!currentUser) throw new Error('Not logged in');

    const receiptNumber = `MB-REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const isoDate = new Date().toISOString();

    const itemsSnapshot = cart.map((c) => ({
      id: c.equipment.id,
      name: c.equipment.name,
      category: c.equipment.category,
      condition: c.equipment.condition,
      sharing_type: c.equipment.sharing_type,
      quantity: c.quantityRequested,
      estimatedValue: (c.equipment.estimated_value || 1200) * c.quantityRequested,
      serialNumber: c.equipment.serial_number || `SN-${Math.floor(10000 + Math.random() * 90000)}`,
    }));

    const totalVal = itemsSnapshot.reduce((acc, cur) => acc + cur.estimatedValue, 0);

    const firstItem = cart[0]?.equipment;
    const donorName = firstItem?.owner_name || 'Apex Biomedical Relief Alliance';
    const donorOrg = firstItem?.owner_organization || 'Apex Biomedical Relief Alliance';

    const newReceipt: EReceipt = {
      receiptNumber,
      receiptType: 'consignment_handover',
      createdAt: isoDate,
      donor: {
        name: donorName,
        organization: donorOrg,
        email: 'donor.logistics@apexhealth.org',
        phone: '9876543210',
        location: firstItem?.location || 'Central Depot',
        taxId: 'EIN-47-8921408',
      },
      ngo: {
        id: currentUser.id,
        name: currentUser.name,
        organization: currentUser.organization,
        email: currentUser.email,
        phone: currentUser.phone,
        location: currentUser.location,
        clinicBranch: checkoutData.clinicBranch,
        registrationNumber: 'NGO-FCRA-8829-MED',
      },
      items: itemsSnapshot,
      totalValue: totalVal,
      verificationHash: `0x${Array.from({ length: 40 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}`,
      qrPayload: `https://medbridge.health/verify/receipt/${receiptNumber}?auth=valid&ts=${Date.now()}`,
      clinicalNotes: `Priority: ${checkoutData.urgency}. Target Clinic: ${checkoutData.clinicBranch}. Clinical Need: ${checkoutData.clinicalNotes}`,
      sanitizationCertified: true,
      donorSignatory: `${donorName} (Donor Logistics Officer)`,
      ngoSignatory: `${currentUser.name} (NGO Field Executive)`,
    };

    // Also generate request entries in Requests tab
    const newRequests: RequestItem[] = cart.map((c) => ({
      id: `req-${Date.now()}-${c.equipmentId}`,
      equipmentId: c.equipment.id,
      equipmentName: c.equipment.name,
      userId: currentUser.id,
      email: currentUser.email,
      requester: currentUser.name,
      organization: currentUser.organization,
      owner: c.equipment.owner_organization || c.equipment.owner_name || 'Equipment Provider',
      duration: 'Permanent Requisition',
      reason: checkoutData.clinicalNotes,
      status: 'Approved',
      date: isoDate,
      receiptId: receiptNumber,
    }));

    setRequests((prev) => [...newRequests, ...prev]);

    // Mark equipment as Allocated or update status
    const cartIds = new Set(cart.map((c) => c.equipmentId));
    setEquipment((prev) =>
      prev.map((e) => (cartIds.has(e.id) ? { ...e, status: 'Allocated' } : e))
    );

    // Save receipt & activity
    setReceipts((prev) => [newReceipt, ...prev]);
    addActivity(
      'Requisition Handover Receipt Generated',
      `Consignment receipt ${receiptNumber} issued for ${cart.length} equipment item(s).`,
      `Total certified fair market value: ₹${totalVal.toLocaleString('en-IN')} INR.`
    );

    setCart([]);
    setActiveReceiptModal(newReceipt);
    showToast('Requisition completed! Official E-Receipt generated.');

    return newReceipt;
  };

  const submitRequest = (duration: string, reason: string) => {
    if (!currentUser) {
      showToast('Please log in first.');
      return;
    }
    if (!selectedEquipment) {
      showToast('Please select equipment first.');
      return;
    }

    const newRequest: RequestItem = {
      id: Date.now().toString(),
      equipmentId: selectedEquipment.id,
      equipmentName: selectedEquipment.name,
      userId: currentUser.id,
      email: currentUser.email,
      requester: currentUser.name,
      organization: currentUser.organization,
      owner: selectedEquipment.owner_organization || selectedEquipment.owner_name || 'Equipment Provider',
      duration,
      reason,
      status: 'Pending',
      date: new Date().toISOString(),
    };

    setRequests((prev) => [newRequest, ...prev]);

    addActivity(
      'Equipment Requested',
      `Request submitted for ${selectedEquipment.name}.`,
      `Duration: ${duration}.`
    );

    showToast('Request submitted successfully!');
    showPage('requests');
  };

  const approveRequest = (requestId: string) => {
    const req = requests.find((r) => r.id === requestId);
    if (!req) return;

    const receiptNumber = `MB-REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const isoDate = new Date().toISOString();

    const eqItem = equipment.find((e) => e.id === req.equipmentId);
    const itemVal = eqItem?.estimated_value || 48000;

    const newReceipt: EReceipt = {
      receiptNumber,
      receiptType: 'consignment_handover',
      createdAt: isoDate,
      donor: {
        name: eqItem?.owner_name || 'Dr. Marcus Vance, MD',
        organization: eqItem?.owner_organization || 'Apex Biomedical Relief Alliance',
        email: 'donor@apexhealth.org',
        phone: '+91 98765 43210',
        location: eqItem?.location || 'New Delhi Central Depot',
        taxId: 'PAN: AACTM8821F / 80G: CIT(E)/BLR/80G/2023-24/A-1082',
      },
      ngo: {
        name: req.requester,
        organization: req.organization,
        email: req.email,
        phone: '+91 98765 43211',
        location: 'District Ward 7 Health Center, Maharashtra',
        clinicBranch: req.organization,
        registrationNumber: 'NGO Darpan: MH/2021/028192 · FCRA: 083781290',
      },
      items: [
        {
          id: req.equipmentId,
          name: req.equipmentName,
          category: eqItem?.category || 'Medical Equipment',
          condition: eqItem?.condition || 'Good',
          sharing_type: eqItem?.sharing_type || 'Donate',
          quantity: 1,
          estimatedValue: itemVal,
          serialNumber: eqItem?.serial_number || `SN-${Math.floor(10000 + Math.random() * 90000)}`,
        },
      ],
      totalValue: itemVal,
      verificationHash: `0x${Array.from({ length: 40 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}`,
      qrPayload: `https://medbridge.health/verify/receipt/${receiptNumber}?auth=valid&ts=${Date.now()}`,
      clinicalNotes: req.reason,
      sanitizationCertified: true,
      donorSignatory: `${eqItem?.owner_name || 'Donor Representative'} (Trustee)`,
      ngoSignatory: `${req.requester} (Authorizing Officer)`,
    };

    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'Approved', receiptId: receiptNumber } : r))
    );

    setReceipts((prev) => [newReceipt, ...prev]);
    setActiveReceiptModal(newReceipt);
    showToast(`Request approved! E-Receipt ${receiptNumber} generated.`);
  };

  const generateTaxReceiptForDonorItem = (equipmentId: string): EReceipt => {
    const item = equipment.find((e) => e.id === equipmentId);
    if (!item) throw new Error('Equipment not found');

    const receiptNumber = `MB-REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const isoDate = new Date().toISOString();
    const val = item.estimated_value || 48000;

    const newReceipt: EReceipt = {
      receiptNumber,
      receiptType: 'donation_tax_exempt',
      createdAt: isoDate,
      donor: {
        name: item.owner_name || currentUser?.name || 'Dr. Marcus Vance, MD',
        organization: item.owner_organization || currentUser?.organization || 'Apex Biomedical Relief Alliance',
        email: currentUser?.email || 'donor@apexhealth.org',
        phone: currentUser?.phone || '+91 98765 43210',
        location: item.location,
        taxId: 'PAN: AACTM8821F / 80G: CIT(E)/BLR/80G/2023-24/A-1082',
      },
      ngo: {
        name: 'MedBridge Relief Alliance',
        organization: 'Verified NGO Healthcare Consortium',
        email: 'support@medbridge.health',
        phone: '+91 1800 555 6332',
        location: 'Bengaluru Logistics Warehouse',
        clinicBranch: 'Rural & Outreach Health Network',
        registrationNumber: 'NGO Darpan: KA/2020/019821 · Section 12A/80G',
      },
      items: [
        {
          id: item.id,
          name: item.name,
          category: item.category,
          condition: item.condition,
          sharing_type: item.sharing_type,
          quantity: item.quantity,
          estimatedValue: val,
          serialNumber: item.serial_number || `SN-${Math.floor(10000 + Math.random() * 90000)}`,
        },
      ],
      totalValue: val * item.quantity,
      verificationHash: `0x${Array.from({ length: 40 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}`,
      qrPayload: `https://medbridge.health/verify/receipt/${receiptNumber}?auth=valid&ts=${Date.now()}`,
      clinicalNotes: 'Charitable in-kind equipment donation certified for Section 80G tax exemption under Income Tax Act.',
      sanitizationCertified: true,
      donorSignatory: `${item.owner_name || currentUser?.name} (Authorized Equipment Donor)`,
      ngoSignatory: 'MedBridge Clinical Inspection Authority',
    };

    setReceipts((prev) => [newReceipt, ...prev]);
    setActiveReceiptModal(newReceipt);
    showToast(`Section 80G Tax E-Receipt ${receiptNumber} generated!`);
    return newReceipt;
  };

  const openReceiptForEquipment = (equipmentId: string): EReceipt => {
    const item = equipment.find((e) => String(e.id) === String(equipmentId));
    if (!item) {
      showToast('Equipment not found.');
      throw new Error('Equipment not found');
    }

    // Check if an existing receipt covers this item
    const existing = receipts.find((r) =>
      r.items?.some((it) => String(it.id) === String(item.id) || it.serialNumber === item.serial_number)
    );

    if (existing) {
      setActiveReceiptModal(existing);
      showToast(`Opening verified E-Receipt: ${existing.receiptNumber}`);
      return existing;
    }

    // Otherwise generate and issue an immediate verified E-Receipt
    const receiptNumber = `MB-REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const isoDate = new Date().toISOString();
    const val = item.estimated_value || 48000;

    const newReceipt: EReceipt = {
      receiptNumber,
      receiptType: currentUser?.role === 'Donor' ? 'donation_tax_exempt' : 'consignment_handover',
      createdAt: isoDate,
      donor: {
        name: item.owner_name || 'Dr. Marcus Vance, MD',
        organization: item.owner_organization || 'Apex Biomedical Relief Alliance',
        email: 'donor@apexhealth.org',
        phone: '+91 98765 43210',
        location: item.location || 'New Delhi Central Depot',
        taxId: 'PAN: AACTM8821F / 80G: CIT(E)/BLR/80G/2023-24/A-1082',
      },
      ngo: {
        name: currentUser?.name || 'Sarah Chen, RN',
        organization: currentUser?.organization || 'Hope Horizon Rural Health Foundation',
        email: currentUser?.email || 'schen@hopehorizonhealth.org',
        phone: currentUser?.phone || '+91 98765 43211',
        location: currentUser?.location || 'District Ward 7 Health Center, Maharashtra',
        clinicBranch: currentUser?.organization || 'Maternal & Outreach Triage Unit',
        registrationNumber: 'NGO Darpan: MH/2021/028192 · FCRA: 083781290',
      },
      items: [
        {
          id: item.id,
          name: item.name,
          category: item.category,
          condition: item.condition,
          sharing_type: item.sharing_type,
          quantity: item.quantity || 1,
          estimatedValue: val,
          serialNumber: item.serial_number || `SN-${Math.floor(10000 + Math.random() * 90000)}`,
        },
      ],
      totalValue: val * (item.quantity || 1),
      verificationHash: `0x${Array.from({ length: 40 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}`,
      qrPayload: `https://medbridge.health/verify/receipt/${receiptNumber}?auth=valid&ts=${Date.now()}`,
      clinicalNotes: 'Verified official clinical consignment e-receipt recorded on MedBridge audited ledger.',
      sanitizationCertified: true,
      donorSignatory: `${item.owner_name || 'Dr. Marcus Vance'} (Donor Trustee)`,
      ngoSignatory: `${currentUser?.name || 'Sarah Chen, RN'} (Authorizing Officer)`,
    };

    setReceipts((prev) => [newReceipt, ...prev]);
    setActiveReceiptModal(newReceipt);
    showToast(`Official E-Receipt ${receiptNumber} generated!`);
    return newReceipt;
  };

  const generateSampleReceipt = (type: 'donation_tax_exempt' | 'consignment_handover' = 'consignment_handover'): EReceipt => {
    const receiptNumber = `MB-REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const isoDate = new Date().toISOString();
    const sample = equipment[0] || INITIAL_EQUIPMENT[0];
    const val = sample.estimated_value || 48000;

    const newReceipt: EReceipt = {
      receiptNumber,
      receiptType: type,
      createdAt: isoDate,
      donor: {
        name: 'Dr. Marcus Vance, MD',
        organization: 'Apex Biomedical Relief Alliance',
        email: 'donor@apexhealth.org',
        phone: '9876543210',
        location: 'Metropolitan Central Depot',
        taxId: 'EIN-47-8921408',
      },
      ngo: {
        name: currentUser?.name || 'Sarah Chen, RN',
        organization: currentUser?.organization || 'Hope Horizon Rural Health Foundation',
        email: currentUser?.email || 'schen@hopehorizonhealth.org',
        phone: currentUser?.phone || '9876543211',
        location: currentUser?.location || 'District Ward 7 Clinic',
        clinicBranch: 'Emergency Respiratory Ward',
        registrationNumber: 'NGO-FCRA-8829-MED',
      },
      items: [
        {
          id: sample.id,
          name: sample.name,
          category: sample.category,
          condition: sample.condition,
          sharing_type: sample.sharing_type,
          quantity: 1,
          estimatedValue: val,
          serialNumber: sample.serial_number || 'SN-O2-99412',
        },
      ],
      totalValue: val,
      verificationHash: `0x${Array.from({ length: 40 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}`,
      qrPayload: `https://medbridge.health/verify/receipt/${receiptNumber}?auth=valid&ts=${Date.now()}`,
      clinicalNotes: type === 'donation_tax_exempt'
        ? 'Official charitable gift-in-kind donation certified for Section 80G and IRS 501(c)(3) tax deductions.'
        : 'Emergency medical consignment handover for immediate triage deployment.',
      sanitizationCertified: true,
      donorSignatory: 'Dr. Marcus Vance (Director of Biomedical Surplus)',
      ngoSignatory: `${currentUser?.name || 'Sarah Chen, RN'} (Authorizing Officer)`,
    };

    setReceipts((prev) => [newReceipt, ...prev]);
    setActiveReceiptModal(newReceipt);
    showToast(`E-Receipt ${receiptNumber} generated!`);
    return newReceipt;
  };

  return (
    <MedBridgeContext.Provider
      value={{
        currentUser,
        currentPage,
        selectedRoleForAuth,
        authMode,
        setAuthMode,
        openAuth,
        backToRoles,
        quickDemoLogin,
        login,
        signup,
        logout,
        showPage,
        equipment,
        selectedEquipment,
        setSelectedEquipment,
        showDetails,
        openRequest,
        addEquipment,
        deleteEquipment,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        checkoutCart,
        requests,
        submitRequest,
        approveRequest,
        receipts,
        activeReceiptModal,
        setActiveReceiptModal,
        openReceiptForEquipment,
        generateSampleReceipt,
        generateTaxReceiptForDonorItem,
        activities,
        toastMessage,
        showToast,
        switchRolePersona,
      }}
    >
      {children}
    </MedBridgeContext.Provider>
  );
};

export const useMedBridge = () => {
  const context = useContext(MedBridgeContext);
  if (!context) {
    throw new Error('useMedBridge must be used within a MedBridgeProvider');
  }
  return context;
};
