Settings = new Meteor.Collection("settings");

Meteor.startup(function() {
	if (Settings.find().count() === 0) {
		Settings.insert({_id: "default"});
		  Setting('bpm', 120);
		  Setting('bpmeasure', 4);
		  Setting('playpause', 'playing');
	}
});

Setting = function(p, v) {
	if (!v) {
		return Settings.find({_id: 'default'}).fetch()[0][p];
	} else {
		var options = {};
		options[p] = v;
		return Settings.update('default', {$set: options});
	}
};