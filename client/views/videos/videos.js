Template['videos'].helpers({
  "videos" : function() {
    return videos.find({});
  },
  "videosLoaded" : function () {
    return Session.get('videosLoaded');
  },
  "favorited" : function() {
    var videoFav = favorites.findOne({"doc":this._id});
    if(videoFav) return true;
    return false;
  }
});

Template['newvideo'].events({
  'click .add-video': function(event, template) {
    var name = $(template.find(".addible.name")).val();
    check(name, String);
    var description = $(template.find(".addible.description")).val();
    var url = $(template.find(".addible.url")).val();
    videos.insert({"name":name, "description":description, "url":url});
  }
});

Template['video'].events({
    'click .edit': function(event, template) {
      $(template.find(".edit-sheet")).toggleClass("active");
    },
    'click .favorite': function(event, template) {
      var videoFav = favorites.findOne({"doc":this._id});
      if(videoFav){
        favorites.update({"_id":videoFav._id}, {$set: {"archived":true}});
      }
      else {
        var favorite = favorites.insert({"owner": Meteor.userId(), "type": "video", "doc": this._id});
      }
    },
});

Template['editvideo'].events({
  'click .edit-sheet .close': function(event, template) {
    $(template.find(".edit-sheet")).toggleClass("active");
  },
  'click .save': function(event, template) {
    var updatedVideo = new Object();
    updatedVideo.name = $(template.find(".editable.name")).val();
    updatedVideo.description = $(template.find(".editable.description")).val();
    updatedVideo.url = $(template.find(".editable.url")).val();
    updatedVideo.speaker = $(template.find(".editable.speaker")).val();
    updatedVideo.avatar = $(template.find(".editable.avatar")).val();
    videos.update({"_id":this._id}, {$set: updatedVideo});
    $(template.find(".edit-sheet")).toggleClass("active");
  },
  'click .edit-sheet .archive': function(event, template) {
   videos.update({"_id":this._id}, {$set: {"archived": true}});
    $(template.find(".edit-sheet")).toggleClass("active");
  },
  'click .edit-sheet .close': function(event, template) {
    $(template.find(".edit-sheet")).toggleClass("active");
  },
  'click .edit-sheet .cancel': function(event, template) {
    $(template.find(".edit-sheet")).toggleClass("active");
  }
});
