import type { Domain, SubDomain, Competency, CompetencyItem } from '@/shared/types/skill-matrix.types';

export const generateDomains = (industry: string): Domain[] => {
  const domainTemplates: Record<string, Array<{ name: string; description: string }>> = {
    'Financial Services': [
      { name: 'Banking & Lending', description: 'Core banking operations including retail, corporate, and specialized lending services' },
      { name: 'Investment Management', description: 'Portfolio management, asset allocation, and investment advisory services' },
      { name: 'Risk & Compliance', description: 'Risk assessment, regulatory compliance, and audit functions' },
      { name: 'Payment Processing', description: 'Payment gateways, transaction processing, and settlement systems' },
      { name: 'Insurance Services', description: 'Policy management, claims processing, and underwriting' },
      { name: 'Wealth Management', description: 'High-net-worth client services and financial planning' },
    ],
    'Healthcare IT': [
      { name: 'Electronic Health Records (EHR)', description: 'Digital patient record systems and clinical documentation' },
      { name: 'Medical Imaging & Diagnostics', description: 'Imaging systems, PACS, and diagnostic tools' },
      { name: 'Healthcare Cybersecurity', description: 'Security of patient data and healthcare systems' },
      { name: 'Telemedicine & Remote Care', description: 'Virtual healthcare delivery and remote patient monitoring' },
      { name: 'Clinical Decision Support', description: 'AI-powered clinical guidance and diagnosis assistance' },
      { name: 'Health Information Exchange', description: 'Interoperability and data sharing between healthcare systems' },
    ],
    'E-commerce': [
      { name: 'Online Store Management', description: 'E-commerce platform operations and catalog management' },
      { name: 'Payment & Checkout', description: 'Payment processing, checkout optimization, and fraud prevention' },
      { name: 'Inventory & Logistics', description: 'Stock management, warehousing, and fulfillment operations' },
      { name: 'Customer Experience', description: 'UX design, personalization, and customer journey optimization' },
      { name: 'Marketing & SEO', description: 'Digital marketing, search optimization, and customer acquisition' },
      { name: 'Data Analytics', description: 'Business intelligence, customer analytics, and performance tracking' },
    ],
    'Technology & Software': [
      { name: 'Cloud Infrastructure', description: 'Cloud computing, infrastructure management, and DevOps' },
      { name: 'Software Development', description: 'Application development, architecture, and best practices' },
      { name: 'Data & AI', description: 'Data engineering, machine learning, and AI implementation' },
      { name: 'Cybersecurity', description: 'Security operations, threat management, and compliance' },
      { name: 'IT Operations', description: 'Systems management, monitoring, and infrastructure support' },
      { name: 'Quality Assurance', description: 'Testing, automation, and quality management' },
    ],
  };

  const templates = domainTemplates[industry] || domainTemplates['Technology & Software'];

  return templates.map((template, index) => ({
    id: `domain-${Date.now()}-${index}`,
    name: template.name,
    description: template.description,
    subDomains: [],
    subDomainsGenerated: false,
    isExpanded: false,
    isSelected: true,
  }));
};

