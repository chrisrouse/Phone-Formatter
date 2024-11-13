// phoneInput.js
import { LightningElement, api, wire } from 'lwc';
import { FlowAttributeChangeEvent } from 'lightning/flowSupport';
import getCountryCodes from '@salesforce/apex/CountryCodeController.getCountryCodes';

export default class PhoneInput extends LightningElement {
    @api label = 'Phone Number';
    @api required = false;
    @api disabled = false;
    @api extensionRequired = false;
    @api availableActions = [];
    @api enableExtension = false;
    @api defaultValue;
    
    @api 
get value() {
    return this._value;
}
set value(val) {
    this._value = val;
    if (this._initialized && this._input) {
        if (this.selectedCountry) {
            const countryCode = this.selectedCountry.dialCode.replace('+', '');
            // Remove country code and any leading spaces
            this._input.value = val ? val.replace(`${this.selectedCountry.dialCode} `, '').trim() : '';
        }
    }
}

    @api sanitizedValue;

    connectedCallback() {
        if (this.defaultValue) {
            this._value = this.defaultValue;
        }
    }

    @api
    get extension() {
        return this._extension;
    }
    set extension(val) {
        this._extension = val;
        if (this._initialized && this._extensionInput) {
            this._extensionInput.value = val || '';
        }
    }

    // Private variables
    _value = '';
    _extension = '';
    _initialized = false;
    _input;
    _extensionInput;
    _selectedCountry = 'US';
    errorMessage = '';
    showDropdown = false;
    countries = [];
    

    // Default country for initialization
    defaultCountry = {
        code: 'US',
        name: 'United States',
        dialCode: '+1',
        flag: '🇺🇸',
        orderClass: 'priority-country'
    };

    @wire(getCountryCodes)
    wiredCountries({ error, data }) {
        if (data) {
            // Split into ordered and unordered lists
            const orderedCountries = data
                .filter(country => country.Display_Order__c)
                .sort((a, b) => a.Display_Order__c - b.Display_Order__c)
                .map(country => this.mapCountryData(country));
                
            const unorderedCountries = data
                .filter(country => !country.Display_Order__c)
                .sort((a, b) => a.Country_Name__c.localeCompare(b.Country_Name__c))
                .map(country => this.mapCountryData(country));

            this.countries = [...orderedCountries, ...unorderedCountries];
        } else if (error) {
            console.error('Error loading country codes', error);
            this.errorMessage = 'Error loading country list';
            // Set default countries array with just US
            this.countries = [this.defaultCountry];
        }
    }

    mapCountryData(country) {
        return {
            code: country.ISO_Code__c,
            name: country.MasterLabel,
            dialCode: country.Dial_Code__c,
            flag: this.getCountryFlag(country.ISO_Code__c),
            orderClass: country.Display_Order__c ? 'priority-country' : 'standard-country'
        };
    }

    wiredCountries({ error, data }) {
        if (data) {
            console.log('Retrieved country data:', data); // Debug log
            const orderedCountries = data
                .filter(country => country.Display_Order__c)
                .sort((a, b) => a.Display_Order__c - b.Display_Order__c)
                .map(country => this.mapCountryData(country));
                
            const unorderedCountries = data
                .filter(country => !country.Display_Order__c)
                .sort((a, b) => a.MasterLabel.localeCompare(b.MasterLabel))
                .map(country => this.mapCountryData(country));

            this.countries = [...orderedCountries, ...unorderedCountries];
            console.log('Processed countries:', this.countries); // Debug log
        } else if (error) {
            console.error('Error loading country codes', error);
            this.errorMessage = 'Error loading country list';
        }
    }

    getCountryFlag(countryCode) {
        if (!countryCode) return '🏳️'; // Default flag if no country code
        const OFFSET = 127397;
        const codePoints = [...countryCode.toUpperCase()].map(c => c.charCodeAt(0) + OFFSET);
        return String.fromCodePoint(...codePoints);
    }

    // Update layout class based on extension enabled/disabled
    get containerClass() {
        return this.enableExtension ? 
            'slds-grid slds-gutters' : 
            'slds-grid slds-gutters slds-grid_align-spread';
    }

    get phoneColumnClass() {
        return this.enableExtension ? 
            'slds-col slds-size_2-of-3' : 
            'slds-col slds-size_1-of-1';
    }

    get selectedCountry() {
        // Return default country if countries array is empty or country not found
        return this.countries.find(country => country.code === this._selectedCountry) || 
               (this.countries.length > 0 ? this.countries[0] : this.defaultCountry);
    }

    get dropdownClass() {
        return `slds-dropdown slds-dropdown_left ${this.showDropdown ? 'slds-is-open' : 'slds-hide'}`;
    }

    renderedCallback() {
        if (!this._initialized) {
            this._input = this.template.querySelector('input.phone-input');
            this._extensionInput = this.template.querySelector('input.extension-input');
            this.initializePhoneInput();
            this._initialized = true;
        }
    }

    initializePhoneInput() {
        if (this._value) {
            const countryCode = this.selectedCountry.dialCode.replace('+', '');
            this._input.value = this._value.replace(`+${countryCode}`, '');
        }
        if (this._extension) {
            this._extensionInput.value = this._extension;
        }
    }

