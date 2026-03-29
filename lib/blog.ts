export const BLOG_DISCLAIMER =
  'BuildDesk provides AI-generated guidance only. It is not a substitute for professional advice.';

export const BLOG_CATEGORIES = [
  'Tax',
  'Legal',
  'Medical',
  'Real Estate',
  'Business',
  'Finance',
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export type BlogSection = {
  heading: string;
  list?: string[];
  paragraphs: string[];
};

export type BlogPost = {
  category: BlogCategory;
  ctaHref: string;
  ctaLabel: string;
  description: string;
  excerpt: string;
  notice?: string;
  publishedAt: string;
  readTime: string;
  sections: BlogSection[];
  slug: string;
  title: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'save-tax-car-purchase-india',
    category: 'Tax',
    title: 'How to Save Tax on a Car Purchase in India (2026 Guide)',
    description:
      'A practical 2026 guide to car-purchase tax planning in India covering Section 32 depreciation, company car structures, GST input credit, and HRA-plus-car strategy decisions.',
    excerpt:
      'Understand where tax savings on a car purchase really come from in India, and when depreciation, GST credit, or a company-owned car structure can actually help.',
    publishedAt: '2026-03-29',
    readTime: '9 min read',
    ctaHref: '/chat?desk=ca-tax',
    ctaLabel: 'Have a specific tax question? Ask our CA & Tax desk free →',
    sections: [
      {
        heading: 'Why car tax planning is often misunderstood',
        paragraphs: [
          'Many people assume that buying a car automatically creates a tax deduction. In practice, the answer depends on who owns the vehicle, how it is used, whether there is business income, and whether the buyer falls under a structure that can actually claim depreciation or GST credit. A salaried employee buying a personal car normally gets very different treatment from a company, LLP, or sole proprietor using the same car for business.',
          'That is why the first question is not, "Can I save tax on this car?" but, "Under which legal and tax structure is this car being purchased?" Once that is clear, the planning becomes easier. The most common levers in India are depreciation under Section 32 of the Income-tax Act, business-expense treatment of fuel and maintenance, limited situations for GST input tax credit, and compensation design where an employer provides a company car as part of the salary package.',
        ],
      },
      {
        heading: 'Depreciation under Section 32: the most realistic tax lever',
        paragraphs: [
          'If a business buys a car and uses it for business purposes, it may be able to claim depreciation under Section 32. That does not mean the entire car price becomes deductible in year one. Instead, the cost is written down over time at the prescribed rate for motor cars. The claim is available only if the car is reflected in business books and there is a genuine business-use case.',
          'For small business owners and professionals, depreciation usually matters more than clever marketing around "tax-saving car purchases." The cash leaves your bank today, but the tax benefit arrives gradually. That still helps, especially when the vehicle is essential to operations, client visits, or field work. However, if the business has low taxable profit, or the car is mainly personal, the theoretical deduction may not produce meaningful real-world savings.',
        ],
        list: [
          'Ownership should sit with the business or professional entity claiming the deduction.',
          'The car should appear in books as a business asset.',
          'The use case should be supportable if ever questioned.',
          'Mixed personal use weakens the practical strength of the claim.',
        ],
      },
      {
        heading: 'Company car versus personal car: structure matters more than brand or price',
        paragraphs: [
          'For founders, consultants, and directors, the big decision is often whether the car should be purchased personally or by the company. A personal purchase may feel simpler, but it usually limits the tax angle. A company-owned car can open the door to depreciation and business-expense treatment, but it also requires cleaner accounting, corporate discipline, and thought about perquisite valuation if the vehicle is used personally.',
          'There is no universal winner. If the company has steady profits, the car is genuinely used for business, and bookkeeping is already formal, company ownership can be attractive. If the business is early-stage, compliance-light, or the car is mostly for family use, buying through the company only for "tax saving" can create more noise than value. Good planning is less about squeezing every rupee and more about choosing a structure that remains credible one or two years later.',
        ],
      },
      {
        heading: 'GST input credit: possible in some cases, blocked in many others',
        paragraphs: [
          'GST credit on motor vehicles is an area where people often hear half-truths. The law places restrictions on input tax credit for motor vehicles used for transportation of persons, subject to limited exceptions. Businesses involved in further supply of vehicles, passenger transport, or certain training uses may qualify, but a normal service business buying a passenger car for internal use often cannot claim full GST credit.',
          'This means you should not assume that the GST component of the invoice automatically becomes recoverable. Before building a purchase decision around input tax credit, check whether the vehicle type, business activity, and use case actually fall within the allowed category. A mistaken GST credit claim can create a future reversal with interest, which wipes out the original planning benefit.',
        ],
      },
      {
        heading: 'HRA plus car strategy: useful only in the right employment setup',
        paragraphs: [
          'Employees sometimes ask whether they can combine HRA planning with a company-car arrangement. In principle, these are different parts of the salary structure. HRA is linked to rental accommodation and salary composition. A company-car arrangement usually sits within the employer-provided benefits side and has its own tax treatment. The two can coexist, but one does not automatically improve the tax treatment of the other.',
          'Where this becomes interesting is in compensation design for senior employees, directors, or promoters drawing salary. An employer-provided car with driver reimbursement, fuel reimbursement, or official-use allocation can be more efficient than buying the car privately from fully taxed salary. But this only works well when payroll, reimbursement policy, and documentation are consistent. If the structure is informal, the intended tax efficiency can disappear during scrutiny.',
        ],
      },
      {
        heading: 'How to decide in practice',
        paragraphs: [
          'A practical way to decide is to look at four variables together: your entity type, annual taxable profit, intended business use, and compliance appetite. If you are a salaried employee buying a personal car, there is usually no magical standalone deduction. If you are a proprietor, LLP, or company using the car materially for business, depreciation and related business expenses become the real planning tools. If GST credit is part of the idea, verify it before the purchase, not after.',
          'Also remember that tax should not be the only driver. Financing cost, insurance, maintenance, resale value, and administrative burden all matter. Sometimes the lowest-friction structure is slightly less efficient on paper but far more sensible in daily life. A good tax strategy is one you can explain clearly, document properly, and live with comfortably.',
        ],
      },
      {
        heading: 'Bottom line',
        paragraphs: [
          'The best way to save tax on a car purchase in India is not to chase a generic hack. It is to choose the right ownership structure and use case from day one. For many business owners, Section 32 depreciation is the main legitimate benefit. For some, a company-car approach may be better than a personal purchase. For most ordinary personal buyers, the tax angle is more limited than the market suggests.',
          'Before finalizing the purchase, map the invoice, ownership name, funding route, and expected use. That one hour of planning often saves more tax, and more trouble, than weeks of trying to fix the structure after the car is already on the road.',
        ],
      },
    ],
  },
  {
    slug: 'security-deposit-rules-india-tenants',
    category: 'Legal',
    title: 'Security Deposit Rules in India — What Every Tenant Needs to Know',
    description:
      'A tenant-focused guide to security deposit rules in India, including what landlords can legally deduct, how much deposit is common, and what to do if the refund is delayed or refused.',
    excerpt:
      'Security deposits cause endless tenant disputes in India. Here is how to think about legal limits, deductions, proof, and recovery strategy before the move-out fight begins.',
    publishedAt: '2026-03-29',
    readTime: '8 min read',
    ctaHref: '/chat?desk=legal',
    ctaLabel: 'Ask our Legal desk your specific situation — free →',
    sections: [
      {
        heading: 'Why deposit disputes happen so often',
        paragraphs: [
          'Security deposits sit in the uncomfortable space between contract practice and day-to-day bargaining power. Tenants often pay a large lump sum at move-in and only discover at move-out that the landlord has a very different view of deductions, repainting, unpaid utilities, or alleged damage. In many cities, especially fast-moving rental markets, the tenant leaves under time pressure while the landlord holds the money and the leverage.',
          'The first thing to remember is that the answer is not identical across every state and every property type. Rent control laws, local practice, and especially the written rent agreement matter. Still, some broad principles are consistent: a landlord cannot treat the deposit like a bonus; deductions should relate to actual dues or damage beyond normal wear and tear; and the tenant should be able to ask for a reasonable explanation and supporting details.',
        ],
      },
      {
        heading: 'How much deposit is legal in India?',
        paragraphs: [
          'There is no single India-wide rule that every residential deposit must be a specific number of months. In practice, deposits vary sharply by city, bargaining power, and local market custom. Some jurisdictions influenced by tenancy reforms speak in terms of capped deposits for residential use, while many real-world agreements still reflect older market habits, especially in premium urban markets.',
          'That means tenants should not rely only on hearsay such as "two months is the legal maximum everywhere." Instead, read the agreement, note the property location, and check whether the applicable local tenancy framework changes the position. Even when the amount paid was high, the key recovery issue later is usually not the original size of the deposit but whether the landlord can justify withholding it at the end of the tenancy.',
        ],
      },
      {
        heading: 'What can a landlord actually deduct?',
        paragraphs: [
          'Reasonable deductions normally relate to unpaid rent, unpaid electricity or maintenance charges, and damage that goes beyond ordinary use of the property. A tenant living in a property for a period of time will naturally leave signs of normal occupation. Minor scuffs, routine cleaning, and age-related wear usually should not become a pretext for sweeping deductions unless the agreement clearly allocates those costs in a defensible way.',
          'Landlords frequently try to deduct for repainting, deep cleaning, furniture replacement, or vague "repair charges" without evidence. That does not automatically make the deduction lawful. Ask for bills, photographs, meter readings, maintenance statements, and a line-item explanation. A landlord who makes real deductions should usually be able to show how the number was reached.',
        ],
        list: [
          'Unpaid rent and clearly due charges are usually easier deductions to defend.',
          'Normal wear and tear is not the same as tenant-caused damage.',
          'Large lump-sum deductions without proof are easier to challenge.',
          'A signed handover note can reduce later arguments.',
        ],
      },
      {
        heading: 'The best time to protect your deposit is before you move out',
        paragraphs: [
          'Most tenants start thinking about the deposit only after the landlord refuses to refund it. By then, key evidence is often missing. The stronger approach is to create a record before handing over possession. Take dated photographs and videos of the property, meter readings, appliance condition, keys handed over, and any final cleaning or repair work you completed. Keep rent receipts, bank transfers, and message history in one folder.',
          'If possible, do a joint inspection and ask the landlord or broker to confirm the condition in writing. Even a WhatsApp message such as "Flat handed over today, all dues cleared except final electricity adjustment" can become valuable later. Small documentation steps dramatically change the balance of a dispute because they force the other side to argue against a record instead of against your memory.',
        ],
      },
      {
        heading: 'How to ask for the deposit back',
        paragraphs: [
          'Start with one clear written demand. State the move-out date, the deposit amount paid, the amount already adjusted if any, and the balance you expect to receive. Ask for a timeline and the basis of any proposed deductions. Keep the tone firm and professional. Emotional messages may feel justified, but a structured written demand is more useful if the matter escalates.',
          'If the landlord delays without explanation, follow up again in writing and preserve all responses. A common pattern is vague assurance followed by silence. That silence itself helps you later because it shows the landlord had an opportunity to explain the withholding and did not do so. The goal is to build a simple chronology: deposit paid, possession returned, dues cleared, refund demanded, no valid explanation given.',
        ],
      },
      {
        heading: 'What if the landlord refuses?',
        paragraphs: [
          'Your next step depends on the amount involved and the facts. For smaller disputes, a lawyer notice is often enough to change the conversation. In some cases, consumer or civil remedies may also be considered depending on how the transaction and services are framed. If the landlord is relying on pure intimidation rather than a documented claim, a formal legal communication can quickly reset the power dynamic.',
          'That said, not every dispute should become a full case immediately. Compare the amount at stake, the available proof, the city, and the likely effort required. Sometimes a strongly worded legal notice with documents attached is the fastest path to settlement. Sometimes it is worth filing. The right choice is the one that increases your recovery odds without spending more than the dispute itself is worth.',
        ],
      },
      {
        heading: 'Bottom line for tenants',
        paragraphs: [
          'Security deposits are not meant to vanish into the landlord\'s discretion. A landlord should be able to explain and justify deductions, and a tenant should be able to demand that explanation in writing. Your best leverage comes from documentation: agreement, payment proof, move-out record, meter readings, and a clean written refund request.',
          'If you are still at the move-in stage, negotiate the deposit and deduction clauses carefully. If you are already in a dispute, stop arguing only on calls and create a paper trail immediately. Deposit fights are often won less by dramatic legal theory and more by calm, organized evidence.',
        ],
      },
    ],
  },
  {
    slug: 'llp-vs-pvt-ltd-india-startup',
    category: 'Business',
    title: 'LLP vs Pvt Ltd — Which Structure Is Right for Your Indian Startup?',
    description:
      'Compare LLP and private limited company structures in India across compliance burden, taxation, fundraising, liability, and conversion decisions for startups.',
    excerpt:
      'LLP and Pvt Ltd are both credible structures in India, but they solve different problems. Here is how founders should compare tax, control, compliance, and fundraising fit.',
    publishedAt: '2026-03-29',
    readTime: '9 min read',
    ctaHref: '/chat?desk=business',
    ctaLabel: 'Got a specific business structure question? Ask free →',
    sections: [
      {
        heading: 'The real question is not which structure is better in general',
        paragraphs: [
          'Founders often ask whether an LLP or a private limited company is "best" for a startup. The better question is: what kind of startup are you building, and what do you need the structure to do in the next two to three years? A services-led consulting firm, a family-run operating business, and a venture-backed product startup can all be legitimate startups, but they do not need the same legal wrapper.',
          'Choosing the wrong structure does not always kill a business, but it can create friction exactly when momentum matters. Investor conversations, ESOP plans, co-founder exits, compliance overhead, and even client perception can all turn on the entity form. So the decision should be made with both the current operating model and the likely next stage in mind.',
        ],
      },
      {
        heading: 'Compliance burden: LLP is usually lighter, but do not over-romanticize it',
        paragraphs: [
          'One reason founders like LLPs is the perception of lower compliance. In many cases, that perception is broadly correct. Governance is usually simpler, and the structure can feel more flexible for closely held businesses where partners want to operate with fewer formal corporate rituals. For founder-led professional services businesses, that simplicity can be a genuine advantage.',
          'But lighter compliance does not mean no compliance. Annual filings, accounting, tax returns, and partner documentation still matter. Also, if the business grows quickly, takes outside capital, or needs formal employee ownership structures, what looked simple at the beginning can become limiting. The mistake is not choosing LLP; the mistake is choosing it only because it feels easier this week.',
        ],
      },
      {
        heading: 'Taxation: compare practical outcomes, not just headline rates',
        paragraphs: [
          'Founders sometimes treat tax as a headline-rate comparison, but the more useful analysis is practical post-tax cash flow. How much money stays in the entity? How will profits be withdrawn? Will founders take salary, director remuneration, or partner drawings? Does the business expect to reinvest heavily, or is near-term distribution important?',
          'Depending on the facts, an LLP can be attractive for businesses where partner-level extraction and operational flexibility matter. A private limited company may still be perfectly viable where profits are being reinvested, compensation is structured more formally, or external investment is likely. Tax should influence the choice, but it should not outweigh future fundraising and governance fit when those are central to the business model.',
        ],
      },
      {
        heading: 'Fundraising and ownership flexibility: Pvt Ltd has the clearer edge',
        paragraphs: [
          'If you plan to raise angel or venture capital, a private limited company is usually the more natural vehicle. Investors are familiar with shares, cap tables, preference rights, board structure, and downstream corporate mechanics. ESOPs and future rounds also fit more naturally into the company framework. That is why many venture-oriented founders choose Pvt Ltd early even when the initial compliance cost feels heavier.',
          'An LLP can work well for profitable, tightly controlled businesses, but it is usually less attractive for scalable equity financing. If the likely path involves institutional money, stock options, or multiple rounds, starting with Pvt Ltd often avoids a restructuring conversation just when the business needs speed. The structure should help capital formation, not force reinvention at the first serious term sheet.',
        ],
      },
      {
        heading: 'Liability, control, and co-founder dynamics',
        paragraphs: [
          'Both LLPs and private limited companies offer limited-liability style protection, but internal control works differently. LLPs run through the partnership framework and the LLP agreement, while companies run through shareholding, board authority, and corporate law processes. If founder responsibilities are uneven, or one founder is more operational while another is more capital-oriented, the way rights are documented becomes critical.',
          'In practice, many founder disputes are not caused by the entity type alone. They come from weak documentation, vague roles, and optimism at incorporation time. Whether you choose LLP or Pvt Ltd, spend real time on transfer restrictions, founder exits, deadlock mechanisms, and what happens if one founder stops contributing. The structure sets the container, but the agreement determines whether the container actually holds.',
        ],
      },
      {
        heading: 'Can you convert later? Yes, but transitions have a cost',
        paragraphs: [
          'A common strategy is to start as an LLP and convert later if the startup grows into a fundraising story. That can work, but founders should not treat conversion as frictionless. There can be tax, legal, accounting, timing, and document-cleanup consequences depending on how the business has operated before conversion. Customer contracts, licenses, IP ownership, employment arrangements, and historic compliance all need to be reviewed.',
          'Conversion is easiest when the business has been kept clean from day one. If records are scattered, founder transactions are informal, or the brand and code were never properly assigned, the conversion discussion becomes a broader cleanup project. So yes, conversion is possible. But the best conversion strategy is to avoid making the earlier structure artificially messy.',
        ],
      },
      {
        heading: 'Which one should you choose?',
        paragraphs: [
          'Choose an LLP when the startup is closer to a founder-led services or operating business, external equity is not the immediate goal, and simpler ongoing structure is genuinely valuable. Choose a private limited company when the startup wants to raise capital, issue equity-like ownership cleanly, build an ESOP pool, or present in a familiar format to investors and many enterprise counterparties.',
          'If you are still unsure, map the next 24 months: expected revenue, likely funding path, number of founders, hiring needs, and whether profits will be distributed or reinvested. That future map usually answers the entity question better than abstract theory. The right structure is the one that makes the next phase easier, not just the incorporation week cheaper.',
        ],
      },
    ],
  },
  {
    slug: 'hba1c-levels-explained-india',
    category: 'Medical',
    title: 'HbA1c Levels Explained — What Your Diabetes Test Results Mean',
    description:
      'Learn what HbA1c levels mean, including normal, prediabetes, and diabetes ranges, common reasons for variation, and practical next steps to discuss with a doctor.',
    excerpt:
      'HbA1c is one of the most useful diabetes markers, but the number needs context. Here is what common ranges mean and when a doctor visit becomes more important.',
    publishedAt: '2026-03-29',
    readTime: '8 min read',
    ctaHref: '/chat?desk=medical',
    ctaLabel: 'Ask our Medical desk a follow-up question — free →',
    notice:
      'This is educational content only. Consult your doctor for medical decisions.',
    sections: [
      {
        heading: 'What HbA1c actually measures',
        paragraphs: [
          'HbA1c, sometimes written as glycated hemoglobin, reflects your average blood sugar exposure over roughly the last two to three months. It does not capture every daily spike and crash, but it gives a useful long-view summary. That is why doctors use it to diagnose diabetes, identify prediabetes, and monitor how well treatment is working over time.',
          'Think of it as a pattern marker rather than a moment marker. A fasting sugar test tells you what is happening at one point in time. HbA1c tells you what your glucose control has been trending toward over weeks. Both can matter, but HbA1c is often easier for people to understand because it cuts through the noise of one unusually good or bad day.',
        ],
      },
      {
        heading: 'Common HbA1c ranges',
        paragraphs: [
          'Different labs may present results with slightly different reference notes, but the broad interpretation is fairly standard. An HbA1c below the usual diabetes threshold is reassuring, while higher values suggest worsening glucose control and a stronger need for professional review. The result should still be interpreted with your symptoms, other test values, medications, and overall risk profile.',
          'A single report should not be read in isolation if there are unusual circumstances such as anemia, recent illness, pregnancy, kidney disease, or conditions affecting red blood cells. Those situations can change how reliable the number is or how aggressively it should be interpreted.',
        ],
        list: [
          'Below 5.7% is generally considered in the normal range.',
          '5.7% to 6.4% is commonly described as the prediabetes range.',
          '6.5% or above may support a diagnosis of diabetes, depending on clinical context.',
          'Higher values usually mean average sugars have been elevated for a longer period.',
        ],
      },
      {
        heading: 'What a high result means in practical terms',
        paragraphs: [
          'If your HbA1c is in the prediabetes range, it does not mean you have failed or that diabetes is inevitable. It means your body is showing strain in glucose handling, and this is the stage where lifestyle changes can be especially powerful. Sleep, body weight, food pattern, activity, stress, and family history all become part of the discussion.',
          'If the result is in the diabetes range, the next step is not panic. It is confirmation, context, and action with a clinician. Some people are diagnosed after years of silent elevation, while others are caught relatively early. Symptoms such as excessive thirst, frequent urination, blurred vision, fatigue, or weight loss make the result more urgent and should push you toward a formal medical review rather than self-management alone.',
        ],
      },
      {
        heading: 'What can affect HbA1c besides diabetes?',
        paragraphs: [
          'HbA1c is useful, but it is not perfect. Conditions that affect red blood cells or hemoglobin can distort the number. Iron deficiency, certain anemias, chronic kidney disease, recent blood loss, transfusion, or some hemoglobin variants may make the value read higher or lower than your true glucose trend. That is one reason doctors sometimes pair HbA1c with fasting glucose, post-meal readings, or continuous glucose data.',
          'Medication changes, acute infection, steroids, disrupted sleep, and major lifestyle shifts can also influence the overall picture. If a number seems very different from how you have been feeling or from your home glucose readings, do not assume the report is wrong, but do raise the mismatch with your doctor.',
        ],
      },
      {
        heading: 'How to lower HbA1c safely',
        paragraphs: [
          'The safest approach is usually boring and consistent rather than dramatic. Regular movement, better meal timing, improved protein and fiber balance, reduced liquid sugars, medication adherence where prescribed, and follow-up testing all matter more than extreme short-term diets. For some people, even modest weight loss and daily walking meaningfully improve HbA1c over time.',
          'If you already have diabetes medication, do not stop, double, or swap treatment based on internet advice alone. The right plan depends on age, kidney status, cardiovascular risk, symptoms, pregnancy status, and other conditions. Lowering HbA1c too aggressively without supervision can also create problems, especially if hypoglycemia is a risk.',
        ],
      },
      {
        heading: 'When should you see a doctor?',
        paragraphs: [
          'You should arrange medical review promptly if your HbA1c is in the diabetes range, if you have symptoms suggestive of high sugar, or if you already carry a diagnosis and your control is drifting upward. Seek more urgent care if there are red-flag symptoms such as severe vomiting, confusion, dehydration, or signs of very high blood sugar.',
          'Even when the number is only mildly elevated, early discussion can save time. Doctors can help interpret the result in the context of blood pressure, lipids, family history, and long-term risk. That matters because diabetes care is not only about one lab report; it is about preventing avoidable complications over years.',
        ],
      },
      {
        heading: 'Bottom line',
        paragraphs: [
          'HbA1c is a useful summary marker, but it is still only one part of the story. Normal, prediabetes, and diabetes ranges offer a helpful framework, yet the real meaning depends on symptoms, repeat testing, and medical context. Use the result as a reason to act with clarity, not with fear.',
          'If your report is borderline, this is the best time to improve habits and get proper advice. If it is clearly high, the goal is not to guess online but to move toward confirmation and treatment planning with a doctor who can see the full picture.',
        ],
      },
    ],
  },
];

export function getBlogPost(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug) ?? null;
}

export function getRelatedBlogPosts(slug: string, limit = 2) {
  const currentIndex = BLOG_POSTS.findIndex((post) => post.slug === slug);
  const otherPosts = BLOG_POSTS.filter((post) => post.slug !== slug);

  if (currentIndex === -1) {
    return otherPosts.slice(0, limit);
  }

  const startIndex = currentIndex % otherPosts.length;
  const orderedPosts = [
    ...otherPosts.slice(startIndex),
    ...otherPosts.slice(0, startIndex),
  ];

  return orderedPosts.slice(0, limit);
}