export const generateSubDomains = (domainName: string): SubDomain[] => {
  const subDomainTemplates: Record<string, Array<{ name: string; description: string }>> = {
    // Financial Services
    'Banking & Lending': [
      { name: 'Retail Banking', description: 'Consumer banking services including deposits, loans, and personal finance' },
      { name: 'Corporate Banking', description: 'Business banking, corporate loans, and treasury services' },
      { name: 'Mortgage Lending', description: 'Home loans, refinancing, and mortgage servicing' },
      { name: 'Credit Risk Assessment', description: 'Credit scoring, risk modeling, and loan approval processes' },
    ],
    'Investment Management': [
      { name: 'Portfolio Management', description: 'Investment portfolio construction, monitoring, and rebalancing' },
      { name: 'Asset Allocation', description: 'Strategic asset allocation and investment strategy' },
      { name: 'Performance Analytics', description: 'Investment performance measurement and attribution analysis' },
      { name: 'Investment Research', description: 'Equity, fixed income, and alternative investment research' },
    ],
    'Risk & Compliance': [
      { name: 'Regulatory Compliance', description: 'Adherence to financial regulations and reporting obligations' },
      { name: 'Enterprise Risk Management', description: 'Identifying, assessing, and mitigating organizational risk' },
      { name: 'Internal Audit', description: 'Independent assurance and advisory activities' },
      { name: 'AML & KYC', description: 'Anti-money laundering and know-your-customer processes' },
    ],
    'Payment Processing': [
      { name: 'Payment Gateway Management', description: 'Integration and management of payment gateway services' },
      { name: 'Transaction Processing', description: 'Real-time payment authorization and settlement' },
      { name: 'Settlement & Reconciliation', description: 'End-of-day settlement and financial reconciliation' },
      { name: 'Fraud Prevention', description: 'Fraud detection, prevention, and chargeback management' },
    ],
    'Insurance Services': [
      { name: 'Policy Administration', description: 'Insurance policy lifecycle management and servicing' },
      { name: 'Claims Management', description: 'Claims intake, investigation, and settlement processes' },
      { name: 'Underwriting', description: 'Risk evaluation and premium determination' },
      { name: 'Actuarial Analysis', description: 'Statistical modeling for risk and rate setting' },
    ],
    'Wealth Management': [
      { name: 'Client Advisory', description: 'Personalized wealth planning and client relationship management' },
      { name: 'Financial Planning', description: 'Comprehensive financial plans including retirement and goals' },
      { name: 'Portfolio Strategy', description: 'Bespoke portfolio construction for high-net-worth clients' },
      { name: 'Tax & Estate Planning', description: 'Tax optimization strategies and estate management' },
    ],
    // Healthcare IT
    'Electronic Health Records (EHR)': [
      { name: 'EHR Implementation', description: 'System deployment and clinical workflow configuration' },
      { name: 'HL7/FHIR Integration', description: 'Healthcare data standards and interoperability protocols' },
      { name: 'Clinical Workflows', description: 'Clinical process optimization and workflow automation' },
      { name: 'Patient Portal Management', description: 'Patient access to health records and communications' },
    ],
    'Medical Imaging & Diagnostics': [
      { name: 'PACS & RIS Systems', description: 'Picture archiving and radiology information system management' },
      { name: 'Medical Image Analysis', description: 'Diagnostic imaging interpretation and QA processes' },
      { name: 'Diagnostic Reporting', description: 'Structured radiology and pathology report management' },
      { name: 'Radiology Workflows', description: 'End-to-end imaging workflow optimization' },
    ],
    'Healthcare Cybersecurity': [
      { name: 'HIPAA Compliance', description: 'Ensuring adherence to HIPAA privacy and security rules' },
      { name: 'PHI Protection', description: 'Safeguarding protected health information across systems' },
      { name: 'Security Operations', description: 'Monitoring, detecting, and responding to security threats' },
      { name: 'Incident Response', description: 'Healthcare-specific security incident handling and recovery' },
    ],
    'Telemedicine & Remote Care': [
      { name: 'Telehealth Platform Management', description: 'Virtual care platform configuration and operations' },
      { name: 'Remote Patient Monitoring', description: 'Connected device integration and patient data collection' },
      { name: 'Virtual Care Workflows', description: 'Digital care delivery processes and protocols' },
      { name: 'Patient Engagement', description: 'Digital patient activation and retention strategies' },
    ],
    'Clinical Decision Support': [
      { name: 'CDS Algorithm Development', description: 'Building clinical rules and alerting logic' },
      { name: 'Evidence-Based Medicine', description: 'Incorporating clinical guidelines into CDS tools' },
      { name: 'Clinical Analytics', description: 'Population health and outcomes analytics' },
      { name: 'Decision Rule Management', description: 'Maintaining and optimizing clinical decision rules' },
    ],
    'Health Information Exchange': [
      { name: 'Interoperability Standards', description: 'HL7, FHIR, and CCD/CDA standards implementation' },
      { name: 'Data Exchange Protocols', description: 'Secure clinical data sharing between organizations' },
      { name: 'Patient Identity Management', description: 'Master patient index and identity matching' },
      { name: 'HIE Governance', description: 'Policy, consent, and governance for health data sharing' },
    ],
    // E-commerce
    'Online Store Management': [
      { name: 'Product Catalog Management', description: 'Product information, categorization, and merchandising' },
      { name: 'Pricing & Promotions', description: 'Dynamic pricing, discounts, and promotional campaigns' },
      { name: 'Content Management', description: 'Website content, images, and product descriptions' },
      { name: 'Order Management', description: 'Order processing, fulfillment, and tracking systems' },
    ],
    'Payment & Checkout': [
      { name: 'Payment Gateway Integration', description: 'Connecting and managing payment provider APIs' },
      { name: 'Checkout Optimization', description: 'Reducing cart abandonment and improving conversion' },
      { name: 'PCI Compliance', description: 'Maintaining payment card industry security standards' },
      { name: 'Fraud Detection', description: 'Real-time order fraud scoring and prevention' },
    ],
    'Inventory & Logistics': [
      { name: 'Warehouse Management', description: 'Inventory tracking, bin management, and WMS operations' },
      { name: 'Supply Chain Operations', description: 'Vendor management, replenishment, and procurement' },
      { name: 'Fulfillment Operations', description: 'Pick, pack, ship, and last-mile delivery coordination' },
      { name: 'Returns Management', description: 'Reverse logistics, RMA processes, and restocking' },
    ],
    'Customer Experience': [
      { name: 'UX Research & Design', description: 'User research, journey mapping, and interface design' },
      { name: 'Personalization Engine', description: 'Recommendation algorithms and personalized experiences' },
      { name: 'Customer Support Operations', description: 'Multi-channel support, ticketing, and resolution' },
      { name: 'Experience Testing', description: 'A/B testing, usability testing, and CX measurement' },
    ],
    'Marketing & SEO': [
      { name: 'Search Engine Optimization', description: 'Organic search ranking, technical SEO, and content' },
      { name: 'Paid Advertising', description: 'SEM, social ads, and performance marketing campaigns' },
      { name: 'Email Marketing', description: 'Email campaign strategy, automation, and deliverability' },
      { name: 'Social & Content Marketing', description: 'Social media strategy and content marketing programs' },
    ],
    'Data Analytics': [
      { name: 'Customer Analytics', description: 'Behavioral analysis, segmentation, and lifetime value' },
      { name: 'Sales Reporting', description: 'Revenue dashboards, KPIs, and executive reporting' },
      { name: 'Conversion Optimization', description: 'Funnel analysis and conversion rate improvement' },
      { name: 'Predictive Analytics', description: 'Demand forecasting, churn prediction, and modeling' },
    ],
    // Technology & Software
    'Cloud Infrastructure': [
      { name: 'Compute Services', description: 'Virtual machines, containers, and serverless computing' },
      { name: 'Storage Solutions', description: 'Object storage, databases, and backup systems' },
      { name: 'Networking', description: 'VPCs, load balancing, and CDN management' },
      { name: 'Infrastructure as Code', description: 'Terraform, CloudFormation, and automation' },
    ],
    'Software Development': [
      { name: 'Frontend Development', description: 'User interface design and implementation' },
      { name: 'Backend Development', description: 'Server-side logic and API development' },
      { name: 'Mobile Development', description: 'iOS, Android, and cross-platform apps' },
      { name: 'DevOps & CI/CD', description: 'Continuous integration and deployment pipelines' },
    ],
    'Data & AI': [
      { name: 'Data Engineering', description: 'Data pipelines, ETL, and data warehousing' },
      { name: 'Machine Learning', description: 'ML model development and deployment' },
      { name: 'Data Analytics', description: 'Business intelligence and data visualization' },
      { name: 'Natural Language Processing', description: 'Text analysis and language models' },
    ],
    'Cybersecurity': [
      { name: 'Threat Intelligence', description: 'Gathering and analyzing threat data to prevent attacks' },
      { name: 'Penetration Testing', description: 'Ethical hacking and vulnerability assessment' },
      { name: 'Security Operations Center', description: 'SOC monitoring, triage, and incident management' },
      { name: 'Identity & Access Management', description: 'User identity, SSO, and access control systems' },
    ],
    'IT Operations': [
      { name: 'Systems Administration', description: 'Server, OS, and infrastructure administration' },
      { name: 'IT Service Management', description: 'ITIL-based service delivery and support' },
      { name: 'Monitoring & Alerting', description: 'Infrastructure and application observability' },
      { name: 'Disaster Recovery', description: 'Business continuity and DR planning and testing' },
    ],
    'Quality Assurance': [
      { name: 'Test Automation', description: 'Automated test framework development and maintenance' },
      { name: 'Manual Testing', description: 'Exploratory, functional, and regression testing' },
      { name: 'Performance Testing', description: 'Load, stress, and performance benchmarking' },
      { name: 'QA Process Management', description: 'Test strategy, metrics, and quality governance' },
    ],
  };

  const templates = subDomainTemplates[domainName] || [
    { name: 'Strategy & Planning', description: 'Strategic planning and roadmap for this domain' },
    { name: 'Implementation', description: 'Execution and deployment of domain initiatives' },
    { name: 'Operations & Support', description: 'Ongoing operations, support, and maintenance' },
    { name: 'Analytics & Optimization', description: 'Performance measurement and continuous improvement' },
  ];

  return templates.map((template, index) => ({
    id: `subdomain-${Date.now()}-${index}`,
    name: template.name,
    description: template.description,
    competencies: [],
    competenciesGenerated: false,
    isExpanded: false,
    isSelected: true,
  }));
};

