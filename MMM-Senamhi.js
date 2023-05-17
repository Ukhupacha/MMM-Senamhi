Module.register("MMM-Senamhi", {
    defaults: {
        locationId: "0019"
    },

    message: "MMM-Senamhi starting up",
    notificationReceived(notification, payload){
        Log.log("notification received=" + notification);
        // if all modules are running
        if(notification == 'ALL_MODULES_STARTED') {
            //send our confic down to helper use
            this.sendSocketNotification("CONFIG", this.config)
            // get the playing content
            this.message = "MMM-Senamhi waiting for content from api request"
            this.sendSocketNotification("getcontent", null)
        }
    },
    // helper sends back specific web page nodes scraped
    socketNotificationReceived: function(notification, payload){
        if (notification == 'node_data') {
            Log.log("received content back from helper")
            // save it
            this.content = payload;
            Log.log("there are " + this.content.length + " elements to display");
            if (this.content.length == 0) {
                this.message = "MMM-Senamhi No content found" + this.config.location;
            }
            // tell MM we have new stuff to display
            // will cause getDom() to be called
            this.updateDom()
        }
    },
    getDom: function() {
        // base wrapper for our content
        wrapper = document.createElement("div");
        if(this.content.length > 0 ) {
            // loop the list of nodes (if any)
            for (const [key, value] of Object.entries(this.content)) {
                
                dayForecast = document.createElement("div");
                dayForecast.setAttribute('class', "forecast-item-daily");

                // create day title element
                day = document.createElement("span");
                day.setAttribute('class', 'day-name');
                day.innerHTML  = value['date'];
                dayForecast.appendChild(day);
                
                temp = document.createElement("span");
                temp.setAttribute('class', 'temp-container');

                // create day max temp
                max = document.createElement("span");
                max.setAttribute('class', 'max');
                max.innerHTML = value['maxTemp'];
                temp.appendChild(max);
                
                separator = document.createElement("span");
                separator.setAttribute('class', 'max');
                separator.innerHTML = '/';
                temp.appendChild(separator);
                
                min = document.createElement("span");
                min.setAttribute('class', 'min');
                min.innerHTML = value['minTemp'];
                temp.appendChild(min);

                dayForecast.appendChild(temp);
                
                // append this info to the base wrapper
                wrapper.appendChild(dayForecast);
            }
        }
        else {
            wrapper.innerHTML = this.message;
        }
        // tell MM this our content to add to the MM dom
        return wrapper;


    }
});
