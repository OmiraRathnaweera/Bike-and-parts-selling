export const PERMISSIONS = {
  VIEW_USERS:          ["OWNER", "STAFF"],
  VIEW_USER_DETAILS:   ["OWNER", "STAFF"],
  DELETE_USERS:        ["OWNER"],

  VIEW_SALES:          ["OWNER", "ACCOUNTANT"],  
  VIEW_PROFIT:         ["OWNER", "ACCOUNTANT"],     
  GENERATE_PDF:        ["OWNER", "ACCOUNTANT"],     

  VIEW_TRANSACTIONS:   ["OWNER", "ACCOUNTANT", "STAFF"], 
  EDIT_TRANSACTIONS:   ["OWNER", "ACCOUNTANT"],     
  DELETE_TRANSACTIONS: ["OWNER"],                

  VIEW_BIKES:          ["OWNER", "ACCOUNTANT", "STAFF", "SALES_REP"], 
  EDIT_BIKES:          ["OWNER", "ACCOUNTANT", "STAFF"],              
};

export const can = (role, perm) => PERMISSIONS[perm]?.includes(role) ?? false;

export const ROLE_STYLES = {
  OWNER:      { bg:"rgba(139,92,246,0.15)",  text:"#c4b5fd", border:"rgba(139,92,246,0.3)",  dot:"#a78bfa" },
  ACCOUNTANT: { bg:"rgba(59,130,246,0.15)",  text:"#93c5fd", border:"rgba(59,130,246,0.3)",  dot:"#60a5fa" },
  SALES_REP:  { bg:"rgba(16,185,129,0.15)",  text:"#6ee7b7", border:"rgba(16,185,129,0.3)",  dot:"#34d399" },
  STAFF:      { bg:"rgba(100,116,139,0.15)", text:"#94a3b8", border:"rgba(100,116,139,0.3)", dot:"#64748b" },
  USER:       { bg:"rgba(71,85,105,0.15)",   text:"#94a3b8", border:"rgba(71,85,105,0.3)",   dot:"#475569" },
};



// ----------------------------------------------------------------------------------------------------------------------------------------

export const WEEKLY_SALES = [
  { day:"Mon", sales:124500, profit:38200 },
  { day:"Tue", sales:98700,  profit:29100 },
  { day:"Wed", sales:187300, profit:61400 },
  { day:"Thu", sales:142000, profit:44800 },
  { day:"Fri", sales:213600, profit:72300 },
  { day:"Sat", sales:289400, profit:96700 },
  { day:"Sun", sales:76800,  profit:21900 },
];

export const MOCK_TRANSACTIONS = [
  { id:"TXN-001", date:"2026-03-01", customer:"Amaya Jayawardena", product:"Brake Pads (x2)",      amount:4800,  status:"Completed", type:"Sale"   },
  { id:"TXN-002", date:"2026-03-01", customer:"Dilan Wickrama",    product:"Air Filter",            amount:1200,  status:"Completed", type:"Sale"   },
  { id:"TXN-003", date:"2026-03-02", customer:"Sanduni Kumari",    product:"Oil Filter Set",        amount:2400,  status:"Pending",   type:"Sale"   },
  { id:"TXN-004", date:"2026-03-02", customer:"Hiruni Bandara",    product:"Suspension Kit",        amount:32000, status:"Completed", type:"Sale"   },
  { id:"TXN-005", date:"2026-03-03", customer:"Malith Gamage",     product:"Spark Plugs (x4)",      amount:3600,  status:"Refunded",  type:"Refund" },
  { id:"TXN-006", date:"2026-03-03", customer:"Amaya Jayawardena", product:"Engine Oil 5L",         amount:1800,  status:"Completed", type:"Sale"   },
  { id:"TXN-007", date:"2026-03-04", customer:"Dilan Wickrama",    product:"Headlight Bulbs (x2)",  amount:2200,  status:"Pending",   type:"Sale"   },
  { id:"TXN-008", date:"2026-03-05", customer:"Sanduni Kumari",    product:"Timing Belt Kit",       amount:8900,  status:"Completed", type:"Sale"   },
  { id:"TXN-009", date:"2026-03-05", customer:"Hiruni Bandara",    product:"Wiper Blades (x2)",     amount:960,   status:"Completed", type:"Sale"   },
  { id:"TXN-010", date:"2026-03-06", customer:"Malith Gamage",     product:"Exhaust Muffler",       amount:14500, status:"Pending",   type:"Sale"   },
];