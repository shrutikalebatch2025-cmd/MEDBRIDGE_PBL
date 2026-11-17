export type UserRole = 'Donor' | 'NGO / Hospital';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  organization: string;
  organizationType?: string;
  role: UserRole;
  location: string;
}

export type EquipmentCategory =
  | 'Diagnostic'
  | 'Monitoring'
  | 'Mobility'
  | 'Surgical'
  | 'Respiratory'
  | 'Other';

export type EquipmentCondition = 'New' | 'Good' | 'Used' | 'Needs Repair';

export type EquipmentSharingType = 'Donate' | 'Lend' | 'Rent';

export type EquipmentStatus = 'Available' | 'Pending' | 'Rejected' | 'Allocated';

export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  condition: EquipmentCondition;
  sharing_type: EquipmentSharingType;
  quantity: number;
  location: string;
  description: string;
  status: EquipmentStatus;
  created_at: string;
  estimated_value?: number;
  serial_number?: string;
  model?: string;
  image_url?: string;
  owner_id?: string;
  owner_name?: string;
  owner_organization?: string;
  owner_role?: string;
}

export interface CartItem {
  equipmentId: string;
  equipment: Equipment;
  quantityRequested: number;
  urgency: 'Routine' | 'Urgent' | 'Critical Emergency';
  clinicBranch: string;
  purpose: string;
}

export interface RequestItem {
  id: string;
  equipmentId: string;
  equipmentName: string;
  userId: string;
  email: string;
  requester: string;
  organization: string;
  owner: string;
  duration: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
  receiptId?: string;
}

export interface EReceipt {
  receiptNumber: string;
  receiptType: 'donation_tax_exempt' | 'consignment_handover';
  createdAt: string;
  donor: {
    id?: string;
    name: string;
    organization: string;
    email: string;
    phone: string;
    location: string;
    taxId: string;
  };
  ngo: {
    id?: string;
    name: string;
    organization: string;
    email: string;
    phone: string;
    location: string;
    clinicBranch: string;
    registrationNumber: string;
  };
  items: {
    id: string;
    name: string;
    category: string;
    condition: string;
    sharing_type: string;
    quantity: number;
    estimatedValue: number;
    serialNumber: string;
  }[];
  totalValue: number;
  verificationHash: string;
  qrPayload: string;
  clinicalNotes: string;
  sanitizationCertified: boolean;
  donorSignatory: string;
  ngoSignatory: string;
}

export interface Activity {
  id: number;
  userId: string;
  email: string;
  title: string;
  details: string;
  extra?: string;
  date: string;
}
