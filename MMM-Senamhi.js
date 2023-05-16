Module.register("MMM-Senamhi", {
    defaults: {
        locationId: "0019"
    },
    // place to save the list of nodes sent back from helper
    nodeList: {},
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
        if (notification == 'node_date') {
            Log.log("received content back from helper")
            // save it
            this.content = payload;
            Log.log("there are " + this.content.length + " elements to display");
            if (this.content.length == 0) {
                this.message = "MMM-Senamhi No content found" + this.config.location;
            }
            // tell MM we have new stuff to display
            // will cause getDom() to be called
            this.updateDom(1)
        }
    },
    getDom: function() {
        // base wrapper for our content
        wrapper = document.createElement("div");
        if(this.content.length > 0 ) {
            // loop the list of nodes (if any)
            for (const [key, value] of Object.entries(this.content)) {
                // create a hold for the text of this node
                let w = document.createElement("div");
                // get the node fron the returned object
                let n = value['date'];
                w.innerHTML = n;
                // append this info to the base wrapper
                wrapper.appendChild(w);
            }
        }
        else {
            wrapper.innerHTML = this.message;
        }
        // tell MM this our content to add to the MM dom
        return wrapper;


    }
});