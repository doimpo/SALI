const fs = require('fs');
const path = require('path');

const locations = [
    {
        filename: 'hyderabad.html',
        pageTitle: 'SALi Hyderabad',
        pageDescription: 'South Asian Liver Institute in Hyderabad, a state-of-the-art facility dedicated to comprehensive liver care.',
        section1Title: 'Leading Liver Care in the Heart of Hyderabad',
        section1Paragraph1: 'Our Hyderabad center is the flagship of SALi, offering a full spectrum of services from diagnostics to advanced liver transplantation. We are equipped with the latest technology and staffed by a team of renowned liver specialists.',
        section1Paragraph2: 'Located in the accessible area of Banjara Hills, our facility is designed to provide a comfortable and healing environment for our patients.'
    },
    {
        filename: 'mumbai.html',
        pageTitle: 'SALi Mumbai',
        pageDescription: 'South Asian Liver Institute in Mumbai, bringing world-class liver care to the financial capital of India.',
        section1Title: 'Expert Liver Services in Mumbai',
        section1Paragraph1: 'SALi Mumbai extends our mission of providing top-tier liver care. Our clinic in Mumbai offers expert consultations, advanced diagnostics, and pre- and post-transplant care.',
        section1Paragraph2: 'We are committed to serving the diverse population of Mumbai with the same dedication and expertise as our main center in Hyderabad.'
    },
    {
        filename: 'kolkata.html',
        pageTitle: 'SALi Kolkata',
        pageDescription: 'South Asian Liver Institute in Kolkata, providing specialized liver care to Eastern India.',
        section1Title: 'Specialized Liver Care in Kolkata',
        section1Paragraph1: 'Our Kolkata center brings SALi’s expertise to Eastern India. We provide comprehensive services for a wide range of liver conditions, ensuring patients in the region have access to world-class care.',
        section1Paragraph2: 'Our team in Kolkata is dedicated to delivering personalized treatment plans and compassionate care.'
    },
    {
        filename: 'nagpur.html',
        pageTitle: 'SALi Nagpur',
        pageDescription: 'South Asian Liver Institute in Nagpur, offering expert liver disease management in Central India.',
        section1Title: 'Advanced Liver Treatment in Nagpur',
        section1Paragraph1: 'SALi’s presence in Nagpur makes specialized liver care accessible to patients in Central India. Our clinic offers a range of services, from initial diagnosis to long-term management of liver diseases.',
        section1Paragraph2: 'We are dedicated to improving liver health in the region through our expert medical care.'
    },
    {
        filename: 'visakhapatnam.html',
        pageTitle: 'SALi Visakhapatnam',
        pageDescription: 'South Asian Liver Institute in Visakhapatnam, delivering high-quality liver care to the coastal region.',
        section1Title: 'Quality Liver Care in Visakhapatnam',
        section1Paragraph1: 'Our Visakhapatnam clinic provides comprehensive liver care services, including diagnostics, treatment, and management of various liver ailments. We are committed to serving the coastal communities with excellence.',
        section1Paragraph2: 'Our expert team ensures that every patient receives the best possible care.'
    },
    {
        filename: 'rajkot.html',
        pageTitle: 'SALi Rajkot',
        pageDescription: 'South Asian Liver Institute in Rajkot, offering specialized liver care in the state of Gujarat.',
        section1Title: 'Dedicated Liver Care in Rajkot',
        section1Paragraph1: 'SALi Rajkot brings our specialized liver care services to Gujarat. Our clinic is focused on providing accurate diagnosis and effective treatment for a variety of liver conditions.',
        section1Paragraph2: 'We are committed to enhancing the health and well-being of the community in Rajkot.'
    },
    {
        filename: 'vijayawada-guntur.html',
        pageTitle: 'SALi Vijayawada-Guntur',
        pageDescription: 'South Asian Liver Institute in Vijayawada-Guntur, serving the people of Andhra Pradesh with expert liver care.',
        section1Title: 'Comprehensive Liver Services in Vijayawada-Guntur',
        section1Paragraph1: 'Our clinic in the Vijayawada-Guntur region provides accessible and high-quality liver care. We offer a range of services to address the needs of patients with liver disease.',
        section1Paragraph2: 'Our mission is to provide excellent medical care with a patient-centric approach.'
    },
    {
        filename: 'kakinada.html',
        pageTitle: 'SALi Kakinada',
        pageDescription: 'South Asian Liver Institute in Kakinada, extending our expert liver care services to the East Godavari region.',
        section1Title: 'Expert Liver Care in Kakinada',
        section1Paragraph1: 'SALi Kakinada is dedicated to providing high-quality liver care to the residents of the East Godavari district. Our clinic offers comprehensive diagnostic and treatment services.',
        section1Paragraph2: 'We are committed to making a positive impact on the health of the community.'
    },
    {
        filename: 'kurnool.html',
        pageTitle: 'SALi Kurnool',
        pageDescription: 'South Asian Liver Institute in Kurnool, providing specialized liver care in the Rayalaseema region.',
        section1Title: 'Specialized Liver Services in Kurnool',
        section1Paragraph1: 'Our Kurnool clinic offers specialized care for a wide range of liver diseases. We are dedicated to providing the best possible outcomes for our patients in the Rayalaseema region.',
        section1Paragraph2: 'Our team of experts is committed to excellence in patient care.'
    },
    {
        filename: 'rajahmundry.html',
        pageTitle: 'SALi Rajahmundry',
        pageDescription: 'South Asian Liver Institute in Rajahmundry, offering comprehensive liver care services.',
        section1Title: 'Comprehensive Liver Care in Rajahmundry',
        section1Paragraph1: 'SALi Rajahmundry is committed to providing comprehensive care for liver diseases. Our clinic is equipped with modern diagnostic facilities and staffed by experienced specialists.',
        section1Paragraph2: 'We strive to deliver the highest standard of care to our patients.'
    },
    {
        filename: 'jabalpur.html',
        pageTitle: 'SALi Jabalpur',
        pageDescription: 'South Asian Liver Institute in Jabalpur, bringing advanced liver care to Madhya Pradesh.',
        section1Title: 'Advanced Liver Care in Jabalpur',
        section1Paragraph1: 'Our Jabalpur clinic extends SALi’s expertise to Madhya Pradesh. We offer advanced diagnostic and treatment services for a wide range of liver conditions.',
        section1Paragraph2: 'Our goal is to provide accessible and affordable liver care to the people of the region.'
    },
    {
        filename: 'khammam.html',
        pageTitle: 'SALi Khammam',
        pageDescription: 'South Asian Liver Institute in Khammam, providing quality liver care services.',
        section1Title: 'Quality Liver Care in Khammam',
        section1Paragraph1: 'SALi Khammam is dedicated to providing quality liver care services to the community. Our clinic offers a range of services to meet the needs of patients with liver disease.',
        section1Paragraph2: 'We are committed to improving the health and well-being of our patients.'
    },
    {
        filename: 'anantapur.html',
        pageTitle: 'SALi Anantapur',
        pageDescription: 'South Asian Liver Institute in Anantapur, offering specialized liver care services.',
        section1Title: 'Specialized Liver Care in Anantapur',
        section1Paragraph1: 'Our Anantapur clinic provides specialized care for various liver conditions. We are committed to delivering the best possible outcomes for our patients.',
        section1Paragraph2: 'Our expert team is dedicated to providing compassionate and comprehensive care.'
    }
];

const layoutFilePath = path.join(__dirname, '..', 'src', 'components', 'location-page-layout.html');
const outputDir = path.join(__dirname, '..', 'public', 'locations');

fs.readFile(layoutFilePath, 'utf8', (err, layout) => {
    if (err) {
        console.error('Error reading layout file:', err);
        return;
    }

    locations.forEach(location => {
        let output = layout;
        for (const key in location) {
            const placeholder = `{{${key.toUpperCase()}}}`;
            output = output.replace(new RegExp(placeholder, 'g'), location[key]);
        }

        const outputFilePath = path.join(outputDir, location.filename);
        fs.writeFile(outputFilePath, output, 'utf8', err => {
            if (err) {
                console.error(`Error writing file ${location.filename}:`, err);
            } else {
                console.log(`Successfully created ${location.filename}`);
            }
        });
    });
});
