import { getToken } from '../../utils/serviceToken';

const API_BASE = (() => {
  const env = (import.meta as any).env?.VITE_API_URL;
  if (env && typeof env === 'string') {
    return env.replace(/\/+$/, '');
  }
  return '';
})();

export interface Organization {
  id: string;
  name: string;
  description?: string;
  status?: string;
}

export interface OrganizationResponse {
  organization: Organization;
  membership: {
    position?: string;
    joined_at?: string;
  };
}

export interface MyOrganizationsResponse {
  items: OrganizationResponse[];
}

export async function getMyOrganizations(): Promise<OrganizationResponse[]> {
  try {
    const token = getToken();
    const url = API_BASE ? `${API_BASE}/api/v1/organizations/my` : `/api/v1/organizations/my`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch organizations: ${response.statusText}`);
    }

    const data: MyOrganizationsResponse = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error fetching organizations:', error);
    throw error;
  }
}

export function saveSelectedOrganization(organizationId: string): void {
  localStorage.setItem('selectedOrganizationId', organizationId);
}

export function getSelectedOrganizationId(): string | null {
  return localStorage.getItem('selectedOrganizationId');
}

export function removeSelectedOrganization(): void {
  localStorage.removeItem('selectedOrganizationId');
}
