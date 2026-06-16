"use client";

import Navbar from "@/app/Components/Common/Navbar/Page";
import Footer from "@/app/Components/Common/Footer/Page";
import BestSellers from "@/app/Components/Common/BestSellers/Page";

import { useState, useEffect, useMemo } from "react";
import { X, ChevronDown, Check, ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";

const dosageTextByForm = {
  liquid: "10 ml - Kids, 15 ml - Pregnancy, 25 ml - Adults daily",
  powder:
    "½ sachet + 2 tbsp water - Adults, ¼ sachet + 1 tbsp water - Pregnant women & Kids",
};

const keyIngredientsData = {
  "Prime Smarts":
    "Xylitol, Maltitol, Sorbitol, FOS, Cinnamon Essential oil, Curcumin Essential Oil, Probiotic (Bacillus coagulans), Pectin. Contains Natural / Nature Identical Flavouring substances and Permitted Natural Colour.",
  "Dia Smarts":
    "Xylitol, Maltitol, Sorbitol, FOS (Prebiotic), Malic acid, Citric acid, Cinnamon oil, Probiotic (Bacillus coagulans), Pectin. Contains Natural / Nature Identical Flavouring substances and Permitted Natural Colour.",
  "Junior Smarts":
    "Xylitol, Maltitol, Sorbitol, FOS, Cinnamon oil, Probiotic (Bacillus coagulans), Pectin. Contains Natural / Nature Identical Flavouring substances and Permitted Natural Colour.",
  "Pink Smarts":
    "Xylitol, Maltitol, Sorbitol, FOS (Prebiotic), Cinnamon essential oil, Citric acid, Probiotic (Bacillus coagulans, L. Rhamnosus, L. Reuteri), Pectin. Contains Natural / Nature Identical Flavouring substances and Permitted Natural Colour.",
};

const extractDosage = (text) => {
  if (!text) return "—";
  const matches = text.match(/\d(?:-\d){1,3}/g);
  return matches ? matches.join(", ") : "—";
};

const dosageData = {
  "Prime Smarts": {
    "Tooth extraction": {
      dosage:
        "Before Extraction- 3 Days Dosage: 1-1-1. After Extraction- 6-7 Days. Dosage: 1-1-1. Best results with CUTE Mouthwash",
      treatmentPeriod: "Before Extraction - 3 Days, After Extraction - 6-7 Days",
      route:
        "Oral mucosal (For best results chew softly for 1 min & allow it to dissolve slowly)",
      cause: "Severe tooth decay, bacterial risk",
      uses: "75–80% faster recovery with less pain",
    },
    "Dry socket": {
      dosage:
        "Treatment period - 7 Days with dressing and Cute mouthwash. Dosage 1-1-1. Best results with CUTE Mouthwash",
      treatmentPeriod: "7 Days",
      route: "Oral mucosal",
      cause: "Improper clotting after tooth extraction, poor oral hygiene",
      uses: "85% recovery, no discomfort",
    },
    "Tooth decay (post-RCT)": {
      dosage: "Treatment period - 5 Days with antibiotics. Dosage 1-1-1",
      treatmentPeriod: "5 Days",
      route: "Oral mucosal",
      cause: "Infected pulp",
      uses: "80–85% reduced pain and discomfort",
    },
    "Tooth sensitivity": {
      dosage:
        "Treatment period - 10 Days. Dosage 1-0-1 Best results with CUTE Mouthwash",
      treatmentPeriod: "10 Days",
      route: "Oral mucosal",
      cause: "Gum recession / Enamel erosion",
      uses: "65–70% reduction",
    },
    Halitosis: {
      dosage:
        "Post-scaling. Treatment period - 3 Days Dosage 1-1-1 Best results with CUTE Mouthwash",
      treatmentPeriod: "3 Days",
      route: "Oral mucosal",
      cause: "Plaque / gum disease / GERD / poor oral hygiene",
      uses: "70–75% improvement",
    },
    "Gum diseases": {
      dosage:
        "Post-surgery. Treatment period - 5 Days. Dosage 1-1-1 Best results with CUTE Mouthwash",
      treatmentPeriod: "5 Days",
      route: "Oral mucosal",
      cause: "Severe inflammation",
      uses: "60–65% inflammation/pain relief",
    },
    "Periapical abscess": {
      dosage:
        "Treatment period - 7 Days with antibiotics. Dosage 1-0-1 Best results with CUTE Mouthwash",
      treatmentPeriod: "7 Days",
      route: "Oral mucosal",
      cause: "Periodontitis / Untreated tooth decay",
      uses: "70–75% microbial balance maintenance",
    },
    "Premalignant lesions": {
      dosage:
        "Treatment period - 15 Days with antioxidants. Dosage 1-0-1 Best results with CUTE Mouthwash",
      treatmentPeriod: "15 Days",
      route: "Oral mucosal",
      cause: "Oxidative stress / Oral submucosal fibrosis",
      uses: "80–85% discomfort reduction",
    },
    "Oral cancer": {
      dosage:
        "Treatment period - 30 Days with Radiotherapy. Dosage 1-0-1 Best results with CUTE Mouthwash",
      treatmentPeriod: "30 Days",
      route: "Oral mucosal",
      cause: "Radiotherapy effects",
      uses: "60–65% pain relief, microbial balance",
    },
    "Peri-implantitis": {
      dosage:
        "Treatment period - 7 Days Dosage 1-1-1 Best results with CUTE Mouthwash",
      treatmentPeriod: "7 Days",
      route: "Oral mucosal",
      cause: "Plaque formation, poor oral hygiene, periodontitis",
      uses:
        "66 to 70% increase in bone retention and 70 to 75% reduction of bleeding on probing around implant area",
    },
  },
  "Dia Smarts": {
    "Gingivitis/Periodontitis": {
      dosage:
        "Before Oral prophylaxis/ flap surgery- 2 Days Dosage: 1-0-1 along with antibiotics. After Oral prophylaxis/ flap surgery- 5 Days. Dosage: 1-1-1 along with antibiotics. Best results with CUTE Mouthwash",
      treatmentPeriod: "Before: 2 Days, After: 5 Days",
      route:
        "Oral mucosal (For best results chew softly for 1 min & allow it to dissolve slowly)",
      cause: "Gingivitis causing bacteria Streptococcus mutans / candida albicans",
      uses: "80% recovery, no discomfort",
    },
    "Burning mouth Syndrome": {
      dosage: "Treatment period - 7 Days. Dosage 1-0-1. Best results with CUTE Mouthwash",
      treatmentPeriod: "7 Days",
      route: "Oral mucosal",
      cause: "Mucosal irritation",
      uses: "70% symptom reduction",
    },
    "Thrush/Candidiasis": {
      dosage:
        "Treatment period: 6-7 Days along with gel application. Dosage 1-1-1. Best results with CUTE Mouthwash",
      treatmentPeriod: "6-7 Days",
      route: "Oral mucosal",
      cause: "Fungal overgrowth / Candida albicans",
      uses: "75% lesion reduction",
    },
    "Oral mucosal disorder/Lichen planus": {
      dosage:
        "Treatment period: 10 Days along with gel application. Dosage 1-0-1. Best results with CUTE Mouthwash",
      treatmentPeriod: "10 Days",
      route: "Oral mucosal",
      cause: "Immune-mediated",
      uses: "65–70% reduction",
    },
    Xerostomia: {
      dosage: "Treatment period: 7 Days. Dosage 1-1-1. Best results with CUTE Mouthwash",
      treatmentPeriod: "7 Days",
      route: "Oral mucosal",
      cause: "Lack of saliva – dysbiosis (Microbial imbalance)",
      uses: "60–65% saliva increase",
    },
    "Taste dysfunction": {
      dosage: "Treatment period: 7 Days. Dosage 1-1-1. Best results with CUTE Mouthwash",
      treatmentPeriod: "7 Days",
      route: "Oral mucosal",
      cause: "Radiation Therapy, use of long-term antibiotics, chemotherapy",
      uses: "65% improved taste",
    },
    "Dental caries": {
      dosage:
        "Post RCT. Treatment period: 7 days. Dosage: 1-1-1 with antibiotics. Best results with CUTE Mouthwash",
      treatmentPeriod: "7 Days",
      route: "Oral mucosal",
      cause: "Pathogenic bacteria Streptococcus mutans",
      uses: "80% pain relief and recovery",
    },
    "Delayed wound healing in extractions": {
      dosage:
        "Treatment period: 10 Days. Dosage 1-1-1 after procedures along with antibiotics and CUTE Mouthwash. Best results with CUTE Mouthwash",
      treatmentPeriod: "10 Days",
      route: "Oral mucosal",
      cause: "Trauma, infection, Diabetic, Bacterial fungal biofilm formation",
      uses: "90% fast healing",
    },
  },
  "Junior Smarts": {
    "Gum disease/Gingivitis-Oral prophylaxis": {
      dosage:
        "Before Treatment- 3 Days. Dosage: 1-0-1. After Treatment- 6-7 Days. Dosage: 1-1-1. Best results with CUTE Mouthwash",
      treatmentPeriod: "Before: 3 Days, After: 6-7 Days",
      route:
        "Oral mucosal (For best results chew softly for 1 min & allow it to dissolve slowly)",
      cause: "Bacterial plaque",
      uses: "85–90% reduction",
    },
    "Tooth Decay/Rampant/ECC caries-Filling": {
      dosage:
        "Before Procedure: 3 Days. Dosage: 1-0-1. After Procedure: 6-7 Days. Dosage: 1-1-1. Best results with CUTE Mouthwash",
      treatmentPeriod: "Before: 3 Days, After: 6-7 Days",
      route: "Oral mucosal",
      cause: "S. mutans activity",
      uses: "75–80% decay reduction",
    },
    "Deep Pit and Fissure anatomy-Sealant application": {
      dosage:
        "Before Application: 3 Days. Dosage: 1-0-1. After Application: 3 Days. Dosage: 1-1-1. Best results with CUTE Mouthwash",
      treatmentPeriod: "Before: 3 Days, After: 3 Days",
      route: "Oral mucosal",
      cause: "Poor oral hygiene",
      uses: "80–90% caries arrest",
    },
    "Enamel hypoplasia/Weak enamel": {
      dosage: "Treatment Period: 7 Days. Dosage: 1-1-1. Best results with CUTE Mouthwash",
      treatmentPeriod: "7 Days",
      route: "Oral mucosal",
      cause: "Weak enamel formation",
      uses: "70–80% strength gain",
    },
    "Mental handicap children/Autism patients": {
      dosage: "Treatment Period: 10 Days. Dosage: 1-1-1-1. Best results with CUTE Mouthwash",
      treatmentPeriod: "10 Days",
      route: "Oral mucosal",
      cause: "Poor hygiene habits",
      uses: "80–85% hygiene improvement",
    },
    "Pulpectomy/Post procedural Pulpectomy/Extraction": {
      dosage:
        "Before Procedure/Extraction: 3 Days. Dosage: 1-1-1. After Procedure/Extraction: 7 Days. Dosage: 1-1-1. Best results with CUTE Mouthwash",
      treatmentPeriod: "Before: 3 Days, After: 7 Days",
      route: "Oral mucosal",
      cause: "Severe tooth decay / infection",
      uses: "80% faster recovery",
    },
    "Habit breaking appliances": {
      dosage:
        "Before Appliance: 3 Days. Dosage: 1-0-1. After Appliance: 6-7 Days. Dosage: 1-1-1. Best results with CUTE Mouthwash",
      treatmentPeriod: "Before: 3 Days, After: 6-7 Days",
      route: "Oral mucosal",
      cause: "Device-induced irritation",
      uses: "75% hygiene maintenance",
    },
    "Preventative/Regular maintenance of oral health": {
      dosage: "Treatment Period: 10 Days. Dosage: 1-0-1. Best results with CUTE Mouthwash",
      treatmentPeriod: "10 Days",
      route: "Oral mucosal",
      cause: "General hygiene",
      uses: "85–95% oral hygiene",
    },
  },
  "Pink Smarts": {
    "Xerostomia- dryness of mouth": {
      dosage:
        "Treatment period: 10 Days. Dosage 1-0-1. Best results with CUTE Mouthwash",
      treatmentPeriod: "10 Days",
      route:
        "Oral mucosal (For best results chew softly for 1 min & allow it to dissolve slowly)",
      cause: "Lack of saliva - dysbiosis (Microbial imbalance)",
      uses: "70% increased stimulation of saliva. Maintains ideal pH for stimulation of saliva and promotes overall good oral bacteria",
    },
    "Tooth erosion-loss of tooth enamel/weakening": {
      dosage:
        "Treatment period: 7 Days. Dosage 1-0-1. Best results with CUTE Mouthwash",
      treatmentPeriod: "7 Days",
      route: "Oral mucosal",
      cause: "Plaque contains millions of bacteria that attack the teeth enamel",
      uses: "55% to 65% reduction of tooth sensitivity",
    },
    "Halitosis-Bad breath": {
      dosage: "Treatment period: 7 Days. Dosage 1-0-1. Best results with CUTE Mouthwash",
      treatmentPeriod: "7 Days",
      route: "Oral mucosal",
      cause: "Plaque / gum disease / GERD / poor oral hygiene",
      uses: "75% reduction of bad breath",
    },
    "Gingivitis-Gingival inflammation/bleeding on probing": {
      dosage:
        "After scaling, Treatment period: 5 Days. Dosage 1-0-1. Best results with CUTE Mouthwash",
      treatmentPeriod: "5 Days",
      route: "Oral mucosal",
      cause: "Gingivitis causing bacteria Streptococcus mutans / candida albicans",
      uses: "65% reduction in gingival inflammation/bleeding on probing",
    },
    "Periodontitis: Infected gums/loose tooth": {
      dosage:
        "Before root planning/deep scaling: 2 Days. Dosage 1-0-1. After root planning/deep scaling: 5 Days. Dosage 1-1-1. Best results with CUTE Mouthwash",
      treatmentPeriod: "Before: 2 Days, After: 5 Days",
      route: "Oral mucosal",
      cause: "Pathogenic bacteria/plaque formation/severe gum disease",
      uses: "65% reduction of infection of gums. 60% stability of loose tooth",
    },
    "Pregnancy tumor-over growth on gingiva": {
      dosage: "Treatment period: 7 Days. Dosage 1-0-1. Best results with CUTE Mouthwash",
      treatmentPeriod: "7 Days",
      route: "Oral mucosal",
      cause: "Bleeding, inflammation",
      uses: "60% to 70% reduction of progression of decay. 65% to 70% reduction of size/discomfort",
    },
    "Preventive/Balanced Oral cavity in pregnancy": {
      dosage: "Treatment period: 10 Days. Dosage 0-1-0. Best results with CUTE Mouthwash",
      treatmentPeriod: "10 Days",
      route: "Oral mucosal",
      cause: "Poor oral hygiene",
      uses: "80% healthy maintenance of oral activity",
    },
    "Tooth decay-destruction of tooth": {
      dosage:
        "Before filling/RCT: 2 Days. Dosage 1-0-1. After filling/RCT: 5 Days. Dosage 1-1-1. Best results with CUTE Mouthwash",
      treatmentPeriod: "Before: 2 Days, After: 5 Days",
      route: "Oral mucosal",
      cause: "Weakens tooth, spreads decay rapidly",
      uses: "60% to 70% reduction of progression of decay",
    },
  },
};

const STEPS = ["Gender", "Age", "Patient Type", "Disease Condition"];

export default function DosageCalculator() {
  const [view, setView] = useState("landing"); // landing | quiz | results
  const [step, setStep] = useState(0);

  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [pregnant, setPregnant] = useState("");
  const [diabetic, setDiabetic] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [formType, setFormType] = useState("liquid");
  const [showPregnancyPopup, setShowPregnancyPopup] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    if (openDropdown) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [openDropdown]);

  const currentProduct = useMemo(() => {
    if (age && parseInt(age) <= 14) return "Junior Smarts";
    if (diabetic === "yes") return "Dia Smarts";
    if (gender === "female" && pregnant === "yes") return "Pink Smarts";
    return "Prime Smarts";
  }, [age, diabetic, gender, pregnant]);

  const handleNext = () => {
    setError("");
    if (step === 0 && !gender) return setError("Please select a gender.");
    if (step === 1) {
      if (!age) return setError("Please enter an age.");
      if (parseInt(age) < 3) return setError("Age must be at least 3.");
    }
    if (step === 2 && !diabetic) return setError("Please select a patient type.");
    if (step === 3) {
      if (!selectedCondition) return setError("Please select a disease condition.");
      setSelectedProduct(currentProduct);
      setView("results");
      return;
    }
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setError("");
    if (step === 0) {
      setView("landing");
    } else {
      setStep((s) => s - 1);
    }
  };

  const resetQuiz = () => {
    setStep(0);
    setGender("");
    setAge("");
    setDiabetic("");
    setPregnant("");
    setSelectedCondition("");
    setSelectedProduct("");
    setError("");
    setView("landing");
  };

  // ── LANDING VIEW ──────────────────────────────────────────────────────────
  if (view === "landing") {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-1 flex flex-col md:flex-row">
          {/* Left: Image */}
          <div className="relative w-full md:w-1/2 min-h-[320px] md:min-h-[750px]">
            <Image
              src="/Images/girl.jpg"
              alt="Dental health"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>

          {/* Right: Content */}
          <div className="w-full md:w-1/2 flex items-center justify-center px-8 py-16 md:py-0">
            <div className="max-w-md w-full">
              <p className="text-sm font-semibold tracking-widest uppercase text-gray-400 mb-4">
                Personalized Recommendations
              </p>
              <h1
                className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-primary-brown"
              >
                Ready to find a new routine?
              </h1>
              <p className="text-gray-500 text-lg mb-10 leading-relaxed">
                Answer a few questions to receive personalized product picks.
              </p>
                <button
                  onClick={() => { setView("quiz"); setStep(0); }}
                  className="px-10 py-4 cursor-pointer rounded-full text-white font-bold text-lg tracking-wide transition-opacity hover:opacity-90 bg-primary-brown"
                >
                START QUIZ
              </button>
            </div>
          </div>
        </main>
        <BestSellers />
        <Footer />
      </div>
    );
  }

  // ── RESULTS VIEW ──────────────────────────────────────────────────────────
  if (view === "results") {
    return (
      <div className="flex flex-col min-h-screen bg-background text-primary-brown">
        <Navbar />
        <main className="flex-1 px-4 py-10 max-w-6xl mx-auto w-full">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Your Results</h2>
            <button
              onClick={resetQuiz}
              className="text-sm cursor-pointer font-semibold px-5 py-2 rounded-full border border-gray-300 hover:bg-gray-50 transition"
            >
              ← Retake Quiz
            </button>
          </div>

          {dosageData[selectedProduct]?.[selectedCondition] ? (
              <section className="bg-secondary-blue text-cream rounded-lg p-4 md:p-6 lg:p-8 mb-6">
              <h2 className="text-lg md:text-xl font-bold font-poppins text-center mb-4 md:mb-6">
                {selectedProduct.toUpperCase()}
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full table-auto bg-white text-black rounded-lg overflow-hidden">
                  <thead>
                     <tr className="font-poppins bg-foreground-pink text-white">
                      <th className="border border-gray-400 px-3 md:px-4 py-3 md:py-4 text-base md:text-lg font-bold text-center">Disease Condition</th>
                      <th className="border border-gray-400 px-3 md:px-4 py-3 md:py-4 text-base md:text-lg font-bold text-center">Recommended Dosage</th>
                      <th className="border border-gray-400 px-3 md:px-4 py-3 md:py-4 text-base md:text-lg font-bold text-center">Treatment Period</th>
                      <th className="border border-gray-400 px-3 md:px-4 py-3 md:py-4 text-base md:text-lg font-bold text-center">Route</th>
                      <th className="border border-gray-400 px-3 md:px-4 py-3 md:py-4 text-base md:text-lg font-bold text-center">Cause</th>
                      <th className="border border-gray-400 px-3 md:px-4 py-3 md:py-4 text-base md:text-lg font-bold text-center">Uses</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-3 md:px-4 py-3 md:py-4 text-base md:text-lg font-medium text-center">{selectedCondition}</td>
                      <td className="border border-gray-300 px-3 md:px-4 py-3 md:py-4 text-center">
                        <span className="px-3 py-2 rounded-lg font-bold bg-purple-light text-teal-dark text-base md:text-lg font-poppins">
                          {extractDosage(dosageData[selectedProduct]?.[selectedCondition]?.dosage)}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-3 md:px-4 py-3 md:py-4 text-center">
                        <span className="px-3 py-2 rounded-lg font-bold bg-pink-light text-teal-dark font-poppins text-base md:text-lg">
                          {dosageData[selectedProduct]?.[selectedCondition]?.treatmentPeriod || "—"}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-3 md:px-4 py-3 md:py-4 text-base md:text-lg font-medium text-center">{dosageData[selectedProduct]?.[selectedCondition]?.route || "—"}</td>
                      <td className="border border-gray-300 px-3 md:px-4 py-3 md:py-4 text-base md:text-lg font-medium text-center">{dosageData[selectedProduct]?.[selectedCondition]?.cause || "—"}</td>
                      <td className="border border-gray-300 px-3 md:px-4 py-3 md:py-4 text-base md:text-lg font-medium text-center">{dosageData[selectedProduct]?.[selectedCondition]?.uses || "—"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-6 md:p-8 bg-primary-brown text-white rounded-xl border-2 border-teal-dark space-y-5">
                <div className="pb-4 border-b-2 border-teal-dark">
                  <p className="text-base md:text-xl font-poppins">
                    <strong className="font-bold text-foreground-pink text-lg md:text-2xl">✓ For Best Results:</strong>{" "}
                    <span className="text-base md:text-lg">CUTE Mouthwash is recommended alongside {selectedProduct}.</span>
                  </p>
                </div>

                <div className="pb-4 border-b-2 border-teal-dark">
                  <p className="text-base md:text-xl font-poppins">
                    <strong className="font-bold text-foreground-pink text-lg md:text-2xl">💊 Dosage:</strong>{" "}
                    <span className="text-base md:text-lg">{dosageTextByForm[formType]}</span>
                  </p>
                  <div className="mt-3 flex items-center gap-6">
                    <label className="inline-flex items-center font-poppins text-base md:text-lg cursor-pointer">
                      <input type="radio" name="form" value="liquid" checked={formType === "liquid"} onChange={() => setFormType("liquid")} className="mr-2 w-4 h-4 cursor-pointer" />
                      Liquid
                    </label>
                    <label className="inline-flex items-center font-poppins text-base md:text-lg cursor-pointer">
                      <input type="radio" name="form" value="powder" checked={formType === "powder"} onChange={() => setFormType("powder")} className="mr-2 w-4 h-4 cursor-pointer" />
                      Powder
                    </label>
                  </div>
                </div>

                <div className="pb-4 border-b-2 border-teal-dark">
                  <p className="text-base md:text-xl font-poppins">
                    <strong className="font-bold text-foreground-pink text-lg md:text-2xl">👥 Age Group:</strong>{" "}
                    <span className="text-base md:text-lg">For all age groups</span>
                  </p>
                </div>

                <div>
                  <p className="text-base md:text-xl font-poppins mb-2">
                    <strong className="font-bold text-foreground-pink text-lg md:text-2xl">🧪 Key Ingredients:</strong>
                  </p>
                  <p className="text-base md:text-lg text-white leading-relaxed">
                    {keyIngredientsData[selectedProduct] || "N/A"}
                  </p>
                </div>
              </div>
            </section>
          ) : (
            <p className="text-center text-gray-500">No data found for the selected options.</p>
          )}
        </main>
        <BestSellers />
        <Footer />
      </div>
    );
  }

  // ── QUIZ VIEW ─────────────────────────────────────────────────────────────
  const conditionOptions = Object.keys(dosageData[currentProduct] || {});

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg">
          {/* Progress Dots */}
          <div className="flex items-center justify-center gap-0 mb-12">
            {STEPS.map((label, i) => (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      i < step
                        ? "text-primary-brown bg-secondary-blue"
                        : i === step
                        ? "text-white bg-secondary-blue scale-110 shadow-lg"
                        : "text-white bg-gray-200"
                    }`}
                  >
                  {i < step ? <Check size={16} /> : i + 1}
                </div>
                  <span
                    className={`text-xs font-medium hidden sm:block ${
                      i === step ? "text-primary-brown" : "text-primary-brown/50"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 w-16 sm:w-20 mx-1 mb-5 transition-all duration-300 ${
                      i < step ? "bg-secondary-blue" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Question Card */}
          <div className="p-8 md:p-10">
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2">
              Question {step + 1} of {STEPS.length}
            </p>

                {/* Step 0: Gender */}
            {step === 0 && (
              <>
                <h2 className="text-2xl font-bold mb-8 text-primary-brown">
                  What is the patient's gender?
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {["male", "female"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setGender(opt); setError(""); }}
                      className={`py-4 rounded-xl font-semibold text-base capitalize border-2 transition-all ${
                        gender === opt
                          ? "border-secondary-blue text-secondary-blue bg-teal-light"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {opt === "male" ? "👨 Male" : "👩 Female"}
                    </button>
                  ))}
                </div>
              </>
            )}

                {/* Step 1: Age */}
            {step === 1 && (
              <>
                <h2 className="text-2xl font-bold mb-8 text-primary-brown">
                  How old is the patient?
                </h2>
                <input
                  type="number"
                  placeholder="Enter age (e.g. 25)"
                  className="w-full h-14 px-5 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-secondary-blue text-base transition"
                  value={age}
                  onChange={(e) => { setAge(e.target.value); setError(""); }}
                />
                {age && parseInt(age) < 3 && (
                  <p className="text-red-500 text-sm mt-2">Age must be at least 3</p>
                )}
              </>
            )}

                {/* Step 2: Diabetic */}
            {step === 2 && (
              <>
                <h2 className="text-2xl font-bold mb-8 text-primary-brown">
                  What is the patient type?
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {[{ value: "yes", label: "🩺 Diabetic" }, { value: "no", label: "✅ Non-Diabetic" }].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setDiabetic(opt.value);
                        setError("");
                        if (opt.value === "no" && gender === "female" && parseInt(age) > 18) {
                          setShowPregnancyPopup(true);
                        }
                      }}
                      className={`py-4 rounded-xl font-semibold text-base border-2 transition-all ${
                        diabetic === opt.value
                          ? "border-secondary-blue text-secondary-blue bg-teal-light"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}

                {/* Step 3: Disease Condition */}
            {step === 3 && (
              <>
                <h2 className="text-2xl font-bold mb-8 text-primary-brown">
                  Select the disease condition
                </h2>
                <div className="relative">
                  <div
                    className="w-full h-14 px-5 rounded-xl border-2 border-gray-200 flex items-center justify-between cursor-pointer hover:border-gray-300 transition"
                    onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === "condition" ? null : "condition"); }}
                  >
                    <span className={selectedCondition ? "text-gray-900" : "text-gray-400"}>
                      {selectedCondition || "Select disease condition"}
                    </span>
                    <ChevronDown size={20} className={`transition-transform ${openDropdown === "condition" ? "rotate-180" : ""}`} />
                  </div>
                  {openDropdown === "condition" && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-56 overflow-y-auto">
                      {conditionOptions.map((condition) => (
                        <div
                          key={condition}
                          className="px-5 py-3 hover:bg-teal-50 cursor-pointer flex items-center justify-between text-sm transition"
                          onClick={(e) => { e.stopPropagation(); setSelectedCondition(condition); setOpenDropdown(null); setError(""); }}
                        >
                          <span>{condition}</span>
                          {selectedCondition === condition && <Check size={16} className="text-teal-600" />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

            {/* Navigation */}
            <div className="flex justify-between mt-10">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 font-medium transition"
              >
                <ArrowLeft size={18} /> Back
              </button>
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-8 py-3 rounded-full text-white font-bold transition-opacity hover:opacity-90 bg-secondary-blue"
              >
                {step === STEPS.length - 1 ? "See Results" : "Next"} <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Pregnancy Popup */}
      {showPregnancyPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[420px] text-center shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold font-poppins text-gray-900">Confirm Patient Status</h2>
              <button onClick={() => setShowPregnancyPopup(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
              Please confirm if the patient is pregnant or non-pregnant to provide the accurate dosage recommendation.
            </p>
            <div className="flex justify-start gap-4 mb-8">
              <label className="flex items-center cursor-pointer font-poppins">
                <input type="radio" name="pregnancy" value="pregnant" checked={pregnant === "yes"} onChange={() => setPregnant("yes")} className="h-4 w-4 text-teal-600 border-gray-300" />
                <span className={`ml-2 ${pregnant === "yes" ? "text-gray-900" : "text-gray-400"}`}>Pregnant</span>
              </label>
              <label className="flex items-center cursor-pointer font-poppins">
                <input type="radio" name="pregnancy" value="non-pregnant" checked={pregnant === "no"} onChange={() => setPregnant("no")} className="h-4 w-4 text-teal-600 border-gray-300" />
                <span className={`ml-2 ${pregnant === "no" ? "text-gray-900" : "text-gray-400"}`}>Non-Pregnant</span>
              </label>
            </div>
            <div className="flex justify-between gap-4">
              <button onClick={() => setShowPregnancyPopup(false)} className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={() => setShowPregnancyPopup(false)} className="flex-1 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 font-poppins">
                Confirm & Continue
              </button>
            </div>
          </div>
        </div>
      )}

      <BestSellers />
      <Footer />
    </div>
  );
}
