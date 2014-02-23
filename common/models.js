Settings = new Meteor.Collection("settings");
Setting = function(){};

Meteor.startup(function() {
	Setting = function(p, v) {
		if (!v) {
			var m = Settings.find({_id: 'default'}).fetch()[0];
			if (m && m[p]) {
				return m[p];
			} else {
				return;
			}
		} else {
			var options = {};
			options[p] = v;
			return Settings.update('default', {$set: options});
		}
	};
});