export const generateCompetencies = (subDomainName: string): Competency[] => {
  type CompetencyTemplate = {
    name: string;
    description: string;
    skills: Array<{ name: string; description: string }>;
    knowledge: Array<{ name: string; description: string }>;
    attitudes: Array<{ name: string; description: string }>;
  };

  const makeItems = (arr: Array<{ name: string; description: string }>, prefix: string): CompetencyItem[] =>
    arr.map((item, i) => ({ id: `${prefix}-item-${Date.now()}-${i}`, ...item }));

  const templates: Record<string, CompetencyTemplate[]> = {
    // --- Financial Services ---
    'Retail Banking': [
      {
        name: 'Customer Account Management',
        description: 'Managing retail customer accounts and banking products',
        skills: [{ name: 'Account Servicing', description: 'Opening, maintaining, and closing customer accounts' }],
        knowledge: [{ name: 'Banking Products', description: 'Understanding of savings, loans, and deposit products' }],
        attitudes: [{ name: 'Customer Focus', description: 'Always prioritising the customer experience' }],
      },
      {
        name: 'Sales & Cross-Selling',
        description: 'Selling and cross-selling financial products to retail customers',
        skills: [{ name: 'Needs-Based Selling', description: 'Identifying and fulfilling customer financial needs' }],
        knowledge: [{ name: 'Product Features & Benefits', description: 'Deep knowledge of all retail banking products' }],
        attitudes: [{ name: 'Proactive Outreach', description: 'Taking initiative to engage customers with relevant offers' }],
      },
    ],
    'Corporate Banking': [
      {
        name: 'Corporate Lending',
        description: 'Structuring and managing corporate credit facilities',
        skills: [{ name: 'Credit Analysis', description: 'Assessing corporate creditworthiness and financials' }],
        knowledge: [{ name: 'Corporate Finance', description: 'Capital structure, leverage, and financial modelling' }],
        attitudes: [{ name: 'Risk Awareness', description: 'Balancing growth with prudent risk management' }],
      },
      {
        name: 'Treasury Services',
        description: 'Providing cash management and FX solutions to corporates',
        skills: [{ name: 'Cash Management', description: 'Pooling, sweeping, and liquidity management tools' }],
        knowledge: [{ name: 'Treasury Products', description: 'Trade finance, derivatives, and money market instruments' }],
        attitudes: [{ name: 'Precision & Accuracy', description: 'Zero-error mindset for financial transactions' }],
      },
    ],
    'Mortgage Lending': [
      {
        name: 'Mortgage Origination',
        description: 'End-to-end origination of residential mortgage loans',
        skills: [{ name: 'Application Processing', description: 'Collecting, reviewing, and verifying loan applications' }],
        knowledge: [{ name: 'Underwriting Guidelines', description: 'FNMA, FHLMC, and FHA lending criteria' }],
        attitudes: [{ name: 'Attention to Detail', description: 'Thorough review to avoid costly processing errors' }],
      },
    ],
    'Credit Risk Assessment': [
      {
        name: 'Credit Scoring & Modelling',
        description: 'Building and applying models to assess borrower risk',
        skills: [{ name: 'Scorecard Development', description: 'Building logistic regression and ML scorecards' }],
        knowledge: [{ name: 'Credit Bureau Data', description: 'Interpreting Equifax, Experian, and TransUnion data' }],
        attitudes: [{ name: 'Analytical Rigour', description: 'Evidence-based decision making over intuition' }],
      },
    ],
    'Portfolio Management': [
      {
        name: 'Portfolio Construction',
        description: 'Building diversified investment portfolios aligned to mandates',
        skills: [{ name: 'Asset Allocation', description: 'Strategic and tactical allocation across asset classes' }],
        knowledge: [{ name: 'Modern Portfolio Theory', description: 'Markowitz, Sharpe ratio, and efficient frontier' }],
        attitudes: [{ name: 'Long-Term Thinking', description: 'Disciplined focus on long-term risk-adjusted returns' }],
      },
    ],
    'Asset Allocation': [
      {
        name: 'Strategic Asset Allocation',
        description: 'Setting long-term target weights across asset classes',
        skills: [{ name: 'Optimisation Tools', description: 'Mean-variance optimisation and risk parity models' }],
        knowledge: [{ name: 'Macro Economics', description: 'Interest rates, inflation, and business cycle analysis' }],
        attitudes: [{ name: 'Discipline Under Volatility', description: 'Staying committed to strategy during market stress' }],
      },
    ],
    'Regulatory Compliance': [
      {
        name: 'Compliance Monitoring',
        description: 'Ongoing surveillance of regulatory obligations',
        skills: [{ name: 'Compliance Testing', description: 'Designing and executing controls testing programs' }],
        knowledge: [{ name: 'Financial Regulations', description: 'MiFID II, GDPR, SOX, and applicable local rules' }],
        attitudes: [{ name: 'Integrity', description: 'Acting with honesty and transparency at all times' }],
      },
    ],
    'AML & KYC': [
      {
        name: 'Customer Due Diligence',
        description: 'Verifying customer identity and assessing financial crime risk',
        skills: [{ name: 'KYC Screening', description: 'Running PEP, sanctions, and adverse media checks' }],
        knowledge: [{ name: 'AML Regulations', description: 'FATF guidelines, BSA/AML, and 6AMLD requirements' }],
        attitudes: [{ name: 'Vigilance', description: 'Persistent alertness to suspicious activity indicators' }],
      },
    ],
    'Payment Gateway Management': [
      {
        name: 'Gateway Integration',
        description: 'Connecting and configuring payment gateway APIs',
        skills: [{ name: 'API Integration', description: 'REST/SOAP gateway integration and testing' }],
        knowledge: [{ name: 'Payment Protocols', description: 'ISO 8583, ISO 20022, and tokenisation standards' }],
        attitudes: [{ name: 'Reliability Focus', description: 'Zero-downtime mindset for payment infrastructure' }],
      },
    ],
    // --- Healthcare IT ---
    'EHR Implementation': [
      {
        name: 'EHR System Deployment',
        description: 'Configuring and rolling out EHR platforms in clinical settings',
        skills: [{ name: 'System Configuration', description: 'Build and configure workflows in Epic, Cerner, or Meditech' }],
        knowledge: [{ name: 'Clinical Workflow Design', description: 'Understanding physician and nurse workflow requirements' }],
        attitudes: [{ name: 'Change Facilitation', description: 'Supporting clinical staff through system transitions' }],
      },
      {
        name: 'Go-Live Support',
        description: 'Providing at-the-elbow support during EHR launch',
        skills: [{ name: 'Issue Triage', description: 'Rapidly diagnosing and resolving go-live incidents' }],
        knowledge: [{ name: 'Rollback Procedures', description: 'Downtime protocols and system rollback plans' }],
        attitudes: [{ name: 'Calm Under Pressure', description: 'Maintaining composure during high-stress launch periods' }],
      },
    ],
    'HL7/FHIR Integration': [
      {
        name: 'Healthcare Interoperability',
        description: 'Enabling seamless clinical data exchange between systems',
        skills: [{ name: 'FHIR API Development', description: 'Building and consuming FHIR R4 RESTful APIs' }],
        knowledge: [{ name: 'FHIR Resource Model', description: 'Patient, Observation, Condition, and other FHIR resources' }],
        attitudes: [{ name: 'Standards Commitment', description: 'Strict adherence to healthcare interoperability standards' }],
      },
    ],
    'Clinical Workflows': [
      {
        name: 'Workflow Analysis & Optimisation',
        description: 'Streamlining clinical processes for efficiency and safety',
        skills: [{ name: 'Process Mapping', description: 'Mapping current and future state clinical workflows (swim lanes, BPMN)' }],
        knowledge: [{ name: 'Clinical Roles & Responsibilities', description: 'Physician, nurse, pharmacist, and admin workflow needs' }],
        attitudes: [{ name: 'Patient Safety First', description: 'Designing workflows that minimise clinical risk' }],
      },
    ],
    'HIPAA Compliance': [
      {
        name: 'PHI Safeguards',
        description: 'Implementing administrative, physical, and technical HIPAA safeguards',
        skills: [{ name: 'Risk Analysis', description: 'Conducting HIPAA Security Rule risk assessments' }],
        knowledge: [{ name: 'HIPAA Privacy Rule', description: 'PHI use, disclosure, and patient rights requirements' }],
        attitudes: [{ name: 'Privacy Champion', description: 'Embedding privacy protection into all work activities' }],
      },
    ],
    'Telehealth Platform Management': [
      {
        name: 'Virtual Care Operations',
        description: 'Running and optimising telehealth platforms for clinical use',
        skills: [{ name: 'Platform Administration', description: 'Configuring Zoom Health, Teladoc, or Doxy.me platforms' }],
        knowledge: [{ name: 'Telehealth Regulations', description: 'State licensure, Ryan Haight Act, and CMS telehealth rules' }],
        attitudes: [{ name: 'Patient Accessibility', description: 'Ensuring equitable access for all patient populations' }],
      },
    ],
    'CDS Algorithm Development': [
      {
        name: 'Clinical Decision Rule Engineering',
        description: 'Building evidence-based clinical alerts and order sets',
        skills: [{ name: 'Rule Authoring', description: 'Writing CDS Hooks and EHR-native alert logic' }],
        knowledge: [{ name: 'Evidence-Based Guidelines', description: 'USPSTF, ACC/AHA, and specialty society guidelines' }],
        attitudes: [{ name: 'Clinical Partnership', description: 'Co-designing rules with frontline clinicians' }],
      },
    ],
    'Interoperability Standards': [
      {
        name: 'Health Data Exchange',
        description: 'Implementing standards for secure clinical data sharing',
        skills: [{ name: 'CCD/CDA Document Assembly', description: 'Generating consolidated clinical documents for transitions of care' }],
        knowledge: [{ name: '21st Century Cures Act', description: 'Information blocking rules and TEFCA requirements' }],
        attitudes: [{ name: 'Openness to Collaboration', description: 'Commitment to sharing data for better patient outcomes' }],
      },
    ],
    // --- E-commerce ---
    'Product Catalog Management': [
      {
        name: 'Product Data Management',
        description: 'Maintaining accurate and complete product information',
        skills: [{ name: 'PIM System Operation', description: 'Managing product data in Akeneo, Salsify, or Shopify' }],
        knowledge: [{ name: 'Taxonomy & Categorisation', description: 'Category hierarchy design and product classification' }],
        attitudes: [{ name: 'Data Quality Ownership', description: 'Taking pride in clean, consistent product data' }],
      },
      {
        name: 'Merchandising Strategy',
        description: 'Curating and promoting product assortments to drive sales',
        skills: [{ name: 'Product Ranking & Boosting', description: 'Configuring rules for search and category sort order' }],
        knowledge: [{ name: 'Consumer Behaviour', description: 'Purchase patterns, seasonality, and demand signals' }],
        attitudes: [{ name: 'Commercial Curiosity', description: 'Constant drive to understand what sells and why' }],
      },
    ],
    'Payment Gateway Integration': [
      {
        name: 'Checkout Payment Integration',
        description: 'Integrating payment providers into e-commerce checkout flows',
        skills: [{ name: 'SDK & API Integration', description: 'Integrating Stripe, PayPal, or Braintree SDKs' }],
        knowledge: [{ name: 'PCI DSS', description: 'Payment Card Industry Data Security Standard requirements' }],
        attitudes: [{ name: 'Security Consciousness', description: 'Never compromising on payment data security' }],
      },
    ],
    'Warehouse Management': [
      {
        name: 'WMS Operations',
        description: 'Running warehouse management system for efficient fulfilment',
        skills: [{ name: 'Inbound & Receiving', description: 'ASN processing, putaway, and inventory receipt' }],
        knowledge: [{ name: 'Inventory Control', description: 'Cycle counting, shrinkage tracking, and stock accuracy' }],
        attitudes: [{ name: 'Operational Excellence', description: 'Continuous drive to improve throughput and accuracy' }],
      },
    ],
    'UX Research & Design': [
      {
        name: 'User Research',
        description: 'Understanding user needs through research methods',
        skills: [{ name: 'User Interviews', description: 'Planning and conducting qualitative user interviews' }],
        knowledge: [{ name: 'Research Methods', description: 'Surveys, card sorting, tree testing, and diary studies' }],
        attitudes: [{ name: 'Empathy for Users', description: 'Genuine curiosity about user goals, needs, and frustrations' }],
      },
    ],
    'Search Engine Optimization': [
      {
        name: 'Technical & On-Page SEO',
        description: 'Optimising site structure and content for organic search',
        skills: [{ name: 'Technical SEO Auditing', description: 'Crawl analysis, Core Web Vitals, and structured data' }],
        knowledge: [{ name: 'Search Engine Algorithms', description: 'Google ranking factors and algorithm update impacts' }],
        attitudes: [{ name: 'Data-Driven Optimisation', description: 'Making SEO decisions based on data and testing' }],
      },
    ],
    'Customer Analytics': [
      {
        name: 'Behavioural Analytics',
        description: 'Analysing customer behaviour to drive business decisions',
        skills: [{ name: 'Funnel Analysis', description: 'Building and interpreting acquisition and conversion funnels' }],
        knowledge: [{ name: 'Analytics Platforms', description: 'Google Analytics 4, Mixpanel, and Amplitude' }],
        attitudes: [{ name: 'Insight Storytelling', description: 'Translating data findings into clear business recommendations' }],
      },
    ],
    // --- Technology & Software ---
    'Compute Services': [
      {
        name: 'Cloud Compute Management',
        description: 'Provisioning and managing cloud compute resources',
        skills: [{ name: 'VM & Container Deployment', description: 'Launching EC2, Azure VMs, GKE, and ECS workloads' }],
        knowledge: [{ name: 'Cloud Pricing Models', description: 'On-demand, reserved, spot, and savings plan pricing' }],
        attitudes: [{ name: 'Cost Ownership', description: 'Taking responsibility for cloud spend optimisation' }],
      },
    ],
    'Storage Solutions': [
      {
        name: 'Cloud Storage Management',
        description: 'Designing and managing cloud storage for reliability and cost',
        skills: [{ name: 'Object Storage Operations', description: 'Managing S3, Blob Storage, and GCS buckets and policies' }],
        knowledge: [{ name: 'Storage Classes', description: 'Hot, cool, archive, and intelligent-tiering storage options' }],
        attitudes: [{ name: 'Data Protection Mindset', description: 'Never treating data durability as a secondary concern' }],
      },
    ],
    'Infrastructure as Code': [
      {
        name: 'IaC Development & Automation',
        description: 'Codifying and automating infrastructure provisioning',
        skills: [{ name: 'Terraform Development', description: 'Writing Terraform modules, state management, and workspaces' }],
        knowledge: [{ name: 'IaC Patterns', description: 'DRY modules, remote state, and workspace strategies' }],
        attitudes: [{ name: 'Everything as Code', description: 'Commitment to eliminating manual infrastructure changes' }],
      },
    ],
    'Frontend Development': [
      {
        name: 'UI Engineering',
        description: 'Building performant and accessible web user interfaces',
        skills: [{ name: 'Component Development', description: 'Building reusable React/Vue components with TypeScript' }],
        knowledge: [{ name: 'Browser Internals', description: 'Critical rendering path, layout, and paint performance' }],
        attitudes: [{ name: 'Craft & Quality', description: 'Taking pride in pixel-perfect, performant UI delivery' }],
      },
      {
        name: 'Frontend Testing',
        description: 'Ensuring frontend reliability through automated testing',
        skills: [{ name: 'Unit & Integration Testing', description: 'Writing Jest and React Testing Library test suites' }],
        knowledge: [{ name: 'Testing Pyramid', description: 'Balancing unit, integration, and E2E test coverage' }],
        attitudes: [{ name: 'Test-First Mindset', description: 'Writing tests as a core part of feature development' }],
      },
    ],
    'Backend Development': [
      {
        name: 'API Design & Development',
        description: 'Building scalable and secure server-side APIs',
        skills: [{ name: 'REST & GraphQL APIs', description: 'Designing and implementing API contracts and resolvers' }],
        knowledge: [{ name: 'Auth & Authorisation', description: 'JWT, OAuth 2.0, RBAC, and ABAC security patterns' }],
        attitudes: [{ name: 'Security By Design', description: 'Embedding security considerations from the first line of code' }],
      },
      {
        name: 'Backend Performance',
        description: 'Optimising server-side performance and scalability',
        skills: [{ name: 'Caching Strategies', description: 'Redis, Memcached, and CDN caching for read-heavy workloads' }],
        knowledge: [{ name: 'Concurrency Models', description: 'Thread pools, async/await, and event-loop patterns' }],
        attitudes: [{ name: 'Performance Ownership', description: 'Continuously profiling and improving system performance' }],
      },
    ],
    'Mobile Development': [
      {
        name: 'Cross-Platform Mobile Engineering',
        description: 'Building mobile apps for iOS and Android with shared codebase',
        skills: [{ name: 'React Native / Flutter', description: 'Building cross-platform apps with native-like performance' }],
        knowledge: [{ name: 'Mobile UX Patterns', description: 'Platform-specific design guidelines (HIG, Material Design)' }],
        attitudes: [{ name: 'Device Empathy', description: 'Testing on real devices to understand real user experience' }],
      },
    ],
    'DevOps & CI/CD': [
      {
        name: 'CI/CD Pipeline Engineering',
        description: 'Building automated software delivery pipelines',
        skills: [{ name: 'Pipeline Authoring', description: 'Writing GitHub Actions, GitLab CI, or Jenkins pipelines' }],
        knowledge: [{ name: 'Deployment Strategies', description: 'Blue/green, canary, and rolling deployment patterns' }],
        attitudes: [{ name: 'Automate Everything', description: 'Eliminating toil through ruthless automation' }],
      },
    ],
    'Data Engineering': [
      {
        name: 'Data Pipeline Development',
        description: 'Building reliable data ingestion and transformation pipelines',
        skills: [{ name: 'ETL/ELT Development', description: 'Building pipelines with Apache Spark, dbt, or Glue' }],
        knowledge: [{ name: 'Data Warehouse Design', description: 'Kimball, Data Vault, and medallion architecture patterns' }],
        attitudes: [{ name: 'Data Reliability', description: 'Treating data pipelines with the same rigour as production code' }],
      },
      {
        name: 'Data Quality & Governance',
        description: 'Ensuring data is accurate, consistent, and well-documented',
        skills: [{ name: 'Data Quality Testing', description: 'Great Expectations and dbt tests for data validation' }],
        knowledge: [{ name: 'Data Lineage', description: 'Tracking data provenance end-to-end across systems' }],
        attitudes: [{ name: 'Stewardship Mindset', description: 'Taking personal ownership of data quality in your domain' }],
      },
    ],
    'Machine Learning': [
      {
        name: 'Model Development',
        description: 'Building, training, and evaluating machine learning models',
        skills: [{ name: 'Feature Engineering', description: 'Creating informative features from raw data' }],
        knowledge: [{ name: 'ML Algorithms', description: 'Gradient boosting, neural nets, clustering, and recommender systems' }],
        attitudes: [{ name: 'Hypothesis-Driven', description: 'Treating ML development as structured experimentation' }],
      },
      {
        name: 'MLOps & Model Deployment',
        description: 'Deploying and monitoring ML models in production',
        skills: [{ name: 'Model Serving', description: 'Deploying models via FastAPI, TorchServe, or SageMaker endpoints' }],
        knowledge: [{ name: 'ML Pipelines', description: 'Kubeflow, SageMaker Pipelines, and Vertex AI for end-to-end ML' }],
        attitudes: [{ name: 'Production Accountability', description: 'Owning model performance from training all the way to production' }],
      },
    ],
    'Natural Language Processing': [
      {
        name: 'NLP Model Development',
        description: 'Building language understanding and generation systems',
        skills: [{ name: 'Text Pre-processing', description: 'Tokenisation, lemmatisation, and text normalisation pipelines' }],
        knowledge: [{ name: 'Transformer Architecture', description: 'Attention mechanisms, embeddings, and pre-trained models' }],
        attitudes: [{ name: 'Responsible AI', description: 'Proactively addressing bias, hallucination, and safety risks' }],
      },
    ],
    'Threat Intelligence': [
      {
        name: 'Cyber Threat Analysis',
        description: 'Gathering and analysing threat intelligence to defend against attacks',
        skills: [{ name: 'OSINT Collection', description: 'Open-source intelligence gathering from dark web and threat feeds' }],
        knowledge: [{ name: 'MITRE ATT&CK', description: 'Adversary tactics, techniques, and procedures framework' }],
        attitudes: [{ name: 'Proactive Defence', description: 'Anticipating threats rather than only reacting to them' }],
      },
    ],
    'Penetration Testing': [
      {
        name: 'Ethical Hacking',
        description: 'Identifying vulnerabilities through authorised offensive security testing',
        skills: [{ name: 'Vulnerability Scanning', description: 'Running Nessus, Qualys, or Burp Suite scans and interpreting results' }],
        knowledge: [{ name: 'OWASP Top 10', description: 'Web application vulnerability categories and remediation' }],
        attitudes: [{ name: 'Responsible Disclosure', description: 'Handling findings with professionalism and confidentiality' }],
      },
    ],
    'Test Automation': [
      {
        name: 'Automated Test Framework Development',
        description: 'Building scalable test automation frameworks',
        skills: [{ name: 'Framework Architecture', description: 'Page Object Model, screenplay pattern, and test helpers' }],
        knowledge: [{ name: 'Test Tools', description: 'Selenium, Playwright, Appium, and API testing tools' }],
        attitudes: [{ name: 'Quality Advocacy', description: 'Championing quality as everyone\'s responsibility, not just QA' }],
      },
    ],
    'default': [
      {
        name: 'Domain Expertise',
        description: 'Core knowledge and application skills for this domain area',
        skills: [{ name: 'Applied Domain Skills', description: 'Hands-on execution of core domain tasks and tools' }],
        knowledge: [{ name: 'Domain Fundamentals', description: 'Conceptual understanding of key domain principles' }],
        attitudes: [{ name: 'Continuous Learning', description: 'Commitment to keeping skills current in a fast-changing domain' }],
      },
      {
        name: 'Collaboration & Communication',
        description: 'Working effectively with stakeholders and team members',
        skills: [{ name: 'Stakeholder Engagement', description: 'Facilitating workshops, demos, and feedback sessions' }],
        knowledge: [{ name: 'Agile & Scrum', description: 'Agile ceremonies, artefacts, and team rituals' }],
        attitudes: [{ name: 'Team-First Attitude', description: 'Prioritising team success over individual recognition' }],
      },
    ],
  };

  const competencyTemplates = templates[subDomainName] || templates['default'];

  return competencyTemplates.map((ct, index) => ({
    id: `competency-${Date.now()}-${index}`,
    name: ct.name,
    description: ct.description,
    skills: makeItems(ct.skills, `${index}-skill`),
    knowledge: makeItems(ct.knowledge, `${index}-knowledge`),
    attitudes: makeItems(ct.attitudes, `${index}-attitude`),
    isExpanded: false,
  }));
};

