export type TermsBlock =
  | { type: "text"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | {
      type: "definitions";
      items: { term: string; definition: string }[];
    };

export type TermsSection = {
  number: number;
  title: string;
  blocks: TermsBlock[];
};

export const PREAMBLE: string[] = [
  'These terms and conditions of use (\u201CTerms\u201D) govern access to and use of the CarbonLeafs platform, application, website, dashboards, services, tools, and related technologies (collectively, the \u201CPlatform\u201D). The Platform is operated and managed by Phina Forge Ltd, a company incorporated and operating under the laws of the Republic of Rwanda (\u201CPhina Forge\u201D, \u201Cwe\u201D, \u201Cus\u201D, or \u201Cour\u201D). By creating an account, accessing, registering on, or using CarbonLeafs, you (\u201CUser\u201D, \u201Cyou\u201D, or \u201Cyour\u201D) acknowledge that you have read, understood, and agree to be legally bound by these terms, together with our privacy policy and any additional terms applicable to specific CarbonLeafs services.',
  "If you do not agree to these Terms, you must not access or use CarbonLeafs.",
];

export const SECTIONS: TermsSection[] = [
  {
    number: 1,
    title: "Definitions",
    blocks: [
      {
        type: "definitions",
        items: [
          {
            term: "CarbonLeafs",
            definition:
              "means the digital carbon asset management, monitoring, reporting, verification, data management, and carbon-market platform operated by Phina Forge Ltd.",
          },
          {
            term: "Platform",
            definition:
              "means the CarbonLeafs website, web application, mobile application, APIs, databases, dashboards, software, services, and associated technologies.",
          },
          {
            term: "User",
            definition:
              "means any person or organization authorized to access or use CarbonLeafs.",
          },
          {
            term: "Project Owner",
            definition:
              "means an individual, company, cooperative, organization, institution, or other entity that registers or manages a carbon project through CarbonLeafs.",
          },
          {
            term: "Project",
            definition:
              "means a climate, environmental, emissions-reduction, carbon-removal, or sustainability activity registered or managed through CarbonLeafs.",
          },
          {
            term: "Participant",
            definition:
              "means a person or organization participating in a Project, including farmers, landowners, EV users, households, communities, or other beneficiaries.",
          },
          {
            term: "Field Officer",
            definition:
              "means an authorized person responsible for collecting, entering, reviewing, or submitting field-level project data.",
          },
          {
            term: "Verifier",
            definition:
              "means an authorized individual or organization responsible for reviewing project information, evidence, calculations, monitoring records, or other information for verification purposes.",
          },
          {
            term: "Buyer",
            definition:
              "means an individual, company, organization, institution, investor, or other authorized party interested in purchasing or acquiring carbon assets or related environmental attributes through CarbonLeafs.",
          },
          {
            term: "Administrator",
            definition:
              "means a person authorized by Phina Forge or an authorized organization to manage accounts, projects, permissions, workflows, records, or other Platform functions.",
          },
          {
            term: "Carbon Asset",
            definition:
              "means a carbon credit, emission reduction, removal unit, environmental attribute, mitigation outcome, or other carbon-market asset represented or managed through CarbonLeafs.",
          },
          {
            term: "Project Data",
            definition:
              "means information relating to a Project, including project descriptions, monitoring data, measurements, GPS information, photographs, documents, surveys, activity data, emission data, calculations, verification records, and other project information.",
          },
          {
            term: "Personal Data",
            definition:
              "means information relating to an identified or identifiable individual as defined under applicable data-protection law.",
          },
          {
            term: "Content",
            definition:
              "means information, documents, photographs, videos, records, text, data, reports, calculations, and other materials submitted to or generated through CarbonLeafs.",
          },
        ],
      },
    ],
  },
  {
    number: 2,
    title: "Acceptance of These Terms",
    blocks: [
      {
        type: "text",
        text: "By using CarbonLeafs, you confirm that:",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "You have the legal capacity required to enter into these Terms;",
          "The information you provide is accurate and complete;",
          "You will comply with these Terms and applicable laws;",
          "You will use the Platform only for lawful purposes;",
          "You will not misuse or attempt to compromise the Platform; and",
          "You understand that CarbonLeafs is a technology platform and does not automatically guarantee the issuance, certification, verification, sale, or financial value of any carbon asset.",
        ],
      },
      {
        type: "text",
        text: "Where a User is accessing CarbonLeafs on behalf of an organization, that User represents that they have authority to bind the organization to these Terms.",
      },
    ],
  },
  {
    number: 3,
    title: "Eligibility and Authorized Use",
    blocks: [
      {
        type: "text",
        text: "CarbonLeafs may be used by authorized persons and organizations participating in or supporting environmental and carbon-market activities. Access may be provided to different categories of users, including:",
      },
      {
        type: "list",
        items: [
          "Project Owners;",
          "Farmers and Project Participants;",
          "Field Officers;",
          "Verifiers;",
          "Buyers;",
          "Administrators;",
          "Project managers;",
          "Partner organizations;",
          "Consultants; and",
          "Other authorized Users.",
        ],
      },
      {
        type: "text",
        text: "Phina Forge may establish different permissions, access levels, and functionalities for different User categories. A User must not access functionality that has not been authorized for their account.",
      },
    ],
  },
  {
    number: 4,
    title: "User Accounts",
    blocks: [
      {
        type: "text",
        text: "Users may be required to create an account to access certain CarbonLeafs functions. Users are responsible for:",
      },
      {
        type: "list",
        items: [
          "Providing truthful and accurate registration information;",
          "Maintaining the confidentiality of login credentials;",
          "Protecting passwords and authentication information;",
          "Ensuring that account information remains current;",
          "Immediately reporting suspected unauthorized access; and",
          "All activities conducted through their account, subject to applicable law.",
        ],
      },
      {
        type: "text",
        text: "Users must not:",
      },
      {
        type: "list",
        items: [
          "Share their account credentials with unauthorized persons;",
          "Create accounts using false identities;",
          "Impersonate another person or organization;",
          "Create multiple accounts for fraudulent purposes; or",
          "Attempt to obtain unauthorized access to another User\u2019s account.",
        ],
      },
      {
        type: "text",
        text: "Phina Forge may suspend or restrict an account where there are reasonable grounds to believe that the account is being misused or presents a security, legal, or operational risk.",
      },
    ],
  },
  {
    number: 5,
    title: "User Roles and Responsibilities",
    blocks: [
      {
        type: "heading",
        text: "5.1 Project Owners",
      },
      {
        type: "text",
        text: "Project Owners are responsible for:",
      },
      {
        type: "list",
        items: [
          "Providing accurate Project information;",
          "Obtaining necessary permissions and consents;",
          "Ensuring that Project activities comply with applicable laws;",
          "Ensuring that submitted data is truthful and supportable;",
          "Maintaining appropriate records and evidence;",
          "Informing Participants about relevant data collection;",
          "Ensuring that carbon rights and ownership arrangements are properly documented; and",
          "Responding to requests for clarification or additional evidence.",
        ],
      },
      {
        type: "text",
        text: "CarbonLeafs does not assume ownership of a Project merely because the Project is registered on the Platform.",
      },
      {
        type: "heading",
        text: "5.2 Project Participants",
      },
      {
        type: "text",
        text: "Participants are responsible for providing truthful information and cooperating with authorized monitoring, verification, and data-collection activities.",
      },
      {
        type: "text",
        text: "Participants must not intentionally submit false information, manipulate measurements, fabricate evidence, or claim ownership of environmental attributes they do not legally own.",
      },
      {
        type: "text",
        text: "Where consent is required for the collection or processing of Personal Data, appropriate consent or another lawful basis must be obtained.",
      },
      {
        type: "heading",
        text: "5.3 Field Officers",
      },
      {
        type: "text",
        text: "Field Officers may be responsible for:",
      },
      {
        type: "list",
        items: [
          "Conducting field surveys;",
          "Collecting project information;",
          "Recording GPS or location information;",
          "Uploading photographs and supporting evidence;",
          "Conducting monitoring activities;",
          "Recording measurements;",
          "Updating assigned project records; and",
          "Reporting discrepancies or suspected fraud.",
        ],
      },
      {
        type: "text",
        text: "Field Officers must accurately record information and must not intentionally alter, fabricate, duplicate, or misrepresent field evidence.",
      },
      {
        type: "heading",
        text: "5.4 Verifiers",
      },
      {
        type: "text",
        text: "Verifiers may review Project information, supporting documents, field evidence, calculations, monitoring records, and other relevant information. A verifier must:",
      },
      {
        type: "list",
        items: [
          "Conduct reviews objectively;",
          "Record findings accurately;",
          "Identify inconsistencies;",
          "Avoid knowingly approving fraudulent information;",
          "Maintain confidentiality; and",
          "Disclose conflicts of interest where applicable.",
        ],
      },
      {
        type: "text",
        text: "CarbonLeafs provides technological support for verification workflows but does not itself constitute an independent verification body unless expressly stated otherwise.",
      },
      {
        type: "heading",
        text: "5.5 Buyers",
      },
      {
        type: "text",
        text: "Buyers are responsible for:",
      },
      {
        type: "list",
        items: [
          "Providing accurate identification information;",
          "Conducting their own due diligence;",
          "Reviewing available Project and Carbon Asset information;",
          "Complying with applicable laws and regulations;",
          "Completing payments through approved mechanisms; and",
          "Using purchased Carbon Assets only for lawful purposes.",
        ],
      },
      {
        type: "text",
        text: "The availability of a Carbon Asset on CarbonLeafs does not constitute a guarantee that the asset is suitable for a particular buyer\u2019s regulatory, accounting, sustainability, tax, or reporting requirements.",
      },
      {
        type: "heading",
        text: "5.6 Administrators",
      },
      {
        type: "text",
        text: "Administrators may manage:",
      },
      {
        type: "list",
        items: [
          "Users;",
          "Roles and permissions;",
          "Projects;",
          "Verification workflows;",
          "Marketplace information;",
          "Reports;",
          "Platform configuration; and",
          "Other authorized administrative functions.",
        ],
      },
      {
        type: "text",
        text: "Administrators must use elevated privileges responsibly and only for legitimate Platform purposes.",
      },
    ],
  },
  {
    number: 6,
    title: "Project Data and Data Accuracy",
    blocks: [
      {
        type: "text",
        text: "CarbonLeafs depends on information supplied by Users, field personnel, sensors, integrations, documents, photographs, databases, and other sources. Users acknowledge that:",
      },
      {
        type: "list",
        items: [
          "CarbonLeafs calculations may depend on the quality of submitted data;",
          "Incorrect or incomplete information may affect project results;",
          "Platform-generated estimates may require verification;",
          "Data may be corrected following review;",
          "Historical records may be retained for audit and traceability; and",
          "CarbonLeafs cannot guarantee the accuracy of information supplied by third parties.",
        ],
      },
      {
        type: "text",
        text: "Users remain responsible for the authenticity and legality of information they submit.",
      },
    ],
  },
  {
    number: 7,
    title: "Carbon Calculations and Estimates",
    blocks: [
      {
        type: "text",
        text: "CarbonLeafs may provide tools for estimating greenhouse-gas emissions, emission reductions, removals, carbon stocks, or potential Carbon Assets. Such calculations are intended to support project development, monitoring, reporting, verification, and carbon-market activities.",
      },
      {
        type: "text",
        text: "A calculation, estimate, dashboard value, or preliminary Carbon Asset displayed by CarbonLeafs does not automatically constitute a certified or issued carbon credit.",
      },
      {
        type: "text",
        text: "Final issuance, certification, authorization, validation, verification, registration, transfer, retirement, or recognition of a Carbon Asset may depend on applicable methodologies, standards, registries, competent authorities, validation/verification bodies, and other requirements.",
      },
    ],
  },
  {
    number: 8,
    title: "Carbon Credit Ownership",
    blocks: [
      {
        type: "text",
        text: "CarbonLeafs does not automatically acquire ownership of Carbon Assets merely because a User registers a Project on the Platform. Ownership, entitlement, benefit-sharing, and rights relating to Carbon Assets shall be determined by:",
      },
      {
        type: "list",
        items: [
          "Applicable law;",
          "Project agreements;",
          "Land or asset ownership rights;",
          "Participant agreements;",
          "Carbon-rights agreements;",
          "Financing arrangements;",
          "Registry requirements;",
          "Applicable carbon standards; and",
          "Other legally binding arrangements.",
        ],
      },
      {
        type: "text",
        text: "Project Owners are responsible for establishing appropriate contractual arrangements concerning ownership and distribution of Carbon Assets.",
      },
      {
        type: "text",
        text: "Where required, Users may be required to provide evidence of their legal right to develop, claim, transfer, sell, or otherwise benefit from Carbon Assets.",
      },
    ],
  },
  {
    number: 9,
    title: "Carbon Market and Regulatory Compliance",
    blocks: [
      {
        type: "text",
        text: "CarbonLeafs may facilitate information management, project development, transaction workflows, and marketplace activities relating to Carbon Assets. Users acknowledge that carbon markets are regulated and may be subject to national and international requirements.",
      },
      {
        type: "text",
        text: "For Projects in Rwanda, Users may be required to comply with applicable requirements of relevant Rwandan authorities, including applicable environmental and carbon-market requirements. Rwanda has established a national Carbon Market Framework and operationalized a Carbon Registry for relevant mitigation outcomes and carbon-market records.",
      },
      {
        type: "text",
        text: "CarbonLeafs does not represent that registration of a Project on the Platform automatically satisfies any government, registry, methodology, standard, or international carbon-market requirement. Where required, Projects and Carbon Assets may need to undergo separate authorization, validation, verification, certification, registration, or approval processes.",
      },
    ],
  },
  {
    number: 10,
    title: "No Guarantee of Carbon Credit Issuance",
    blocks: [
      {
        type: "text",
        text: "Phina Forge does not guarantee that:",
      },
      {
        type: "list",
        items: [
          "A Project will generate Carbon Assets;",
          "A Project will pass validation;",
          "A Project will pass verification;",
          "Carbon Assets will be issued;",
          "Carbon Assets will be accepted by a registry;",
          "Carbon Assets will receive authorization;",
          "Carbon Assets will be sold;",
          "A particular price will be achieved; or",
          "A Buyer will be found.",
        ],
      },
      {
        type: "text",
        text: "Carbon markets are subject to regulatory, technical, environmental, market, verification, methodology, and other risks.",
      },
    ],
  },
  {
    number: 11,
    title: "Marketplace and Transactions",
    blocks: [
      {
        type: "text",
        text: "Where CarbonLeafs provides marketplace or transaction functionality, Users may be able to list, discover, negotiate, purchase, transfer, or otherwise transact in relation to Carbon Assets. Unless expressly agreed otherwise:",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Phina Forge is a technology platform operator and is not automatically the owner of Carbon Assets listed by Users;",
          "Users are responsible for the accuracy of their listings;",
          "Buyers are responsible for conducting appropriate due diligence;",
          "Transactions may be subject to separate agreements;",
          "Applicable fees may apply;",
          "Transactions may require regulatory or registry approval; and",
          "CarbonLeafs does not guarantee completion of a transaction.",
        ],
      },
      {
        type: "text",
        text: "Phina Forge may suspend a listing or transaction where it reasonably suspects fraud, misrepresentation, regulatory non-compliance, ownership disputes, double counting, security concerns, or other material issues.",
      },
    ],
  },
  {
    number: 12,
    title: "Fees and Payments",
    blocks: [
      {
        type: "text",
        text: "Certain CarbonLeafs services may be provided free of charge while others may require payment. Applicable fees will be communicated to Users before payment is required. Fees may include, where applicable:",
      },
      {
        type: "list",
        items: [
          "Subscription fees;",
          "Platform service fees;",
          "Project-management fees;",
          "Transaction fees;",
          "Verification-management fees;",
          "Marketplace fees; or",
          "Other agreed service charges.",
        ],
      },
      {
        type: "text",
        text: "Unless otherwise stated, taxes, government charges, payment-processing charges, and other applicable costs may be payable by the relevant User.",
      },
      {
        type: "text",
        text: "Phina Forge reserves the right to change applicable fees prospectively by providing reasonable notice.",
      },
    ],
  },
  {
    number: 13,
    title: "User Generated Content",
    blocks: [
      {
        type: "text",
        text: "Users retain ownership of Content they lawfully own and submit to CarbonLeafs. By submitting Content to CarbonLeafs, the User grants Phina Forge a non-exclusive, worldwide, limited license to host, store, process, reproduce, analyze, display, transmit, and use that Content to the extent reasonably necessary to:",
      },
      {
        type: "list",
        items: [
          "Operate CarbonLeafs;",
          "Provide requested services;",
          "Conduct monitoring and verification workflows;",
          "Generate reports;",
          "Maintain records;",
          "Improve Platform functionality;",
          "Detect fraud and security incidents;",
          "Meet legal and regulatory obligations; and",
          "Perform contractual obligations.",
        ],
      },
      {
        type: "text",
        text: "This license does not transfer ownership of the User\u2019s underlying intellectual property.",
      },
    ],
  },
  {
    number: 14,
    title: "Personal Data and Privacy",
    blocks: [
      {
        type: "text",
        text: "CarbonLeafs may process Personal Data including, depending on the User and service:",
      },
      {
        type: "list",
        items: [
          "Names;",
          "Contact information;",
          "Identification information;",
          "Account information;",
          "Project participation information;",
          "Location or GPS information;",
          "Photographs;",
          "Device information;",
          "Activity records;",
          "Transaction information; and",
          "Other information necessary to provide the Platform.",
        ],
      },
      {
        type: "text",
        text: "Phina Forge will process Personal Data in accordance with applicable data-protection requirements and the CarbonLeafs Privacy Policy. Rwanda\u2019s Law No. 058/2021 relating to the protection of personal data and privacy establishes requirements concerning the processing and protection of personal information. Users should review the CarbonLeafs Privacy Policy before using the Platform.",
      },
      {
        type: "text",
        text: "Where a User submits Personal Data belonging to another individual, that User is responsible for ensuring that the processing, collection, disclosure, and submission are lawful and appropriately authorized.",
      },
    ],
  },
  {
    number: 15,
    title: "Location and GPS Data",
    blocks: [
      {
        type: "text",
        text: "Certain CarbonLeafs Projects may require collection of geographic information, including GPS coordinates or polygons. Users acknowledge that location information may be necessary for:",
      },
      {
        type: "list",
        items: [
          "Project boundary identification;",
          "Land-use monitoring;",
          "Project verification;",
          "Satellite analysis;",
          "Environmental monitoring;",
          "Preventing duplicate project claims; and",
          "Carbon accounting.",
        ],
      },
      {
        type: "text",
        text: "Users must not knowingly provide false location information or manipulate geographic records.",
      },
    ],
  },
  {
    number: 16,
    title: "Satellite, Sensor, and Third Party Data",
    blocks: [
      {
        type: "text",
        text: "CarbonLeafs may use satellite imagery, sensors, APIs, mapping services, external databases, or other third-party data sources. Such data may be subject to:",
      },
      {
        type: "list",
        items: [
          "Availability limitations;",
          "Measurement uncertainty;",
          "Technical errors;",
          "Resolution limitations;",
          "Third-party licensing conditions;",
          "Weather conditions;",
          "Connectivity issues; and",
          "Other limitations beyond Phina Forge\u2019s control.",
        ],
      },
      {
        type: "text",
        text: "Third-party data should not automatically be treated as independently verified evidence unless appropriately validated.",
      },
    ],
  },
  {
    number: 17,
    title: "Intellectual Property",
    blocks: [
      {
        type: "text",
        text: "CarbonLeafs, including its software, source code, algorithms, interfaces, databases, designs, logos, trademarks, documentation, workflows, and proprietary technology, is owned by or licensed to Phina Forge Ltd unless otherwise expressly stated. Except where permitted by law or expressly authorized in writing, Users must not:",
      },
      {
        type: "list",
        items: [
          "Copy CarbonLeafs software;",
          "Reverse engineer the Platform;",
          "Decompile or disassemble the software;",
          "Extract source code;",
          "Circumvent security controls;",
          "Copy proprietary workflows;",
          "Reproduce proprietary designs;",
          "Sell or sublicense access; or",
          "Create a competing product using protected CarbonLeafs technology.",
        ],
      },
      {
        type: "text",
        text: "User Data remains subject to the ownership and licensing provisions contained in these Terms and applicable agreements.",
      },
    ],
  },
  {
    number: 18,
    title: "Prohibited Activities",
    blocks: [
      {
        type: "text",
        text: "Users must not use CarbonLeafs to:",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Submit fraudulent information;",
          "Fabricate carbon reductions or removals;",
          "Manipulate monitoring data;",
          "Create duplicate Project records for the same activity;",
          "Attempt double counting of Carbon Assets;",
          "Misrepresent Project ownership;",
          "Impersonate another User;",
          "Upload malicious software;",
          "Attempt unauthorized access;",
          "Circumvent Platform security;",
          "Interfere with Platform operations;",
          "Abuse APIs or automated systems;",
          "Scrape or extract Platform data without authorization;",
          "Use CarbonLeafs for unlawful activities;",
          "Upload content that violates another person\u2019s rights; or",
          "Attempt to manipulate marketplace transactions.",
        ],
      },
    ],
  },
  {
    number: 19,
    title: "Fraud, Misrepresentation, and Data Manipulation",
    blocks: [
      {
        type: "text",
        text: "CarbonLeafs may implement mechanisms to detect:",
      },
      {
        type: "list",
        items: [
          "Duplicate records;",
          "Suspicious activity;",
          "Inconsistent GPS data;",
          "Repeated photographs;",
          "Unusual measurement patterns;",
          "Unauthorized account access;",
          "Duplicate Project claims;",
          "False documentation; and",
          "Other indicators of potential fraud.",
        ],
      },
      {
        type: "text",
        text: "Where suspected fraud or material misrepresentation is identified, Phina Forge may, subject to applicable law:",
      },
      {
        type: "list",
        items: [
          "Request additional evidence;",
          "Flag records;",
          "Restrict access;",
          "Suspend transactions;",
          "Suspend or terminate accounts;",
          "Preserve relevant records;",
          "Notify affected parties; and/or",
          "Refer matters to competent authorities where appropriate.",
        ],
      },
    ],
  },
  {
    number: 20,
    title: "Verification and Audit Trail",
    blocks: [
      {
        type: "text",
        text: "CarbonLeafs may maintain records of changes to Project Data, including:",
      },
      {
        type: "list",
        items: [
          "User identity;",
          "Date and time;",
          "Data submitted;",
          "Data modified;",
          "Verification decisions;",
          "Approval status;",
          "Supporting evidence; and",
          "Other relevant audit information.",
        ],
      },
      {
        type: "text",
        text: "Users acknowledge that audit trails may be retained for operational, contractual, regulatory, verification, security, and legal purposes.",
      },
    ],
  },
  {
    number: 21,
    title: "Platform Availability",
    blocks: [
      {
        type: "text",
        text: "Phina Forge will make reasonable efforts to keep CarbonLeafs available and operational. However, continuous or uninterrupted availability is not guaranteed. The Platform may temporarily become unavailable because of:",
      },
      {
        type: "list",
        items: [
          "Maintenance;",
          "Software updates;",
          "Network failures;",
          "Hosting failures;",
          "Cybersecurity incidents;",
          "Third-party service interruptions;",
          "Power failures;",
          "Natural disasters;",
          "Government action;",
          "Force majeure events; or",
          "Other circumstances beyond Phina Forge\u2019s reasonable control.",
        ],
      },
    ],
  },
  {
    number: 22,
    title: "Security",
    blocks: [
      {
        type: "text",
        text: "Phina Forge will implement reasonable technical and organizational measures intended to protect CarbonLeafs and information processed through the Platform. However, no online system can be guaranteed to be completely secure.",
      },
      {
        type: "text",
        text: "Users must immediately notify Phina Forge if they suspect:",
      },
      {
        type: "list",
        items: [
          "Unauthorized account access;",
          "Credential compromise;",
          "Data manipulation;",
          "Security vulnerabilities; or",
          "Other suspicious activity.",
        ],
      },
    ],
  },
  {
    number: 23,
    title: "Third-Party Services",
    blocks: [
      {
        type: "text",
        text: "CarbonLeafs may integrate with third-party services, including:",
      },
      {
        type: "list",
        items: [
          "Mapping services;",
          "Satellite providers;",
          "Payment providers;",
          "Cloud infrastructure;",
          "Identity services;",
          "Carbon registries;",
          "Verification systems;",
          "Analytics services; and",
          "Other external platforms.",
        ],
      },
      {
        type: "text",
        text: "Third-party services may have their own terms and privacy policies. Phina Forge is not responsible for third-party services outside its reasonable control.",
      },
    ],
  },
  {
    number: 24,
    title: "Disclaimers",
    blocks: [
      {
        type: "text",
        text: "To the maximum extent permitted by applicable law, CarbonLeafs is provided on an \u201Cas available\u201D and \u201Cas is\u201D basis. Phina Forge does not warrant that:",
      },
      {
        type: "list",
        items: [
          "CarbonLeafs will always be error-free;",
          "All data will always be complete;",
          "All calculations will be suitable for every purpose;",
          "Every Project will qualify for carbon certification;",
          "Carbon Assets will have a particular market value;",
          "The Platform will always be available; or",
          "Third-party services will remain available.",
        ],
      },
      {
        type: "text",
        text: "Users are responsible for evaluating whether CarbonLeafs is appropriate for their particular operational, financial, legal, regulatory, accounting, or environmental requirements.",
      },
    ],
  },
  {
    number: 25,
    title: "Limitation of Liability",
    blocks: [
      {
        type: "text",
        text: "To the maximum extent permitted by applicable law, Phina Forge shall not be liable for indirect, incidental, special, consequential, or speculative losses arising from the use of CarbonLeafs, including loss of anticipated profits, loss of business opportunities, loss of Carbon Asset value, or loss resulting from market fluctuations.",
      },
      {
        type: "text",
        text: "Nothing in these Terms shall exclude or limit liability where such exclusion or limitation is prohibited by applicable law.",
      },
      {
        type: "text",
        text: "Any specific liability limits, exclusions, or indemnification obligations may be established in separate agreements between Phina Forge and specific Users.",
      },
    ],
  },
  {
    number: 26,
    title: "User Indemnification",
    blocks: [
      {
        type: "text",
        text: "To the extent permitted by applicable law, a User may be responsible for losses, claims, damages, liabilities, costs, or expenses arising from:",
      },
      {
        type: "list",
        items: [
          "Their violation of these Terms;",
          "Fraudulent or misleading information they submit;",
          "Their unauthorized use of CarbonLeafs;",
          "Their infringement of third-party rights;",
          "Their violation of applicable law; or",
          "Their unauthorized representation of ownership or rights over Carbon Assets.",
        ],
      },
      {
        type: "text",
        text: "The precise scope of any indemnification obligation may be established by a separate written agreement where appropriate.",
      },
    ],
  },
  {
    number: 27,
    title: "Account Suspension and Termination",
    blocks: [
      {
        type: "text",
        text: "Phina Forge may suspend, restrict, or terminate access where reasonably necessary because of:",
      },
      {
        type: "list",
        items: [
          "Violation of these Terms;",
          "Fraud or suspected fraud;",
          "Security threats;",
          "Illegal activity;",
          "Misuse of Platform functionality;",
          "Non-payment of applicable fees;",
          "Regulatory requirements;",
          "False or misleading information; or",
          "Other material risks to CarbonLeafs, its Users, or third parties.",
        ],
      },
      {
        type: "text",
        text: "Where reasonably practicable, Phina Forge may provide notice before suspension or termination.",
      },
    ],
  },
  {
    number: 28,
    title: "Effect of Termination",
    blocks: [
      {
        type: "text",
        text: "Upon termination:",
      },
      {
        type: "list",
        items: [
          "Access to certain Platform functions may cease;",
          "Users may lose access to dashboards or account features;",
          "Certain records may continue to be retained where legally or operationally necessary;",
          "Transaction obligations already incurred may survive termination; and",
          "Provisions concerning intellectual property, confidentiality, liability, disputes, and other provisions intended to survive termination will remain effective.",
        ],
      },
      {
        type: "text",
        text: "Deletion of an account does not necessarily mean immediate deletion of all information where retention is required by law, contractual obligations, audit requirements, verification requirements, security needs, or legitimate operational purposes.",
      },
    ],
  },
  {
    number: 29,
    title: "Confidentiality",
    blocks: [
      {
        type: "text",
        text: "Users must keep confidential information obtained through CarbonLeafs confidential where the information is clearly confidential or reasonably understood to be confidential. Confidential information may include:",
      },
      {
        type: "list",
        items: [
          "Non-public Project information;",
          "Commercial agreements;",
          "Pricing arrangements;",
          "Proprietary methodologies;",
          "Personal information;",
          "Security information;",
          "Business strategies; and",
          "Non-public technical information.",
        ],
      },
      {
        type: "text",
        text: "This obligation does not apply to information that is lawfully public, independently developed, or required to be disclosed by law.",
      },
    ],
  },
  {
    number: 30,
    title: "Changes to CarbonLeafs",
    blocks: [
      {
        type: "text",
        text: "Phina Forge may modify, improve, discontinue, or replace Platform features from time to time. Changes may include:",
      },
      {
        type: "list",
        items: [
          "New features;",
          "New user roles;",
          "Changes to dashboards;",
          "Changes to workflows;",
          "Security improvements;",
          "Changes to integrations;",
          "Changes to pricing; or",
          "Removal of obsolete functionality.",
        ],
      },
      {
        type: "text",
        text: "Where changes materially affect Users\u2019 rights or obligations, reasonable notice will be provided where required.",
      },
    ],
  },
  {
    number: 31,
    title: "Changes to These Terms",
    blocks: [
      {
        type: "text",
        text: "Phina Forge may update these Terms from time to time. The updated version will be published through CarbonLeafs or otherwise communicated to Users. The \u201CLast Updated\u201D date will identify the most recent version.",
      },
      {
        type: "text",
        text: "Continued use of CarbonLeafs after the effective date of updated Terms constitutes acceptance of the updated Terms, subject to applicable law.",
      },
    ],
  },
  {
    number: 32,
    title: "Dispute Resolution",
    blocks: [
      {
        type: "text",
        text: "Users should first attempt to resolve disputes directly with Phina Forge through the designated CarbonLeafs support or legal-contact channels.",
      },
      {
        type: "text",
        text: "Where a dispute cannot be resolved amicably, the dispute shall be handled in accordance with the applicable laws and dispute-resolution procedures of the Republic of Rwanda, unless a separate written agreement provides otherwise.",
      },
      {
        type: "text",
        text: "Nothing in this section prevents a party from seeking urgent legal or equitable relief where legally available.",
      },
    ],
  },
  {
    number: 33,
    title: "Governing Law",
    blocks: [
      {
        type: "text",
        text: "These Terms shall be governed by and interpreted in accordance with the laws of the Republic of Rwanda, unless mandatory applicable law requires otherwise.",
      },
    ],
  },
  {
    number: 34,
    title: "Force Majeure",
    blocks: [
      {
        type: "text",
        text: "Phina Forge shall not be responsible for failure or delay caused by circumstances beyond its reasonable control, including:",
      },
      {
        type: "list",
        items: [
          "Natural disasters;",
          "Floods;",
          "Earthquakes;",
          "Epidemics or pandemics;",
          "War;",
          "Civil unrest;",
          "Government action;",
          "Major telecommunications failures;",
          "Internet infrastructure failures;",
          "Cybersecurity events;",
          "Power failures;",
          "Cloud infrastructure failures; or",
          "Other events beyond reasonable control.",
        ],
      },
    ],
  },
  {
    number: 35,
    title: "Severability",
    blocks: [
      {
        type: "text",
        text: "If any provision of these Terms is determined to be invalid, unlawful, or unenforceable, the remaining provisions shall remain in effect to the extent permitted by law. The invalid provision shall be interpreted or replaced, where legally possible, in a manner that most closely reflects its original purpose.",
      },
    ],
  },
  {
    number: 36,
    title: "No Waiver",
    blocks: [
      {
        type: "text",
        text: "Failure by Phina Forge to enforce any provision of these Terms does not constitute a waiver of its right to enforce that provision later.",
      },
    ],
  },
  {
    number: 37,
    title: "Entire Agreement",
    blocks: [
      {
        type: "text",
        text: "These Terms, together with the CarbonLeafs Privacy Policy and any applicable service-specific agreements, constitute the agreement governing the User\u2019s use of CarbonLeafs unless a separate written agreement expressly provides otherwise.",
      },
      {
        type: "text",
        text: "Where a separate written agreement conflicts with these Terms, the specific written agreement shall prevail to the extent of the conflict.",
      },
    ],
  },
  {
    number: 38,
    title: "Contact Information",
    blocks: [
      {
        type: "definitions",
        items: [
          { term: "Platform Operator:", definition: "Phina Forge Ltd" },
          { term: "Platform:", definition: "CarbonLeafs" },
          { term: "Country:", definition: "Republic of Rwanda" },
          {
            term: "Email:",
            definition: "[official CarbonLeafs support/legal email]",
          },
          { term: "Telephone:", definition: "[official telephone number]" },
          {
            term: "Physical Address:",
            definition: "[registered office address]",
          },
        ],
      },
      {
        type: "text",
        text: "For legal notices:",
      },
      {
        type: "definitions",
        items: [
          {
            term: "Email:",
            definition: "[legal@carbonleafs.com / official legal email]",
          },
          { term: "Attention:", definition: "Legal/Compliance Department" },
        ],
      },
    ],
  },
  {
    number: 39,
    title: "User Acknowledgement",
    blocks: [
      {
        type: "text",
        text: "By registering for or using CarbonLeafs, the User confirms that they:",
      },
      {
        type: "list",
        items: [
          "Have read these Terms;",
          "Understand the responsibilities associated with their User role;",
          "Agree to comply with applicable laws;",
          "Will provide accurate information;",
          "Will not manipulate Project or Carbon Asset information;",
          "Understand that CarbonLeafs does not guarantee the issuance or sale of Carbon Assets; and",
          "Agree to the processing of Personal Data in accordance with the CarbonLeafs Privacy Policy and applicable law.",
        ],
      },
      {
        type: "text",
        text: "By clicking \u201CI Agree\u201D, \u201CAccept Terms\u201D, creating an account, or otherwise accessing CarbonLeafs, the User acknowledges acceptance of these Terms and Conditions.",
      },
    ],
  },
];
