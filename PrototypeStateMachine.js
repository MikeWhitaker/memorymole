('use strict');

var machina = require("machina");
var moleState = new machina.Fsm({
  initialize: function(options) {},
  namespace: "mole-state",
  initialState: "uninitialized",
  ActiveCountDown: 1000,
  states: {
    uninitialized: {
      "*": function() {
        this.deferUntilTransition();
        this.transition("DEACTIVATED");
      }
    },
    DEACTIVATED: {
      _onEnter: function() {
        this.timer = setTimeout(
          function() {
            this.handle("timeout");
          }.bind(this),
          1000
        );
        this.emit("moles", { status: "DEACTIVATED" });
      },
      timeout: "ACTIVE-PATTERN",
      _onExit: function() {
        clearTimeout(this.timer);
      }
    },
    "ACTIVE-PATTERN": {
      _onEnter: function() {
        this.timer = setTimeout(
          function() {
            this.handle("timeout");
          }.bind(this),
          1000
        ); //Needs to be a variable in the implementation
        this.emit("moles", { status: "ACTIVE-PATTERN" });
      },
      timeout: "WAITING-INPUT",
      _onExit: function() {
        clearTimeout(this.timer);
      }
    },
    "WAITING-INPUT": {
      _onEnter: function() {
        this.timer = setTimeout(
          function() {
            this.handle("timeout");
          }.bind(this),
          5000
        );
        this.emit("moles", { status: "WAITING-INPUT" });
      },
      timeout: "GAME-OVER",
      clickedInTime: function() {
        clearTimeout(this.timer);
        this.handle("DEACTIVATED");
      },
      _onExit: function() {
        clearTimeout(this.timer);
      }
    },
    ACTIVATED: {
      _onEnter: function() {
        this.emit("moles", { status: "ACTIVATED" }); // The triggered event needs to reduce the 'to hit' mole list
      },
      showPatternNode: "ACTIVE-PATTERN"
    },
    "GAME-OVER": {
      _onEnter: function() {
        this.emit("moles", { status: "GAME-OVER" });
      }
    }
  },
  clickActiveMole: function() {
    this.handle("ACTIVATED");
  },
  go: function() {
        this.handle( "DEACTIVATED" );
  }
});



console.log('just before initializing the event handler');
moleState.on("transition", function(data) {
  console.log(
    "we just transitioned from " + data.fromState + " to " + data.toState
  );
});

moleState.go();
