import { Planet } from '../types';

export const rdPlanets: Planet[] = [
  {
    id: 'DES-001',
    name: 'AI辅助设计',
    description: '智能UI/UX设计辅助',
    icon: 'Palette',
    size: 120,
    color: '#4fc3f7',
    iconColor: '#ffffff',
    gradient: 'radial-gradient(circle at 30% 30%, #4fc3f7, #0d47a1)',
    textColor: '#0d1b2a',
    statusCount: '4 ZONES',
    territories: [
      {
        id: 'des-001-1',
        name: '装备应用站',
        description: 'AI设计工具集成平台',
        icon: 'Rocket',
        color: '#4fc3f7',
        markers: ['Figma AI插件', 'Sketch助手', '设计协作平台'],
        facilities: [
          { name: '智能配色推荐', status: 'online' },
          { name: '布局自动生成', status: 'online' },
          { name: '设计稿转代码', status: 'dev' },
          { name: '组件智能识别', status: 'plan' }
        ]
      },
      {
        id: 'des-001-2',
        name: '技能训练基地',
        description: '设计相关AI技能集合',
        icon: 'Brain',
        color: '#ab47bc',
        markers: ['UI生成', '图标设计', '配色方案'],
        facilities: [
          { name: 'UI界面生成', status: 'online' },
          { name: '智能配色', status: 'online' },
          { name: '图标自动生成', status: 'dev' },
          { name: '响应式适配', status: 'dev' },
          { name: '动效设计助手', status: 'plan' }
        ]
      },
      {
        id: 'des-001-3',
        name: 'MCP工具港',
        description: '设计流程AI工具链',
        icon: 'PuzzlePiece',
        color: '#ffd54f',
        markers: ['设计规范', '素材库', '原型工具'],
        facilities: [
          { name: '设计规范检测', status: 'online' },
          { name: '素材智能搜索', status: 'dev' },
          { name: '原型快速生成', status: 'plan' }
        ]
      },
      {
        id: 'des-001-4',
        name: '最佳实践档案馆',
        description: 'AI辅助设计最佳实践',
        icon: 'Star',
        color: '#69f0ae',
        markers: ['设计模式', '组件库', '协作流程'],
        facilities: [
          { name: '设计模式库', status: 'online' },
          { name: '组件库管理', status: 'online' },
          { name: '设计评审流程', status: 'dev' }
        ]
      }
    ]
  },
  {
    id: 'ARCH-002',
    name: 'AI辅助软件实现设计',
    description: '代码架构设计智能推荐',
    icon: 'Network',
    size: 110,
    color: '#29b6f6',
    iconColor: '#ffffff',
    gradient: 'radial-gradient(circle at 30% 30%, #29b6f6, #0277bd)',
    textColor: '#0d1b2a',
    statusCount: '4 ZONES',
    territories: [
      {
        id: 'arch-002-1',
        name: '装备应用站',
        description: '架构设计AI工具集成',
        icon: 'Rocket',
        color: '#4fc3f7',
        markers: ['架构设计器', 'UML工具', '需求分析'],
        facilities: [
          { name: '架构图自动生成', status: 'online' },
          { name: '需求智能分析', status: 'online' },
          { name: '技术选型推荐', status: 'dev' },
          { name: '依赖关系分析', status: 'plan' }
        ]
      },
      {
        id: 'arch-002-2',
        name: '技能训练基地',
        description: '软件设计相关AI技能',
        icon: 'Brain',
        color: '#ab47bc',
        markers: ['架构生成', '方案推荐', '代码模板'],
        facilities: [
          { name: '架构方案生成', status: 'online' },
          { name: '代码模板库', status: 'online' },
          { name: '接口设计助手', status: 'dev' },
          { name: '数据库设计', status: 'dev' },
          { name: '性能预估分析', status: 'plan' }
        ]
      },
      {
        id: 'arch-002-3',
        name: 'MCP工具港',
        description: '软件设计流程工具链',
        icon: 'PuzzlePiece',
        color: '#ffd54f',
        markers: ['UML集成', '文档生成', '评审工具'],
        facilities: [
          { name: 'UML图生成', status: 'online' },
          { name: '设计文档生成', status: 'dev' },
          { name: '架构评审助手', status: 'plan' }
        ]
      },
      {
        id: 'arch-002-4',
        name: '最佳实践档案馆',
        description: '软件实现设计最佳实践',
        icon: 'Star',
        color: '#69f0ae',
        markers: ['设计原则', '架构模式', '代码规范'],
        facilities: [
          { name: '设计原则库', status: 'online' },
          { name: '架构模式参考', status: 'online' },
          { name: '代码规范检查', status: 'dev' }
        ]
      }
    ]
  },
  {
    id: 'AR-003',
    name: 'AI辅助AR代码生成',
    description: '增强现实应用代码生成',
    icon: 'Box',
    size: 100,
    color: '#7e57c2',
    iconColor: '#ffffff',
    gradient: 'radial-gradient(circle at 30% 30%, #7e57c2, #4527a0)',
    textColor: '#ffffff',
    statusCount: '4 ZONES',
    territories: [
      {
        id: 'ar-003-1',
        name: '装备应用站',
        description: 'AR开发AI工具集成',
        icon: 'Rocket',
        color: '#4fc3f7',
        markers: ['AR引擎', '3D建模', '场景编辑'],
        facilities: [
          { name: 'AR场景生成', status: 'online' },
          { name: '3D模型导入', status: 'online' },
          { name: '交互逻辑生成', status: 'dev' },
          { name: '物理模拟', status: 'plan' }
        ]
      },
      {
        id: 'ar-003-2',
        name: '技能训练基地',
        description: 'AR代码生成相关AI技能',
        icon: 'Brain',
        color: '#ab47bc',
        markers: ['场景构建', '交互设计', '渲染优化'],
        facilities: [
          { name: 'AR场景代码生成', status: 'online' },
          { name: '手势识别集成', status: 'dev' },
          { name: '渲染优化建议', status: 'dev' },
          { name: '跨平台适配', status: 'plan' }
        ]
      },
      {
        id: 'ar-003-3',
        name: 'MCP工具港',
        description: 'AR开发工具链',
        icon: 'PuzzlePiece',
        color: '#ffd54f',
        markers: ['ARKit/ARCore', 'Unity集成', '调试工具'],
        facilities: [
          { name: 'ARKit接口封装', status: 'online' },
          { name: 'Unity插件集成', status: 'dev' },
          { name: 'AR调试助手', status: 'plan' }
        ]
      },
      {
        id: 'ar-003-4',
        name: '最佳实践档案馆',
        description: 'AR开发最佳实践',
        icon: 'Star',
        color: '#69f0ae',
        markers: ['性能优化', '用户体验', '交互设计'],
        facilities: [
          { name: 'AR性能优化指南', status: 'online' },
          { name: '交互设计规范', status: 'dev' },
          { name: '用户体验评估', status: 'plan' }
        ]
      }
    ]
  },
  {
    id: 'DEV-TEST-004',
    name: 'AI辅助开发者测试',
    description: '自动化测试用例生成执行',
    icon: 'FlaskConical',
    size: 95,
    color: '#26a69a',
    iconColor: '#ffffff',
    gradient: 'radial-gradient(circle at 30% 30%, #26a69a, #00796b)',
    textColor: '#ffffff',
    statusCount: '4 ZONES',
    territories: [
      {
        id: 'dev-test-004-1',
        name: '装备应用站',
        description: '测试开发AI工具集成',
        icon: 'Rocket',
        color: '#4fc3f7',
        markers: ['测试框架', 'Mock工具', '覆盖率分析'],
        facilities: [
          { name: '测试用例生成', status: 'online' },
          { name: 'Mock数据生成', status: 'online' },
          { name: '覆盖率分析', status: 'dev' },
          { name: '测试报告生成', status: 'dev' }
        ]
      },
      {
        id: 'dev-test-004-2',
        name: '技能训练基地',
        description: '开发者测试相关AI技能',
        icon: 'Brain',
        color: '#ab47bc',
        markers: ['用例生成', '断言编写', '测试执行'],
        facilities: [
          { name: '单元测试生成', status: 'online' },
          { name: '集成测试生成', status: 'online' },
          { name: '断言智能编写', status: 'dev' },
          { name: '测试数据准备', status: 'dev' },
          { name: '边界条件分析', status: 'plan' }
        ]
      },
      {
        id: 'dev-test-004-3',
        name: 'MCP工具港',
        description: '测试开发工具链',
        icon: 'PuzzlePiece',
        color: '#ffd54f',
        markers: ['Jest/Mocha', '测试框架', 'CI集成'],
        facilities: [
          { name: 'Jest插件集成', status: 'online' },
          { name: 'Mocha适配', status: 'dev' },
          { name: 'CI测试集成', status: 'online' }
        ]
      },
      {
        id: 'dev-test-004-4',
        name: '最佳实践档案馆',
        description: '开发者测试最佳实践',
        icon: 'Star',
        color: '#69f0ae',
        markers: ['测试策略', '代码覆盖率', 'Mock技巧'],
        facilities: [
          { name: '测试策略模板', status: 'online' },
          { name: '覆盖率目标设定', status: 'online' },
          { name: 'Mock最佳实践', status: 'dev' }
        ]
      }
    ]
  },
  {
    id: 'CODE-CHK-005',
    name: 'AI辅助代码检查',
    description: '代码质量智能分析改进',
    icon: 'Microscope',
    size: 90,
    color: '#ef5350',
    iconColor: '#ffffff',
    gradient: 'radial-gradient(circle at 30% 30%, #ef5350, #c62828)',
    textColor: '#ffffff',
    statusCount: '4 ZONES',
    territories: [
      {
        id: 'code-chk-005-1',
        name: '装备应用站',
        description: '代码检查AI工具集成',
        icon: 'Rocket',
        color: '#4fc3f7',
        markers: ['静态分析', 'Lint工具', 'Review平台'],
        facilities: [
          { name: '代码静态分析', status: 'online' },
          { name: 'Lint规则智能配置', status: 'online' },
          { name: '代码Review助手', status: 'dev' },
          { name: '质量报告生成', status: 'dev' }
        ]
      },
      {
        id: 'code-chk-005-2',
        name: '技能训练基地',
        description: '代码检查相关AI技能',
        icon: 'Brain',
        color: '#ab47bc',
        markers: ['质量分析', '规范检查', '问题检测'],
        facilities: [
          { name: '代码质量评分', status: 'online' },
          { name: '规范自动检查', status: 'online' },
          { name: '潜在问题检测', status: 'online' },
          { name: '改进建议生成', status: 'dev' },
          { name: '复杂度分析', status: 'dev' }
        ]
      },
      {
        id: 'code-chk-005-3',
        name: 'MCP工具港',
        description: '代码检查工具链',
        icon: 'PuzzlePiece',
        color: '#ffd54f',
        markers: ['ESLint/SonarQube', 'Git集成', 'CI检查'],
        facilities: [
          { name: 'ESLint智能配置', status: 'online' },
          { name: 'SonarQube集成', status: 'dev' },
          { name: 'Git MR检查', status: 'online' }
        ]
      },
      {
        id: 'code-chk-005-4',
        name: '最佳实践档案馆',
        description: '代码检查最佳实践',
        icon: 'Star',
        color: '#69f0ae',
        markers: ['检查规范', 'Review流程', '质量门禁'],
        facilities: [
          { name: '代码检查规范', status: 'online' },
          { name: 'Review流程模板', status: 'online' },
          { name: '质量门禁设置', status: 'dev' }
        ]
      }
    ]
  },
  {
    id: 'TEST-006',
    name: 'AI辅助测试',
    description: '全流程测试智能化支持',
    icon: 'ClipboardCheck',
    size: 85,
    color: '#5c6bc0',
    iconColor: '#ffffff',
    gradient: 'radial-gradient(circle at 30% 30%, #5c6bc0, #3949ab)',
    textColor: '#ffffff',
    statusCount: '4 ZONES',
    territories: [
      {
        id: 'test-006-1',
        name: '装备应用站',
        description: '测试流程AI工具集成',
        icon: 'Rocket',
        color: '#4fc3f7',
        markers: ['测试平台', '自动化框架', '报告系统'],
        facilities: [
          { name: '自动化测试平台', status: 'online' },
          { name: '测试框架集成', status: 'online' },
          { name: '测试报告系统', status: 'online' },
          { name: '缺陷追踪', status: 'dev' }
        ]
      },
      {
        id: 'test-006-2',
        name: '技能训练基地',
        description: '测试相关AI技能集合',
        icon: 'Brain',
        color: '#ab47bc',
        markers: ['用例设计', '自动化执行', '缺陷分析'],
        facilities: [
          { name: '测试用例智能设计', status: 'online' },
          { name: '自动化脚本生成', status: 'online' },
          { name: '缺陷智能分析', status: 'dev' },
          { name: '回归测试优化', status: 'dev' },
          { name: '性能测试助手', status: 'plan' }
        ]
      },
      {
        id: 'test-006-3',
        name: 'MCP工具港',
        description: '测试流程工具链',
        icon: 'PuzzlePiece',
        color: '#ffd54f',
        markers: ['Selenium/Appium', 'CI集成', '测试管理'],
        facilities: [
          { name: 'Selenium集成', status: 'online' },
          { name: 'Appium适配', status: 'dev' },
          { name: '测试管理平台', status: 'online' }
        ]
      },
      {
        id: 'test-006-4',
        name: '最佳实践档案馆',
        description: '测试流程最佳实践',
        icon: 'Star',
        color: '#69f0ae',
        markers: ['测试策略', '自动化实践', '质量保障'],
        facilities: [
          { name: '测试策略模板', status: 'online' },
          { name: '自动化实践指南', status: 'online' },
          { name: '质量保障流程', status: 'dev' }
        ]
      }
    ]
  }
];

