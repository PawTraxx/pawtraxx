/* eslint-disable */
import { useState, useEffect, useCallback, useRef, createContext, useContext } from "react";

// PawTraxx - dog health tracker
// TODO: add Apple sign in at some point
// TODO: look into push notifications for vaccine reminders

// all the dropdown lists and stuff
const BREEDS = [
  "Mixed Breed",
  "Affenpinscher","Afghan Hound","Airedale Terrier","Akita","Alaskan Malamute",
  "American Eskimo Dog","American Foxhound","American Hairless Terrier",
  "American Staffordshire Terrier","American Water Spaniel","Anatolian Shepherd",
  "Australian Cattle Dog","Australian Shepherd","Basenji","Basset Hound","Beagle",
  "Bedlington Terrier","Belgian Laekenois","Belgian Malinois","Belgian Sheepdog",
  "Belgian Tervuren","Bernese Mountain Dog","Bichon Frise","Biewer Terrier",
  "Black and Tan Coonhound","Black Russian Terrier","Bloodhound","Bluetick Coonhound",
  "Boerboel","Border Collie","Border Terrier","Borzoi","Boston Terrier",
  "Bouvier des Flandres","Boxer","Boykin Spaniel","Briard","Brittany","Brussels Griffon",
  "Bull Terrier","Bulldog","Bullmastiff","Cairn Terrier","Canaan Dog","Cane Corso",
  "Cardigan Welsh Corgi","Cavalier King Charles Spaniel","Cesky Terrier","Chesapeake Bay Retriever",
  "Chihuahua","Chinese Crested","Chinese Shar-Pei","Chinook","Chow Chow",
  "Clumber Spaniel","Cocker Spaniel","Collie (Rough)","Collie (Smooth)",
  "Curly-Coated Retriever","Dachshund","Dalmatian","Dandie Dinmont Terrier",
  "Doberman Pinscher","Dogue de Bordeaux","English Foxhound","English Setter",
  "English Springer Spaniel","English Toy Spaniel","Entlebucher Mountain Dog",
  "Eurasier","Field Spaniel","Finnish Lapphund","Finnish Spitz","Flat-Coated Retriever",
  "French Bulldog","German Shepherd","German Shorthaired Pointer","Giant Schnauzer",
  "Glen of Imaal Terrier","Golden Retriever","Goldendoodle","Gordon Setter",
  "Great Dane","Great Pyrenees","Greater Swiss Mountain Dog","Greyhound",
  "Harrier","Havanese","Hovawart","Icelandic Sheepdog","Ibizan Hound",
  "Irish Setter","Irish Terrier","Irish Wolfhound","Italian Greyhound",
  "Jack Russell Terrier","Japanese Chin","Karelian Bear Dog","Keeshond",
  "Komondor","Kuvasz","Labradoodle","Labrador Retriever","Lakeland Terrier",
  "Leonberger","Lhasa Apso","Maltese","Maltipoo","Manchester Terrier","Mastiff",
  "Miniature American Shepherd","Miniature Bull Terrier","Miniature Pinscher",
  "Miniature Schnauzer","Morkie","Mudi","Newfoundland","Norfolk Terrier",
  "Norwegian Elkhound","Norwegian Lundehund","Norwich Terrier","Nova Scotia Duck Tolling Retriever",
  "Old English Sheepdog","Otterhound","Papillon","Parson Russell Terrier","Pekingese",
  "Pembroke Welsh Corgi","Pharaoh Hound","Plott Hound","Polish Lowland Sheepdog",
  "Pomeranian","Pomsky","Poodle (Miniature)","Poodle (Standard)","Poodle (Toy)",
  "Portuguese Water Dog","Pug","Puggle","Puli","Pumi","Pyrenean Shepherd",
  "Rat Terrier","Redbone Coonhound","Rhodesian Ridgeback","Rottweiler",
  "Russell Terrier","Saint Bernard","Saluki","Samoyed","Schipperke","Schnoodle",
  "Scottish Deerhound","Scottish Terrier","Sealyham Terrier","Shetland Sheepdog",
  "Sheepadoodle","Shiba Inu","Shih Tzu","Shorkie","Siberian Husky","Silky Terrier",
  "Skye Terrier","Smooth Fox Terrier","Soft Coated Wheaten Terrier",
  "Spanish Water Dog","Spinone Italiano","Staffordshire Bull Terrier",
  "Standard Schnauzer","Sussex Spaniel","Swedish Vallhund","Tibetan Mastiff",
  "Tibetan Spaniel","Tibetan Terrier","Toy Fox Terrier","Treeing Walker Coonhound",
  "Vizsla","Weimaraner","Welsh Springer Spaniel","Welsh Terrier",
  "West Highland White Terrier","Whippet","Wire Fox Terrier","Xoloitzcuintli",
  "Yorkipoo","Yorkshire Terrier","Other"
];

const DOG_EMOJIS = ["🐕","🐩","🦮","🐕‍🦺","🐶"];

const COMMON_VACCINES = [
  "",
  "── Core Vaccines ──",
  "Rabies (1-year)","Rabies (3-year)",
  "DHPP (Distemper/Hepatitis/Parvo/Parainfluenza)",
  "DA2PP (Distemper/Adenovirus/Parvo/Parainfluenza)",
  "Distemper (standalone)","Parvovirus (standalone)",
  "Adenovirus / Hepatitis (standalone)",
  "── Lifestyle Vaccines ──",
  "Bordetella (Kennel Cough) — Injectable",
  "Bordetella (Kennel Cough) — Intranasal",
  "Bordetella (Kennel Cough) — Oral",
  "Leptospirosis (2-serovar)","Leptospirosis (4-serovar)",
  "Lyme Disease (Borreliosis)","Canine Influenza H3N8",
  "Canine Influenza H3N2","Canine Influenza Bivalent (H3N8 + H3N2)",
  "── Puppy Series ──",
  "DHPP Puppy — 1st dose (6–8 weeks)",
  "DHPP Puppy — 2nd dose (10–12 weeks)",
  "DHPP Puppy — 3rd dose (14–16 weeks)",
  "DHPP Puppy — 4th dose (booster)",
  "Rabies Puppy (first at 12–16 weeks)",
  "── Other / Specialty ──",
  "Rattlesnake Vaccine (Crotalus Atrox Toxoid)",
  "Coronavirus (CCV)","Giardia","Parainfluenza (standalone)",
  "Other (custom)",
];

const MED_FREQUENCIES = [
  "Once daily","Twice daily","Every 8 hours","Every other day",
  "Weekly","Monthly","As needed","Other"
];

const COMMON_MEDICATIONS = [
  "",
  "── Flea & Tick Prevention ──",
  "NexGard (Afoxolaner)","Simparica (Sarolaner)","Bravecto (Fluralaner)",
  "Frontline Plus","K9 Advantix II","Seresto Collar",
  "── Heartworm Prevention ──",
  "Heartgard Plus (Ivermectin/Pyrantel)","Interceptor Plus","Sentinel Spectrum",
  "Trifexis","Revolution (Selamectin)",
  "── Allergy & Itch ──",
  "Apoquel (Oclacitinib)","Cytopoint (Lokivetmab)","Atopica (Cyclosporine)",
  "Benadryl (Diphenhydramine)","Zyrtec (Cetirizine)",
  "── Joint & Pain ──",
  "Carprofen (Rimadyl)","Meloxicam (Metacam)","Galliprant (Grapiprant)",
  "Deramaxx (Deracoxib)","Cosequin DS","Dasuquin",
  "── Antibiotics ──",
  "Amoxicillin","Clavamox (Amoxicillin/Clavulanate)","Doxycycline",
  "Metronidazole (Flagyl)","Enrofloxacin (Baytril)",
  "── GI & Digestive ──",
  "Metronidazole (Flagyl)","Famotidine (Pepcid)","Omeprazole (Prilosec)",
  "Cerenia (Maropitant)","FortiFlora Probiotic",
  "── Thyroid & Hormonal ──",
  "Methimazole","Levothyroxine","Vetoryl (Trilostane)",
  "── Anxiety & Behavior ──",
  "Trazodone","Fluoxetine (Reconcile)","Clomipramine (Clomicalm)",
  "Sileo (Dexmedetomidine)","Zylkene (Hydrolyzed Milk Protein)",
  "── Supplements ──",
  "Fish Oil (Omega-3)","Vitamin E","Probiotics","Glucosamine",
  "Milk Thistle","Melatonin",
  "── Other ──",
  "Other (custom)",
];

const COMMON_DOSAGES = [
  "",
  "── Tablets / Capsules ──",
  "1/2 tablet","1 tablet","1.5 tablets","2 tablets",
  "1 capsule","2 capsules",
  "── Weight-Based (mg) ──",
  "5mg","10mg","20mg","25mg","50mg","75mg","100mg","150mg","200mg","500mg",
  "── Liquid / Chewable ──",
  "1 chewable","2 chewables",
  "1ml","2ml","5ml","10ml",
  "0.5 tsp","1 tsp","1 tbsp",
  "── Topical / Other ──",
  "1 pump","1 applicator","As directed",
];

const COMMON_VET_REASONS = [
  "",
  "── Routine ──",
  "Annual wellness exam","6-month checkup","Senior wellness exam",
  "── Vaccines ──",
  "Rabies vaccine","DHPP vaccine","Bordetella vaccine",
  "Leptospirosis vaccine","Lyme disease vaccine","Canine influenza vaccine",
  "── Preventatives ──",
  "Heartworm test","Flea & tick prevention refill","Heartworm prevention refill",
  "── Illness / Injury ──",
  "Vomiting / diarrhea","Limping / lameness","Skin issue / itching",
  "Eye or ear infection","Respiratory symptoms","Lethargy / not eating",
  "Wound / laceration","Suspected allergic reaction",
  "── Dental ──",
  "Dental cleaning","Tooth extraction","Dental exam",
  "── Surgery / Procedure ──",
  "Spay / neuter","Mass removal","X-ray / imaging",
  "Blood work","Urinalysis","Follow-up visit",
  "── Other ──",
  "Other (custom)",
];

const FOOD_RECS = {
  puppy: [
    { name: "Royal Canin Puppy", type: "Dry", rating: 4.8, note: "Breed-specific nutrition, supports immune system" },
    { name: "Hill's Science Diet Puppy", type: "Dry", rating: 4.7, note: "DHA for brain development, calcium for bones" },
    { name: "Purina Pro Plan Puppy", type: "Dry", rating: 4.8, note: "Chicken and rice, DHA from fish oil" },
    { name: "Blue Buffalo Life Protection Puppy", type: "Dry", rating: 4.6, note: "Real meat first, no corn or wheat" },
    { name: "Wellness Complete Health Puppy", type: "Wet", rating: 4.5, note: "Grain-free, high protein, omega fatty acids" },
  ],
  adult_small: [
    { name: "Royal Canin Small Adult", type: "Dry", rating: 4.7, note: "Tailored kibble size for small jaws" },
    { name: "Hill's Science Diet Small Paws", type: "Dry", rating: 4.6, note: "Supports healthy weight and heart health" },
    { name: "Merrick Lil Plates", type: "Dry", rating: 4.5, note: "Real deboned chicken, grain-free option" },
    { name: "Nutro Ultra Small Breed", type: "Dry", rating: 4.4, note: "Trio of proteins, superfoods blend" },
  ],
  adult_medium: [
    { name: "Purina Pro Plan Adult", type: "Dry", rating: 4.8, note: "Chicken and rice, highly digestible" },
    { name: "Hill's Science Diet Adult", type: "Dry", rating: 4.7, note: "Balanced nutrition, vet recommended" },
    { name: "Orijen Original", type: "Dry", rating: 4.7, note: "Biologically appropriate, 38% protein" },
    { name: "Taste of the Wild Pacific Stream", type: "Dry", rating: 4.6, note: "Smoked salmon, probiotics, antioxidants" },
    { name: "Blue Buffalo Wilderness", type: "Dry", rating: 4.5, note: "High protein, grain-free" },
  ],
  adult_large: [
    { name: "Purina Pro Plan Large Breed", type: "Dry", rating: 4.8, note: "Glucosamine for joint health" },
    { name: "Royal Canin Large Adult", type: "Dry", rating: 4.7, note: "Joint support, adapted kibble texture" },
    { name: "Hill's Science Diet Large Breed", type: "Dry", rating: 4.6, note: "Natural fiber, easy digestion" },
    { name: "Eukanuba Large Breed Adult", type: "Dry", rating: 4.5, note: "Optimal calcium levels, dental care" },
    { name: "Diamond Naturals Large Breed", type: "Dry", rating: 4.3, note: "Value pick, glucosamine and chondroitin" },
  ],
  senior: [
    { name: "Hill's Science Diet Senior 7+", type: "Dry", rating: 4.8, note: "Clinically proven antioxidants, joint support" },
    { name: "Purina Pro Plan Bright Mind Senior", type: "Dry", rating: 4.7, note: "Enhanced botanical oils for brain health" },
    { name: "Royal Canin Aging 12+", type: "Dry", rating: 4.6, note: "Highly digestible, kidney support" },
    { name: "Blue Buffalo Homestyle Senior", type: "Wet", rating: 4.5, note: "Soft for aging teeth, real meat" },
    { name: "Wellness Core Senior", type: "Dry", rating: 4.4, note: "High protein, low fat, joint care" },
  ],
};

const FEED_SCHED = {
  puppy: { times: ["7:00 AM","12:00 PM","5:00 PM","9:00 PM"], cups: 0.5, note: "Puppies need 3-4 meals/day for steady blood sugar" },
  adult_small: { times: ["7:00 AM","6:00 PM"], cups: 0.5, note: "Small breeds have fast metabolisms" },
  adult_medium: { times: ["7:00 AM","6:00 PM"], cups: 1.5, note: "Standard twice daily feeding" },
  adult_large: { times: ["7:00 AM","6:00 PM"], cups: 2.5, note: "Larger meals spaced to prevent bloat" },
  senior: { times: ["8:00 AM","5:00 PM"], cups: 1.0, note: "Seniors need fewer calories, softer food" },
};

const OUT_SCHED = {
  puppy: ["6:00 AM","8:00 AM","10:00 AM","12:00 PM","2:00 PM","4:00 PM","6:00 PM","8:00 PM","10:00 PM"],
  adult: ["6:30 AM","12:00 PM","6:00 PM","10:00 PM"],
  senior: ["6:00 AM","10:00 AM","2:00 PM","6:00 PM","9:30 PM"],
};

const HEAT_TIPS = [
  "Use doggy diapers or pants to manage discharge and protect furniture.",
  "Keep her away from intact male dogs at all times, even through fences.",
  "Clean bedding and rest areas more frequently to maintain hygiene.",
  "Reduce high-intensity exercise during the first week as she may be uncomfortable.",
  "Consult your vet about spaying, which is the best long-term solution.",
  "Watch for signs of pyometra: lethargy, vomiting, and excessive thirst.",
  "Bathing more frequently helps with odor and comfort during her cycle.",
  "She may be more affectionate or irritable, so give extra patience and attention.",
  "Keep all outdoor trips on-leash as her scent attracts males from far away.",
  "This is a good time to confirm microchipping and ID tags are up to date.",
];

const CARE_TIPS = [
  "Brush teeth 2-3 times per week to prevent dental disease.",
  "Bathe monthly or when dirty. Over-bathing strips natural oils.",
  "Keep vaccinations and flea/tick prevention up to date.",
  "Ensure daily exercise appropriate for breed and age.",
  "Mental stimulation is as important as physical exercise.",
  "Schedule annual vet checkups, twice yearly for seniors.",
  "Discuss heartworm prevention with your vet.",
  "Scheduled meals (not free-feeding) help prevent obesity.",
  "Regular grooming prevents mats and helps detect skin issues early.",
  "Dogs thrive on routine. Keep feeding and walk times consistent.",
];

// rank stuff - based on points
var TRAINER_RANKS = [
  { min:0,    label:"Wandering Paw",        icon:"🐾", color:"#94a3b8", glow:"rgba(148,163,184,0.22)",  desc:"Every journey begins with a single paw print." },
  { min:50,   label:"Trail Seeker",          icon:"🌿", color:"#6ee7b7", glow:"rgba(110,231,183,0.22)",  desc:"You've started exploring the path of a dedicated caregiver." },
  { min:150,  label:"Pack Initiate",         icon:"🐕", color:"#93c5fd", glow:"rgba(147,197,253,0.22)",  desc:"Your pack is growing and your dedication is showing." },
  { min:300,  label:"Loyal Guardian",        icon:"🛡️", color:"#cd7f32", glow:"rgba(205,127,50,0.25)",   desc:"Reliable, consistent, and always there for your dogs." },
  { min:600,  label:"Alpha Scout",           icon:"🔥", color:"#fb923c", glow:"rgba(251,146,60,0.25)",   desc:"Your daily habits have forged a strong bond with your pack." },
  { min:1000, label:"Pack Commander",        icon:"⚔️", color:"#c0c8d8", glow:"rgba(192,200,216,0.25)",  desc:"You lead your pack with confidence and care." },
  { min:1750, label:"Elite Handler",         icon:"🏅", color:"#f5c518", glow:"rgba(245,197,24,0.28)",   desc:"Few reach this level. Your dedication is extraordinary." },
  { min:2750, label:"Master of the Pack",    icon:"🌟", color:"#fde68a", glow:"rgba(253,230,138,0.28)",  desc:"A true master — every action strengthens the bond." },
  { min:4000, label:"Grand Pathfinder",      icon:"💎", color:"#a8d8ff", glow:"rgba(168,216,255,0.30)",  desc:"You have blazed trails others can only dream of." },
  { min:6000, label:"Apex Guardian",         icon:"🦅", color:"#c084fc", glow:"rgba(192,132,252,0.30)",  desc:"Soaring above all, your pack thrives under your watch." },
  { min:9000, label:"Eternal Pack Legend",   icon:"🌙", color:"#f472b6", glow:"rgba(244,114,182,0.30)",  desc:"A legend whose legacy echoes through every walk and meal." },
  { min:13000,label:"Sovereign of All Paws", icon:"👑", color:"#f4a24d", glow:"rgba(244,162,77,0.35)",   desc:"The highest honor. You are the ultimate dog caregiver." },
];

var TP_VALUES = {
  fed: 2,
  outside: 1,
  weight: 5,
  vet_add: 10,
  vet_complete: 8,
  vax_add: 8,
  med_given: 3,
  heat_log: 5,
  add_dog: 15,
  med_add: 6,
};

// Cooldown periods (in milliseconds) to prevent TP farming
var COOLDOWNS = {
  fed: 4 * 3600000,        // 4 hours - default (overridden by age below)
  outside: 2 * 3600000,    // 2 hours - default (overridden by age below)
  weight: 24 * 3600000,    // 24 hours - once per day max
  med_given: 3600000,      // 1 hour - minimum between medication doses
  heat_log: 24 * 3600000,  // 24 hours - once per day max
};

// Age-based cooldowns for fed and outside
// Puppies need more frequent attention than adults or seniors
function getFedCooldown(dog) {
  var age = (dog && dog.age !== undefined && dog.age !== "") ? parseFloat(dog.age) : 1;
  if (isNaN(age)) age = 1;
  if (age < 0.083) return 0.5  * 3600000; // Under 1 month: every 30 minutes
  if (age < 0.5)  return 1.5 * 3600000; // Under 6 months: every 1.5 hours
  if (age < 1)    return 2   * 3600000; // 6-12 months: every 2 hours
  if (age < 3)    return 3   * 3600000; // 1-3 years: every 3 hours
  if (age < 8)    return 4   * 3600000; // Adult: every 4 hours
  return           5   * 3600000;        // Senior 8+: every 5 hours
}

function getOutsideCooldown(dog) {
  var age = (dog && dog.age !== undefined && dog.age !== "") ? parseFloat(dog.age) : 1;
  if (isNaN(age)) age = 1;
  if (age < 0.5)  return 0.5  * 3600000; // Under 6 months: every 30 min
  if (age < 1)    return 1    * 3600000; // 6-12 months: every 1 hour
  if (age < 3)    return 1.5  * 3600000; // 1-3 years: every 1.5 hours
  if (age < 8)    return 2    * 3600000; // Adult: every 2 hours
  return           3    * 3600000;        // Senior 8+: every 3 hours
}

function getCooldownLabel(dog) {
  var age = (dog && dog.age !== undefined && dog.age !== "") ? parseFloat(dog.age) : 1;
  if (isNaN(age)) age = 1;
  if (age < 0.083) return "Newborn (under 1 mo)";
  if (age < 0.5) return "Puppy (under 6 mo)";
  if (age < 1)   return "Puppy (6–12 mo)";
  if (age < 3)   return "Young adult";
  if (age < 8)   return "Adult";
  return "Senior";
}

// ═══════════════════════════════════════════════════════════════
// TIER SYSTEM - Progressive with Action Limits (Hybrid Model)
// ═══════════════════════════════════════════════════════════════

var TIER_DEFINITIONS = {
  free: {
    name: "Free",
    price: 0,
    priceAnnual: 0,
    displayPrice: "$0",
    icon: "🆓",
    color: "#94a3b8",
    maxDogs: 1,
    actionsPerWeek: 15,
    logRetentionDays: 30,
    maxTP: 100,
    documentStorageMB: 0,
    features: {
      medications: false,
      heatTracking: false,
      documents: false,
      export: false,
      packBadges: false,
      familySharing: false,
      notifications: false
    },
    allowedBadgeTiers: [1]
  },
  daily: {
    name: "Daily",
    price: 2.99,
    priceAnnual: 29.99,
    displayPrice: "$2.99/mo",
    icon: "📅",
    color: "#3b82f6",
    maxDogs: 1,
    actionsPerWeek: Infinity,
    logRetentionDays: 180,
    maxTP: 250,
    documentStorageMB: 0,
    features: {
      medications: false,
      heatTracking: false,
      documents: false,
      export: false,
      packBadges: false,
      familySharing: false,
      notifications: false
    },
    allowedBadgeTiers: [1, 2]
  },
  pro: {
    name: "Pro",
    price: 6.99,
    priceAnnual: 69.99,
    displayPrice: "$6.99/mo",
    icon: "⭐",
    color: "#8b5cf6",
    maxDogs: 1,
    actionsPerWeek: Infinity,
    logRetentionDays: Infinity,
    maxTP: Infinity,
    documentStorageMB: 50,
    features: {
      medications: true,
      heatTracking: false,
      documents: true,
      export: true,
      packBadges: false,
      familySharing: false,
      notifications: false
    },
    allowedBadgeTiers: [1, 2, 3]
  },
  pack: {
    name: "Pack",
    price: 11.99,
    priceAnnual: 119.99,
    displayPrice: "$11.99/mo",
    icon: "🐾",
    color: "#f59e0b",
    maxDogs: 5,
    actionsPerWeek: Infinity,
    logRetentionDays: Infinity,
    maxTP: Infinity,
    documentStorageMB: 75,
    features: {
      medications: true,
      heatTracking: true,
      documents: true,
      export: true,
      packBadges: true,
      familySharing: true,
      notifications: true
    },
    allowedBadgeTiers: [1, 2, 3, 4]
  },
  elite: {
    name: "Elite",
    price: 24.99,
    priceAnnual: 249.99,
    displayPrice: "$24.99/mo",
    icon: "👑",
    color: "#ec4899",
    maxDogs: Infinity,
    actionsPerWeek: Infinity,
    logRetentionDays: Infinity,
    maxTP: Infinity,
    documentStorageMB: 500,
    features: {
      medications: true,
      heatTracking: true,
      documents: true,
      export: true,
      packBadges: true,
      familySharing: true,
      notifications: true,
      analytics: true,
      apiAccess: true,
      whiteLabel: true
    },
    allowedBadgeTiers: [1, 2, 3, 4]
  }
};

// get tier config
function getTierConfig(tier) {
  return TIER_DEFINITIONS[tier] || TIER_DEFINITIONS.free;
}

// check feature access
function canAccessFeature(user, featureName) {
  var tier = user.tier || 'free';
  var config = getTierConfig(tier);
  return config.features[featureName] === true;
}

// weekly action count - resets on monday
function getWeeklyActionCount(user) {
  var actionLog = user.weeklyActions || [];
  var now = new Date();
  var weekStart = getWeekStart(now);
  
  // Filter actions from current week
  var thisWeek = actionLog.filter(function(a) {
    return new Date(a.timestamp) >= weekStart;
  });
  
  return thisWeek.length;
}

// get monday of current week
// not totally sure why this works but don't touch it - it correctly finds the Monday
function getWeekStart(date) {
  var d = new Date(date);
  var day = d.getDay();
  var diff = d.getDate() - day + (day === 0 ? -6 : 1);
  var monday = new Date(d.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

// log an action
function logAction(user, setUser, actionType) {
  var tier = user.tier || 'free';
  var config = getTierConfig(tier);
  
  // If unlimited actions, don't track
  if (config.actionsPerWeek === Infinity) return true;
  
  var actionLog = user.weeklyActions || [];
  var count = getWeeklyActionCount(user);
  
  // Check limit
  if (count >= config.actionsPerWeek) {
    return false; // Limit reached
  }
  
  // Log the action
  var newAction = {
    type: actionType,
    timestamp: new Date().toISOString()
  };
  
  var updatedLog = actionLog.concat([newAction]);
  var updatedUser = Object.assign({}, user, { weeklyActions: updatedLog });
  setUser(updatedUser);
  
  // Persist to localStorage
  var users = JSON.parse(localStorage.getItem("pt_users") || "{}");
  users[user.email] = updatedUser;
  localStorage.setItem("pt_users", JSON.stringify(users));
  
  return true;
}

// cooldown check
function isOnCooldown(lastActionTime, cooldownMs) {
  if (!lastActionTime) return false;
  var timeSince = Date.now() - new Date(lastActionTime).getTime();
  return timeSince < cooldownMs;
}

// how many minutes left on cooldown
function getCooldownRemaining(lastActionTime, cooldownMs) {
  if (!lastActionTime) return 0;
  var timeSince = Date.now() - new Date(lastActionTime).getTime();
  var remaining = cooldownMs - timeSince;
  return remaining > 0 ? Math.ceil(remaining / 60000) : 0;
}

// format the cooldown for display
function formatCooldown(minutes) {
  if (minutes < 60) return minutes + "m";
  var hours = Math.floor(minutes / 60);
  var mins = minutes % 60;
  return mins > 0 ? hours + "h " + mins + "m" : hours + "h";
}

function getTrainerRank(tp) {
  for (var i = TRAINER_RANKS.length - 1; i >= 0; i--) {
    if (tp >= TRAINER_RANKS[i].min) return TRAINER_RANKS[i];
  }
  return TRAINER_RANKS[0];
}

// spent way too long on this - dates kept showing the wrong day because of timezone
// had to split the string manually instead of just doing new Date(string)
function parseLocalDate(dateString) {
  if (!dateString) return null;
  var parts = dateString.split('-');
  if (parts.length !== 3) return new Date(dateString);
  var year = parseInt(parts[0]);
  var month = parseInt(parts[1]) - 1;
  var day = parseInt(parts[2]);
  return new Date(year, month, day);
}

// utility functions
// figures out if a dog is puppy/small/medium/large/senior based on age + weight
// used to pick the right food recommendations
function getDogCat(dog) {
  const age = parseFloat(dog && dog.age) || 1;
  const wt = parseFloat(dog && dog.weight) || 30;
  if (age < 1) return "puppy";
  if (age >= 8) return "senior";
  if (wt < 25) return "adult_small";
  if (wt <= 60) return "adult_medium";
  return "adult_large";
}

// heat cycle tracker - took a while to get the math right
// 180 day cycle, 21 day duration
function getHeatStatus(dog) {
  if (!dog.lastHeatDate) return null;
  var lastHeat = parseLocalDate(dog.lastHeatDate);
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysSince = Math.floor((today - lastHeat) / 86400000);
  const cycleLen = 180;
  const dur = 21;
  const daysUntilNext = cycleLen - daysSince;
  const inHeat = daysSince >= 0 && daysSince <= dur;
  return {
    inHeat,
    heatDay: inHeat ? daysSince + 1 : null,
    dur,
    upcoming: !inHeat && daysUntilNext <= 14 && daysUntilNext > 0,
    endingSoon: inHeat && (dur - daysSince) <= 5,
    daysUntilNext: Math.max(0, daysUntilNext),
    daysSince,
  };
}

function timeAgo(d) {
  if (!d) return "Never";
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return m + "m ago";
  const h = Math.floor(m / 60);
  if (h < 24) return h + "h ago";
  return Math.floor(h / 24) + "d ago";
}

function daysUntil(s) {
  if (!s) return null;
  var targetDate = parseLocalDate(s);
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((targetDate - today) / 86400000);
}

// formats date for display
function fmtDate(s) {
  if (!s) return "—";
  var date = parseLocalDate(s);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function isOverdue(s) {
  const d = daysUntil(s);
  return d !== null && d < 0;
}

// within defaults to 30 days
function isDueSoon(s, within) {
  const w = within === undefined ? 30 : within;
  const d = daysUntil(s);
  return d !== null && d >= 0 && d <= w;
}

function fmtTimestamp(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" }) +
    " at " + d.toLocaleTimeString("en-US", { hour:"numeric", minute:"2-digit", hour12:true });
}

function fmtDayLabel(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate()-1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-US", { weekday:"long", month:"short", day:"numeric" });
}

// mobile detection
function useIsMobile() {
  var [isMobile, setIsMobile] = useState(function(){ return window.innerWidth <= 768; });
  useEffect(function() {
    function onResize() { setIsMobile(window.innerWidth <= 768); }
    window.addEventListener("resize", onResize);
    return function() { window.removeEventListener("resize", onResize); };
  }, []);
  return isMobile;
}

// theme / colors
const ThemeContext = createContext(null);
function useTheme() { return useContext(ThemeContext); }

// returns color values based on dark/light mode
// had to tweak a bunch of these by hand to get them looking right
function makeTheme(dark) {
  if (dark) {
    return {
      isDark: true,
      bg: "#0c0e16",
      card: "#131620",
      cardHov: "#181c2a",
      border: "#252838",
      accent: "#f4a24d",
      accentFaint: "rgba(244,162,77,0.10)",
      accentDark: "rgba(244,162,77,0.22)",
      accentGlow: "rgba(244,162,77,0.22)",
      green: "#52d484",
      greenFaint: "rgba(82,212,132,0.10)",
      pink: "#f472b6",
      pinkFaint: "rgba(244,114,182,0.10)",
      blue: "#60a5fa",
      blueFaint: "rgba(96,165,250,0.10)",
      purple: "#a78bfa",
      purpleFaint: "rgba(167,139,250,0.10)",
      yellow: "#fbbf24",
      yellowFaint: "rgba(251,191,36,0.10)",
      red: "#f87171",
      redFaint: "rgba(248,113,113,0.10)",
      text: "#e2e8f0",
      muted: "#94a3b8",
    };
  }
  return {
    isDark: false,
    bg: "#ffffff",
    card: "#f5f2ee",
    cardHov: "#f0ece6",
    border: "#c8c2b8",
    accent: "#c97a2f",
    accentFaint: "rgba(201,122,47,0.12)",
    accentDark: "rgba(201,122,47,0.28)",
    accentGlow: "rgba(201,122,47,0.22)",
    green: "#2d8a55",
    greenFaint: "rgba(45,138,85,0.12)",
    pink: "#c4527a",
    pinkFaint: "rgba(196,82,122,0.12)",
    blue: "#3b6dbf",
    blueFaint: "rgba(59,109,191,0.12)",
    purple: "#6b4fbf",
    purpleFaint: "rgba(107,79,191,0.12)",
    yellow: "#b8860b",
    yellowFaint: "rgba(184,134,11,0.12)",
    red: "#b94040",
    redFaint: "rgba(185,64,64,0.12)",
    text: "#1a1814",
    muted: "#5a524a",
  };
}

function makeAppCss(C) {
  return [
    "@import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');",
    "*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}",
    "html,body,#root{height:100%;}",
    "body{background:" + C.bg + ";color:" + C.text + ";font-family:'DM Sans',sans-serif;}",
    "::-webkit-scrollbar{width:22px;height:22px;}",
    "::-webkit-scrollbar-track{background:" + C.card + ";border-radius:4px;}",
    "::-webkit-scrollbar-thumb{background:" + C.muted + ";border-radius:4px;border:4px solid " + C.bg + ";}",
    "::-webkit-scrollbar-thumb:hover{background:" + C.accent + ";}",
    "::-webkit-scrollbar-button{background:" + C.card + ";border:2px solid " + C.border + ";display:block;width:22px;height:22px;}",
    "::-webkit-scrollbar-button:hover{background:" + C.accentFaint + ";border-color:" + C.accent + ";}",
    "::-webkit-scrollbar-button:vertical:decrement{background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M6 0L12 8H0z' fill='" + encodeURIComponent(C.text) + "'/%3E%3C/svg%3E\");background-repeat:no-repeat;background-position:center;background-size:12px;}",
    "::-webkit-scrollbar-button:vertical:increment{background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M6 8L0 0H12z' fill='" + encodeURIComponent(C.text) + "'/%3E%3C/svg%3E\");background-repeat:no-repeat;background-position:center;background-size:12px;}",
    "::-webkit-scrollbar-button:vertical:decrement:hover{background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M6 0L12 8H0z' fill='" + encodeURIComponent(C.accent) + "'/%3E%3C/svg%3E\");}",
    "::-webkit-scrollbar-button:vertical:increment:hover{background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M6 8L0 0H12z' fill='" + encodeURIComponent(C.accent) + "'/%3E%3C/svg%3E\");}",
    "::-webkit-scrollbar-button:horizontal:decrement{background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 6 10'%3E%3Cpath d='M0 5L6 0V10z' fill='%2364748b'/%3E%3C/svg%3E\");background-repeat:no-repeat;background-position:center;background-size:5px;}",
    "::-webkit-scrollbar-button:horizontal:increment{background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 6 10'%3E%3Cpath d='M6 5L0 0V10z' fill='%2364748b'/%3E%3C/svg%3E\");background-repeat:no-repeat;background-position:center;background-size:5px;}",
    "::-webkit-scrollbar-button:horizontal:decrement:hover{background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 6 10'%3E%3Cpath d='M0 5L6 0V10z' fill='%23f4a24d'/%3E%3C/svg%3E\");}",
    "::-webkit-scrollbar-button:horizontal:increment:hover{background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 6 10'%3E%3Cpath d='M6 5L0 0V10z' fill='%23f4a24d'/%3E%3C/svg%3E\");}",
    "input,select,textarea{background:" + C.bg + ";border:1.5px solid " + C.border + ";color:" + C.text + ";border-radius:10px;padding:10px 14px;font-family:'DM Sans',sans-serif;font-size:14px;width:100%;outline:none;transition:border-color .2s,box-shadow .2s;-webkit-appearance:none;}",
    "input[type='date']::-webkit-calendar-picker-indicator{background:" + (C.isDark ? "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 24 24'%3E%3Cpath d='M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5zm2 4h10v2H7v-2zm0 4h7v2H7v-2z'/%3E%3C/svg%3E\")" : "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5zm2 4h10v2H7v-2zm0 4h7v2H7v-2z'/%3E%3C/svg%3E\") ") + ";cursor:pointer;filter:brightness(1.2);}",
    "input[type='date']::-webkit-inner-spin-button,input[type='date']::-webkit-clear-button{display:none;}",
    "input[type='date']{cursor:text;}",
    "input[type='date']::-webkit-datetime-edit{color:" + C.text + ";cursor:text;}",
    "input[type='date']::-webkit-datetime-edit-fields-wrapper{color:" + C.text + ";cursor:text;}",
    "input[type='date']::-webkit-datetime-edit-text{color:" + C.text + ";padding:0 0.3em;cursor:text;}",
    "input[type='date']::-webkit-datetime-edit-month-field{color:" + C.text + ";cursor:text;}",
    "input[type='date']::-webkit-datetime-edit-day-field{color:" + C.text + ";cursor:text;}",
    "input[type='date']::-webkit-datetime-edit-year-field{color:" + C.text + ";cursor:text;}",
    "input:focus,select:focus,textarea:focus{border-color:" + C.accent + ";box-shadow:0 0 0 3px " + C.accentGlow + ";}",
    "select{background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3E%3Cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\");background-repeat:no-repeat;background-position:right 12px center;background-size:16px;padding-right:36px;}",
    "select option{background:" + C.card + ";color:" + C.text + ";}",
    "textarea{resize:vertical;}",
    "button{cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .18s;border:none;}",
    ".btnP{background:" + C.accent + ";color:#fff;border-radius:10px;padding:10px 20px;font-weight:600;font-size:14px;}",
    ".btnP:hover{filter:brightness(1.1);transform:translateY(-1px);box-shadow:0 6px 20px " + C.accentGlow + ";}",
    ".btnG{background:transparent;color:" + C.muted + ";border:1.5px solid " + C.border + ";border-radius:10px;padding:9px 18px;font-size:13px;}",
    ".btnG:hover{border-color:" + C.accent + ";color:" + C.accent + ";background:" + C.accentFaint + ";}",
    ".btnD{background:transparent;color:" + C.red + ";border:1.5px solid " + C.red + ";border-radius:9px;padding:7px 13px;font-size:12px;}",
    ".btnD:hover{background:" + C.redFaint + ";}",
    ".btnI{background:" + (C.isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)") + ";border:1.5px solid " + (C.isDark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.22)") + ";color:" + (C.isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.65)") + ";border-radius:8px;width:30px;height:30px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;flex-shrink:0;}",
    ".btnI:hover{background:rgba(220,38,38,0.18);border-color:#b91c1c;color:#b91c1c;}",
    ".chip{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:99px;font-size:11px;font-weight:600;white-space:nowrap;}",
    ".fadeIn{animation:fadeIn .3s ease forwards;}",
    "@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}",
    "@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}",
    ".pulse{animation:pulse 2.2s ease-in-out infinite;}",
    "@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}",
    "@keyframes sitBounce{0%,100%{transform:translateY(0px)}50%{transform:translateY(-5px)}}",
    "@keyframes sitTailWag{0%,100%{transform:rotate(-20deg)}50%{transform:rotate(30deg)}}",
    "@keyframes sitEarBounce{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(8deg)}}",
    "@keyframes sitBlink{0%,90%,100%{transform:scaleY(1)}95%{transform:scaleY(0.1)}}",
    "@keyframes sitBreath{0%,100%{transform:scaleX(1) scaleY(1)}50%{transform:scaleX(1.03) scaleY(0.97)}}",
    ".g2{display:grid;grid-template-columns:1fr 1fr;gap:12px;}",
    ".sectionLabel{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:" + C.muted + ";margin-bottom:10px;}",
    ".tabBarContainer::-webkit-scrollbar{display:none;}",
    // mobile styles
    "@media(max-width:768px){",
    "::-webkit-scrollbar{width:4px;height:4px;}",
    ".g2{grid-template-columns:1fr!important;}",
    "}",
  ].join("\n");
}

// reusable components
function Modal({ title, onClose, children }) {
  var C = useTheme();
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.8)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16 }} onClick={onClose}>
      <div className="fadeIn" style={{ background:C.card,border:"1.5px solid "+C.border,borderRadius:20,padding:28,width:"100%",maxWidth:560,maxHeight:"92vh",overflowY:"auto" }} onClick={function(e){e.stopPropagation();}}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22 }}>
          <h2 style={{ fontFamily:"Fraunces",fontSize:20,color:C.text,fontWeight:700 }}>{title}</h2>
          <button className="btnI" onClick={onClose}>&#x2715;</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// Custom Alert Dialog Component
function AlertDialog({ show, title, message, onClose }) {
  var C = useTheme();
  if (!show) return null;
  
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:99999,display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
      <div className="fadeIn" style={{ background:C.card,borderRadius:16,maxWidth:450,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,0.4)",border:"2px solid "+C.red }}>
        <div style={{ padding:"24px 28px",borderBottom:"2px solid "+C.border }}>
          <h2 style={{ fontFamily:"Fraunces",fontSize:20,fontWeight:800,color:C.red,display:"flex",alignItems:"center",gap:10 }}>
            <span style={{ fontSize:28 }}>⚠️</span>
            {title}
          </h2>
        </div>
        <div style={{ padding:"24px 28px" }}>
          <p style={{ fontSize:15,color:C.text,lineHeight:1.6,whiteSpace:"pre-line" }}>{message}</p>
        </div>
        <div style={{ padding:"0 28px 24px 28px" }}>
          <button type="button" onClick={onClose} style={{ width:"100%",background:C.accent,color:"#fff",border:"none",borderRadius:10,padding:"12px 20px",fontSize:16,fontWeight:700,cursor:"pointer",transition:"all .15s" }}
            onMouseEnter={function(e){ e.currentTarget.style.opacity="0.9"; }}
            onMouseLeave={function(e){ e.currentTarget.style.opacity="1"; }}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

// Custom Confirmation Dialog Component
function ConfirmDialog({ show, title, message, onConfirm, onCancel }) {
  var C = useTheme();
  if (!show) return null;
  
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:99999,display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
      <div className="fadeIn" style={{ background:C.card,borderRadius:16,maxWidth:450,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,0.4)",border:"2px solid "+C.accent }}>
        <div style={{ padding:"24px 28px",borderBottom:"2px solid "+C.border }}>
          <h2 style={{ fontFamily:"Fraunces",fontSize:20,fontWeight:800,color:C.accent,display:"flex",alignItems:"center",gap:10 }}>
            <span style={{ fontSize:28 }}>❓</span>
            {title}
          </h2>
        </div>
        <div style={{ padding:"24px 28px" }}>
          <p style={{ fontSize:15,color:C.text,lineHeight:1.6,whiteSpace:"pre-line" }}>{message}</p>
        </div>
        <div style={{ padding:"0 28px 24px 28px",display:"flex",gap:12 }}>
          <button type="button" onClick={onCancel} style={{ flex:1,background:C.bg,color:C.text,border:"1.5px solid "+C.border,borderRadius:10,padding:"12px 20px",fontSize:16,fontWeight:700,cursor:"pointer",transition:"all .15s" }}
            onMouseEnter={function(e){ e.currentTarget.style.background=C.border; }}
            onMouseLeave={function(e){ e.currentTarget.style.background=C.bg; }}>
            Cancel
          </button>
          <button type="button" onClick={onConfirm} style={{ flex:1,background:C.red,color:"#fff",border:"none",borderRadius:10,padding:"12px 20px",fontSize:16,fontWeight:700,cursor:"pointer",transition:"all .15s" }}
            onMouseEnter={function(e){ e.currentTarget.style.opacity="0.9"; }}
            onMouseLeave={function(e){ e.currentTarget.style.opacity="1"; }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function FF({ label, children, hint, hintStyle }) {
  var C = useTheme();
  return (
    <div style={{ marginBottom:14 }}>
      {label && <label style={{ display:"block",fontSize:14,color:C.text,marginBottom:6,fontWeight:700 }}>{label}</label>}
      {children}
      {hint && <p style={{ fontSize:13,color:C.text,marginTop:4,opacity:0.65,fontWeight:500,...(hintStyle||{}) }}>{hint}</p>}
    </div>
  );
}

function Card({ children, style, onClick }) {
  var C = useTheme();
  var s = Object.assign({ background:C.card,border:"1.5px solid "+C.border,borderRadius:16,padding:18,transition:"all .18s",cursor:onClick?"pointer":"default" }, style || {});
  return (
    <div style={s}
      onMouseEnter={function(e){ if(onClick){e.currentTarget.style.borderColor=C.accent;e.currentTarget.style.background=C.cardHov;} }}
      onMouseLeave={function(e){ if(onClick){e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.card;} }}
      onClick={onClick}>
      {children}
    </div>
  );
}

function Chip({ color, children, extraStyle }) {
  var C = useTheme();
  var colors = {
    green: [C.green, C.greenFaint],
    blue: [C.blue, C.blueFaint],
    pink: [C.pink, C.pinkFaint],
    accent: [C.accent, C.accentFaint],
    red: [C.red, C.redFaint],
    yellow: [C.yellow, C.yellowFaint],
    purple: [C.purple, C.purpleFaint],
  };
  var pair = colors[color] || colors.accent;
  return <span className="chip" style={Object.assign({ background:pair[1],color:pair[0] }, extraStyle||{})}>{children}</span>;
}

function EmptyState({ icon, title, sub, action, onAction }) {
  var C = useTheme();
  return (
    <div style={{ textAlign:"center",padding:"34px 20px",color:C.muted }}>
      <div style={{ fontSize:42,marginBottom:10 }}>{icon}</div>
      <p style={{ fontFamily:"Fraunces",fontSize:18,color:C.text,marginBottom:8 }}>{title}</p>
      <p style={{ fontSize:15,color:C.muted,lineHeight:1.6,marginBottom:action ? 16 : 0 }}>{sub}</p>
      {action && <button className="btnP" style={{ fontSize:13 }} onClick={onAction}>{action}</button>}
    </div>
  );
}

// photo editor modal
function PhotoEditorModal({ photo, onSave, onClose, shape }) {
  var C = useTheme();
  var radius = shape === "circle" ? "50%" : "14px";
  var [scale, setScale] = useState(100);
  var [posX, setPosX] = useState(50);
  var [posY, setPosY] = useState(50);
  var [rotation, setRotation] = useState(0);
  var canvasRef = useRef(null);

  function save() {
    var canvas = document.createElement("canvas");
    canvas.width = 300; canvas.height = 300;
    var ctx = canvas.getContext("2d");
    var img = new window.Image();
    img.onload = function() {
      var sc = scale / 100;
      var iw = img.naturalWidth, ih = img.naturalHeight;
      
      // Calculate dimensions to fill the canvas
      var canvasSize = 300;
      var aspectRatio = iw / ih;
      var scaledWidth, scaledHeight;
      
      if (aspectRatio > 1) {
        // Landscape
        scaledHeight = canvasSize * sc;
        scaledWidth = scaledHeight * aspectRatio;
      } else {
        // Portrait or square
        scaledWidth = canvasSize * sc;
        scaledHeight = scaledWidth / aspectRatio;
      }
      
      // Calculate offset based on position sliders
      var ox = -(posX / 100) * (scaledWidth - canvasSize);
      var oy = -(posY / 100) * (scaledHeight - canvasSize);
      
      // Apply rotation
      ctx.save();
      ctx.translate(canvasSize / 2, canvasSize / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-canvasSize / 2, -canvasSize / 2);
      
      if (shape === "circle") {
        ctx.beginPath(); 
        ctx.arc(150, 150, 150, 0, Math.PI * 2); 
        ctx.clip();
      }
      
      ctx.drawImage(img, ox, oy, scaledWidth, scaledHeight);
      ctx.restore();
      onSave(canvas.toDataURL("image/jpeg", 0.92));
    };
    img.src = photo;
  }

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.88)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:16 }}
      onClick={onClose}
      onKeyDown={function(e){ if(e.key==="Enter") { e.preventDefault(); save(); } }}>
      <div className="fadeIn" style={{ background:C.card,border:"1.5px solid "+C.border,borderRadius:20,padding:28,width:"100%",maxWidth:500 }}
        onClick={function(e){ e.stopPropagation(); }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6 }}>
          <h3 style={{ fontFamily:"Fraunces",fontSize:18,color:C.text,fontWeight:700 }}>Adjust Photo</h3>
          <button className="btnI" onClick={onClose}>&#x2715;</button>
        </div>
        <p style={{ color:C.muted,fontSize:13,marginBottom:20,textAlign:"center" }}>Use the sliders below to adjust your photo</p>

        {/* Preview */}
        <div style={{ display:"flex",justifyContent:"center",marginBottom:24 }}>
          <div style={{ width:240,height:240,borderRadius:radius,overflow:"hidden",border:"2.5px solid "+C.accent,position:"relative",background:C.bg }}>
            <img src={photo} alt="preview"
              style={{ 
                position:"absolute",
                top:"50%",
                left:"50%",
                width:"auto",
                height:"auto",
                maxWidth:"none",
                transform:"translate(-50%, -50%) translate("+((posX-50)*2.4)+"px, "+((posY-50)*2.4)+"px) scale("+(scale/100)+") rotate("+rotation+"deg)",
                transformOrigin:"center",
                transition:"transform .15s ease-out"
              }} 
            />
          </div>
        </div>

        {/* Controls */}
        <div style={{ marginBottom:18 }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
            <span style={{ fontSize:14,color:C.text,fontWeight:600 }}>🔍 Zoom</span>
            <span style={{ fontSize:14,color:C.accent,fontWeight:700 }}>{scale}%</span>
          </div>
          <input type="range" min={50} max={200} value={scale} step={5}
            onChange={function(e){ setScale(parseInt(e.target.value)); }}
            style={{ width:"100%",accentColor:C.accent,height:6,borderRadius:6,outline:"none",border:"none",padding:0,cursor:"pointer" }} />
          <div style={{ display:"flex",justifyContent:"space-between",fontSize:12,color:C.muted,marginTop:4 }}>
            <span>50%</span><span>200%</span>
          </div>
        </div>

        <div style={{ marginBottom:18 }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
            <span style={{ fontSize:14,color:C.text,fontWeight:600 }}>↔️ Horizontal</span>
            <span style={{ fontSize:14,color:C.accent,fontWeight:700 }}>{posX}%</span>
          </div>
          <input type="range" min={0} max={100} value={posX}
            onChange={function(e){ setPosX(parseInt(e.target.value)); }}
            style={{ width:"100%",accentColor:C.accent,height:6,borderRadius:6,outline:"none",border:"none",padding:0,cursor:"pointer" }} />
          <div style={{ display:"flex",justifyContent:"space-between",fontSize:12,color:C.muted,marginTop:4 }}>
            <span>Left</span><span>Right</span>
          </div>
        </div>

        <div style={{ marginBottom:18 }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
            <span style={{ fontSize:14,color:C.text,fontWeight:600 }}>↕️ Vertical</span>
            <span style={{ fontSize:14,color:C.accent,fontWeight:700 }}>{posY}%</span>
          </div>
          <input type="range" min={0} max={100} value={posY}
            onChange={function(e){ setPosY(parseInt(e.target.value)); }}
            style={{ width:"100%",accentColor:C.accent,height:6,borderRadius:6,outline:"none",border:"none",padding:0,cursor:"pointer" }} />
          <div style={{ display:"flex",justifyContent:"space-between",fontSize:12,color:C.muted,marginTop:4 }}>
            <span>Up</span><span>Down</span>
          </div>
        </div>

        <div style={{ marginBottom:24 }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
            <span style={{ fontSize:14,color:C.text,fontWeight:600 }}>🔄 Rotation</span>
            <span style={{ fontSize:14,color:C.accent,fontWeight:700 }}>{rotation}°</span>
          </div>
          <input type="range" min={-180} max={180} value={rotation}
            onChange={function(e){ setRotation(parseInt(e.target.value)); }}
            style={{ width:"100%",accentColor:C.accent,height:6,borderRadius:6,outline:"none",border:"none",padding:0,cursor:"pointer" }} />
          <div style={{ display:"flex",justifyContent:"space-between",fontSize:12,color:C.muted,marginTop:4 }}>
            <span>-180°</span><span>+180°</span>
          </div>
        </div>

        <div style={{ display:"flex",gap:10 }}>
          <button className="btnG" onClick={function(){ setScale(100); setPosX(50); setPosY(50); setRotation(0); }} style={{ flex:1 }}>
            Reset All
          </button>
          <button className="btnP" style={{ flex:2,padding:"12px" }} onClick={save}>Save Photo</button>
        </div>
      </div>
    </div>
  );
}

function PhotoUpload({ current, onPhoto, size, shape, placeholder, label }) {
  var C = useTheme();
  var sz = size || 72;
  var radius = shape === "circle" ? "50%" : "14px";
  var [uid] = useState(function(){ return "pup-"+Math.random().toString(36).slice(2,8); });
  var [pending, setPending] = useState(null);
  var [showActions, setShowActions] = useState(false);

  function handleFile(e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("Image must be under 5MB."); return; }
    var reader = new FileReader();
    reader.onload = function(ev) { setPending(ev.target.result); };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function handleRemove() {
    if (window.confirm("Are you sure you want to remove this photo? This action cannot be undone.")) {
      onPhoto("");
      setShowActions(false);
    }
  }

  return (
    <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:16 }}>
      <div style={{ position:"relative",display:"inline-block",flexShrink:0 }}>
        {/* Photo Display */}
        <div style={{ width:sz,height:sz,borderRadius:radius,background:C.bg,border:"2.5px solid "+C.border,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",fontSize:sz*0.38,transition:"border-color .2s" }}
          onMouseEnter={function(e){ if(current) e.currentTarget.style.borderColor=C.accent; }}
          onMouseLeave={function(e){ e.currentTarget.style.borderColor=C.border; }}>
          {current
            ? <img src={current} alt="photo" style={{ width:"100%",height:"100%",objectFit:"cover" }} />
            : <span style={{ color:C.muted }}>{placeholder || "📷"}</span>}
        </div>
        
        {/* Upload Icon Overlay */}
        {!current && (
          <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.5)",borderRadius:radius,opacity:0,transition:"opacity .2s",cursor:"pointer" }}
            onMouseEnter={function(e){ e.currentTarget.style.opacity=1; }}
            onMouseLeave={function(e){ e.currentTarget.style.opacity=0; }}
            onClick={function(){ document.getElementById(uid).click(); }}>
            <span style={{ fontSize:sz*0.35,color:"white" }}>📷</span>
          </div>
        )}
        
        <input id={uid} type="file" accept="image/*" style={{ display:"none" }} onChange={handleFile} />
      </div>
      
      <div style={{ textAlign:"center" }}>
        <p style={{ color:C.text,fontWeight:700,fontSize:15,marginBottom:8 }}>{label || "Upload Photo"}</p>
        
        {!current ? (
          <button type="button" onClick={function(){ document.getElementById(uid).click(); }}
            className="btnP" style={{ fontSize:14,padding:"10px 20px" }}>
            📷 Choose Photo
          </button>
        ) : (
          <div style={{ display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap" }}>
            <button type="button" onClick={function(){ setPending(current); }}
              style={{ fontSize:13,fontWeight:600,color:C.accent,background:C.accentFaint,border:"1.5px solid "+C.accent,borderRadius:8,padding:"8px 16px",cursor:"pointer",transition:"all .2s" }}
              onMouseEnter={function(e){ e.currentTarget.style.background=C.accent; e.currentTarget.style.color="#fff"; }}
              onMouseLeave={function(e){ e.currentTarget.style.background=C.accentFaint; e.currentTarget.style.color=C.accent; }}>
              ✏️ Edit
            </button>
            <button type="button" onClick={function(){ document.getElementById(uid).click(); }}
              style={{ fontSize:13,fontWeight:600,color:C.blue,background:C.blueFaint,border:"1.5px solid "+C.blue,borderRadius:8,padding:"8px 16px",cursor:"pointer",transition:"all .2s" }}
              onMouseEnter={function(e){ e.currentTarget.style.background=C.blue; e.currentTarget.style.color="#fff"; }}
              onMouseLeave={function(e){ e.currentTarget.style.background=C.blueFaint; e.currentTarget.style.color=C.blue; }}>
              🔄 Replace
            </button>
            <button type="button" onClick={handleRemove}
              style={{ fontSize:13,fontWeight:600,color:C.red,background:C.redFaint,border:"1.5px solid "+C.red,borderRadius:8,padding:"8px 16px",cursor:"pointer",transition:"all .2s" }}
              onMouseEnter={function(e){ e.currentTarget.style.background=C.red; e.currentTarget.style.color="#fff"; }}
              onMouseLeave={function(e){ e.currentTarget.style.background=C.redFaint; e.currentTarget.style.color=C.red; }}>
              🗑️ Remove
            </button>
          </div>
        )}
      </div>
      
      {pending && (
        <PhotoEditorModal photo={pending} shape={shape}
          onSave={function(url){ onPhoto(url); setPending(null); }}
          onClose={function(){ setPending(null); }} />
      )}
    </div>
  );
}

// custom date picker bc the native one looked bad
function EnhancedDatePicker({ value, onChange, label, hint, hintStyle }) {
  var C = useTheme();
  var [searchInput, setSearchInput] = useState("");
  var [dateFormat, setDateFormat] = useState(localStorage.getItem("dateFormat") || "MDY");
  var [showFormatPicker, setShowFormatPicker] = useState(false);
  var pickerRef = useRef(null);
  
  useEffect(function() {
    if (!showFormatPicker) return;
    function handleClickOutside(e) {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowFormatPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return function() {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFormatPicker]);
  
  function formatDisplayDate(dateStr) {
    if (!dateStr) return "";
    var parts = dateStr.split("-");
    var year = parseInt(parts[0]);
    var month = parseInt(parts[1]);
    var day = parseInt(parts[2]);
    
    var mm = String(month).padStart(2, "0");
    var dd = String(day).padStart(2, "0");
    var yyyy = String(year);
    
    if (dateFormat === "MDY") {
      return mm + "/" + dd + "/" + yyyy;
    } else if (dateFormat === "DMY") {
      return dd + "/" + mm + "/" + yyyy;
    } else {
      return yyyy + "-" + mm + "-" + dd;
    }
  }
  
  function changeDateFormat(newFormat) {
    setDateFormat(newFormat);
    localStorage.setItem("dateFormat", newFormat);
  }

  function parseManualDate(input) {
    if (!input) return null;
    var cleaned = input.replace(/[^\d\/-]/g, '');
    var parts;
    var year, month, day;
    
    if (cleaned.match(/^\d{4}[-\/]\d{1,2}[-\/]\d{1,2}$/)) {
      parts = cleaned.split(/[-\/]/);
      year = parseInt(parts[0]);
      month = parseInt(parts[1]);
      day = parseInt(parts[2]);
    }
    else if (cleaned.match(/^\d{1,2}[-\/]\d{1,2}[-\/]\d{4}$/)) {
      parts = cleaned.split(/[-\/]/);
      if (dateFormat === "DMY") {
        day = parseInt(parts[0]);
        month = parseInt(parts[1]);
      } else {
        month = parseInt(parts[0]);
        day = parseInt(parts[1]);
      }
      year = parseInt(parts[2]);
    }
    else if (cleaned.match(/^\d{8}$/)) {
      var firstTwo = cleaned.substring(0,2);
      if (firstTwo === "19" || firstTwo === "20") {
        year = parseInt(cleaned.substring(0,4));
        month = parseInt(cleaned.substring(4,6));
        day = parseInt(cleaned.substring(6,8));
      } else {
        var first = parseInt(cleaned.substring(0,2));
        var second = parseInt(cleaned.substring(2,4));
        year = parseInt(cleaned.substring(4,8));
        if (dateFormat === "DMY") {
          day = first;
          month = second;
        } else {
          month = first;
          day = second;
        }
      }
    }
    else {
      return null;
    }
    
    if (!year || !month || !day) return null;
    if (year < 1900 || year > 2100) return null;
    if (month < 1 || month > 12) return null;
    if (day < 1 || day > 31) return null;
    
    var testDate = new Date(year, month - 1, day);
    if (testDate.getMonth() !== month - 1 || testDate.getDate() !== day) return null;
    
    return year + "-" + String(month).padStart(2, "0") + "-" + String(day).padStart(2, "0");
  }

  return (
    <FF label={label} hint={hint} hintStyle={hintStyle}>
      <div style={{ position:"relative" }} ref={pickerRef}>
        <div style={{ position:"relative",display:"flex",alignItems:"center",gap:8 }}>
          <input 
            type="text" 
            value={searchInput || formatDisplayDate(value)} 
            onChange={function(e){ setSearchInput(e.target.value); }}
            onKeyDown={function(e){
              if (e.key === "Escape") {
                setSearchInput("");
              }
            }}
            onBlur={function(e){
              setTimeout(function(){
                if (searchInput) {
                  var parsedDate = parseManualDate(searchInput);
                  if (parsedDate) {
                    onChange({ target: { value: parsedDate } });
                  }
                  setSearchInput("");
                }
              }, 150);
            }}
            placeholder={"Type date (" + (dateFormat === "MDY" ? "MM/DD/YYYY" : dateFormat === "DMY" ? "DD/MM/YYYY" : "YYYY-MM-DD") + ")..."}
            style={{ flex:1,paddingRight:"36px" }}
          />
          <button
            type="button"
            onClick={function(){ setShowFormatPicker(!showFormatPicker); }}
            style={{ background:C.accentFaint,border:"1.5px solid "+C.accent,color:C.accent,borderRadius:8,padding:"8px 12px",fontSize:12,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap" }}
            title="Change format">
            Format
          </button>
          {value && (
            <button 
              type="button"
              onClick={function(e){ 
                e.stopPropagation();
                onChange({ target: { value: "" } });
              }}
              style={{ position:"absolute",right:80,background:"none",border:"none",color:C.muted,fontSize:18,cursor:"pointer",padding:4,display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1 }}
              title="Clear date">
              ✕
            </button>
          )}
        </div>
        
        {showFormatPicker && (
          <div style={{ position:"absolute",top:"100%",left:0,marginTop:8,background:C.card,border:"1.5px solid "+C.border,borderRadius:12,padding:16,zIndex:1000,boxShadow:"0 8px 24px rgba(0,0,0,0.15)",minWidth:320 }}>
            <p style={{ fontSize:12,color:C.muted,fontWeight:600,marginBottom:8 }}>Select Date Format:</p>
            <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
              <button type="button" onClick={function(){ changeDateFormat("MDY"); setShowFormatPicker(false); }}
                style={{ padding:"10px 12px",fontSize:13,fontWeight:600,background:dateFormat==="MDY"?C.accent:C.bg,color:dateFormat==="MDY"?"#fff":C.text,border:"1.5px solid "+(dateFormat==="MDY"?C.accent:C.border),borderRadius:8,cursor:"pointer",transition:"all .15s",textAlign:"left" }}>
                <strong>Month/Day/Year</strong> <span style={{ opacity:0.7 }}>(03/15/2020)</span>
              </button>
              <button type="button" onClick={function(){ changeDateFormat("DMY"); setShowFormatPicker(false); }}
                style={{ padding:"10px 12px",fontSize:13,fontWeight:600,background:dateFormat==="DMY"?C.accent:C.bg,color:dateFormat==="DMY"?"#fff":C.text,border:"1.5px solid "+(dateFormat==="DMY"?C.accent:C.border),borderRadius:8,cursor:"pointer",transition:"all .15s",textAlign:"left" }}>
                <strong>Day/Month/Year</strong> <span style={{ opacity:0.7 }}>(15/03/2020)</span>
              </button>
              <button type="button" onClick={function(){ changeDateFormat("YMD"); setShowFormatPicker(false); }}
                style={{ padding:"10px 12px",fontSize:13,fontWeight:600,background:dateFormat==="YMD"?C.accent:C.bg,color:dateFormat==="YMD"?"#fff":C.text,border:"1.5px solid "+(dateFormat==="YMD"?C.accent:C.border),borderRadius:8,cursor:"pointer",transition:"all .15s",textAlign:"left" }}>
                <strong>Year-Month-Day</strong> <span style={{ opacity:0.7 }}>(2020-03-15)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </FF>
  );
}

// the little dog animation on the welcome screen
function SittingDog({ color }) {
  var col = color || "#f4a24d";
  var dark = "#b8651a";
  var nose = "#2d1a0e";
  return (
    <div style={{ position:"relative", width:110, height:150, flexShrink:0 }}>
      {/* Tail */}
      <div style={{ position:"absolute", right:6, top:72, width:8, height:40, background:col, borderRadius:"4px 4px 8px 8px", transformOrigin:"top center" }}>
        <div style={{ position:"absolute", bottom:0, left:-3, width:14, height:14, background:col, borderRadius:"50%" }} />
      </div>
      {/* Haunches / back body */}
      <div style={{ position:"absolute", left:14, top:80, width:60, height:50, background:col, borderRadius:"14px 10px 18px 18px" }} />
      {/* Body */}
      <div style={{ position:"absolute", left:18, top:44, width:54, height:46, background:col, borderRadius:"18px 16px 10px 10px" }} />
      {/* Neck */}
      <div style={{ position:"absolute", left:36, top:28, width:20, height:24, background:col, borderRadius:"8px 8px 4px 4px" }} />
      {/* Head */}
      <div style={{ position:"absolute", left:24, top:4, width:46, height:38, background:col, borderRadius:"20px 20px 14px 14px" }} />
      {/* Left ear (floppy) */}
      <div style={{ position:"absolute", left:16, top:6, width:14, height:26, background:dark, borderRadius:"6px 2px 8px 8px", transform:"rotate(-12deg)", transformOrigin:"top center" }} />
      {/* Right ear (floppy) */}
      <div style={{ position:"absolute", left:62, top:6, width:14, height:26, background:dark, borderRadius:"2px 6px 8px 8px", transform:"rotate(12deg)", transformOrigin:"top center" }} />
      {/* Eye left */}
      <div style={{ position:"absolute", left:32, top:16, width:9, height:9, background:"#1a1410", borderRadius:"50%" }}>
        <div style={{ position:"absolute", top:2, left:2, width:3, height:3, background:"white", borderRadius:"50%" }} />
      </div>
      {/* Eye right */}
      <div style={{ position:"absolute", left:52, top:16, width:9, height:9, background:"#1a1410", borderRadius:"50%" }}>
        <div style={{ position:"absolute", top:2, left:2, width:3, height:3, background:"white", borderRadius:"50%" }} />
      </div>
      {/* Snout */}
      <div style={{ position:"absolute", left:34, top:26, width:26, height:16, background:dark, borderRadius:"8px 8px 10px 10px" }} />
      {/* Nose */}
      <div style={{ position:"absolute", left:39, top:26, width:16, height:10, background:nose, borderRadius:"50% 50% 40% 40%" }} />
      {/* Mouth */}
      <div style={{ position:"absolute", left:40, top:36, width:2, height:4, background:nose, borderRadius:2 }} />
      <div style={{ position:"absolute", left:35, top:38, width:8, height:3, borderBottom:"2.5px solid "+nose, borderRadius:"0 0 6px 6px" }} />
      <div style={{ position:"absolute", left:51, top:38, width:8, height:3, borderBottom:"2.5px solid "+nose, borderRadius:"0 0 6px 6px" }} />
      {/* Collar */}
      <div style={{ position:"absolute", left:32, top:40, width:30, height:7, background:"#60a5fa", borderRadius:4 }}>
        <div style={{ position:"absolute", top:4, left:"50%", transform:"translateX(-50%)", width:6, height:6, background:"#fbbf24", borderRadius:"50%", boxShadow:"0 1px 3px rgba(0,0,0,.3)" }} />
      </div>
      {/* Front paws */}
      <div style={{ position:"absolute", left:22, top:118, width:18, height:12, background:col, borderRadius:"6px 6px 10px 10px" }} />
      <div style={{ position:"absolute", left:46, top:118, width:18, height:12, background:col, borderRadius:"6px 6px 10px 10px" }} />
      {/* Paw toes */}
      {[24,29,34,48,53,58].map(function(x,i){ return <div key={i} style={{ position:"absolute", left:x, top:126, width:6, height:5, background:dark, borderRadius:"50%" }} />; })}
      {/* Shadow */}
      <div style={{ position:"absolute", bottom:-8, left:"50%", transform:"translateX(-50%)", width:70, height:10, background:"rgba(0,0,0,0.15)", borderRadius:"50%", filter:"blur(4px)" }} />
    </div>
  );
}


// google sign in
function GoogleAuthModal({ onClose, onLogin }) {
  var C = useTheme();
  var [step, setStep] = useState("pick"); // "pick" | "enter" | "loading"
  var [emailInput, setEmailInput] = useState("");
  var [err, setErr] = useState("");

  // Saved Google accounts (simulate previously signed-in accounts)
  var savedRaw = localStorage.getItem("pt_google_accounts");
  var [savedAccounts] = useState(function() {
    try { return JSON.parse(savedRaw) || []; } catch(e) { return []; }
  });

  function getAvatar(name) {
    var initials = (name || "?").split(" ").map(function(w){ return w[0]; }).join("").slice(0,2).toUpperCase();
    var colors = ["#4285F4","#EA4335","#34A853","#FBBC04","#9C27B0","#FF5722"];
    var idx = (name || "").charCodeAt(0) % colors.length;
    return { initials: initials, color: colors[idx] };
  }

  function signInWithGoogle(email, name) {
    setStep("loading");
    setTimeout(function() {
      var users = JSON.parse(localStorage.getItem("pt_users") || "{}");
      var existingUser = users[email];
      var user;
      if (existingUser) {
        user = existingUser;
      } else {
        // Create new account via Google
        user = {
          name: name || email.split("@")[0].replace(/[._]/g," ").replace(/\b\w/g, function(c){ return c.toUpperCase(); }),
          email: email,
          googleAuth: true,
          dogs: [],
          createdAt: new Date().toISOString()
        };
        users[email] = user;
        localStorage.setItem("pt_users", JSON.stringify(users));
      }
      // Save to google accounts list
      var gAccounts = JSON.parse(localStorage.getItem("pt_google_accounts") || "[]");
      if (!gAccounts.find(function(a){ return a.email === email; })) {
        gAccounts.unshift({ email: email, name: user.name });
        localStorage.setItem("pt_google_accounts", JSON.stringify(gAccounts.slice(0,5)));
      }
      onLogin(user);
    }, 1600);
  }

  function handleEmailContinue() {
    setErr("");
    var trimmed = emailInput.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setErr("Enter a valid email address."); return;
    }
    var users = JSON.parse(localStorage.getItem("pt_users") || "{}");
    var existing = users[trimmed];
    var displayName = existing ? existing.name : "";
    signInWithGoogle(trimmed, displayName);
  }

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:99998,display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}
      onClick={function(e){ if(e.target===e.currentTarget) onClose(); }}>
      <div className="fadeIn" style={{ background:"#fff",borderRadius:28,width:"100%",maxWidth:400,overflow:"hidden",boxShadow:"0 24px 80px rgba(0,0,0,0.4)" }}>
        {/* Google header */}
        <div style={{ padding:"32px 40px 20px",textAlign:"center" }}>
          {/* Google logo */}
          <svg style={{ width:75,height:24,marginBottom:20 }} viewBox="0 0 75 24">
            <text x="0" y="20" fontFamily="Product Sans,Arial,sans-serif" fontSize="22" fontWeight="400">
              <tspan fill="#4285F4">G</tspan><tspan fill="#EA4335">o</tspan><tspan fill="#FBBC04">o</tspan><tspan fill="#4285F4">g</tspan><tspan fill="#34A853">l</tspan><tspan fill="#EA4335">e</tspan>
            </text>
          </svg>

          {step === "loading" ? (
            <div style={{ textAlign:"center",padding:"20px 0 30px" }}>
              <div style={{ width:44,height:44,border:"4px solid #e8eaed",borderTopColor:"#4285F4",borderRadius:"50%",margin:"0 auto 18px",animation:"spin 0.8s linear infinite" }} />
              <p style={{ color:"#202124",fontSize:16,fontWeight:500 }}>Signing you in…</p>
            </div>
          ) : step === "enter" ? (
            <>
              <p style={{ color:"#202124",fontSize:24,fontWeight:400,marginBottom:8,letterSpacing:"-0.5px" }}>Sign in</p>
              <p style={{ color:"#5f6368",fontSize:14,marginBottom:22 }}>with your Google Account</p>
              <div style={{ position:"relative" }}>
                <input
                  type="email"
                  autoFocus
                  placeholder="Email or phone"
                  value={emailInput}
                  onChange={function(e){ setEmailInput(e.target.value); setErr(""); }}
                  onKeyDown={function(e){ if(e.key==="Enter") handleEmailContinue(); }}
                  style={{ width:"100%",border:"1px solid #dadce0",borderRadius:4,padding:"14px 16px",fontSize:15,color:"#202124",fontFamily:"inherit",outline:"none",background:"#fff",boxSizing:"border-box",transition:"border-color .15s" }}
                  onFocus={function(e){ e.target.style.borderColor="#1a73e8"; e.target.style.boxShadow="0 0 0 2px rgba(26,115,232,0.2)"; }}
                  onBlur={function(e){ e.target.style.borderColor="#dadce0"; e.target.style.boxShadow="none"; }}
                />
                {err && <p style={{ color:"#d93025",fontSize:12,textAlign:"left",marginTop:6 }}>{err}</p>}
              </div>
              <p style={{ color:"#1a73e8",fontSize:13,textAlign:"left",marginTop:14,cursor:"pointer",fontWeight:500 }}>Forgot email?</p>
            </>
          ) : (
            <>
              <p style={{ color:"#202124",fontSize:24,fontWeight:400,marginBottom:8,letterSpacing:"-0.5px" }}>Sign in</p>
              <p style={{ color:"#5f6368",fontSize:14,marginBottom:22 }}>Continue to PawTraxx</p>
            </>
          )}
        </div>

        {step === "pick" && (
          <div style={{ padding:"0 0 16px" }}>
            {savedAccounts.length > 0 && (
              <>
                {savedAccounts.map(function(acct, i) {
                  var av = getAvatar(acct.name);
                  return (
                    <div key={i} onClick={function(){ signInWithGoogle(acct.email, acct.name); }}
                      style={{ display:"flex",alignItems:"center",gap:16,padding:"14px 40px",cursor:"pointer",transition:"background .15s" }}
                      onMouseEnter={function(e){ e.currentTarget.style.background="#f1f3f4"; }}
                      onMouseLeave={function(e){ e.currentTarget.style.background="transparent"; }}>
                      <div style={{ width:40,height:40,borderRadius:"50%",background:av.color,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:15,flexShrink:0 }}>{av.initials}</div>
                      <div style={{ textAlign:"left" }}>
                        <p style={{ color:"#202124",fontSize:15,fontWeight:500,margin:0 }}>{acct.name}</p>
                        <p style={{ color:"#5f6368",fontSize:13,margin:0 }}>{acct.email}</p>
                      </div>
                    </div>
                  );
                })}
                <div style={{ height:1,background:"#e8eaed",margin:"8px 0" }} />
              </>
            )}

            {/* Use another account */}
            <div onClick={function(){ setStep("enter"); }}
              style={{ display:"flex",alignItems:"center",gap:16,padding:"14px 40px",cursor:"pointer",transition:"background .15s" }}
              onMouseEnter={function(e){ e.currentTarget.style.background="#f1f3f4"; }}
              onMouseLeave={function(e){ e.currentTarget.style.background="transparent"; }}>
              <div style={{ width:40,height:40,borderRadius:"50%",background:"#e8eaed",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#5f6368"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
              </div>
              <p style={{ color:"#202124",fontSize:15,margin:0 }}>Use another account</p>
            </div>
          </div>
        )}

        {/* Footer */}
        {step !== "loading" && (
          <div style={{ padding:"16px 40px 28px",display:"flex",justifyContent: step==="pick" ? "space-between" : "flex-end",alignItems:"center",borderTop:"1px solid #e8eaed" }}>
            {step === "pick" && (
              <p style={{ color:"#5f6368",fontSize:12 }}>
                To continue, Google will share your name and email with PawTraxx.
              </p>
            )}
            <div style={{ display:"flex",gap:8,flexShrink:0 }}>
              <button onClick={onClose} style={{ padding:"10px 22px",borderRadius:4,border:"none",background:"transparent",color:"#1a73e8",fontSize:14,fontWeight:600,cursor:"pointer",transition:"background .15s" }}
                onMouseEnter={function(e){ e.currentTarget.style.background="#e8f0fe"; }}
                onMouseLeave={function(e){ e.currentTarget.style.background="transparent"; }}>
                Cancel
              </button>
              {step === "enter" && (
                <button onClick={handleEmailContinue} style={{ padding:"10px 22px",borderRadius:4,border:"none",background:"#1a73e8",color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",transition:"background .15s" }}
                  onMouseEnter={function(e){ e.currentTarget.style.background="#1765cc"; }}
                  onMouseLeave={function(e){ e.currentTarget.style.background="#1a73e8"; }}>
                  Next
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Auth({ onLogin }) {
  var C = useTheme();
  var [mode, setMode] = useState("login"); // "login" | "register" | "forgot" | "otp" | "reset"
  var [form, setForm] = useState({ name:"", email:"", password:"", phone:"" });
  var [err, setErr] = useState("");
  var [msg, setMsg] = useState("");
  var [otpInput, setOtpInput] = useState("");
  var [generatedOtp, setGeneratedOtp] = useState("");
  var [resetEmail, setResetEmail] = useState("");
  var [resetPhone, setResetPhone] = useState("");
  var [newPassword, setNewPassword] = useState("");
  var [newPassword2, setNewPassword2] = useState("");

  function upd(k,v){ setForm(function(p){ return Object.assign({},p,{[k]:v}); }); }

  function go() {
    setErr("");
    if (!form.email || !form.password) { setErr("Please fill all fields."); return; }
    
    var users = JSON.parse(localStorage.getItem("pt_users") || "{}");
    // console.log("users", users)
    if (mode === "register") {
      if (!form.name) { setErr("Enter your name."); return; }
      if (!form.phone) { setErr("Phone number is required for account recovery."); return; }
      
      // Check if phone number is already in use
      var normalize = function(p){ return p.replace(/\D/g,""); };
      var normalizedPhone = normalize(form.phone);
      var phoneInUse = Object.values(users).find(function(u){ 
        return u.phone && normalize(u.phone) === normalizedPhone; 
      });
      if (phoneInUse) {
        setErr("This phone number is already connected to another account. If you want to use this number, you must delete your current account and create a new one.");
        return;
      }
      
      // Password validation
      if (form.password.length < 8) { 
        setErr("Password must be at least 8 characters long."); 
        return; 
      }
      if (!/[A-Z]/.test(form.password)) { 
        setErr("Password must contain at least one uppercase letter."); 
        return; 
      }
      if (!/[a-z]/.test(form.password)) { 
        setErr("Password must contain at least one lowercase letter."); 
        return; 
      }
      if (!/[0-9]/.test(form.password)) { 
        setErr("Password must contain at least one number."); 
        return; 
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.password)) { 
        setErr("Password must contain at least one special character (!@#$%^&* etc)."); 
        return; 
      }
      
      if (users[form.email]) { setErr("Email already registered."); return; }
      var otp = String(Math.floor(100000 + Math.random() * 900000));
      setGeneratedOtp(otp);
      setResetEmail(form.email);
      setMsg("A 6-digit code has been generated. In a real app it would be sent to " + form.phone + ". For demo, your code is: " + otp);
      setMode("otp_register");
    } else {
      var found = users[form.email];
      if (!found || found.password !== form.password) { setErr("Invalid email or password."); return; }
      if (found.banned) { setErr("This account has been suspended. Please contact support."); return; }
      onLogin(found);
    }
  }

  function confirmRegisterOtp() {
    setErr("");
    if (otpInput !== generatedOtp) { setErr("Incorrect code. Try again."); return; }
    var users = JSON.parse(localStorage.getItem("pt_users") || "{}");
    var u = { name:form.name, email:form.email, password:form.password, phone:form.phone, dogs:[], createdAt:new Date().toISOString() };
    users[form.email] = u;
    localStorage.setItem("pt_users", JSON.stringify(users));
    sendSimulatedEmail(
      form.email,
      "Welcome to PawTraxx! 🐾",
      "Hi "+form.name+",\n\nYour PawTraxx account has been created successfully.\n\nEmail: "+form.email+"\nJoined: "+new Date().toLocaleDateString()+"\n\nStart adding your dogs and tracking their care today!\n\n— The PawTraxx Team"
    );
    onLogin(u);
  }

  function startForgot() {
    setErr(""); setMsg(""); setResetEmail(""); setResetPhone("");
    setMode("forgot");
  }

  var [showGoogleModal, setShowGoogleModal] = useState(false);
  var [resetMethod, setResetMethod] = useState("phone"); // "phone" | "email"

  function sendForgotOtp() {
    setErr("");
    var users = JSON.parse(localStorage.getItem("pt_users") || "{}");
    var found = null;
    if (resetMethod === "phone") {
      if (!resetPhone) { setErr("Enter your phone number."); return; }
      var normalize = function(p){ return p.replace(/\D/g,""); };
      found = Object.values(users).find(function(u){ return u.phone && normalize(u.phone) === normalize(resetPhone); }) || null;
      if (!found) { setErr("No account found with that phone number."); return; }
      // store email for doReset to use
      setResetEmail(found.email);
    } else {
      if (!resetEmail) { setErr("Enter your account email."); return; }
      found = users[resetEmail];
      if (!found) { setErr("No account found with that email."); return; }
    }
    var otp = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(otp);
    if (resetMethod === "phone") {
      sendSimulatedSMS(
        found.phone,
        "Hi " + found.name + ",\n\nYour PawTraxx password reset code is:\n\n    " + otp + "\n\nThis code expires in 10 minutes. If you did not request this, ignore this message.\n\n\u2014 The PawTraxx Team"
      );
      setMsg("A 6-digit code has been sent to " + found.phone + ". (Demo code: " + otp + ")");
    } else {
      sendSimulatedEmail(
        resetEmail,
        "PawTraxx Password Reset Code \uD83D\uDD11",
        "Hi "+found.name+",\n\nYour password reset code is:\n\n    " + otp + "\n\nThis code expires in 10 minutes. If you did not request this, ignore this email.\n\n\u2014 The PawTraxx Team"
      );
      setMsg("A reset code has been sent to " + resetEmail + ". (Demo code: " + otp + ")");
    }
    setMode("otp_reset");
  }

  function confirmResetOtp() {
    setErr("");
    if (otpInput !== generatedOtp) { setErr("Incorrect code. Try again."); return; }
    setMode("reset");
  }

  function doReset() {
    setErr("");
    if (!newPassword) { setErr("Enter a new password."); return; }
    if (newPassword !== newPassword2) { setErr("Passwords don't match."); return; }
    if (newPassword.length < 6) { setErr("Password must be at least 6 characters."); return; }
    var users = JSON.parse(localStorage.getItem("pt_users") || "{}");
    users[resetEmail] = Object.assign({}, users[resetEmail], { password: newPassword });
    localStorage.setItem("pt_users", JSON.stringify(users));
    setMsg("Password updated! You can now sign in.");
    setMode("login");
    setForm(Object.assign({}, form, { email: resetEmail, password: "" }));
  }

  return (
    <div style={{ minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20,background:"#0c0b14", position:"relative",overflow:"hidden" }}>
      {/* Scattered paw prints — muted purple like the reference */}
      {[
        { top:"1%",  left:"6%",  size:28, rot:25,  op:0.18 },
        { top:"6%",  left:"2%",  size:22, rot:-40, op:0.14 },
        { top:"2%",  left:"22%", size:30, rot:15,  op:0.16 },
        { top:"1%",  left:"42%", size:24, rot:-20, op:0.13 },
        { top:"3%",  left:"62%", size:32, rot:35,  op:0.17 },
        { top:"1%",  left:"80%", size:26, rot:-10, op:0.15 },
        { top:"12%", left:"93%", size:28, rot:20,  op:0.16 },
        { top:"24%", left:"91%", size:34, rot:-35, op:0.14 },
        { top:"36%", left:"94%", size:26, rot:45,  op:0.17 },
        { top:"48%", left:"91%", size:30, rot:-15, op:0.15 },
        { top:"60%", left:"93%", size:28, rot:30,  op:0.16 },
        { top:"72%", left:"90%", size:32, rot:-45, op:0.14 },
        { top:"84%", left:"92%", size:24, rot:10,  op:0.17 },
        { top:"94%", left:"78%", size:30, rot:-25, op:0.15 },
        { top:"96%", left:"60%", size:26, rot:40,  op:0.16 },
        { top:"94%", left:"42%", size:32, rot:-10, op:0.14 },
        { top:"96%", left:"24%", size:28, rot:20,  op:0.17 },
        { top:"93%", left:"8%",  size:24, rot:-35, op:0.15 },
        { top:"18%", left:"2%",  size:30, rot:50,  op:0.16 },
        { top:"30%", left:"4%",  size:26, rot:-20, op:0.14 },
        { top:"42%", left:"2%",  size:32, rot:35,  op:0.17 },
        { top:"54%", left:"4%",  size:24, rot:-50, op:0.15 },
        { top:"66%", left:"2%",  size:30, rot:15,  op:0.16 },
        { top:"78%", left:"4%",  size:28, rot:-30, op:0.14 },
        { top:"20%", left:"15%", size:26, rot:12,  op:0.13 },
        { top:"38%", left:"18%", size:22, rot:-28, op:0.15 },
        { top:"55%", left:"12%", size:30, rot:42,  op:0.13 },
        { top:"70%", left:"20%", size:24, rot:-18, op:0.16 },
        { top:"25%", left:"75%", size:28, rot:33,  op:0.14 },
        { top:"45%", left:"80%", size:22, rot:-22, op:0.16 },
        { top:"65%", left:"76%", size:30, rot:55,  op:0.13 },
        { top:"80%", left:"70%", size:26, rot:-38, op:0.15 },
      ].map(function(p, i) {
        return (
          <div key={i} style={{ position:"absolute", top:p.top, left:p.left, fontSize:p.size, opacity:p.op, transform:"rotate("+p.rot+"deg)", pointerEvents:"none", userSelect:"none", filter:"grayscale(1) brightness(0.5) sepia(1) hue-rotate(220deg)", color:"#9b8ec4" }}>🐾</div>
        );
      })}
      <div className="fadeIn" style={{ width:"100%",maxWidth:420 }}>
        <div style={{ marginBottom:36,marginTop:48,display:"flex",justifyContent:"center" }}>
          <div style={{ display:"flex",alignItems:"center",gap:12 }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 70" width="60" height="60" style={{ flexShrink:0 }}>
              <defs>
                <linearGradient id="pawGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor:"#D2691E",stopOpacity:1 }} />
                  <stop offset="100%" style={{ stopColor:"#8B4513",stopOpacity:1 }} />
                </linearGradient>
                <filter id="drop">
                  <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.15"/>
                </filter>
              </defs>
              <g transform="translate(35, 35)">
                <circle cx="0" cy="0" r="28" fill="url(#pawGrad)" filter="url(#drop)"/>
                <ellipse cx="-18" cy="-14" rx="10" ry="16" fill="url(#pawGrad)" transform="rotate(-30 -18 -14)" filter="url(#drop)"/>
                <ellipse cx="18" cy="-14" rx="10" ry="16" fill="url(#pawGrad)" transform="rotate(30 18 -14)" filter="url(#drop)"/>
                <ellipse cx="0" cy="6" rx="18" ry="14" fill="#F4E4C1" opacity="0.6"/>
                <circle cx="-10" cy="-4" r="4" fill="#1F2937"/>
                <circle cx="-8" cy="-6" r="1.6" fill="#FFFFFF" opacity="0.8"/>
                <circle cx="10" cy="-4" r="4" fill="#1F2937"/>
                <circle cx="12" cy="-6" r="1.6" fill="#FFFFFF" opacity="0.8"/>
                <ellipse cx="0" cy="8" rx="5" ry="4" fill="#1F2937"/>
                <path d="M 0,10 Q -6,14 -10,13" stroke="#1F2937" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <path d="M 0,10 Q 6,14 10,13" stroke="#1F2937" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <ellipse cx="0" cy="16" rx="3" ry="5" fill="#FF6B9D" opacity="0.8"/>
              </g>
            </svg>
            <div style={{ textAlign:"left" }}>
              <h1 style={{ fontFamily:"Fraunces",fontSize:42,fontWeight:800,color:C.accent,letterSpacing:"-1.5px",lineHeight:1,margin:0 }}>PawTraxx</h1>
              <p style={{ color:C.muted,fontSize:15,marginTop:8,fontWeight:600,letterSpacing:"2px",margin:"8px 0 0 0" }}>TRACK · CARE · CONNECT</p>
            </div>
          </div>
        </div>

        <div style={{ background:C.card,border:"1.5px solid "+C.border,borderRadius:20,padding:28 }}>

          {/* ── Login / Register tabs ── */}
          {(mode === "login" || mode === "register") && (
            <div>
              <div style={{ display:"flex",gap:6,marginBottom:22,background:C.bg,borderRadius:12,padding:4 }}>
                {["login","register"].map(function(m) {
                  return (
                    <button key={m} onClick={function(){ setMode(m); setErr(""); setMsg(""); }} style={{ flex:1,padding:"9px",borderRadius:9,border:"none",background:mode===m?C.card:"transparent",color:mode===m?C.text:C.muted,fontWeight:mode===m?600:400,fontSize:13,transition:"all .2s" }}>
                      {m === "login" ? "Sign In" : "Create Account"}
                    </button>
                  );
                })}
              </div>
              {mode === "register" && (
                <FF label="Your Name"><input placeholder="Jane Smith" value={form.name} onChange={function(e){upd("name",e.target.value);}} onKeyDown={function(e){if(e.key==="Enter")go();}} /></FF>
              )}
              <FF label="Email"><input type="email" placeholder="you@email.com" value={form.email} onChange={function(e){upd("email",e.target.value);}} onKeyDown={function(e){if(e.key==="Enter")go();}} /></FF>
              <FF label="Password" hint={mode==="register"?"Must be 8+ characters with uppercase, lowercase, number, and special character":""}>
                <input type="password" placeholder="••••••••" value={form.password} onChange={function(e){upd("password",e.target.value);}} onKeyDown={function(e){if(e.key==="Enter")go();}} />
              </FF>
              {mode === "register" && (
                <FF label="Phone Number" hint="Used for account recovery — required">
                  <input type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={function(e){upd("phone",e.target.value);}} onKeyDown={function(e){if(e.key==="Enter")go();}} />
                </FF>
              )}
              {msg && <p style={{ color:C.green,fontSize:13,marginBottom:12,lineHeight:1.5 }}>{msg}</p>}
              {err && <p style={{ color:C.red,fontSize:13,marginBottom:12 }}>{err}</p>}
              <button className="btnP" onClick={go} style={{ width:"100%",padding:13,fontSize:15,marginBottom:12 }}>
                {mode === "login" ? "Sign In" : "Create Account"}
              </button>

              {/* ── Divider ── */}
              <div style={{ display:"flex",alignItems:"center",gap:12,margin:"4px 0 12px" }}>
                <div style={{ flex:1,height:1,background:C.border }} />
                <span style={{ color:C.muted,fontSize:12,fontWeight:600,letterSpacing:".06em" }}>OR</span>
                <div style={{ flex:1,height:1,background:C.border }} />
              </div>

              {/* ── Google button ── */}
              <button onClick={function(){ setShowGoogleModal(true); }}
                style={{ width:"100%",padding:"11px 16px",borderRadius:10,border:"1.5px solid "+C.border,background:C.bg,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10,fontSize:14,fontWeight:600,color:C.text,transition:"all .18s",marginBottom:12 }}
                onMouseEnter={function(e){ e.currentTarget.style.borderColor=C.accent; e.currentTarget.style.background=C.cardHov; }}
                onMouseLeave={function(e){ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.background=C.bg; }}>
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                Continue with Google
              </button>

              {showGoogleModal && (
                <GoogleAuthModal onClose={function(){ setShowGoogleModal(false); }} onLogin={onLogin} />
              )}
              {mode === "login" && (
                <p style={{ textAlign:"center",fontSize:13 }}>
                  <button onClick={startForgot} style={{ background:"none",border:"none",color:C.accent,cursor:"pointer",fontSize:13,fontWeight:600,textDecoration:"underline" }}>Forgot password?</button>
                </p>
              )}
            </div>
          )}

          {/* ── OTP verify for registration ── */}
          {mode === "otp_register" && (
            <div>
              <button onClick={function(){ setMode("register"); setErr(""); }} style={{ background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:13,marginBottom:16,display:"flex",alignItems:"center",gap:4 }}>&#8592; Back</button>
              <p style={{ fontFamily:"Fraunces",fontSize:18,color:C.text,fontWeight:700,marginBottom:6 }}>Verify Your Phone</p>
              <p style={{ color:C.muted,fontSize:13,marginBottom:16,lineHeight:1.6 }}>{msg}</p>
              <FF label="Enter 6-digit code">
                <input placeholder="123456" value={otpInput} onChange={function(e){ setOtpInput(e.target.value.replace(/\D/g,"").slice(0,6)); }} onKeyDown={function(e){if(e.key==="Enter")confirmRegisterOtp();}} style={{ letterSpacing:"0.3em",fontSize:22,textAlign:"center",fontWeight:700 }} maxLength={6} />
              </FF>
              {err && <p style={{ color:C.red,fontSize:13,marginBottom:12 }}>{err}</p>}
              <button className="btnP" onClick={confirmRegisterOtp} style={{ width:"100%",padding:13,fontSize:15 }}>Verify &amp; Create Account</button>
            </div>
          )}

          {/* ── Forgot password: enter email + phone ── */}
          {mode === "forgot" && (
            <div>
              <button onClick={function(){ setMode("login"); setErr(""); }} style={{ background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:13,marginBottom:16,display:"flex",alignItems:"center",gap:4 }}>&#8592; Back to Sign In</button>
              <p style={{ fontFamily:"Fraunces",fontSize:18,color:C.text,fontWeight:700,marginBottom:6 }}>Reset Password</p>
              <p style={{ color:C.muted,fontSize:13,marginBottom:14 }}>Verify your identity to reset your password.</p>
              <div style={{ display:"flex",gap:6,marginBottom:16,background:C.bg,borderRadius:10,padding:4 }}>
                {[{val:"phone",label:"📱 Via Phone"},{val:"email",label:"📧 Via Email"}].map(function(opt) {
                  return (
                    <button key={opt.val} onClick={function(){ setResetMethod(opt.val); setErr(""); }}
                      style={{ flex:1,padding:"8px",borderRadius:7,border:"none",background:resetMethod===opt.val?C.card:"transparent",color:resetMethod===opt.val?C.text:C.muted,fontWeight:resetMethod===opt.val?600:400,fontSize:13,cursor:"pointer",transition:"all .2s" }}>
                      {opt.label}
                    </button>
                  );
                })}
              </div>
              {resetMethod === "phone" && (
                <FF label="Phone Number" hint="Must match your registered number">
                  <input type="tel" placeholder="+1 (555) 000-0000" value={resetPhone} onChange={function(e){ setResetPhone(e.target.value); }} onKeyDown={function(e){if(e.key==="Enter")sendForgotOtp();}} />
                </FF>
              )}
              {resetMethod === "email" && (
                <FF label="Your Account Email"><input type="email" placeholder="you@email.com" value={resetEmail} onChange={function(e){ setResetEmail(e.target.value); }} onKeyDown={function(e){if(e.key==="Enter")sendForgotOtp();}} /></FF>
              )}
              {resetMethod === "email" && (
                <p style={{ fontSize:12,color:C.muted,marginBottom:14,lineHeight:1.6,background:C.bg,borderRadius:8,padding:"10px 12px",border:"1px solid "+C.border }}>
                  A 6-digit verification code will be sent to your registered email address. Enter it on the next screen to reset your password.
                </p>
              )}
              {err && <p style={{ color:C.red,fontSize:13,marginBottom:12 }}>{err}</p>}
              <button className="btnP" onClick={sendForgotOtp} style={{ width:"100%",padding:13,fontSize:15 }}>Send Code</button>
            </div>
          )}

          {/* ── OTP verify for password reset ── */}
          {mode === "otp_reset" && (
            <div>
              <button onClick={function(){ setMode("forgot"); setErr(""); }} style={{ background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:13,marginBottom:16,display:"flex",alignItems:"center",gap:4 }}>&#8592; Back</button>
              <p style={{ fontFamily:"Fraunces",fontSize:18,color:C.text,fontWeight:700,marginBottom:6 }}>Enter Your Code</p>
              <p style={{ color:C.muted,fontSize:13,marginBottom:4,lineHeight:1.6 }}>{msg}</p>
              <p style={{ color:C.muted,fontSize:12,marginBottom:16,lineHeight:1.6,background:C.bg,borderRadius:8,padding:"10px 12px",border:"1px solid "+C.border }}>
                Enter the 6-digit code from your {resetMethod === "phone" ? "text message" : "email"} to continue. The code expires in 10 minutes.
              </p>
              <FF label="6-digit code">
                <input placeholder="123456" value={otpInput} onChange={function(e){ setOtpInput(e.target.value.replace(/\D/g,"").slice(0,6)); }} onKeyDown={function(e){if(e.key==="Enter")confirmResetOtp();}} style={{ letterSpacing:"0.3em",fontSize:22,textAlign:"center",fontWeight:700 }} maxLength={6} />
              </FF>
              {err && <p style={{ color:C.red,fontSize:13,marginBottom:12 }}>{err}</p>}
              <button className="btnP" onClick={confirmResetOtp} style={{ width:"100%",padding:13,fontSize:15 }}>Verify Code</button>
            </div>
          )}

          {/* ── New password entry ── */}
          {mode === "reset" && (
            <div>
              <p style={{ fontFamily:"Fraunces",fontSize:18,color:C.text,fontWeight:700,marginBottom:6 }}>Choose New Password</p>
              <p style={{ color:C.muted,fontSize:13,marginBottom:16 }}>Pick a strong password for your account.</p>
              <FF label="New Password"><input type="password" placeholder="••••••••" value={newPassword} onChange={function(e){ setNewPassword(e.target.value); }} onKeyDown={function(e){if(e.key==="Enter")doReset();}} /></FF>
              <FF label="Confirm Password"><input type="password" placeholder="••••••••" value={newPassword2} onChange={function(e){ setNewPassword2(e.target.value); }} onKeyDown={function(e){if(e.key==="Enter")doReset();}} /></FF>
              {err && <p style={{ color:C.red,fontSize:13,marginBottom:12 }}>{err}</p>}
              <button className="btnP" onClick={doReset} style={{ width:"100%",padding:13,fontSize:15 }}>Update Password</button>
            </div>
          )}


        </div>
        {msg && mode === "login" && <p style={{ textAlign:"center",color:C.green,fontSize:13,marginTop:14 }}>{msg}</p>}
        </div>{/* end card column */}
    </div>
  );
}

function DeleteProfileButton({ C, onDelete }) {
  var [confirm, setConfirm] = useState(false);
  if (!confirm) {
    return (
      <button onClick={function(){ setConfirm(true); }}
        style={{ background:C.redFaint,border:"1.5px solid "+C.red,color:C.red,borderRadius:10,padding:"10px 18px",fontSize:13,fontWeight:600,cursor:"pointer",width:"100%" }}>
        &#x1F5D1; Delete My Profile &amp; All Data
      </button>
    );
  }
  return (
    <div style={{ background:C.redFaint,border:"1.5px solid "+C.red,borderRadius:10,padding:14 }}>
      <p style={{ color:C.red,fontWeight:700,fontSize:13,marginBottom:6 }}>Are you absolutely sure?</p>
      <p style={{ color:C.text,fontSize:12,marginBottom:14,lineHeight:1.6 }}>This will permanently erase your profile, all dogs, and all records. This cannot be undone.</p>
      <div style={{ display:"flex",gap:8 }}>
        <button onClick={onDelete}
          style={{ flex:1,background:C.red,border:"none",color:"#fff",borderRadius:8,padding:"9px",fontSize:13,fontWeight:700,cursor:"pointer" }}>
          Yes, Delete Everything
        </button>
        <button onClick={function(){ setConfirm(false); }}
          style={{ flex:1,background:"transparent",border:"1.5px solid "+C.border,color:C.muted,borderRadius:8,padding:"9px",fontSize:13,cursor:"pointer" }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

// login / register screen
function DogForm({ initial, onSave, onClose }) {
  var C = useTheme();
  var init = initial || {};
  var [f, setF] = useState({
    name: init.name || "",
    breed: init.breed || "Mixed Breed",
    age: init.age || "",
    weight: init.weight || "",
    weightUnit: init.weightUnit || "lbs",
    gender: init.gender || "male",
    notes: init.notes || "",
    lastHeatDate: init.lastHeatDate || "",
    dob: init.dob || "",
    emoji: init.emoji || "🐕",
    photo: init.photo || "",
  });
  function upd(k, v) { setF(function(p){ var n=Object.assign({},p); n[k]=v; return n; }); }

  function handleSave() { if(!f.name){alert("Enter a name.");return;} onSave(Object.assign({},f,{id:init.id||String(Date.now())})); }

  return (
    <div onKeyDown={function(e){ if(e.key==="Enter" && e.target.tagName!=="TEXTAREA" && e.target.tagName!=="SELECT") handleSave(); }}>
      <div style={{ marginBottom:20 }}>
        <PhotoUpload
          current={f.photo}
          onPhoto={function(url){ upd("photo", url || ""); }}
          size={80}
          shape="circle"
          placeholder="🐶"
          label="Dog's Photo"
        />
      </div>
      <FF label="Dog's Name"><input placeholder="Buddy" value={f.name} onChange={function(e){upd("name",e.target.value);}} /></FF>
      <FF label="Emoji">
        <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
          {DOG_EMOJIS.map(function(e) {
            return (
              <button key={e} onClick={function(){upd("emoji",e);}} style={{ fontSize:22,background:f.emoji===e?C.accentFaint:"transparent",border:"1.5px solid "+(f.emoji===e?C.accent:C.border),borderRadius:8,padding:"7px 10px",cursor:"pointer",transition:"all .15s" }}>{e}</button>
            );
          })}
        </div>
      </FF>
      <EnhancedDatePicker 
        label="Date of Birth" 
        hint="Used To Calculate Exact Age" 
        hintStyle={{ fontSize:14,fontWeight:600,opacity:0.9 }}
        value={f.dob}
        onChange={function(e){
          upd("dob",e.target.value);
          // Auto-calculate age if date is set, clear age if date is cleared
          if(e.target.value) {
            var birthDate = new Date(e.target.value);
            var today = new Date();
            var ageYears = (today - birthDate) / (365.25 * 24 * 60 * 60 * 1000);
            upd("age", Math.max(0, ageYears).toFixed(1));
          } else {
            // Clear age when DOB is cleared
            upd("age", "");
          }
        }}
      />
      <div className="g2">
        <FF label="Breed">
          <select value={f.breed} onChange={function(e){upd("breed",e.target.value);}}>
            {BREEDS.map(function(b){ return <option key={b}>{b}</option>; })}
          </select>
        </FF>
        <FF label="Gender">
          <select value={f.gender} onChange={function(e){upd("gender",e.target.value);}}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </FF>
        <FF label="Age (years)" hint="Auto-calculated from DOB if provided"><input type="number" placeholder="" min="0" max="25" step="0.1" value={f.age} onChange={function(e){upd("age",e.target.value);}} /></FF>
        <FF label={"Weight ("+(f.weightUnit||"lbs")+")"}>
          <div style={{ display:"flex",gap:6 }}>
            <input type="number" placeholder="" min="1" max="300" value={f.weight} onChange={function(e){upd("weight",e.target.value);}} style={{ flex:1 }} />
            <select value={f.weightUnit||"lbs"} onChange={function(e){upd("weightUnit",e.target.value);}} style={{ width:70 }}>
              <option value="lbs">lbs</option>
              <option value="kg">kg</option>
            </select>
          </div>
        </FF>
      </div>
      {f.gender === "female" && (
        <EnhancedDatePicker
          label="Last Heat Cycle Start Date"
          hint="Leave blank if unknown or spayed"
          value={f.lastHeatDate}
          onChange={function(e){upd("lastHeatDate",e.target.value);}}
        />
      )}
      <FF label="Notes"><textarea placeholder="Allergies, medical conditions, personality..." value={f.notes} onChange={function(e){upd("notes",e.target.value);}} rows={3} /></FF>
      <div style={{ display:"flex",gap:10,marginTop:6 }}>
        <button className="btnP" onClick={handleSave}>
          {init.id ? "Save Changes" : "Add Dog"}
        </button>
        <button className="btnG" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

// vet visits tab
function VetTab({ dog, onUpdate, earnTP }) {
  var C = useTheme();
  var [show, setShow] = useState(false);
  var [f, setF] = useState({ date:"", reason:"", reasonPreset:"", vet:"", notes:"" });
  var [eid, setEid] = useState(null);
  var appts = dog.vetAppointments || [];
  var [confirmDialog, setConfirmDialog] = useState({ show: false, title: "", message: "", onConfirm: null });

  function reset() { setF({ date:"", reason:"", reasonPreset:"", vet:"", notes:"" }); setEid(null); }
  function save() {
    if (!f.date || !f.reason) { alert("Date and reason required."); return; }
    var entry = Object.assign({}, f, { id: eid || String(Date.now()) });
    var updated = eid ? appts.map(function(a){ return a.id===eid?entry:a; }) : appts.concat([entry]);
    updated.sort(function(a,b){ return parseLocalDate(a.date) - parseLocalDate(b.date); });
    onUpdate(Object.assign({}, dog, { vetAppointments: updated }));
    if (!eid && earnTP) earnTP(TP_VALUES.vet_add, "Scheduled vet appointment for "+dog.name);
    var apptDate = parseLocalDate(f.date); var today = new Date();
    if (eid && apptDate <= today && earnTP) earnTP(TP_VALUES.vet_complete, "Completed vet visit for "+dog.name);
    reset(); setShow(false);
  }
  function del(id) {
    setConfirmDialog({
      show: true,
      title: "Delete Appointment?",
      message: "Are you sure you want to delete this vet appointment?\n\nThis action cannot be undone.",
      onConfirm: function() {
        onUpdate(Object.assign({}, dog, { vetAppointments: appts.filter(function(a){ return a.id!==id; }) }));
        setConfirmDialog({ show: false, title: "", message: "", onConfirm: null });
      }
    });
  }
  function startEdit(a) { setF(Object.assign({},a)); setEid(a.id); setShow(true); }

  var upcoming = appts.filter(function(a){ return daysUntil(a.date)>=0; }).sort(function(a,b){ return parseLocalDate(a.date) - parseLocalDate(b.date); });
  var past = appts.filter(function(a){ return daysUntil(a.date)<0; }).sort(function(a,b){ return parseLocalDate(b.date) - parseLocalDate(a.date); });

  return (
    <div className="fadeIn">
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
        <p style={{ color:C.text,fontSize:16,fontWeight:600 }}>{appts.length} appointment{appts.length!==1?"s":""} total</p>
        <button className="btnP" style={{ fontSize:12,padding:"7px 14px" }} onClick={function(){ reset(); setShow(true); }}>+ Schedule</button>
      </div>
      {show && (
        <div style={{ background:C.bg,border:"1.5px solid "+C.accent,borderRadius:14,padding:18,marginBottom:18 }}
          onKeyDown={function(e){ if(e.key==="Enter" && e.target.tagName!=="TEXTAREA" && e.target.tagName!=="SELECT") save(); }}>
          <p style={{ fontFamily:"Fraunces",fontSize:16,color:C.accent,marginBottom:14 }}>{eid?"Edit":"New"} Appointment</p>
          <div className="g2">
            <EnhancedDatePicker label="Date" value={f.date} onChange={function(e){setF(Object.assign({},f,{date:e.target.value}));}} />
            <FF label="Vet / Clinic"><input placeholder="Dr. Smith" value={f.vet} onChange={function(e){setF(Object.assign({},f,{vet:e.target.value}));}} /></FF>
          </div>
          <FF label="Reason">
            <select value={f.reasonPreset||""} onChange={function(e){
              var val = e.target.value;
              if (!val || val.startsWith("──")) return;
              if (val === "Other (custom)") {
                setF(Object.assign({},f,{reasonPreset:val,reason:""}));
              } else {
                setF(Object.assign({},f,{reasonPreset:val,reason:val}));
              }
            }}>
              {COMMON_VET_REASONS.map(function(r,i){
                var isHeader = r.startsWith("──");
                return <option key={i} value={r} disabled={isHeader} style={{ color:isHeader?"#94a3b8":"inherit",fontWeight:isHeader?700:400 }}>{r || "Select reason..."}</option>;
              })}
            </select>
            <input placeholder="Or type custom reason..." value={f.reason} onChange={function(e){setF(Object.assign({},f,{reason:e.target.value,reasonPreset:""}));}} style={{ marginTop:6 }} />
          </FF>
          <FF label="Notes"><textarea placeholder="Concerns, follow-up needed..." value={f.notes} onChange={function(e){setF(Object.assign({},f,{notes:e.target.value}));}} rows={2} /></FF>
          <div style={{ display:"flex",gap:8 }}>
            <button className="btnP" style={{ fontSize:13 }} onClick={save}>{eid?"Save":"Add"}</button>
            <button className="btnG" style={{ fontSize:13 }} onClick={function(){ setShow(false); reset(); }}>Cancel</button>
          </div>
        </div>
      )}
      {appts.length === 0 && <EmptyState icon="🩺" title="No appointments yet" sub="Schedule a vet visit to track health history." action="+ Schedule" onAction={function(){ reset(); setShow(true); }} />}
      {upcoming.length > 0 && (
        <div style={{ marginBottom:20 }}>
          <p className="sectionLabel">Upcoming</p>
          {upcoming.map(function(a) {
            var d = daysUntil(a.date);
            return (
              <div key={a.id} style={{ background:C.bg,border:"1.5px solid "+(d<=7?C.accent:C.border),borderRadius:12,padding:14,marginBottom:8,display:"flex",alignItems:"flex-start",gap:12 }}>
                <div style={{ background:d<=7?C.accentFaint:C.blueFaint,borderRadius:10,padding:"8px 10px",textAlign:"center",minWidth:52,flexShrink:0 }}>
                  <div style={{ fontSize:10,color:d<=7?C.accent:C.blue,fontWeight:700 }}>{parseLocalDate(a.date).toLocaleDateString("en-US",{month:"short"}).toUpperCase()}</div>
                  <div style={{ fontSize:22,fontWeight:800,color:C.text,lineHeight:1.1 }}>{parseLocalDate(a.date).getDate()}</div>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap" }}>
                    <p style={{ fontWeight:600,fontSize:14,color:C.text }}>{a.reason}</p>
                    {d===0 && <Chip color="accent">Today!</Chip>}
                    {d===1 && <Chip color="yellow">Tomorrow</Chip>}
                    {d>1 && d<=7 && <Chip color="yellow">{"In "+d+" days"}</Chip>}
                  </div>
                  {a.vet && <p style={{ color:C.muted,fontSize:12 }}>{a.vet}</p>}
                  {a.notes && <p style={{ color:C.muted,fontSize:12,marginTop:3 }}>{a.notes}</p>}
                </div>
                <div style={{ display:"flex",gap:5,flexShrink:0 }}>
                  <button className="btnI" onClick={function(){ startEdit(a); }}>&#x270F;</button>
                  <button type="button" className="btnI" onClick={function(){ del(a.id); }}>&#x1F5D1;</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {past.length > 0 && (
        <div>
          <p className="sectionLabel" style={{ fontSize:15,fontWeight:800,marginBottom:12 }}>📋 Past Visits</p>
          {past.map(function(a) {
            return (
              <div key={a.id} style={{ background:C.card,border:"2px solid "+C.border,borderRadius:14,padding:"16px 18px",marginBottom:10,display:"flex",alignItems:"center",gap:14,boxShadow:"0 2px 8px rgba(0,0,0,0.08)" }}>
                <div style={{ background:C.accentFaint,border:"1.5px solid "+C.accent,borderRadius:10,padding:"10px 14px",minWidth:100,textAlign:"center",flexShrink:0 }}>
                  <p style={{ fontSize:16,fontWeight:800,color:C.accent }}>{fmtDate(a.date)}</p>
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:16,fontWeight:700,color:C.text,marginBottom:4 }}>{a.reason}</p>
                  {a.vet && <p style={{ fontSize:14,color:C.muted,fontWeight:500 }}>{"🩺 " + a.vet}</p>}
                  {a.notes && <p style={{ fontSize:13,color:C.muted,marginTop:6,fontStyle:"italic" }}>{a.notes}</p>}
                </div>
                <div style={{ display:"flex",gap:6,flexShrink:0 }}>
                  <button type="button" className="btnI" onClick={function(){ startEdit(a); }} style={{ padding:"8px 12px",fontSize:16 }}>&#x270F;</button>
                  <button type="button" className="btnI" onClick={function(){ del(a.id); }} style={{ padding:"8px 12px",fontSize:16 }}>&#x1F5D1;</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Confirm Dialog */}
      <ConfirmDialog
        show={confirmDialog.show}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={function(){ setConfirmDialog({ show: false, title: "", message: "", onConfirm: null }); }}
      />
    </div>
  );
}

// vaccines tab
function VaxTab({ dog, onUpdate, earnTP }) {
  var C = useTheme();
  var [show, setShow] = useState(false);
  var [f, setF] = useState({ name:"", customName:"", lastDate:"", nextDate:"", notes:"" });
  var [eid, setEid] = useState(null);
  var vax = dog.vaccines || [];
  var [confirmDialog, setConfirmDialog] = useState({ show: false, title: "", message: "", onConfirm: null });

  function reset() { setF({ name:"", customName:"", lastDate:"", nextDate:"", notes:"" }); setEid(null); }
  function save() {
    if (!f.name) { alert("Select a vaccine."); return; }
    var entry = Object.assign({}, f, { id: eid || String(Date.now()) });
    var updated = eid ? vax.map(function(v){ return v.id===eid?entry:v; }) : vax.concat([entry]);
    onUpdate(Object.assign({}, dog, { vaccines: updated }));
    if (!eid && earnTP) earnTP(TP_VALUES.vax_add, "Logged vaccine for "+dog.name);
    reset(); setShow(false);
  }
  function del(id) {
    var vaccine = vax.find(function(v){ return v.id === id; });
    var vaccineName = vaccine && vaccine.name === "Other" ? (vaccine.customName || "Custom vaccine") : (vaccine ? vaccine.name : "this vaccine");
    setConfirmDialog({
      show: true,
      title: "Delete Vaccine Record?",
      message: "Are you sure you want to delete the " + vaccineName + " record?\n\nThis action cannot be undone.",
      onConfirm: function() {
        onUpdate(Object.assign({}, dog, { vaccines: vax.filter(function(v){ return v.id!==id; }) }));
        setConfirmDialog({ show: false, title: "", message: "", onConfirm: null });
      }
    });
  }
  function startEdit(v) { setF(Object.assign({},v)); setEid(v.id); setShow(true); }

  var overdue = vax.filter(function(v){ return v.nextDate && isOverdue(v.nextDate); });
  var soon = vax.filter(function(v){ return v.nextDate && !isOverdue(v.nextDate) && isDueSoon(v.nextDate, 30); });
  var ok = vax.filter(function(v){ return !v.nextDate || (daysUntil(v.nextDate) > 30); });

  return (
    <div className="fadeIn">
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
        <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
          {overdue.length>0 && <Chip color="red">{"! "+overdue.length+" Overdue"}</Chip>}
          {soon.length>0 && <Chip color="yellow">{soon.length+" Due Soon"}</Chip>}
          {overdue.length===0 && soon.length===0 && vax.length>0 && <Chip color="green" extraStyle={{ fontSize:14,padding:"5px 14px" }}>&#x2713; All Current</Chip>}
        </div>
        <button className="btnP" style={{ fontSize:12,padding:"7px 14px" }} onClick={function(){ reset(); setShow(true); }}>+ Add Vaccine</button>
      </div>
      {show && (
        <div style={{ background:C.bg,border:"1.5px solid "+C.accent,borderRadius:14,padding:18,marginBottom:18 }}
          onKeyDown={function(e){ if(e.key==="Enter" && e.target.tagName!=="TEXTAREA" && e.target.tagName!=="SELECT") save(); }}>
          <p style={{ fontFamily:"Fraunces",fontSize:16,color:C.accent,marginBottom:14 }}>{eid?"Edit":"Add"} Vaccination Record</p>
          <FF label="Vaccine">
            <select value={f.name} onChange={function(e){setF(Object.assign({},f,{name:e.target.value}));}}>
              <option value="">Select vaccine...</option>
              {COMMON_VACCINES.map(function(v,i){
                var isHeader = v.startsWith("──");
                return <option key={i} value={v} disabled={isHeader} style={{ color:isHeader?"#94a3b8":"inherit",fontWeight:isHeader?700:400 }}>{v || "Select vaccine..."}</option>;
              })}
            </select>
          </FF>
          {f.name==="Other" && <FF label="Vaccine Name"><input placeholder="Vaccine name" value={f.customName} onChange={function(e){setF(Object.assign({},f,{customName:e.target.value}));}} /></FF>}
          <div className="g2">
            <EnhancedDatePicker label="Date Last Given" value={f.lastDate} onChange={function(e){setF(Object.assign({},f,{lastDate:e.target.value}));}} />
            <EnhancedDatePicker label="Next Due Date" value={f.nextDate} onChange={function(e){setF(Object.assign({},f,{nextDate:e.target.value}));}} />
          </div>
          <FF label="Notes"><textarea placeholder="Lot number, clinic, reactions..." value={f.notes} onChange={function(e){setF(Object.assign({},f,{notes:e.target.value}));}} rows={2} /></FF>
          <div style={{ display:"flex",gap:8 }}>
            <button className="btnP" style={{ fontSize:13 }} onClick={save}>{eid?"Save":"Add"}</button>
            <button className="btnG" style={{ fontSize:13 }} onClick={function(){ setShow(false); reset(); }}>Cancel</button>
          </div>
        </div>
      )}
      {vax.length === 0 && <EmptyState icon="💉" title="No vaccine records" sub="Track vaccinations to stay on schedule." action="+ Add Vaccine" onAction={function(){ reset(); setShow(true); }} />}
      {[
        { lbl:"Overdue", items:overdue, col:C.red },
        { lbl:"Due Soon", items:soon, col:C.yellow },
        { lbl:"Up to Date", items:ok, col:C.green },
      ].map(function(group) {
        if (group.items.length === 0) return null;
        return (
          <div key={group.lbl} style={{ marginBottom:18 }}>
            <p className="sectionLabel" style={{ color:group.col }}>{group.lbl}</p>
            {group.items.map(function(v) {
              var d = v.nextDate ? daysUntil(v.nextDate) : null;
              var label = v.name==="Other" ? (v.customName||"Custom") : v.name;
              var dColor = d===null ? C.green : d<0 ? C.red : d<=30 ? C.yellow : C.green;
              var dText = d===null ? "" : d<0 ? " ("+Math.abs(d)+"d overdue)" : " ("+d+"d)";
              return (
                <div key={v.id} style={{ background:C.bg,border:"1.5px solid "+(group.col===C.red?C.red:group.col===C.yellow?C.yellow:C.accent),borderRadius:12,padding:14,marginBottom:8,display:"flex",alignItems:"center",gap:12 }}>
                  <div style={{ fontSize:28,flexShrink:0 }}>💉</div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontWeight:700,fontSize:16,color:C.text,marginBottom:3 }}>{label}</p>
                    <div style={{ display:"flex",gap:12,flexWrap:"wrap" }}>
                      {v.lastDate && <p style={{ color:C.muted,fontSize:13 }}>{"Last: "+fmtDate(v.lastDate)}</p>}
                      {v.nextDate && <p style={{ color:dColor,fontSize:13,fontWeight:600 }}>{"Next: "+fmtDate(v.nextDate)+dText}</p>}
                    </div>
                    {v.notes && <p style={{ color:C.muted,fontSize:13,marginTop:3 }}>{v.notes}</p>}
                  </div>
                  <div style={{ display:"flex",gap:5,flexShrink:0 }}>
                    <button type="button" className="btnI" onClick={function(){ startEdit(v); }}>&#x270F;</button>
                    <button type="button" className="btnI" onClick={function(){ del(v.id); }}>&#x1F5D1;</button>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
      
      {/* Confirm Dialog */}
      <ConfirmDialog
        show={confirmDialog.show}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={function(){ setConfirmDialog({ show: false, title: "", message: "", onConfirm: null }); }}
      />
    </div>
  );
}

// medications tab
function MedsTab({ dog, onUpdate, earnTP, setCooldownAlert }) {
  var C = useTheme();
  var [show, setShow] = useState(false);
  var [f, setF] = useState({ name:"", medPreset:"", dose:"", dosePreset:"", frequency:"Once daily", startDate:"", endDate:"", prescribedBy:"", notes:"", active:true });
  var [eid, setEid] = useState(null);
  var [expandedLog, setExpandedLog] = useState({});
  var meds = dog.medications || [];
  var [confirmDialog, setConfirmDialog] = useState({ show: false, title: "", message: "", onConfirm: null });

  function reset() { setF({ name:"", medPreset:"", dose:"", dosePreset:"", frequency:"Once daily", startDate:"", endDate:"", prescribedBy:"", notes:"", active:true }); setEid(null); }
  function save() {
    if (!f.name) { alert("Medication name required."); return; }
    var entry = Object.assign({}, f, { id: eid || String(Date.now()) });
    var updated = eid ? meds.map(function(m){ return m.id===eid?entry:m; }) : meds.concat([entry]);
    onUpdate(Object.assign({}, dog, { medications: updated }));
    if (!eid && earnTP) earnTP(TP_VALUES.med_add, "Added medication for "+dog.name);
    reset(); setShow(false);
  }
  function del(id) {
    var medication = meds.find(function(m){ return m.id === id; });
    var medName = medication ? medication.name : "this medication";
    setConfirmDialog({
      show: true,
      title: "Delete Medication?",
      message: "Are you sure you want to delete " + medName + "?\n\nThis will also delete all dose history for this medication.\n\nThis action cannot be undone.",
      onConfirm: function() {
        onUpdate(Object.assign({}, dog, { medications: meds.filter(function(m){ return m.id!==id; }) }));
        setConfirmDialog({ show: false, title: "", message: "", onConfirm: null });
      }
    });
  }
  function startEdit(m) { setF(Object.assign({},m)); setEid(m.id); setShow(true); }
  function toggle(id) {
    onUpdate(Object.assign({}, dog, { medications: meds.map(function(m){ return m.id===id ? Object.assign({},m,{active:!m.active}) : m; }) }));
  }
  function markGiven(id, name) {
    // Find the medication to check last given time
    var medication = meds.find(function(m){ return m.id === id; });
    if (medication && medication.lastGiven) {
      var medCooldown = isOnCooldown(medication.lastGiven, COOLDOWNS.med_given);
      if (medCooldown) {
        var remaining = getCooldownRemaining(medication.lastGiven, COOLDOWNS.med_given);
        setCooldownAlert({
          show: true,
          message: "You recently marked " + name + " as given! To prevent accidental duplicate doses and ensure medication safety, please wait before marking again.",
          remaining: formatCooldown(remaining)
        });
        return;
      }
    }
    
    var ts = new Date().toISOString();
    var givenEntry = { id: String(Date.now()), timestamp: ts };
    onUpdate(Object.assign({}, dog, { medications: meds.map(function(m){
      if (m.id !== id) return m;
      var givenLog = (m.givenLog || []).concat([givenEntry]);
      if (earnTP) earnTP(TP_VALUES.med_given, "Gave medication to "+dog.name);
      return Object.assign({},m,{ lastGiven: ts, givenLog: givenLog });
    })}));
  }
  function deleteGivenEntry(medId, entryId) {
    var medication = meds.find(function(m){ return m.id === medId; });
    var entry = medication && medication.givenLog ? medication.givenLog.find(function(e){ return e.id === entryId; }) : null;
    var timestamp = entry ? fmtTimestamp(entry.timestamp) : "";
    setConfirmDialog({
      show: true,
      title: "Delete Dose Entry?",
      message: "Are you sure you want to delete this dose entry?\n\n" + (medication ? medication.name : "Medication") + "\n" + timestamp + "\n\nThis action cannot be undone.",
      onConfirm: function() {
        onUpdate(Object.assign({}, dog, { medications: meds.map(function(m){
          if (m.id !== medId) return m;
          return Object.assign({},m,{ givenLog: (m.givenLog||[]).filter(function(e){ return e.id!==entryId; }) });
        })}));
        setConfirmDialog({ show: false, title: "", message: "", onConfirm: null });
      }
    });
  }

  var active = meds.filter(function(m){ return m.active; });
  var inactive = meds.filter(function(m){ return !m.active; });

  return (
    <div className="fadeIn">
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
        <p style={{ color:C.text,fontSize:16,fontWeight:600 }}>{active.length} active medication{active.length!==1?"s":""}</p>
        <button className="btnP" style={{ fontSize:12,padding:"7px 14px" }} onClick={function(){ reset(); setShow(true); }}>+ Add Medication</button>
      </div>
      {show && (
        <div style={{ background:C.bg,border:"1.5px solid "+C.accent,borderRadius:14,padding:18,marginBottom:18 }}
          onKeyDown={function(e){ if(e.key==="Enter" && e.target.tagName!=="TEXTAREA" && e.target.tagName!=="SELECT") save(); }}>
          <p style={{ fontFamily:"Fraunces",fontSize:16,color:C.accent,marginBottom:14 }}>{eid?"Edit":"New"} Medication</p>
          <div className="g2">
            <FF label="Medication">
              <select value={f.medPreset||""} onChange={function(e){
                var val = e.target.value;
                if (!val || val.startsWith("──")) return;
                if (val === "Other (custom)") {
                  setF(Object.assign({},f,{medPreset:val,name:""}));
                } else {
                  setF(Object.assign({},f,{medPreset:val,name:val}));
                }
              }}>
                {COMMON_MEDICATIONS.map(function(m,i){
                  var isHeader = m.startsWith("──");
                  return <option key={i} value={m} disabled={isHeader} style={{ color:isHeader?"#94a3b8":"inherit",fontWeight:isHeader?700:400 }}>{m || "Select medication..."}</option>;
                })}
              </select>
            </FF>
            <FF label={f.medPreset==="Other (custom)"?"Custom Name":"Name / Brand"}>
              <input placeholder={f.medPreset && f.medPreset!=="Other (custom)" ? f.medPreset : "Type medication name..."} value={f.name} onChange={function(e){setF(Object.assign({},f,{name:e.target.value}));}} />
            </FF>
            <FF label="Dose">
              <select value={f.dosePreset||""} onChange={function(e){
                var val = e.target.value;
                if (!val || val.startsWith("──")) return;
                if (val === "As directed") {
                  setF(Object.assign({},f,{dosePreset:val,dose:"As directed"}));
                } else {
                  setF(Object.assign({},f,{dosePreset:val,dose:val}));
                }
              }}>
                {COMMON_DOSAGES.map(function(d,i){
                  var isHeader = d.startsWith("──");
                  return <option key={i} value={d} disabled={isHeader} style={{ color:isHeader?"#94a3b8":"inherit",fontWeight:isHeader?700:400 }}>{d || "Select dose..."}</option>;
                })}
              </select>
              <input placeholder="Or type custom dose..." value={f.dose} onChange={function(e){setF(Object.assign({},f,{dose:e.target.value,dosePreset:""}));}} style={{ marginTop:6 }} />
            </FF>
            <FF label="Frequency">
              <select value={f.frequency} onChange={function(e){setF(Object.assign({},f,{frequency:e.target.value}));}}>
                {MED_FREQUENCIES.map(function(x){ return <option key={x}>{x}</option>; })}
              </select>
            </FF>
            <FF label="Prescribed By"><input placeholder="Dr. Smith" value={f.prescribedBy} onChange={function(e){setF(Object.assign({},f,{prescribedBy:e.target.value}));}} /></FF>
            <EnhancedDatePicker label="Start Date" value={f.startDate} onChange={function(e){setF(Object.assign({},f,{startDate:e.target.value}));}} />
            <EnhancedDatePicker label="End Date (optional)" value={f.endDate} onChange={function(e){setF(Object.assign({},f,{endDate:e.target.value}));}} />
          </div>
          <FF label="Notes"><textarea placeholder="Instructions, side effects to watch for..." value={f.notes} onChange={function(e){setF(Object.assign({},f,{notes:e.target.value}));}} rows={2} /></FF>
          <div style={{ display:"flex",gap:8 }}>
            <button className="btnP" style={{ fontSize:13 }} onClick={save}>{eid?"Save":"Add"}</button>
            <button className="btnG" style={{ fontSize:13 }} onClick={function(){ setShow(false); reset(); }}>Cancel</button>
          </div>
        </div>
      )}
      {meds.length === 0 && <EmptyState icon="💊" title="No medications" sub="Track prescriptions, supplements, and preventatives." action="+ Add Medication" onAction={function(){ setShow(true); }} />}
      {active.length > 0 && (
        <div style={{ marginBottom:20 }}>
          <p className="sectionLabel">Active</p>
          {active.map(function(m) {
            var ending = m.endDate && isDueSoon(m.endDate, 7);
            var ended = m.endDate && isOverdue(m.endDate);
            var givenLog = (m.givenLog || []).slice().sort(function(a,b){ return new Date(b.timestamp)-new Date(a.timestamp); });
            var logOpen = !!expandedLog[m.id];
            return (
              <div key={m.id} style={{ background:C.card,border:"1.5px solid "+C.accent,borderRadius:14,padding:16,marginBottom:12 }}>
                <div style={{ display:"flex",alignItems:"flex-start",gap:12 }}>
                  <div style={{ fontSize:30,flexShrink:0 }}>💊</div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:6 }}>
                      <p style={{ fontWeight:700,fontSize:17,color:C.text }}>{m.name}</p>
                      {m.dose && <Chip color="accent">{m.dose}</Chip>}
                      {ending && !ended && <Chip color="yellow">Ends soon</Chip>}
                      {ended && <Chip color="red">Course ended</Chip>}
                    </div>
                    <p style={{ color:C.text,fontSize:15,fontWeight:500,marginBottom:3 }}>{m.frequency}{m.prescribedBy ? " \xB7 Rx: "+m.prescribedBy : ""}</p>
                    {(m.startDate||m.endDate) && <p style={{ color:C.muted,fontSize:14,marginBottom:3 }}>{(m.startDate?"Start: "+fmtDate(m.startDate):"")+(m.endDate?" \xB7 End: "+fmtDate(m.endDate):"")}</p>}
                    {m.notes && <p style={{ color:C.muted,fontSize:14,marginTop:4,lineHeight:1.5 }}>{m.notes}</p>}

                    <div style={{ display:"flex",alignItems:"center",gap:12,marginTop:10,flexWrap:"wrap" }}>
                      <button onClick={function(){ markGiven(m.id, m.name); }}
                        style={{ background:C.accentFaint,border:"1.5px solid "+C.accent,color:C.accent,borderRadius:9,padding:"8px 16px",fontSize:14,fontWeight:700,cursor:"pointer",transition:"all .18s" }}>
                        &#x2713; Mark Given
                      </button>
                      {m.lastGiven && (
                        <div>
                          <p style={{ color:C.text,fontSize:14,fontWeight:600 }}>{"Last given: "+timeAgo(m.lastGiven)}</p>
                          <p style={{ color:C.muted,fontSize:13,marginTop:1 }}>{fmtTimestamp(m.lastGiven)}</p>
                        </div>
                      )}
                    </div>

                    {givenLog.length > 0 && (
                      <div style={{ marginTop:12 }}>
                        <button onClick={function(){ setExpandedLog(function(prev){ var n=Object.assign({},prev); n[m.id]=!n[m.id]; return n; }); }}
                          style={{ background:"transparent",border:"1px solid "+C.border,color:C.muted,borderRadius:8,padding:"5px 12px",fontSize:13,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6 }}>
                          <span>{logOpen?"▲":"▼"}</span>
                          <span>{"Dose History ("+givenLog.length+")"}</span>
                        </button>
                        {logOpen && (
                          <div style={{ marginTop:8,background:C.bg,border:"1px solid "+C.border,borderRadius:10,overflow:"hidden" }}>
                            {givenLog.map(function(entry, idx) {
                              var isLast = idx === givenLog.length - 1;
                              return (
                                <div key={entry.id} style={{ display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderBottom:isLast?"none":"1px solid "+C.border }}>
                                  <div style={{ width:8,height:8,borderRadius:"50%",background:C.accent,flexShrink:0 }} />
                                  <div style={{ flex:1 }}>
                                    <p style={{ fontSize:14,fontWeight:600,color:C.text }}>{new Date(entry.timestamp).toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",hour12:true})}</p>
                                    <p style={{ fontSize:13,color:C.muted }}>{fmtTimestamp(entry.timestamp)}</p>
                                  </div>
                                  <button type="button" className="btnI" onClick={function(){ deleteGivenEntry(m.id, entry.id); }}>&#x1F5D1;</button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div style={{ display:"flex",flexDirection:"column",gap:5,flexShrink:0 }}>
                    <button type="button" className="btnI" onClick={function(){ startEdit(m); }}>&#x270F;</button>
                    <button type="button" className="btnI" onClick={function(){ toggle(m.id); }} title="Deactivate">&#x23F8;</button>
                    <button type="button" className="btnI" onClick={function(){ del(m.id); }}>&#x1F5D1;</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {inactive.length > 0 && (
        <div>
          <p className="sectionLabel">Inactive / Completed</p>
          {inactive.map(function(m) {
            return (
              <div key={m.id} style={{ background:C.bg,border:"1.5px solid "+C.border,borderRadius:10,padding:"11px 14px",marginBottom:6,display:"flex",alignItems:"center",gap:10,opacity:.6 }}>
                <span style={{ fontSize:20 }}>💊</span>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:14,color:C.text,fontWeight:600 }}>{m.name}{m.dose ? " — "+m.dose : ""}</p>
                  <p style={{ fontSize:13,color:C.muted }}>{m.frequency}</p>
                </div>
                <div style={{ display:"flex",gap:5 }}>
                  <button type="button" onClick={function(){ toggle(m.id); }} style={{ background:C.greenFaint,border:"1px solid "+C.green,color:C.green,borderRadius:7,padding:"5px 12px",fontSize:12,fontWeight:600,cursor:"pointer" }}>Reactivate</button>
                  <button type="button" className="btnI" onClick={function(){ del(m.id); }}>&#x1F5D1;</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Confirm Dialog */}
      <ConfirmDialog
        show={confirmDialog.show}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={function(){ setConfirmDialog({ show: false, title: "", message: "", onConfirm: null }); }}
      />
    </div>
  );
}

// weight tracking
function WeightChart({ chart, C }) {
  var [hover, setHover] = useState(null);
  var W = 500, H = 160, padL = 38, padR = 12, padT = 10, padB = 28;
  var vals = chart.map(function(d){ return d.weight; });
  var minV = Math.min.apply(null, vals);
  var maxV = Math.max.apply(null, vals);
  var range = maxV - minV || 1;
  var toX = function(i){ return padL + (i / (chart.length - 1)) * (W - padL - padR); };
  var toY = function(v){ return padT + (1 - (v - minV) / range) * (H - padT - padB); };
  var pts = chart.map(function(d, i){ return toX(i) + "," + toY(d.weight); }).join(" ");
  var fillPts = "M " + toX(0) + "," + toY(chart[0].weight) + " L " + chart.map(function(d,i){ return toX(i)+","+toY(d.weight); }).join(" L ") + " L " + toX(chart.length-1) + "," + (H-padB) + " L " + toX(0) + "," + (H-padB) + " Z";
  var yTicks = [minV, (minV+maxV)/2, maxV].map(function(v){ return Math.round(v*10)/10; });
  return (
    <div style={{ position:"relative",width:"100%" }}>
      <svg viewBox={"0 0 "+W+" "+H} width="100%" style={{ display:"block", overflow:"visible" }}>
        {yTicks.map(function(v,i){
          var y = toY(v);
          return <line key={i} x1={padL} y1={y} x2={W-padR} y2={y} stroke={C.border} strokeWidth={1} strokeDasharray="3 3" />;
        })}
        {yTicks.map(function(v,i){
          return <text key={i} x={padL-6} y={toY(v)+4} textAnchor="end" fontSize={10} fill={C.muted}>{v}</text>;
        })}
        {chart.map(function(d,i){
          if (chart.length > 6 && i % Math.ceil(chart.length/6) !== 0 && i !== chart.length-1) return null;
          return <text key={i} x={toX(i)} y={H-6} textAnchor="middle" fontSize={10} fill={C.muted}>{d.date}</text>;
        })}
        <path d={fillPts} fill={C.accent} opacity={0.12} />
        <polyline points={pts} fill="none" stroke={C.accent} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
        {chart.map(function(d,i){
          var x = toX(i), y = toY(d.weight);
          return (
            <g key={i} onMouseEnter={function(){ setHover(i); }} onMouseLeave={function(){ setHover(null); }}>
              <circle cx={x} cy={y} r={hover===i?6:4} fill={C.accent} stroke={C.card} strokeWidth={2} style={{ transition:"r .1s" }} />
              <rect x={x-16} y={0} width={32} height={H-padB} fill="transparent" />
              {hover===i && (
                <g>
                  <line x1={x} y1={padT} x2={x} y2={H-padB} stroke={C.accent} strokeWidth={1} strokeDasharray="3 3" opacity={0.5} />
                  <rect x={x-30} y={y-26} width={60} height={20} rx={5} fill={C.card} stroke={C.accent} strokeWidth={1} />
                  <text x={x} y={y-12} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.accent}>{d.weight} lbs</text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function WeightTab({ dog, onUpdate, earnTP, setCooldownAlert }) {
  var C = useTheme();
  var [wt, setWt] = useState("");
  var [wd, setWd] = useState(new Date().toISOString().slice(0,10));
  var [wn, setWn] = useState("");
  var hist = (dog.weightHistory || []).slice().sort(function(a,b){ return parseLocalDate(a.date) - parseLocalDate(b.date); });

  function addW() {
    if (!wt) { alert("Enter weight."); return; }
    
    // Check for cooldown using separate timestamp (not deletable weight history)
    var cooldownTimestamps = dog.cooldownTimestamps || {};
    var lastWeightCooldown = cooldownTimestamps.weight;
    var weightCooldown = isOnCooldown(lastWeightCooldown, COOLDOWNS.weight);
    
    if (weightCooldown) {
      var remaining = getCooldownRemaining(lastWeightCooldown, COOLDOWNS.weight);
      setCooldownAlert({
        show: true,
        message: "Weight was recently logged for " + dog.name + "! To ensure accurate tracking and prevent duplicate entries, please wait before logging weight again.",
        remaining: formatCooldown(remaining)
      });
      return;
    }
    
    var ts = new Date().toISOString();
    var entry = { weight: parseFloat(wt), date: wd, note: wn, id: String(Date.now()) };
    
    // Update both weight history AND cooldown timestamp
    var updatedCooldowns = Object.assign({}, cooldownTimestamps, { weight: ts });
    onUpdate(Object.assign({}, dog, { weightHistory: (dog.weightHistory||[]).concat([entry]), weight: wt, cooldownTimestamps: updatedCooldowns }));
    if (earnTP) earnTP(TP_VALUES.weight, "Logged weight for "+dog.name);
    setWt(""); setWn("");
  }
  function del(id) {
    onUpdate(Object.assign({}, dog, { weightHistory: (dog.weightHistory||[]).filter(function(w){ return w.id!==id; }) }));
  }

  var chart = hist.map(function(h){ return { date: parseLocalDate(h.date).toLocaleDateString("en-US",{month:"short",day:"numeric"}), weight: h.weight }; });
  var latest = hist[hist.length-1];
  var prev = hist[hist.length-2];
  var chgNum = (latest && prev) ? (latest.weight - prev.weight) : null;
  var chgStr = chgNum !== null ? (chgNum > 0 ? "+" : "") + chgNum.toFixed(1) + " lbs" : "—";
  var chgCol = chgNum === null ? C.muted : chgNum > 0 ? C.red : chgNum < 0 ? C.green : C.muted;

  return (
    <div className="fadeIn">
      {hist.length >= 2 && (
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:18 }}>
          {[
            { lbl:"Current Weight", val: latest.weight+" lbs", col: C.accent },
            { lbl:"Previous", val: prev ? prev.weight+" lbs" : "—", col: C.muted },
            { lbl:"Change", val: chgStr, col: chgCol },
          ].map(function(s) {
            return (
              <div key={s.lbl} style={{ background:C.card,border:"1px solid "+C.accent,borderRadius:14,padding:16 }}>
                <p style={{ fontSize:14,color:C.text,fontWeight:700,marginBottom:8,textTransform:"uppercase",letterSpacing:".05em" }}>{s.lbl}</p>
                <p style={{ fontSize:24,fontWeight:800,color:s.col }}>{s.val}</p>
              </div>
            );
          })}
        </div>
      )}
      {hist.length >= 2 && (
        <div style={{ background:C.card,borderRadius:14,padding:16,marginBottom:18,border:"1px solid "+C.accent }}>
          <p className="sectionLabel">Weight Trend</p>
          <WeightChart chart={chart} C={C} />
        </div>
      )}

      <div style={{ background:C.card,border:"1px solid "+C.accent,borderRadius:14,padding:20,marginBottom:18 }}
        onKeyDown={function(e){ if(e.key==="Enter") addW(); }}>
        <p className="sectionLabel">Log Weight Entry</p>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14 }}>
          <div>
            <label style={{ display:"block",fontSize:12,color:C.muted,marginBottom:6,fontWeight:600 }}>Weight (lbs)</label>
            <input type="number" placeholder="" value={wt} onChange={function(e){setWt(e.target.value);}} min="1" max="300" step="0.1"
              style={{ fontSize:22,fontWeight:700,padding:"14px 16px",textAlign:"center",color:C.accent,appearance:"textfield",MozAppearance:"textfield",WebkitAppearance:"none" }} />
          </div>
          <div>
            <EnhancedDatePicker label="Date" value={wd} onChange={function(e){setWd(e.target.value);}} />
          </div>
        </div>
        <div style={{ marginBottom:14 }}>
          <label style={{ display:"block",fontSize:12,color:C.muted,marginBottom:6,fontWeight:600 }}>Note (optional)</label>
          <input placeholder="e.g. After vet visit, post-diet check..." value={wn} onChange={function(e){setWn(e.target.value);}} style={{ fontSize:14,padding:"12px 16px" }} />
        </div>
        <button className="btnP" style={{ width:"100%",padding:"13px",fontSize:15,fontWeight:700 }} onClick={addW}>+ Log Weight Entry</button>
      </div>

      {hist.length === 0 && <EmptyState icon="⚖️" title="No weight records yet" sub="Log your dog's weight to track trends over time." />}
      {hist.length > 0 && (
        <div>
          <p className="sectionLabel">History</p>
          {hist.slice().reverse().map(function(h) {
            return (
              <div key={h.id} style={{ background:C.card,border:"1px solid "+C.accent,borderRadius:10,padding:"13px 16px",marginBottom:8,display:"flex",alignItems:"center",gap:14 }}>
                <span style={{ color:C.accent,fontWeight:800,fontSize:20,minWidth:80 }}>{h.weight+" lbs"}</span>
                <span style={{ color:C.text,fontSize:15,fontWeight:500,flex:1 }}>{fmtDate(h.date)}{h.note ? " · "+h.note : ""}</span>
                <button type="button" className="btnI" onClick={function(){ del(h.id); }}>&#x1F5D1;</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// documents / file uploads
function DocumentsTab({ dog, onUpdate, onBack }) {
  var C = useTheme();
  var docs = dog.documents || [];
  var [uploading, setUploading] = useState(false);
  var [previewDoc, setPreviewDoc] = useState(null);
  var [zoomLevel, setZoomLevel] = useState(100);
  var [searchQuery, setSearchQuery] = useState("");
  var [sortBy, setSortBy] = useState("date"); // "date" | "name" | "type" | "size"
  var [alertDialog, setAlertDialog] = useState({ show: false, title: "", message: "" });
  var [confirmDialog, setConfirmDialog] = useState({ show: false, title: "", message: "", onConfirm: null });

  function handleFileUpload(e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    
    console.log("File selected:", file.name, "Length:", file.name.length);
    
    // Check total filename length FIRST
    if (file.name.length > 30) {
      console.error("FILE NAME TOO LONG - Length:", file.name.length);
      
      setAlertDialog({
        show: true,
        title: "File Name Too Long!",
        message: "Your file name: " + file.name + "\n\nLength: " + file.name.length + " characters\nMaximum allowed: 30 characters\n\nPlease rename your file and try again."
      });
      
      e.target.value = "";
      return;
    }
    
    console.log("Filename length OK");
    
    if (file.size > 5 * 1024 * 1024) { 
      setAlertDialog({
        show: true,
        title: "File Too Large!",
        message: "File size: " + (file.size / (1024 * 1024)).toFixed(1) + " MB\n\nMaximum per file: 5 MB\n\nPlease choose a smaller file."
      });
      e.target.value = ""; 
      return; 
    }
    
    // Check storage limit (50MB per dog)
    var MAX_STORAGE = 50 * 1024 * 1024;
    var usedStorage = docs.reduce(function(total, doc) { return total + (doc.size || 0); }, 0);
    var remainingStorage = MAX_STORAGE - usedStorage;
    
    if (file.size > remainingStorage) {
      var usedMB = (usedStorage / (1024 * 1024)).toFixed(1);
      var remainingMB = (remainingStorage / (1024 * 1024)).toFixed(1);
      var fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
      
      setAlertDialog({
        show: true,
        title: "Not Enough Storage!",
        message: "This file is " + fileSizeMB + " MB but you only have " + remainingMB + " MB remaining.\n\nYou've used " + usedMB + " MB of your 50 MB limit for " + dog.name + ".\n\nPlease delete some files or choose a smaller file."
      });
      e.target.value = "";
      return;
    }
    
    console.log("Starting file upload...");
    setUploading(true);
    var reader = new FileReader();
    reader.onload = function(ev) {
      var newDoc = {
        id: String(Date.now()),
        name: file.name,
        type: file.type,
        data: ev.target.result,
        uploadedAt: new Date().toISOString(),
        size: file.size
      };
      onUpdate(Object.assign({}, dog, { documents: docs.concat([newDoc]) }));
      setUploading(false);
      console.log("File uploaded successfully");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function deleteDoc(id) {
    var doc = docs.find(function(d){ return d.id === id; });
    setConfirmDialog({
      show: true,
      title: "Delete Document?",
      message: "Are you sure you want to delete '" + (doc ? doc.name : "this document") + "'?\n\nThis action cannot be undone.",
      onConfirm: function() {
        onUpdate(Object.assign({}, dog, { documents: docs.filter(function(d){ return d.id !== id; }) }));
        setConfirmDialog({ show: false, title: "", message: "", onConfirm: null });
      }
    });
  }

  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  function getFileIcon(type, name) {
    if (type.includes("pdf")) return "📄";
    if (type.includes("image")) return "🖼️";
    if (type.includes("word") || type.includes("document") || name.endsWith(".doc") || name.endsWith(".docx")) return "📝";
    if (type.includes("excel") || type.includes("sheet") || name.endsWith(".xls") || name.endsWith(".xlsx")) return "📊";
    if (type.includes("text") || name.endsWith(".txt")) return "📃";
    return "📎";
  }
  
  function getFileCategory(type, name) {
    if (type.includes("pdf")) return "PDF";
    if (type.includes("image")) return "Image";
    if (type.includes("word") || type.includes("document") || name.endsWith(".doc") || name.endsWith(".docx")) return "Document";
    if (type.includes("excel") || type.includes("sheet") || name.endsWith(".xls") || name.endsWith(".xlsx")) return "Spreadsheet";
    if (type.includes("text") || name.endsWith(".txt")) return "Text";
    return "Other";
  }

  // Filter and sort documents
  var filteredDocs = docs.filter(function(doc) {
    if (!searchQuery) return true;
    var query = searchQuery.toLowerCase();
    return doc.name.toLowerCase().includes(query) || 
           getFileCategory(doc.type, doc.name).toLowerCase().includes(query);
  });

  var sortedDocs = filteredDocs.sort(function(a, b) {
    if (sortBy === "date") return new Date(b.uploadedAt) - new Date(a.uploadedAt);
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "type") return getFileCategory(a.type, a.name).localeCompare(getFileCategory(b.type, b.name));
    if (sortBy === "size") return b.size - a.size;
    return 0;
  });

  // Calculate storage usage
  var MAX_STORAGE = 50 * 1024 * 1024; // 50MB total per dog
  var usedStorage = docs.reduce(function(total, doc) { return total + (doc.size || 0); }, 0);
  var remainingStorage = MAX_STORAGE - usedStorage;
  var usedMB = (usedStorage / (1024 * 1024)).toFixed(1);
  var remainingMB = (remainingStorage / (1024 * 1024)).toFixed(1);
  var usedPercent = Math.min(100, (usedStorage / MAX_STORAGE) * 100);

  return (
    <div className="fadeIn">
      {/* Back Button */}
      <button onClick={onBack}
        style={{ background:"none",border:"none",color:C.muted,fontSize:14,fontWeight:600,marginBottom:16,cursor:"pointer",display:"flex",alignItems:"center",gap:6,padding:"8px 0",transition:"color .2s" }}
        onMouseEnter={function(e){ e.currentTarget.style.color=C.accent; }}
        onMouseLeave={function(e){ e.currentTarget.style.color=C.muted; }}>
        <span style={{ fontSize:16 }}>←</span> Back to Overview
      </button>
      
      {/* Upload Section */}
      <div style={{ background:C.card,border:"1.5px solid "+C.border,borderRadius:16,padding:24,marginBottom:20 }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16 }}>
          <div>
            <h3 style={{ fontFamily:"Fraunces",fontSize:20,color:C.text,fontWeight:800,marginBottom:4 }}>📁 Upload Documents</h3>
            <p style={{ color:C.text,fontSize:15,fontWeight:500,opacity:0.85 }}>
              Vet records, vaccination certificates, insurance, and more
            </p>
          </div>
          <div style={{ fontSize:36 }}>🐕</div>
        </div>
        
        <div style={{ display:"flex",gap:12,alignItems:"center",flexWrap:"wrap",marginBottom:16 }}>
          <label style={{ display:"inline-flex",alignItems:"center",gap:10,background:C.accent,color:"#fff",padding:"14px 28px",borderRadius:12,fontSize:15,fontWeight:700,cursor:"pointer",transition:"all .2s",border:"2px solid "+C.accent }}
            onMouseEnter={function(e){ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 8px 24px "+C.accentGlow; }}
            onMouseLeave={function(e){ e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}>
            <span style={{ fontSize:20 }}>📤</span>
            {uploading ? "Uploading..." : "Choose File"}
            <input type="file" accept="*/*" onChange={handleFileUpload} disabled={uploading} style={{ display:"none" }} />
          </label>
          <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
            <div style={{ background:C.accentFaint,border:"1px solid "+C.accent,borderRadius:8,padding:"8px 12px" }}>
              <span style={{ fontSize:13,color:C.accent,fontWeight:600 }}>MAX PER FILE: 5MB</span>
            </div>
            <div style={{ background:C.blueFaint,border:"1px solid "+C.blue,borderRadius:8,padding:"8px 12px" }}>
              <span style={{ fontSize:13,color:C.blue,fontWeight:600 }}>{docs.length} {docs.length === 1 ? "File" : "Files"}</span>
            </div>
          </div>
        </div>

        {/* Storage Usage Bar */}
        <div style={{ background:C.bg,border:"1.5px solid "+C.border,borderRadius:12,padding:16 }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
            <p style={{ fontSize:14,fontWeight:700,color:C.text }}>Storage for {dog.name}</p>
            <p style={{ fontSize:14,fontWeight:800,color:usedPercent > 90 ? C.red : usedPercent > 70 ? C.yellow : C.accent }}>
              {usedMB} MB / 50 MB
            </p>
          </div>
          <div style={{ background:C.border,borderRadius:999,height:10,overflow:"hidden",marginBottom:8 }}>
            <div style={{ 
              background: usedPercent > 90 ? "linear-gradient(90deg, "+C.red+", #ff6b6b)" : usedPercent > 70 ? "linear-gradient(90deg, "+C.yellow+", #ffd93d)" : "linear-gradient(90deg, "+C.accent+", "+C.accentGlow+")",
              width: usedPercent + "%",
              height: "100%",
              borderRadius: 999,
              transition: "width 0.3s ease"
            }} />
          </div>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
            <p style={{ fontSize:13,color:C.muted,fontWeight:600 }}>
              {remainingMB} MB remaining
            </p>
            <p style={{ fontSize:13,color:C.muted,fontWeight:600 }}>
              {usedPercent.toFixed(0)}% used
            </p>
          </div>
        </div>
      </div>

      {docs.length === 0 ? (
        <div style={{ textAlign:"center",padding:"80px 20px",background:C.card,border:"1.5px solid "+C.border,borderRadius:16 }}>
          <div style={{ fontSize:64,marginBottom:16 }}>📂</div>
          <h3 style={{ fontFamily:"Fraunces",fontSize:24,fontWeight:700,color:C.text,marginBottom:8 }}>No Documents Yet</h3>
          <p style={{ color:C.muted,fontSize:16,marginBottom:24 }}>Upload your first document to get started</p>
          <label style={{ display:"inline-flex",alignItems:"center",gap:8,background:C.accent,color:"#fff",padding:"12px 24px",borderRadius:10,fontSize:14,fontWeight:700,cursor:"pointer" }}>
            📤 Upload Document
            <input type="file" accept="*/*" onChange={handleFileUpload} disabled={uploading} style={{ display:"none" }} />
          </label>
        </div>
      ) : (
        <div>
          {/* Search and Sort Bar */}
          <div style={{ background:C.card,border:"1.5px solid "+C.border,borderRadius:12,padding:16,marginBottom:16,display:"flex",gap:12,flexWrap:"wrap",alignItems:"center" }}>
            <div style={{ flex:1,minWidth:200,position:"relative" }}>
              <input 
                type="text"
                placeholder="🔍 Search documents..."
                value={searchQuery}
                onChange={function(e){ setSearchQuery(e.target.value); }}
                style={{ width:"100%",padding:"10px 14px",fontSize:14 }}
              />
              {searchQuery && (
                <button onClick={function(){ setSearchQuery(""); }}
                  style={{ position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:C.muted,fontSize:18,cursor:"pointer" }}>
                  ✕
                </button>
              )}
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:8 }}>
              <span style={{ fontSize:13,color:C.muted,fontWeight:600 }}>Sort:</span>
              <select value={sortBy} onChange={function(e){ setSortBy(e.target.value); }} style={{ padding:"8px 12px",fontSize:13,fontWeight:600 }}>
                <option value="date">📅 Date</option>
                <option value="name">🔤 Name</option>
                <option value="type">📋 Type</option>
                <option value="size">📊 Size</option>
              </select>
            </div>
          </div>

          {/* Document Grid */}
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))",gap:14 }}>
            {sortedDocs.map(function(doc) {
              var category = getFileCategory(doc.type, doc.name);
              return (
                <div key={doc.id} style={{ background:C.card,border:"1.5px solid "+C.border,borderRadius:12,padding:16,transition:"all .2s",cursor:"pointer" }}
                  onMouseEnter={function(e){ e.currentTarget.style.borderColor=C.accent; e.currentTarget.style.transform="translateY(-2px)"; }}
                  onMouseLeave={function(e){ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.transform="translateY(0)"; }}>
                  
                  <div style={{ display:"flex",alignItems:"flex-start",gap:12,marginBottom:12 }}>
                    <div style={{ fontSize:40,flexShrink:0 }}>{getFileIcon(doc.type, doc.name)}</div>
                    <div style={{ flex:1,minWidth:0 }}>
                      <p style={{ fontWeight:700,fontSize:14,color:C.text,marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{doc.name}</p>
                      <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginBottom:4 }}>
                        <span style={{ fontSize:11,color:C.accent,background:C.accentFaint,padding:"2px 8px",borderRadius:4,fontWeight:600 }}>{category}</span>
                        <span style={{ fontSize:11,color:C.blue,background:C.blueFaint,padding:"2px 8px",borderRadius:4,fontWeight:600 }}>{formatFileSize(doc.size)}</span>
                      </div>
                      <p style={{ fontSize:12,color:C.muted,fontWeight:500 }}>
                        {timeAgo(doc.uploadedAt)}
                      </p>
                    </div>
                  </div>

                  <div style={{ display:"flex",gap:6 }}>
                    <button onClick={function(){ setPreviewDoc(doc); setZoomLevel(100); }}
                      style={{ flex:1,background:C.blueFaint,border:"1.5px solid "+C.blue,color:C.blue,borderRadius:8,padding:"8px",fontSize:12,fontWeight:600,cursor:"pointer",transition:"all .15s" }}
                      onMouseEnter={function(e){ e.currentTarget.style.background=C.blue; e.currentTarget.style.color="#fff"; }}
                      onMouseLeave={function(e){ e.currentTarget.style.background=C.blueFaint; e.currentTarget.style.color=C.blue; }}>
                      👁️ Preview
                    </button>
                    <a href={doc.data} download={doc.name} style={{ flex:1,textDecoration:"none" }}>
                      <button style={{ width:"100%",background:C.accentFaint,border:"1.5px solid "+C.accent,color:C.accent,borderRadius:8,padding:"8px",fontSize:12,fontWeight:600,cursor:"pointer",transition:"all .15s" }}
                        onMouseEnter={function(e){ e.currentTarget.style.background=C.accent; e.currentTarget.style.color="#fff"; }}
                        onMouseLeave={function(e){ e.currentTarget.style.background=C.accentFaint; e.currentTarget.style.color=C.accent; }}>
                        📥 Download
                      </button>
                    </a>
                    <button type="button" onClick={function(){ deleteDoc(doc.id); }}
                      style={{ background:C.redFaint,border:"1.5px solid "+C.red,color:C.red,borderRadius:8,padding:"8px 10px",fontSize:12,fontWeight:600,cursor:"pointer",transition:"all .15s" }}
                      onMouseEnter={function(e){ e.currentTarget.style.background=C.red; e.currentTarget.style.color="#fff"; }}
                      onMouseLeave={function(e){ e.currentTarget.style.background=C.redFaint; e.currentTarget.style.color=C.red; }}>
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {searchQuery && sortedDocs.length === 0 && (
            <div style={{ textAlign:"center",padding:40,background:C.card,border:"1.5px solid "+C.border,borderRadius:12 }}>
              <div style={{ fontSize:48,marginBottom:12 }}>🔍</div>
              <p style={{ fontFamily:"Fraunces",fontSize:18,fontWeight:700,color:C.text,marginBottom:6 }}>No Results Found</p>
              <p style={{ color:C.muted,fontSize:14 }}>Try a different search term</p>
            </div>
          )}
        </div>
      )}
      
      {previewDoc && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.9)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}
          onClick={function(){ setPreviewDoc(null); setZoomLevel(100); }}>
          <div style={{ background:C.card,border:"1.5px solid "+C.border,borderRadius:16,padding:24,maxWidth:"90vw",maxHeight:"90vh",width:"100%",display:"flex",flexDirection:"column" }}
            onClick={function(e){ e.stopPropagation(); }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
              <div style={{ flex:1 }}>
                <h3 style={{ fontFamily:"Fraunces",fontSize:18,color:C.text,fontWeight:700 }}>{previewDoc.name}</h3>
              </div>
              {(previewDoc.type.includes("image") || previewDoc.type.includes("pdf")) && (
                <div style={{ display:"flex",alignItems:"center",gap:8,marginRight:16 }}>
                  <button type="button" onClick={function(){ setZoomLevel(Math.max(25, zoomLevel - 25)); }}
                    style={{ background:C.accentFaint,border:"1.5px solid "+C.accent,color:C.accent,borderRadius:8,padding:"6px 12px",fontSize:18,fontWeight:700,cursor:"pointer",lineHeight:1 }}>
                    −
                  </button>
                  <span style={{ color:C.text,fontSize:14,fontWeight:600,minWidth:60,textAlign:"center" }}>{zoomLevel}%</span>
                  <button type="button" onClick={function(){ setZoomLevel(Math.min(200, zoomLevel + 25)); }}
                    style={{ background:C.accentFaint,border:"1.5px solid "+C.accent,color:C.accent,borderRadius:8,padding:"6px 12px",fontSize:18,fontWeight:700,cursor:"pointer",lineHeight:1 }}>
                    +
                  </button>
                  <button type="button" onClick={function(){ setZoomLevel(100); }}
                    style={{ background:C.blueFaint,border:"1.5px solid "+C.blue,color:C.blue,borderRadius:8,padding:"6px 12px",fontSize:13,fontWeight:600,cursor:"pointer" }}>
                    Reset
                  </button>
                </div>
              )}
              <button className="btnI" onClick={function(){ setPreviewDoc(null); setZoomLevel(100); }}>✕</button>
            </div>
            <div style={{ flex:1,overflow:"auto",display:"flex",alignItems:"center",justifyContent:"center",minHeight:400 }}>
              {previewDoc.type.includes("image") ? (
                <img src={previewDoc.data} alt={previewDoc.name} style={{ maxWidth:"100%",maxHeight:"70vh",objectFit:"contain",transform:"scale("+(zoomLevel/100)+")",transition:"transform .2s" }} />
              ) : previewDoc.type.includes("pdf") ? (
                <div style={{ width:"100%",height:"100%",display:"flex",flexDirection:"column",transform:"scale("+(zoomLevel/100)+")",transformOrigin:"top center",transition:"transform .2s" }}>
                  <iframe src={previewDoc.data} style={{ width:"100%",height:"70vh",border:"none",borderRadius:8 }} title={previewDoc.name} />
                </div>
              ) : (
                <div style={{ textAlign:"center",padding:40,width:"100%" }}>
                  <div style={{ fontSize:64,marginBottom:16 }}>{getFileIcon(previewDoc.type)}</div>
                  <p style={{ fontFamily:"Fraunces",fontSize:22,fontWeight:700,color:C.text,marginBottom:8 }}>Preview Not Available</p>
                  <p style={{ color:C.text,fontSize:16,marginBottom:20,opacity:0.8 }}>
                    This file type cannot be previewed in the browser.
                  </p>
                  <p style={{ color:C.muted,fontSize:15,marginBottom:24 }}>
                    Download the file to view it on your device.
                  </p>
                  <a href={previewDoc.data} download={previewDoc.name} style={{ textDecoration:"none" }}>
                    <button className="btnP" style={{ fontSize:15,padding:"14px 28px" }}>📥 Download File</button>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Alert Dialog */}
      <AlertDialog 
        show={alertDialog.show}
        title={alertDialog.title}
        message={alertDialog.message}
        onClose={function(){ setAlertDialog({ show: false, title: "", message: "" }); }}
      />
      
      {/* Confirm Dialog */}
      <ConfirmDialog
        show={confirmDialog.show}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={function(){ setConfirmDialog({ show: false, title: "", message: "", onConfirm: null }); }}
      />
    </div>
  );
}

// heat cycle tracker
function HeatTab({ dog, onUpdate, earnTP }) {
  var C = useTheme();
  var [heatDate, setHeatDate] = useState(dog.lastHeatDate || "");
  var [heatTipPage, setHeatTipPage] = useState(0);
  var heat = getHeatStatus(dog);

  function saveDate() {
    if (!heatDate) { alert("Please select a date."); return; }
    var isNew = !dog.lastHeatDate;
    onUpdate(Object.assign({}, dog, { lastHeatDate: heatDate }));
    if (isNew && earnTP) earnTP(TP_VALUES.heat_log, "Logged heat cycle for "+dog.name);
  }

  if (dog.gender !== "female") {
    return <EmptyState icon="&#x2642;" title="Male dog" sub="Heat tracking is only available for female dogs." />;
  }

  return (
    <div className="fadeIn">
      {heat ? (
        <div>
          <div style={{ background:heat.inHeat?C.pinkFaint:C.card,border:"1px solid "+(heat.inHeat?C.pink:C.accent),borderRadius:14,padding:20,marginBottom:16 }}>
            {heat.inHeat ? (
              <div>
                <p style={{ color:C.pink,fontWeight:800,fontSize:22,marginBottom:8 }}>Currently In Heat</p>
                <p style={{ color:C.text,fontSize:18,fontWeight:500 }}>Day <strong style={{ color:C.pink,fontSize:22 }}>{heat.heatDay}</strong> of ~{heat.dur}</p>
                <div style={{ background:C.border,borderRadius:999,height:10,marginTop:14,overflow:"hidden" }}>
                  <div style={{ background:"linear-gradient(90deg,"+C.pink+",#f9a8d4)",width:((heat.heatDay/heat.dur)*100)+"%",height:"100%",borderRadius:999 }} />
                </div>
                {heat.endingSoon && <p style={{ color:C.yellow,fontSize:15,fontWeight:600,marginTop:10 }}>Cycle ending in ~{heat.dur-heat.daysSince} days</p>}
              </div>
            ) : (
              <div>
                <p style={{ color:heat.upcoming?C.yellow:C.text,fontWeight:800,fontSize:20,marginBottom:8 }}>
                  {heat.upcoming ? "Heat Cycle Upcoming!" : "Next Heat Cycle Estimate"}
                </p>
                <p style={{ color:C.text,fontSize:18,fontWeight:500 }}>Estimated in <strong style={{ color:heat.upcoming?C.yellow:C.accent,fontSize:22 }}>{heat.daysUntilNext} days</strong></p>
                {heat.upcoming && <p style={{ color:C.text,fontSize:15,fontWeight:500,marginTop:8 }}>Prepare now: diapers, enzyme cleaner, spare bedding.</p>}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ background:C.card,border:"1px solid "+C.accent,borderRadius:12,padding:16,marginBottom:14 }}>
          <p style={{ color:C.text,fontSize:15,lineHeight:1.6 }}>No heat date recorded yet. Enter the first day of her last heat cycle to begin tracking.</p>
        </div>
      )}

      <div style={{ background:C.card,border:"1px solid "+C.accent,borderRadius:14,padding:16,marginBottom:16 }}>
        <p className="sectionLabel">{heat ? "Update Last Heat Start Date" : "Set Last Heat Start Date"}</p>
        <div style={{ display:"flex",gap:8 }}>
          <div style={{ flex:1 }}>
            <EnhancedDatePicker value={heatDate} onChange={function(e){ setHeatDate(e.target.value); }} />
          </div>
          <button className="btnP" onClick={saveDate}>Save</button>
        </div>
      </div>

      <div>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
          <p className="sectionLabel" style={{ color:C.pink,marginBottom:0 }}>Heat Cycle Tips</p>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            <span style={{ fontSize:11,color:C.muted }}>{(heatTipPage*4+1)+"-"+Math.min(heatTipPage*4+4,HEAT_TIPS.length)+" of "+HEAT_TIPS.length}</span>
            <button className="btnI" onClick={function(){ setHeatTipPage(function(p){ return p>0?p-1:Math.ceil(HEAT_TIPS.length/4)-1; }); }} title="Previous tips">&#8249;</button>
            <button className="btnI" onClick={function(){ setHeatTipPage(function(p){ return (p+1)*4<HEAT_TIPS.length?p+1:0; }); }} title="Next tips">&#8250;</button>
          </div>
        </div>
        {HEAT_TIPS.slice(heatTipPage*4, heatTipPage*4+4).map(function(t, i) {
          return (
            <div key={i} style={{ background:C.card,border:"1px solid "+C.accent,borderLeft:"2px solid "+C.pink,borderRadius:12,padding:"14px 18px",marginBottom:10,display:"flex",alignItems:"flex-start",gap:12 }}>
              <span style={{ fontSize:20,flexShrink:0,marginTop:1 }}>🌸</span>
              <p style={{ fontSize:15,fontWeight:600,color:C.text,lineHeight:1.65,margin:0 }}>{t}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// badges - figured out the logic after a few tries
const BADGE_DEFS = [

  // ════════════════════════════════════════
  // 🍽️  FEEDING — Easy → Legendary
  // ════════════════════════════════════════
  { id:"first_feed", tier:1, icon:"🍽️", name:"First Meal", desc:"Log your very first feeding", color:"green",
    check: function(dog) { return (dog.activityLog||[]).some(function(e){ return e.type==="fed"; }); } },
  { id:"feed_5", tier:1, icon:"🥣", name:"Consistent Feeder", desc:"Log 5 feedings", color:"green",
    check: function(dog) { return (dog.activityLog||[]).filter(function(e){ return e.type==="fed"; }).length >= 5; } },
  { id:"feed_25", tier:2, icon:"👨‍🍳", name:"Top Chef", desc:"Log 25 feedings", color:"green",
    check: function(dog) { return (dog.activityLog||[]).filter(function(e){ return e.type==="fed"; }).length >= 25; } },
  { id:"feed_100", tier:3, icon:"⭐", name:"Master Chef", desc:"Log 100 feedings", color:"accent",
    check: function(dog) { return (dog.activityLog||[]).filter(function(e){ return e.type==="fed"; }).length >= 100; } },
  { id:"feed_365", tier:4, icon:"👑", name:"Iron Chef", desc:"Log 365 feedings — a full year of meals", color:"yellow",
    check: function(dog) { return (dog.activityLog||[]).filter(function(e){ return e.type==="fed"; }).length >= 365; } },

  // ════════════════════════════════════════
  // 🌿  OUTDOOR — Easy → Legendary
  // ════════════════════════════════════════
  { id:"first_outside", tier:1, icon:"🌿", name:"Fresh Air", desc:"Take your dog outside for the first time", color:"blue",
    check: function(dog) { return (dog.activityLog||[]).some(function(e){ return e.type==="outside"; }); } },
  { id:"outside_10", tier:1, icon:"🏃", name:"Active Pup", desc:"Log 10 outdoor trips spread over at least 3 days", color:"blue",
    check: function(dog) { 
      var outLogs = (dog.activityLog||[]).filter(function(e){ return e.type==="outside"; });
      if (outLogs.length < 10) return false;
      // Check entries are spread over at least 3 days
      var uniqueDays = {};
      outLogs.forEach(function(log) {
        var day = new Date(log.timestamp).toDateString();
        uniqueDays[day] = true;
      });
      return Object.keys(uniqueDays).length >= 3;
    } },
  { id:"outside_50", tier:2, icon:"🌳", name:"Trail Blazer", desc:"Log 50 outdoor trips", color:"blue",
    check: function(dog) { return (dog.activityLog||[]).filter(function(e){ return e.type==="outside"; }).length >= 50; } },
  { id:"outside_200", tier:3, icon:"🗺️", name:"Adventurer", desc:"Log 200 outdoor trips", color:"blue",
    check: function(dog) { return (dog.activityLog||[]).filter(function(e){ return e.type==="outside"; }).length >= 200; } },
  { id:"outside_500", tier:4, icon:"🧭", name:"Explorer Extraordinaire", desc:"Log 500 outdoor trips — a true adventurer", color:"accent",
    check: function(dog) { return (dog.activityLog||[]).filter(function(e){ return e.type==="outside"; }).length >= 500; } },
  { id:"outside_both_same_day", tier:2, icon:"☀️", name:"Full Day Out", desc:"Log both a feeding and 3 outdoor trips on the same day", color:"blue",
    check: function(dog) {
      var log = dog.activityLog || [];
      var byDay = {};
      log.forEach(function(e) {
        var d = new Date(e.timestamp).toDateString();
        if (!byDay[d]) byDay[d] = { fed:0, out:0 };
        if (e.type==="fed") byDay[d].fed++;
        if (e.type==="outside") byDay[d].out++;
      });
      return Object.values(byDay).some(function(d){ return d.fed >= 1 && d.out >= 3; });
    } },

  // ════════════════════════════════════════
  // 🔥  STREAKS — Medium → Legendary
  // ════════════════════════════════════════
  { id:"streak_3", tier:1, icon:"🔥", name:"On a Roll", desc:"Log activity on 3 different calendar days", color:"red",
    check: function(dog) {
      var days = {};
      (dog.activityLog||[]).forEach(function(e){ days[new Date(e.timestamp).toDateString()] = true; });
      return Object.keys(days).length >= 3;
    } },
  { id:"streak_7", tier:2, icon:"📅", name:"Week Warrior", desc:"Log activity on 7 different days", color:"red",
    check: function(dog) {
      var days = {};
      (dog.activityLog||[]).forEach(function(e){ days[new Date(e.timestamp).toDateString()] = true; });
      return Object.keys(days).length >= 7;
    } },
  { id:"streak_30", tier:3, icon:"🗓️", name:"Monthly Devotion", desc:"Log activity on 30 different days", color:"red",
    check: function(dog) {
      var days = {};
      (dog.activityLog||[]).forEach(function(e){ days[new Date(e.timestamp).toDateString()] = true; });
      return Object.keys(days).length >= 30;
    } },
  { id:"streak_consec_7", tier:3, icon:"⚡", name:"7-Day Streak", desc:"Log activity on 7 consecutive days in a row", color:"yellow",
    check: function(dog) {
      var log = dog.activityLog || [];
      if (!log.length) return false;
      var daySet = {};
      log.forEach(function(e){ daySet[new Date(e.timestamp).toDateString()] = true; });
      var sorted = Object.keys(daySet).map(function(d){ return new Date(d).getTime(); }).sort(function(a,b){return a-b;});
      var best = 1, cur = 1;
      for (var i = 1; i < sorted.length; i++) {
        if (sorted[i] - sorted[i-1] <= 86400000 * 1.5) { cur++; best = Math.max(best, cur); }
        else cur = 1;
      }
      return best >= 7;
    } },
  { id:"streak_consec_30", tier:4, icon:"🌠", name:"Iron Streak", desc:"Log activity every day for 30 consecutive days", color:"yellow",
    check: function(dog) {
      var log = dog.activityLog || [];
      if (!log.length) return false;
      var daySet = {};
      log.forEach(function(e){ daySet[new Date(e.timestamp).toDateString()] = true; });
      var sorted = Object.keys(daySet).map(function(d){ return new Date(d).getTime(); }).sort(function(a,b){return a-b;});
      var best = 1, cur = 1;
      for (var i = 1; i < sorted.length; i++) {
        if (sorted[i] - sorted[i-1] <= 86400000 * 1.5) { cur++; best = Math.max(best, cur); }
        else cur = 1;
      }
      return best >= 30;
    } },
  { id:"streak_consec_100", tier:4, icon:"💎", name:"Unstoppable", desc:"Log activity every day for 100 consecutive days", color:"accent",
    check: function(dog) {
      var log = dog.activityLog || [];
      if (!log.length) return false;
      var daySet = {};
      log.forEach(function(e){ daySet[new Date(e.timestamp).toDateString()] = true; });
      var sorted = Object.keys(daySet).map(function(d){ return new Date(d).getTime(); }).sort(function(a,b){return a-b;});
      var best = 1, cur = 1;
      for (var i = 1; i < sorted.length; i++) {
        if (sorted[i] - sorted[i-1] <= 86400000 * 1.5) { cur++; best = Math.max(best, cur); }
        else cur = 1;
      }
      return best >= 100;
    } },

  // ════════════════════════════════════════
  // 🩺  VET CARE — Easy → Hard
  // ════════════════════════════════════════
  { id:"first_vet", tier:1, icon:"🩺", name:"First Check-Up", desc:"Schedule your first vet appointment", color:"purple",
    check: function(dog) { return (dog.vetAppointments||[]).length >= 1; } },
  { id:"vet_3", tier:2, icon:"🏥", name:"Health Advocate", desc:"Schedule 3 vet appointments", color:"purple",
    check: function(dog) { return (dog.vetAppointments||[]).length >= 3; } },
  { id:"vet_10", tier:3, icon:"🩻", name:"Dedicated Patient", desc:"Schedule 10 vet appointments", color:"purple",
    check: function(dog) { return (dog.vetAppointments||[]).length >= 10; } },
  { id:"vet_annual", tier:3, icon:"📆", name:"Annual Care", desc:"Have a past vet visit and a future one scheduled", color:"purple",
    check: function(dog) {
      var appts = dog.vetAppointments || [];
      var hasPast = appts.some(function(a){ return daysUntil(a.date) < 0; });
      var hasFuture = appts.some(function(a){ return daysUntil(a.date) >= 0; });
      return hasPast && hasFuture;
    } },
  { id:"vet_no_overdue", tier:2, icon:"✅", name:"Always Prepared", desc:"Have a future vet appointment already scheduled", color:"green",
    check: function(dog) { return (dog.vetAppointments||[]).some(function(a){ return daysUntil(a.date) >= 0; }); } },

  // ════════════════════════════════════════
  // 💉  VACCINES — Easy → Hard
  // ════════════════════════════════════════
  { id:"first_vax", tier:1, icon:"💉", name:"First Shot", desc:"Add your first vaccine record", color:"pink",
    check: function(dog) { return (dog.vaccines||[]).length >= 1; } },
  { id:"vax_3", tier:2, icon:"🛡️", name:"Shielded", desc:"Add 3 or more vaccine records", color:"pink",
    check: function(dog) { return (dog.vaccines||[]).length >= 3; } },
  { id:"vax_6", tier:3, icon:"🔰", name:"Fully Armored", desc:"Add 6 or more vaccine records", color:"pink",
    check: function(dog) { return (dog.vaccines||[]).length >= 6; } },
  { id:"no_overdue_vax", tier:2, icon:"🟢", name:"Up to Date", desc:"Have vaccines on file with none overdue", color:"green",
    check: function(dog) { var v = dog.vaccines||[]; return v.length > 0 && !v.some(function(x){ return x.nextDate && isOverdue(x.nextDate); }); } },
  { id:"vax_all_current_6", tier:4, icon:"🏅", name:"Vaccination Champion", desc:"Maintain 6+ vaccines all current with no overdue", color:"accent",
    check: function(dog) {
      var v = dog.vaccines||[];
      return v.length >= 6 && !v.some(function(x){ return x.nextDate && isOverdue(x.nextDate); });
    } },

  // ════════════════════════════════════════
  // 💊  MEDICATIONS — Easy → Hard
  // ════════════════════════════════════════
  { id:"first_med", tier:1, icon:"💊", name:"On Medication", desc:"Add your first medication", color:"purple",
    check: function(dog) { return (dog.medications||[]).length >= 1; } },
  { id:"med_given_10", tier:2, icon:"💊", name:"Dose Master", desc:"Mark a single medication given 10 times", color:"purple",
    check: function(dog) { return (dog.medications||[]).some(function(m){ return (m.givenLog||[]).length >= 10; }); } },
  { id:"med_given_50", tier:3, icon:"🧪", name:"Pharmacist", desc:"Mark a single medication given 50 times", color:"purple",
    check: function(dog) { return (dog.medications||[]).some(function(m){ return (m.givenLog||[]).length >= 50; }); } },
  { id:"med_given_100", tier:4, icon:"🔬", name:"Clinical Expert", desc:"Mark a single medication given 100 times — true dedication", color:"accent",
    check: function(dog) { return (dog.medications||[]).some(function(m){ return (m.givenLog||[]).length >= 100; }); } },
  { id:"med_3_active", tier:3, icon:"🗂️", name:"Multi-Med Manager", desc:"Track 3 active medications at once", color:"purple",
    check: function(dog) { return (dog.medications||[]).filter(function(m){ return m.active; }).length >= 3; } },

  // ════════════════════════════════════════
  // ⚖️  WEIGHT — Easy → Hard
  // ════════════════════════════════════════
  { id:"first_weight", tier:1, icon:"⚖️", name:"Weigh In", desc:"Log your first weight entry", color:"accent",
    check: function(dog) { return (dog.weightHistory||[]).length >= 1; } },
  { id:"weight_5", tier:2, icon:"📊", name:"Weight Watcher", desc:"Log 5 weight entries spread over at least 5 days", color:"accent",
    check: function(dog) { 
      var h = (dog.weightHistory||[]).slice().sort(function(a,b){ return parseLocalDate(a.date) - parseLocalDate(b.date); });
      if (h.length < 5) return false;
      // Check that entries are spread over at least 5 different days
      var uniqueDays = {};
      h.forEach(function(entry) {
        var dayKey = entry.date; // Date in YYYY-MM-DD format
        uniqueDays[dayKey] = true;
      });
      return Object.keys(uniqueDays).length >= 5;
    } },
  { id:"weight_12", tier:3, icon:"📈", name:"Monthly Tracker", desc:"Log 12 weight entries — one per month for a year", color:"accent",
    check: function(dog) { return (dog.weightHistory||[]).length >= 12; } },
  { id:"weight_52", tier:4, icon:"🏋️", name:"Precision Keeper", desc:"Log 52 weight entries — a full year of weekly weigh-ins", color:"yellow",
    check: function(dog) { return (dog.weightHistory||[]).length >= 52; } },
  { id:"weight_stable", tier:3, icon:"⚖️", name:"Healthy Weight", desc:"Log 5+ entries where no single change exceeds 5 lbs", color:"green",
    check: function(dog) {
      var h = (dog.weightHistory||[]).slice().sort(function(a,b){ return parseLocalDate(a.date) - parseLocalDate(b.date); });
      if (h.length < 5) return false;
      for (var i = 1; i < h.length; i++) {
        if (Math.abs(h[i].weight - h[i-1].weight) > 5) return false;
      }
      return true;
    } },

  // ════════════════════════════════════════
  // 📸  PROFILE & SETUP — Easy
  // ════════════════════════════════════════
  { id:"profile_photo", tier:1, icon:"📸", name:"Picture Perfect", desc:"Upload a photo of your dog", color:"pink",
    check: function(dog) { return !!dog.photo; } },
  { id:"full_profile", tier:1, icon:"📋", name:"All About Me", desc:"Fill in breed, age, weight, and gender", color:"blue",
    check: function(dog) { return !!(dog.breed && dog.age && dog.weight && dog.gender); } },
  { id:"notes_added", tier:1, icon:"📝", name:"Story Teller", desc:"Write notes about your dog", color:"blue",
    check: function(dog) { return !!(dog.notes && dog.notes.trim().length > 10); } },
  { id:"dob_set", tier:1, icon:"🎂", name:"Birthday Pup", desc:"Celebrate when it's your dog's birthday!", color:"pink",
    check: function(dog) { 
      if (!dog.dob) return false;
      var dob = parseLocalDate(dog.dob);
      var today = new Date();
      // Check if month and day match (it's their birthday today)
      return dob.getMonth() === today.getMonth() && dob.getDate() === today.getDate();
    } },
  { id:"full_setup", tier:2, icon:"🌟", name:"Complete Care Profile", desc:"Have a photo, notes, DOB, breed, age, and weight filled in", color:"accent",
    check: function(dog) { return !!(dog.photo && dog.notes && dog.dob && dog.breed && dog.age && dog.weight); } },

  // ════════════════════════════════════════
  // 🌸  HEAT TRACKING
  // ════════════════════════════════════════
  { id:"heat_tracked", tier:1, icon:"🌸", name:"Cycle Aware", desc:"Set a heat cycle date for a female dog", color:"pink",
    check: function(dog) { return dog.gender === "female" && !!dog.lastHeatDate; } },
  { id:"heat_planned", tier:2, icon:"🗓️", name:"Cycle Planner", desc:"Track a female dog's heat with a future estimated date", color:"pink",
    check: function(dog) {
      if (dog.gender !== "female" || !dog.lastHeatDate) return false;
      var h = getHeatStatus(dog);
      return h && h.daysUntilNext > 0;
    } },

  // ════════════════════════════════════════
  // 🐾  PACK SIZE — Easy → Legendary
  // ════════════════════════════════════════
  { id:"two_dogs", tier:1, icon:"🐕‍🦺", name:"Dynamic Duo", desc:"Add 2 or more dogs to your pack", color:"accent",
    check: function(dog, allDogs) { return allDogs.length >= 2; } },
  { id:"three_dogs", tier:2, icon:"🐕", name:"The Pack", desc:"Add 3 or more dogs", color:"accent",
    check: function(dog, allDogs) { return allDogs.length >= 3; } },
  { id:"five_dogs", tier:3, icon:"🐾", name:"Pack Leader", desc:"Build a pack of 5 or more dogs", color:"accent",
    check: function(dog, allDogs) { return allDogs.length >= 5; } },
  { id:"ten_dogs", tier:4, icon:"🏡", name:"Kennel Master", desc:"Manage a pack of 10 or more dogs", color:"yellow",
    check: function(dog, allDogs) { return allDogs.length >= 10; } },

  // ════════════════════════════════════════
  // 🏆  MASTERY — Hard & Legendary
  // ════════════════════════════════════════
  { id:"all_sections", tier:3, icon:"🗂️", name:"Total Care", desc:"Have data in vet, vaccines, meds, and weight for one dog", color:"accent",
    check: function(dog) {
      return (dog.vetAppointments||[]).length > 0 && (dog.vaccines||[]).length > 0 &&
             (dog.medications||[]).length > 0 && (dog.weightHistory||[]).length > 0;
    } },
  { id:"care_veteran", tier:4, icon:"🎖️", name:"Care Veteran", desc:"Log 50+ feedings, 50+ outdoor trips, 3+ vet visits, and 5+ weight entries", color:"accent",
    check: function(dog) {
      var fed = (dog.activityLog||[]).filter(function(e){ return e.type==="fed"; }).length;
      var out = (dog.activityLog||[]).filter(function(e){ return e.type==="outside"; }).length;
      return fed >= 50 && out >= 50 && (dog.vetAppointments||[]).length >= 3 && (dog.weightHistory||[]).length >= 5;
    } },
  { id:"grand_champion", tier:4, icon:"🏆", name:"Grand Champion", desc:"Earn 20 or more badges for a single dog", color:"yellow",
    check: function(dog, allDogs) {
      var count = BADGE_DEFS.filter(function(b){ if (b.id==="grand_champion") return false; try { return !!b.check(dog, allDogs||[]); } catch(e){ return false; } }).length;
      return count >= 20;
    } },
  { id:"the_legend", tier:4, icon:"🌠", name:"The Legend", desc:"Earn 35 or more badges for a single dog — the ultimate achievement", color:"accent",
    check: function(dog, allDogs) {
      var count = BADGE_DEFS.filter(function(b){ if (b.id==="the_legend"||b.id==="grand_champion") return false; try { return !!b.check(dog, allDogs||[]); } catch(e){ return false; } }).length;
      return count >= 35;
    } },

  // ════════════════════════════════════════
  // 🌙  SPECIAL MOMENTS
  // ════════════════════════════════════════
  { id:"early_bird", tier:2, icon:"🌅", name:"Early Bird", desc:"Log a feeding before 7 AM", color:"yellow",
    check: function(dog) {
      return (dog.activityLog||[]).some(function(e){
        return e.type==="fed" && new Date(e.timestamp).getHours() < 7;
      });
    } },
  { id:"night_owl", tier:2, icon:"🌙", name:"Night Owl", desc:"Log an outdoor trip after 10 PM", color:"purple",
    check: function(dog) {
      return (dog.activityLog||[]).some(function(e){
        return e.type==="outside" && new Date(e.timestamp).getHours() >= 22;
      });
    } },
  { id:"busy_day", tier:2, icon:"📌", name:"Busy Day", desc:"Log 4 or more activities in a single day", color:"blue",
    check: function(dog) {
      var byDay = {};
      (dog.activityLog||[]).forEach(function(e){
        var d = new Date(e.timestamp).toDateString();
        byDay[d] = (byDay[d]||0) + 1;
      });
      return Object.values(byDay).some(function(n){ return n >= 4; });
    } },
  { id:"weekend_warrior", tier:2, icon:"🎉", name:"Weekend Warrior", desc:"Log activity on both Saturday and Sunday of the same weekend", color:"green",
    check: function(dog) {
      var log = dog.activityLog || [];
      var sats = {}, suns = {};
      log.forEach(function(e){
        var d = new Date(e.timestamp);
        var week = Math.floor(d.getTime() / (7*86400000));
        if (d.getDay()===6) sats[week] = true;
        if (d.getDay()===0) suns[week] = true;
      });
      return Object.keys(sats).some(function(w){ return suns[w]; });
    } },
  { id:"new_year", tier:3, icon:"🎆", name:"New Year Pup", desc:"Log a feeding on January 1st", color:"accent",
    check: function(dog) {
      return (dog.activityLog||[]).some(function(e){
        var d = new Date(e.timestamp);
        return d.getMonth()===0 && d.getDate()===1;
      });
    } },

  // ════════════════════════════════════════
  // 🍽️  FEEDING — More milestones
  // ════════════════════════════════════════
  { id:"feed_10", tier:1, icon:"🥄", name:"Feeding Routine", desc:"Log 10 feedings spread over at least 3 days", color:"green",
    check: function(dog) { 
      var fedLogs = (dog.activityLog||[]).filter(function(e){ return e.type==="fed"; });
      if (fedLogs.length < 10) return false;
      // Check entries are spread over at least 3 days
      var uniqueDays = {};
      fedLogs.forEach(function(log) {
        var day = new Date(log.timestamp).toDateString();
        uniqueDays[day] = true;
      });
      return Object.keys(uniqueDays).length >= 3;
    } },
  { id:"feed_50", tier:2, icon:"🍖", name:"Steady Supplier", desc:"Log 50 feedings", color:"green",
    check: function(dog) { return (dog.activityLog||[]).filter(function(e){ return e.type==="fed"; }).length >= 50; } },
  { id:"feed_200", tier:3, icon:"🥩", name:"Gourmet Guardian", desc:"Log 200 feedings", color:"green",
    check: function(dog) { return (dog.activityLog||[]).filter(function(e){ return e.type==="fed"; }).length >= 200; } },
  { id:"feed_twice_day", tier:2, icon:"🕐", name:"Twice the Love", desc:"Log 2 feedings on the same day", color:"green",
    check: function(dog) {
      var byDay = {};
      (dog.activityLog||[]).filter(function(e){ return e.type==="fed"; }).forEach(function(e){
        var d = new Date(e.timestamp).toDateString(); byDay[d] = (byDay[d]||0)+1;
      });
      return Object.values(byDay).some(function(n){ return n >= 2; });
    } },
  { id:"feed_3x_day", tier:3, icon:"🍴", name:"Full Board", desc:"Log 3 feedings in a single day", color:"green",
    check: function(dog) {
      var byDay = {};
      (dog.activityLog||[]).filter(function(e){ return e.type==="fed"; }).forEach(function(e){
        var d = new Date(e.timestamp).toDateString(); byDay[d] = (byDay[d]||0)+1;
      });
      return Object.values(byDay).some(function(n){ return n >= 3; });
    } },
  { id:"midnight_snack", tier:2, icon:"🌛", name:"Midnight Snack", desc:"Log a feeding between midnight and 3 AM", color:"purple",
    check: function(dog) {
      return (dog.activityLog||[]).some(function(e){
        var h = new Date(e.timestamp).getHours();
        return e.type==="fed" && h >= 0 && h < 3;
      });
    } },

  // ════════════════════════════════════════
  // 🌿  OUTDOOR — More milestones
  // ════════════════════════════════════════
  { id:"outside_5", tier:1, icon:"🌱", name:"First Steps", desc:"Log 5 outdoor trips", color:"blue",
    check: function(dog) { return (dog.activityLog||[]).filter(function(e){ return e.type==="outside"; }).length >= 5; } },
  { id:"outside_25", tier:2, icon:"🍃", name:"Park Regular", desc:"Log 25 outdoor trips", color:"blue",
    check: function(dog) { return (dog.activityLog||[]).filter(function(e){ return e.type==="outside"; }).length >= 25; } },
  { id:"outside_100", tier:3, icon:"🏞️", name:"Outdoor Enthusiast", desc:"Log 100 outdoor trips", color:"blue",
    check: function(dog) { return (dog.activityLog||[]).filter(function(e){ return e.type==="outside"; }).length >= 100; } },
  { id:"outside_1000", tier:4, icon:"🌍", name:"World Walker", desc:"Log 1000 outdoor trips — legend of the leash", color:"accent",
    check: function(dog) { return (dog.activityLog||[]).filter(function(e){ return e.type==="outside"; }).length >= 1000; } },
  { id:"morning_walk", tier:1, icon:"🌄", name:"Morning Walker", desc:"Take your dog outside before 8 AM", color:"yellow",
    check: function(dog) {
      return (dog.activityLog||[]).some(function(e){
        return e.type==="outside" && new Date(e.timestamp).getHours() < 8;
      });
    } },
  { id:"lunchtime_walk", tier:1, icon:"☀️", name:"Midday Roamer", desc:"Take your dog outside between 11 AM and 1 PM", color:"yellow",
    check: function(dog) {
      return (dog.activityLog||[]).some(function(e){
        var h = new Date(e.timestamp).getHours();
        return e.type==="outside" && h >= 11 && h < 13;
      });
    } },
  { id:"evening_stroll", tier:1, icon:"🌆", name:"Evening Stroller", desc:"Take your dog outside between 6 PM and 9 PM", color:"blue",
    check: function(dog) {
      return (dog.activityLog||[]).some(function(e){
        var h = new Date(e.timestamp).getHours();
        return e.type==="outside" && h >= 18 && h < 21;
      });
    } },
  { id:"outdoor_5_day", tier:3, icon:"🗺️", name:"Marathon Day", desc:"Log 5 or more outdoor trips in a single day", color:"blue",
    check: function(dog) {
      var byDay = {};
      (dog.activityLog||[]).filter(function(e){ return e.type==="outside"; }).forEach(function(e){
        var d = new Date(e.timestamp).toDateString(); byDay[d] = (byDay[d]||0)+1;
      });
      return Object.values(byDay).some(function(n){ return n >= 5; });
    } },

  // ════════════════════════════════════════
  // 🔥  STREAKS — More
  // ════════════════════════════════════════
  { id:"streak_14", tier:2, icon:"🗓️", name:"Fortnight Friend", desc:"Log activity on 14 different days", color:"red",
    check: function(dog) {
      var days = {};
      (dog.activityLog||[]).forEach(function(e){ days[new Date(e.timestamp).toDateString()] = true; });
      return Object.keys(days).length >= 14;
    } },
  { id:"streak_consec_3", tier:1, icon:"🔆", name:"3-Day Habit", desc:"Log activity 3 days in a row", color:"red",
    check: function(dog) {
      var daySet = {};
      (dog.activityLog||[]).forEach(function(e){ daySet[new Date(e.timestamp).toDateString()] = true; });
      var sorted = Object.keys(daySet).map(function(d){ return new Date(d).getTime(); }).sort(function(a,b){return a-b;});
      var best = 1, cur = 1;
      for (var i = 1; i < sorted.length; i++) {
        if (sorted[i]-sorted[i-1] <= 86400000*1.5) { cur++; best = Math.max(best,cur); } else cur=1;
      }
      return best >= 3;
    } },
  { id:"streak_consec_14", tier:3, icon:"🌊", name:"Two-Week Streak", desc:"Log activity 14 consecutive days", color:"yellow",
    check: function(dog) {
      var daySet = {};
      (dog.activityLog||[]).forEach(function(e){ daySet[new Date(e.timestamp).toDateString()] = true; });
      var sorted = Object.keys(daySet).map(function(d){ return new Date(d).getTime(); }).sort(function(a,b){return a-b;});
      var best = 1, cur = 1;
      for (var i = 1; i < sorted.length; i++) {
        if (sorted[i]-sorted[i-1] <= 86400000*1.5) { cur++; best = Math.max(best,cur); } else cur=1;
      }
      return best >= 14;
    } },
  { id:"streak_consec_60", tier:4, icon:"🔱", name:"60-Day Legend", desc:"Log activity 60 consecutive days in a row", color:"accent",
    check: function(dog) {
      var daySet = {};
      (dog.activityLog||[]).forEach(function(e){ daySet[new Date(e.timestamp).toDateString()] = true; });
      var sorted = Object.keys(daySet).map(function(d){ return new Date(d).getTime(); }).sort(function(a,b){return a-b;});
      var best = 1, cur = 1;
      for (var i = 1; i < sorted.length; i++) {
        if (sorted[i]-sorted[i-1] <= 86400000*1.5) { cur++; best = Math.max(best,cur); } else cur=1;
      }
      return best >= 60;
    } },

  // ════════════════════════════════════════
  // 🩺  VET CARE — More
  // ════════════════════════════════════════
  { id:"vet_5", tier:2, icon:"🏨", name:"Frequent Patient", desc:"Schedule 5 vet appointments", color:"purple",
    check: function(dog) { return (dog.vetAppointments||[]).length >= 5; } },
  { id:"vet_15", tier:4, icon:"🩹", name:"Vet Regular", desc:"Schedule 15 vet appointments over time", color:"purple",
    check: function(dog) { return (dog.vetAppointments||[]).length >= 15; } },
  { id:"vet_reason_detail", tier:1, icon:"📋", name:"Detailed Visit", desc:"Add a vet appointment with notes filled in", color:"purple",
    check: function(dog) { return (dog.vetAppointments||[]).some(function(a){ return a.notes && a.notes.trim().length > 5; }); } },
  { id:"vet_named", tier:1, icon:"👨‍⚕️", name:"My Vet", desc:"Add a vet appointment with the vet's name", color:"purple",
    check: function(dog) { return (dog.vetAppointments||[]).some(function(a){ return a.vet && a.vet.trim().length > 0; }); } },

  // ════════════════════════════════════════
  // 💉  VACCINES — More
  // ════════════════════════════════════════
  { id:"vax_rabies", tier:1, icon:"🦠", name:"Rabies Protected", desc:"Log a Rabies vaccination", color:"pink",
    check: function(dog) { return (dog.vaccines||[]).some(function(v){ return v.name && v.name.toLowerCase().includes("rabies"); }); } },
  { id:"vax_dhpp", tier:1, icon:"🛡️", name:"Core Protected", desc:"Log a DHPP (Distemper/Parvo) vaccination", color:"pink",
    check: function(dog) { return (dog.vaccines||[]).some(function(v){ return v.name && v.name.toLowerCase().includes("dhpp"); }); } },
  { id:"vax_notes", tier:1, icon:"📝", name:"Documented Dose", desc:"Add notes to a vaccine record (lot number, clinic, etc.)", color:"pink",
    check: function(dog) { return (dog.vaccines||[]).some(function(v){ return v.notes && v.notes.trim().length > 3; }); } },
  { id:"vax_4", tier:2, icon:"🔰", name:"Well Covered", desc:"Add 4 vaccine records", color:"pink",
    check: function(dog) { return (dog.vaccines||[]).length >= 4; } },
  { id:"vax_next_set", tier:2, icon:"📅", name:"Booster Ready", desc:"Have 3 or more vaccines with a next-due date set", color:"pink",
    check: function(dog) { return (dog.vaccines||[]).filter(function(v){ return !!v.nextDate; }).length >= 3; } },

  // ════════════════════════════════════════
  // 💊  MEDICATIONS — More
  // ════════════════════════════════════════
  { id:"med_2_active", tier:2, icon:"💊", name:"Double Dose", desc:"Track 2 active medications at once", color:"purple",
    check: function(dog) { return (dog.medications||[]).filter(function(m){ return m.active; }).length >= 2; } },
  { id:"med_given_5", tier:1, icon:"🧴", name:"First Doses", desc:"Mark a medication given 5 times", color:"purple",
    check: function(dog) { return (dog.medications||[]).some(function(m){ return (m.givenLog||[]).length >= 5; }); } },
  { id:"med_given_25", tier:2, icon:"💉", name:"Consistent Doses", desc:"Mark a medication given 25 times", color:"purple",
    check: function(dog) { return (dog.medications||[]).some(function(m){ return (m.givenLog||[]).length >= 25; }); } },
  { id:"med_completed", tier:2, icon:"✅", name:"Course Complete", desc:"Mark a medication as inactive/completed", color:"green",
    check: function(dog) { return (dog.medications||[]).some(function(m){ return !m.active; }); } },
  { id:"med_prescriber", tier:1, icon:"📄", name:"Prescribed Care", desc:"Add a medication with a prescriber name filled in", color:"purple",
    check: function(dog) { return (dog.medications||[]).some(function(m){ return m.prescribedBy && m.prescribedBy.trim().length > 0; }); } },
  { id:"med_heartgard", tier:1, icon:"❤️", name:"Heartworm Guard", desc:"Track a heartworm prevention medication", color:"red",
    check: function(dog) { return (dog.medications||[]).some(function(m){ return m.name && (m.name.toLowerCase().includes("heartgard")||m.name.toLowerCase().includes("heartworm")||m.name.toLowerCase().includes("interceptor")); }); } },

  // ════════════════════════════════════════
  // ⚖️  WEIGHT — More milestones
  // ════════════════════════════════════════
  { id:"weight_3", tier:1, icon:"📉", name:"Getting Tracked", desc:"Log 3 weight entries", color:"accent",
    check: function(dog) { return (dog.weightHistory||[]).length >= 3; } },
  { id:"weight_25", tier:3, icon:"📐", name:"Diligent Logger", desc:"Log 25 weight entries", color:"accent",
    check: function(dog) { return (dog.weightHistory||[]).length >= 25; } },
  { id:"weight_note", tier:1, icon:"🗒️", name:"Annotated Entry", desc:"Add a note to a weight entry", color:"accent",
    check: function(dog) { return (dog.weightHistory||[]).some(function(h){ return h.note && h.note.trim().length > 0; }); } },
  { id:"weight_loss", tier:2, icon:"📉", name:"Trim & Healthy", desc:"Record a weight that is lower than a previous entry", color:"green",
    check: function(dog) {
      var h = (dog.weightHistory||[]).slice().sort(function(a,b){ return parseLocalDate(a.date) - parseLocalDate(b.date); });
      for (var i=1;i<h.length;i++) { if (h[i].weight < h[i-1].weight) return true; }
      return false;
    } },
  { id:"weight_gain", tier:1, icon:"📈", name:"Growing Strong", desc:"Record a weight higher than a previous entry", color:"accent",
    check: function(dog) {
      var h = (dog.weightHistory||[]).slice().sort(function(a,b){ return parseLocalDate(a.date) - parseLocalDate(b.date); });
      for (var i=1;i<h.length;i++) { if (h[i].weight > h[i-1].weight) return true; }
      return false;
    } },

  // ════════════════════════════════════════
  // 📸  PROFILE & SETUP — More
  // ════════════════════════════════════════
  { id:"long_notes", tier:2, icon:"📖", name:"Deep Thinker", desc:"Write 100+ characters in the notes field", color:"blue",
    check: function(dog) { return !!(dog.notes && dog.notes.trim().length >= 100); } },
  { id:"senior_dog", tier:2, icon:"🦳", name:"Golden Years", desc:"Track a dog aged 8 or older", color:"yellow",
    check: function(dog) { return parseFloat(dog.age) >= 8; } },
  { id:"puppy_care", tier:1, icon:"🐣", name:"Puppy Love", desc:"Track a puppy under 1 year old", color:"pink",
    check: function(dog) { return parseFloat(dog.age) < 1 && !!dog.age; } },
  { id:"big_dog", tier:1, icon:"🐘", name:"Big Boi", desc:"Track a dog over 80 lbs", color:"accent",
    check: function(dog) { return parseFloat(dog.weight) > 80; } },
  { id:"tiny_dog", tier:1, icon:"🐭", name:"Tiny Paws", desc:"Track a dog under 10 lbs", color:"pink",
    check: function(dog) { return parseFloat(dog.weight) > 0 && parseFloat(dog.weight) < 10; } },

  // ════════════════════════════════════════
  // 🌸  HEAT — More
  // ════════════════════════════════════════
  { id:"heat_day14", tier:2, icon:"💗", name:"Halfway Through", desc:"Track a heat cycle past day 14", color:"pink",
    check: function(dog) {
      if (dog.gender !== "female" || !dog.lastHeatDate) return false;
      var h = getHeatStatus(dog);
      return h && h.heatDay >= 14;
    } },
  { id:"heat_prepared", tier:2, icon:"📦", name:"Always Ready", desc:"Track an upcoming heat cycle within 7 days", color:"pink",
    check: function(dog) {
      if (dog.gender !== "female" || !dog.lastHeatDate) return false;
      var h = getHeatStatus(dog);
      return h && !h.inHeat && h.daysUntilNext <= 7 && h.daysUntilNext > 0;
    } },

  // ════════════════════════════════════════
  // 🐾  PACK — More
  // ════════════════════════════════════════
  { id:"four_dogs", tier:2, icon:"🐕", name:"Quad Squad", desc:"Add 4 dogs to your pack", color:"accent",
    check: function(dog, allDogs) { return allDogs.length >= 4; } },
  { id:"mixed_gender_pack", tier:2, icon:"♾️", name:"Boys & Girls", desc:"Have at least one male and one female dog", color:"blue",
    check: function(dog, allDogs) {
      return allDogs.some(function(d){ return d.gender==="male"; }) && allDogs.some(function(d){ return d.gender==="female"; });
    } },
  { id:"all_dogs_fed", tier:3, icon:"🥘", name:"Fed the Pack", desc:"Have all dogs fed within the last 8 hours", color:"green",
    check: function(dog, allDogs) {
      if (allDogs.length < 2) return false;
      return allDogs.every(function(d){ return d.lastFed && (Date.now()-new Date(d.lastFed)) < 8*3600000; });
    } },
  { id:"all_dogs_out", tier:3, icon:"🌳", name:"Pack Walk", desc:"Have all dogs taken outside within the last 6 hours", color:"blue",
    check: function(dog, allDogs) {
      if (allDogs.length < 2) return false;
      return allDogs.every(function(d){ return d.lastOutside && (Date.now()-new Date(d.lastOutside)) < 6*3600000; });
    } },

  // ════════════════════════════════════════
  // 🏆  MASTERY — More
  // ════════════════════════════════════════
  { id:"total_100_activities", tier:2, icon:"💪", name:"Century Club", desc:"Log 100 total activities (feeding + outdoor)", color:"accent",
    check: function(dog) { return (dog.activityLog||[]).length >= 100; } },
  { id:"total_500_activities", tier:3, icon:"🏅", name:"Half-Thousand", desc:"Log 500 total activities", color:"yellow",
    check: function(dog) { return (dog.activityLog||[]).length >= 500; } },
  { id:"total_1000_activities", tier:4, icon:"💫", name:"Thousand Strong", desc:"Log 1000 total activities — true dedication", color:"accent",
    check: function(dog) { return (dog.activityLog||[]).length >= 1000; } },
  { id:"health_trifecta", tier:3, icon:"🌈", name:"Health Trifecta", desc:"Have vaccines, medications, and vet visits all recorded", color:"green",
    check: function(dog) {
      return (dog.vaccines||[]).length > 0 && (dog.medications||[]).length > 0 && (dog.vetAppointments||[]).length > 0;
    } },
  { id:"perfect_day", tier:3, icon:"⭐", name:"Perfect Day", desc:"Log 2 feedings and 4 outdoor trips on the same calendar day", color:"yellow",
    check: function(dog) {
      var byDay = {};
      (dog.activityLog||[]).forEach(function(e){
        var d = new Date(e.timestamp).toDateString();
        if (!byDay[d]) byDay[d] = {fed:0,out:0};
        if (e.type==="fed") byDay[d].fed++;
        if (e.type==="outside") byDay[d].out++;
      });
      return Object.values(byDay).some(function(d){ return d.fed>=2 && d.out>=4; });
    } },
  { id:"completionist", tier:4, icon:"🎯", name:"Completionist", desc:"Earn 40 or more badges for a single dog", color:"yellow",
    check: function(dog, allDogs) {
      var count = BADGE_DEFS.filter(function(b){
        if (b.id==="completionist"||b.id==="grand_champion"||b.id==="the_legend") return false;
        try { return !!b.check(dog, allDogs||[]); } catch(e){ return false; }
      }).length;
      return count >= 40;
    } },

  // ════════════════════════════════════════
  // 🎉  SEASONAL & FUN
  // ════════════════════════════════════════
  { id:"valentines", tier:2, icon:"💝", name:"Valentine's Pup", desc:"Log a feeding on February 14th", color:"pink",
    check: function(dog) {
      return (dog.activityLog||[]).some(function(e){
        var d = new Date(e.timestamp); return e.type==="fed" && d.getMonth()===1 && d.getDate()===14;
      });
    } },
  { id:"halloween", tier:2, icon:"🎃", name:"Spooky Pup", desc:"Log activity on October 31st", color:"accent",
    check: function(dog) {
      return (dog.activityLog||[]).some(function(e){
        var d = new Date(e.timestamp); return d.getMonth()===9 && d.getDate()===31;
      });
    } },
  { id:"birthday", tier:3, icon:"🎂", name:"Birthday Celebrated", desc:"Log a feeding on your dog's birthday (DOB required)", color:"yellow",
    check: function(dog) {
      if (!dog.dob) return false;
      var bday = new Date(dog.dob);
      return (dog.activityLog||[]).some(function(e){
        if (e.type !== "fed") return false;
        var d = new Date(e.timestamp);
        return d.getMonth()===bday.getMonth() && d.getDate()===bday.getDate();
      });
    } },
  { id:"summer_days", tier:2, icon:"🏖️", name:"Summer Days", desc:"Log 10 outdoor trips in June, July, or August", color:"yellow",
    check: function(dog) {
      return (dog.activityLog||[]).filter(function(e){
        var m = new Date(e.timestamp).getMonth();
        return e.type==="outside" && (m===5||m===6||m===7);
      }).length >= 10;
    } },
  { id:"winter_walks", tier:2, icon:"❄️", name:"Winter Walker", desc:"Log 10 outdoor trips in December, January, or February", color:"blue",
    check: function(dog) {
      return (dog.activityLog||[]).filter(function(e){
        var m = new Date(e.timestamp).getMonth();
        return e.type==="outside" && (m===11||m===0||m===1);
      }).length >= 10;
    } },
  { id:"sunday_funday", tier:1, icon:"😎", name:"Sunday Funday", desc:"Log 3 or more activities on a Sunday", color:"blue",
    check: function(dog) {
      var byDay = {};
      (dog.activityLog||[]).forEach(function(e){
        var d = new Date(e.timestamp);
        if (d.getDay()!==0) return;
        var key = d.toDateString(); byDay[key] = (byDay[key]||0)+1;
      });
      return Object.values(byDay).some(function(n){ return n>=3; });
    } },

];

const BADGE_COLORS = {
  green: ["#52d484","rgba(82,212,132,0.15)"],
  blue: ["#60a5fa","rgba(96,165,250,0.15)"],
  pink: ["#f472b6","rgba(244,114,182,0.15)"],
  purple: ["#a78bfa","rgba(167,139,250,0.15)"],
  accent: ["#f4a24d","rgba(244,162,77,0.15)"],
  yellow: ["#fbbf24","rgba(251,191,36,0.15)"],
  red: ["#f87171","rgba(248,113,113,0.15)"],
};

function computeBadges(dog, allDogs) {
  return BADGE_DEFS.map(function(b) {
    var earned = false;
    try { earned = !!b.check(dog, allDogs || []); } catch(e) {}
    return Object.assign({}, b, { earned: earned });
  });
}

// badges tab
function MedalIcon(tier, size, muted) {
  var t = TIERS.find(function(x){ return x.tier===tier; }) || TIERS[0];
  var s = size || 32;
  var vb = 64;
  var cx = 32, medalCY = 42, r = 18, rimW = 2.5;
  var rw = 9, rh = 28, rl = 23, rr = 32;
  var uid = "m"+tier+"sz"+size;
  if (muted) {
    return (
      <svg width={s} height={s} viewBox={"0 0 "+vb+" "+vb} style={{ display:"block" }}>
        <path d={"M"+rl+",0 L"+(rl+rw)+",0 L"+(rl+rw)+","+(rh+4)+" L"+(rl+rw/2)+","+(rh+9)+" L"+rl+","+(rh+4)+" Z"} fill="#475569" opacity="0.25"/>
        <path d={"M"+rr+",0 L"+(rr+rw)+",0 L"+(rr+rw)+","+(rh+4)+" L"+(rr+rw/2)+","+(rh+9)+" L"+rr+","+(rh+4)+" Z"} fill="#334155" opacity="0.2"/>
        <circle cx={cx} cy={medalCY} r={r+rimW} fill="#475569" opacity="0.2"/>
        <circle cx={cx} cy={medalCY} r={r} fill="#1e293b" opacity="0.2"/>
      </svg>
    );
  }
  var starPts = [];
  for (var si=0; si<10; si++){
    var ang = (si*Math.PI/5) - Math.PI/2;
    var rad = si%2===0 ? r*0.38 : r*0.16;
    starPts.push((cx + Math.cos(ang)*rad).toFixed(2)+","+(medalCY + Math.sin(ang)*rad).toFixed(2));
  }
  return (
    <svg width={s} height={s} viewBox={"0 0 "+vb+" "+vb} style={{ display:"block" }}>
      <defs>
        <linearGradient id={uid+"rA"} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={t.ribbonA}/>
          <stop offset="50%" stopColor={t.ribbonB}/>
          <stop offset="100%" stopColor={t.ribbonA}/>
        </linearGradient>
        <linearGradient id={uid+"rB"} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={t.ribbonB}/>
          <stop offset="50%" stopColor={t.ribbonA}/>
          <stop offset="100%" stopColor={t.ribbonB}/>
        </linearGradient>
        <linearGradient id={uid+"mg"} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%"   stopColor={t.dotColor}/>
          <stop offset="45%"  stopColor={t.dotColor} stopOpacity="0.85"/>
          <stop offset="80%"  stopColor={t.rimColor}/>
          <stop offset="100%" stopColor={t.rimColor} stopOpacity="0.65"/>
        </linearGradient>
        <linearGradient id={uid+"rim"} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.8)"/>
          <stop offset="35%"  stopColor={t.rimColor}/>
          <stop offset="100%" stopColor="rgba(0,0,0,0.35)"/>
        </linearGradient>
        <radialGradient id={uid+"sh"} cx="36%" cy="26%" r="52%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.82)"/>
          <stop offset="55%"  stopColor="rgba(255,255,255,0.1)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
        </radialGradient>
        <radialGradient id={uid+"sd"} cx="68%" cy="74%" r="52%">
          <stop offset="0%"   stopColor="rgba(0,0,0,0.28)"/>
          <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
        </radialGradient>
      </defs>
      <path d={"M"+rl+",0 L"+(rl+rw)+",0 L"+(rl+rw)+","+(rh+4)+" L"+(rl+rw/2)+","+(rh+10)+" L"+rl+","+(rh+4)+" Z"} fill={"url(#"+uid+"rA)"}/>
      <path d={"M"+rr+",0 L"+(rr+rw)+",0 L"+(rr+rw)+","+(rh+4)+" L"+(rr+rw/2)+","+(rh+10)+" L"+rr+","+(rh+4)+" Z"} fill={"url(#"+uid+"rB)"}/>
      <line x1={rl+rw/2} y1="1" x2={rl+rw/2} y2={rh+3} stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
      <line x1={rr+rw/2} y1="1" x2={rr+rw/2} y2={rh+3} stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
      <circle cx={cx} cy={medalCY} r={r+rimW+1.8} fill="rgba(0,0,0,0.15)"/>
      <circle cx={cx} cy={medalCY} r={r+rimW} fill={"url(#"+uid+"rim)"}/>
      <circle cx={cx} cy={medalCY} r={r} fill={"url(#"+uid+"mg)"}/>
      <circle cx={cx} cy={medalCY} r={r} fill={"url(#"+uid+"sd)"}/>
      <circle cx={cx} cy={medalCY} r={r} fill={"url(#"+uid+"sh)"}/>
      <polygon points={starPts.join(" ")} fill="rgba(255,255,255,0.35)" stroke="rgba(255,255,255,0.18)" strokeWidth="0.5"/>
      <circle cx={cx} cy={medalCY} r={r-0.8} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.7"/>
    </svg>
  );
}

var TIERS = [
  { tier:1, label:"Bronze", sublabel:"Starter",         dotColor:"#cd7f32", rimColor:"#8b4513", ribbonA:"#c0392b", ribbonB:"#e74c3c" },
  { tier:2, label:"Silver", sublabel:"Getting there",   dotColor:"#c0c8d8", rimColor:"#64748b", ribbonA:"#3b5bdb", ribbonB:"#74a7f7" },
  { tier:3, label:"Gold",   sublabel:"Impressive",      dotColor:"#f5c518", rimColor:"#b8860b", ribbonA:"#e67e22", ribbonB:"#f5a623" },
  { tier:4, label:"Diamond",sublabel:"True dedication", dotColor:"#a8d8ff", rimColor:"#1d6fce", ribbonA:"#6a0dad", ribbonB:"#bf5fff" },
];

function BadgesTab({ dog, allDogs, setSelectedBadge }) {
  var C = useTheme();
  var [showLevelTiers, setShowLevelTiers] = useState(false);
  var badges = computeBadges(dog, allDogs);
  var earned = badges.filter(function(b){ return b.earned; });
  var locked = badges.filter(function(b){ return !b.earned; });


  // Per-tier earned counts for the summary bar
  var tierCounts = TIERS.map(function(t){
    var all = badges.filter(function(b){ return b.tier === t.tier; });
    var got = all.filter(function(b){ return b.earned; });
    return { tier:t.tier, label:t.label, dotColor:t.dotColor, earned:got.length, total:all.length };
  });

  // different badge levels
  function col2(hex) {
    // lighten a hex color slightly for gradient end
    try {
      var r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
      return "rgba("+Math.min(r+40,255)+","+Math.min(g+40,255)+","+Math.min(b+40,255)+",0.9)";
    } catch(e){ return hex; }
  }
  var USER_LEVELS = [
    { min:0,   max:4,   label:"Pup Parent",           icon:"🐾",  color:"#94a3b8", bg:"rgba(148,163,184,0.12)" },
    { min:5,   max:9,   label:"Devoted Carer",         icon:"🦴",  color:"#cd7f32", bg:"rgba(205,127,50,0.12)"  },
    { min:10,  max:19,  label:"Pack Initiate",         icon:"🐕",  color:"#60a5fa", bg:"rgba(96,165,250,0.12)"  },
    { min:20,  max:29,  label:"Trail Scout",           icon:"🌿",  color:"#52d484", bg:"rgba(82,212,132,0.12)"  },
    { min:30,  max:39,  label:"Alpha Handler",         icon:"🏅",  color:"#f5c518", bg:"rgba(245,197,24,0.12)"  },
    { min:40,  max:54,  label:"Pack Commander",        icon:"🔥",  color:"#f97316", bg:"rgba(249,115,22,0.12)"  },
    { min:55,  max:69,  label:"Elite Guardian",        icon:"⚔️",  color:"#a78bfa", bg:"rgba(167,139,250,0.12)" },
    { min:70,  max:84,  label:"Legend of the Pack",    icon:"💎",  color:"#a8d8ff", bg:"rgba(168,216,255,0.13)" },
    { min:85,  max:99,  label:"Apex Pack Master",      icon:"🌟",  color:"#f4a24d", bg:"rgba(244,162,77,0.14)"  },
    { min:100, max:999, label:"Ultimate Paw Sovereign", icon:"👑", color:"#fde68a", bg:"rgba(253,230,138,0.18)" },
  ];
  function getUserLevel(n) {
    for (var i = USER_LEVELS.length-1; i >= 0; i--) {
      if (n >= USER_LEVELS[i].min) return USER_LEVELS[i];
    }
    return USER_LEVELS[0];
  }
  var userLevel = getUserLevel(earned.length);
  var nextLevel = USER_LEVELS.find(function(l){ return l.min > earned.length; }) || null;
  var toNext = nextLevel ? nextLevel.min - earned.length : 0;
  var levelPct = nextLevel
    ? Math.round(((earned.length - userLevel.min) / (nextLevel.min - userLevel.min)) * 100)
    : 100;

  // modal that shows when you click a badge

  function BadgeCard(b, isEarned) {
    var col = BADGE_COLORS[b.color] || BADGE_COLORS.accent;
    if (isEarned) {
      return (
        <div key={b.id} className="fadeIn"
          onClick={function(){ setSelectedBadge(b); }}
          style={{ background:C.cardHov,border:"2px solid "+col[0],borderRadius:16,padding:"18px 14px",textAlign:"center",position:"relative",display:"flex",flexDirection:"column",alignItems:"center",cursor:"pointer",transition:"transform .15s,box-shadow .15s",boxShadow:"0 2px 12px "+col[1] }}
          onMouseEnter={function(e){ e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 8px 24px "+col[1]; }}
          onMouseLeave={function(e){ e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="0 2px 12px "+col[1]; }}>
          <div style={{ position:"absolute",top:7,left:8 }}>{MedalIcon(b.tier, 22, false)}</div>
          <div style={{ position:"absolute",top:8,right:8,fontSize:12 }}>&#x2728;</div>
          <div style={{ fontSize:34,marginTop:12,marginBottom:8 }}>{b.icon}</div>
          <p style={{ fontWeight:800,fontSize:16,color:col[0],marginBottom:4,lineHeight:1.3 }}>{b.name}</p>
          <p style={{ fontSize:14,color:C.text,lineHeight:1.5,fontWeight:500,opacity:.9 }}>{b.desc}</p>
          <p style={{ fontSize:15,color:col[0],marginTop:6,fontWeight:800 }}>Tap to view ›</p>
        </div>
      );
    }
    return (
      <div key={b.id} style={{ background:C.card,border:"1.5px solid "+C.border,borderRadius:16,padding:"18px 14px",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",position:"relative" }}>
        <div style={{ position:"absolute",top:7,left:8 }}>{MedalIcon(b.tier, 22, true)}</div>
        <div style={{ fontSize:34,marginTop:12,marginBottom:8,filter:"grayscale(0.7)",opacity:.55 }}>{b.icon}</div>
        <p style={{ fontWeight:800,fontSize:15,color:C.text,marginBottom:5,lineHeight:1.3,opacity:.8 }}>{b.name}</p>
        <p style={{ fontSize:13,color:C.text,lineHeight:1.5,fontWeight:500,opacity:.7 }}>{b.desc}</p>
      </div>
    );
  }

  return (
    <div className="fadeIn">

      {/* ── User Level Card ── */}
      <div onClick={function(){ setShowLevelTiers(true); }}
        style={{ background:"linear-gradient(135deg,"+userLevel.bg+" 0%,"+C.card+" 70%)",border:"2px solid "+userLevel.color,borderRadius:20,padding:22,marginBottom:16,cursor:"pointer",transition:"all .18s" }}
        onMouseEnter={function(e){ e.currentTarget.style.filter="brightness(1.06)"; e.currentTarget.style.transform="translateY(-1px)"; }}
        onMouseLeave={function(e){ e.currentTarget.style.filter=""; e.currentTarget.style.transform=""; }}>
        <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:14 }}>
          <div style={{ fontSize:44,lineHeight:1,filter:"drop-shadow(0 4px 12px rgba(0,0,0,0.25))" }}>{userLevel.icon}</div>
          <div style={{ flex:1 }}>
            <p style={{ fontSize:14,fontWeight:800,color:userLevel.color,textTransform:"uppercase",letterSpacing:".1em",marginBottom:4 }}>Badge Level</p>
            <p style={{ fontFamily:"Fraunces",fontSize:24,fontWeight:800,color:userLevel.color,lineHeight:1.1 }}>{userLevel.label}</p>
            {nextLevel
              ? <p style={{ color:C.muted,fontSize:15,fontWeight:600,marginTop:4 }}>{toNext+" badge"+(toNext!==1?"s":"")+" until "+nextLevel.label}</p>
              : <p style={{ color:userLevel.color,fontSize:15,fontWeight:700,marginTop:4 }}>Maximum level reached! 🎉</p>}
          </div>
          <div style={{ textAlign:"right",display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4 }}>
            <div style={{ textAlign:"center" }}>
              <p style={{ fontFamily:"Fraunces",fontSize:24,fontWeight:800,color:userLevel.color,lineHeight:1 }}>{earned.length}<span style={{ fontSize:24,color:C.muted,fontWeight:800 }}>/{badges.length}</span></p>
              <p style={{ fontSize:14,color:C.text,fontWeight:800,textTransform:"uppercase",letterSpacing:".08em",marginTop:4 }}>Badges</p>
            </div>
            <span style={{ fontSize:13,color:userLevel.color,fontWeight:800,background:userLevel.bg,border:"1.5px solid "+userLevel.color,borderRadius:99,padding:"5px 12px",whiteSpace:"nowrap",marginTop:16,display:"inline-block" }}>ALL TIERS ›</span>
          </div>
        </div>
        {/* Level progress bar */}
        <div style={{ background:C.border,borderRadius:999,height:10,overflow:"hidden",marginBottom:6 }}>
          <div style={{ background:"linear-gradient(90deg,"+userLevel.color+","+col2(userLevel.color)+")",width:levelPct+"%",height:"100%",borderRadius:999,transition:"width .7s ease" }} />
        </div>
        <div style={{ display:"flex",justifyContent:"space-between" }}>
          <p style={{ fontSize:13,color:userLevel.color,fontWeight:700 }}>{userLevel.label}</p>
          {nextLevel && <p style={{ fontSize:13,color:C.text,fontWeight:700 }}>{nextLevel.label}</p>}
        </div>
      </div>

      {/* ── Level Tiers Modal ── */}
      {showLevelTiers && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.82)",zIndex:99999,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"24px 16px",overflowY:"auto" }}
          onClick={function(){ setShowLevelTiers(false); }}>
          <div className="fadeIn" style={{ background:C.card,border:"1.5px solid "+C.border,borderRadius:22,padding:26,width:"100%",maxWidth:480 }}
            onClick={function(e){ e.stopPropagation(); }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6 }}>
              <h3 style={{ fontFamily:"Fraunces",fontSize:22,fontWeight:800,color:C.text }}>Badge Level Tiers</h3>
              <button className="btnI" onClick={function(){ setShowLevelTiers(false); }}>&#x2715;</button>
            </div>
            <p style={{ color:C.text,fontSize:15,fontWeight:500,marginBottom:20 }}>Earn badges to level up {dog.name}'s profile. {earned.length} of {badges.length} badges earned.</p>
            {USER_LEVELS.map(function(lvl, i) {
              var isCurrent = lvl.label === userLevel.label;
              var isUnlocked = earned.length >= lvl.min;
              var isNext = nextLevel && lvl.label === nextLevel.label;
              var pct = isCurrent
                ? (nextLevel ? Math.round(((earned.length - lvl.min) / (nextLevel.min - lvl.min)) * 100) : 100)
                : isUnlocked ? 100 : 0;
              return (
                <div key={i} style={{ background:isCurrent?"linear-gradient(135deg,"+lvl.bg+" 0%,"+C.bg+" 80%)":C.bg,border:"1.5px solid "+(isCurrent?lvl.color:isUnlocked?lvl.color:C.border),borderRadius:14,padding:"14px 16px",marginBottom:10,opacity:(!isUnlocked && !isNext)?0.65:1,transition:"all .18s" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                    <div style={{ fontSize:34,lineHeight:1,filter:isUnlocked?"drop-shadow(0 2px 8px rgba(0,0,0,0.3))":"grayscale(1)",opacity:isUnlocked?1:0.5,flexShrink:0 }}>{lvl.icon}</div>
                    <div style={{ flex:1,minWidth:0 }}>
                      <div style={{ display:"flex",alignItems:"center",gap:7,marginBottom:3,flexWrap:"wrap" }}>
                        <p style={{ fontFamily:"Fraunces",fontSize:18,fontWeight:800,color:isUnlocked?lvl.color:C.muted }}>{lvl.label}</p>
                        {isCurrent && <span style={{ fontSize:12,fontWeight:800,color:lvl.color,background:lvl.bg,border:"1px solid "+lvl.color,borderRadius:99,padding:"3px 10px" }}>Current</span>}
                        {isUnlocked && !isCurrent && <span style={{ fontSize:13,fontWeight:700,color:C.green }}>✓ Unlocked</span>}
                      </div>
                      <p style={{ fontSize:14,color:C.text,fontWeight:600,marginBottom:isCurrent&&nextLevel?6:0 }}>{lvl.min === 0 ? "Starting level — earn your first badges!" : "Requires "+lvl.min+" badges"+(lvl.max < 999 ? " · up to "+lvl.max+" badges" : "")}</p>
                      {isCurrent && nextLevel && (
                        <div>
                          <div style={{ background:C.border,borderRadius:999,height:7,overflow:"hidden",marginBottom:5 }}>
                            <div style={{ background:"linear-gradient(90deg,"+lvl.color+","+col2(lvl.color)+")",width:pct+"%",height:"100%",borderRadius:999,transition:"width .5s" }} />
                          </div>
                          <p style={{ fontSize:13,color:lvl.color,fontWeight:700 }}>{pct}% · {nextLevel.min - earned.length} more badge{nextLevel.min - earned.length !== 1 ? "s" : ""} to reach {nextLevel.label}</p>
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign:"right",flexShrink:0 }}>
                      <p style={{ fontFamily:"Fraunces",fontSize:22,fontWeight:800,color:isUnlocked?lvl.color:C.muted }}>{lvl.min}</p>
                      <p style={{ fontSize:12,color:C.muted,fontWeight:700 }}>badges</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Header progress card ── */}
      <div style={{ background:C.card,border:"1.5px solid "+C.border,borderRadius:18,padding:18,marginBottom:20 }}>
        <p style={{ fontSize:13,fontWeight:800,color:C.text,textTransform:"uppercase",letterSpacing:".07em",marginBottom:12 }}>Tier Breakdown</p>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8 }}>
          {tierCounts.map(function(t){
            var active = t.earned > 0;
            return (
              <div key={t.tier} style={{ background:C.bg,borderRadius:12,padding:"10px 8px",textAlign:"center",border:"1.5px solid "+(active?t.dotColor:C.border) }}>
                <div style={{ display:"flex",justifyContent:"center",marginBottom:4 }}>{MedalIcon(t.tier, 28, !active)}</div>
                <p style={{ fontSize:18,fontWeight:800,color:active?t.dotColor:C.muted }}>{t.earned}<span style={{ fontSize:13,color:C.muted,fontWeight:600 }}>/{t.total}</span></p>
                <p style={{ fontSize:13,color:active?t.dotColor:C.text,fontWeight:800,textTransform:"uppercase",letterSpacing:".04em",marginTop:2 }}>{t.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Earned section ── */}
      {earned.length > 0 && (
        <div style={{ marginBottom:26 }}>
          <p className="sectionLabel" style={{ color:C.accent }}>Earned &#x2713; ({earned.length}) — tap any badge for details</p>
          {TIERS.map(function(t){
            var group = earned.filter(function(b){ return b.tier === t.tier; });
            if (!group.length) return null;
            return (
              <div key={t.tier} style={{ marginBottom:18 }}>
                <div style={{ display:"flex",alignItems:"center",gap:7,marginBottom:8 }}>
                  {MedalIcon(t.tier, 18, false)}
                  <span style={{ fontSize:15,fontWeight:800,color:t.dotColor,textTransform:"uppercase",letterSpacing:".07em" }}>{t.label}</span>
                  <span style={{ fontSize:14,color:C.text,fontWeight:600 }}>— {t.sublabel}</span>
                </div>
                <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10 }}>
                  {group.map(function(b){ return BadgeCard(b, true); })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Locked section ── */}
      {locked.length > 0 && (
        <div>
          <p className="sectionLabel">Still to Unlock ({locked.length})</p>
          {TIERS.map(function(t){
            var group = locked.filter(function(b){ return b.tier === t.tier; });
            if (!group.length) return null;
            return (
              <div key={t.tier} style={{ marginBottom:18 }}>
                <div style={{ display:"flex",alignItems:"center",gap:7,marginBottom:8 }}>
                  {MedalIcon(t.tier, 18, true)}
                  <span style={{ fontSize:15,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:".07em" }}>{t.label}</span>
                  <span style={{ fontSize:14,color:C.text,fontWeight:600 }}>— {t.sublabel}</span>
                </div>
                <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10 }}>
                  {group.map(function(b){ return BadgeCard(b, false); })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {earned.length === 0 && (
        <EmptyState icon="🎖️" title="No badges yet" sub={"Start logging meals, outdoor trips, and health records to earn "+dog.name+"'s first badge!"} />
      )}
    </div>
  );
}

// individual dog profile page
// individual dog profile page
function DogDetail({ dog, onUpdate, onDelete, allDogs, onEdit, activeTab, setActiveTab, focusedSection, setFocusedSection, setSelectedBadge, earnTP, setCooldownAlert }) {
  var C = useTheme();
  var [tipPage, setTipPage] = useState(0);
  var tabBarRef = useRef(null);
  var [confirmDialog, setConfirmDialog] = useState({ show: false, title: "", message: "", onConfirm: null });

  useEffect(function() {
    setTipPage(0);
  }, [dog.id]);

  // Auto-update age based on DOB every day
  useEffect(function() {
    function updateAge() {
      // If DOB is deleted/empty, clear the age
      if (!dog.dob) {
        if (dog.age) {
          onUpdate(Object.assign({}, dog, { age: "" }));
        }
        return;
      }
      
      // Calculate age from DOB
      var birthDate = new Date(dog.dob);
      var today = new Date();
      var ageYears = (today - birthDate) / (365.25 * 24 * 60 * 60 * 1000);
      var calculatedAge = Math.max(0, ageYears).toFixed(1);
      
      // Only update if age has changed by at least 0.1 years
      if (Math.abs(parseFloat(dog.age || 0) - parseFloat(calculatedAge)) >= 0.1) {
        onUpdate(Object.assign({}, dog, { age: calculatedAge }));
      }
    }
    
    updateAge();
    // Check daily for age updates
    var interval = setInterval(updateAge, 24 * 60 * 60 * 1000);
    return function() { clearInterval(interval); };
  }, [dog.dob, dog.age]); // Watch both dob and age

  // Scroll the active tab button into view whenever activeTab changes
  useEffect(function() {
    if (!tabBarRef.current) return;
    var active = tabBarRef.current.querySelector("[data-active='true']");
    if (active) {
      // Manually scroll within the container instead of using scrollIntoView
      var container = tabBarRef.current;
      var activeLeft = active.offsetLeft;
      var activeWidth = active.offsetWidth;
      var containerWidth = container.offsetWidth;
      
      // Calculate the position to center the active button
      var scrollTo = activeLeft - (containerWidth / 2) + (activeWidth / 2);
      
      // Use instant scroll to prevent skipping
      container.scrollLeft = scrollTo;
    }
  }, [activeTab]);
  var cat = getDogCat(dog);
  var heat = dog.gender === "female" ? getHeatStatus(dog) : null;
  var feeding = FEED_SCHED[cat];
  var outside = OUT_SCHED[parseFloat(dog.age)<1 ? "puppy" : parseFloat(dog.age)>=8 ? "senior" : "adult"];
  var foods = FOOD_RECS[cat] || FOOD_RECS.adult_medium;
  var nextAppt = (dog.vetAppointments||[]).filter(function(a){ return daysUntil(a.date)>=0; }).sort(function(a,b){ return parseLocalDate(a.date) - parseLocalDate(b.date); })[0];
  var ovVax = (dog.vaccines||[]).filter(function(v){ return v.nextDate && isOverdue(v.nextDate); });
  var soonVax = (dog.vaccines||[]).filter(function(v){ return v.nextDate && !isOverdue(v.nextDate) && isDueSoon(v.nextDate,30); });
  var activeMeds = (dog.medications||[]).filter(function(m){ return m.active; });
  
  // Auto-focus tab bar on mount for keyboard navigation
  useEffect(function() {
    if (tabBarRef.current) {
      tabBarRef.current.focus();
    }
  }, []);

  // Build TABS array - Heat tab only for female dogs
  var TABS = [
    { id:"overview", icon:"🏠", lbl:"Overview" },
    { id:"schedule", icon:"🗓", lbl:"Schedule" },
    { id:"food", icon:"🍽", lbl:"Food" },
    { id:"vet", icon:"🩺", lbl:"Vet" },
    { id:"vaccines", icon:"💉", lbl:"Vaccines" },
    { id:"meds", icon:"💊", lbl:"Meds" },
    { id:"weight", icon:"⚖️", lbl:"Weight" },
  ];
  
  // Add Heat tab only for female dogs
  if (dog.gender === "female") {
    TABS.push({ id:"heat", icon:"🌸", lbl:"Heat" });
  }
  
  TABS.push({ id:"log", icon:"📋", lbl:"Activity Log" });
  TABS.push({ id:"badges", icon:"🏆", lbl:"Badges" });

  return (
    <div className="fadeIn" data-dogdetail="true">
      <div style={{ display:"flex",alignItems:"center",gap:16,marginBottom:20,paddingBottom:20,borderBottom:"1px solid "+C.border }}>
        <div style={{ fontSize:50,background:C.accentFaint,borderRadius:18,width:74,height:74,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:"1.5px solid "+C.border,overflow:"hidden" }}>
          {dog.photo
            ? <img src={dog.photo} alt={dog.name} style={{ width:"100%",height:"100%",objectFit:"cover" }} />
            : dog.emoji}
        </div>
        <div style={{ flex:1,minWidth:0 }}>
          <h2 style={{ fontFamily:"Fraunces",fontSize:28,fontWeight:700,color:C.text,marginBottom:2 }}><span style={{ marginRight:6 }}>&#x1F43E;</span>{dog.name}<span style={{ marginLeft:6 }}>&#x1F43E;</span></h2>
          <p style={{ color:C.muted,fontSize:16 }}>{dog.breed} · {dog.age||"?"} yrs · {dog.weight||"?"} lbs · {dog.gender==="female"?"Female":"Male"}{dog.dob ? " · Born "+fmtDate(dog.dob) : ""}</p>
          <div style={{ display:"flex",gap:6,marginTop:6,flexWrap:"wrap" }}>
            <Chip color="accent" extraStyle={{ fontSize:15,padding:"5px 14px",fontWeight:700 }}>{cat.replace(/_/g," ").replace(/\b\w/g,function(c){return c.toUpperCase();})}</Chip>
            {heat && heat.inHeat && <span style={{ display:"inline-flex",alignItems:"center",padding:"4px 12px",borderRadius:99,fontSize:14,fontWeight:800,background:C.pinkFaint,color:C.pink }}>{"🌸 In Heat · Day "+heat.heatDay}</span>}
            {heat && heat.upcoming && <Chip color="yellow">{"Heat in "+heat.daysUntilNext+"d"}</Chip>}
            {ovVax.length>0 && <Chip color="red">{ovVax.length+" Vaccine Overdue"}</Chip>}
            {soonVax.length>0 && <Chip color="yellow">Vaccine Due Soon</Chip>}
            {activeMeds.length>0 && <Chip color="purple">{activeMeds.length+" Med"+(activeMeds.length>1?"s":"")}</Chip>}
            {nextAppt && <Chip color="blue">{"Vet Appt "+fmtDate(nextAppt.date)}</Chip>}
            {(function(){ var earned = computeBadges(dog, allDogs||[]).filter(function(b){ return b.earned; }).length; return earned > 0 ? <span style={{ display:"inline-flex",alignItems:"center",gap:4,padding:"4px 12px",borderRadius:99,fontSize:14,fontWeight:800,background:C.accentFaint,color:C.accent }}>{"🏆 "+earned+" Badge"+(earned!==1?"s":"")}</span> : null; })()}
          </div>
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:7,flexShrink:0 }}>
          <button className="btnG" style={{ fontSize:12 }} onClick={onEdit}>Edit</button>
          <button className="btnD" onClick={function(){ if(window.confirm("Delete "+dog.name+"?")) onDelete(dog.id); }}>Delete</button>
        </div>
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20 }}>
        <button onClick={function(){
          var cooldownTimestamps = dog.cooldownTimestamps || {};
          var lastFedCooldown = cooldownTimestamps.fed;
          var fedCooldownMs = getFedCooldown(dog);
          var fedCooldown = isOnCooldown(lastFedCooldown, fedCooldownMs);
          
          if (fedCooldown) {
            var remaining = getCooldownRemaining(lastFedCooldown, fedCooldownMs);
            setCooldownAlert({
              show: true,
              message: "You recently fed " + dog.name + "! To prevent rapid logging and ensure accurate tracking, please wait before marking them as fed again.",
              remaining: formatCooldown(remaining)
            });
            return;
          }
          
          var ts = new Date().toISOString();
          var entry = { id: String(Date.now()), type:"fed", timestamp: ts };
          var log = (dog.activityLog || []).concat([entry]);
          var updatedCooldowns = Object.assign({}, cooldownTimestamps, { fed: ts });
          onUpdate(Object.assign({},dog,{ lastFed: ts, activityLog: log, cooldownTimestamps: updatedCooldowns }));
          if (earnTP) earnTP(TP_VALUES.fed, "Fed "+dog.name);
        }}
          style={{ background:C.greenFaint,border:"1.5px solid "+C.green,color:C.isDark?C.green:"#1a1814",borderRadius:12,padding:"12px 16px",textAlign:"left",cursor:"pointer",transition:"all .18s" }}
          onMouseEnter={function(e){e.currentTarget.style.background="rgba(82,212,132,.18)";}}
          onMouseLeave={function(e){e.currentTarget.style.background=C.greenFaint;}}>
          <div style={{ fontSize:20 }}>🍽️</div>
          <div style={{ fontWeight:600,fontSize:14,marginTop:4 }}>Mark as Fed</div>
          <div style={{ fontSize:13,color:C.green,marginTop:2,fontWeight:600 }}>{"Last: "+timeAgo(dog.lastFed)}</div>
          <div style={{ fontSize:11,color:C.muted,marginTop:1 }}>{getCooldownLabel(dog)+" · every "+(getFedCooldown(dog)/3600000)+"h"}</div>
        </button>
        <button onClick={function(){
          var cooldownTimestamps = dog.cooldownTimestamps || {};
          var lastOutsideCooldown = cooldownTimestamps.outside;
          var outCooldownMs = getOutsideCooldown(dog);
          var outCooldown = isOnCooldown(lastOutsideCooldown, outCooldownMs);
          
          if (outCooldown) {
            var remaining = getCooldownRemaining(lastOutsideCooldown, outCooldownMs);
            setCooldownAlert({
              show: true,
              message: "You recently took " + dog.name + " outside! To prevent rapid logging and ensure accurate tracking, please wait before marking them as outside again.",
              remaining: formatCooldown(remaining)
            });
            return;
          }
          
          var ts = new Date().toISOString();
          var entry = { id: String(Date.now()), type:"outside", timestamp: ts };
          var log = (dog.activityLog || []).concat([entry]);
          var updatedCooldowns = Object.assign({}, cooldownTimestamps, { outside: ts });
          onUpdate(Object.assign({},dog,{ lastOutside: ts, activityLog: log, cooldownTimestamps: updatedCooldowns }));
          if (earnTP) earnTP(TP_VALUES.outside, "Took "+dog.name+" outside");
        }}
          style={{ background:C.blueFaint,border:"1.5px solid "+C.blue,color:C.isDark?C.blue:"#1a1814",borderRadius:12,padding:"12px 16px",textAlign:"left",cursor:"pointer",transition:"all .18s" }}
          onMouseEnter={function(e){e.currentTarget.style.background="rgba(96,165,250,.18)";}}
          onMouseLeave={function(e){e.currentTarget.style.background=C.blueFaint;}}>
          <div style={{ fontSize:20 }}>🌳</div>
          <div style={{ fontWeight:600,fontSize:14,marginTop:4 }}>Taken Outside</div>
          <div style={{ fontSize:13,color:C.blue,marginTop:2,fontWeight:600 }}>{"Last: "+timeAgo(dog.lastOutside)}</div>
          <div style={{ fontSize:11,color:C.muted,marginTop:1 }}>{getCooldownLabel(dog)+" · every "+(getOutsideCooldown(dog)/3600000)+"h"}</div>
        </button>
      </div>

      {/* Documents Section - Standalone */}
      <div style={{ background:C.card,border:"1.5px solid "+C.border,borderRadius:16,padding:20,marginBottom:20 }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16 }}>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <div style={{ fontSize:28 }}>📄</div>
            <div>
              <h3 style={{ fontFamily:"Fraunces",fontSize:20,color:C.text,fontWeight:800,marginBottom:2 }}>Documents</h3>
              <p style={{ color:C.muted,fontSize:14 }}>Vet records, certificates, insurance & more</p>
            </div>
          </div>
          <div style={{ background:C.accentFaint,border:"1.5px solid "+C.accent,borderRadius:10,padding:"8px 16px" }}>
            <span style={{ fontSize:14,color:C.accent,fontWeight:700 }}>
              {(dog.documents || []).length} {(dog.documents || []).length === 1 ? "File" : "Files"}
            </span>
          </div>
        </div>
        
        <button onClick={function(){ setActiveTab("documents"); }}
          style={{ width:"100%",background:C.accent,color:"#fff",border:"none",borderRadius:12,padding:"14px 20px",fontSize:15,fontWeight:700,cursor:"pointer",transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center",gap:10 }}
          onMouseEnter={function(e){ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 6px 20px "+C.accentGlow; }}
          onMouseLeave={function(e){ e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}>
          <span style={{ fontSize:18 }}>📂</span>
          <span>Manage Documents</span>
        </button>
      </div>

      <div ref={tabBarRef}
        className="tabBarContainer"
        style={{ display:"flex",gap:2,marginBottom:20,background:C.bg,borderRadius:13,padding:4,overflowX:"auto",border:"1.5px solid "+C.border,scrollbarWidth:"none",msOverflowStyle:"none",WebkitOverflowScrolling:"touch",position:"relative" }}>
        {TABS.map(function(t) {
          var isActive = activeTab===t.id;
          return (
            <button key={t.id} type="button"
              onClick={function(){ setActiveTab(t.id); }}
              style={{ background:isActive?C.card:"transparent",color:isActive?C.text:C.muted,border:isActive?"1.5px solid "+C.border:"1.5px solid transparent",borderRadius:9,padding:"12px 18px",fontSize:15,fontWeight:isActive?800:700,whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:7,transition:"all .15s",cursor:"pointer",userSelect:"none",outline:"none" }}
              onMouseEnter={function(e){ if(!isActive) e.currentTarget.style.background=C.isDark?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.05)"; }}
              onMouseLeave={function(e){ if(!isActive) e.currentTarget.style.background="transparent"; }}>
              <span style={{ fontSize:18 }}>{t.icon}</span>
              <span style={{ fontWeight:isActive?800:700 }}>{t.lbl}</span>
            </button>
          );
        })}
      </div>

      {activeTab === "overview" && (
        <div className="fadeIn">
          <div style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginBottom:16 }}>
            {[
              { icon:"🩺", lbl:"Next Vet Appt", val: nextAppt ? fmtDate(nextAppt.date)+"\n"+nextAppt.reason : "None scheduled", col: C.blue },
              { icon:"💉", lbl:"Vaccine Status", val: ovVax.length>0 ? ovVax.length+" Overdue" : soonVax.length>0 ? soonVax.length+" Due Soon" : (dog.vaccines||[]).length>0 ? "All Current" : "No records", col: ovVax.length>0?C.red:soonVax.length>0?C.yellow:C.green },
              { icon:"💊", lbl:"Active Meds", val: activeMeds.length>0 ? activeMeds.map(function(m){return m.name;}).join(", ") : "None", col: C.purple },
              { icon:"⚖️", lbl:"Current Weight", val: dog.weight ? dog.weight+" lbs" : "Not logged", col: C.accent },
            ].map(function(s) {
              return (
                <div key={s.lbl} style={{ background:C.card,border:"1px solid "+C.accent,borderRadius:14,padding:16 }}>
                  <div style={{ display:"flex",gap:10,alignItems:"flex-start" }}>
                    <span style={{ fontSize:26 }}>{s.icon}</span>
                    <div>
                      <p style={{ fontSize:12,color:C.muted,fontWeight:700,marginBottom:5,textTransform:"uppercase",letterSpacing:".04em" }}>{s.lbl}</p>
                      <p style={{ fontSize:16,color:s.col,fontWeight:700,whiteSpace:"pre-line",lineHeight:1.4 }}>{s.val}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {dog.notes && (
            <div style={{ background:C.bg,border:"1.5px solid "+C.border,borderRadius:12,padding:14,marginBottom:16 }}>
              <p style={{ fontSize:11,color:C.muted,fontWeight:600,marginBottom:5 }}>NOTES</p>
              <p style={{ fontSize:13,color:C.text,lineHeight:1.6 }}>{dog.notes}</p>
            </div>
          )}
          <div>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
              <p className="sectionLabel" style={{ marginBottom:0 }}>General Care Tips</p>
              <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                <span style={{ fontSize:11,color:C.muted }}>{(tipPage*4+1)+"-"+Math.min(tipPage*4+4,CARE_TIPS.length)+" of "+CARE_TIPS.length}</span>
                <button className="btnI" onClick={function(){ setTipPage(function(p){ return p>0?p-1:Math.ceil(CARE_TIPS.length/4)-1; }); }} title="Previous tips">&#8249;</button>
                <button className="btnI" onClick={function(){ setTipPage(function(p){ return (p+1)*4<CARE_TIPS.length?p+1:0; }); }} title="Next tips">&#8250;</button>
              </div>
            </div>
            {CARE_TIPS.slice(tipPage*4, tipPage*4+4).map(function(t, i) {
              return (
                <div key={i} style={{ background:C.card,border:"1px solid "+C.accent,borderLeft:"2px solid "+C.accent,borderRadius:12,padding:"14px 18px",marginBottom:10,display:"flex",alignItems:"flex-start",gap:12 }}>
                  <span style={{ fontSize:20,flexShrink:0,marginTop:1 }}>🐾</span>
                  <p style={{ fontSize:15,fontWeight:600,color:C.text,lineHeight:1.65,margin:0 }}>{t}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "schedule" && (
        <div className="fadeIn">
          <div style={{ marginBottom:20 }}>
            <p className="sectionLabel" style={{ color:C.green }}>Feeding Schedule</p>
            <div style={{ background:C.card,border:"1px solid "+C.accent,borderRadius:14,padding:16 }}>
              <p style={{ color:C.text,fontSize:15,fontWeight:500,marginBottom:14 }}>{feeding.note}</p>
              <div style={{ display:"flex",flexWrap:"wrap",gap:8,marginBottom:14 }}>
                {feeding.times.map(function(t) {
                  // Parse feed time into today's date
                  var now = new Date();
                  var parts = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
                  var feedTime = null;
                  if (parts) {
                    var h = parseInt(parts[1]); var m = parseInt(parts[2]); var ampm = parts[3].toUpperCase();
                    if (ampm === "PM" && h !== 12) h += 12;
                    if (ampm === "AM" && h === 12) h = 0;
                    feedTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
                  }
                  var minsUntil = feedTime ? Math.round((feedTime - now) / 60000) : null;
                  var tColor, tBg, tBorder, statusLabel;
                  if (minsUntil === null) {
                    tColor = C.green; tBg = C.greenFaint; tBorder = C.green; statusLabel = null;
                  } else if (minsUntil > 60) {
                    tColor = C.green; tBg = C.greenFaint; tBorder = C.green;
                    statusLabel = "in " + Math.floor(minsUntil/60) + "h " + (minsUntil%60) + "m";
                  } else if (minsUntil > 0) {
                    tColor = C.yellow; tBg = C.yellowFaint; tBorder = C.yellow;
                    statusLabel = minsUntil < 60 ? "in " + minsUntil + "m" : "in 1h";
                  } else if (minsUntil > -60) {
                    tColor = C.red; tBg = C.redFaint; tBorder = C.red;
                    statusLabel = Math.abs(minsUntil) + "m ago";
                  } else {
                    tColor = C.muted; tBg = "transparent"; tBorder = C.border;
                    statusLabel = Math.floor(Math.abs(minsUntil)/60) + "h ago";
                  }
                  return (
                    <div key={t} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:4 }}>
                      <div style={{ background:tBg,border:"1.5px solid "+tBorder,borderRadius:9,padding:"10px 18px",color:tColor,fontSize:15,fontWeight:700,transition:"all .3s" }}>{t}</div>
                      {statusLabel && <span style={{ fontSize:12,color:tColor,fontWeight:600 }}>{statusLabel}</span>}
                    </div>
                  );
                })}
              </div>
              <div style={{ display:"flex",gap:14,flexWrap:"wrap",marginBottom:12 }}>
                {[
                  { col:C.green, bg:C.greenFaint, label:"On schedule (>1h away)" },
                  { col:C.yellow, bg:C.yellowFaint, label:"Coming up soon" },
                  { col:C.red, bg:C.redFaint, label:"Overdue" },
                  { col:C.muted, bg:"transparent", label:"Already passed" },
                ].map(function(k) {
                  return (
                    <div key={k.label} style={{ display:"flex",alignItems:"center",gap:7 }}>
                      <div style={{ width:12,height:12,borderRadius:"50%",background:k.col,flexShrink:0 }} />
                      <span style={{ fontSize:14,color:k.col,fontWeight:600 }}>{k.label}</span>
                    </div>
                  );
                })}
              </div>
              <p style={{ color:C.text,fontSize:15,fontWeight:500 }}>Recommended: <strong style={{ color:C.accent,fontWeight:700 }}>{feeding.cups+" cup(s)"}</strong> per meal &middot; <strong style={{ color:C.accent,fontWeight:700 }}>{feeding.times.length}</strong> meals/day</p>
            </div>
          </div>
          <div>
            <p className="sectionLabel" style={{ color:C.blue }}>Outdoor Breaks</p>
            <div style={{ background:C.card,border:"1px solid "+C.accent,borderRadius:14,padding:16 }}>
              <div style={{ display:"flex",flexWrap:"wrap",gap:8,marginBottom:14 }}>
                {outside.map(function(t) {
                  return <div key={t} style={{ background:C.blueFaint,border:"1px solid "+C.blue,borderRadius:9,padding:"10px 18px",color:C.blue,fontSize:15,fontWeight:700 }}>{t}</div>;
                })}
              </div>
              <p style={{ color:C.text,fontSize:15,fontWeight:500 }}><strong style={{ color:C.accent,fontWeight:700 }}>{outside.length}</strong> recommended outings daily</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "food" && (
        <div className="fadeIn">
          <p style={{ color:C.muted,fontSize:13,marginBottom:14 }}>Top picks for a <strong style={{ color:C.text }}>{cat.replace(/_/g," ")}</strong> like {dog.name}:</p>
          {foods.map(function(food, i) {
            return (
              <div key={i} style={{ background:C.card,border:"1px solid "+C.accent,borderRadius:14,padding:16,marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center",gap:12 }}>
                <div>
                  <p style={{ fontWeight:700,fontSize:15,color:C.text,marginBottom:6 }}>{food.name}</p>
                  <p style={{ color:C.muted,fontSize:15,lineHeight:1.6 }}>{food.note}</p>
                </div>
                <div style={{ textAlign:"right",flexShrink:0 }}>
                  <Chip color="accent">{"★ "+food.rating}</Chip>
                  <p style={{ color:C.muted,fontSize:13,marginTop:5,fontWeight:600 }}>{food.type}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "vet" && <VetTab dog={dog} onUpdate={onUpdate} earnTP={earnTP} />}
      {activeTab === "vaccines" && <VaxTab dog={dog} onUpdate={onUpdate} earnTP={earnTP} />}
      {activeTab === "meds" && <MedsTab dog={dog} onUpdate={onUpdate} earnTP={earnTP} setCooldownAlert={setCooldownAlert} />}
      {activeTab === "weight" && <WeightTab dog={dog} onUpdate={onUpdate} earnTP={earnTP} setCooldownAlert={setCooldownAlert} />}
      {activeTab === "heat" && <HeatTab dog={dog} onUpdate={onUpdate} earnTP={earnTP} />}

      {activeTab === "log" && (
        <div className="fadeIn">
          {(function() {
            var log = (dog.activityLog || []).slice().sort(function(a,b){ return new Date(b.timestamp)-new Date(a.timestamp); });
            if (log.length === 0) {
              return <EmptyState icon="📋" title="No activity logged yet" sub={"Use the Mark as Fed and Taken Outside buttons above to start building a log for "+dog.name+"."} />;
            }

            // Group by day
            var groups = [];
            var groupMap = {};
            log.forEach(function(entry) {
              var day = fmtDayLabel(entry.timestamp);
              if (!groupMap[day]) { groupMap[day] = []; groups.push(day); }
              groupMap[day].push(entry);
            });

            // Summary counts today
            var today = new Date().toDateString();
            var todayFed = log.filter(function(e){ return e.type==="fed" && new Date(e.timestamp).toDateString()===today; }).length;
            var todayOut = log.filter(function(e){ return e.type==="outside" && new Date(e.timestamp).toDateString()===today; }).length;

            return (
              <div>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:20 }}>
                  <div style={{ background:C.card,border:"1px solid "+C.accent,borderRadius:14,padding:16,textAlign:"center" }}>
                    <div style={{ fontSize:28,marginBottom:6 }}>🍽️</div>
                    <p style={{ fontSize:26,fontWeight:800,color:C.green }}>{todayFed}</p>
                    <p style={{ fontSize:14,color:C.muted,fontWeight:700,marginTop:2 }}>Fed Today</p>
                  </div>
                  <div style={{ background:C.card,border:"1px solid "+C.accent,borderRadius:14,padding:16,textAlign:"center" }}>
                    <div style={{ fontSize:28,marginBottom:6 }}>🌳</div>
                    <p style={{ fontSize:26,fontWeight:800,color:C.blue }}>{todayOut}</p>
                    <p style={{ fontSize:14,color:C.muted,fontWeight:700,marginTop:2 }}>Outside Today</p>
                  </div>
                  <div style={{ background:C.card,border:"1px solid "+C.accent,borderRadius:14,padding:16,textAlign:"center" }}>
                    <div style={{ fontSize:28,marginBottom:6 }}>📋</div>
                    <p style={{ fontSize:26,fontWeight:800,color:C.accent }}>{log.length}</p>
                    <p style={{ fontSize:14,color:C.muted,fontWeight:700,marginTop:2 }}>Total Entries</p>
                  </div>
                </div>

                <div style={{ display:"flex",justifyContent:"flex-end",marginBottom:14 }}>
                  <button type="button" style={{ background:C.redFaint,border:"2px solid "+C.red,color:C.red,borderRadius:10,padding:"10px 20px",fontSize:14,fontWeight:700,cursor:"pointer",transition:"all .18s" }}
                    onMouseEnter={function(e){e.currentTarget.style.background=C.red;e.currentTarget.style.color="#fff";}}
                    onMouseLeave={function(e){e.currentTarget.style.background=C.redFaint;e.currentTarget.style.color=C.red;}}
                    onClick={function(){
                      setConfirmDialog({
                        show: true,
                        title: "Clear All Logs?",
                        message: "Are you sure you want to clear all activity log entries for " + dog.name + "?\n\nThis will permanently delete all " + log.length + " log entries.\n\nThis action cannot be undone.",
                        onConfirm: function() {
                          onUpdate(Object.assign({},dog,{activityLog:[]}));
                          setConfirmDialog({ show: false, title: "", message: "", onConfirm: null });
                        }
                      });
                    }}>&#x1F5D1; Clear All Logs</button>
                </div>

                {groups.map(function(day) {
                  var entries = groupMap[day];
                  return (
                    <div key={day} style={{ marginBottom:20 }}>
                      <p className="sectionLabel">{day}</p>
                      <div style={{ background:C.card,border:"1px solid "+C.accent,borderRadius:14,overflow:"hidden" }}>
                        {entries.map(function(entry, idx) {
                          var isFed = entry.type === "fed";
                          var color = isFed ? C.green : C.blue;
                          var faintBg = isFed ? C.greenFaint : C.blueFaint;
                          var icon = isFed ? "🍽️" : "🌳";
                          var label = isFed ? "Fed" : "Taken Outside";
                          var time = new Date(entry.timestamp).toLocaleTimeString("en-US", { hour:"numeric", minute:"2-digit", hour12:true });
                          var isLast = idx === entries.length - 1;
                          return (
                            <div key={entry.id} style={{ display:"flex",alignItems:"center",gap:14,padding:"14px 16px",borderBottom:isLast?"none":"1px solid "+C.border,background:"transparent" }}>
                              <div style={{ width:40,height:40,borderRadius:10,background:faintBg,border:"1px solid "+color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>{icon}</div>
                              <div style={{ flex:1 }}>
                                <p style={{ fontWeight:700,fontSize:15,color:C.text }}>{label}</p>
                                <p style={{ fontSize:13,color:C.muted,marginTop:3,fontWeight:500 }}>{fmtTimestamp(entry.timestamp)}</p>
                              </div>
                              <div style={{ textAlign:"right",flexShrink:0 }}>
                                <span style={{ background:faintBg,color:color,fontSize:15,fontWeight:800,padding:"6px 13px",borderRadius:8 }}>{time}</span>
                              </div>
                              <button className="btnI" style={{ flexShrink:0 }} onClick={function(){
                                setConfirmDialog({
                                  show: true,
                                  title: "Delete Log Entry?",
                                  message: "Are you sure you want to delete this " + label.toLowerCase() + " entry?\n\n" + fmtTimestamp(entry.timestamp) + "\n\nThis action cannot be undone.",
                                  onConfirm: function() {
                                    onUpdate(Object.assign({},dog,{ activityLog:(dog.activityLog||[]).filter(function(e){ return e.id!==entry.id; }) }));
                                    setConfirmDialog({ show: false, title: "", message: "", onConfirm: null });
                                  }
                                });
                              }}>&#x1F5D1;</button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {activeTab === "badges" && <BadgesTab dog={dog} allDogs={allDogs} setSelectedBadge={setSelectedBadge} />}

      {activeTab === "documents" && <DocumentsTab dog={dog} onUpdate={onUpdate} onBack={function(){ setActiveTab("overview"); }} />}

      {/* Confirm Dialog */}
      <ConfirmDialog
        show={confirmDialog.show}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={function(){ setConfirmDialog({ show: false, title: "", message: "", onConfirm: null }); }}
      />

    </div>
  );
}

// trainer / activity section
function TrainerView({ user, dogs, onShowRankTiers }) {
  var C = useTheme();
  var tp = user.trainerPoints || 0;
  var uLvl = getTrainerRank(tp);
  var nxtLvl = TRAINER_RANKS.find(function(l){ return l.min > tp; }) || null;
  var toNxt = nxtLvl ? nxtLvl.min - tp : 0;
  var pct = nxtLvl ? Math.round(((tp - uLvl.min) / (nxtLvl.min - uLvl.min)) * 100) : 100;
  var recentLog = (user.tpLog || []).slice(-8).reverse();

  // Per-dog badge counts
  var dogBadges = dogs.map(function(d){
    var b = computeBadges(d, dogs);
    return { dog:d, earned:b.filter(function(x){ return x.earned; }).length, total:b.length };
  });
  var totalEarned = dogBadges.reduce(function(s,x){ return s+x.earned; }, 0);
  var totalPossible = dogBadges.reduce(function(s,x){ return s+x.total; }, 0);

  // Next 3 upcoming tiers
  var upcoming = TRAINER_RANKS.filter(function(r){ return r.min > tp; }).slice(0,3);

  return (
    <div className="fadeIn" style={{ maxWidth:700,margin:"0 auto" }}>
      <div style={{ marginBottom:24 }}>
        <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:4 }}>
          <svg width="56" height="72" viewBox="0 0 56 72" fill="none" xmlns="http://www.w3.org/2000/svg"
            style={{ flexShrink:0, filter:"drop-shadow(0 6px 22px rgba(244,162,77,0.7)) drop-shadow(0 2px 6px rgba(0,0,0,0.4))" }}>
            <defs>
              {/* Ribbon stripe gradients */}
              <linearGradient id="hp-r1" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#c0392b"/>
                <stop offset="50%" stopColor="#e74c3c"/>
                <stop offset="100%" stopColor="#c0392b"/>
              </linearGradient>
              <linearGradient id="hp-r2" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#e8c84a"/>
                <stop offset="50%" stopColor="#fde68a"/>
                <stop offset="100%" stopColor="#e8c84a"/>
              </linearGradient>
              <linearGradient id="hp-r3" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#1a56c4"/>
                <stop offset="50%" stopColor="#4a90e2"/>
                <stop offset="100%" stopColor="#1a56c4"/>
              </linearGradient>
              {/* Clasp gradient */}
              <linearGradient id="hp-clasp" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fde68a"/>
                <stop offset="40%" stopColor="#f5c518"/>
                <stop offset="100%" stopColor="#92650a"/>
              </linearGradient>
              {/* Outer rim */}
              <linearGradient id="hp-rim" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fff9c4"/>
                <stop offset="30%" stopColor="#f5c518"/>
                <stop offset="70%" stopColor="#d4a017"/>
                <stop offset="100%" stopColor="#7a4f00"/>
              </linearGradient>
              {/* Medal face */}
              <radialGradient id="hp-face" cx="38%" cy="32%" r="68%">
                <stop offset="0%" stopColor="#fffde0"/>
                <stop offset="35%" stopColor="#f5c518"/>
                <stop offset="75%" stopColor="#d4a017"/>
                <stop offset="100%" stopColor="#92650a"/>
              </radialGradient>
              {/* Shine */}
              <radialGradient id="hp-shine" cx="32%" cy="25%" r="50%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.85)"/>
                <stop offset="50%" stopColor="rgba(255,255,255,0.12)"/>
                <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
              </radialGradient>
              {/* Depth shadow */}
              <radialGradient id="hp-depth" cx="65%" cy="70%" r="55%">
                <stop offset="0%" stopColor="rgba(0,0,0,0.32)"/>
                <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
              </radialGradient>
              {/* Paw print engraving */}
              <radialGradient id="hp-paw" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.55)"/>
                <stop offset="100%" stopColor="rgba(255,220,100,0.18)"/>
              </radialGradient>
            </defs>

            {/* ── Ribbon (3-stripe: red / gold / blue) ── */}
            {/* Left panel */}
            <rect x="16" y="0" width="5.33" height="30" fill="url(#hp-r1)"/>
            <rect x="21.33" y="0" width="5.33" height="30" fill="url(#hp-r2)"/>
            <rect x="26.66" y="0" width="5.33" height="30" fill="url(#hp-r3)"/>
            {/* Right panel */}
            <rect x="32" y="0" width="5.33" height="30" fill="url(#hp-r1)"/>
            <rect x="37.33" y="0" width="5.33" height="30" fill="url(#hp-r2)"/>
            <rect x="42.66" y="0" width="2.34" height="30" fill="url(#hp-r3)"/>
            {/* V-notch left */}
            <polygon points="16,30 29.33,30 22.5,38" fill="url(#hp-r2)"/>
            {/* V-notch right */}
            <polygon points="32,30 45,30 38.5,38" fill="url(#hp-r1)"/>
            {/* Ribbon sheen lines */}
            <line x1="21.33" y1="1" x2="21.33" y2="29" stroke="rgba(255,255,255,0.25)" strokeWidth="0.7"/>
            <line x1="26.66" y1="1" x2="26.66" y2="29" stroke="rgba(255,255,255,0.25)" strokeWidth="0.7"/>
            <line x1="37.33" y1="1" x2="37.33" y2="29" stroke="rgba(255,255,255,0.25)" strokeWidth="0.7"/>
            <line x1="42.66" y1="1" x2="42.66" y2="29" stroke="rgba(255,255,255,0.25)" strokeWidth="0.7"/>

            {/* ── Clasp bar connecting ribbon to medal ── */}
            <rect x="17" y="28" width="22" height="5" rx="2.5" fill="url(#hp-clasp)"/>
            <rect x="18" y="29" width="20" height="1.5" rx="0.75" fill="rgba(255,255,255,0.35)"/>

            {/* ── Medal disc ── */}
            {/* Outer glow ring */}
            <circle cx="28" cy="54" r="20" fill="rgba(244,162,77,0.18)"/>
            {/* Rim */}
            <circle cx="28" cy="54" r="18.5" fill="url(#hp-rim)"/>
            {/* Face */}
            <circle cx="28" cy="54" r="15.5" fill="url(#hp-face)"/>
            {/* Depth */}
            <circle cx="28" cy="54" r="15.5" fill="url(#hp-depth)"/>
            {/* Shine */}
            <circle cx="28" cy="54" r="15.5" fill="url(#hp-shine)"/>

            {/* ── Paw print engraving ── */}
            {/* Main pad */}
            <ellipse cx="28" cy="56.5" rx="4.5" ry="3.8" fill="url(#hp-paw)"/>
            {/* Toe pads */}
            <ellipse cx="22.5" cy="52" rx="2.1" ry="1.8" fill="url(#hp-paw)"/>
            <ellipse cx="26" cy="50.2" rx="2.1" ry="1.8" fill="url(#hp-paw)"/>
            <ellipse cx="30" cy="50.2" rx="2.1" ry="1.8" fill="url(#hp-paw)"/>
            <ellipse cx="33.5" cy="52" rx="2.1" ry="1.8" fill="url(#hp-paw)"/>

            {/* ── Inner bezel ring ── */}
            <circle cx="28" cy="54" r="15.5" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="0.8"/>
            <circle cx="28" cy="54" r="17.8" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.6"/>
          </svg>
          <h2 style={{ fontFamily:"Fraunces",fontSize:34,fontWeight:800,color:C.text,letterSpacing:"-.5px" }}>Trainer Profile</h2>
        </div>
        <p style={{ color:C.text,fontSize:16,fontWeight:500 }}>Your personal rank and progress as a dog caregiver.</p>
      </div>

      {/* ── Current Rank Card ── */}
      <div onClick={onShowRankTiers}
        style={{ background:"linear-gradient(135deg,"+uLvl.glow+" 0%,"+C.card+" 70%)",border:"2px solid "+uLvl.color,borderRadius:20,padding:"22px 24px",marginBottom:14,boxShadow:"0 0 32px "+uLvl.glow,cursor:"pointer",transition:"all .18s" }}
        onMouseEnter={function(e){ e.currentTarget.style.filter="brightness(1.06)"; }}
        onMouseLeave={function(e){ e.currentTarget.style.filter=""; }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12 }}>
          <p style={{ fontSize:14,fontWeight:800,color:uLvl.color,textTransform:"uppercase",letterSpacing:".1em" }}>Your Trainer Rank</p>
          <span style={{ fontSize:14,color:C.text,fontWeight:700,background:C.border,padding:"4px 12px",borderRadius:99 }}>{tp+" TP · TAP FOR ALL TIERS ›"}</span>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:18,marginBottom:16 }}>
          <div style={{ fontSize:54,lineHeight:1,filter:"drop-shadow(0 6px 18px "+uLvl.glow+")",flexShrink:0 }}>{uLvl.icon}</div>
          <div style={{ flex:1 }}>
            <p style={{ fontFamily:"Fraunces",fontSize:26,fontWeight:800,color:uLvl.color,lineHeight:1.1,marginBottom:4 }}>{uLvl.label}</p>
            <p style={{ fontSize:14,color:C.text,fontWeight:500,marginBottom:8 }}>{uLvl.desc}</p>
            {nxtLvl
              ? <p style={{ fontSize:14,color:C.text,fontWeight:600 }}>{toNxt+" TP to reach "+nxtLvl.icon+" "+nxtLvl.label}</p>
              : <p style={{ fontSize:14,color:uLvl.color,fontWeight:700 }}>Highest rank achieved! 👑</p>}
          </div>
          <div style={{ textAlign:"right",flexShrink:0 }}>
            <p style={{ fontFamily:"Fraunces",fontSize:36,fontWeight:800,color:uLvl.color,lineHeight:1 }}>{tp}</p>
            <p style={{ fontSize:14,color:C.text,fontWeight:700,marginTop:3 }}>Trainer Points</p>
          </div>
        </div>
        <div style={{ background:C.border,borderRadius:999,height:12,overflow:"hidden",marginBottom:8 }}>
          <div style={{ background:"linear-gradient(90deg,"+uLvl.color+",rgba(255,255,255,0.35))",width:pct+"%",height:"100%",borderRadius:999,transition:"width .8s ease",boxShadow:"0 0 10px "+uLvl.glow }} />
        </div>
        <div style={{ display:"flex",justifyContent:"space-between" }}>
          <p style={{ fontSize:14,color:uLvl.color,fontWeight:800 }}>{uLvl.icon+" "+uLvl.label}</p>
          {nxtLvl && <p style={{ fontSize:14,color:C.text,fontWeight:800 }}>{nxtLvl.icon+" "+nxtLvl.label+" ("+nxtLvl.min+" TP)"}</p>}
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:14 }}>
        {[
          { icon:"⚡", label:"Trainer Points", val:tp, color:C.accent, bold:true },
          { icon:"🏆", label:"Badges Earned", val:totalEarned+" / "+totalPossible, color:C.accent },
          { icon:"🐕", label:"Dogs in Pack", val:dogs.length, color:C.accent },
        ].map(function(s){
          return (
            <div key={s.label} style={{ background:C.card,border:"1.5px solid "+C.border,borderRadius:16,padding:"14px 16px",textAlign:"center" }}>
              <div style={{ fontSize:26,marginBottom:6 }}>{s.icon}</div>
              <p style={{ fontFamily:"Fraunces",fontSize:s.bold?26:22,fontWeight:900,color:s.color }}>{s.val}</p>
              <p style={{ fontSize:13,color:C.text,fontWeight:s.bold?900:700,marginTop:4 }}>{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* ── Upcoming Tiers ── */}
      {upcoming.length > 0 && (
        <div style={{ background:C.card,border:"1.5px solid "+C.border,borderRadius:18,padding:20,marginBottom:14 }}>
          <p style={{ fontSize:13,fontWeight:800,color:C.text,textTransform:"uppercase",letterSpacing:".08em",marginBottom:14 }}>Next Tiers to Unlock</p>
          {upcoming.map(function(rank, i){
            var need = rank.min - tp;
            return (
              <div key={rank.label} style={{ display:"flex",alignItems:"center",gap:14,padding:"12px 0",borderBottom:i<upcoming.length-1?"1px solid "+C.border:"none" }}>
                <div style={{ fontSize:32,filter:"grayscale(0.4)",flexShrink:0 }}>{rank.icon}</div>
                <div style={{ flex:1 }}>
                  <p style={{ fontFamily:"Fraunces",fontSize:16,fontWeight:800,color:rank.color,marginBottom:2 }}>{rank.label}</p>
                  <p style={{ fontSize:14,color:C.text,fontWeight:500 }}>{rank.desc}</p>
                </div>
                <div style={{ textAlign:"right",flexShrink:0 }}>
                  <p style={{ fontSize:13,fontWeight:700,color:rank.color }}>{rank.min+" TP"}</p>
                  <p style={{ fontSize:13,color:C.text,fontWeight:600,marginTop:3 }}>{need+" to go"}</p>
                </div>
              </div>
            );
          })}
          <button onClick={onShowRankTiers} style={{ marginTop:14,width:"100%",background:C.accentFaint,border:"1.5px solid "+C.accent,color:C.accent,borderRadius:10,padding:"9px",fontSize:13,fontWeight:700,cursor:"pointer" }}>
            View All 12 Tiers →
          </button>
        </div>
      )}

      {/* ── How to earn TP ── */}
      <div style={{ background:C.card,border:"1.5px solid "+C.border,borderRadius:18,padding:20,marginBottom:14 }}>
        <p style={{ fontSize:13,fontWeight:800,color:C.text,textTransform:"uppercase",letterSpacing:".08em",marginBottom:14 }}>How to Earn Trainer Points</p>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
          {[
            ["🍽️","Mark as Fed","+"+TP_VALUES.fed+" TP","Every meal logged counts."],
            ["🌿","Taken Outside","+"+TP_VALUES.outside+" TP","Every outing matters."],
            ["⚖️","Log Weight","+"+TP_VALUES.weight+" TP","Track healthy growth."],
            ["🩺","Schedule Vet Appt","+"+TP_VALUES.vet_add+" TP","Proactive health care."],
            ["💉","Log Vaccine","+"+TP_VALUES.vax_add+" TP","Keep records current."],
            ["💊","Give Medication","+"+TP_VALUES.med_given+" TP","Consistent treatment."],
            ["🌸","Log Heat Cycle","+"+TP_VALUES.heat_log+" TP","First-time log only."],
            ["🐕","Add a Dog","+"+TP_VALUES.add_dog+" TP","Grow your pack."],
          ].map(function(row, i){
            return (
              <div key={i} style={{ background:C.bg,border:"1px solid "+C.border,borderRadius:12,padding:"10px 12px",display:"flex",alignItems:"center",gap:10 }}>
                <span style={{ fontSize:22,flexShrink:0 }}>{row[0]}</span>
                <div style={{ flex:1,minWidth:0 }}>
                  <p style={{ fontSize:15,fontWeight:700,color:C.text }}>{row[1]}</p>
                  <p style={{ fontSize:13,color:C.isDark?"rgba(255,255,255,0.6)":"rgba(0,0,0,0.6)",fontWeight:500 }}>{row[3]}</p>
                </div>
                <span style={{ fontSize:15,fontWeight:800,color:C.accent,flexShrink:0 }}>{row[2]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Recent TP activity ── */}
      {recentLog.length > 0 && (
        <div style={{ background:C.card,border:"1.5px solid "+C.border,borderRadius:18,padding:20 }}>
          <p style={{ fontSize:13,fontWeight:800,color:C.text,textTransform:"uppercase",letterSpacing:".08em",marginBottom:12 }}>Recent Activity</p>
          {recentLog.map(function(entry, i){
            return (
              <div key={i} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i<recentLog.length-1?"1px solid "+C.border:"none" }}>
                <p style={{ fontSize:15,fontWeight:600,color:C.text }}>{entry.reason}</p>
                <div style={{ display:"flex",alignItems:"center",gap:8,flexShrink:0 }}>
                  <span style={{ fontSize:15,fontWeight:900,color:C.accent }}>{"+"+(entry.amount)+" TP"}</span>
                  <span style={{ fontSize:13,fontWeight:700,color:C.muted }}>{timeAgo(entry.ts)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// main dashboard
function DogBoard({ dogs, onSelect, onUpdate, onAdd, earnTP, setActiveTab, setCooldownAlert }) {
  var C = useTheme();
  var [showPackBadges, setShowPackBadges] = useState(false);
  var [packBadgeSearch, setPackBadgeSearch] = useState("");
  var [expandedDogs, setExpandedDogs] = useState({});
  var [focusedIndex, setFocusedIndex] = useState(0);
  var [showPackDocs, setShowPackDocs] = useState(false);
  var [confirmDialog, setConfirmDialog] = useState({ show: false, title: "", message: "", onConfirm: null });
  var needsFeed = dogs.filter(function(d){ return !d.lastFed || (Date.now()-new Date(d.lastFed)) > getFedCooldown(d); });
  var needsOut = dogs.filter(function(d){ return !d.lastOutside || (Date.now()-new Date(d.lastOutside)) > getOutsideCooldown(d); });
  var heatAlert = dogs.filter(function(d){ if(d.gender!=="female"||!d.lastHeatDate)return false; var h=getHeatStatus(d); return h&&(h.upcoming||h.inHeat); });
  var ovVaxDogs = dogs.filter(function(d){ return (d.vaccines||[]).some(function(v){ return v.nextDate&&isOverdue(v.nextDate); }); });
  var upAppts = dogs.reduce(function(acc,d){ return acc.concat((d.vetAppointments||[]).filter(function(a){ var du=daysUntil(a.date); return du>=0&&du<=7; }).map(function(a){ return Object.assign({},a,{dog:d}); })); },[]).sort(function(a,b){ return parseLocalDate(a.date) - parseLocalDate(b.date); });
  var medEnd = dogs.filter(function(d){ return (d.medications||[]).some(function(m){ return m.active&&m.endDate&&isDueSoon(m.endDate,3); }); });
  var total = needsFeed.length+needsOut.length+heatAlert.length+ovVaxDogs.length+upAppts.length+medEnd.length;
  var [alertDismissed, setAlertDismissed] = useState(false);
  var [showAllAlerts, setShowAllAlerts] = useState(false);
  var [dismissedAlerts, setDismissedAlerts] = useState({});
  var [dogSearch, setDogSearch] = useState("");

  function dismissAlert(alertId) {
    setDismissedAlerts(function(prev) {
      var updated = Object.assign({}, prev);
      updated[alertId] = true;
      return updated;
    });
  }

  // Build full per-dog badge breakdown for modal
  var packBadgeData = dogs.map(function(d){
    var b = computeBadges(d, dogs);
    return { dog:d, earned:b.filter(function(x){ return x.earned; }), total:b.length };
  }).filter(function(x){ return x.earned.length > 0; });

  function toggleDog(id) {
    setExpandedDogs(function(prev){ return Object.assign({}, prev, { [id]: !prev[id] }); });
  }

  return (
    <div className="fadeIn" style={{ maxWidth:720,margin:"0 auto" }}>

      {showPackBadges && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:99999,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"24px 20px",overflowY:"auto" }}
          onClick={function(){ setShowPackBadges(false); setPackBadgeSearch(""); setExpandedDogs({}); setFocusedIndex(0); }}>
          <div className="fadeIn" style={{ background:C.card,border:"2px solid "+C.accent,borderRadius:24,padding:28,maxWidth:560,width:"100%",overscrollBehavior:"contain" }}
            onClick={function(e){ e.stopPropagation(); }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
              <h2 style={{ fontFamily:"Fraunces",fontSize:22,fontWeight:800,color:C.accent }}>🏆 Pack Badges</h2>
              <button onClick={function(){ setShowPackBadges(false); setPackBadgeSearch(""); setExpandedDogs({}); setFocusedIndex(0); }}
                style={{ background:C.isDark?"rgba(255,255,255,0.12)":"rgba(0,0,0,0.12)",border:"1.5px solid "+(C.isDark?"rgba(255,255,255,0.28)":"rgba(0,0,0,0.28)"),color:C.isDark?"rgba(255,255,255,0.85)":"rgba(0,0,0,0.75)",borderRadius:"50%",width:32,height:32,cursor:"pointer",fontSize:16,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center" }}>&#x2715;</button>
            </div>
            <div style={{ position:"relative",marginBottom:18 }}>
              <span style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:14,color:C.muted,pointerEvents:"none" }}>🔍</span>
              <input
                placeholder="Search dogs..."
                value={packBadgeSearch}
                onChange={function(e){ 
                  setPackBadgeSearch(e.target.value); 
                  setFocusedIndex(0);
                }}
                onKeyDown={function(e){
                  var filtered = packBadgeData.filter(function(entry){
                    return entry.dog.name.toLowerCase().includes(packBadgeSearch.toLowerCase()) ||
                      entry.dog.breed.toLowerCase().includes(packBadgeSearch.toLowerCase());
                  });
                  
                  if (e.key === "Enter") {
                    if (filtered.length > 0) {
                      toggleDog(filtered[focusedIndex].dog.id);
                      // Scroll to the focused element
                      var elem = document.getElementById("dog-entry-" + focusedIndex);
                      if (elem) {
                        elem.scrollIntoView({ behavior: "smooth", block: "nearest" });
                      }
                    }
                  } else if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setFocusedIndex(function(prev){ 
                      var next = Math.min(prev + 1, filtered.length - 1);
                      // Scroll to the newly focused element
                      setTimeout(function(){
                        var elem = document.getElementById("dog-entry-" + next);
                        if (elem) {
                          elem.scrollIntoView({ behavior: "smooth", block: "nearest" });
                        }
                      }, 0);
                      return next;
                    });
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setFocusedIndex(function(prev){ 
                      var next = Math.max(prev - 1, 0);
                      // Scroll to the newly focused element
                      setTimeout(function(){
                        var elem = document.getElementById("dog-entry-" + next);
                        if (elem) {
                          elem.scrollIntoView({ behavior: "smooth", block: "nearest" });
                        }
                      }, 0);
                      return next;
                    });
                  }
                }}
                style={{ paddingLeft:34,fontSize:13 }}
                onClick={function(e){ e.stopPropagation(); }}
              />
            </div>
            {(function(){
              var filtered = packBadgeData.filter(function(entry){
                return entry.dog.name.toLowerCase().includes(packBadgeSearch.toLowerCase()) ||
                  entry.dog.breed.toLowerCase().includes(packBadgeSearch.toLowerCase());
              });
              if (packBadgeData.length === 0) return <p style={{ color:C.muted,textAlign:"center",padding:24 }}>No badges earned yet across the pack.</p>;
              if (filtered.length === 0) return <p style={{ color:C.muted,textAlign:"center",padding:24 }}>No dogs match "{packBadgeSearch}".</p>;
              return filtered.map(function(entry, idx){
                var isOpen = !!expandedDogs[entry.dog.id];
                var isFocused = idx === focusedIndex;
                return (
                  <div 
                    key={entry.dog.id} 
                    id={"dog-entry-" + idx}
                    style={{ 
                      marginBottom:10,
                      border:"1.5px solid "+(isFocused ? C.accent : isOpen ? C.accent : C.border),
                      borderRadius:16,
                      overflow:"hidden",
                      transition:"border-color .18s",
                      boxShadow: isFocused ? "0 0 0 3px " + (C.isDark ? "rgba(139, 92, 246, 0.3)" : "rgba(139, 92, 246, 0.2)") : "none"
                    }}>
                    {/* ── Accordion header — always visible ── */}
                    <div
                      onClick={function(){ toggleDog(entry.dog.id); }}
                      style={{ display:"flex",alignItems:"center",gap:12,padding:"14px 16px",cursor:"pointer",background:isOpen?C.accentFaint:C.bg,transition:"background .18s",userSelect:"none" }}>
                      <div style={{ width:40,height:40,borderRadius:"50%",background:C.accentFaint,border:"1.5px solid "+C.border,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>
                        {entry.dog.photo ? <img src={entry.dog.photo} alt={entry.dog.name} style={{ width:"100%",height:"100%",objectFit:"cover" }} /> : entry.dog.emoji}
                      </div>
                      <div style={{ flex:1,minWidth:0 }}>
                        <p style={{ fontFamily:"Fraunces",fontSize:17,fontWeight:800,color:C.text }}>{entry.dog.name}</p>
                        <p style={{ fontSize:13,color:C.muted,fontWeight:600 }}>{entry.earned.length+" / "+entry.total+" badges earned"}</p>
                      </div>
                      <span style={{ background:C.accentFaint,color:C.accent,borderRadius:99,padding:"4px 12px",fontSize:15,fontWeight:800,flexShrink:0 }}>{"🏆 "+entry.earned.length}</span>
                      {/* Dropdown arrow */}
                      <div style={{ width:28,height:28,borderRadius:"50%",background:isOpen?C.accent:C.border,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .2s" }}>
                        <span style={{ fontSize:12,color:isOpen?"#0c0e16":C.muted,fontWeight:800,display:"inline-block",transform:isOpen?"rotate(180deg)":"rotate(0deg)",transition:"transform .25s" }}>▼</span>
                      </div>
                    </div>

                    {/* ── Accordion body — badge pills ── */}
                    {isOpen && (
                      <div className="fadeIn" style={{ padding:"14px 16px",borderTop:"1.5px solid "+C.border,background:C.card }}>
                        {/* Tier grouping */}
                        {TIERS.map(function(t){
                          var group = entry.earned.filter(function(b){ return b.tier===t.tier; });
                          if (!group.length) return null;
                          return (
                            <div key={t.tier} style={{ marginBottom:14 }}>
                              <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:8 }}>
                                {MedalIcon(t.tier, 16, false)}
                                <span style={{ fontSize:12,fontWeight:800,color:t.dotColor,textTransform:"uppercase",letterSpacing:".06em" }}>{t.label}</span>
                                <span style={{ fontSize:12,color:C.muted,fontWeight:600 }}>· {group.length} badge{group.length!==1?"s":""}</span>
                              </div>
                              <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
                                {group.map(function(b){
                                  var col = BADGE_COLORS[b.color]||BADGE_COLORS.accent;
                                  return (
                                    <div key={b.id} style={{ display:"flex",alignItems:"center",gap:5,background:C.cardHov,border:"1.5px solid "+col[0],borderRadius:99,padding:"5px 12px" }}>
                                      <span style={{ fontSize:15 }}>{b.icon}</span>
                                      <span style={{ fontSize:13,fontWeight:700,color:col[0] }}>{b.name}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}
      <div style={{ marginBottom:28 }}>
        <h2 style={{ fontFamily:"Fraunces",fontSize:42,fontWeight:800,color:C.text,letterSpacing:"-1px" }}><span style={{ marginRight:10 }}>&#x1F43E;</span>DogBoard<span style={{ marginLeft:10 }}>&#x1F43E;</span></h2>
        <p style={{ color:C.muted,fontSize:18,marginTop:4 }}>You have <strong style={{ color:C.accent }}>{dogs.length}</strong> dog{dogs.length!==1?"s":""} in your pack</p>
      </div>
      {dogs.length === 0 ? (
        <Card style={{ textAlign:"center",padding:52 }}>
          <div style={{ fontSize:64,marginBottom:16 }}>🐕</div>
          <h3 style={{ fontFamily:"Fraunces",fontSize:24,color:C.text,marginBottom:8 }}>Add your first dog!</h3>
          <p style={{ color:C.text,fontSize:15,fontWeight:500,marginBottom:22,opacity:0.7 }}>Track feeding, outdoor breaks, vet records, medications, and more.</p>
          <button className="btnP" onClick={onAdd} style={{ fontSize:15,padding:"13px 32px" }}>+ Add a Dog</button>
        </Card>
      ) : (
        <div>
          {total > 0 && !alertDismissed && (
            <div style={{ background:C.accentDark,border:"1px solid "+C.accent,borderRadius:16,padding:18,marginBottom:20 }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}>
                <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                  <p style={{ fontFamily:"Fraunces",fontSize:20,fontWeight:800,color:C.accent,margin:0 }}>⚠️ Action Required</p>
                  {total > 3 && (
                    <button 
                      onClick={function(){ setShowAllAlerts(function(v){ return !v; }); }}
                      style={{ 
                        background:C.accentFaint,
                        border:"1px solid "+C.accent,
                        color:C.accent,
                        cursor:"pointer",
                        fontSize:13,
                        fontWeight:800,
                        padding:"7px 14px",
                        borderRadius:8,
                        display:"flex",
                        alignItems:"center",
                        gap:8,
                        transition:"all .2s"
                      }}
                      onMouseEnter={function(e){ e.currentTarget.style.background=C.accent; e.currentTarget.style.color="#fff"; }}
                      onMouseLeave={function(e){ e.currentTarget.style.background=C.accentFaint; e.currentTarget.style.color=C.accent; }}
                      title={showAllAlerts?"Show less":"Show all "+total+" alerts"}>
                      <span>{showAllAlerts?"Show Less":"View All ("+total+")"}</span>
                      <span style={{ fontSize:12,transition:"transform .2s",transform:showAllAlerts?"rotate(180deg)":"rotate(0deg)",display:"inline-block" }}>▼</span>
                    </button>
                  )}
                </div>
                <button className="btnI" onClick={function(){ setAlertDismissed(true); }} title="Dismiss alerts">&#x2715;</button>
              </div>
              {(function(){
                var allAlerts = []
                  .concat(needsFeed.map(function(d){ return { type:"feed", dog:d }; }))
                  .concat(needsOut.map(function(d){ return { type:"out", dog:d }; }))
                  .concat(ovVaxDogs.map(function(d){ return { type:"vax", dog:d }; }))
                  .concat(upAppts.map(function(a){ return { type:"appt", appt:a }; }))
                  .concat(heatAlert.map(function(d){ return { type:"heat", dog:d }; }))
                  .concat(medEnd.map(function(d){ return { type:"med", dog:d }; }));
                
                var displayAlerts = showAllAlerts ? allAlerts : allAlerts.slice(0, 3);
                
                return displayAlerts.map(function(item, idx){
                  if(item.type === "feed") {
                    var d = item.dog;
                    var alertId = "feed-" + d.id;
                    if (dismissedAlerts[alertId]) return null;
                    return (
                      <div key={alertId} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7,paddingBottom:7,borderBottom:idx<displayAlerts.length-1?"1px solid "+C.border:"none" }}>
                        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                          <div style={{ width:26,height:26,borderRadius:"50%",background:C.accentFaint,border:"1px solid "+C.border,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0 }}>
                            {d.photo ? <img src={d.photo} alt={d.name} style={{ width:"100%",height:"100%",objectFit:"cover" }} /> : d.emoji}
                          </div>
                          <span style={{ color:C.text,fontSize:17,fontWeight:500 }}><strong style={{ fontWeight:800 }}>{d.name}</strong>{" — Feeding Overdue"}</span>
                        </div>
                        <div style={{ display:"flex",gap:6,alignItems:"center" }}>
                          <button className="btnP" style={{ fontSize:13,padding:"6px 12px" }} onClick={function(){
                            var cooldownTimestamps = d.cooldownTimestamps || {};
                            var lastFedCooldown = cooldownTimestamps.fed;
                            var fedCooldownMs = getFedCooldown(d);
                            var fedCooldown = isOnCooldown(lastFedCooldown, fedCooldownMs);
                            
                            if (fedCooldown) {
                              var remaining = getCooldownRemaining(lastFedCooldown, fedCooldownMs);
                              setCooldownAlert({
                                show: true,
                                message: "You recently fed " + d.name + "! To prevent rapid logging and ensure accurate tracking, please wait before marking them as fed again.",
                                remaining: formatCooldown(remaining)
                              });
                              return;
                            }
                            
                            var ts = new Date().toISOString();
                            var entry = { id: String(Date.now()), type:"fed", timestamp: ts };
                            var updatedCooldowns = Object.assign({}, cooldownTimestamps, { fed: ts });
                            onUpdate(Object.assign({},d,{ lastFed:ts, activityLog:(d.activityLog||[]).concat([entry]), cooldownTimestamps: updatedCooldowns }));
                            if (earnTP) earnTP(TP_VALUES.fed, "Fed "+d.name);
                          }}>Mark Fed</button>
                          <button onClick={function(){ dismissAlert(alertId); }} style={{ width:24,height:24,borderRadius:6,border:"1px solid "+C.border,background:"transparent",color:C.muted,cursor:"pointer",fontSize:14,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s" }}
                            onMouseEnter={function(e){ e.currentTarget.style.background=C.accentFaint; e.currentTarget.style.color=C.accent; }}
                            onMouseLeave={function(e){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color=C.muted; }}>×</button>
                        </div>
                      </div>
                    );
                  } else if(item.type === "out") {
                    var d = item.dog;
                    var alertId = "out-" + d.id;
                    if (dismissedAlerts[alertId]) return null;
                    return (
                      <div key={alertId} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7,paddingBottom:7,borderBottom:idx<displayAlerts.length-1?"1px solid "+C.border:"none" }}>
                        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                          <div style={{ width:26,height:26,borderRadius:"50%",background:C.blueFaint,border:"1px solid "+C.border,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0 }}>
                            {d.photo ? <img src={d.photo} alt={d.name} style={{ width:"100%",height:"100%",objectFit:"cover" }} /> : d.emoji}
                          </div>
                          <span style={{ color:C.text,fontSize:17,fontWeight:500 }}><strong style={{ fontWeight:800 }}>{d.name}</strong>{" — Needs To Go Outside"}</span>
                        </div>
                        <div style={{ display:"flex",gap:6,alignItems:"center" }}>
                          <button onClick={function(){
                            var cooldownTimestamps = d.cooldownTimestamps || {};
                            var lastOutsideCooldown = cooldownTimestamps.outside;
                            var outCooldownMs = getOutsideCooldown(d);
                            var outCooldown = isOnCooldown(lastOutsideCooldown, outCooldownMs);
                            
                            if (outCooldown) {
                              var remaining = getCooldownRemaining(lastOutsideCooldown, outCooldownMs);
                              setCooldownAlert({
                                show: true,
                                message: "You recently took " + d.name + " outside! To prevent rapid logging and ensure accurate tracking, please wait before marking them as outside again.",
                                remaining: formatCooldown(remaining)
                              });
                              return;
                            }
                            
                            var ts = new Date().toISOString();
                            var entry = { id: String(Date.now()), type:"outside", timestamp: ts };
                            var updatedCooldowns = Object.assign({}, cooldownTimestamps, { outside: ts });
                            onUpdate(Object.assign({},d,{ lastOutside:ts, activityLog:(d.activityLog||[]).concat([entry]), cooldownTimestamps: updatedCooldowns }));
                            if (earnTP) earnTP(TP_VALUES.outside, "Took "+d.name+" outside");
                          }} style={{ fontSize:13,padding:"6px 12px",background:C.blue,border:"1px solid "+C.blue,color:"#fff",borderRadius:8,cursor:"pointer",fontWeight:700 }}>Mark Outside</button>
                          <button onClick={function(){ dismissAlert(alertId); }} style={{ width:24,height:24,borderRadius:6,border:"1px solid "+C.border,background:"transparent",color:C.muted,cursor:"pointer",fontSize:14,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s" }}
                            onMouseEnter={function(e){ e.currentTarget.style.background=C.blueFaint; e.currentTarget.style.color=C.blue; }}
                            onMouseLeave={function(e){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color=C.muted; }}>×</button>
                        </div>
                      </div>
                    );
                  } else if(item.type === "vax") {
                    var d = item.dog;
                    var alertId = "vax-" + d.id;
                    if (dismissedAlerts[alertId]) return null;
                    return (
                      <div key={alertId} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7,paddingBottom:7,borderBottom:idx<displayAlerts.length-1?"1px solid "+C.border:"none" }}>
                        <span style={{ color:C.text,fontSize:17,fontWeight:500 }}>💉 <strong style={{ fontWeight:800 }}>{d.name}</strong>{" — Overdue Vaccination(s)"}</span>
                        <div style={{ display:"flex",gap:6,alignItems:"center" }}>
                          <button onClick={function(){ 
                            onSelect(d);
                            if (setActiveTab) setActiveTab("vaccines");
                            setTimeout(function(){ 
                              var detailView = document.querySelector('[data-dogdetail="true"]');
                              if (detailView) detailView.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }, 100);
                          }} style={{ fontSize:13,padding:"6px 12px",background:C.redFaint,border:"1px solid "+C.red,color:C.red,borderRadius:8,cursor:"pointer",fontWeight:600 }}>View</button>
                          <button onClick={function(){ dismissAlert(alertId); }} style={{ width:24,height:24,borderRadius:6,border:"1px solid "+C.border,background:"transparent",color:C.muted,cursor:"pointer",fontSize:14,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s" }}
                            onMouseEnter={function(e){ e.currentTarget.style.background=C.redFaint; e.currentTarget.style.color=C.red; }}
                            onMouseLeave={function(e){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color=C.muted; }}>×</button>
                        </div>
                      </div>
                    );
                  } else if(item.type === "appt") {
                    var a = item.appt;
                    var du = daysUntil(a.date);
                    var when = du===0?"today":du===1?"tomorrow":"in "+du+"d";
                    var alertId = "appt-" + a.id;
                    if (dismissedAlerts[alertId]) return null;
                    return (
                      <div key={alertId} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7,paddingBottom:7,borderBottom:idx<displayAlerts.length-1?"1px solid "+C.border:"none" }}>
                        <span style={{ color:C.text,fontSize:17,fontWeight:500 }}>🩺 <strong style={{ fontWeight:800 }}>{a.dog.name}</strong>{" — Vet Appt "+when+": "+a.reason}</span>
                        <div style={{ display:"flex",gap:6,alignItems:"center" }}>
                          <button onClick={function(){ 
                            onSelect(a.dog);
                            if (setActiveTab) setActiveTab("vet");
                            setTimeout(function(){ 
                              var detailView = document.querySelector('[data-dogdetail="true"]');
                              if (detailView) detailView.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }, 100);
                          }} style={{ fontSize:13,padding:"6px 12px",background:C.blueFaint,border:"1px solid "+C.blue,color:C.blue,borderRadius:8,cursor:"pointer",fontWeight:600 }}>View</button>
                          <button onClick={function(){ dismissAlert(alertId); }} style={{ width:24,height:24,borderRadius:6,border:"1px solid "+C.border,background:"transparent",color:C.muted,cursor:"pointer",fontSize:14,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s" }}
                            onMouseEnter={function(e){ e.currentTarget.style.background=C.blueFaint; e.currentTarget.style.color=C.blue; }}
                            onMouseLeave={function(e){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color=C.muted; }}>×</button>
                        </div>
                      </div>
                    );
                  } else if(item.type === "heat") {
                    var d = item.dog;
                    var h = getHeatStatus(d);
                    var alertId = "heat-" + d.id;
                    if (dismissedAlerts[alertId]) return null;
                    return (
                      <div key={alertId} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7,paddingBottom:7,borderBottom:idx<displayAlerts.length-1?"1px solid "+C.border:"none" }}>
                        <span style={{ color:C.text,fontSize:17,fontWeight:500 }}>🌸 <strong style={{ fontWeight:800 }}>{d.name}</strong>{" — "+(h.inHeat?"In Heat (Day "+h.heatDay+")":"Heat in "+h.daysUntilNext+"Days")}</span>
                        <div style={{ display:"flex",gap:6,alignItems:"center" }}>
                          <button onClick={function(){ 
                            onSelect(d);
                            if (setActiveTab) setActiveTab("heat");
                            setTimeout(function(){ 
                              var detailView = document.querySelector('[data-dogdetail="true"]');
                              if (detailView) detailView.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }, 100);
                          }} style={{ fontSize:13,padding:"6px 12px",background:C.pinkFaint,border:"1px solid "+C.pink,color:C.pink,borderRadius:8,cursor:"pointer",fontWeight:600 }}>View</button>
                          <button onClick={function(){ dismissAlert(alertId); }} style={{ width:24,height:24,borderRadius:6,border:"1px solid "+C.border,background:"transparent",color:C.muted,cursor:"pointer",fontSize:14,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s" }}
                            onMouseEnter={function(e){ e.currentTarget.style.background=C.pinkFaint; e.currentTarget.style.color=C.pink; }}
                            onMouseLeave={function(e){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color=C.muted; }}>×</button>
                        </div>
                      </div>
                    );
                  } else if(item.type === "med") {
                    var d = item.dog;
                    var alertId = "med-" + d.id;
                    if (dismissedAlerts[alertId]) return null;
                    return (
                      <div key={alertId} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7,paddingBottom:7,borderBottom:idx<displayAlerts.length-1?"1px solid "+C.border:"none" }}>
                        <span style={{ color:C.text,fontSize:17,fontWeight:500 }}>💊 <strong style={{ fontWeight:800 }}>{d.name}</strong>{" — Medication Ending Soon"}</span>
                        <div style={{ display:"flex",gap:6,alignItems:"center" }}>
                          <button onClick={function(){ 
                            onSelect(d);
                            if (setActiveTab) setActiveTab("meds");
                            setTimeout(function(){ 
                              var detailView = document.querySelector('[data-dogdetail="true"]');
                              if (detailView) detailView.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }, 100);
                          }} style={{ fontSize:13,padding:"6px 12px",background:C.purpleFaint,border:"1px solid "+C.purple,color:C.purple,borderRadius:8,cursor:"pointer",fontWeight:600 }}>View</button>
                          <button onClick={function(){ dismissAlert(alertId); }} style={{ width:24,height:24,borderRadius:6,border:"1px solid "+C.border,background:"transparent",color:C.muted,cursor:"pointer",fontSize:14,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s" }}
                            onMouseEnter={function(e){ e.currentTarget.style.background=C.purpleFaint; e.currentTarget.style.color=C.purple; }}
                            onMouseLeave={function(e){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color=C.muted; }}>×</button>
                        </div>
                      </div>
                    );
                  }
                }).filter(function(item){ return item !== null; });
              })()}
            </div>
          )}

          {(function(){
            var totalEarned = dogs.reduce(function(sum, d){ return sum + computeBadges(d, dogs).filter(function(b){ return b.earned; }).length; }, 0);
            var totalPossible = BADGE_DEFS.length * dogs.length;
            var recentBadges = [];
            dogs.forEach(function(d){
              computeBadges(d, dogs).forEach(function(b){
                if (b.earned) recentBadges.push(Object.assign({},b,{dogName:d.name}));
              });
            });
            recentBadges = recentBadges.slice(0,6);
            if (!totalEarned) return null;
            return (
              <div onClick={function(){ setShowPackBadges(true); }} style={{ background:C.card,border:"1.5px solid "+C.accent,borderRadius:16,padding:18,marginBottom:20,cursor:"pointer",transition:"all .18s" }}
                onMouseEnter={function(e){ e.currentTarget.style.background=C.cardHov; }}
                onMouseLeave={function(e){ e.currentTarget.style.background=C.card; }}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
                  <p style={{ fontFamily:"Fraunces",fontSize:20,fontWeight:800,color:C.accent }}>{"🏆 Pack Badges"}</p>
                  <p style={{ color:C.isDark?"rgba(255,255,255,0.6)":"rgba(0,0,0,0.55)",fontSize:14,fontWeight:600 }}>{totalEarned+" earned · tap to explore"}</p>
                </div>
                <div style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
                  {recentBadges.map(function(b,i){
                    var col = BADGE_COLORS[b.color]||BADGE_COLORS.accent;
                    return (
                      <div key={b.id+i} style={{ display:"flex",alignItems:"center",gap:7,background:C.isDark?col[1]:"rgba(0,0,0,0.06)",border:"1.5px solid "+col[0],borderRadius:99,padding:"6px 14px" }}>
                        <span style={{ fontSize:17 }}>{b.icon}</span>
                        <span style={{ fontSize:14,fontWeight:800,color:col[0] }}>{b.dogName}</span>
                        <span style={{ fontSize:14,fontWeight:600,color:C.isDark?C.text:"rgba(0,0,0,0.75)" }}>{b.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
          
          {/* Pack Documents Card - Separate */}
          {(function(){
            var dogsWithDocs = dogs.filter(function(d){ return (d.documents||[]).length > 0; });
            var totalDocs = dogs.reduce(function(sum, d){ return sum + (d.documents||[]).length; }, 0);
            
            if (totalDocs === 0) return null;
            
            return (
              <div style={{ background:C.card,border:"1.5px solid "+C.accent,borderRadius:16,padding:18,marginBottom:20 }}>
                <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                    <span style={{ fontSize:28 }}>📄</span>
                    <div>
                      <p style={{ fontFamily:"Fraunces",fontSize:18,fontWeight:800,color:C.text }}>Pack Documents</p>
                      <p style={{ fontSize:13,color:C.muted }}>{totalDocs} file{totalDocs!==1?"s":""} across the pack</p>
                    </div>
                  </div>
                </div>
                <button onClick={function(){ setShowPackDocs(true); }}
                  style={{ width:"100%",background:C.accentFaint,border:"1.5px solid "+C.accent,color:C.accent,borderRadius:10,padding:"12px",fontSize:14,fontWeight:700,cursor:"pointer",transition:"all .15s",display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}
                  onMouseEnter={function(e){ e.currentTarget.style.background=C.accent; e.currentTarget.style.color="#fff"; }}
                  onMouseLeave={function(e){ e.currentTarget.style.background=C.accentFaint; e.currentTarget.style.color=C.accent; }}>
                  <span>📂</span> View All
                </button>
              </div>
            );
          })()}
          
          
          {/* Pack Documents Modal */}
          {showPackDocs && (function(){
            var dogsWithDocs = dogs.filter(function(d){ return (d.documents||[]).length > 0; });
            var totalDocs = dogs.reduce(function(sum, d){ return sum + (d.documents||[]).length; }, 0);
            
            return (
              <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:99999,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"24px 20px",overflowY:"auto" }}
                onClick={function(){ setShowPackDocs(false); }}>
                <div className="fadeIn" style={{ background:C.card,border:"2px solid "+C.blue,borderRadius:24,padding:28,maxWidth:720,width:"100%",overscrollBehavior:"contain" }}
                  onClick={function(e){ e.stopPropagation(); }}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
                    <h2 style={{ fontFamily:"Fraunces",fontSize:22,fontWeight:800,color:C.blue }}>📄 Pack Documents</h2>
                    <button onClick={function(){ setShowPackDocs(false); }}
                      style={{ background:C.isDark?"rgba(255,255,255,0.12)":"rgba(0,0,0,0.12)",border:"1.5px solid "+(C.isDark?"rgba(255,255,255,0.28)":"rgba(0,0,0,0.28)"),color:C.isDark?"rgba(255,255,255,0.85)":"rgba(0,0,0,0.75)",borderRadius:"50%",width:32,height:32,cursor:"pointer",fontSize:16,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center" }}>&#x2715;</button>
                  </div>
                  
                  <p style={{ color:C.muted,fontSize:14,marginBottom:20 }}>
                    All documents across your pack ({totalDocs} total file{totalDocs!==1?"s":""})
                  </p>
                  
                  {dogsWithDocs.map(function(dog){
                    var docs = dog.documents || [];
                    return (
                      <div key={dog.id} style={{ marginBottom:24 }}>
                        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:12,paddingBottom:10,borderBottom:"2px solid "+C.border }}>
                          <div style={{ fontSize:32 }}>{dog.emoji||"🐕"}</div>
                          <div>
                            <h3 style={{ fontFamily:"Fraunces",fontSize:18,fontWeight:800,color:C.text }}>{dog.name}</h3>
                            <p style={{ color:C.muted,fontSize:13 }}>{docs.length} document{docs.length!==1?"s":""}</p>
                          </div>
                        </div>
                        
                        <div style={{ display:"grid",gap:10 }}>
                          {docs.map(function(doc){
                            function getFileIcon(type, name) {
                              if (type.includes("pdf")) return "📄";
                              if (type.includes("image")) return "🖼️";
                              if (type.includes("word") || type.includes("document") || name.endsWith(".doc") || name.endsWith(".docx")) return "📝";
                              if (type.includes("excel") || type.includes("sheet") || name.endsWith(".xls") || name.endsWith(".xlsx")) return "📊";
                              if (type.includes("text") || name.endsWith(".txt")) return "📃";
                              return "📎";
                            }
                            
                            function formatFileSize(bytes) {
                              if (bytes < 1024) return bytes + " B";
                              if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
                              return (bytes / (1024 * 1024)).toFixed(1) + " MB";
                            }
                            
                            return (
                              <div key={doc.id} style={{ display:"flex",alignItems:"center",gap:12,background:C.bg,border:"1.5px solid "+C.border,borderRadius:10,padding:12 }}>
                                <div style={{ fontSize:28,flexShrink:0 }}>{getFileIcon(doc.type, doc.name)}</div>
                                <div style={{ flex:1,minWidth:0,overflow:"hidden" }}>
                                  <p style={{ fontSize:14,fontWeight:700,color:C.text,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",wordBreak:"break-all" }}>{doc.name}</p>
                                  <p style={{ fontSize:12,color:C.muted,whiteSpace:"nowrap" }}>{formatFileSize(doc.size)} · {timeAgo(doc.uploadedAt)}</p>
                                </div>
                                <div style={{ display:"flex",gap:8,flexShrink:0 }}>
                                  <a href={doc.data} download={doc.name} style={{ textDecoration:"none" }}>
                                    <button style={{ background:C.blueFaint,border:"1.5px solid "+C.blue,color:C.blue,borderRadius:8,padding:"6px 12px",fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap" }}>
                                      Download
                                    </button>
                                  </a>
                                  <button type="button" onClick={function(){
                                    setConfirmDialog({
                                      show: true,
                                      title: "Delete Document?",
                                      message: "Are you sure you want to delete '" + doc.name + "'?\n\nFrom: " + dog.name + "\n\nThis action cannot be undone.",
                                      onConfirm: function() {
                                        onUpdate(Object.assign({}, dog, { documents: (dog.documents || []).filter(function(d){ return d.id !== doc.id; }) }));
                                        setConfirmDialog({ show: false, title: "", message: "", onConfirm: null });
                                      }
                                    });
                                  }} style={{ background:C.redFaint,border:"1.5px solid "+C.red,color:C.red,borderRadius:8,padding:"6px 12px",fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap" }}>
                                    Delete
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
          
          {/* Dog Search */}
          <div style={{ marginBottom:16 }}>
            <div style={{ position:"relative" }}>
              <input 
                type="text"
                placeholder="Search dogs by name or breed..."
                value={dogSearch}
                onChange={function(e){ setDogSearch(e.target.value); }}
                style={{ 
                  width:"100%",
                  padding:"12px 40px 12px 16px",
                  fontSize:15,
                  fontWeight:500,
                  border:"1.5px solid "+C.border,
                  borderRadius:12,
                  background:C.card,
                  color:C.text,
                  outline:"none",
                  transition:"border-color .2s"
                }}
                onFocus={function(e){ e.currentTarget.style.borderColor=C.accent; }}
                onBlur={function(e){ e.currentTarget.style.borderColor=C.border; }}
              />
              {dogSearch ? (
                <button 
                  onClick={function(){ setDogSearch(""); }}
                  style={{ 
                    position:"absolute",
                    right:12,
                    top:"50%",
                    transform:"translateY(-50%)",
                    background:"none",
                    border:"none",
                    color:C.muted,
                    fontSize:18,
                    cursor:"pointer",
                    padding:4,
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"center"
                  }}
                  title="Clear search">
                  ✕
                </button>
              ) : (
                <span style={{ 
                  position:"absolute",
                  right:14,
                  top:"50%",
                  transform:"translateY(-50%)",
                  color:C.muted,
                  fontSize:16,
                  pointerEvents:"none"
                }}>
                  🔍
                </span>
              )}
            </div>
          </div>

          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:14 }}>
            {dogs.filter(function(dog){
              if(!dogSearch) return true;
              var query = dogSearch.toLowerCase();
              return dog.name.toLowerCase().includes(query) || 
                     (dog.breed && dog.breed.toLowerCase().includes(query));
            }).map(function(dog) {
              var heat = dog.gender==="female" ? getHeatStatus(dog) : null;
              var hasOvVax = (dog.vaccines||[]).some(function(v){ return v.nextDate&&isOverdue(v.nextDate); });
              var nxtAppt = (dog.vetAppointments||[]).filter(function(a){ return daysUntil(a.date)>=0; }).sort(function(a,b){ return parseLocalDate(a.date) - parseLocalDate(b.date); })[0];
              return (
                <Card key={dog.id} onClick={function(){ onSelect(dog); }} style={{ padding:18 }}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12 }}>
                    <div style={{ width:56,height:56,borderRadius:"50%",background:C.accentFaint,border:"1.5px solid "+C.border,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,flexShrink:0 }}>
                      {dog.photo
                        ? <img src={dog.photo} alt={dog.name} style={{ width:"100%",height:"100%",objectFit:"cover" }} />
                        : dog.emoji}
                    </div>
                    <div style={{ display:"flex",flexDirection:"column",gap:3,alignItems:"flex-end" }}>
                      {heat && heat.inHeat && <span className="chip pulse" style={{ background:C.pinkFaint,color:C.pink }}>Heat</span>}
                      {heat && heat.upcoming && <span className="chip" style={{ background:C.yellowFaint,color:C.yellow }}>{heat.daysUntilNext+"d"}</span>}
                      {hasOvVax && <span className="chip" style={{ background:C.redFaint,color:C.red }}>Vax Due</span>}
                      {(function(){ var n=computeBadges(dog,dogs).filter(function(b){return b.earned;}).length; return n>0?<span style={{ display:"inline-flex",alignItems:"center",padding:"3px 10px",borderRadius:99,fontSize:14,fontWeight:800,background:C.accentFaint,color:C.accent,border:"1px solid "+C.accent }}>{"🏆 "+n}</span>:null; })()}
                    </div>
                  </div>
                  <h3 style={{ fontFamily:"Fraunces",fontSize:20,color:C.text,marginBottom:3 }}>{dog.name}</h3>
                  <p style={{ color:C.muted,fontSize:14,marginBottom:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{dog.breed}</p>
                  <div style={{ display:"flex",flexDirection:"column",gap:5 }}>
                    <p style={{ color:C.text,fontSize:13 }}><span style={{ fontWeight:700 }}>Fed:</span> <span style={{ color:C.text,fontWeight:500 }}>{timeAgo(dog.lastFed)}</span></p>
                    <p style={{ color:C.text,fontSize:13 }}><span style={{ fontWeight:700 }}>Out:</span> <span style={{ color:C.text,fontWeight:500 }}>{timeAgo(dog.lastOutside)}</span></p>
                    {nxtAppt && <p style={{ color:C.text,fontSize:13 }}><span style={{ fontWeight:700 }}>Vet:</span> <span style={{ color:C.blue,fontWeight:500 }}>{fmtDate(nxtAppt.date)}</span></p>}
                    {dog.weight && <p style={{ color:C.text,fontSize:13 }}><span style={{ fontWeight:700 }}>Weight:</span> <span style={{ color:C.text,fontWeight:500 }}>{dog.weight+" lbs"}</span></p>}
                  </div>
                </Card>
              );
            })}
          </div>
          {dogSearch && dogs.filter(function(dog){
            var query = dogSearch.toLowerCase();
            return dog.name.toLowerCase().includes(query) || 
                   (dog.breed && dog.breed.toLowerCase().includes(query));
          }).length === 0 && (
            <div style={{ textAlign:"center",padding:"60px 20px" }}>
              <div style={{ fontSize:48,marginBottom:12 }}>🔍</div>
              <p style={{ fontFamily:"Fraunces",fontSize:20,fontWeight:700,color:C.text,marginBottom:6 }}>No dogs found</p>
              <p style={{ color:C.muted,fontSize:15 }}>Try searching with a different name or breed</p>
              <button 
                onClick={function(){ setDogSearch(""); }}
                style={{ 
                  marginTop:16,
                  padding:"10px 24px",
                  background:C.accent,
                  color:"#fff",
                  border:"none",
                  borderRadius:10,
                  fontSize:14,
                  fontWeight:700,
                  cursor:"pointer"
                }}>
                Clear Search
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Confirm Dialog */}
      <ConfirmDialog
        show={confirmDialog.show}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={function(){ setConfirmDialog({ show: false, title: "", message: "", onConfirm: null }); }}
      />
    </div>
  );
}

// main app component
function BadgeDetailModal({ b, dog, onClose }) {
  var C = useTheme();
  var col = BADGE_COLORS[b.color] || BADGE_COLORS.accent;
  var tierInfo = TIERS.find(function(t){ return t.tier===b.tier; }) || TIERS[0];
  var categoryMap = {
    fed:"Feeding", outside:"Outdoor", streak:"Streaks", vet:"Veterinary",
    vaccine:"Vaccines", med:"Medications", weight:"Weight Tracking",
    profile:"Profile", heat:"Heat Cycle", pack:"Pack", mastery:"Mastery", special:"Special"
  };
  var idCat = b.id.split("_")[0];
  var catLabel = categoryMap[idCat] || categoryMap[b.color] || "Achievement";
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.82)",zIndex:99999,display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}
      onClick={onClose}>
      <div className="fadeIn" style={{ background:C.card,border:"2px solid "+col[0],borderRadius:24,padding:32,maxWidth:380,width:"100%",textAlign:"center",position:"relative",boxShadow:"0 24px 60px rgba(0,0,0,0.5)" }}
        onClick={function(e){ e.stopPropagation(); }}>
        <button onClick={onClose}
          style={{ position:"absolute",top:14,right:14,background:C.isDark?"rgba(255,255,255,0.12)":"rgba(0,0,0,0.12)",border:"1.5px solid "+(C.isDark?"rgba(255,255,255,0.28)":"rgba(0,0,0,0.28)"),color:C.isDark?"rgba(255,255,255,0.85)":"rgba(0,0,0,0.75)",borderRadius:"50%",width:32,height:32,cursor:"pointer",fontSize:16,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center" }}>&#x2715;</button>
        <div style={{ display:"flex",justifyContent:"center",marginBottom:10 }}>
          {MedalIcon(b.tier, 72, false)}
        </div>
        <div style={{ fontSize:56,marginBottom:10,filter:"drop-shadow(0 4px 12px rgba(0,0,0,0.3))" }}>{b.icon}</div>
        <div style={{ display:"flex",justifyContent:"center",marginBottom:14 }}>
          <span style={{ background:col[1],border:"1.5px solid "+col[0],color:col[0],borderRadius:999,padding:"4px 14px",fontSize:11,fontWeight:800,letterSpacing:".06em",textTransform:"uppercase" }}>
            {tierInfo.label+" · "+catLabel}
          </span>
        </div>
        <h2 style={{ fontFamily:"Fraunces",fontSize:26,fontWeight:800,color:col[0],marginBottom:10,lineHeight:1.2 }}>{b.name}</h2>
        <p style={{ color:C.text,fontSize:14,lineHeight:1.7,marginBottom:20,opacity:0.9 }}>{b.desc}</p>
        <div style={{ height:1,background:col[0],opacity:0.2,marginBottom:20 }}/>
        <div style={{ background:C.bg,border:"1.5px solid "+C.border,borderRadius:12,padding:"12px 16px",marginBottom:16 }}>
          <p style={{ fontSize:11,fontWeight:700,color:col[0],textTransform:"uppercase",letterSpacing:".07em",marginBottom:5 }}>&#x2728; Badge Earned</p>
          <p style={{ fontSize:13,color:C.text,fontWeight:500 }}>{dog.name+" has unlocked this achievement!"}</p>
        </div>
        <p style={{ fontSize:22,letterSpacing:8 }}>&#x2728;&#x1F3C6;&#x2728;</p>
      </div>
    </div>
  );
}

// secret admin trigger - click paw 5x
function AdminAccessTrigger() {
  var C = useTheme();
  var [clicks, setClicks] = useState(0);
  var [flash, setFlash] = useState(false);
  var timerRef = useRef(null);

  function handleClick() {
    setClicks(function(n) {
      var next = n + 1;
      if (next >= 5) {
        window.location.hash = "pawtraxx-admin";
        return 0;
      }
      setFlash(true);
      setTimeout(function(){ setFlash(false); }, 180);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(function(){ setClicks(0); }, 2000);
      return next;
    });
  }

  // Only show in dark mode
  if (!C.isDark) return null;

  return (
    <div
      onClick={handleClick}
      style={{ position:"fixed",top:2,left:2,zIndex:99999,width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",cursor:"default",userSelect:"none",opacity:0.07,transition:"opacity .18s",fontSize:26 }}
      title="">
      🐾
    </div>
  );
}

// fake email system for demo
var EMAIL_LOG_KEY = "pt_email_log";

function sendSimulatedEmail(to, subject, body) {
  var log = JSON.parse(localStorage.getItem(EMAIL_LOG_KEY) || "[]");
  log.unshift({ to: to, subject: subject, body: body, sentAt: new Date().toISOString(), id: String(Date.now()), type: "email" });
  localStorage.setItem(EMAIL_LOG_KEY, JSON.stringify(log.slice(0, 100)));
  console.log("[PawTraxx Email] To:", to, "| Subject:", subject);
}

function sendSimulatedSMS(to, body) {
  var log = JSON.parse(localStorage.getItem(EMAIL_LOG_KEY) || "[]");
  log.unshift({ to: to, subject: "SMS to " + to, body: body, sentAt: new Date().toISOString(), id: String(Date.now()+1), type: "sms" });
  localStorage.setItem(EMAIL_LOG_KEY, JSON.stringify(log.slice(0, 100)));
  console.log("[PawTraxx SMS] To:", to, "| Message:", body);
}

// TODO change these before deploying lol
var ADMIN_EMAIL = "pawtraxx01@admin.com";
var ADMIN_PASS  = "pawAdmin1997!";

// admin login page
function AdminLogin({ onAuth, onBack }) {
  var C = useTheme();
  var [email, setEmail] = useState("");
  var [pass, setPass] = useState("");
  var [err, setErr] = useState("");
  var [showPass, setShowPass] = useState(false);

  function attempt() {
    if (email === ADMIN_EMAIL && pass === ADMIN_PASS) { onAuth(); }
    else { setErr("Invalid admin credentials."); }
  }

  return (
    <div style={{ minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20,background:"radial-gradient(ellipse at 30% 20%, rgba(167,139,250,0.12) 0%, transparent 60%), "+C.bg }}>
      <div className="fadeIn" style={{ width:"100%",maxWidth:400 }}>
        <div style={{ textAlign:"center",marginBottom:32 }}>
          <div style={{ fontSize:52,marginBottom:10 }}>🛡️</div>
          <h1 style={{ fontFamily:"Fraunces",fontSize:32,fontWeight:800,color:C.purple,letterSpacing:"-1px" }}>Admin Portal</h1>
          <p style={{ color:C.text,fontSize:16,marginTop:8,fontWeight:500,opacity:0.8 }}>PawTraxx · Restricted Access</p>
        </div>
        <div style={{ background:C.card,border:"1.5px solid "+C.purple,borderRadius:20,padding:28 }}>
          <FF label="Admin Email"><input type="email" placeholder="admin@pawtraxx.com" value={email} onChange={function(e){setEmail(e.target.value);setErr("");}} /></FF>
          <FF label="Admin Password">
            <div style={{ position:"relative" }}>
              <input type={showPass?"text":"password"} placeholder="••••••••" value={pass}
                onChange={function(e){setPass(e.target.value);setErr("");}}
                onKeyDown={function(e){if(e.key==="Enter")attempt();}}
                style={{ paddingRight:44 }} />
              <button onClick={function(){setShowPass(function(v){return !v;})}}
                style={{ position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:13,color:C.muted,fontWeight:600 }}>
                {showPass?"Hide":"Show"}
              </button>
            </div>
          </FF>
          {err && <p style={{ color:C.red,fontSize:13,marginBottom:12,fontWeight:600 }}>{err}</p>}
          <button className="btnP" onClick={attempt} style={{ width:"100%",padding:13,fontSize:15,background:C.purple,marginTop:4 }}>
            Access Admin Panel
          </button>
          <p style={{ textAlign:"center",color:C.muted,fontSize:14,fontWeight:600,marginTop:14 }}>
            Unauthorized access is prohibited.
          </p>
        </div>
        <p style={{ textAlign:"center",color:C.muted,fontSize:15,fontWeight:700,marginTop:20 }}>
          <a href="#" onClick={function(e){e.preventDefault(); if(onBack) onBack();}} style={{ color:C.muted,textDecoration:"none" }}>← Back to PawTraxx</a>
        </p>
      </div>
    </div>
  );
}

// admin dashboard
function AdminDashboard({ onExit }) {
  var C = useTheme();
  var [view, setView] = useState("overview"); // overview | users | sessions
  var [selectedUser, setSelectedUser] = useState(null);
  var [search, setSearch] = useState("");
  var [confirmBan, setConfirmBan] = useState(null);
  var [resetPassUser, setResetPassUser] = useState(null);
  var [newPass, setNewPass] = useState("");
  var [resetMsg, setResetMsg] = useState("");
  var [refresh, setRefresh] = useState(0);

  var allUsers = JSON.parse(localStorage.getItem("pt_users") || "{}");
  var userList = Object.values(allUsers).filter(function(u){ return u.email !== ADMIN_EMAIL; });

  var filtered = userList.filter(function(u){
    return u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
  });

  function toggleBan(email) {
    var all = JSON.parse(localStorage.getItem("pt_users") || "{}");
    all[email] = Object.assign({}, all[email], { banned: !all[email].banned });
    localStorage.setItem("pt_users", JSON.stringify(all));
    setConfirmBan(null);
    setRefresh(function(r){ return r+1; });
    if (selectedUser && selectedUser.email === email) setSelectedUser(all[email]);
  }

  function resetPassword(email, password) {
    if (!password || password.length < 6) { setResetMsg("Password must be at least 6 characters."); return; }
    var all = JSON.parse(localStorage.getItem("pt_users") || "{}");
    var userName = all[email] ? all[email].name : "User";
    all[email] = Object.assign({}, all[email], { password: password });
    localStorage.setItem("pt_users", JSON.stringify(all));
    sendSimulatedEmail(
      email,
      "Your PawTraxx password has been reset 🔑",
      "Hi "+userName+",\n\nYour PawTraxx account password was reset by an administrator.\n\nIf you did not request this change, please contact support immediately.\n\nDate: "+new Date().toLocaleString()+"\n\n— The PawTraxx Team"
    );
    setResetMsg("✓ Password updated successfully.");
    setTimeout(function(){ setResetPassUser(null); setNewPass(""); setResetMsg(""); }, 1800);
  }

  function deleteUser(email) {
    if (!window.confirm("Permanently delete this user and all their data?")) return;
    var all = JSON.parse(localStorage.getItem("pt_users") || "{}");
    var userName = all[email] ? all[email].name : "User";
    sendSimulatedEmail(
      email,
      "Your PawTraxx account has been deleted",
      "Hi "+userName+",\n\nYour PawTraxx account and all associated data have been permanently deleted by an administrator.\n\nIf you believe this was done in error, please contact support.\n\nDate: "+new Date().toLocaleString()+"\n\n— The PawTraxx Team"
    );
    delete all[email];
    localStorage.setItem("pt_users", JSON.stringify(all));
    setSelectedUser(null);
    setRefresh(function(r){ return r+1; });
  }

  // Stats
  var totalUsers = userList.length;
  var totalDogs = userList.reduce(function(s,u){ return s+(u.dogs||[]).length; }, 0);
  var bannedCount = userList.filter(function(u){ return u.banned; }).length;
  var activeSessions = userList.filter(function(u){
    var s = JSON.parse(localStorage.getItem("pt_session")||"{}");
    return s.email === u.email;
  }).length;
  var totalSessions = userList.reduce(function(s,u){ return s+(u.sessions||[]).length; }, 0);
  var avgSession = (function(){
    var all2 = userList.reduce(function(acc,u){ return acc.concat((u.sessions||[]).filter(function(s){return s.duration!=null;})); },[]);
    if (!all2.length) return "—";
    return Math.round(all2.reduce(function(s,x){return s+x.duration;},0)/all2.length)+" min";
  })();

  var STAT_CARDS = [
    { icon:"👥", label:"Total Users",    val:totalUsers,    col:C.blue },
    { icon:"🐕", label:"Total Dogs",     val:totalDogs,     col:C.accent },
    { icon:"🔒", label:"Banned",         val:bannedCount,   col:C.red },
    { icon:"📊", label:"Total Sessions", val:totalSessions, col:C.purple },
    { icon:"⏱️", label:"Avg Session",    val:avgSession,    col:C.green },
    { icon:"🟢", label:"Active Now",     val:activeSessions,col:C.green },
  ];

  var NAV = [
    { id:"overview", icon:"📊", label:"Overview" },
    { id:"users",    icon:"👥", label:"Users" },
    { id:"sessions", icon:"⏱️", label:"Sessions" },
    { id:"notifications", icon:"🔔", label:"Notifications" },
    { id:"emails",   icon:"📧", label:"Email Log" },
  ];

  var isMobile = useIsMobile();

  return (
    <div style={{ display:"flex",flexDirection:isMobile?"column":"row",height:"100vh",overflow:"hidden",background:C.bg }}>

      {/* ── Mobile top header ── */}
      {isMobile && (
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",borderBottom:"1px solid "+C.border,background:C.card,flexShrink:0,height:52 }}>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            <span style={{ fontSize:20 }}>🛡️</span>
            <h1 style={{ fontFamily:"Fraunces",fontSize:18,fontWeight:800,color:C.purple,lineHeight:1 }}>Admin Panel</h1>
          </div>
          <button onClick={onExit} style={{ background:C.redFaint,border:"1px solid "+C.red,color:C.red,borderRadius:8,padding:"6px 12px",fontSize:12,fontWeight:700,cursor:"pointer" }}>
            🚪 Exit
          </button>
        </div>
      )}

      {/* ── Desktop sidebar ── */}
      {!isMobile && (
        <div style={{ width:240,borderRight:"1.5px solid "+C.border,display:"flex",flexDirection:"column",flexShrink:0,background:C.card }}>
          <div style={{ padding:"20px 18px 16px",borderBottom:"1px solid "+C.border }}>
            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
              <span style={{ fontSize:28 }}>🛡️</span>
              <div>
                <h1 style={{ fontFamily:"Fraunces",fontSize:18,fontWeight:800,color:C.purple,lineHeight:1 }}>Admin Panel</h1>
                <p style={{ color:C.muted,fontSize:13,fontWeight:600,marginTop:2 }}>PawTraxx</p>
              </div>
            </div>
          </div>
          <div style={{ flex:1,padding:"10px 8px" }}>
            {NAV.map(function(n){
              var active = view===n.id;
              return (
                <button key={n.id} onClick={function(){setView(n.id);setSelectedUser(null);}}
                  style={{ width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:10,background:active?C.purpleFaint:"transparent",border:"1.5px solid "+(active?C.purple:"transparent"),color:active?C.purple:C.muted,fontSize:14,fontWeight:active?700:400,cursor:"pointer",marginBottom:2,transition:"all .15s",textAlign:"left" }}>
                  <span style={{ fontSize:18 }}>{n.icon}</span>{n.label}
                </button>
              );
            })}
          </div>
          <div style={{ padding:"12px 8px",borderTop:"1px solid "+C.border }}>
            <button onClick={onExit}
              style={{ width:"100%",background:C.redFaint,border:"1.5px solid "+C.red,color:C.red,borderRadius:10,padding:"10px",fontSize:13,fontWeight:700,cursor:"pointer" }}>
              🚪 Exit Admin
            </button>
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <div style={{ flex:1,overflowY:"auto",padding:isMobile?"14px 14px 80px":28 }}>

        {/* ── Overview ── */}
        {view === "overview" && (
          <div className="fadeIn">
            <h2 style={{ fontFamily:"Fraunces",fontSize:isMobile?20:28,fontWeight:800,color:C.text,marginBottom:4 }}>Platform Overview</h2>
            <p style={{ color:C.text,fontSize:13,fontWeight:500,marginBottom:18,opacity:0.75 }}>Real-time stats across all registered users on this device.</p>
            <div style={{ display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"repeat(3,1fr)",gap:10,marginBottom:24 }}>
              {STAT_CARDS.map(function(s){
                return (
                  <div key={s.label} style={{ background:C.card,border:"1.5px solid "+C.border,borderRadius:14,padding:isMobile?"12px 14px":"18px 20px" }}>
                    <div style={{ fontSize:isMobile?22:30,marginBottom:6 }}>{s.icon}</div>
                    <p style={{ fontFamily:"Fraunces",fontSize:isMobile?20:26,fontWeight:900,color:s.col }}>{s.val}</p>
                    <p style={{ fontSize:12,fontWeight:700,color:C.text,marginTop:3 }}>{s.label}</p>
                  </div>
                );
              })}
            </div>

            <h3 style={{ fontFamily:"Fraunces",fontSize:16,fontWeight:700,color:C.text,marginBottom:12 }}>Recent Registrations</h3>
            <div style={{ background:C.card,border:"1.5px solid "+C.border,borderRadius:16,overflow:"hidden" }}>
              {userList.length === 0 && <p style={{ color:C.muted,textAlign:"center",padding:28 }}>No users registered yet.</p>}
              {userList.slice().sort(function(a,b){ return new Date(b.createdAt)-new Date(a.createdAt); }).slice(0,8).map(function(u,i,arr){
                return (
                  <div key={u.email} style={{ display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderBottom:i<arr.length-1?"1px solid "+C.border:"none",cursor:"pointer" }}
                    onClick={function(){ setSelectedUser(u); setView("users"); }}>
                    <div style={{ width:36,height:36,borderRadius:"50%",background:C.accentFaint,border:"1.5px solid "+C.border,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>
                      {u.photo ? <img src={u.photo} alt={u.name} style={{ width:"100%",height:"100%",objectFit:"cover" }} /> : "👤"}
                    </div>
                    <div style={{ flex:1,minWidth:0 }}>
                      <p style={{ fontWeight:700,fontSize:14,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{u.name}</p>
                      <p style={{ fontSize:12,color:C.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{u.email}</p>
                    </div>
                    <div style={{ textAlign:"right",flexShrink:0 }}>
                      <p style={{ fontSize:12,color:C.muted }}>{fmtDate(u.createdAt)}</p>
                      <p style={{ fontSize:12,color:C.accent,fontWeight:600 }}>{(u.dogs||[]).length+" 🐕"}</p>
                    </div>
                    {u.banned && <span style={{ background:C.redFaint,color:C.red,fontSize:10,fontWeight:800,padding:"2px 7px",borderRadius:99 }}>BANNED</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Users list ── */}
        {view === "users" && !selectedUser && (
          <div className="fadeIn">
            <div style={{ marginBottom:16 }}>
              <h2 style={{ fontFamily:"Fraunces",fontSize:isMobile?20:28,fontWeight:800,color:C.text,marginBottom:2 }}>All Users</h2>
              <p style={{ color:C.text,fontSize:13,fontWeight:600,opacity:0.75 }}>{totalUsers} registered user{totalUsers!==1?"s":""}</p>
            </div>
            <div style={{ position:"relative",marginBottom:14 }}>
              <span style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:14,color:C.muted,pointerEvents:"none" }}>🔍</span>
              <input placeholder="Search by name or email..." value={search} onChange={function(e){setSearch(e.target.value);}} style={{ paddingLeft:34,fontSize:14 }} />
            </div>
            {filtered.length === 0 && <p style={{ color:C.muted,textAlign:"center",padding:28 }}>No users found.</p>}
            <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
              {filtered.map(function(u){
                var sessions = u.sessions||[];
                var totalMins = sessions.filter(function(s){return s.duration!=null;}).reduce(function(a,s){return a+s.duration;},0);
                return (
                  <div key={u.email} style={{ background:C.card,border:"1.5px solid "+(u.banned?C.red:C.border),borderRadius:14,padding:14,cursor:"pointer",transition:"all .15s" }}
                    onClick={function(){ setSelectedUser(u); }}>
                    <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                      <div style={{ width:44,height:44,borderRadius:"50%",background:C.accentFaint,border:"1.5px solid "+C.border,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>
                        {u.photo ? <img src={u.photo} alt={u.name} style={{ width:"100%",height:"100%",objectFit:"cover" }} /> : "👤"}
                      </div>
                      <div style={{ flex:1,minWidth:0 }}>
                        <div style={{ display:"flex",alignItems:"center",gap:6,flexWrap:"wrap" }}>
                          <p style={{ fontFamily:"Fraunces",fontSize:15,fontWeight:700,color:C.text }}>{u.name}</p>
                          {u.banned && <span style={{ background:C.redFaint,color:C.red,fontSize:10,fontWeight:800,padding:"2px 7px",borderRadius:99 }}>BANNED</span>}
                        </div>
                        <p style={{ fontSize:12,color:C.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{u.email}</p>
                      </div>
                      <div style={{ textAlign:"right",flexShrink:0 }}>
                        <p style={{ fontSize:13,color:C.accent,fontWeight:700 }}>{(u.dogs||[]).length+" 🐕"}</p>
                        <p style={{ fontSize:12,color:C.muted }}>{sessions.length+" sessions"}</p>
                        {totalMins>0 && <p style={{ fontSize:12,color:C.purple,fontWeight:600 }}>{totalMins+" min"}</p>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── User Detail ── */}
        {view === "users" && selectedUser && (function(){
          var u = JSON.parse(localStorage.getItem("pt_users")||"{}")[selectedUser.email] || selectedUser;
          var sessions = u.sessions||[];
          var completedSessions = sessions.filter(function(s){return s.duration!=null;});
          var totalMins = completedSessions.reduce(function(a,s){return a+s.duration;},0);
          var avgMins = completedSessions.length ? Math.round(totalMins/completedSessions.length) : 0;
          var longestSession = completedSessions.reduce(function(max,s){return s.duration>max?s.duration:max;},0);
          return (
            <div className="fadeIn">
              <button onClick={function(){setSelectedUser(null);}} style={{ background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:14,fontWeight:600,marginBottom:16,display:"flex",alignItems:"center",gap:6 }}>
                ← Back to Users
              </button>
              <div style={{ background:C.card,border:"1.5px solid "+(u.banned?C.red:C.border),borderRadius:16,padding:isMobile?14:24,marginBottom:16 }}>
                {/* Header */}
                <div style={{ display:"flex",alignItems:"flex-start",gap:14,marginBottom:16 }}>
                  <div style={{ width:54,height:54,borderRadius:"50%",background:C.accentFaint,border:"2px solid "+C.border,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0 }}>
                    {u.photo ? <img src={u.photo} alt={u.name} style={{ width:"100%",height:"100%",objectFit:"cover" }} /> : "👤"}
                  </div>
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:2 }}>
                      <h2 style={{ fontFamily:"Fraunces",fontSize:isMobile?18:22,fontWeight:800,color:C.text }}>{u.name}</h2>
                      {u.banned && <span style={{ background:C.redFaint,color:C.red,fontSize:11,fontWeight:800,padding:"2px 8px",borderRadius:99 }}>BANNED</span>}
                    </div>
                    <p style={{ color:C.muted,fontSize:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{u.email}</p>
                    {u.phone && <p style={{ color:C.muted,fontSize:12 }}>{u.phone}</p>}
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:16 }}>
                  <button onClick={function(){ setResetPassUser(u); setNewPass(""); setResetMsg(""); }}
                    style={{ flex:1,minWidth:100,background:C.blueFaint,border:"1px solid "+C.blue,color:C.blue,borderRadius:8,padding:"8px 10px",fontSize:12,fontWeight:700,cursor:"pointer" }}>
                    🔑 Reset Password
                  </button>
                  <button onClick={function(){ setConfirmBan(u); }}
                    style={{ flex:1,minWidth:80,background:u.banned?C.greenFaint:C.redFaint,border:"1px solid "+(u.banned?C.green:C.red),color:u.banned?C.green:C.red,borderRadius:8,padding:"8px 10px",fontSize:12,fontWeight:700,cursor:"pointer" }}>
                    {u.banned?"🔓 Unban":"🔒 Ban"}
                  </button>
                  <button onClick={function(){ deleteUser(u.email); }}
                    style={{ flex:1,minWidth:80,background:C.redFaint,border:"1px solid "+C.red,color:C.red,borderRadius:8,padding:"8px 10px",fontSize:12,fontWeight:700,cursor:"pointer" }}>
                    🗑️ Delete
                  </button>
                </div>

                {/* Stats grid - 2 cols on mobile, 4 on desktop */}
                <div style={{ display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)",gap:8,marginBottom:14 }}>
                  {[
                    { label:"Dogs",       val:(u.dogs||[]).length, col:C.accent },
                    { label:"Sessions",   val:sessions.length,     col:C.blue },
                    { label:"Total Time", val:totalMins+" min",    col:C.purple },
                    { label:"Avg Session",val:avgMins+" min",      col:C.green },
                  ].map(function(s){
                    return (
                      <div key={s.label} style={{ background:C.bg,border:"1.5px solid "+C.border,borderRadius:10,padding:"10px 12px",textAlign:"center" }}>
                        <p style={{ fontFamily:"Fraunces",fontSize:18,fontWeight:800,color:s.col }}>{s.val}</p>
                        <p style={{ fontSize:11,fontWeight:700,color:C.text,marginTop:2 }}>{s.label}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Meta info - stacked on mobile */}
                <div style={{ display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:8,marginBottom:14 }}>
                  {[
                    { label:"REGISTERED",     val:fmtDate(u.createdAt) },
                    { label:"LAST LOGIN",      val:u.lastLoginAt ? fmtDate(u.lastLoginAt) : "—" },
                    { label:"TRAINER POINTS",  val:(u.trainerPoints||0)+" TP", col:C.accent },
                    { label:"LONGEST SESSION", val:longestSession>0?longestSession+" min":"—", col:C.purple },
                  ].map(function(s){
                    return (
                      <div key={s.label} style={{ background:C.bg,border:"1px solid "+C.border,borderRadius:10,padding:"10px 12px" }}>
                        <p style={{ fontSize:11,color:C.muted,fontWeight:700,marginBottom:3,letterSpacing:".05em" }}>{s.label}</p>
                        <p style={{ fontSize:14,fontWeight:700,color:s.col||C.text }}>{s.val}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Dogs list */}
                {(u.dogs||[]).length > 0 && (
                  <div>
                    <p style={{ fontSize:11,fontWeight:800,color:C.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:8 }}>Dogs</p>
                    <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
                      {(u.dogs||[]).map(function(d){
                        return (
                          <div key={d.id} style={{ display:"flex",alignItems:"center",gap:10,background:C.bg,border:"1px solid "+C.border,borderRadius:10,padding:"10px 12px" }}>
                            <div style={{ width:32,height:32,borderRadius:"50%",background:C.accentFaint,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0 }}>
                              {d.photo ? <img src={d.photo} alt={d.name} style={{ width:"100%",height:"100%",objectFit:"cover" }} /> : d.emoji}
                            </div>
                            <div style={{ flex:1,minWidth:0 }}>
                              <p style={{ fontWeight:700,fontSize:14,color:C.text }}>{d.name}</p>
                              <p style={{ fontSize:12,color:C.muted }}>{d.breed} · {d.age} yr{d.age!==1?"s":""} · {d.weight} lbs</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Sessions list */}
                {sessions.length > 0 && (
                  <div style={{ marginTop:14 }}>
                    <p style={{ fontSize:11,fontWeight:800,color:C.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:8 }}>Sessions</p>
                    <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
                      {sessions.slice().reverse().slice(0,10).map(function(s,i){
                        return (
                          <div key={i} style={{ display:"flex",alignItems:"center",gap:10,background:C.bg,border:"1px solid "+C.border,borderRadius:10,padding:"10px 12px" }}>
                            <div style={{ flex:1,minWidth:0 }}>
                              <p style={{ fontSize:13,fontWeight:700,color:C.text }}>{fmtTimestamp(s.loginAt)}</p>
                              {s.logoutAt && <p style={{ fontSize:12,color:C.muted }}>{"Logout: "+fmtTimestamp(s.logoutAt)}</p>}
                              {!s.logoutAt && <p style={{ fontSize:12,color:C.green,fontWeight:700 }}>Currently active</p>}
                            </div>
                            <div style={{ flexShrink:0 }}>
                              {s.duration != null
                                ? <span style={{ background:C.purpleFaint,color:C.purple,fontSize:12,fontWeight:800,padding:"4px 10px",borderRadius:8 }}>{s.duration+" min"}</span>
                                : <span style={{ background:C.greenFaint,color:C.green,fontSize:12,fontWeight:700,padding:"4px 10px",borderRadius:8 }}>Active</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* ── Email Log ── */}
        {view === "emails" && (
          <div className="fadeIn">
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,gap:10 }}>
              <div style={{ minWidth:0 }}>
                <h2 style={{ fontFamily:"Fraunces",fontSize:isMobile?20:28,fontWeight:800,color:C.text,marginBottom:2 }}>📧 Email Log</h2>
                <p style={{ color:C.text,fontSize:12,fontWeight:500,opacity:0.75,lineHeight:1.5 }}>Simulated emails sent to users.</p>
              </div>
              <button onClick={function(){ if(window.confirm("Clear all email logs?")){ localStorage.setItem(EMAIL_LOG_KEY,"[]"); setRefresh(function(r){return r+1;}); } }}
                style={{ background:C.redFaint,border:"1px solid "+C.red,color:C.red,borderRadius:8,padding:"7px 12px",fontSize:12,fontWeight:700,cursor:"pointer",flexShrink:0 }}>
                Clear
              </button>
            </div>
            {(function(){
              var emails = JSON.parse(localStorage.getItem(EMAIL_LOG_KEY)||"[]");
              if (!emails.length) return <p style={{ color:C.muted,textAlign:"center",padding:40 }}>No emails sent yet.</p>;
              return emails.map(function(e,i){
                return (
                  <div key={e.id} style={{ background:C.card,border:"1.5px solid "+C.border,borderRadius:14,padding:14,marginBottom:10 }}>
                    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8,gap:8 }}>
                      <div style={{ minWidth:0 }}>
                        <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:3,flexWrap:"wrap" }}>
                          <span style={{ fontSize:11,fontWeight:800,padding:"2px 7px",borderRadius:99,background:e.type==="sms"?C.blueFaint:C.greenFaint,color:e.type==="sms"?C.blue:C.green,flexShrink:0 }}>{e.type==="sms"?"📱 SMS":"📧 Email"}</span>
                          <p style={{ fontSize:14,fontWeight:800,color:C.text }}>{e.subject}</p>
                        </div>
                        <p style={{ fontSize:13,color:C.accent,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{"To: "+e.to}</p>
                      </div>
                      <span style={{ fontSize:11,color:C.muted,fontWeight:600,flexShrink:0 }}>{fmtTimestamp(e.sentAt)}</span>
                    </div>
                    <pre style={{ fontSize:12,color:C.text,background:C.bg,border:"1px solid "+C.border,borderRadius:8,padding:"10px 12px",whiteSpace:"pre-wrap",lineHeight:1.7,margin:0,fontFamily:"DM Sans,sans-serif",opacity:0.9,overflowX:"auto" }}>{e.body}</pre>
                  </div>
                );
              });
            })()}
          </div>
        )}

        {/* ── Notifications ── */}
        {view === "notifications" && (
          <div className="fadeIn">
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,gap:10 }}>
              <div>
                <h2 style={{ fontFamily:"Fraunces",fontSize:isMobile?20:28,fontWeight:800,color:C.text,marginBottom:2 }}>🔔 Notifications</h2>
                <p style={{ color:C.text,fontSize:12,fontWeight:500,opacity:0.75 }}>Account deletions and system events.</p>
              </div>
              <button onClick={function(){ if(window.confirm("Clear all notifications?")){ localStorage.setItem("pt_admin_notifications","[]"); setRefresh(function(r){return r+1;}); } }}
                style={{ background:C.redFaint,border:"1px solid "+C.red,color:C.red,borderRadius:8,padding:"7px 12px",fontSize:12,fontWeight:700,cursor:"pointer",flexShrink:0 }}>
                Clear
              </button>
            </div>
            {(function(){
              var notifications = JSON.parse(localStorage.getItem("pt_admin_notifications")||"[]");
              notifications.sort(function(a,b){ return new Date(b.timestamp) - new Date(a.timestamp); });
              if (!notifications.length) return <p style={{ color:C.muted,textAlign:"center",padding:40 }}>No notifications yet.</p>;
              return notifications.map(function(n){
                var isAccountDeletion = n.type === "account_deletion";
                return (
                  <div key={n.id} style={{ background:C.card,border:"2px solid "+(isAccountDeletion?C.red:C.accent),borderRadius:14,padding:14,marginBottom:12 }}>
                    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8,gap:8 }}>
                      <div style={{ flex:1,minWidth:0 }}>
                        <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:4 }}>
                          <span style={{ fontSize:16,flexShrink:0 }}>{isAccountDeletion?"🗑️":"🔔"}</span>
                          <p style={{ fontSize:14,fontWeight:800,color:isAccountDeletion?C.red:C.text,lineHeight:1.4 }}>{n.message}</p>
                        </div>
                        {isAccountDeletion && (
                          <div style={{ background:C.bg,border:"1.5px solid "+C.border,borderRadius:10,padding:12,marginTop:8 }}>
                            {[
                              { label:"Name",    val:n.userName },
                              { label:"Email",   val:n.userEmail, col:C.accent },
                              { label:"Phone",   val:n.userPhone },
                              { label:"Deleted", val:fmtTimestamp(n.timestamp) },
                            ].map(function(row){
                              return (
                                <div key={row.label} style={{ display:"flex",gap:8,marginBottom:4,alignItems:"flex-start" }}>
                                  <span style={{ fontSize:12,color:C.muted,fontWeight:600,width:52,flexShrink:0 }}>{row.label}:</span>
                                  <span style={{ fontSize:12,color:row.col||C.text,fontWeight:600,flex:1,wordBreak:"break-all" }}>{row.val}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      <span style={{ fontSize:11,color:C.muted,fontWeight:600,flexShrink:0 }}>{timeAgo(n.timestamp)}</span>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        )}

        {/* ── Sessions ── */}
        {view === "sessions" && (
          <div className="fadeIn">
            <h2 style={{ fontFamily:"Fraunces",fontSize:isMobile?20:28,fontWeight:800,color:C.text,marginBottom:4 }}>All Sessions</h2>
            <p style={{ color:C.text,fontSize:13,fontWeight:500,marginBottom:20,opacity:0.75 }}>Every login session recorded across all users.</p>
            {(function(){
              var allSessions = [];
              userList.forEach(function(u){
                (u.sessions||[]).forEach(function(s){
                  allSessions.push(Object.assign({},s,{userName:u.name,userEmail:u.email,userPhoto:u.photo}));
                });
              });
              allSessions.sort(function(a,b){ return new Date(b.loginAt)-new Date(a.loginAt); });
              if (!allSessions.length) return <p style={{ color:C.muted,textAlign:"center",padding:28 }}>No sessions recorded yet.</p>;
              return (
                <div style={{ background:C.card,border:"1.5px solid "+C.border,borderRadius:16,overflow:"hidden" }}>
                  {allSessions.map(function(s,i){
                    return (
                      <div key={i} style={{ display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderBottom:i<allSessions.length-1?"1px solid "+C.border:"none" }}>
                        <div style={{ width:34,height:34,borderRadius:"50%",background:C.accentFaint,border:"1.5px solid "+C.border,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0 }}>
                          {s.userPhoto ? <img src={s.userPhoto} style={{ width:"100%",height:"100%",objectFit:"cover" }} /> : "👤"}
                        </div>
                        <div style={{ flex:1,minWidth:0 }}>
                          <p style={{ fontSize:13,fontWeight:700,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{s.userName}</p>
                          <p style={{ fontSize:11,color:C.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{s.userEmail}</p>
                          <p style={{ fontSize:11,color:C.muted,marginTop:1 }}>{fmtTimestamp(s.loginAt)}</p>
                        </div>
                        <div style={{ flexShrink:0 }}>
                          {s.duration != null
                            ? <span style={{ background:C.purpleFaint,color:C.purple,fontSize:12,fontWeight:800,padding:"4px 10px",borderRadius:8 }}>{s.duration+" min"}</span>
                            : <span style={{ background:C.greenFaint,color:C.green,fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:8 }}>Active</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* ── Mobile bottom nav ── */}
      {isMobile && (
        <div style={{ position:"fixed",bottom:0,left:0,right:0,height:60,background:C.card,borderTop:"1px solid "+C.border,display:"flex",alignItems:"stretch",zIndex:500 }}>
          {NAV.map(function(n){
            var active = view===n.id;
            return (
              <button key={n.id} onClick={function(){ setView(n.id); setSelectedUser(null); }}
                style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,background:"none",border:"none",cursor:"pointer",WebkitTapHighlightColor:"transparent" }}>
                <span style={{ fontSize:18,opacity:active?1:0.5 }}>{n.icon}</span>
                <span style={{ fontSize:9,fontWeight:active?700:500,color:active?C.purple:C.muted }}>{n.label}</span>
                {active && <span style={{ position:"absolute",bottom:0,width:28,height:2,background:C.purple,borderRadius:2 }} />}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Reset password modal ── */}
      {resetPassUser && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}
          onClick={function(){ setResetPassUser(null); setNewPass(""); setResetMsg(""); }}>
          <div className="fadeIn" style={{ background:C.card,border:"1.5px solid "+C.blue,borderRadius:20,padding:24,maxWidth:420,width:"100%" }}
            onClick={function(e){ e.stopPropagation(); }}>
            <h3 style={{ fontFamily:"Fraunces",fontSize:20,fontWeight:800,color:C.blue,marginBottom:6 }}>🔑 Reset Password</h3>
            <p style={{ color:C.text,fontSize:14,marginBottom:20 }}>Set a new password for <strong>{resetPassUser.name}</strong></p>
            <FF label="New Password">
              <input type="password" placeholder="Min. 6 characters" value={newPass}
                onChange={function(e){ setNewPass(e.target.value); setResetMsg(""); }}
                onKeyDown={function(e){ if(e.key==="Enter") resetPassword(resetPassUser.email, newPass); }}
                autoFocus />
            </FF>
            {resetMsg && <p style={{ fontSize:13,fontWeight:600,marginBottom:12,color:resetMsg.startsWith("✓")?C.green:C.red }}>{resetMsg}</p>}
            <div style={{ display:"flex",gap:10,marginTop:4 }}>
              <button onClick={function(){ resetPassword(resetPassUser.email, newPass); }}
                style={{ flex:1,background:C.blue,border:"none",color:"#fff",borderRadius:10,padding:"12px",fontSize:14,fontWeight:700,cursor:"pointer" }}>
                Update
              </button>
              <button onClick={function(){ setResetPassUser(null); setNewPass(""); setResetMsg(""); }}
                style={{ flex:1,background:"transparent",border:"1.5px solid "+C.border,color:C.muted,borderRadius:10,padding:"12px",fontSize:14,cursor:"pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Ban confirm modal ── */}
      {confirmBan && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}
          onClick={function(){ setConfirmBan(null); }}>
          <div className="fadeIn" style={{ background:C.card,border:"1.5px solid "+(confirmBan.banned?C.green:C.red),borderRadius:20,padding:24,maxWidth:400,width:"100%" }}
            onClick={function(e){ e.stopPropagation(); }}>
            <h3 style={{ fontFamily:"Fraunces",fontSize:20,fontWeight:800,color:confirmBan.banned?C.green:C.red,marginBottom:10 }}>
              {confirmBan.banned ? "Unban User?" : "Ban User?"}
            </h3>
            <p style={{ color:C.text,fontSize:14,lineHeight:1.7,marginBottom:20 }}>
              {confirmBan.banned
                ? "This will restore "+confirmBan.name+"'s access to PawTraxx."
                : confirmBan.name+" will no longer be able to sign in."}
            </p>
            <div style={{ display:"flex",gap:10 }}>
              <button onClick={function(){ toggleBan(confirmBan.email); }}
                style={{ flex:1,background:confirmBan.banned?C.green:C.red,border:"none",color:"#fff",borderRadius:10,padding:"12px",fontSize:14,fontWeight:700,cursor:"pointer" }}>
                {confirmBan.banned ? "Yes, Unban" : "Yes, Ban"}
              </button>
              <button onClick={function(){ setConfirmBan(null); }}
                style={{ flex:1,background:"transparent",border:"1.5px solid "+C.border,color:C.muted,borderRadius:10,padding:"12px",fontSize:14,cursor:"pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PawTraxx() {
  var [darkMode, setDarkMode] = useState(function(){ return localStorage.getItem("pt_theme") !== "light"; });
  var C = makeTheme(darkMode);
  var appCss = makeAppCss(C);

  function toggleTheme() {
    setDarkMode(function(d) {
      var next = !d;
      localStorage.setItem("pt_theme", next ? "dark" : "light");
      return next;
    });
  }

  var [user, setUser] = useState(null);
  var [dogs, setDogs] = useState([]);
  var [activeDog, setActiveDog] = useState(null);
  var [activeView, setActiveView] = useState("board"); // "board" | "trainer"
  var [showAdd, setShowAdd] = useState(false);
  var [selectedBadge, setSelectedBadge] = useState(null);
  var [search, setSearch] = useState("");
  var [showSearch, setShowSearch] = useState(false);
  var [showProfile, setShowProfile] = useState(false);
  var [showRankTiers, setShowRankTiers] = useState(false);
  var [showWelcome, setShowWelcome] = useState(false);
  var [showEditDog, setShowEditDog] = useState(false);
  var [sideAlertDismissed, setSideAlertDismissed] = useState(false);
  var [activeTab, setActiveTab] = useState("overview");
  var [showCooldownInfo, setShowCooldownInfo] = useState(false);
  var [cooldownAlert, setCooldownAlert] = useState({ show: false, message: "", remaining: "" });
  var [upgradeModal, setUpgradeModal] = useState({ show: false, feature: "", recommendedTier: "", context: {} });
  var [showPricing, setShowPricing] = useState(false);
  var [mobileNav, setMobileNav] = useState("dogs"); // "dogs" | "board" | "trainer" | "profile"
  var isMobile = useIsMobile();

  var TAB_IDS = ["overview","schedule","food","vet","vaccines","meds","weight","heat","log","badges"];
  var [focusedSection, setFocusedSection] = useState(null); // "tabs" | "dogs" | null
  var [highlightedDogId, setHighlightedDogId] = useState(null);
  var dogListRef = useRef(null);

  // Scroll highlighted dog into view when it changes via keyboard
  useEffect(function() {
    if (!dogListRef.current) return;
    var el = dogListRef.current.querySelector("[data-highlighted='true']") || dogListRef.current.querySelector("[data-active='true']");
    if (el) el.scrollIntoView({ block:"nearest", behavior:"smooth" });
  }, [highlightedDogId, activeDog]);

  useEffect(function() {
    if (!user) return;
    function onKey(e) {
      var tag = document.activeElement && document.activeElement.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (showAdd || showEditDog || showProfile || showWelcome) return;
      if (e.key === "Escape") { setFocusedSection(null); return; }
      if (!focusedSection) return;

      if (focusedSection === "tabs" && activeDog) {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          setActiveTab(function(cur) {
            var idx = TAB_IDS.indexOf(cur);
            return TAB_IDS[(idx + 1) % TAB_IDS.length];
          });
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          setActiveTab(function(cur) {
            var idx = TAB_IDS.indexOf(cur);
            return TAB_IDS[(idx - 1 + TAB_IDS.length) % TAB_IDS.length];
          });
        }
      }

      if (focusedSection === "dogs" || showSearch) {
        var navList = showSearch
          ? dogs.filter(function(d){ return d.name.toLowerCase().includes(search.toLowerCase()) || d.breed.toLowerCase().includes(search.toLowerCase()); })
          : dogs;
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setHighlightedDogId(function(cur) {
            if (!navList.length) return cur;
            var start = cur || (activeDog && navList.find(function(d){ return d.id === activeDog.id; }) ? activeDog.id : null);
            if (!start) return navList[0].id;
            var idx = navList.findIndex(function(d){ return d.id === start; });
            if (idx === -1) return navList[0].id;
            return navList[(idx + 1) % navList.length].id;
          });
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setHighlightedDogId(function(cur) {
            if (!navList.length) return cur;
            var start = cur || (activeDog && navList.find(function(d){ return d.id === activeDog.id; }) ? activeDog.id : null);
            if (!start) return navList[navList.length - 1].id;
            var idx = navList.findIndex(function(d){ return d.id === start; });
            if (idx === -1) return navList[navList.length - 1].id;
            return navList[(idx - 1 + navList.length) % navList.length].id;
          });
        } else if (e.key === "Enter") {
          var pick = navList.find(function(d){ return d.id === highlightedDogId; }) || (navList.length ? navList[0] : null);
          if (pick) {
            setActiveDog(pick);
            setHighlightedDogId(null);
            if (showSearch) { setSearch(""); setShowSearch(false); }
          }
        }
      } else if (e.key === "Enter" && highlightedDogId) {
        var pick = dogs.find(function(d){ return d.id === highlightedDogId; });
        if (pick) { setActiveDog(pick); setHighlightedDogId(null); }
      }
    }
    document.addEventListener("keydown", onKey);
    return function() { document.removeEventListener("keydown", onKey); };
  }, [user, dogs, activeDog, highlightedDogId, focusedSection, showAdd, showEditDog, showProfile, showWelcome, showSearch, search]);

  useEffect(function() {
    var s = localStorage.getItem("pt_session");
    if (s) {
      var email = JSON.parse(s).email;
      var users = JSON.parse(localStorage.getItem("pt_users") || "{}");
      if (users[email]) { 
        setUser(users[email]); 
        setDogs(users[email].dogs || []); 
      }
    }
  }, []);

  var persist = useCallback(function(list) {
    if (!user) return;
    var all = JSON.parse(localStorage.getItem("pt_users") || "{}");
    all[user.email] = Object.assign({}, all[user.email], { dogs: list });
    localStorage.setItem("pt_users", JSON.stringify(all));
    setDogs(list);
  }, [user]);

  function persistUser(updates) {
    var all = JSON.parse(localStorage.getItem("pt_users") || "{}");
    var updated = Object.assign({}, user, updates);
    all[user.email] = Object.assign({}, all[user.email], updates);
    localStorage.setItem("pt_users", JSON.stringify(all));
    setUser(updated);
  }

  function earnTP(amount, reason) {
    var all = JSON.parse(localStorage.getItem("pt_users") || "{}");
    var cur = all[user.email] || {};
    var newTP = (cur.trainerPoints || 0) + amount;
    var newLog = (cur.tpLog || []).concat([{ amount: amount, reason: reason, ts: new Date().toISOString() }]).slice(-200);
    var updates = { trainerPoints: newTP, tpLog: newLog };
    all[user.email] = Object.assign({}, cur, updates);
    localStorage.setItem("pt_users", JSON.stringify(all));
    setUser(function(u){ return Object.assign({}, u, updates); });
  }

  function sendNotification(title, body, icon) {
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      try { new Notification(title, { body: body, icon: icon || "https://cdn.jsdelivr.net/npm/twemoji@latest/2/svg/1f43e.svg" }); } catch(e) {}
    }
  }

  function requestNotifPermission() {
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }

  function login(u) {
    // Track session start
    var allUsers = JSON.parse(localStorage.getItem("pt_users") || "{}");
    var sessionEntry = { loginAt: new Date().toISOString(), logoutAt: null, duration: null };
    var sessions = (allUsers[u.email].sessions || []).concat([sessionEntry]);
    allUsers[u.email] = Object.assign({}, allUsers[u.email], { sessions: sessions, lastLoginAt: new Date().toISOString() });
    localStorage.setItem("pt_users", JSON.stringify(allUsers));
    var updatedUser = Object.assign({}, u, { sessions: sessions, lastLoginAt: new Date().toISOString() });
    setUser(updatedUser); setDogs(updatedUser.dogs||[]);
    localStorage.setItem("pt_session", JSON.stringify({ email: u.email, loginAt: sessionEntry.loginAt }));
    setShowWelcome(true);
    requestNotifPermission();
  }
  function logout() {
    // Track session end
    if (user) {
      var sessData = JSON.parse(localStorage.getItem("pt_session") || "{}");
      var loginAt = sessData.loginAt;
      var allUsers = JSON.parse(localStorage.getItem("pt_users") || "{}");
      if (allUsers[user.email]) {
        var now = new Date().toISOString();
        var dur = loginAt ? Math.round((Date.now() - new Date(loginAt)) / 60000) : 0;
        var sessions = (allUsers[user.email].sessions || []).map(function(s, i, arr) {
          return i === arr.length - 1 && !s.logoutAt ? Object.assign({}, s, { logoutAt: now, duration: dur }) : s;
        });
        allUsers[user.email] = Object.assign({}, allUsers[user.email], { sessions: sessions });
        localStorage.setItem("pt_users", JSON.stringify(allUsers));
      }
    }
    setUser(null); setDogs([]); setActiveDog(null); localStorage.removeItem("pt_session");
  }
  function addDog(dog) { if(dogs.length>=100){alert("Max 100 dogs.");return;} persist(dogs.concat([dog])); setShowAdd(false); setActiveDog(dog); earnTP(TP_VALUES.add_dog, "Added a new dog: "+dog.name); }
  var updateDog = useCallback(function(upd) {
    var newList = dogs.map(function(d){ return d.id===upd.id?upd:d; });
    persist(newList);
    // Keep activeDog reference fresh if it's the same dog being updated
    setActiveDog(function(cur){ return cur && cur.id===upd.id ? upd : cur; });
  }, [dogs, persist]);
  function deleteDog(id) { persist(dogs.filter(function(d){ return d.id!==id; })); setActiveDog(null); }

  // check notifications every minute
  useEffect(function() {
    if (!user || !dogs.length) return;
    var notifiedKey = "pp_notified_" + user.email;
    var notified = JSON.parse(localStorage.getItem(notifiedKey) || "{}");

    function check() {
      var now = new Date();
      var today = now.toDateString();
      var updatedNotified = Object.assign({}, notified);

      dogs.forEach(function(dog) {
        // Feeding overdue check
        var feedKey = "feed_" + dog.id + "_" + today;
        if (!notified[feedKey] && dog.lastFed) {
          var msSinceFed = now - new Date(dog.lastFed);
          if (msSinceFed > 7 * 3600000) {
            sendNotification("🍽️ " + dog.name + " is hungry!", dog.name + " hasn't been fed in over 7 hours.", null);
            updatedNotified[feedKey] = true;
          }
        }
        // Outside overdue
        var outKey = "out_" + dog.id + "_" + today + "_" + now.getHours();
        if (!notified[outKey] && dog.lastOutside) {
          var msSinceOut = now - new Date(dog.lastOutside);
          if (msSinceOut > 6 * 3600000) {
            sendNotification("🌳 " + dog.name + " needs to go outside!", "It's been over 6 hours since their last outing.", null);
            updatedNotified[outKey] = true;
          }
        }
        // Vet appointment today or tomorrow
        (dog.vetAppointments || []).forEach(function(a) {
          var du = daysUntil(a.date);
          var vetKey = "vet_" + a.id + "_" + today;
          if (!notified[vetKey] && (du === 0 || du === 1)) {
            var when = du === 0 ? "today" : "tomorrow";
            sendNotification("🩺 Vet appointment " + when + "!", dog.name + ": " + a.reason + (a.vet ? " with " + a.vet : ""), null);
            updatedNotified[vetKey] = true;
          }
        });
        // Overdue vaccines
        (dog.vaccines || []).forEach(function(v) {
          var vaxKey = "vax_" + v.id + "_" + today;
          if (!notified[vaxKey] && v.nextDate && isOverdue(v.nextDate)) {
            var label = v.name === "Other" ? (v.customName || "Vaccine") : v.name;
            sendNotification("💉 " + dog.name + "'s " + label + " is overdue!", "Please schedule a vet visit soon.", null);
            updatedNotified[vaxKey] = true;
          }
        });
        // Medication ending soon
        (dog.medications || []).forEach(function(m) {
          if (!m.active || !m.endDate) return;
          var medKey = "med_" + m.id + "_" + today;
          if (!notified[medKey] && isDueSoon(m.endDate, 3)) {
            sendNotification("💊 " + dog.name + "'s " + m.name + " is ending soon!", "Only " + daysUntil(m.endDate) + " day(s) of medication remaining.", null);
            updatedNotified[medKey] = true;
          }
        });
        // Medication dose reminders (based on frequency)
        (dog.medications || []).forEach(function(m) {
          if (!m.active) return;
          var lastGiven = m.lastGiven ? new Date(m.lastGiven) : null;
          var msSinceLast = lastGiven ? (now - lastGiven) : Infinity;
          var freqMs = null;
          if (m.frequency === "Once daily") freqMs = 24 * 3600000;
          else if (m.frequency === "Twice daily") freqMs = 12 * 3600000;
          else if (m.frequency === "Every 8 hours") freqMs = 8 * 3600000;
          else if (m.frequency === "Every other day") freqMs = 48 * 3600000;
          else if (m.frequency === "Weekly") freqMs = 7 * 24 * 3600000;
          else if (m.frequency === "Monthly") freqMs = 30 * 24 * 3600000;
          if (!freqMs) return;
          var doseKey = "dosetime_" + m.id + "_" + today + "_" + now.getHours();
          if (!notified[doseKey] && msSinceLast >= freqMs) {
            sendNotification("💊 Time to give " + dog.name + " their " + m.name + "!", (m.dose ? m.dose + " \xB7 " : "") + m.frequency, null);
            updatedNotified[doseKey] = true;
          }
        });
        // Heat cycle upcoming
        if (dog.gender === "female" && dog.lastHeatDate) {
          var h = getHeatStatus(dog);
          var heatKey = "heat_" + dog.id + "_" + today;
          if (!notified[heatKey] && h && h.upcoming && h.daysUntilNext <= 3) {
            sendNotification("🌸 " + dog.name + "'s heat cycle is coming!", "Estimated in " + h.daysUntilNext + " day(s). Prepare supplies.", null);
            updatedNotified[heatKey] = true;
          }
        }
      });

      notified = updatedNotified;
      localStorage.setItem(notifiedKey, JSON.stringify(updatedNotified));
    }

    check();
    var interval = setInterval(check, 60000);
    return function() { clearInterval(interval); };
  }, [user, dogs]);

  var filtered = dogs.filter(function(d){ return d.name.toLowerCase().includes(search.toLowerCase()) || d.breed.toLowerCase().includes(search.toLowerCase()); });

  var sideAlerts = dogs.filter(function(d) {
    var h = d.gender==="female" ? getHeatStatus(d) : null;
    var hasOvVax = (d.vaccines||[]).some(function(v){ return v.nextDate&&isOverdue(v.nextDate); });
    var todayAppt = (d.vetAppointments||[]).some(function(a){ var du=daysUntil(a.date); return du>=0&&du<=1; });
    return (h&&(h.upcoming||h.inHeat)) || hasOvVax || todayAppt;
  });

  // check if admin
  var [adminAuthed, setAdminAuthed] = useState(function(){ return localStorage.getItem("pt_admin_session") === "granted"; });
  var [showAdminLogin, setShowAdminLogin] = useState(false);

  useEffect(function() {
    function checkHash() {
      if (window.location.hash === "#pawtraxx-admin") {
        setShowAdminLogin(true);
      }
    }
    checkHash();
    window.addEventListener("hashchange", checkHash);
    return function() { window.removeEventListener("hashchange", checkHash); };
  }, []);

  if (showAdminLogin && !adminAuthed) return (
    <ThemeContext.Provider value={C}>
      <div><style>{appCss}</style>
        <AdminLogin onAuth={function(){ setAdminAuthed(true); localStorage.setItem("pt_admin_session","granted"); setShowAdminLogin(false); }} onBack={function(){ setShowAdminLogin(false); window.location.hash=""; }} />
      </div>
    </ThemeContext.Provider>
  );

  if (adminAuthed) return (
    <ThemeContext.Provider value={C}>
      <div><style>{appCss}</style>
        <AdminDashboard onExit={function(){ setAdminAuthed(false); localStorage.removeItem("pt_admin_session"); window.location.hash = ""; }} />
      </div>
    </ThemeContext.Provider>
  );

  if (!user) return (
    <ThemeContext.Provider value={C}>
      <div>
        <style>{appCss}</style>
        <AdminAccessTrigger />
        <Auth onLogin={login} />
      </div>
    </ThemeContext.Provider>
  );

  return (
    <ThemeContext.Provider value={C}>
    <div>
      <style>{appCss}</style>

      {/* ── MOBILE LAYOUT ── */}
      {isMobile ? (
        <div style={{ display:"flex",flexDirection:"column",height:"100vh",background:C.bg,overflow:"hidden" }}>

          {/* Mobile top header */}
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",borderBottom:"1px solid "+C.border,background:C.card,flexShrink:0,height:56 }}>
            {activeDog ? (
              <button onClick={function(){ setActiveDog(null); setMobileNav("dogs"); }} style={{ background:"none",border:"none",color:C.accent,fontSize:15,fontWeight:700,display:"flex",alignItems:"center",gap:6,cursor:"pointer",padding:0 }}>
                &#8592; Dogs
              </button>
            ) : (
              <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 70" width="28" height="28">
                  <defs>
                    <linearGradient id="pawGradMobile" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor:"#D2691E",stopOpacity:1 }} />
                      <stop offset="100%" style={{ stopColor:"#8B4513",stopOpacity:1 }} />
                    </linearGradient>
                  </defs>
                  <g transform="translate(35,35)">
                    <circle cx="0" cy="0" r="28" fill="url(#pawGradMobile)"/>
                    <ellipse cx="-18" cy="-14" rx="10" ry="16" fill="url(#pawGradMobile)" transform="rotate(-30 -18 -14)"/>
                    <ellipse cx="18" cy="-14" rx="10" ry="16" fill="url(#pawGradMobile)" transform="rotate(30 18 -14)"/>
                    <ellipse cx="0" cy="6" rx="18" ry="14" fill="#F4E4C1" opacity="0.6"/>
                    <circle cx="-10" cy="-4" r="4" fill="#1F2937"/>
                    <circle cx="10" cy="-4" r="4" fill="#1F2937"/>
                    <ellipse cx="0" cy="8" rx="5" ry="4" fill="#1F2937"/>
                    <ellipse cx="0" cy="16" rx="3" ry="5" fill="#FF6B9D" opacity="0.8"/>
                  </g>
                </svg>
                <h1 style={{ fontFamily:"Fraunces",fontSize:20,fontWeight:800,color:C.accent,letterSpacing:"-.5px" }}>PawTraxx</h1>
              </div>
            )}

            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
              {activeDog && (
                <span style={{ fontFamily:"Fraunces",fontSize:16,fontWeight:800,color:C.text }}>{activeDog.name}</span>
              )}
              <button onClick={function(){ setShowProfile(true); }}
                style={{ width:36,height:36,borderRadius:"50%",background:C.bg,border:"2px solid "+C.border,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",padding:0,flexShrink:0 }}>
                {user.photo ? <img src={user.photo} alt={user.name} style={{ width:"100%",height:"100%",objectFit:"cover" }} /> : <span style={{ fontSize:17 }}>👤</span>}
              </button>
            </div>
          </div>

          {/* Mobile content area */}
          <div style={{ flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch" }}>

            {/* Dogs list screen */}
            {!activeDog && mobileNav === "dogs" && (
              <div className="fadeIn" style={{ padding:14 }}>
                {/* Search bar */}
                <div style={{ position:"relative",marginBottom:12 }}>
                  <span style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:16,pointerEvents:"none" }}>🔍</span>
                  <input placeholder="Search by name or breed..." value={search} onChange={function(e){ setSearch(e.target.value); }}
                    style={{ paddingLeft:38,fontSize:14 }} />
                </div>

                {/* Alerts banner */}
                {sideAlerts.length > 0 && !sideAlertDismissed && (
                  <div style={{ background:C.accentFaint,border:"1.5px solid rgba(244,162,77,.3)",borderRadius:12,padding:"12px 14px",marginBottom:12 }}>
                    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8 }}>
                      <p style={{ color:C.accent,fontSize:13,fontWeight:800,textTransform:"uppercase",letterSpacing:".08em" }}>⚠️ ALERTS</p>
                      <button className="btnI" style={{ width:20,height:20,fontSize:10 }} onClick={function(){ setSideAlertDismissed(true); }}>✕</button>
                    </div>
                    {sideAlerts.slice(0,3).map(function(d) {
                      var h = d.gender==="female" ? getHeatStatus(d) : null;
                      var hasOvV = (d.vaccines||[]).some(function(v){ return v.nextDate&&isOverdue(v.nextDate); });
                      var msg = h&&h.inHeat ? "heat day "+h.heatDay : h&&h.upcoming ? "heat in "+h.daysUntilNext+"d" : hasOvV ? "vaccine due" : "appt soon";
                      return (
                        <p key={d.id} style={{ color:C.text,fontSize:13,fontWeight:600,marginBottom:4 }}>
                          <strong>{d.name}</strong>{": "+msg}
                        </p>
                      );
                    })}
                  </div>
                )}

                {/* Dog cards */}
                {filtered.length === 0 && (
                  <div style={{ textAlign:"center",padding:"48px 20px",color:C.muted }}>
                    <div style={{ fontSize:48,marginBottom:12 }}>🐕</div>
                    <p style={{ fontSize:16,fontWeight:600,color:C.text,marginBottom:6 }}>{dogs.length===0?"No dogs yet!":"No results."}</p>
                    {dogs.length===0 && <p style={{ fontSize:14,color:C.muted }}>Tap + to add your first pup</p>}
                  </div>
                )}
                {filtered.map(function(dog) {
                  var heat = dog.gender==="female" ? getHeatStatus(dog) : null;
                  var hasAlert = (heat&&(heat.upcoming||heat.inHeat)) || ((dog.vaccines||[]).some(function(v){ return v.nextDate&&isOverdue(v.nextDate); }));
                  return (
                    <div key={dog.id} onClick={function(){ setActiveDog(dog); setActiveTab("overview"); }}
                      style={{ display:"flex",alignItems:"center",gap:12,padding:"14px 14px",borderRadius:14,cursor:"pointer",background:C.card,border:"1.5px solid "+C.border,marginBottom:8,transition:"all .15s",WebkitTapHighlightColor:"transparent" }}
                      onTouchStart={function(e){ e.currentTarget.style.background=C.cardHov; }}
                      onTouchEnd={function(e){ e.currentTarget.style.background=C.card; }}>
                      <div style={{ width:48,height:48,borderRadius:"50%",background:C.accentFaint,border:"1.5px solid "+C.border,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0 }}>
                        {dog.photo ? <img src={dog.photo} alt={dog.name} style={{ width:"100%",height:"100%",objectFit:"cover" }} /> : dog.emoji}
                      </div>
                      <div style={{ flex:1,minWidth:0 }}>
                        <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:2 }}>
                          <p style={{ fontWeight:700,fontSize:16,color:C.text }}>{dog.name}</p>
                          <span style={{ fontSize:16,color:dog.gender==="female"?"#f472b6":"#60a5fa" }}>{dog.gender==="female"?"♀":"♂"}</span>
                          {hasAlert && <span style={{ width:8,height:8,borderRadius:"50%",background:heat&&heat.inHeat?C.pink:C.yellow,display:"inline-block",flexShrink:0 }} />}
                        </div>
                        <p style={{ color:C.muted,fontSize:13 }}>{dog.breed}</p>
                        <p style={{ color:C.muted,fontSize:12,marginTop:2 }}>Fed {timeAgo(dog.lastFed)} · Out {timeAgo(dog.lastOutside)}</p>
                      </div>
                      <span style={{ color:C.muted,fontSize:20 }}>›</span>
                    </div>
                  );
                })}

                <div style={{ height:16 }} />
              </div>
            )}

            {/* Board screen */}
            {!activeDog && mobileNav === "board" && (
              <div className="fadeIn" style={{ padding:14 }}>
                <DogBoard dogs={dogs} onSelect={function(d){ setActiveDog(d); setMobileNav("dogs"); }} onUpdate={updateDog} onAdd={function(){ setShowAdd(true); }} earnTP={earnTP} setActiveTab={setActiveTab} setCooldownAlert={setCooldownAlert} />
              </div>
            )}

            {/* Trainer screen */}
            {!activeDog && mobileNav === "trainer" && (
              <div className="fadeIn" style={{ padding:14 }}>
                <TrainerView user={user} dogs={dogs} onShowRankTiers={function(){ setShowRankTiers(true); }} />
              </div>
            )}

            {/* Dog detail */}
            {activeDog && (
              <div className="fadeIn" style={{ padding:"8px 12px 100px" }}>
                <DogDetail dog={activeDog} onUpdate={updateDog} onDelete={function(id){ deleteDog(id); setMobileNav("dogs"); }} allDogs={dogs} onEdit={function(){ setShowEditDog(true); }} activeTab={activeTab} setActiveTab={setActiveTab} focusedSection={focusedSection} setFocusedSection={setFocusedSection} setSelectedBadge={setSelectedBadge} earnTP={earnTP} setCooldownAlert={setCooldownAlert} />
              </div>
            )}
          </div>

          {/* Bottom nav bar */}
          {!activeDog && (
            <div style={{ position:"fixed",bottom:0,left:0,right:0,height:64,background:C.card,borderTop:"1px solid "+C.border,display:"flex",alignItems:"stretch",zIndex:500,paddingBottom:"env(safe-area-inset-bottom)" }}>
              {[
                { id:"dogs",    icon:"🐕", label:"My Dogs" },
                { id:"board",   icon:"📋", label:"Board"   },
                { id:"add",     icon:"＋", label:"Add",  special:true },
                { id:"trainer", icon:"🏆", label:"Trainer" },
                { id:"signout", icon:"🚪", label:"Sign Out" },
              ].map(function(item) {
                if (item.special) {
                  return (
                    <button key="add" onClick={function(){ setShowAdd(true); }}
                      style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"none",border:"none",cursor:"pointer",WebkitTapHighlightColor:"transparent" }}>
                      <div style={{ width:44,height:44,borderRadius:"50%",background:C.accent,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:26,fontWeight:300,lineHeight:1,marginBottom:0,boxShadow:"0 4px 16px "+C.accentGlow,transform:"translateY(-8px)" }}>＋</div>
                    </button>
                  );
                }
                if (item.id === "signout") {
                  return (
                    <button key="signout" onClick={logout}
                      style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,background:"none",border:"none",cursor:"pointer",WebkitTapHighlightColor:"transparent" }}>
                      <span style={{ fontSize:20 }}>{item.icon}</span>
                      <span style={{ fontSize:10,fontWeight:600,color:C.red }}>{item.label}</span>
                    </button>
                  );
                }
                var isActive = mobileNav === item.id;
                return (
                  <button key={item.id} onClick={function(){ setMobileNav(item.id); }}
                    style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,background:"none",border:"none",cursor:"pointer",WebkitTapHighlightColor:"transparent",transition:"all .15s" }}>
                    <span style={{ fontSize:20,filter:isActive?"none":"grayscale(0.4)",opacity:isActive?1:0.55 }}>{item.icon}</span>
                    <span style={{ fontSize:10,fontWeight:isActive?700:500,color:isActive?C.accent:C.muted }}>{item.label}</span>
                    {isActive && <span style={{ position:"absolute",bottom:0,width:32,height:2,background:C.accent,borderRadius:2 }} />}
                  </button>
                );
              })}
            </div>
          )}

          {/* Back to dogs bottom bar when viewing a dog */}
          {activeDog && (
            <div style={{ position:"fixed",bottom:0,left:0,right:0,padding:"10px 16px",background:C.card,borderTop:"1px solid "+C.border,display:"flex",gap:8,zIndex:500,paddingBottom:"calc(10px + env(safe-area-inset-bottom))" }}>
              <button onClick={function(){ setActiveDog(null); setMobileNav("dogs"); }} className="btnG" style={{ flex:1,padding:"12px",fontSize:14,fontWeight:600 }}>← Back to Dogs</button>
              <button onClick={function(){ setShowEditDog(true); }} className="btnP" style={{ flex:1,padding:"12px",fontSize:14 }}>Edit {activeDog.name}</button>
            </div>
          )}
        </div>

      ) : (

      /* ── DESKTOP LAYOUT ── */
      <div style={{ display:"flex",height:"100vh",overflow:"hidden",background:C.bg }}>

        <div style={{ width:268,borderRight:"1.5px solid "+C.border,display:"flex",flexDirection:"column",flexShrink:0,overflowY:"auto" }}>
          <div style={{ padding:"18px 16px 14px",borderBottom:"1px solid "+C.border }}>
            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 70" width="36" height="36" style={{ flexShrink:0 }}>
                <defs>
                  <linearGradient id="pawGradSidebar" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor:"#D2691E",stopOpacity:1 }} />
                    <stop offset="100%" style={{ stopColor:"#8B4513",stopOpacity:1 }} />
                  </linearGradient>
                  <filter id="dropSidebar">
                    <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.15"/>
                  </filter>
                </defs>
                <g transform="translate(35, 35)">
                  <circle cx="0" cy="0" r="28" fill="url(#pawGradSidebar)" filter="url(#dropSidebar)"/>
                  <ellipse cx="-18" cy="-14" rx="10" ry="16" fill="url(#pawGradSidebar)" transform="rotate(-30 -18 -14)" filter="url(#dropSidebar)"/>
                  <ellipse cx="18" cy="-14" rx="10" ry="16" fill="url(#pawGradSidebar)" transform="rotate(30 18 -14)" filter="url(#dropSidebar)"/>
                  <ellipse cx="0" cy="6" rx="18" ry="14" fill="#F4E4C1" opacity="0.6"/>
                  <circle cx="-10" cy="-4" r="4" fill="#1F2937"/>
                  <circle cx="-8" cy="-6" r="1.6" fill="#FFFFFF" opacity="0.8"/>
                  <circle cx="10" cy="-4" r="4" fill="#1F2937"/>
                  <circle cx="12" cy="-6" r="1.6" fill="#FFFFFF" opacity="0.8"/>
                  <ellipse cx="0" cy="8" rx="5" ry="4" fill="#1F2937"/>
                  <path d="M 0,10 Q -6,14 -10,13" stroke="#1F2937" strokeWidth="2" fill="none" strokeLinecap="round"/>
                  <path d="M 0,10 Q 6,14 10,13" stroke="#1F2937" strokeWidth="2" fill="none" strokeLinecap="round"/>
                  <ellipse cx="0" cy="16" rx="3" ry="5" fill="#FF6B9D" opacity="0.8"/>
                </g>
              </svg>
              <div style={{ flex:1,minWidth:0 }}>
                <h1 style={{ fontFamily:"Fraunces",fontSize:21,fontWeight:800,color:C.accent,letterSpacing:"-.5px",lineHeight:1 }}>PawTraxx</h1>
                <p style={{ color:C.muted,fontSize:16,marginTop:1,fontWeight:700 }}>{user.name}</p>
              </div>
              <button onClick={function(){ setShowProfile(true); }}
                style={{ width:44,height:44,borderRadius:"50%",background:C.bg,border:"2px solid "+C.border,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,padding:0,transition:"border-color .18s" }}
                title="Edit profile"
                onMouseEnter={function(e){e.currentTarget.style.borderColor=C.accent;}}
                onMouseLeave={function(e){e.currentTarget.style.borderColor=C.border;}}>
                {user.photo
                  ? <img src={user.photo} alt={user.name} style={{ width:"100%",height:"100%",objectFit:"cover" }} />
                  : <span style={{ fontSize:20 }}>👤</span>}
              </button>
            </div>
          </div>

          <div style={{ padding:"10px 10px 6px",display:"flex",alignItems:"center",gap:6 }}>
            <button onClick={function(){
              setShowSearch(function(v){ if(v){ setSearch(""); } return !v; });
            }} style={{ background:showSearch?C.accentFaint:"transparent",border:"1.5px solid "+(showSearch?C.accent:C.border),color:showSearch?C.accent:C.muted,borderRadius:9,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0,cursor:"pointer",transition:"all .18s" }}
              title="Search">
              &#x1F50D;
            </button>
            {showSearch && (
              <input
                autoFocus
                placeholder="Search by name or breed..."
                value={search}
                onChange={function(e){setSearch(e.target.value); setHighlightedDogId(null);}}
                onKeyDown={function(e){
                  if(e.key==="ArrowDown"||e.key==="ArrowUp"){ e.preventDefault(); }
                  if(e.key==="Enter"){
                    var vis=filtered;
                    if(!vis.length) return;
                    var cur = activeDog && vis.find(function(d){ return d.id===activeDog.id; });
                    var pick = cur || vis[0];
                    setActiveDog(pick); setSearch(""); setShowSearch(false);
                  }
                  if(e.key==="Escape"){ setSearch(""); setShowSearch(false); }
                }}
                style={{ fontSize:13,flex:1,padding:"6px 10px" }}
              />
            )}
          </div>

          {sideAlerts.length > 0 && !sideAlertDismissed && (
            <div style={{ margin:"0 10px 6px",background:C.accentFaint,border:"1.5px solid rgba(244,162,77,.3)",borderRadius:12,padding:14 }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
                <p style={{ color:C.accent,fontSize:14,fontWeight:800,textTransform:"uppercase",letterSpacing:".08em" }}>⚠️ ALERTS</p>
                <button className="btnI" style={{ width:20,height:20,fontSize:10 }} onClick={function(){ setSideAlertDismissed(true); }}>&#x2715;</button>
              </div>
              {sideAlerts.map(function(d) {
                var h = d.gender==="female" ? getHeatStatus(d) : null;
                var hasOvV = (d.vaccines||[]).some(function(v){ return v.nextDate&&isOverdue(v.nextDate); });
                var msg = h&&h.inHeat ? "heat day "+h.heatDay : h&&h.upcoming ? "heat in "+h.daysUntilNext+"d" : hasOvV ? "vaccine due" : "appt soon";
                return (
                  <div key={d.id} style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8 }}>
                    <div style={{ width:24,height:24,borderRadius:"50%",background:C.accentFaint,border:"1px solid "+C.border,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0 }}>
                      {d.photo ? <img src={d.photo} alt={d.name} style={{ width:"100%",height:"100%",objectFit:"cover" }} /> : d.emoji}
                    </div>
                    <p style={{ color:C.text,fontSize:14,lineHeight:1.5,fontWeight:600 }}><strong style={{ fontWeight:800 }}>{d.name}</strong>{": "+msg}</p>
                  </div>
                );
              })}
            </div>
          )}

          <button onClick={function(){ setActiveDog(null); setActiveView("board"); }}
            style={{ margin:"0 10px 3px",background:(!activeDog&&activeView==="board")?C.accentFaint:"transparent",border:"1.5px solid "+((!activeDog&&activeView==="board")?C.accent:C.border),color:(!activeDog&&activeView==="board")?C.accent:C.text,borderRadius:10,padding:"8px 12px",textAlign:"left",fontSize:14,fontWeight:600,cursor:"pointer",transition:"all .15s" }}>
            🐾 DogBoard
          </button>
          <button onClick={function(){ setActiveDog(null); setActiveView("trainer"); }}
            style={{ margin:"0 10px 6px",background:(!activeDog&&activeView==="trainer")?C.accentFaint:"transparent",border:"1.5px solid "+((!activeDog&&activeView==="trainer")?C.accent:C.border),color:(!activeDog&&activeView==="trainer")?C.accent:C.text,borderRadius:10,padding:"8px 12px",textAlign:"left",fontSize:14,fontWeight:600,cursor:"pointer",transition:"all .15s" }}>
            {(function(){ var r=getTrainerRank(user.trainerPoints||0); return r.icon+" Trainer Rank"; })()}
          </button>

          <div ref={dogListRef} onClick={function(){ setFocusedSection("dogs"); setHighlightedDogId(function(cur){ return cur || (activeDog ? activeDog.id : null); }); }} style={{ flex:1,overflowY:"auto",padding:"0 6px 6px",borderRadius:10,border:"1.5px solid "+(focusedSection==="dogs"?C.accent:"transparent"),transition:"border-color .15s" }}>
            {filtered.length === 0 && (
              <div style={{ textAlign:"center",padding:24,color:C.muted }}>
                <div style={{ fontSize:32,marginBottom:6 }}>🐕</div>
                <p style={{ fontSize:14,fontWeight:600,color:C.text,opacity:0.7 }}>{dogs.length===0?"No dogs yet. Add your first pup!":"No results."}</p>
              </div>
            )}
            {filtered.map(function(dog) {
              var heat = dog.gender==="female" ? getHeatStatus(dog) : null;
              var isActive = activeDog && activeDog.id === dog.id;
              var hasAlert = (heat&&(heat.upcoming||heat.inHeat)) || ((dog.vaccines||[]).some(function(v){ return v.nextDate&&isOverdue(v.nextDate); }));
              return (
                <div key={dog.id} data-active={isActive?"true":"false"} data-highlighted={highlightedDogId===dog.id?"true":"false"}
                  onClick={function(){ setActiveDog(dog); setActiveView("board"); setHighlightedDogId(null); if(showSearch){ setSearch(""); setShowSearch(false); } }}
                  style={{ display:"flex",alignItems:"center",gap:9,padding:"9px 10px",borderRadius:11,cursor:"pointer",background:isActive?C.accentFaint:highlightedDogId===dog.id?C.cardHov:C.card,border:"1.5px solid "+(isActive?C.accent:highlightedDogId===dog.id?C.accent:C.border),marginBottom:4,transition:"all .15s",outline:highlightedDogId===dog.id?"2px solid "+C.accent:"none",outlineOffset:"1px" }}
                  onMouseEnter={function(e){ if(!isActive&&highlightedDogId!==dog.id){e.currentTarget.style.background=C.cardHov;e.currentTarget.style.borderColor=C.accent;} }}
                  onMouseLeave={function(e){ if(!isActive&&highlightedDogId!==dog.id){e.currentTarget.style.background=C.card;e.currentTarget.style.borderColor=C.border;} }}>
                <div style={{ width:32,height:32,borderRadius:"50%",background:C.accentFaint,border:"1.5px solid "+C.border,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>
                  {dog.photo
                    ? <img src={dog.photo} alt={dog.name} style={{ width:"100%",height:"100%",objectFit:"cover" }} />
                    : dog.emoji}
                </div>
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ display:"flex",alignItems:"center",gap:5 }}>
                      <p style={{ fontWeight:600,fontSize:13,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{dog.name}</p>
                      <span style={{ fontSize:20,fontWeight:900,flexShrink:0,color:dog.gender==="female"?"#f472b6":"#60a5fa",lineHeight:1,WebkitTextStroke:"0.6px "+(dog.gender==="female"?"#f472b6":"#60a5fa") }}>{dog.gender==="female"?"♀":"♂"}</span>
                      {hasAlert && <span style={{ width:7,height:7,borderRadius:"50%",background:heat&&heat.inHeat?C.pink:C.yellow,display:"inline-block",flexShrink:0 }} />}
                    </div>
                    <p style={{ color:C.muted,fontSize:15,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{dog.breed}</p>
                  </div>
                  <div style={{ textAlign:"right",flexShrink:0 }}>
                    <p style={{ color:C.text,fontSize:13,fontWeight:600,opacity:0.7 }}>{"Fed "+timeAgo(dog.lastFed)}</p>
                    <p style={{ color:C.text,fontSize:13,fontWeight:600,opacity:0.7 }}>{"Out "+timeAgo(dog.lastOutside)}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ padding:"10px",borderTop:"1px solid "+C.border }}>
            {typeof Notification !== "undefined" && Notification.permission === "default" && (
              <button onClick={requestNotifPermission}
                style={{ width:"100%",marginBottom:7,fontSize:12,background:C.blueFaint,border:"1.5px solid "+C.blue,color:C.blue,borderRadius:10,padding:"8px 12px",cursor:"pointer",fontWeight:600 }}>
                🔔 Enable Notifications
              </button>
            )}
            <button className="btnP" onClick={function(){ setShowAdd(true); }} style={{ width:"100%",marginBottom:7,fontSize:13 }}>
              {"+ Add Dog"+(dogs.length>0?" ("+dogs.length+"/100)":"")}
            </button>
            <button className="btnG" onClick={logout} style={{ width:"100%",fontSize:14,padding:"11px",fontWeight:600,color:C.red,borderColor:C.red }}>Sign Out</button>
          </div>
        </div>

        <div onClick={function(e){ if(focusedSection==="dogs") setFocusedSection(null); }} style={{ flex:1,overflowY:"auto",padding:28 }}>
          {activeDog
            ? <div className="fadeIn" style={{ maxWidth:700,margin:"0 auto" }}><DogDetail dog={activeDog} onUpdate={updateDog} onDelete={deleteDog} allDogs={dogs} onEdit={function(){ setShowEditDog(true); }} activeTab={activeTab} setActiveTab={setActiveTab} focusedSection={focusedSection} setFocusedSection={setFocusedSection} setSelectedBadge={setSelectedBadge} earnTP={earnTP} setCooldownAlert={setCooldownAlert} /></div>
            : activeView==="trainer"
              ? <TrainerView user={user} dogs={dogs} onShowRankTiers={function(){ setShowRankTiers(true); }} />
              : <DogBoard dogs={dogs} onSelect={setActiveDog} onUpdate={updateDog} onAdd={function(){ setShowAdd(true); }} earnTP={earnTP} setActiveTab={setActiveTab} setCooldownAlert={setCooldownAlert} />
          }
        </div>
      </div>

      )} {/* end isMobile ternary */}

      {/* ── Shared modals (both layouts) ── */}
      {selectedBadge && activeDog && (
        <BadgeDetailModal b={selectedBadge} dog={activeDog} onClose={function(){ setSelectedBadge(null); }} />
      )}

      {showEditDog && activeDog && (
        <Modal title={"Edit "+activeDog.name} onClose={function(){ setShowEditDog(false); }}>
          <DogForm initial={activeDog} onSave={function(u){ updateDog(u); setShowEditDog(false); }} onClose={function(){ setShowEditDog(false); }} />
        </Modal>
      )}

      {showAdd && (
        <Modal title="Add a New Dog" onClose={function(){ setShowAdd(false); }}>
          <DogForm onSave={addDog} onClose={function(){ setShowAdd(false); }} />
        </Modal>
      )}

      {showRankTiers && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:99999,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"24px 20px",overflowY:"auto" }}
          onClick={function(){ setShowRankTiers(false); }}>
          <div className="fadeIn" style={{ background:C.card,border:"2px solid "+C.accent,borderRadius:24,padding:28,maxWidth:520,width:"100%" }}
            onClick={function(e){ e.stopPropagation(); }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6 }}>
              <h2 style={{ fontFamily:"Fraunces",fontSize:22,fontWeight:800,color:C.accent }}>🏆 Trainer Ranks</h2>
              <button onClick={function(){ setShowRankTiers(false); }} style={{ background:C.isDark?"rgba(255,255,255,0.12)":"rgba(0,0,0,0.12)",border:"1.5px solid "+(C.isDark?"rgba(255,255,255,0.28)":"rgba(0,0,0,0.28)"),color:C.isDark?"rgba(255,255,255,0.85)":"rgba(0,0,0,0.75)",borderRadius:"50%",width:32,height:32,cursor:"pointer",fontSize:16,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center" }}>&#x2715;</button>
            </div>
            <p style={{ color:C.text,fontSize:15,fontWeight:500,marginBottom:20 }}>Earn Trainer Points (TP) through daily care actions. Your rank reflects your dedication as a dog caregiver.</p>
            {(function(){
              var tp = user.trainerPoints || 0;
              var current = getTrainerRank(tp);
              return TRAINER_RANKS.map(function(rank, i){
                var isActive = rank.label === current.label;
                var isUnlocked = tp >= rank.min;
                var next = TRAINER_RANKS[i+1] || null;
                var pct = isActive && next ? Math.round(((tp - rank.min) / (next.min - rank.min)) * 100) : isUnlocked ? 100 : 0;
                return (
                  <div key={rank.label} style={{ background:isActive?"linear-gradient(135deg,"+rank.glow+" 0%,"+C.bg+" 80%)":C.bg,border:"2px solid "+(isActive?rank.color:isUnlocked?"rgba("+rank.color.slice(1).match(/../g).map(function(h){return parseInt(h,16);}).join(",")+",0.4)":C.border),borderRadius:14,padding:"14px 16px",marginBottom:10,opacity:isUnlocked?1:0.72,transition:"all .2s" }}>
                    <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                      <div style={{ fontSize:32,lineHeight:1,filter:isUnlocked?"drop-shadow(0 2px 8px "+rank.glow+")":"grayscale(1)",flexShrink:0 }}>{rank.icon}</div>
                      <div style={{ flex:1,minWidth:0 }}>
                        <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:2 }}>
                          <p style={{ fontFamily:"Fraunces",fontSize:16,fontWeight:800,color:isUnlocked?rank.color:C.muted }}>{rank.label}</p>
                          {isActive && <span style={{ background:rank.glow,color:rank.color,fontSize:13,fontWeight:800,padding:"3px 10px",borderRadius:99,border:"1.5px solid "+rank.color }}>Current</span>}
                          {isUnlocked && !isActive && <span style={{ color:C.green,fontSize:13 }}>✓</span>}
                        </div>
                        <p style={{ fontSize:14,color:C.text,fontWeight:500,marginBottom:isActive?10:0 }}>{rank.desc}</p>
                        {isActive && next && (
                          <div>
                            <div style={{ background:C.border,borderRadius:999,height:6,overflow:"hidden",marginBottom:4 }}>
                              <div style={{ background:"linear-gradient(90deg,"+rank.color+",rgba(255,255,255,0.4))",width:pct+"%",height:"100%",borderRadius:999,transition:"width .6s ease" }} />
                            </div>
                            <p style={{ fontSize:13,color:C.text,fontWeight:600 }}>{tp+" / "+next.min+" TP · "+(next.min-tp)+" more to "+next.label}</p>
                          </div>
                        )}
                      </div>
                      <div style={{ textAlign:"right",flexShrink:0 }}>
                        <p style={{ fontSize:14,fontWeight:800,color:isUnlocked?rank.color:C.muted }}>{rank.min===0?"Start":rank.min+" TP"}</p>
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}
      {showProfile && (
        <Modal title={user.name + "'s Profile"} onClose={function(){ setShowProfile(false); }}>
          <div style={{ marginBottom:22 }}>
            <PhotoUpload
              current={user.photo}
              onPhoto={function(url){ 
                persistUser({ photo: url || "" }); 
              }}
              size={90}
              shape="circle"
              placeholder="👤"
              label="Profile Photo"
            />
          </div>
          <FF label="Display Name">
            <input defaultValue={user.name} id="profile-name-input" placeholder="Your name" onKeyDown={function(e){ if(e.key==="Enter"){ var nameEl=document.getElementById("profile-name-input"); var phoneEl=document.getElementById("profile-phone-input"); var newName=nameEl?nameEl.value.trim():""; if(!newName){alert("Name cannot be empty.");return;} persistUser({name:newName,phone:phoneEl?phoneEl.value.trim():""}); setShowProfile(false); } }} />
          </FF>
          <FF label="Phone Number" hint="Optional">
            <input type="tel" defaultValue={user.phone||""} id="profile-phone-input" placeholder="+1 (555) 000-0000" />
          </FF>
          <FF label="Email">
            <input value={user.email} disabled style={{ opacity:.5 }} />
          </FF>

          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",background:C.bg,border:"1.5px solid "+C.border,borderRadius:12,padding:"12px 16px",marginBottom:16 }}>
            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
              <span style={{ fontSize:20 }}>{darkMode ? "🌙" : "☀️"}</span>
              <div>
                <p style={{ fontSize:13,fontWeight:600,color:C.text }}>{darkMode ? "Dark Mode" : "Light Mode"}</p>
                <p style={{ fontSize:13,color:C.muted,marginTop:2,fontWeight:700 }}>{darkMode ? "Easy on the eyes at night" : "Clean and bright"}</p>
              </div>
            </div>
            <button onClick={toggleTheme}
              style={{ width:48,height:26,borderRadius:99,background:darkMode?C.accent:C.border,border:"none",position:"relative",cursor:"pointer",transition:"background .2s",flexShrink:0 }}>
              <span style={{ position:"absolute",top:3,left:darkMode?24:3,width:20,height:20,borderRadius:"50%",background:"#fff",transition:"left .2s",boxShadow:"0 1px 4px rgba(0,0,0,.25)" }} />
            </button>
          </div>
          <div style={{ display:"flex",gap:10,marginTop:6,marginBottom:24 }}>
            <button className="btnP" onClick={function(){
              var nameEl = document.getElementById("profile-name-input");
              var phoneEl = document.getElementById("profile-phone-input");
              var newName = nameEl ? nameEl.value.trim() : "";
              if (!newName) { alert("Name cannot be empty."); return; }
              persistUser({ name: newName, phone: phoneEl ? phoneEl.value.trim() : "" });
              setShowProfile(false);
            }}>Save Changes</button>
            <button className="btnG" onClick={function(){ setShowProfile(false); }}>Cancel</button>
          </div>
          <div style={{ borderTop:"1px solid "+C.border,paddingTop:18 }}>
            <p style={{ fontSize:15,fontWeight:700,color:C.red,marginBottom:10,opacity:0.85 }}>Danger Zone</p>
            <DeleteProfileButton C={C} onDelete={function(){
              // Save user info before deletion for notifications
              var deletedUserEmail = user.email;
              var deletedUserName = user.name;
              var deletedUserPhone = user.phone || "N/A";
              var deletionTime = new Date().toISOString();
              
              // Delete user account
              var all = JSON.parse(localStorage.getItem("pt_users") || "{}");
              delete all[deletedUserEmail];
              localStorage.setItem("pt_users", JSON.stringify(all));
              localStorage.removeItem("pt_session");
              
              // Log deletion notification for admin
              var notifications = JSON.parse(localStorage.getItem("pt_admin_notifications") || "[]");
              notifications.push({
                id: String(Date.now()),
                type: "account_deletion",
                timestamp: deletionTime,
                userEmail: deletedUserEmail,
                userName: deletedUserName,
                userPhone: deletedUserPhone,
                message: "User account deleted: " + deletedUserName + " (" + deletedUserEmail + ")"
              });
              localStorage.setItem("pt_admin_notifications", JSON.stringify(notifications));
              
              // Log confirmation email for user (simulated)
              console.log("=== ACCOUNT DELETION CONFIRMATION EMAIL ===");
              console.log("To:", deletedUserEmail);
              console.log("Subject: Your PawTraxx Account Has Been Deleted");
              console.log("---");
              console.log("Hi " + deletedUserName + ",");
              console.log("");
              console.log("This email confirms that your PawTraxx account (" + deletedUserEmail + ") has been successfully deleted on " + new Date(deletionTime).toLocaleString() + ".");
              console.log("");
              console.log("All your data including:");
              console.log("- Profile information");
              console.log("- Dog profiles and records");
              console.log("- Documents and photos");
              console.log("- Activity logs and badges");
              console.log("");
              console.log("...has been permanently removed from our system.");
              console.log("");
              console.log("If you deleted your account by mistake, you can create a new account at any time, but your previous data cannot be recovered.");
              console.log("");
              console.log("Thank you for using PawTraxx!");
              console.log("");
              console.log("- The PawTraxx Team");
              console.log("===========================================");
              
              // Show confirmation to user before logout
              alert("Account Deleted Successfully\n\nA confirmation email has been sent to " + deletedUserEmail + ".\n\nThank you for using PawTraxx!");
              
              // Logout
              setUser(null); setDogs([]); setActiveDog(null); setShowProfile(false);
            }} />
          </div>
        </Modal>
      )}

      {upgradeModal.show && (function(){
        var userTier = user.tier || 'free';
        var currentConfig = getTierConfig(userTier);
        var recommendedConfig = getTierConfig(upgradeModal.recommendedTier);
        
        return (
          <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",zIndex:10003,display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
            <div className="fadeIn" style={{ background:C.card,borderRadius:24,maxWidth:560,width:"100%",boxShadow:"0 25px 100px rgba(0,0,0,0.6)",border:"3px solid "+recommendedConfig.color,overflow:"hidden" }}>
              
              {/* Header */}
              <div style={{ background:"linear-gradient(135deg, "+recommendedConfig.color+" 0%, "+C.card+" 100%)",padding:"32px 36px",borderBottom:"2px solid "+C.border }}>
                <div style={{ fontSize:56,marginBottom:12,textAlign:"center" }}>{recommendedConfig.icon}</div>
                <h2 style={{ fontFamily:"Fraunces",fontSize:26,fontWeight:900,color:C.text,marginBottom:8,textAlign:"center" }}>
                  Unlock {upgradeModal.feature}
                </h2>
                <p style={{ fontSize:15,color:C.muted,fontWeight:600,textAlign:"center",margin:0 }}>
                  Upgrade to {recommendedConfig.name} to continue
                </p>
              </div>
              
              {/* Body */}
              <div style={{ padding:"28px 36px" }}>
                {/* Current Limit Badge */}
                {upgradeModal.context.currentLimit && (
                  <div style={{ background:C.yellowFaint,border:"2px solid "+C.yellow,borderRadius:12,padding:"14px 18px",marginBottom:20,textAlign:"center" }}>
                    <div style={{ fontSize:13,color:C.text,fontWeight:700,marginBottom:4 }}>Current Limit:</div>
                    <div style={{ fontSize:18,color:C.yellow,fontWeight:900 }}>{upgradeModal.context.currentLimit}</div>
                  </div>
                )}
                
                {/* Message */}
                <p style={{ fontSize:16,color:C.text,lineHeight:1.7,marginBottom:24,textAlign:"center" }}>
                  {upgradeModal.context.message || "This feature requires a higher tier plan."}
                </p>
                
                {/* Benefits */}
                <div style={{ background:C.bg,borderRadius:14,padding:20,marginBottom:24,border:"1.5px solid "+C.border }}>
                  <div style={{ fontSize:14,fontWeight:800,color:recommendedConfig.color,marginBottom:14,textAlign:"center" }}>
                    ✨ What You'll Get with {recommendedConfig.name}:
                  </div>
                  <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                    {upgradeModal.context.benefits && upgradeModal.context.benefits.map(function(benefit, i){
                      return (
                        <div key={i} style={{ display:"flex",gap:10,alignItems:"flex-start" }}>
                          <span style={{ color:C.green,fontSize:18,flexShrink:0,marginTop:2 }}>✓</span>
                          <span style={{ fontSize:14,color:C.text,lineHeight:1.6 }}>{benefit}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Pricing Card */}
                <div style={{ background:"linear-gradient(135deg, "+recommendedConfig.color+"15 0%, "+recommendedConfig.color+"05 100%)",borderRadius:16,padding:20,border:"2px solid "+recommendedConfig.color,marginBottom:24 }}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                    <div>
                      <div style={{ fontSize:20,fontWeight:900,color:recommendedConfig.color,marginBottom:4 }}>
                        {recommendedConfig.name} Plan
                      </div>
                      <div style={{ fontSize:14,color:C.text,fontWeight:600 }}>
                        {recommendedConfig.displayPrice} • Save 17% annually
                      </div>
                    </div>
                    <div style={{ fontSize:44 }}>{recommendedConfig.icon}</div>
                  </div>
                </div>
                
                {/* Comparison Note */}
                <div style={{ background:C.accentFaint,borderRadius:10,padding:14,marginBottom:20,border:"1px solid "+C.accent }}>
                  <div style={{ display:"flex",gap:10,alignItems:"flex-start" }}>
                    <span style={{ fontSize:18,flexShrink:0 }}>💡</span>
                    <p style={{ fontSize:13,color:C.text,lineHeight:1.6,margin:0 }}>
                      <strong>Your current plan:</strong> {currentConfig.name} {currentConfig.displayPrice}
                      <br/>
                      <strong>Recommended:</strong> {recommendedConfig.name} {recommendedConfig.displayPrice}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Footer Actions */}
              <div style={{ padding:"0 36px 32px 36px",display:"flex",gap:12 }}>
                <button 
                  onClick={function(){ setUpgradeModal({ show: false, feature: "", recommendedTier: "", context: {} }); }}
                  style={{ flex:1,background:C.bg,color:C.text,border:"2px solid "+C.border,borderRadius:12,padding:"14px 20px",fontSize:15,fontWeight:700,cursor:"pointer",transition:"all .2s" }}
                  onMouseEnter={function(e){ e.currentTarget.style.background=C.border; }}
                  onMouseLeave={function(e){ e.currentTarget.style.background=C.bg; }}>
                  Maybe Later
                </button>
                <button 
                  onClick={function(){ 
                    setUpgradeModal({ show: false, feature: "", recommendedTier: "", context: {} });
                    setShowPricing(true);
                  }}
                  style={{ flex:2,background:recommendedConfig.color,color:"#fff",border:"none",borderRadius:12,padding:"14px 20px",fontSize:16,fontWeight:900,cursor:"pointer",transition:"all .2s",boxShadow:"0 4px 12px "+recommendedConfig.color+"40" }}
                  onMouseEnter={function(e){ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 6px 20px "+recommendedConfig.color+"60"; }}
                  onMouseLeave={function(e){ e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 4px 12px "+recommendedConfig.color+"40"; }}>
                  Upgrade Now →
                </button>
              </div>
              
            </div>
          </div>
        );
      })()}

      {cooldownAlert.show && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:10001,display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
          <div className="fadeIn" style={{ background:C.card,borderRadius:20,maxWidth:480,width:"100%",boxShadow:"0 25px 80px rgba(0,0,0,0.5)",border:"2px solid "+C.yellow }}>
            <div style={{ padding:"24px 28px",borderBottom:"2px solid "+C.border }}>
              <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                <span style={{ fontSize:36 }}>⏱️</span>
                <h2 style={{ fontFamily:"Fraunces",fontSize:22,fontWeight:900,color:C.yellow,margin:0 }}>Cooldown Active</h2>
              </div>
            </div>
            
            <div style={{ padding:"24px 28px" }}>
              <p style={{ fontSize:16,color:C.text,lineHeight:1.7,marginBottom:16 }}>{cooldownAlert.message}</p>
              
              <div style={{ background:C.yellowFaint,border:"1.5px solid "+C.yellow,borderRadius:12,padding:"16px 18px",marginBottom:20 }}>
                <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                  <span style={{ fontSize:14,color:C.text,fontWeight:700 }}>Please wait:</span>
                  <span style={{ fontSize:20,color:C.yellow,fontWeight:900 }}>{cooldownAlert.remaining}</span>
                </div>
              </div>

              <div style={{ background:C.bg,borderRadius:10,padding:14,border:"1px solid "+C.border }}>
                <div style={{ display:"flex",gap:10,alignItems:"flex-start" }}>
                  <span style={{ fontSize:18,flexShrink:0 }}>💡</span>
                  <p style={{ fontSize:13,color:C.muted,lineHeight:1.6,margin:0 }}>
                    Cooldowns help ensure your logs reflect real care patterns and prevent accidental duplicate entries.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ padding:"0 28px 24px 28px" }}>
              <button 
                onClick={function() { setCooldownAlert({ show: false, message: "", remaining: "" }); }}
                style={{ width:"100%",background:C.accent,color:"#fff",border:"none",borderRadius:12,padding:"13px 20px",fontSize:15,fontWeight:800,cursor:"pointer",transition:"all .2s" }}
                onMouseEnter={function(e){ e.currentTarget.style.opacity="0.9"; }}
                onMouseLeave={function(e){ e.currentTarget.style.opacity="1"; }}>
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {showCooldownInfo && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:10000,display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
          <div className="fadeIn" style={{ background:C.card,borderRadius:20,maxWidth:580,width:"100%",boxShadow:"0 25px 80px rgba(0,0,0,0.5)",border:"2px solid "+C.accent,maxHeight:"90vh",overflowY:"auto" }}>
            <div style={{ padding:"28px 32px",borderBottom:"2px solid "+C.border }}>
              <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:8 }}>
                <span style={{ fontSize:40 }}>⏱️</span>
                <h2 style={{ fontFamily:"Fraunces",fontSize:26,fontWeight:900,color:C.accent,margin:0 }}>Action Cooldowns</h2>
              </div>
              <p style={{ fontSize:15,color:C.muted,fontWeight:600,margin:0 }}>Keeping your records realistic and meaningful</p>
            </div>
            
            <div style={{ padding:"28px 32px" }}>
              <p style={{ fontSize:16,color:C.text,lineHeight:1.7,marginBottom:20 }}>
                To ensure accurate tracking and prevent accidental duplicate entries, <strong style={{ color:C.accent }}>PawTraxx now includes smart cooldown timers</strong> for certain actions.
              </p>

              <div style={{ background:C.bg,borderRadius:14,padding:20,marginBottom:20,border:"1.5px solid "+C.border }}>
                <h3 style={{ fontFamily:"Fraunces",fontSize:18,fontWeight:800,color:C.text,marginBottom:16,display:"flex",alignItems:"center",gap:8 }}>
                  <span style={{ fontSize:24 }}>🍽️</span>
                  Feeding & Outdoor Breaks
                </h3>
                <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
                  <div style={{ display:"flex",gap:12 }}>
                    <div style={{ background:C.greenFaint,border:"1px solid "+C.green,borderRadius:8,padding:"8px 12px",flexShrink:0 }}>
                      <span style={{ fontSize:14,fontWeight:800,color:C.green }}>4 hours</span>
                    </div>
                    <div>
                      <p style={{ fontSize:15,color:C.text,fontWeight:700,margin:0 }}>Mark as Fed</p>
                      <p style={{ fontSize:14,color:C.muted,margin:"2px 0 0 0" }}>Realistic feeding intervals</p>
                    </div>
                  </div>
                  <div style={{ display:"flex",gap:12 }}>
                    <div style={{ background:C.blueFaint,border:"1px solid "+C.blue,borderRadius:8,padding:"8px 12px",flexShrink:0 }}>
                      <span style={{ fontSize:14,fontWeight:800,color:C.blue }}>2 hours</span>
                    </div>
                    <div>
                      <p style={{ fontSize:15,color:C.text,fontWeight:700,margin:0 }}>Taken Outside</p>
                      <p style={{ fontSize:14,color:C.muted,margin:"2px 0 0 0" }}>Reasonable outdoor breaks</p>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ background:C.bg,borderRadius:14,padding:20,marginBottom:20,border:"1.5px solid "+C.border }}>
                <h3 style={{ fontFamily:"Fraunces",fontSize:18,fontWeight:800,color:C.text,marginBottom:16,display:"flex",alignItems:"center",gap:8 }}>
                  <span style={{ fontSize:24 }}>📊</span>
                  Health Tracking
                </h3>
                <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
                  <div style={{ display:"flex",gap:12 }}>
                    <div style={{ background:C.accentFaint,border:"1px solid "+C.accent,borderRadius:8,padding:"8px 12px",flexShrink:0 }}>
                      <span style={{ fontSize:14,fontWeight:800,color:C.accent }}>24 hours</span>
                    </div>
                    <div>
                      <p style={{ fontSize:15,color:C.text,fontWeight:700,margin:0 }}>Log Weight</p>
                      <p style={{ fontSize:14,color:C.muted,margin:"2px 0 0 0" }}>Once per day maximum</p>
                    </div>
                  </div>
                  <div style={{ display:"flex",gap:12 }}>
                    <div style={{ background:C.purpleFaint,border:"1px solid "+C.purple,borderRadius:8,padding:"8px 12px",flexShrink:0 }}>
                      <span style={{ fontSize:14,fontWeight:800,color:C.purple }}>1 hour</span>
                    </div>
                    <div>
                      <p style={{ fontSize:15,color:C.text,fontWeight:700,margin:0 }}>Mark Medication</p>
                      <p style={{ fontSize:14,color:C.muted,margin:"2px 0 0 0" }}>Prevents duplicate doses</p>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ background:C.accentFaint,borderRadius:12,padding:16,marginBottom:20,border:"1.5px solid "+C.accent }}>
                <div style={{ display:"flex",gap:10,alignItems:"flex-start" }}>
                  <span style={{ fontSize:20,flexShrink:0 }}>💡</span>
                  <div>
                    <p style={{ fontSize:14,color:C.text,fontWeight:700,marginBottom:4 }}>Why Cooldowns?</p>
                    <p style={{ fontSize:14,color:C.text,lineHeight:1.6,margin:0 }}>
                      Cooldowns ensure your logs reflect real care patterns, prevent accidental duplicates, and make earning badges more meaningful. You'll see exactly how long to wait if you try an action too soon!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding:"0 32px 28px 32px" }}>
              <button 
                onClick={function() { 
                  setShowCooldownInfo(false); 
                }}
                style={{ width:"100%",background:C.accent,color:"#fff",border:"none",borderRadius:12,padding:"14px 20px",fontSize:16,fontWeight:800,cursor:"pointer",transition:"all .2s" }}
                onMouseEnter={function(e){ e.currentTarget.style.opacity="0.9"; }}
                onMouseLeave={function(e){ e.currentTarget.style.opacity="1"; }}>
                Got It! 🐾
              </button>
            </div>
          </div>
        </div>
      )}

      {showWelcome && (function(){
        var hour = new Date().getHours();

        // Time-of-day config
        var tod;
        if (hour >= 5 && hour < 8) {
          tod = {
            greeting: "Good Morning",
            sub: "Rise and shine! Your pups are ready to start the day with you.",
            skyTop: "#0d1b3e",
            skyMid: "#1a3a6e",
            skyBot: "#f4730a",
            horizon: "#f9b84a",
            sunColor: "#fff7a0",
            sunGlow: "rgba(249,184,74,0.7)",
            sunY: 72, // % from top — low on horizon
            sunSize: 60,
            stars: false,
            groundL: "#1a3a1a",
            groundR: "#0e2610",
            label: "🌅 Sunrise",
          };
        } else if (hour >= 8 && hour < 12) {
          tod = {
            greeting: "Good Morning",
            sub: "A great morning to check in on your pack!",
            skyTop: "#87ceeb",
            skyMid: "#b0e0ff",
            skyBot: "#fde68a",
            horizon: "#fde68a",
            sunColor: "#fff700",
            sunGlow: "rgba(255,247,0,0.5)",
            sunY: 30,
            sunSize: 52,
            stars: false,
            groundL: "#3a7d2e",
            groundR: "#2e6020",
            label: "☀️ Morning",
          };
        } else if (hour >= 12 && hour < 17) {
          tod = {
            greeting: "Good Afternoon",
            sub: "Hope your afternoon is going well — and so is the pack!",
            skyTop: "#1e90ff",
            skyMid: "#63b3f5",
            skyBot: "#bfe8ff",
            horizon: "#bfe8ff",
            sunColor: "#fffde0",
            sunGlow: "rgba(255,247,0,0.4)",
            sunY: 15,
            sunSize: 56,
            stars: false,
            groundL: "#4a9e3a",
            groundR: "#357028",
            label: "🌤 Afternoon",
          };
        } else if (hour >= 17 && hour < 20) {
          tod = {
            greeting: "Good Evening",
            sub: "Beautiful evening to spend with your pups.",
            skyTop: "#1a0a3e",
            skyMid: "#8b2fc9",
            skyBot: "#f4730a",
            horizon: "#ff9a3c",
            sunColor: "#ff6a00",
            sunGlow: "rgba(255,106,0,0.8)",
            sunY: 70,
            sunSize: 64,
            stars: false,
            groundL: "#1a1a2e",
            groundR: "#0d0d1a",
            label: "🌇 Sunset",
          };
        } else {
          tod = {
            greeting: "Good Night",
            sub: "Hope you and your pups had a wonderful day.",
            skyTop: "#020818",
            skyMid: "#0a0f2e",
            skyBot: "#0d1a3a",
            horizon: "#1a2a50",
            sunColor: "#fffff0",
            sunGlow: "rgba(200,200,255,0.4)",
            sunY: 18,
            sunSize: 44,
            stars: true,
            groundL: "#0d1a0d",
            groundR: "#080f08",
            label: "🌙 Night",
          };
        }

        var sunTop = tod.sunY + "%";

        return (
          <div style={{ position:"fixed",inset:0,zIndex:3000,overflow:"hidden",cursor:"pointer" }}
            ref={function(el){ if(el) el.focus(); }}
            tabIndex={0}
            onClick={function(){ setShowWelcome(false); }}
            onKeyDown={function(e){ if(e.key==="Enter"||e.key===" ") { e.preventDefault(); setShowWelcome(false); } }}>

            {/* Sky gradient */}
            <div style={{ position:"absolute",inset:0,background:"linear-gradient(to bottom, "+tod.skyTop+" 0%, "+tod.skyMid+" 50%, "+tod.skyBot+" 80%, "+tod.horizon+" 100%)" }} />

            {/* Stars (night only) */}
            {tod.stars && [
              [10,8],[20,15],[35,5],[50,12],[65,7],[78,18],[88,10],[15,25],[45,20],[70,28],[90,22],[5,35],[30,32],[55,38],[82,30],
              [12,45],[38,42],[62,48],[85,40],[25,55],[50,50],[75,52],[8,60],[42,58],[68,62]
            ].map(function(pos, i){
              return <div key={i} style={{ position:"absolute",left:pos[0]+"%",top:pos[1]+"%",width:i%3===0?3:2,height:i%3===0?3:2,borderRadius:"50%",background:"white",opacity:0.6+Math.random()*0.4,animation:"pulse "+(1.5+i*0.3)+"s ease-in-out infinite" }} />;
            })}

            {/* Sun / Moon */}
            <div style={{ position:"absolute",left:"50%",top:sunTop,transform:"translate(-50%,-50%)",width:tod.sunSize,height:tod.sunSize,borderRadius:"50%",background:tod.sunColor,boxShadow:"0 0 "+(tod.sunSize*1.2)+"px "+(tod.sunSize*0.6)+"px "+tod.sunGlow+", 0 0 "+(tod.sunSize*2.5)+"px "+(tod.sunSize*0.3)+"px "+tod.sunGlow,zIndex:1 }}>
              {/* Moon craters */}
              {tod.stars && <div style={{ position:"absolute",top:"20%",left:"25%",width:"18%",height:"18%",borderRadius:"50%",background:"rgba(180,180,200,0.25)" }} />}
              {tod.stars && <div style={{ position:"absolute",top:"50%",left:"55%",width:"12%",height:"12%",borderRadius:"50%",background:"rgba(180,180,200,0.2)" }} />}
            </div>

            {/* Sun rays (not at night) */}
            {!tod.stars && [0,45,90,135].map(function(deg){
              return <div key={deg} style={{ position:"absolute",left:"50%",top:sunTop,width:2,height:tod.sunSize*2.5,background:"linear-gradient(to bottom, "+tod.sunGlow+", transparent)",transform:"translate(-50%,-50%) rotate("+deg+"deg)",transformOrigin:"50% 50%",opacity:0.35,zIndex:0 }} />;
            })}

            {/* Horizon glow */}
            <div style={{ position:"absolute",bottom:"38%",left:0,right:0,height:120,background:"linear-gradient(to top, "+tod.horizon+"55, transparent)",zIndex:1 }} />

            {/* Ground */}
            <div style={{ position:"absolute",bottom:0,left:0,right:0,height:"38%",background:"linear-gradient(135deg, "+tod.groundL+" 0%, "+tod.groundR+" 100%)",zIndex:2 }}>
              {/* Grass silhouette bumps */}
              <svg viewBox="0 0 800 80" preserveAspectRatio="none" style={{ position:"absolute",top:-40,left:0,width:"100%",height:50 }}>
                <path d="M0,80 C80,40 140,20 200,50 C260,80 300,30 380,45 C460,60 500,20 580,40 C660,60 720,30 800,50 L800,80 Z" fill={tod.groundL} />
              </svg>
              {/* Tree silhouettes */}
              {[8,22,35,55,68,80,92].map(function(x, i){
                var h = 60 + (i*17)%50;
                var w = 18 + (i*11)%14;
                return (
                  <svg key={i} viewBox="0 0 40 100" style={{ position:"absolute",bottom:0,left:x+"%",width:w,height:h,opacity:0.7 }}>
                    <polygon points="20,0 40,70 0,70" fill="rgba(0,0,0,0.5)" />
                    <rect x="17" y="70" width="6" height="30" fill="rgba(0,0,0,0.5)" />
                  </svg>
                );
              })}
            </div>

            {/* Content card */}
            <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",zIndex:10,padding:24 }}
              onClick={function(e){ e.stopPropagation(); }}>
              <div className="fadeIn" style={{ textAlign:"center",maxWidth:440,background:"rgba(0,0,0,0.45)",backdropFilter:"blur(18px)",WebkitBackdropFilter:"blur(18px)",borderRadius:28,padding:"36px 40px",border:"1px solid rgba(255,255,255,0.12)",boxShadow:"0 24px 80px rgba(0,0,0,0.5)" }}>

                <p style={{ color:"rgba(255,255,255,0.55)",fontSize:12,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",marginBottom:18 }}>{tod.label}</p>

                <div style={{ position:"relative",display:"inline-block",marginBottom:20 }}>
                  <div style={{ width:90,height:90,borderRadius:"50%",border:"3px solid rgba(255,255,255,0.35)",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",fontSize:44,margin:"0 auto",boxShadow:"0 0 30px rgba(255,255,255,0.15)" }}>
                    {user.photo
                      ? <img src={user.photo} alt={user.name} style={{ width:"100%",height:"100%",objectFit:"cover" }} />
                      : <span>👤</span>}
                  </div>
                  <div style={{ position:"absolute",bottom:0,right:0,fontSize:20 }}>🐾</div>
                </div>

                <h1 style={{ fontFamily:"Fraunces",fontSize:34,fontWeight:800,color:"#ffffff",letterSpacing:"-0.5px",lineHeight:1.15,marginBottom:10 }}>
                  {tod.greeting},<br />{user.name}!
                </h1>

                <p style={{ color:"rgba(255,255,255,0.7)",fontSize:14,lineHeight:1.7,marginBottom:dogs.length>0?16:24 }}>
                  {tod.sub}
                </p>

                {dogs.length > 0 && (
                  <div>
                    <p style={{ color:"rgba(255,255,255,0.55)",fontSize:16,marginBottom:10 }}>
                      {"Your Pack · "+dogs.length+" Dog"+(dogs.length!==1?"s":"")}
                    </p>
                    <div style={{ display:"flex",justifyContent:"center",marginBottom:24 }}>
                      {dogs.slice(0,5).map(function(d, i){
                        return (
                          <div key={d.id} style={{ width:44,height:44,borderRadius:"50%",background:"rgba(0,0,0,0.4)",border:"2.5px solid rgba(255,255,255,0.25)",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginLeft:i>0?-10:0,zIndex:10-i }}>
                            {d.photo ? <img src={d.photo} alt={d.name} style={{ width:"100%",height:"100%",objectFit:"cover" }} /> : d.emoji}
                          </div>
                        );
                      })}
                      {dogs.length > 5 && (
                        <div style={{ width:44,height:44,borderRadius:"50%",background:"rgba(244,162,77,0.3)",border:"2.5px solid rgba(255,255,255,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#f4a24d",marginLeft:-10,zIndex:0 }}>
                          +{dogs.length-5}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <button style={{ background:"rgba(255,255,255,0.15)",border:"1.5px solid rgba(255,255,255,0.3)",color:"#ffffff",borderRadius:14,padding:"13px 40px",fontSize:15,fontWeight:700,cursor:"pointer",backdropFilter:"blur(8px)",transition:"all .2s",letterSpacing:".02em" }}
                  onMouseEnter={function(e){ e.currentTarget.style.background="rgba(255,255,255,0.25)"; }}
                  onMouseLeave={function(e){ e.currentTarget.style.background="rgba(255,255,255,0.15)"; }}
                  onClick={function(){ setShowWelcome(false); }}>
                  Let's Go 🐾
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
    </ThemeContext.Provider>
  );
}
