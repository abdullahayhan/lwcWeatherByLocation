import { LightningElement, track } from 'lwc';
import { loadStyle } from 'lightning/platformResourceLoader';
import CalloutonloadLWC from '@salesforce/apex/WeatherController.CalloutonloadLWC';
import IMAGES from "@salesforce/resourceUrl/static_image";
export default class weatherComponent extends LightningElement {
    @track lat;
    @track long;
    @track result;
    @track value;
    @track placeholder;
    @track mapMarkers = [];
    @track toggleButtonLabel = 'My Current Location';
    @track selectedMarkerValue
    zoomLevel = 12;
    connectedCallback() {
        this.currentlocation();
    }

    currentlocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                CalloutonloadLWC({ lat: position.coords.latitude, lon: position.coords.longitude }).then(data => {
                    this.mapMarkers = [{
                        location: {
                            Latitude: data['cityLat'],
                            Longitude: data['cityLong']
                        },
                        title: 'My Current Location',
                    }];
                    this.result = data;
                }).catch(err => console.log(err));

            });
        }
        loadStyle(this).then(result => {
            console.log('result :', result);
        });

    }
    handleToggleClick() {
        this.currentlocation();
        this.value = this.placeholder;
    }
    get getIcon() {
        if (this.result) {
            var time;
            var sunset = new Date(this.result.sunset * 1000).getHours();
            var sunrise = new Date(this.result.sunrise * 1000).getHours();
            var now = new Date().getHours();
            if (now <= sunset & now >= sunrise) {
                time = 'Day';
            } else if (now < sunrise || now > sunset) {
                time = 'Night';
            }
            console.log(time);
            var text = (this.result.cityMain).replace(" ", "");
            var icon = IMAGES + '/static_images/images/' + time + '/' + text + '.jpg';
            console.log(this.result.sunset);
            console.log(this.result.sunrise);
            console.log(now);
            console.log(icon);
            return icon;
        } else {
            return '--'
        }
    }

    get getMain() {
        if (this.result) {
            return (this.result.cityMain).toUpperCase();
        } else {
            return '---'
        }
    }

    get getConvertedTemp() {
        if (this.result) {
            return Math.round((this.result.cityTemp - 273)) + '°C';
        } else {
            return '--'
        }
    }

    get getFeelsLike() {
        if (this.result) {
            return Math.round((this.result.feels_like - 273)) + '°C';
        } else {
            return '--'
        }
    }

    get getWindSpeed() {
        if (this.result) {
            return this.result.windSpeed + ' km/s';
        } else {
            return '--'
        }
    }

    get getHumidity() {
        if (this.result) {
            return this.result.humidity;
        } else {
            return '--'
        }
    }

    handleMarkerSelect(event) {
        this.selectedMarkerValue = event.detail.selectedMarkerValue;
        window.console.log("selected marker values : ", this.selectedMarkerValue);
        window.console.log("selected marker values : ", event.detail.selectedMarkerValue);
    }

}