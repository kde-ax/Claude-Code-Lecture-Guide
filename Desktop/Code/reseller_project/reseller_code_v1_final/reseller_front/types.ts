
export enum RiskLevel {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
  Safe = 'Safe',
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface AnalysisResult {
  id: string;
  customerName: string;
  customerContact: string;
  orderAddress: string;
  orderId: string;
  orderDate: string;
  riskLevel: RiskLevel;
  reason: string;
}

export interface AnalysisStats {
  totalOrders: number;
  suspectedResellers: number;
  highRiskOrders: number;
}

export interface BlacklistItem {
  result: AnalysisResult;
  memo: string;
  addedAt: string;
}

export interface IpAnalysisResult {
  id: string;
  ip: string;
  orderCount: number;
  uniqueAddresses: number;
  uniquePhones: number;
  uniqueRecipients: number;
  suspicionScore: number;
  riskLevel: 'High' | 'Medium' | 'Low'| 'Safe';
  avgIntervalDays: number;
  recipients: string[];
  addresses: string[];
  phones: string[];
  orderDetails?: Array<{  
    recipient: string;
    datetime: string;
    address: string;
  }>;
  reason: string;
}

export interface IpAnalysisStats {
  totalIps: number;
  suspiciousIps: number;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
}


export type BlacklistRiskLevel = 'Blacklist' | 'Suspicious' | 'High' | 'All';

export interface OrderDetail {
    orderId: string;
    orderDate: string;
    product: string;
    quantity: number;
    address: string;
}

export interface BlacklistResult {
    orderId: string;
    customerName: string;
    customerContact: string;
    orderAddress: string;
    orderDate: string;
    quantity: number;
    productName: string;
    riskLevel: 'Blacklist' | 'Suspicious' | 'High';
    reason: string;
    orderDetails: OrderDetail[];
    totalOrderCount: number;
}

export interface BlacklistStats {
    totalOrders: number;
    blacklistCount: number;
    suspiciousCount: number;
    highRiskCount: number;
    totalFlagged: number;
}