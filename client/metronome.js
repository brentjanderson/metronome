var SoundLib = {},
timer;


Meteor.startup(function() {
  // SoundLib.high = new buzz.sound("/sounds/high", {
  //   formats: ["ogg", "mp3", "wav", "aac"]
  // });

  // SoundLib.low = new buzz.sound("/sounds/low", {
  //   formats: ["ogg", "mp3", "wav", "aac"]
  // });

  // SoundLib.high.load();
  // SoundLib.low.load();

  Session.set('currentBeat', 0);
});

var pitchPicker = function() {
  Session.set('currentBeat', Session.get('currentBeat') + 1);
  if (Session.get('currentBeat') > Setting('bpmeasure')) {
    Session.set('currentBeat', 1);
  }
  if (Session.equals('currentBeat', 1)) {
    return "high";
  } else {
    return "low";
  }
};

var bpmToMs = function(bpm) {
  return 60000 / bpm;
};

Template.layout.created = function() {
  var loop = function() {
    console.log("Boop!");
    if (pitchPicker() === 'high') {
      // SoundLib.high.play();
      document.getElementById('snd_high').play();
    } else {
      // SoundLib.low.play();
      document.getElementById('snd_low').play();
    }
    timer = setTimeout(loop, bpmToMs(Setting('bpm')));
  };

  timer = setTimeout(loop, bpmToMs(Setting('bpm')));

  console.log('Sound is looping');


  // Watch for changes to play/pause to reset the current beat
  this.playpauseWatch = Deps.autorun(function() {
    console.log("Autorun");
    if (Setting('playpause') ==='playing') { // We've started playing
      Session.set('currentBeat', 0);
      clearTimeout(timer);
      Meteor.setTimeout(function(){loop();},0);
      // loop();
    } else { // We've stopped playing
      clearTimeout(timer);
    }
  });
};

Template.layout.destroyed = function() {
  this.playpauseWatch.stop();
}

Template.admin.bpmeasure = function() {
  return Setting('bpmeasure');
};

Template.admin.bpm = function() {
  return Setting('bpm');
};

Template.admin.playPauseStatus = function() {
  if (Setting("playpause") === "paused") {
    return "play";
  } else {
    return "pause";
  }
};

Template.admin.events({
  'click .bpmeasure-up': function(e, t) {
    Setting('bpmeasure', Setting('bpmeasure') + 1);
  },
  'click .bpmeasure-down': function(e,t) {
    Setting('bpmeasure', Setting('bpmeasure') - 1);
  },
  'click .bpm-up': function(e, t) {
    Setting('bpm', Setting('bpm') + 1);
  },
  'click .bpm-down': function(e ,t) {
    Setting('bpm', Setting('bpm') - 1);
  },
  'click .btn-playpause': function() {
    if (Setting('playpause') === 'playing')
      Setting('playpause', 'paused');
    else
      Setting('playpause', 'playing');
  },
  'click .bpm-label': function(e, t) {
    bootbox.prompt("Please set the beats per minute", function(d) {
      Setting('bpm', d);
    });
  },
  'click .bpmeasure-label': function(e, t) {
    bootbox.prompt("Please set the beats per measure", function(d) {
      Setting('bpmeasure', d);
    });
  }
});

Template.home.bpmeasure = function() {
  return Setting('bpmeasure');
};

Template.home.bpm = function() {
  return Setting('bpm');
};

Template.home.currentBeat = function() {
  return Session.get('currentBeat');
};

Template.home.visualToggle = function() {
  if (Session.get('currentBeat') % 2 === 0) {
    return 'pong';
  } else {
    return 'ping';
  }
}