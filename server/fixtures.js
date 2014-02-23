Meteor.startup(function() {
	if (Settings.find().count() === 0) {
		Settings.insert({_id: "default"});
		  Setting('bpm', 120);
		  Setting('bpmeasure', 4);
		  Setting('playpause', 'playing');
	}
});