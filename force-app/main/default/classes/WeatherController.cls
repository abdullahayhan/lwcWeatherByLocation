public with sharing class WeatherController {
    public static Httpresponse GetWeatherCalloutbylatlon(String lat, string lon) {
        HttpRequest req = new HttpRequest();
        string apiKey ='3cdb079cbd07da931918b24c8a79bf39';
        req.setEndpoint('https://api.openweathermap.org/data/2.5/weather?lat='+ lat +'&lon='+ lon+'&appid='+apiKey);
        req.setMethod('GET');
        Http http = new Http();
        HTTPResponse res = http.send(req);
        return res;
    }
    
    @AuraEnabled (cacheable=true)
    public static WeatherLWCwrapper CalloutonloadLWC (String lat, String lon) {
        httpresponse res = GetWeatherCalloutbylatlon (lat,lon);
            integer requeststatus =res.getStatusCode();
            WeatherLWCwrapper calloutresponse = new WeatherLWCwrapper();
        if(requeststatus<300 ){
        string sm = res.getbody();
        JSONParser parser = JSON.createParser(sm);
        while (parser.nextToken() != null) {
            if(parser.getCurrentToken() == JSONToken.FIELD_NAME) {
                parser.nextValue();
                if (parser.getCurrentName() == 'temp') {
                    calloutresponse.cityTemp = Decimal.valueOf(parser.getText());
                }
                 else if (parser.getCurrentName() == 'lat') {
                    calloutresponse.cityLat = parser.getText();
                } else if (parser.getCurrentName() == 'lon') {
                calloutresponse.cityLong = parser.getText();
                }
                else if (parser.getCurrentName() == 'Description') {
                    calloutresponse.cityMain = parser.getText();
                  } 
                else if (parser.getCurrentName() == 'humidity') {
                    calloutresponse.humidity = Decimal.valueOf(parser.getText());
                }
                else if (parser.getCurrentName() == 'sunrise') {
                    calloutresponse.sunrise = Decimal.valueOf(parser.getText());
                }
                else if (parser.getCurrentName() == 'sunset') {
                    calloutresponse.sunset = Decimal.valueOf(parser.getText());
                }
                else if (parser.getCurrentName() == 'feels_like') {
                    calloutresponse.feels_like = Decimal.valueOf(parser.getText());
                }
                else if (parser.getCurrentName() == 'speed') {
                    calloutresponse.windSpeed = Decimal.valueOf(parser.getText());
                }
            }
        }
        }
        return calloutresponse;
    }
    
    public class WeatherLWCwrapper {
        @AuraEnabled public String cityMain;
        @AuraEnabled public Decimal cityTemp;
        @AuraEnabled public Decimal sunrise;
        @AuraEnabled public Decimal sunset;
        @AuraEnabled public Decimal feels_like;
        @AuraEnabled public Decimal windSpeed;
        @AuraEnabled public Decimal humidity;
        @AuraEnabled public String cityLat;
        @AuraEnabled public String cityLong;
    }
}
