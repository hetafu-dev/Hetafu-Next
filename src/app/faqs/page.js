'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Navbar from "@/app/Components/Common/Navbar/Page";
import Footer from "@/app/Components/Common/Footer/Page";
import BestSellers from "@/app/Components/Common/BestSellers/Page";

const faqData = [
    {
      category: "General",
      faqs: [
        { question: "What does Dental Nutrition mean?", answer: "Dental Nutrition means oral care in an edible form. It is the science of using nutrients to support teeth, gums, and oral microbiome health. Our products are designed to nourish and protect the mouth, beyond just brushing and flossing." },
        { question: "Why do teeth need nutrition?", answer: "Teeth and gums are living tissues that need nutrients to stay strong, resist decay, and recover from everyday damage. Targeted nutrition helps maintain enamel strength, gum health, and overall oral balance." },
        { question: "How does Dental nutrition differ from brushing?", answer: "Brushing works for only 1-2 minutes, leaving the mouth unprotected for the rest of the day. Dental Nutrition helps maintain a stable, healthy oral environment for the remaining 23 hours and 58 minutes." },
        { question: "Why are Hetafu products better than other oral care products?", answer: "Hetafu is the world's first Dental Nutrition approach, offering edible oral care that nourishes teeth, gums, and the oral microbiome. Unlike regular oral care products that kill both good and bad bacteria, Hetafu selectively reduces harmful microbes within 1 minute while supporting beneficial ones, providing longer-lasting protection beyond brushing." },
        { question: "Does Dental Nutrition replace brushing and flossing?", answer: "No, it doesn't replace them. Dental Nutrition works alongside brushing and flossing to provide all-day protection, microbiome balance, and targeted oral support that regular cleaning cannot offer." },
        { question: "What happens when bad bacteria increase in the mouth?", answer: "When harmful bacteria multiply, they create acids and toxins that cause cavities, swollen gums, bad breath, and oral imbalance. Over time, this disrupts the microbiome and makes the mouth more prone to infections and discomfort." },
        { question: "Why aren't regular vitamins and minerals enough for Dental nutrition?", answer: "Vitamins and minerals support overall health, but don't act locally inside the mouth, and their benefits are reduced due to bioavailability after digestion. Dental Nutrition delivers direct, targeted support to the oral microbiome, gums, and teeth where it's needed most." },
        { question: "What makes Hetafu Dental Nutrition formulations so unique?", answer: "All the products are made with a blend of probiotics and essential oils that work together through a bacteriostatic (preventing the growth of harmful bacteria) and bactericidal (killing bad bacteria) mechanism. This dual action makes Hetafu the first-of-its-kind edible oral care system in the world." },
        { question: "What are the main active ingredients used in Hetafu products?", answer: "All products contain a blend of probiotics, essential oils, prebiotics, natural sweeteners, and pH-balancing ingredients. Each format is designed to support oral microbiome balance and healing." },
        { question: "Are Hetafu products safe for all age groups?", answer: "Yes, Hetafu products are edible, sugar-free, clinically tested, and safe for everyone from children (above 3 years) to adults, pregnant women, ICU patients, cancer patients, elderly individuals, and medically compromised groups." },
        { question: "Are Hetafu products clinically proven?", answer: "Yes, Hetafu products have been evaluated through 18+ clinical studies and are developed using science-backed formulations." },
        { question: "Are Hetafu products safe for diabetics?", answer: "Yes, all products are 100% sugar-free and made with natural sweeteners suitable for diabetics." },
        { question: "Are Hetafu products safe during pregnancy and breastfeeding?", answer: "Yes, our products are safe. Still, we recommend consulting a healthcare professional before use in pregnancy or breastfeeding." },
        { question: "Are there any side effects from using Hetafu products?", answer: "There are no significant side effects, but some people may experience mild gas or bloating initially. This is a temporary adjustment phase, as beneficial probiotics rebalance existing oral–gut bacteria. Symptoms usually settle as the body adapts and are not harmful." },
        { question: "What does it mean that Hetafu products are IDA-Accepted?", answer: "It means Hetafu products have been evaluated and accepted by the Indian Dental Association (IDA) and meet the standards for safety, quality, and claimed benefits. It serves as a trusted quality benchmark, helping both dentists and consumers choose reliable oral-care products with confidence." },
        { question: "Are Hetafu products safe to use daily?", answer: "Yes, they are designed for everyday use, with safe, edible & natural ingredients suitable for continuous long-term oral support." },
        { question: "Can I use Hetafu products even if I don't have any dental problems?", answer: "Yes, because they help maintain a healthy oral microbiome, fresh breath, and strengthen the enamel, making them ideal for daily preventive oral care." },
        { question: "Do I need a dentist's prescription to use these products?", answer: "Hetafu products are available through dentists, so you will need to visit your dental professional to receive the appropriate recommendation and guidance for use." },
        { question: "Can I use Hetafu products along with my regular medications?", answer: "Yes, they are safe to use with regular medications, antibiotics and painkillers. As they act locally in the mouth. If you are on long courses of medication, check with your doctor for personalised advice." },
        { question: "How to order these products?", answer: "You can order Hetafu products directly by clicking the link below and messaging us on WhatsApp: `https://wa.me/918106989955` text - Hi, I have a product inquiry." },
        { question: "Are Hetafu products safe for kids?", answer: "Yes. Hetafu products are edible, sugar-free, and made of natural ingredients, making them safe for children (above 3 years)." },
        { question: "Can Hetafu products support oral care with frequent snacking?", answer: "Yes. Frequent snacking increases oral acidity and bad bacteria. Hetafu products help by balancing oral pH and reducing harmful microbes and bad breath." },
        { question: "Will Hetafu gummies stick to braces and wires?", answer: "Yes, Hetafu gummies are soft and appliance-safe. They gently attach around brackets and wires, where bacteria commonly build up, & allows active ingredients to act on these plaque-prone areas, without damaging braces, causing discomfort, or increasing the risk of breakage. So, even if they stick, it is beneficial." },
        { question: "Can different Hetafu products be used together?", answer: "Yes. Different Hetafu products can be used together as part of daily oral care, as they are designed to complement each other. Follow your dentist's guidance for best results." },
        { question: "Should I use them even after oral issues have resolved?", answer: "Yes. Our products can be used for daily preventive oral care to help maintain long-term oral hygiene and systemic health." },
        { question: "How do gummies help in faster healing?", answer: "Hetafu gummies are formulated with probiotics and essential oils that clinically help reduce harmful oral bacteria and inflammation. By lowering the microbial load at the site of injury and supporting a healthier oral environment, they promote faster tissue healing and recovery." },
        { question: "Are Hetafu products useful to manage dental pain?", answer: "Yes. The essential oils and probiotics in Hetafu products help reduce bacterial load and inflammation, supporting healing and easing discomfort associated with dental pain." },
        { question: "Why are there different gummies for men & women?", answer: "Men and women experience different hormonal and oral health challenges. Hetafu gummies are formulated to address these specific biological and lifestyle needs more effectively." },
        { question: "I use clear aligners. Can I use Hetafu products?", answer: "Yes. Hetafu products are aligner-safe and help maintain oral hygiene, reduce bad breath, and control bacterial buildup during aligner use." },
        { question: "Can Navy personnel use Hetafu products for daily oral care?", answer: "Yes. In confined environments like the Navy, where water availability for personal hygiene can be as limited as about 500 ml per person per week, Hetafu products are especially useful. They are water-free, swallow-safe, and easy to use, making them suitable when routine brushing, rinsing, and spitting are not feasible." },
        { question: "Can poor oral hygiene affect overall health?", answer: "Yes. An imbalanced oral microbiome doesn't just cause plaque, cavities, gum disease, and bad breath – it allows harmful bacteria to enter the bloodstream. This can impact the entire body, increasing the risk of heart disease, lung infections, brain fog, IBS, kidney problems, cancers, diabetes, and pregnancy complications." },
        { question: "Can I use Hetafu products with caps on teeth?", answer: "Hetafu products are safe with caps and crowns. Even if they stick, they do not pull off the restorations and help keep the area clean, supporting oral hygiene without irritation or damage." },
        { question: "Is there a link between poor oral health and increased cancer risk?", answer: "Yes. Poor oral hygiene can increases inflammation, which research has linked to higher risks of some systemic conditions, including cancers. Hetafu products help by selectively reducing harmful bacteria, maintaining oral balance, and supporting a healthier oral environment as part of daily care." },
        { question: "Are these products made in INDIA?", answer: "Yes. We are proud to say that all the Hetafu products are Made in India." },
        { question: "Are these products available in INDIA?", answer: "Yes. Hetafu products are available across India." },
        { question: "Where is the company based from?", answer: "Hetafu is headquartered in Hyderabad, India." },
        { question: "Is shipping within Hyderabad available?", answer: "Yes. We offer shipping within Hyderabad. You can place an order and get the products delivered directly to your location in the city by contacting us on WhatsApp: `https://wa.me/918106989955`" },
        { question: "Is international shipping available?", answer: "No. International shipping is not available at the moment. We are currently serving orders within India only and will share updates when international shipping becomes available." }
      ]
    },
    {
      category: "Denta-Smarts",
      faqs: [
        { question: "What is DentaSmarts?", answer: "DentaSmarts is the world's first clinically tested, IDA-approved dental nutrition gummy with probiotics and essential oils to support long-term oral health." },
        { question: "What makes DentaSmarts different from regular gummies?", answer: "Unlike regular gummies, DentaSmarts is designed as a dental nutrition gummy. It nourishes teeth, supports gums, and protects against cavities while tasting like a treat." },
        { question: "How can a gummy improve my dental health?", answer: "The formula is enriched with active molecules of essential oils and probiotic strains that reduce harmful bacteria, fungus, and spores in the mouth, helping good bacteria grow." },
        { question: "Is DentaSmarts clinically tested?", answer: "Yes. DentaSmarts is clinically tested and IDA-approved, ensuring both safety and proven effectiveness." },
        { question: "How does DentaSmarts help with recovery?", answer: "By restoring bacterial balance and reducing inflammation, DentaSmarts cuts recovery time after dental procedures by up to 50%." },
        { question: "Does DentaSmarts replace regular brushing and flossing?", answer: "No. It complements daily oral hygiene by adding nutrition and microbiome support that brushing and flossing cannot provide." },
        { question: "How soon will I notice results?", answer: "Users often report fresher breath and improved results from the first use, while benefits like reduced gum problems and faster recovery appear with consistent use." },
        { question: "How does DentaSmarts taste?", answer: "It tastes like a fruity candy, making it enjoyable for kids and adults while delivering clinically proven oral health benefits." },
        { question: "How does DentaSmarts support overall health?", answer: "A healthy mouth lowers the risk of systemic issues linked to gum disease, like heart problems and diabetes complications." }
      ]
    },
    {
      category: "Dia-Smarts",
      faqs: [
        { question: "What is Dia-Smarts?", answer: "Dia-Smarts is the world's first IDA-approved and clinically tested sugar-free gummy designed specially for people with diabetes to improve dental recovery time by 50%." },
        { question: "Is Dia-Smarts completely sugar-free?", answer: "Yes. Dia-Smarts contains zero sugar and uses safe alternatives, making it ideal for people with diabetes." },
        { question: "Why do diabetics need a different dental nutrition product?", answer: "Diabetes reduces saliva, slows healing, and increases gum inflammation. Dia-Smarts is formulated to address these specific needs." },
        { question: "Can Dia-Smarts replace regular oral care?", answer: "No. It complements brushing and flossing by giving your teeth and gums the dental nutrition they need to reduce dental ailments." },
        { question: "How soon will I see results with Dia-Smarts?", answer: "Patients often notice fresher breath and comfort within 1st use, while improvements in gum health and healing appear over weeks." },
        { question: "Can elderly diabetic patients use Dia-Smarts?", answer: "Yes. Dia-Smarts is safe and particularly beneficial for elderly patients who often face greater oral challenges with diabetes." },
        { question: "Are there any side effects?", answer: "No. Dia-Smarts is made with safe, sugar-free ingredients and is well-tolerated by diabetic patients." },
        { question: "Why is Dia-Smarts recommended by dentists?", answer: "Because it directly addresses oral issues linked with diabetes, offering targeted support that regular oral care or sugar-free candies cannot provide." },
        { question: "How many gummies should I take daily?", answer: "Follow the recommended serving mentioned on the product pack or as advised by your dentist." },
        { question: "How is Dia-Smarts different from regular sugar-free candies?", answer: "Unlike regular sugar-free candies, Dia-Smarts is clinically tested, dentist-recommended, and formulated to target the specific oral health issues faced by people with diabetes." }
      ]
    },
    {
      category: "Junior-Smarts",
      faqs: [
        { question: "What is Junior-Smarts?", answer: "Junior-Smarts are clinically tested, dentist-recommended gummies designed to help kids heal faster, prevent cavities, and build stronger teeth." },
        { question: "How does Junior-Smarts work?", answer: "It balances oral bacteria, strengthens enamel, and supports natural healing, giving kids 50% faster recovery from dental pain and procedures." },
        { question: "Is Junior-Smarts safe for children?", answer: "Yes. Junior-Smarts is formulated especially for kids and is safe, chemical-free, and gentle on growing teeth and gums." },
        { question: "What age group can use Junior-Smarts?", answer: "It is recommended for children aged 3 to 14 years or as advised by a dentist." },
        { question: "Does Junior-Smarts contain sugar?", answer: "No. It is sugar-free, making it safe for children while still tasting like a fruity gummy." },
        { question: "How does it prevent cavities?", answer: "By controlling harmful bacteria and providing essential nutrients, Junior-Smarts protects enamel and reduces the risk of cavities." },
        { question: "Can Junior-Smarts help with dental pain?", answer: "Yes. It promotes faster healing and reduces gum inflammation, which helps relieve dental discomfort in children." },
        { question: "How soon will I see results?", answer: "Relief and healing benefits can be noticed within weeks, while cavity prevention and stronger teeth come with consistent daily use." },
        { question: "Why choose Junior-Smarts over regular gummies or supplements?", answer: "Unlike regular gummies, Junior-Smarts is clinically tested, dentist-approved, tasty and specifically designed to support children's dental health." },
        { question: "How do Junior Smarts help children's oral health?", answer: "Children often consume more sugar and snack frequently, which increases the risk of cavities and bad breath. Junior smarts help by reducing cavity-causing bacteria, balancing mouth acidity, and supporting cleaner teeth in an edible, child-safe way." }
      ]
    },
    {
      category: "Prime-Smarts",
      faqs: [
        { question: "What is Prime-Smarts?", answer: "Prime-Smarts is the world's first clinically tested dental nutrition gummy for men. It reduces dental recovery time by 50%, rebuilds enamel, reduces sensitivity, and restores oral confidence." },
        { question: "Why is Prime-Smarts made for men?", answer: "Men often ignore preventive dental care and face higher risks of gum disease and sensitivity. Prime-Smarts is designed to fit easily into a busy lifestyle while addressing these specific needs." },
        { question: "What makes Prime-Smarts the first of its kind?", answer: "It is the world's first clinically tested dental nutrition gummy tailored for men, addressing enamel loss, sensitivity, and post-treatment recovery in one product." },
        { question: "Can Prime-Smarts help with tooth sensitivity?", answer: "Yes. By repairing enamel and reducing nerve exposure, Prime-Smarts helps eliminate sensitivity to hot, cold, and sweet foods." },
        { question: "Is Prime-Smarts only for recovery after dental work?", answer: "No. It supports everyday dental strength, but is especially effective in aiding recovery after treatments like fillings, scaling, or whitening." },
        { question: "Can Prime-Smarts replace brushing and flossing?", answer: "No. It complements daily hygiene by giving teeth the nutrition that brushing alone cannot provide." },
        { question: "Are there side effects?", answer: "No. Prime-Smarts is safe, clinically tested, and free from harmful chemicals." },
        { question: "How many gummies should I take daily?", answer: "We recommend 1–2 candies a day, ideally after meals or during the day, for ongoing oral and digestive support." }
      ]
    },
    {
      category: "Pink-Smarts",
      faqs: [
        { question: "Is Pink Smarts just for women?", answer: "While Pink Smarts is designed with women's health in mind, its ingredients are safe and beneficial for anyone looking for clean oral and gut support." },
        { question: "Do Pink Smarts contain sugar or artificial sweeteners?", answer: "No. Pink Smarts is 100% sugar-free and contains no artificial sweeteners, preservatives, or additives. It's sweetened naturally and made for daily, guilt-free use." },
        { question: "How do Pink Smarts help with oral health?", answer: "Pink Smarts contains essential oils known for their antibacterial properties that help fight bad breath and support gum health. It also contains probiotics that promote a healthier oral microbiome." },
        { question: "Is Pink Smarts suitable for teens or older adults?", answer: "Absolutely. Pink Smarts is safe for teens, adults, and seniors. It's a gentle, effective option for women of all ages looking to improve oral hygiene and internal balance, without harsh ingredients." },
        { question: "Can I use Pink Smarts alongside other supplements or medications?", answer: "Yes, Pink Smarts is safe to use with most supplements and medications. However, if you have specific health concerns or are on prescription medications, it's always a good idea to consult with your healthcare provider first." }
      ]
    },
    {
      category: "CUTE Mouthwash",
      faqs: [
        { question: "What is CUTE Mouthwash?", answer: "CUTE is the world's first edible, tasty, and clinically proven mouthwash designed to clean, protect, and remineralise your teeth." },
        { question: "How is CUTE different from regular mouthwash?", answer: "Unlike chemical mouthwashes with an acidic pH (3–5), CUTE has an alkaline pH of 7.62. That means no burning, no staining, and enamel protection." },
        { question: "Why is the alkaline pH important?", answer: "An alkaline pH helps restore the mouth's natural buffering capacity, reducing acid damage and supporting enamel remineralisation." },
        { question: "Does CUTE work as well as chemical mouthwash?", answer: "Yes. It has the same anti-gingival and anti-caries efficacy as chlorhexidine, without side effects like staining or taste alteration." },
        { question: "What are the main benefits of CUTE?", answer: "It's edible, chemical-free, enamel-remineralising, braces-friendly, clinically proven, and economically priced." },
        { question: "Can CUTE help with enamel strength?", answer: "Yes. Its alkaline formula supports enamel remineralisation and helps restore the natural protective oral film." },
        { question: "How is CUTE Mouthwash suitable for elderly oral care?", answer: "Elderly individuals often suffer from dry mouth, weak gums, loose teeth, sensitivity, and difficulty brushing or rinsing. CUTE mouthwash helps by maintaining oral hygiene, reducing sensitivity, strengthening the gums, reducing bad breath and keeping the mouth moist." },
        { question: "Can caregivers use CUTE Mouthwash for hospitalised patients?", answer: "Yes. CUTE mouthwash are swallow-safe and easy to use, making them suitable for caregivers to use for hospitalised or dependent patients, especially when routine brushing or rinsing is difficult." },
        { question: "Will CUTE mouthwash cause any burning or irritation in the mouth?", answer: "No. CUTE mouthwash is free from chemicals & alcohol, and do not cause any burning or irritation." },
        { question: "Can children with braces use CUTE mouthwash?", answer: "Yes. CUTE Mouthwash is alcohol-free, chemical-free, and edible, making it safe for children. Its neutral pH (~7.6) helps soothe brace-related ulcers, reduces irritation and dryness, and maintains oral hygiene without burning, making daily oral hygiene easier for kids with braces." }
      ]
    },
    {
      category: "DentaBits",
      faqs: [
        { question: "Do Dentabits help with smoking-related oral issues?", answer: "Yes. Smoking causes dryness, bad breath, and microbial imbalance. Hetafu products help by reducing odour-causing bacteria and maintaining oral hygiene." }
      ]
    },
    {
      category: "Dollipops",
      faqs: [
        { question: "Do Dollipops increase the risk of cavities?", answer: "Cavities develop when sugars feed harmful bacteria, leading to acid attacks that weaken enamel and create tooth decay. Dollipops are nutrition-based sugar-free products that reduce cavity-causing bacteria, help balance oral pH, and support enamel protection, thereby lowering the risk of cavities." }
      ]
    },
    {
      category: "Clinical Applications",
      faqs: [
        { question: "What role do Hetafu products play in orthodontic care?", answer: "Braces and aligners trap food, increase plaque, and cause ulcers and bad breath. Hetafu products help by reducing plaque-causing bacteria within 1 minute, lowering mouth dryness, and soothing appliance-related irritation." },
        { question: "How are Hetafu products useful in Periodontics?", answer: "Patients with gum issues have swelling, bleeding, and microbial imbalance. Hetafu products help by lowering harmful oral bacteria, stabilising oral pH, and supporting reduced gum inflammation & bleeding." },
        { question: "Why are Hetafu products useful for denture and prosthesis wearers?", answer: "Patients using dentures or fixed prostheses often struggle with ulcers, dryness, and bad breath. Hetafu products help by improving salivary moisture, reducing odour-causing bacteria, and supporting 2x faster healing of ulcers." },
        { question: "How are Hetafu products useful in Conservative Dentistry & Endodontics?", answer: "Patients after fillings or root canal treatments often face sensitivity, pain, and dryness around the treated tooth. Hetafu products help by reducing harmful microbes, maintaining moisture, and soothing irritation pain 2x faster." },
        { question: "What oral-care challenges after surgeries can Hetafu products help address?", answer: "After extractions, jaw fractures or surgeries, patients often experience pain, dryness, delayed healing, limited mouth opening, and difficulty rinsing or brushing. Hetafu products help by reducing bacterial buildup, keeping oral tissues moist, promoting 2x faster healing, and maintaining basic oral hygiene when regular oral cleaning is not feasible." },
        { question: "How do Hetafu products benefit in Pedodontics?", answer: "Children often get cavities and bad breath because of too much sugar, frequent snacking, and poor brushing, which can lead to gum problems. Hetafu products help by reducing cavity-causing bacteria, balancing mouth acidity after sweets, and keeping teeth cleaner in a gentle way." },
        { question: "How do Hetafu products support Implants?", answer: "Implant sites need proper healing, and poor oral hygiene can lead to infection and implant failure. Hetafu products help by maintaining oral hygiene around the implant area, reducing harmful bacteria, and supporting up to 2× faster healing of the site." },
        { question: "How is CUTE mouthwash useful for ICU patients?", answer: "ICU patients often cannot brush, rinse, or spit, which leads to poor oral hygiene and infection risk. CUTE mouthwash helps by maintaining oral hygiene, reducing harmful bacteria, and keeping the mouth clean even when routine care is not possible." },
        { question: "What makes Hetafu products useful to bedridden patients?", answer: "Bedridden patients frequently skip oral care, leading to bad breath, dryness, and bacterial buildup. Hetafu products help by keeping the mouth clean, reducing bacteria, and supporting basic oral hygiene without effort." },
        { question: "How are Hetafu products useful for cancer patients?", answer: "Cancer treatments often cause mouth ulcers, dryness, loss of taste, burning sensations, and a higher risk of oral infections. Hetafu products help by maintaining oral hygiene, reducing harmful bacteria, soothing irritated tissues, and supporting faster healing of the mouth." },
        { question: "Are Hetafu Diasmarts Gummies beneficial for diabetic oral care?", answer: "Diabetic patients experience slow healing and higher risk of infection in the mouth. Hetafu products help by maintaining oral hygiene, reducing harmful bacteria, and supporting 2x faster healing of oral wounds." }
      ]
    },
];

