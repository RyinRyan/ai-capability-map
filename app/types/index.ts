export interface Facility {
  name: string;
  status: 'online' | 'dev' | 'plan';
  link?: string;
}

export interface Territory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  markers: string[];
  facilities: Facility[];
}

export interface Planet {
  id: string;
  name: string;
  description: string;
  icon: string;
  size: number;
  color: string;
  iconColor: string;
  gradient: string;
  textColor: string;
  statusCount: string;
  territories: Territory[];
}

export type GalaxyType = 'rd' | 'digital';

export interface GalaxyData {
  rd: Planet[];
  digital: Planet[];
}