    @api
    validate() {
        let validity = { isValid: true, errorMessage: '' };

        // Required field validation
        if (this.required && !this._value) {
            return {
                isValid: false,
                errorMessage: 'Please enter a phone number.'
            };
        }

        if (this._value) {
            // Remove all non-digits for length checking
            const cleanNumber = this._value.replace(/\D/g, '');
            
            // E.164 standards:
            // - Maximum 15 digits total (including country code)
            // - Minimum 10 digits total (including country code)
            // Get country code length (without the + symbol)
            const countryCodeLength = this.selectedCountry.dialCode.replace('+', '').length;
            
            // Calculate the actual number length without country code
            const nationalNumberLength = cleanNumber.length - countryCodeLength;

            // Maximum length validation
            if (cleanNumber.length > 15) {
                return {
                    isValid: false,
                    errorMessage: `Phone number exceeds maximum length of 15 digits (including country code).`
                };
            }

            // Minimum length validation (most countries require at least 10 digits total)
            if (cleanNumber.length < 10) {
                return {
                    isValid: false,
                    errorMessage: `Phone number must be at least 10 digits (including country code).`
                };
            }

            // Country-specific validation
            switch(this.selectedCountry.code) {
                case 'US':
                case 'CA':
                    // North American numbers must be exactly 10 digits (not counting country code)
                    if (nationalNumberLength !== 10) {
                        return {
                            isValid: false,
                            errorMessage: 'North American numbers must be exactly 10 digits.'
                        };
                    }
                    break;
                // Add other country-specific validations if needed
            }
        }

        // Extension validation
        if (this.extensionRequired && !this._extension) {
            return {
                isValid: false,
                errorMessage: 'Please enter an extension.'
            };
        }

        return validity;
    }

    validateParentheses(value) {
        const openCount = (value.match(/\(/g) || []).length;
        const closeCount = (value.match(/\)/g) || []).length;
        
        if (openCount !== closeCount) {
            return {
                isValid: false,
                errorMessage: 'Please close all parentheses'
            };
        }
        return { isValid: true };
    }

    handleInput(event) {
        // Close country dropdown when typing starts
         this.showDropdown = false;

        // Get the current input value
        let inputValue = event.target.value;
        
        // Only restrict non-phone characters but keep all formatting
        inputValue = inputValue.replace(/[^\d\s\-\(\)\.\+]/g, '');

        // Validate parentheses
        const parenthesesValidation = this.validateParentheses(inputValue);
        if (!parenthesesValidation.isValid) {
            this.errorMessage = parenthesesValidation.errorMessage;
        } else {
            this.errorMessage = '';
        }
        
        // Get digits only for length validation (but don't use this for storage)
        const digitsOnly = inputValue.replace(/\D/g, '');
        
        // Get country code length for validation
        const countryCodeLength = this.selectedCountry.dialCode.replace('+', '').length;
        
        // Check maximum length - if exceeded, don't update
        const maxDigits = 15 - countryCodeLength;
        if (digitsOnly.length > maxDigits) {
            this.errorMessage = `Phone number cannot exceed ${maxDigits} digits (excluding country code).`;
            return;
        }

        // Update input with the formatted value exactly as typed
        this._input.value = inputValue;
        this.errorMessage = '';
        
        // Store value with formatting - add space after country code
        this._value = `${this.selectedCountry.dialCode} ${inputValue}`;


        
        // Validate in real time if we have enough digits to check
        if (digitsOnly.length >= 1) {
            const validation = this.validate();
            if (!validation.isValid) {
                this.errorMessage = validation.errorMessage;
            }
        }
        
        // Dispatch events with the formatted value
        this.dispatchEvent(new CustomEvent('change', {
            detail: {
                value: this._value
            }
        }));

            // Store sanitized value
    this.sanitizedValue = `${this.selectedCountry.dialCode}${digitsOnly}`;
    
    // Dispatch events with both formatted and sanitized values
    this.dispatchEvent(new CustomEvent('change', {
        detail: {
            value: this._value,
            sanitizedValue: this.sanitizedValue
        }
    }));

    this.dispatchEvent(new FlowAttributeChangeEvent('value', this._value));
    this.dispatchEvent(new FlowAttributeChangeEvent('sanitizedValue', this.sanitizedValue));
}

    handleExtensionInput(event) {
        // Only allow numeric input for extension
        const cleanValue = event.target.value.replace(/\D/g, '');
        event.target.value = cleanValue;
        
        this._extension = cleanValue;
        
        this.dispatchEvent(new CustomEvent('extensionchange', {
            detail: {
                value: this._extension
            }
        }));

        this.dispatchEvent(new FlowAttributeChangeEvent('extension', this._extension));
    }

    toggleDropdown() {
        this.showDropdown = !this.showDropdown;
    }

    handleCountrySelect(event) {
    const countryCode = event.currentTarget.dataset.code;
    if (this._selectedCountry !== countryCode) {
        this._selectedCountry = countryCode;
        
        // Get the current input value without any formatting
        const cleanValue = this._input.value.replace(/\D/g, '');
        
        if (cleanValue) {
            // Add space after country code for formatted value
            this._value = `${this.selectedCountry.dialCode} ${this._input.value}`;
            this.sanitizedValue = `${this.selectedCountry.dialCode}${cleanValue}`;
            this.dispatchEvent(new FlowAttributeChangeEvent('value', this._value));
            this.dispatchEvent(new FlowAttributeChangeEvent('sanitizedValue', this.sanitizedValue));
        }
    }
    this.showDropdown = false;
}


    handleBlur() {
        setTimeout(() => {
            this.showDropdown = false;
        }, 200);
    }
}