export default function FaqsPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="min-h-screen bg-background font-sans py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl font-light text-center mb-16 text-slate-950">FAQ</h1>
            <div className="space-y-16">
              {faqData.map((category, categoryIndex) => (
                <section key={category.category}>
                  <h2 className="text-2xl font-medium text-center text-slate-950 mb-8">{category.category}</h2>
                  <div className="divide-y divide-slate-200">
                    {category.faqs.map((item, index) => {
                      const itemIndex = `${categoryIndex}-${index}`;
                      return (
                        <div key={itemIndex} className={`px-6 ${index !== category.faqs.length - 1 ? 'border-b border-slate-300' : ''}`}>
                          <button onClick={() => toggleAccordion(itemIndex)} className="w-full flex items-center justify-between py-6 text-left text-slate-950 hover:text-slate-900 transition-colors">
                            <span className="text-base font-semibold leading-6">{item.question}</span>
                            <ChevronDown size={24} className={`text-slate-950 flex-shrink-0 ml-4 transition-transform duration-300 ${openIndex === itemIndex ? 'transform rotate-180' : ''}`} />
                          </button>
                          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === itemIndex ? 'max-h-96 pb-6' : 'max-h-0'}`}>
                            <div className="text-sm leading-7 text-slate-600">{item.answer}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </main>
      <BestSellers />
      <Footer />
    </div>
  );
}