export const digitalPlanets: Planet[] = [
  {
    id: 'CIE-007',
    name: 'CIE-持续构建工程师',
    description: 'CI/CD流程智能管理',
    icon: 'Infinity',
    size: 115,
    color: '#ff7043',
    iconColor: '#ffffff',
    gradient: 'radial-gradient(circle at 30% 30%, #ff7043, #d84315)',
    textColor: '#ffffff',
    statusCount: '4 ZONES',
    territories: [
      {
        id: 'cie-007-1',
        name: '装备应用站',
        description: 'CI/CD工具集成',
        icon: 'Rocket',
        color: '#ff7043',
        markers: ['Jenkins/GitLab', '构建平台', '流水线'],
        facilities: [
          { name: '流水线智能编排', status: 'online' },
          { name: '构建优化', status: 'online' },
          { name: '制品管理', status: 'dev' },
          { name: '环境自动化', status: 'dev' }
        ]
      },
      {
        id: 'cie-007-2',
        name: '技能训练基地',
        description: '持续构建相关AI技能',
        icon: 'Brain',
        color: '#ab47bc',
        markers: ['流水线生成', '构建诊断', '发布管理'],
        facilities: [
          { name: '流水线自动生成', status: 'online' },
          { name: '构建失败诊断', status: 'online' },
          { name: '发布策略推荐', status: 'dev' },
          { name: '容量规划', status: 'plan' }
        ]
      },
      {
        id: 'cie-007-3',
        name: 'MCP工具港',
        description: 'CI/CD工具链',
        icon: 'PuzzlePiece',
        color: '#ffd54f',
        markers: ['Jenkins集成', '容器化', '云平台'],
        facilities: [
          { name: 'Jenkins插件', status: 'online' },
          { name: 'Docker集成', status: 'online' },
          { name: 'K8s部署助手', status: 'dev' }
        ]
      },
      {
        id: 'cie-007-4',
        name: '最佳实践档案馆',
        description: '持续构建最佳实践',
        icon: 'Star',
        color: '#69f0ae',
        markers: ['流水线规范', '构建策略', '质量门禁'],
        facilities: [
          { name: '流水线规范库', status: 'online' },
          { name: '构建策略模板', status: 'online' },
          { name: '质量门禁实践', status: 'dev' }
        ]
      }
    ]
  },
  {
    id: 'SRE-008',
    name: 'SRE-运维工程师',
    description: '系统运维智能监控',
    icon: 'Network',
    size: 105,
    color: '#66bb6a',
    iconColor: '#ffffff',
    gradient: 'radial-gradient(circle at 30% 30%, #66bb6a, #388e3c)',
    textColor: '#ffffff',
    statusCount: '4 ZONES',
    territories: [
      {
        id: 'sre-008-1',
        name: '装备应用站',
        description: '运维监控工具集成',
        icon: 'Rocket',
        color: '#66bb6a',
        markers: ['监控系统', '日志平台', '告警系统'],
        facilities: [
          { name: '智能监控系统', status: 'online' },
          { name: '日志分析平台', status: 'online' },
          { name: '告警智能聚合', status: 'dev' },
          { name: '容量预测', status: 'plan' }
        ]
      },
      {
        id: 'sre-008-2',
        name: '技能训练基地',
        description: '运维相关AI技能',
        icon: 'Brain',
        color: '#ab47bc',
        markers: ['故障诊断', '容量规划', '自动化运维'],
        facilities: [
          { name: '故障智能诊断', status: 'online' },
          { name: '根因分析', status: 'online' },
          { name: '自动化修复', status: 'dev' },
          { name: '容量预警', status: 'dev' },
          { name: '成本优化', status: 'plan' }
        ]
      },
      {
        id: 'sre-008-3',
        name: 'MCP工具港',
        description: '运维工具链',
        icon: 'PuzzlePiece',
        color: '#ffd54f',
        markers: ['Prometheus', 'Grafana', 'Ansible'],
        facilities: [
          { name: 'Prometheus集成', status: 'online' },
          { name: 'Grafana仪表盘', status: 'online' },
          { name: 'Ansible自动化', status: 'dev' }
        ]
      },
      {
        id: 'sre-008-4',
        name: '最佳实践档案馆',
        description: '运维最佳实践',
        icon: 'Star',
        color: '#69f0ae',
        markers: ['SLA管理', '故障处理', '容量管理'],
        facilities: [
          { name: 'SLA管理规范', status: 'online' },
          { name: '故障处理手册', status: 'online' },
          { name: '容量管理流程', status: 'dev' }
        ]
      }
    ]
  },
  {
    id: 'TE-009',
    name: 'TE-测试工程师',
    description: '测试流程智能化保障',
    icon: 'ClipboardCheck',
    size: 95,
    color: '#42a5f5',
    iconColor: '#ffffff',
    gradient: 'radial-gradient(circle at 30% 30%, #42a5f5, #1976d2)',
    textColor: '#ffffff',
    statusCount: '4 ZONES',
    territories: [
      {
        id: 'te-009-1',
        name: '装备应用站',
        description: '测试管理工具集成',
        icon: 'Rocket',
        color: '#42a5f5',
        markers: ['测试平台', '缺陷管理', '报告系统'],
        facilities: [
          { name: '测试管理平台', status: 'online' },
          { name: '缺陷追踪系统', status: 'online' },
          { name: '测试报告生成', status: 'online' },
          { name: '质量度量', status: 'dev' }
        ]
      },
      {
        id: 'te-009-2',
        name: '技能训练基地',
        description: '测试工程师AI技能',
        icon: 'Brain',
        color: '#ab47bc',
        markers: ['测试设计', '缺陷分析', '质量评估'],
        facilities: [
          { name: '测试方案生成', status: 'online' },
          { name: '缺陷根因分析', status: 'online' },
          { name: '质量风险评估', status: 'dev' },
          { name: '回归策略优化', status: 'dev' },
          { name: '测试数据管理', status: 'plan' }
        ]
      },
      {
        id: 'te-009-3',
        name: 'MCP工具港',
        description: '测试工具链',
        icon: 'PuzzlePiece',
        color: '#ffd54f',
        markers: ['JIRA集成', '测试框架', '数据管理'],
        facilities: [
          { name: 'JIRA集成', status: 'online' },
          { name: '测试框架适配', status: 'online' },
          { name: '测试数据工具', status: 'dev' }
        ]
      },
      {
        id: 'te-009-4',
        name: '最佳实践档案馆',
        description: '测试工程师最佳实践',
        icon: 'Star',
        color: '#69f0ae',
        markers: ['测试流程', '质量标准', '团队协作'],
        facilities: [
          { name: '测试流程规范', status: 'online' },
          { name: '质量标准定义', status: 'online' },
          { name: '协作最佳实践', status: 'dev' }
        ]
      }
    ]
  },
  {
    id: 'SEC-010',
    name: 'SEC-安全工程师',
    description: '安全防护智能检测响应',
    icon: 'Shield',
    size: 90,
    color: '#ec407a',
    iconColor: '#ffffff',
    gradient: 'radial-gradient(circle at 30% 30%, #ec407a, #c2185b)',
    textColor: '#ffffff',
    statusCount: '4 ZONES',
    territories: [
      {
        id: 'sec-010-1',
        name: '装备应用站',
        description: '安全工具集成',
        icon: 'Rocket',
        color: '#ec407a',
        markers: ['漏洞扫描', '安全监控', '合规检查'],
        facilities: [
          { name: '漏洞智能扫描', status: 'online' },
          { name: '安全监控系统', status: 'online' },
          { name: '合规自动检查', status: 'dev' },
          { name: '威胁情报', status: 'plan' }
        ]
      },
      {
        id: 'sec-010-2',
        name: '技能训练基地',
        description: '安全工程师AI技能',
        icon: 'Brain',
        color: '#ab47bc',
        markers: ['漏洞分析', '威胁检测', '安全审计'],
        facilities: [
          { name: '漏洞智能分析', status: 'online' },
          { name: '威胁自动检测', status: 'online' },
          { name: '安全审计助手', status: 'dev' },
          { name: '风险评估', status: 'dev' },
          { name: '安全策略生成', status: 'plan' }
        ]
      },
      {
        id: 'sec-010-3',
        name: 'MCP工具港',
        description: '安全工具链',
        icon: 'PuzzlePiece',
        color: '#ffd54f',
        markers: ['SonarQube', '安全框架', '审计工具'],
        facilities: [
          { name: '安全扫描集成', status: 'online' },
          { name: '安全框架适配', status: 'dev' },
          { name: '审计日志分析', status: 'online' }
        ]
      },
      {
        id: 'sec-010-4',
        name: '最佳实践档案馆',
        description: '安全工程师最佳实践',
        icon: 'Star',
        color: '#69f0ae',
        markers: ['安全规范', '漏洞处理', '合规流程'],
        facilities: [
          { name: '安全编码规范', status: 'online' },
          { name: '漏洞处理流程', status: 'online' },
          { name: '合规审计流程', status: 'dev' }
        ]
      }
    ]
  }
];
