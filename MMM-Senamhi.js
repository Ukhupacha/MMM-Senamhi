Module.register("MMM-Senamhi", {
    defaults: {
        locationId: "0019",
        updateInterval: 3600000 // update each hour 60 x 60 x 1000
    },

    message: "MMM-Senamhi starting up",
    notificationReceived(notification, payload){
        var self = this;
        Log.log("notification received=" + notification);
        // if all modules are running
        if(notification == 'ALL_MODULES_STARTED') {
            //send our confic down to helper use
            self.sendSocketNotification("CONFIG", self.config)
            // get the playing content
            self.message = "MMM-Senamhi waiting for content from api request"
            self.sendSocketNotification("getcontent", null)

            setInterval(function () {
                self.sendSocketNotification("getcontent", null);                
            }, self.config.updateInterval);
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

                // create image element and container
                cont = document.createElement("span");
                cont.setAttribute('class', 'icon-container');

                icon = document.createElement("img");
		        icon.setAttribute('class', 'icon');
                icon.src =  value['icon'];
                cont.appendChild(icon);

                dayForecast.appendChild(cont);

                temp = document.createElement("span");
                temp.setAttribute('class', 'temp-container');

                // create day max temp
                max = document.createElement("span");
                max.setAttribute('class', 'max');
                max.innerHTML = value['maxTemp'];
                temp.appendChild(max);
                
                separator = document.createElement("span");
                separator.setAttribute('class', 'sep');
                separator.innerHTML = '/';
                temp.appendChild(separator);
                
                min = document.createElement("span");
                min.setAttribute('class', 'min');
                min.innerHTML = value['minTemp'];
                temp.appendChild(min);

                dayForecast.appendChild(temp)

                desc = document.createElement("span");
                desc.setAttribute('class', 'desc');
                desc.innerHTML = value['desc'];

                dayForecast.appendChild(desc);
                
                // append this info to the base wrapper
                wrapper.appendChild(dayForecast);
            }
        }
        else {
            wrapper.innerHTML = this.message;
        }
        // tell MM this our content to add to the MM dom
        return wrapper;
    },

    getStyles: function () {
        return ["MMM-Senamhi.css"];
    }

});
