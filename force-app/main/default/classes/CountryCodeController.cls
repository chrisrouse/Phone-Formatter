public with sharing class CountryCodeController {
    @AuraEnabled(cacheable=true)
    public static List<Country_Code__mdt> getCountryCodes() {
        return [
            SELECT 
                MasterLabel,
                DeveloperName,
                Dial_Code__c, 
                ISO_Code__c, 
                Display_Order__c 
            FROM Country_Code__mdt 
            WITH SECURITY_ENFORCED
            ORDER BY Display_Order__c NULLS LAST, MasterLabel ASC
        ];
    }
}