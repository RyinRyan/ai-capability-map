// 设施项目
export interface Facility {
  name: string;
  status: 'online' | 'dev' | 'plan';
  link?: string;
}

// 二级能力 (Territory)
export interface Territory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  markers: string[];
  facilities: Facility[];
}

// 一级能力 (Planet)
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

// 星域类型
export type GalaxyType = 'rd' | 'digital';

// 星域数据
export interface GalaxyData {
  rd: Planet[];
  digital: Planet[];
}
