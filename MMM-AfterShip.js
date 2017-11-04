/* Magic Mirror
 * Module: MMM-AfterShip
 *
 * By Mykle1
 *
 */
Module.register("MMM-AfterShip", {

    // Module config defaults.           // Make all changes in your config.js file
    defaults: {
 		apiKey: '',                      // Your free API Key from aftership.com
        useHeader: false,                // false if you don't want a header      
        header: "",                      // Change in config file. useHeader must be true
        maxWidth: "300px",
        animationSpeed: 3000,            // fade speed
        initialLoadDelay: 3250,
        retryDelay: 2500,
        rotateInterval: 30 * 1000,       // 30 second rotation of items
        updateInterval: 10 * 60 * 1000,  // 10 minutes

    },

    getStyles: function() {
        return ["MMM-AfterShip.css"];
    },

    start: function() {
        Log.info("Starting module: " + this.name);
        this.sendSocketNotification('CONFIG', this.config);

        requiresVersion: "2.1.0",

        //  Set locale.
        this.url = "";
        this.AfterShip = {};
        this.activeItem = 0;
        this.rotateInterval = null;
        this.scheduleUpdate();
    },

    getDom: function() {

        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

        if (!this.loaded) {
            wrapper.innerHTML = "Where's my shit?";
            wrapper.classList.add("bright", "light", "small");
            return wrapper;
        }

        if (this.config.useHeader != false) {
            var header = document.createElement("header");
            header.classList.add("xsmall", "bright", "header");
            header.innerHTML = this.config.header;
            wrapper.appendChild(header);
        }
		
		
	//	Rotating my data
		var AfterShip = this.AfterShip;
		var AfterShipKeys = Object.keys(this.AfterShip);
        if (AfterShipKeys.length > 0) {
            if (this.activeItem >= AfterShipKeys.length) {
                this.activeItem = 0;
            }
        var AfterShip = this.AfterShip[AfterShipKeys[this.activeItem]];
		
//		console.log(this.AfterShip); // for checking



        var top = document.createElement("div");
        top.classList.add("list-row");
		

		// My data begins here
		
        // ID of shipment
        var ID = document.createElement("div");
        ID.classList.add("xsmall", "bright", "ID");
        ID.innerHTML = "ID # : " + AfterShip.id;
        wrapper.appendChild(ID);
		
		
		// Last update on shipment
        var lastUpdate = document.createElement("div");
        lastUpdate.classList.add("xsmall", "bright", "lastUpdate");
		lastUpdate.innerHTML = "Last update: " + moment(AfterShip.last_updated_at).local().format("ddd, MMM DD, YYYY, h:mm a"); 
        wrapper.appendChild(lastUpdate);
		
		
		// tracking number of shipment
        var tracking_number = document.createElement("div");
        tracking_number.classList.add("xsmall", "bright", "tracking_number");
        tracking_number.innerHTML = "Tracking #: " + AfterShip.tracking_number;
        wrapper.appendChild(tracking_number);
		
		
		// Courier name
        var slug = document.createElement("div");
        slug.classList.add("xsmall", "bright", "courier");
        slug.innerHTML = "Courier: " + AfterShip.slug;
        wrapper.appendChild(slug);
		
		
		// expected_delivery date
        var expected_delivery = document.createElement("div");
        expected_delivery.classList.add("xsmall", "bright", "expected_delivery");
        expected_delivery.innerHTML = "Expected delivery on: " + moment(AfterShip.expected_delivery).local().format("ddd, MMM DD, YYYY");
        wrapper.appendChild(expected_delivery);
		
		
		// shipment_type
        var shipment_type = document.createElement("div");
        shipment_type.classList.add("xsmall", "bright", "shipment_type");
        shipment_type.innerHTML = "Shipping: " + AfterShip.shipment_type;
        wrapper.appendChild(shipment_type);
		
		
		// status oh shipment
        var tag = document.createElement("div");
        tag.classList.add("xsmall", "bright", "status");
        tag.innerHTML = "Status: " + AfterShip.tag;
        wrapper.appendChild(tag);
		
		
		// Title of shipment (if any)
        var Title = document.createElement("div");
        Title.classList.add("xsmall", "bright", "Title");
        Title.innerHTML = "Title: " + AfterShip.title;
        wrapper.appendChild(Title);
		
		
		// checkpoint location
        var location = document.createElement("div");
        location.classList.add("xsmall", "bright", "location");
        location.innerHTML = "Where: " + AfterShip.checkpoints[0].location;
        wrapper.appendChild(location);
		
		
		// checkpoint_time
        var checkpoint_time = document.createElement("div");
        checkpoint_time.classList.add("xsmall", "bright", "checkpoint_time");
        checkpoint_time.innerHTML = "When: " + moment(AfterShip.checkpoints[0].checkpoint_time).local().format("ddd, MMM DD, YYYY, h:mm a");
        wrapper.appendChild(checkpoint_time);
		
		
		// message from checkpoint
        var message = document.createElement("div");
        message.classList.add("xsmall", "bright", "message");
        message.innerHTML = "Message: " + AfterShip.checkpoints[0].message;
        wrapper.appendChild(message);
			
	}  // <-- closes rotation 
		
        return wrapper;
		
    }, // <-- closes getDom


    processAfterShip: function(data) {
        this.AfterShip = data;
	//	console.log(this.AfterShip);
        this.loaded = true;
    },

    scheduleCarousel: function() {
    //  console.log("Carousel of AfterShip fucktion!");
        this.rotateInterval = setInterval(() => {
            this.activeItem++;
            this.updateDom(this.config.animationSpeed);
        }, this.config.rotateInterval);
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getAfterShip();
        }, this.config.updateInterval);
        this.getAfterShip(this.config.initialLoadDelay);
    },

    getAfterShip: function() {
        this.sendSocketNotification('GET_AFTERSHIP', this.url);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "AFTERSHIP_RESULT") {
            this.processAfterShip(payload);
            if (this.rotateInterval == null) {
                this.scheduleCarousel();
            }
            this.updateDom(this.config.animationSpeed);
        }
        this.updateDom(this.config.initialLoadDelay);
    },
});