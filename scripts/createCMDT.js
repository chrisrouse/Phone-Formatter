// scripts/createCMDT.js
const fs = require('fs');
const path = require('path');

const countries = [
    // Priority Countries
    { label: 'United States', dialCode: '+1', isoCode: 'US', displayOrder: '10.0' },
    { label: 'Canada', dialCode: '+1', isoCode: 'CA', displayOrder: '20.0' },
    
    // Africa
    { label: 'Algeria', dialCode: '+213', isoCode: 'DZ' },
    { label: 'Angola', dialCode: '+244', isoCode: 'AO' },
    { label: 'Benin', dialCode: '+229', isoCode: 'BJ' },
    { label: 'Botswana', dialCode: '+267', isoCode: 'BW' },
    { label: 'Burkina Faso', dialCode: '+226', isoCode: 'BF' },
    { label: 'Burundi', dialCode: '+257', isoCode: 'BI' },
    { label: 'Cameroon', dialCode: '+237', isoCode: 'CM' },
    { label: 'Cape Verde', dialCode: '+238', isoCode: 'CV' },
    { label: 'Central African Republic', dialCode: '+236', isoCode: 'CF' },
    { label: 'Chad', dialCode: '+235', isoCode: 'TD' },
    { label: 'Comoros', dialCode: '+269', isoCode: 'KM' },
    { label: 'Congo', dialCode: '+242', isoCode: 'CG' },
    { label: 'Djibouti', dialCode: '+253', isoCode: 'DJ' },
    { label: 'Egypt', dialCode: '+20', isoCode: 'EG' },
    { label: 'Equatorial Guinea', dialCode: '+240', isoCode: 'GQ' },
    { label: 'Eritrea', dialCode: '+291', isoCode: 'ER' },
    { label: 'Ethiopia', dialCode: '+251', isoCode: 'ET' },
    { label: 'Gabon', dialCode: '+241', isoCode: 'GA' },
    { label: 'Gambia', dialCode: '+220', isoCode: 'GM' },
    { label: 'Ghana', dialCode: '+233', isoCode: 'GH' },
    { label: 'Guinea', dialCode: '+224', isoCode: 'GN' },
    { label: 'Guinea-Bissau', dialCode: '+245', isoCode: 'GW' },
    { label: 'Ivory Coast', dialCode: '+225', isoCode: 'CI' },
    { label: 'Kenya', dialCode: '+254', isoCode: 'KE' },
    { label: 'Lesotho', dialCode: '+266', isoCode: 'LS' },
    { label: 'Liberia', dialCode: '+231', isoCode: 'LR' },
    { label: 'Libya', dialCode: '+218', isoCode: 'LY' },
    { label: 'Madagascar', dialCode: '+261', isoCode: 'MG' },
    { label: 'Malawi', dialCode: '+265', isoCode: 'MW' },
    { label: 'Mali', dialCode: '+223', isoCode: 'ML' },
    { label: 'Mauritania', dialCode: '+222', isoCode: 'MR' },
    { label: 'Mauritius', dialCode: '+230', isoCode: 'MU' },
    { label: 'Morocco', dialCode: '+212', isoCode: 'MA' },
    { label: 'Mozambique', dialCode: '+258', isoCode: 'MZ' },
    { label: 'Namibia', dialCode: '+264', isoCode: 'NA' },
    { label: 'Niger', dialCode: '+227', isoCode: 'NE' },
    { label: 'Nigeria', dialCode: '+234', isoCode: 'NG' },
    { label: 'Rwanda', dialCode: '+250', isoCode: 'RW' },
    { label: 'Sao Tome and Principe', dialCode: '+239', isoCode: 'ST' },
    { label: 'Senegal', dialCode: '+221', isoCode: 'SN' },
    { label: 'Seychelles', dialCode: '+248', isoCode: 'SC' },
    { label: 'Sierra Leone', dialCode: '+232', isoCode: 'SL' },
    { label: 'Somalia', dialCode: '+252', isoCode: 'SO' },
    { label: 'South Africa', dialCode: '+27', isoCode: 'ZA' },
    { label: 'South Sudan', dialCode: '+211', isoCode: 'SS' },
    { label: 'Sudan', dialCode: '+249', isoCode: 'SD' },
    { label: 'Swaziland', dialCode: '+268', isoCode: 'SZ' },
    { label: 'Tanzania', dialCode: '+255', isoCode: 'TZ' },
    { label: 'Togo', dialCode: '+228', isoCode: 'TG' },
    { label: 'Tunisia', dialCode: '+216', isoCode: 'TN' },
    { label: 'Uganda', dialCode: '+256', isoCode: 'UG' },
    { label: 'Zambia', dialCode: '+260', isoCode: 'ZM' },
    { label: 'Zimbabwe', dialCode: '+263', isoCode: 'ZW' },

    // Asia & Pacific
    { label: 'Australia', dialCode: '+61', isoCode: 'AU' },
    { label: 'Bangladesh', dialCode: '+880', isoCode: 'BD' },
    { label: 'Bhutan', dialCode: '+975', isoCode: 'BT' },
    { label: 'Brunei', dialCode: '+673', isoCode: 'BN' },
    { label: 'Cambodia', dialCode: '+855', isoCode: 'KH' },
    { label: 'China', dialCode: '+86', isoCode: 'CN' },
    { label: 'Fiji', dialCode: '+679', isoCode: 'FJ' },
    { label: 'Hong Kong', dialCode: '+852', isoCode: 'HK' },
    { label: 'India', dialCode: '+91', isoCode: 'IN' },
    { label: 'Indonesia', dialCode: '+62', isoCode: 'ID' },
    { label: 'Japan', dialCode: '+81', isoCode: 'JP' },
    { label: 'Kazakhstan', dialCode: '+7', isoCode: 'KZ' },
    { label: 'Kyrgyzstan', dialCode: '+996', isoCode: 'KG' },
    { label: 'Laos', dialCode: '+856', isoCode: 'LA' },
    { label: 'Macau', dialCode: '+853', isoCode: 'MO' },
    { label: 'Malaysia', dialCode: '+60', isoCode: 'MY' },
    { label: 'Maldives', dialCode: '+960', isoCode: 'MV' },
    { label: 'Mongolia', dialCode: '+976', isoCode: 'MN' },
    { label: 'Nepal', dialCode: '+977', isoCode: 'NP' },
    { label: 'New Zealand', dialCode: '+64', isoCode: 'NZ' },
    { label: 'Pakistan', dialCode: '+92', isoCode: 'PK' },
    { label: 'Papua New Guinea', dialCode: '+675', isoCode: 'PG' },
    { label: 'Philippines', dialCode: '+63', isoCode: 'PH' },
    { label: 'Singapore', dialCode: '+65', isoCode: 'SG' },
    { label: 'South Korea', dialCode: '+82', isoCode: 'KR' },
    { label: 'Sri Lanka', dialCode: '+94', isoCode: 'LK' },
    { label: 'Taiwan', dialCode: '+886', isoCode: 'TW' },
    { label: 'Tajikistan', dialCode: '+992', isoCode: 'TJ' },
    { label: 'Thailand', dialCode: '+66', isoCode: 'TH' },
    { label: 'Timor-Leste', dialCode: '+670', isoCode: 'TL' },
    { label: 'Turkmenistan', dialCode: '+993', isoCode: 'TM' },
    { label: 'Uzbekistan', dialCode: '+998', isoCode: 'UZ' },
    { label: 'Vietnam', dialCode: '+84', isoCode: 'VN' },

    // Europe (already in your list, but including for completeness)
    { label: 'Albania', dialCode: '+355', isoCode: 'AL' },
    { label: 'Andorra', dialCode: '+376', isoCode: 'AD' },
    { label: 'Austria', dialCode: '+43', isoCode: 'AT' },
    { label: 'Belgium', dialCode: '+32', isoCode: 'BE' },
    { label: 'Bosnia and Herzegovina', dialCode: '+387', isoCode: 'BA' },
    { label: 'Bulgaria', dialCode: '+359', isoCode: 'BG' },
    { label: 'Croatia', dialCode: '+385', isoCode: 'HR' },
    { label: 'Czech Republic', dialCode: '+420', isoCode: 'CZ' },
    { label: 'Denmark', dialCode: '+45', isoCode: 'DK' },
    { label: 'Estonia', dialCode: '+372', isoCode: 'EE' },
    { label: 'Finland', dialCode: '+358', isoCode: 'FI' },
    { label: 'France', dialCode: '+33', isoCode: 'FR' },
    { label: 'Germany', dialCode: '+49', isoCode: 'DE' },
    { label: 'Greece', dialCode: '+30', isoCode: 'GR' },
    { label: 'Hungary', dialCode: '+36', isoCode: 'HU' },
    { label: 'Iceland', dialCode: '+354', isoCode: 'IS' },
    { label: 'Ireland', dialCode: '+353', isoCode: 'IE' },
    { label: 'Italy', dialCode: '+39', isoCode: 'IT' },
    { label: 'Latvia', dialCode: '+371', isoCode: 'LV' },
    { label: 'Liechtenstein', dialCode: '+423', isoCode: 'LI' },
    { label: 'Lithuania', dialCode: '+370', isoCode: 'LT' },
    { label: 'Luxembourg', dialCode: '+352', isoCode: 'LU' },
    { label: 'Malta', dialCode: '+356', isoCode: 'MT' },
    { label: 'Moldova', dialCode: '+373', isoCode: 'MD' },
    { label: 'Monaco', dialCode: '+377', isoCode: 'MC' },
    { label: 'Montenegro', dialCode: '+382', isoCode: 'ME' },
    { label: 'Netherlands', dialCode: '+31', isoCode: 'NL' },
    { label: 'Norway', dialCode: '+47', isoCode: 'NO' },
    { label: 'Poland', dialCode: '+48', isoCode: 'PL' },
    { label: 'Portugal', dialCode: '+351', isoCode: 'PT' },
    { label: 'Romania', dialCode: '+40', isoCode: 'RO' },
    { label: 'San Marino', dialCode: '+378', isoCode: 'SM' },
    { label: 'Serbia', dialCode: '+381', isoCode: 'RS' },
    { label: 'Slovakia', dialCode: '+421', isoCode: 'SK' },
    { label: 'Slovenia', dialCode: '+386', isoCode: 'SI' },
    { label: 'Spain', dialCode: '+34', isoCode: 'ES' },
    { label: 'Sweden', dialCode: '+46', isoCode: 'SE' },
    { label: 'Switzerland', dialCode: '+41', isoCode: 'CH' },
    { label: 'United Kingdom', dialCode: '+44', isoCode: 'GB' },
    { label: 'Vatican City', dialCode: '+379', isoCode: 'VA' },

    // Americas (already included some, adding rest)
    { label: 'Antigua and Barbuda', dialCode: '+1268', isoCode: 'AG' },
    { label: 'Argentina', dialCode: '+54', isoCode: 'AR' },
    { label: 'Bahamas', dialCode: '+1242', isoCode: 'BS' },
    { label: 'Barbados', dialCode: '+1246', isoCode: 'BB' },
    { label: 'Belize', dialCode: '+501', isoCode: 'BZ' },
    { label: 'Bolivia', dialCode: '+591', isoCode: 'BO' },
    { label: 'Brazil', dialCode: '+55', isoCode: 'BR' },
    { label: 'Chile', dialCode: '+56', isoCode: 'CL' },
    { label: 'Colombia', dialCode: '+57', isoCode: 'CO' },
    { label: 'Costa Rica', dialCode: '+506', isoCode: 'CR' },
    { label: 'Dominica', dialCode: '+1767', isoCode: 'DM' },
    { label: 'Dominican Republic', dialCode: '+1809', isoCode: 'DO' },
    { label: 'Ecuador', dialCode: '+593', isoCode: 'EC' },
    { label: 'El Salvador', dialCode: '+503', isoCode: 'SV' },
    { label: 'Grenada', dialCode: '+1473', isoCode: 'GD' },
    { label: 'Guatemala', dialCode: '+502', isoCode: 'GT' },
    { label: 'Guyana', dialCode: '+592', isoCode: 'GY' },
    { label: 'Haiti', dialCode: '+509', isoCode: 'HT' },
    { label: 'Honduras', dialCode: '+504', isoCode: 'HN' },
    { label: 'Jamaica', dialCode: '+1876', isoCode: 'JM' },
    { label: 'Mexico', dialCode: '+52', isoCode: 'MX' },
    { label: 'Nicaragua', dialCode: '+505', isoCode: 'NI' },
    { label: 'Panama', dialCode: '+507', isoCode: 'PA' },
    { label: 'Panama', dialCode: '+507', isoCode: 'PA' },
    { label: 'Paraguay', dialCode: '+595', isoCode: 'PY' },
    { label: 'Peru', dialCode: '+51', isoCode: 'PE' },
    { label: 'Saint Kitts and Nevis', dialCode: '+1869', isoCode: 'KN' },
    { label: 'Saint Lucia', dialCode: '+1758', isoCode: 'LC' },
    { label: 'Saint Vincent and the Grenadines', dialCode: '+1784', isoCode: 'VC' },
    { label: 'Suriname', dialCode: '+597', isoCode: 'SR' },
    { label: 'Trinidad and Tobago', dialCode: '+1868', isoCode: 'TT' },
    { label: 'Uruguay', dialCode: '+598', isoCode: 'UY' },

    // Middle East
    { label: 'Bahrain', dialCode: '+973', isoCode: 'BH' },
    { label: 'Iraq', dialCode: '+964', isoCode: 'IQ' },
    { label: 'Israel', dialCode: '+972', isoCode: 'IL' },
    { label: 'Jordan', dialCode: '+962', isoCode: 'JO' },
    { label: 'Kuwait', dialCode: '+965', isoCode: 'KW' },
    { label: 'Lebanon', dialCode: '+961', isoCode: 'LB' },
    { label: 'Oman', dialCode: '+968', isoCode: 'OM' },
    { label: 'Qatar', dialCode: '+974', isoCode: 'QA' },
    { label: 'Saudi Arabia', dialCode: '+966', isoCode: 'SA' },
    { label: 'Turkey', dialCode: '+90', isoCode: 'TR' },
    { label: 'United Arab Emirates', dialCode: '+971', isoCode: 'AE' },
    { label: 'Yemen', dialCode: '+967', isoCode: 'YE' },

    // Caribbean & Atlantic Territories
    { label: 'Bermuda', dialCode: '+1441', isoCode: 'BM' },
    { label: 'Cayman Islands', dialCode: '+1345', isoCode: 'KY' },
    { label: 'Falkland Islands', dialCode: '+500', isoCode: 'FK' },
    { label: 'Faroe Islands', dialCode: '+298', isoCode: 'FO' },
    { label: 'Gibraltar', dialCode: '+350', isoCode: 'GI' },
    { label: 'Greenland', dialCode: '+299', isoCode: 'GL' },
    { label: 'Guadeloupe', dialCode: '+590', isoCode: 'GP' },
    { label: 'Martinique', dialCode: '+596', isoCode: 'MQ' },
    { label: 'Montserrat', dialCode: '+1664', isoCode: 'MS' },
    { label: 'Puerto Rico', dialCode: '+1787', isoCode: 'PR' },
    { label: 'Turks and Caicos Islands', dialCode: '+1649', isoCode: 'TC' },
    { label: 'British Virgin Islands', dialCode: '+1284', isoCode: 'VG' },
    { label: 'U.S. Virgin Islands', dialCode: '+1340', isoCode: 'VI' },

    // Pacific Territories
    { label: 'American Samoa', dialCode: '+1684', isoCode: 'AS' },
    { label: 'Cook Islands', dialCode: '+682', isoCode: 'CK' },
    { label: 'French Polynesia', dialCode: '+689', isoCode: 'PF' },
    { label: 'Guam', dialCode: '+1671', isoCode: 'GU' },
    { label: 'New Caledonia', dialCode: '+687', isoCode: 'NC' },
    { label: 'Northern Mariana Islands', dialCode: '+1670', isoCode: 'MP' },
    { label: 'Palau', dialCode: '+680', isoCode: 'PW' },
    { label: 'Samoa', dialCode: '+685', isoCode: 'WS' },
    { label: 'Solomon Islands', dialCode: '+677', isoCode: 'SB' },
    { label: 'Tonga', dialCode: '+676', isoCode: 'TO' },
    { label: 'Vanuatu', dialCode: '+678', isoCode: 'VU' }
];

// Define the output directory
const outputDir = path.join(__dirname, '..', 'force-app', 'main', 'default', 'customMetadata');

// Create template for the XML content
const createXMLContent = (country) => {
    return `<?xml version="1.0" encoding="UTF-8"?>
<CustomMetadata xmlns="http://soap.sforce.com/2006/04/metadata" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <label>${country.label}</label>
    <protected>false</protected>
    <values>
        <field>Dial_Code__c</field>
        <value xsi:type="xsd:string">${country.dialCode}</value>
    </values>${country.displayOrder ? `
    <values>
        <field>Display_Order__c</field>
        <value xsi:type="xsd:double">${country.displayOrder}</value>
    </values>` : ''}
    <values>
        <field>ISO_Code__c</field>
        <value xsi:type="xsd:string">${country.isoCode}</value>
    </values>
</CustomMetadata>`;
};

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Create files for each country
countries.forEach(country => {
    const fileName = `Country_Code.${country.label.replace(/\s+/g, '_')}.md-meta.xml`;
    const filePath = path.join(outputDir, fileName);
    
    const xmlContent = createXMLContent(country);
    
    fs.writeFileSync(filePath, xmlContent);
    console.log(`Created: ${fileName}`);
});

console.log('All CMDT files have been created.');