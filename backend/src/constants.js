// Static catalogue of doctor specializations shown on the landing page.
// Photo URLs are built from BACKEND_URL so the data is deployment-agnostic.

const SPECIALIZATIONS = [
  { photo: "onco.jpg", title: "Oncologist", description: "Specializes in diagnosing and treating cancer, offering treatments like chemotherapy, radiation, and immunotherapy to help patients fight the disease." },
  { photo: "neuro.jpg", title: "Neurologist", description: "Focuses on disorders of the nervous system, including the brain, spinal cord, and nerves, treating conditions like epilepsy, migraines, and strokes." },
  { photo: "cardio.jpg", title: "Cardiologist", description: "Expert in diagnosing and treating heart-related conditions such as hypertension, heart attacks, arrhythmias, and congenital heart diseases." },
  { photo: "physician.jpg", title: "Physician", description: "A general medical practitioner who provides comprehensive healthcare, diagnosing and managing a wide range of medical conditions." },
  { photo: "dentist.jpg", title: "Dentist", description: "Specializes in oral health, treating issues related to teeth, gums, and the overall health of the mouth, including preventive care and surgery." },
  { photo: "child.jpg", title: "Child Specialist", description: "Dedicated to the healthcare of infants, children, and adolescents, providing vaccinations, growth monitoring, and treatment for childhood illnesses." },
  { photo: "istockphoto-1226381047-612x612.jpg", title: "Dermatologist", description: "A skin care expert who diagnoses and treats skin conditions, hair loss, acne, eczema, and other dermatological issues." },
  { photo: "radio.jpg", title: "Radiologist", description: "Uses imaging technologies like X-rays, MRIs, and CT scans to diagnose and guide treatment for various medical conditions." },
  { photo: "gastro.jpg", title: "Gastroenterologist", description: "Specializes in diseases of the digestive system, treating conditions like acid reflux, irritable bowel syndrome, and liver diseases." },
  { photo: "endocrine.jpg", title: "Endocrinologist", description: "Deals with hormonal imbalances and gland-related disorders such as diabetes, thyroid issues, and adrenal diseases." },
  { photo: "istockphoto-1369683259-612x612.jpg", title: "Psychiatrist", description: "Focuses on mental health, diagnosing and treating conditions like depression, anxiety, bipolar disorder, and schizophrenia." },
  { photo: "istockphoto-1226381047-612x612.jpg", title: "Geriatrician", description: "Provides specialized care for older adults, addressing age-related medical issues such as dementia, arthritis, and frailty." },
  { photo: "24214-nephrologist.jpg", title: "Nephrologist", description: "Treats kidney-related diseases, including chronic kidney disease, kidney stones, and conditions requiring dialysis." },
  { photo: "istockphoto-1366650119-612x612.jpg", title: "Orthopaedist", description: "Specializes in the musculoskeletal system, treating bone fractures, joint issues, and sports injuries through surgical and non-surgical methods." },
  { photo: "allergy.jpg", title: "Allergist", description: "Treats allergies, asthma, and immune system disorders, providing testing and management for reactions to allergens like pollen and food." },
  { photo: "hemato.jpg", title: "Hematologists", description: "Focuses on blood-related conditions such as anemia, clotting disorders, leukemia, and lymphoma." },
  { photo: "internist.jpg", title: "Internists", description: "A specialist in adult medicine who manages complex and chronic illnesses like hypertension, diabetes, and heart disease." },
  { photo: "gyna.jpg", title: "Gynaecologist", description: "Focuses on women's reproductive health, including pregnancy, menstrual issues, hormonal disorders, and gynecological surgeries." },
  { photo: "optha.jpg", title: "Ophthalmologists", description: "An eye specialist who treats vision problems, cataracts, glaucoma, and other eye-related conditions, often performing surgeries." },
  { photo: "anesth.jpg", title: "Anesthesiologist", description: "Responsible for administering anesthesia and managing pain during and after surgeries or medical procedures." },
  { photo: "pulmo.jpg", title: "Pulmonologist", description: "Treats lung and respiratory disorders, including asthma, chronic obstructive pulmonary disease (COPD), and lung infections." },
];

export const getCardsData = () => {
  const baseUrl = process.env.BACKEND_URL || "http://localhost:5000";
  return SPECIALIZATIONS.map((item, index) => ({
    id: index + 1,
    photoUrl: `${baseUrl}/photos/${item.photo}`,
    title: item.title,
    description: item.description,
  }));
};