// Color mapping for skill categories - supports both light and dark themes
export const getCategoryColors = (category: string): { bg: string; text: string; border: string; darkBg: string; darkText: string; darkBorder: string } => {
  const colorMap: Record<string, { bg: string; text: string; border: string; darkBg: string; darkText: string; darkBorder: string }> = {
    'Skill': {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      border: 'border-blue-300',
      darkBg: 'dark:bg-blue-900/30',
      darkText: 'dark:text-blue-300',
      darkBorder: 'dark:border-blue-700',
    },
    'Knowledge': {
      bg: 'bg-purple-100',
      text: 'text-purple-700',
      border: 'border-purple-300',
      darkBg: 'dark:bg-purple-900/30',
      darkText: 'dark:text-purple-300',
      darkBorder: 'dark:border-purple-700',
    },
    'Attitude': {
      bg: 'bg-amber-100',
      text: 'text-amber-700',
      border: 'border-amber-300',
      darkBg: 'dark:bg-amber-900/30',
      darkText: 'dark:text-amber-300',
      darkBorder: 'dark:border-amber-700',
    },
  };
  return colorMap[category] || {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-300',
    darkBg: 'dark:bg-gray-800',
    darkText: 'dark:text-gray-300',
    darkBorder: 'dark:border-gray-600',
  };
};

export const getCategoryColorClass = (category: string): string => {
  const colors = getCategoryColors(category);
  return `${colors.bg} ${colors.text} ${colors.border} ${colors.darkBg} ${colors.darkText} ${colors.darkBorder}`;
};

// Proficiency level colors
export const getProficiencyColors = (level: string): string => {
  const colorMap: Record<string, string> = {
    'Beginner': 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
    'Intermediate': 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
    'Advanced': 'bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700',
    'Expert': 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700',
  };
  return colorMap[level] || colorMap['Beginner'];
};
