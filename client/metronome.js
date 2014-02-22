var SoundLib = {},
currentBeat = 0;


Meteor.startup(function() {
  Setting('bpm', 120);
  Setting('bpmeasure', 4);
  Setting('playpause', 'playing');

  SoundLib.high = new buzz.sound("/sounds/high", {
    formats: ["ogg", "mp3", "wav"]
  });

  SoundLib.low = new buzz.sound("/sounds/low", {
    formats: ["ogg", "mp3", "wav"]
  });

  SoundLib.high.load();
  SoundLib.low.load();
});

var pitchPicker = function() {
  currentBeat++;
  if (currentBeat > Setting('bpmeasure')) {
    currentBeat = 1;
  }
  if (currentBeat === 1) {
    return "high";
  } else {
    return "low";
  }
};

var bpmToMs = function(bpm) {
  return 60000 / bpm;
};

Template.layout.created = function() {
  var timer;
  var loop = function() {
    if (Setting('playpause') === 'playing') {
      if (pitchPicker() === 'high') {
        SoundLib.high.play();
      } else {
        SoundLib.low.play();
      }
    }
    timer = setTimeout(loop, bpmToMs(Setting('bpm')));
  };

  timer = setTimeout(loop, bpmToMs(Setting('bpm')));

  console.log('Sound is looping');


  // Watch for changes to play/pause to reset the current beat
  this.playpauseWatch = Deps.autorun(function() {
    if (Setting('playpause') ==='playing') {
      currentBeat = 0;
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