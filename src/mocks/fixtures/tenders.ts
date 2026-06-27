/**
 * Sample tender fixtures — covers all categories + statuses.
 */

import type { Tender } from '@/types';

const now = new Date();
function daysFromNow(days: number): string {
  const d = new Date(now);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export const sampleTenders: Tender[] = [
  {
    id: 'tnd_001',
    reference: 'RFT-2026-0142',
    title: 'Renewable Energy Microgrid Installation — Regional Council',
    category: 'construction',
    description:
      'Design, supply, and installation of a 2.4 MW solar microgrid with battery storage for the Northern Tablelands Regional Council. Includes grid interconnection, SCADA integration, and 5-year operations & maintenance contract.',
    buyer: 'Northern Tablelands Regional Council',
    contact: {
      name: 'Dr. Helena Marsh',
      email: 'procurement@ntrc.gov.au',
      phone: '+61 2 6771 2300',
    },
    status: 'open',
    publishedAt: daysFromNow(-21),
    closingAt: daysFromNow(14),
    estimatedValue: { amount: 4_200_000_00, currency: 'AUD' },
    location: 'Northern Tablelands, NSW',
    documentRequirements: [
      {
        id: 'req_001',
        name: 'Company Profile & Experience',
        description: 'Recent experience on comparable microgrid projects (>500 kW).',
        required: true,
        acceptedTypes: ['application/pdf'],
        maxSizeMB: 25,
      },
      {
        id: 'req_002',
        name: 'Financial Statements (3 years)',
        description: 'Audited financials for the last three financial years.',
        required: true,
        acceptedTypes: ['application/pdf'],
        maxSizeMB: 50,
      },
      {
        id: 'req_003',
        name: 'Public Liability Insurance Certificate',
        description: 'Minimum $20M cover. Must be valid through contract end.',
        required: true,
        acceptedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
        maxSizeMB: 10,
      },
      {
        id: 'req_004',
        name: 'Technical Proposal',
        description: 'Detailed technical design and methodology.',
        required: true,
        acceptedTypes: ['application/pdf'],
        maxSizeMB: 100,
      },
    ],
  },
  {
    id: 'tnd_002',
    reference: 'RFT-2026-0155',
    title: 'Cloud Migration & Modernisation — Department of Education',
    category: 'it_services',
    description:
      'Migration of legacy on-premises education management systems to Azure. Includes re-architecture of three core applications, data migration, and 12 months of post-migration support.',
    buyer: 'Department of Education, Skills & Employment',
    contact: {
      name: 'Marcus Lin',
      email: 'tenders@des.e.gov.au',
    },
    status: 'closing_soon',
    publishedAt: daysFromNow(-35),
    closingAt: daysFromNow(4),
    estimatedValue: { amount: 1_850_000_00, currency: 'AUD' },
    location: 'Canberra, ACT (with national scope)',
    documentRequirements: [
      {
        id: 'req_005',
        name: 'Company Profile',
        description: 'Including relevant Azure migration experience.',
        required: true,
        acceptedTypes: ['application/pdf'],
        maxSizeMB: 15,
      },
      {
        id: 'req_006',
        name: 'IRAP Assessment Documentation',
        description: 'Current IRAP certification or assessment for OFFICIAL: Sensitive workloads.',
        required: true,
        acceptedTypes: ['application/pdf'],
        maxSizeMB: 25,
      },
      {
        id: 'req_007',
        name: 'Pricing Schedule (completed)',
        description: 'Use the supplied pricing schedule template.',
        required: true,
        acceptedTypes: ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        maxSizeMB: 10,
      },
    ],
  },
  {
    id: 'tnd_003',
    reference: 'RFT-2026-0163',
    title: 'Strategic Advisory — Waste-to-Energy Feasibility Study',
    category: 'consulting',
    description:
      'Independent strategic advisory services for a feasibility study into waste-to-energy infrastructure. Includes stakeholder engagement, technical assessment, financial modelling, and final recommendations.',
    buyer: 'Metropolitan Waste Authority',
    contact: {
      name: 'Priya Anand',
      email: 'p.anand@mwa.gov.au',
      phone: '+61 3 8694 1100',
    },
    status: 'open',
    publishedAt: daysFromNow(-7),
    closingAt: daysFromNow(28),
    estimatedValue: { amount: 380_000_00, currency: 'AUD' },
    location: 'Melbourne, VIC',
    documentRequirements: [
      {
        id: 'req_008',
        name: 'Capability Statement',
        description: 'Including CVs of proposed team members.',
        required: true,
        acceptedTypes: ['application/pdf'],
        maxSizeMB: 30,
      },
      {
        id: 'req_009',
        name: 'Insurance Certificates',
        description: 'Professional indemnity and public liability.',
        required: true,
        acceptedTypes: ['application/pdf'],
        maxSizeMB: 10,
      },
    ],
  },
  {
    id: 'tnd_004',
    reference: 'RFT-2026-0170',
    title: 'Office Supplies — Standing Offer (3-year)',
    category: 'supplies',
    description:
      'Standing offer arrangement for office consumables, stationery, and break-room supplies across 14 metropolitan sites. Award term of 3 years with two optional 12-month extensions.',
    buyer: 'State Procurement Office',
    contact: { name: 'Office of State Procurement', email: 'tenders@spo.gov.au' },
    status: 'open',
    publishedAt: daysFromNow(-3),
    closingAt: daysFromNow(45),
    estimatedValue: { amount: 720_000_00, currency: 'AUD' },
    location: 'Statewide',
    documentRequirements: [
      {
        id: 'req_010',
        name: 'Product Catalogue & Pricing',
        description: 'Full catalogue with volume-tiered pricing.',
        required: true,
        acceptedTypes: ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        maxSizeMB: 50,
      },
    ],
  },
  {
    id: 'tnd_005',
    reference: 'RFT-2026-0128',
    title: 'Heritage Building Restoration — Town Hall',
    category: 'maintenance',
    description:
      'Conservation and restoration works on the heritage-listed Town Hall facade, including stonework, window frames, and roof.',
    buyer: 'City of Bayside',
    contact: { name: 'Heritage Officer', email: 'heritage@bayside.gov.au' },
    status: 'closed',
    publishedAt: daysFromNow(-60),
    closingAt: daysFromNow(-2),
    estimatedValue: { amount: 1_200_000_00, currency: 'AUD' },
        location: 'Bayside, VIC',
        documentRequirements: [],
      },
    ];