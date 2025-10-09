const fs = require('fs');
const path = require('path');

const services = [
  {
    filename: 'endoscopy.html',
    pageTitle: 'Endoscopy Services',
    pageDescription: 'Advanced diagnostic and therapeutic endoscopy services for gastrointestinal and liver conditions.',
    section1Title: 'State-of-the-Art Endoscopy Unit',
    section1Image: '../assets/images/banners/8.jpg',
    section1Video: 'https://www.youtube.com/watch?v=video_id',
    section1Paragraph1: 'Our endoscopy unit at the South Asian Liver Institute is equipped with the latest high-definition endoscopes and imaging technology. This allows for precise and detailed examination of the gastrointestinal tract, aiding in the accurate diagnosis of various conditions affecting the esophagus, stomach, intestines, and bile ducts.',
    section1Paragraph2: 'We offer a wide range of therapeutic procedures, including removal of polyps, treatment for bleeding, and placement of stents. Our minimally invasive techniques ensure patient comfort, safety, and a quicker recovery time.',
  },
  {
    filename: 'fatty-liver.html',
    pageTitle: 'Fatty Liver Disease Management',
    pageDescription: 'Comprehensive care and management for patients with fatty liver disease, including NAFLD and NASH.',
    section1Title: 'A Multidisciplinary Approach to Fatty Liver',
    section1Image: '../assets/images/banners/9.jpg',
    section1Video: 'https://www.youtube.com/watch?v=video_id',
    section1Paragraph1: 'Fatty liver disease is a growing concern worldwide. At SALi, we provide a holistic approach to managing this condition, focusing on lifestyle modification, medical management, and patient education to prevent progression to more serious liver damage like cirrhosis and liver cancer.',
    section1Paragraph2: 'Our team of hepatologists, dietitians, and lifestyle coaches works together to create a personalized treatment plan for each patient. This includes dietary counseling, exercise recommendations, and management of associated conditions like diabetes and obesity.',
  },
  {
    filename: 'gallbladder-cancer.html',
    pageTitle: 'Gallbladder Cancer Treatment',
    pageDescription: 'Specialized and comprehensive care for patients diagnosed with gallbladder cancer.',
    section1Title: 'Advanced Surgical and Medical Oncology for Gallbladder Cancer',
    section1Image: '../assets/images/banners/10.jpg',
    section1Video: 'https://www.youtube.com/watch?v=video_id',
    section1Paragraph1: 'Gallbladder cancer is an aggressive disease that requires expert care. Our team at SALi consists of experienced surgical oncologists, medical oncologists, and radiation oncologists who specialize in treating gallbladder cancer. We provide a comprehensive treatment plan tailored to the stage and type of cancer.',
    section1Paragraph2: 'Treatment options may include surgery (cholecystectomy), chemotherapy, and radiation therapy. We utilize the latest surgical techniques, including minimally invasive surgery, to improve outcomes and reduce recovery time. Our focus is on providing compassionate and evidence-based care.',
  },
  {
    filename: 'icu-facility.html',
    pageTitle: 'Critical Care ICU Facility',
    pageDescription: 'State-of-the-art Intensive Care Unit for critically ill patients requiring advanced monitoring and support.',
    section1Title: 'Advanced Critical Care for Liver Patients',
    section1Image: '../assets/images/banners/11.jpg',
    section1Video: 'https://www.youtube.com/watch?v=video_id',
    section1Paragraph1: 'Our Intensive Care Unit (ICU) is specifically designed to care for critically ill patients, especially those with severe liver disease or recovering from major liver surgery like transplantation. It is staffed 24/7 by a team of critical care specialists, nurses, and respiratory therapists.',
    section1Paragraph2: 'The ICU is equipped with advanced monitoring systems, mechanical ventilators, and life-support equipment to provide the highest level of care. We are committed to ensuring the safety, comfort, and best possible outcomes for our most vulnerable patients.',
  },
  {
    filename: 'in-patient-facility.html',
    pageTitle: 'Comfortable In-Patient Care',
    pageDescription: 'Modern and comfortable in-patient facilities designed for healing and recovery.',
    section1Title: 'A Healing Environment for Your Recovery',
    section1Image: '../assets/images/banners/12.jpg',
    section1Video: 'https://www.youtube.com/watch?v=video_id',
    section1Paragraph1: 'Our in-patient rooms are designed to provide a comfortable and peaceful environment for patients to recover. Each room is equipped with modern amenities to ensure a pleasant stay.',
    section1Paragraph2: 'Our dedicated nursing staff provides round-the-clock care and support, ensuring all your medical and personal needs are met. We strive to make your hospital stay as comfortable and stress-free as possible.',
  },
  {
    filename: 'interventional-treatments.html',
    pageTitle: 'Interventional Radiology Treatments',
    pageDescription: 'Minimally invasive, image-guided procedures for diagnosing and treating liver diseases.',
    section1Title: 'Cutting-Edge Interventional Radiology',
    section1Image: '../assets/images/banners/13.jpg',
    section1Video: 'https://www.youtube.com/watch?v=video_id',
    section1Paragraph1: 'Interventional Radiology (IR) offers minimally invasive alternatives to traditional surgery. At SALi, our skilled interventional radiologists use advanced imaging techniques like ultrasound, CT, and fluoroscopy to perform a variety of procedures for liver diseases.',
    section1Paragraph2: 'These procedures include transarterial chemoembolization (TACE) for liver cancer, TIPS for portal hypertension, and percutaneous biopsies. IR treatments often involve smaller incisions, less pain, and faster recovery times compared to open surgery.',
  },
  {
    filename: 'laparoscopic-surgery.html',
    pageTitle: 'Minimally Invasive Laparoscopic Surgery',
    pageDescription: 'Advanced laparoscopic (keyhole) surgery for liver, gallbladder, and pancreatic conditions.',
    section1Title: 'Expertise in Advanced Laparoscopic Procedures',
    section1Image: '../assets/images/banners/14.jpg',
    section1Video: 'https://www.youtube.com/watch?v=video_id',
    section1Paragraph1: 'Our surgical team at SALi is highly skilled in performing complex laparoscopic surgeries. This minimally invasive approach uses small incisions and a camera to perform procedures, leading to less pain, reduced scarring, and a quicker return to normal activities.',
    section1Paragraph2: 'We perform a wide range of laparoscopic procedures, including cholecystectomy (gallbladder removal), liver resections, and pancreatic surgery. Our commitment to using the latest surgical technology ensures the best outcomes for our patients.',
  },
  {
    filename: 'liver-cancer.html',
    pageTitle: 'Liver Cancer (Hepatocellular Carcinoma) Treatment',
    pageDescription: 'Comprehensive and multidisciplinary care for patients with primary liver cancer.',
    section1Title: 'A Team Approach to Treating Liver Cancer',
    section1Image: '../assets/images/banners/15.jpg',
    section1Video: 'https://www.youtube.com/watch?v=video_id',
    section1Paragraph1: 'Treating liver cancer requires a coordinated effort from a team of specialists. At SALi, our liver cancer program includes hepatologists, surgical oncologists, interventional radiologists, and medical oncologists who work together to create a personalized treatment plan.',
    section1Paragraph2: 'Treatment options depend on the stage of the cancer and include liver resection, liver transplantation, ablation, chemoembolization (TACE), and targeted drug therapy. We are at the forefront of liver cancer treatment and research.',
  },
  {
    filename: 'liver-cirrhosis.html',
    pageTitle: 'Management of Liver Cirrhosis',
    pageDescription: 'Specialized care for patients with liver cirrhosis to manage symptoms and prevent complications.',
    section1Title: 'Improving Quality of Life with Cirrhosis',
    section1Image: '../assets/images/banners/16.jpg',
    section1Video: 'https://www.youtube.com/watch?v=video_id',
    section1Paragraph1: 'Liver cirrhosis is a serious condition that requires long-term management. Our team at SALi focuses on slowing the progression of the disease, managing complications like ascites and hepatic encephalopathy, and improving the patient\'s quality of life.',
    section1Paragraph2: 'We provide comprehensive care that includes medical management, nutritional counseling, and lifestyle advice. For patients with end-stage cirrhosis, we offer evaluation for liver transplantation.',
  },
  {
    filename: 'liver-transplantation.html',
    pageTitle: 'Liver Transplantation Program',
    pageDescription: 'A world-class liver transplant program offering both living donor and deceased donor transplantation.',
    section1Title: 'A Second Chance at Life',
    section1Image: '../assets/images/banners/17.jpg',
    section1Video: 'https://www.youtube.com/watch?v=video_id',
    section1Paragraph1: 'The South Asian Liver Institute is a premier center for liver transplantation. Our experienced transplant team has performed hundreds of successful liver transplants, providing a new lease on life for patients with end-stage liver disease.',
    section1Paragraph2: 'We offer a comprehensive transplant program that includes pre-transplant evaluation, state-of-the-art surgical procedures, and lifelong post-transplant care. Our living donor liver transplant program is one of the most active in the region.',
  },
  {
    filename: 'nutrition.html',
    pageTitle: 'Nutritional Support for Liver Health',
    pageDescription: 'Expert dietary and nutritional counseling for patients with liver disease.',
    section1Title: 'The Role of Nutrition in Liver Disease',
    section1Image: '../assets/images/banners/18.jpg',
    section1Video: 'https://www.youtube.com/watch?v=video_id',
    section1Paragraph1: 'Nutrition plays a crucial role in managing liver disease. Our registered dietitians specialize in liver health and work closely with patients to develop personalized nutrition plans that support liver function and overall health.',
    section1Paragraph2: 'We provide guidance on appropriate diets for various conditions, such as fatty liver disease, cirrhosis, and post-liver transplant recovery. Our goal is to empower patients to make healthy food choices that can significantly impact their condition.',
  },
  {
    filename: 'pancreas-cancer.html',
    pageTitle: 'Pancreatic Cancer Treatment',
    pageDescription: 'Comprehensive care for pancreatic cancer, from diagnosis to advanced treatment.',
    section1Title: 'Multidisciplinary Care for Pancreatic Cancer',
    section1Image: '../assets/images/banners/19.jpg',
    section1Video: 'https://www.youtube.com/watch?v=video_id',
    section1Paragraph1: 'Pancreatic cancer is a complex disease that requires a specialized, multidisciplinary approach. Our team at SALi includes surgical oncologists, medical oncologists, and gastroenterologists who are experts in treating pancreatic cancer.',
    section1Paragraph2: 'Treatment options may include surgery (like the Whipple procedure), chemotherapy, and radiation therapy. We are committed to providing the most advanced and effective treatments while offering compassionate support to patients and their families.',
  },
  {
    filename: 'physiotherapy.html',
    pageTitle: 'Physiotherapy and Rehabilitation',
    pageDescription: 'Specialized physiotherapy services to aid recovery and improve physical function.',
    section1Title: 'Restoring Strength and Mobility',
    section1Image: '../assets/images/banners/20.jpg',
    section1Video: 'https://www.youtube.com/watch?v=video_id',
    section1Paragraph1: 'Physiotherapy is a vital part of recovery, especially for patients who have undergone major surgery or have been debilitated by chronic illness. Our physiotherapists design individualized rehabilitation programs to help patients regain strength, mobility, and independence.',
    section1Paragraph2: 'We provide both in-patient and out-patient physiotherapy services, focusing on exercises and therapies that are tailored to each patient\'s specific needs and goals. Our aim is to help you get back to your daily activities as quickly and safely as possible.',
  }
];

const layoutFilePath = path.join(__dirname, '..', 'src', 'components', 'service-page-layout.html');
const outputDir = path.join(__dirname, '..', 'public', 'services');

fs.readFile(layoutFilePath, 'utf8', (err, layout) => {
  if (err) {
    console.error('Error reading layout file:', err);
    return;
  }

  services.forEach(service => {
    let output = layout;
    for (const key in service) {
      const placeholder = `{{${key.toUpperCase()}}}`;
      output = output.replace(new RegExp(placeholder, 'g'), service[key]);
    }

    const outputFilePath = path.join(outputDir, service.filename);
    fs.writeFile(outputFilePath, output, 'utf8', err => {
      if (err) {
        console.error(`Error writing file ${service.filename}:`, err);
      } else {
        console.log(`Successfully created ${service.filename}`);
      }
    });
  });
});
