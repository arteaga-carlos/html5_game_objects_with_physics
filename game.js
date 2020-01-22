var Projectile = {
	
	spaceship: null,
	eventListener: null,
	position: 0,
	screenWidth: 0,
	screenHeight: 0,
	velocity: -40,
	positionXoffset: 0,
	positionYoffset: 0,
	visible: false,
	
	create: function(spaceship, screenWidth, screenHeight, eventListener){
		
		var obj = Object.create(this);
		
		obj.spaceship = spaceship;
		obj.eventListener = eventListener;		
								
		obj.screenWidth = screenWidth;						
		obj.screenHeight = screenHeight;
		
		obj.positionXoffset = 165;
		obj.positionYoffset = screenHeight/2;
																											
		obj.position = vector.create(0,0);		
		obj.position.setX(spaceship.position.getX() + obj.positionXoffset);
		obj.position.setY(spaceship.position.getY() + obj.positionYoffset);
		
		obj.velocity = vector.create(0, obj.velocity);		
		
		
		return obj;
	},
	
	
	
	update: function(){
		
		var events = this.eventListener.getEvents();
		
		
		if (events.shooting==true){
			
			this.visible = true;
			
			this.position.addTo(this.velocity);	
		}
		
		
		this.resetPosition();
		
		
		// track spaceship position
		if (events.shooting==false){
			
			this.position.setX(this.spaceship.position.getX() + this.positionXoffset);
			this.position.setY(this.spaceship.position.getY() + this.positionYoffset);
		}
	},
	
	
	resetPosition: function(){			
		
		if( this.position.getY() < 0 ){
			
			this.eventListener.shooting = false;
			this.visible = false;
			
			this.position.setX(this.spaceship.position.getX() + this.positionXoffset);
			this.position.setY(this.spaceship.position.getY() + this.positionYoffset);
		}			
	}
}










var Obstacles = {
	
	position: null,
	velocity: null,
	screenWidth: 0,
	screenHeight: 0,
	thrustFactor: 0.1,
	
	create: function(screenWidth, screenHeight){
		
		var obj = Object.create(this);
																			
		this.screenWidth = screenWidth;						
		this.screenHeight = screenHeight;
																											
		obj.position = vector.create(this.setPosition().X, this.setPosition().Y);
		obj.velocity = vector.create(0, 1);
		obj.acceleration = vector.create(0, 0.001);
		obj.velocity.setAngle(Math.PI/2);
		
		
		return obj;
	},
	
	
	
	update: function(){
		
		this.position.addTo(this.velocity);
		this.velocity.addTo(this.acceleration);
		
		this.resetPosition();
	},
	
	
	resetPosition: function(){	
		
		if( this.position.getY() > this.screenHeight  ){
			
			var position = this.setPosition();
			
			this.position.setX(this.setPosition().X);
			this.position.setY(this.setPosition().Y);
		}
	},
	
	
	setPosition: function(){
											
		var position = {
			X: this.randomInt(0, this.screenWidth), 
			Y: this.randomInt( -(this.screenHeight/3), -(this.screenHeight/2) )
		}
		
		return position;
	},
	
	
	randomInt: function(min, max){
		
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}




var Spaceship = {
	
	eventListener: null,
	position: null,
	velocity: null,
	screenWidth: 0,
	thrustFactor: 0.5,
	
	create: function(x, y, speed, direction, screenWidth, eventListener){
		
		var obj = Object.create(this);
		
		obj.eventListener = eventListener;
																			
		obj.screenWidth = screenWidth;
		
		obj.position = vector.create(x, y);
		obj.velocity = vector.create(0, 0);
		obj.acceleration = vector.create(0, 0);
		
		obj.velocity.setAngle(Math.PI);
		
		
		return obj;
	},
	
	
	
	thrust: function(){
		
		this.position.addTo(this.velocity);
		this.velocity.addTo(this.acceleration);
	},
	
	
	
	update: function(){

		var events = this.eventListener.getEvents();
		
		// accelerate left
		if (events.acceleratingLeft==true){					
			
			this.acceleration.setX(-this.thrustFactor);		
		
		// accelerate right
		} else if (events.acceleratingRight==true){			
			
			this.acceleration.setX(this.thrustFactor);
		
		// decelerate
		} else if (events.acceleratingLeft==false || events.acceleratingRight==false){
			
			this.velocity.setX(0);
			this.acceleration.setX(0);
		}
		
		
		// update position
		this.thrust();	
		this.resetPosition();
	},
	
	
	
	resetPosition: function(){
		
		if(this.position.getX() < (0 - this.screenWidth/8) ){ 
			
			this.position.setX(this.screenWidth);
			
		} else if(this.position.getX() > this.screenWidth){
			
			this.position.setX(0);
		}
	}
}



var EventListener = {	

	acceleratingRight:false,
	acceleratingLeft:false,
	shooting:false,
	
	
	getEvents: function(){		
	
		var obj = Object.create(this);
		
		return obj;
	},
	
	
	keyDown: function(event){
		
		switch(event.keyCode) {		
			 
			 // Q
			  case 81:
				this.acceleratingLeft = true;
				break;
				
			  // E
			  case 69:
				this.acceleratingRight = true;
			  break;
			  
			  // Spacebar
			/*  case 32:
				this.shooting = true;
			  break;*/
		}
	},
	
	keyUp: function(event){
		
		// Spacehip controls
		switch(event.keyCode) {
			
			  // Q
			  case 81:
				this.acceleratingLeft= false;
				break;
				
			  // E
			  case 69:
				this.acceleratingRight = false;
			  break;  
			  
			  // Spacebar
			 /* case 32:
				this.shooting = false;
			  break; */
			}
		},
		
		keyPress: function(event){
			
			if (event.keyCode==32){
				
				this.shooting = true;
			}
		}
		
} // EventListener