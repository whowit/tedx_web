Template.talks.helpers({
  "allvideos": function() {
    return videos.find({"published": true});
  }
});

Template.talk.helpers({
  "datatest": function() {
    console.dir(this);
    return "adasd";
  }
});

Template.talks.events({
  'click .filter-category': function(event, template) {
    console.dir(event);
    event.preventDefault();
  }
});

Template.talk.events({
  'click .back': function(event, template) {
    Router.go("/talks");
  },
  'click .delete': function() {
    videos.update(this._id, {$set: {"archive":true}});
    Router.go("talks");
  },
});
