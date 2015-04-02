Template.register.events({
	'click .cta' : function() {
		Router.go('speakers.register.apply');
	},

});

SimpleSchema.debug = true;

AutoForm.hooks({
  insertSpeakerApplicationForm: {
    	onSuccess: function(operation, result, template) {
			Router.go('speakers.register.complete');
		},
	}
});


AutoForm.hooks({
  insertSpeakerNominationForm: {
    	onSuccess: function(operation, result, template) {
			Router.go('speakers.register.complete');
		},
	}
});

Handlebars.registerHelper('setSpeakerRegistrationType', function (type) {
      Session.set("speakerRegistrationType", type);
});

Handlebars.registerHelper('categoryName', function (identifier) {
	return categories.findOne({'_id' : identifier}, {'_id' : 0 , 'name' : 1}).name;
});

Template.speakers.helpers({
	'speakers': function() {
		return speakers.find({"speakerApplication": {$exists: false}});
	},
	'nominated': function() {
		return speakers.find({"speakerNomination": {$exists: true}});
	},
	'applied': function() {
		return speakers.find({"speakerApplication": {$exists: true}});
	},
});

Template.appliedSpeaker.helpers({
	'speakerdata': function() {
		// return this.speakerApplication;
		return this;
	},
});

Template.nominatedSpeaker.helpers({
	'speakerdata': function() {
		// return this.speakerNomination;
		return this;
	},
});

Template.speaker.events({
	'click .vote': function() {
		var voteCount = votes.find({"user": Meteor.userId()}).count();
		console.log(voteCount);
		if(voteCount==3) {
			FlashMessages.sendError("You may only vote for three speakers.");
		} else {
			var vote = votes.findOne({"speaker": this._id, "user": Meteor.userId()});
			if(vote) {
				Meteor.call("removeVote", vote._id);
			}
			else votes.insert({"speaker": this._id, "user": Meteor.userId()})
		}
	}
})

Template.speaker.helpers({
	'gender': function() {
		if(this.speakerApplication.gender=="male"){
			return "He";
		}
		else if(this.speakerApplication.gender=="female") {
			return "She";
		}
		else if(this.speakerApplication.gender=="other") {
			return this.speakerApplication.firstName;
		}
	},
	'voted': function() {
		var vote = votes.findOne({"speaker": this._id, "user": Meteor.userId()});
		if(vote) {
			return true;
		}
		return false
	}
});
