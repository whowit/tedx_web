var OnBeforeActions;

/* ROUTES CONTENTS

  /
  page/:page_name
  /watch
  ...

*/

OnBeforeActions = {
  adminLoginRequired:function(pause){
    if (!Roles.userIsInRole(Meteor.user(), 'admin')) {
      this.render('accessRestricted');
    } else {
       this.next();
    }
  },
  simulcastLoginRequired: function(pause) {
    if (!Meteor.user()) {
        this.render('login');
      } else {
       this.next();
      }
  }
};

Router.onBeforeAction(OnBeforeActions.adminLoginRequired, {
    only: ['users', 'sponsors.new', 'sponsors.edit', 'talks.edit']
});

Router.onBeforeAction(OnBeforeActions.simulcastLoginRequired, {
    only: ['hostDetails']
});

Router.configure({
  layoutTemplate: 'default',
  notFoundTemplate: 'notFound',
    progressSpinner : false
});

// Just for testing the loading page
Router.route('/loading', function () {
  this.render('loading');
  this.layout('default');
});

// Route to the home page
Router.route('/', {
  layout: "default",
  loadingTemplate: 'loading',
  subscriptions: function() {
    this.subscribe('videos', {"featured": true});
  },
  waitOn: function () {
    return Meteor.subscribe('videos', {"featured": true});
  },
  data: function () {
     return videos.find({"featured": true});
   },
  //  onBeforeAction: function() {
  //    if(!userIsInRole("member")) {
  //      Router.go("live");
  //    }
  //    this.next();
  //  },
  name: "home",
  action: function () {
    this.render('home');
    console.log("asdasd");
    trackPageView('Normal', 'Home');
    setHighLevelNav("Home");

  }
});

// ---------- GENERIC ROUTE UTILITIES --------------
// Generic page router for static page content
Router.route('page/:page_name', function() {
  Session.set("page", this.params.page_name);
  this.layout('default');
  this.render('pages');
});

// ---------- TALKS --------------------------------
// Home page for all talks
Router.route('/watch', {
  layout: "default",
  loadingTemplate: 'loading',
  subscriptions: function() {
    this.subscribe('videos');
  },
  waitOn: function () {
    return Meteor.subscribe('videos');
  },
  data: function () {
     return videos.find({});
   },
  name: "watch",
  action: function () {
    this.render('watchTalks');
    trackPageView('Normal', 'Watch');
    setHighLevelNav("Watch");
  }
});

// Simulcast page
Router.route('/stream', {
  layout: "default",
  loadingTemplate: 'loading',
  name: "stream",
  action: function () {
    this.render('stream');
    trackPageView('Normal', 'Watch stream');
    setHighLevelNav("Stream");
  }
});

Router.route('/live', {
  layout: "default",
  loadingTemplate: 'loading',
  subscriptions: function() {
    this.subscribe('live');
  },
  waitOn: function () {
    return Meteor.subscribe('live');
  },
  data: function () {
    return live.find({});
  },
  onBeforeAction: function() {
    GoogleMaps.load({
      v: '3',
      key: 'AIzaSyBaFCQQpLMUsqBeE0cyyccWKhTc9lzcBWM',
      libraries: 'places'
    });
    this.next();
  },
  name: "live",
  action: function () {
    this.render('live');
    trackPageView('Normal', 'Watch live');
    setHighLevelNav("Simulcast");
  }
});

// Simulcast host signup
// =============== STEP 1 ==================
Router.route('/live/host', {
  layout: "default",
  loadingTemplate: 'loading',
  name: "host",
  action: function () {
    this.render('host');
    trackPageView('Normal', 'Host Simulcast Step 1');
    setHighLevelNav("Simulcast");
  }
});

// =============== STEP 2 ==================
Router.route('/live/host/details', {
  layout: "default",
  loadingTemplate: 'loading',
  subscriptions: function() {
    this.subscribe('live');
  },
  waitOn: function () {
    return Meteor.subscribe('live');
  },
  data: function () {
    return live.find({});
  },
  // onBeforeAction: function() {
  //   if (!Meteor.userId()) {
  //     // if the user is not logged in, render the Login template
  //     Session.set("nextPage", "hostDetails");
  //     this.render("login");
  //   } else {
  //     // otherwise don't hold up the rest of hooks or our route/action function
  //     // from running
  //     this.next();
  //   }
  // },
  name: "hostDetails",
  action: function () {
    this.render('hostDetails');
    trackPageView('Normal', 'Host Simulcast Step 2');
    setHighLevelNav("Simulcast");
  }
});

// =============== STEP 3 ==================
Router.route('/live/host/location', {
  layout: "default",
  loadingTemplate: 'loading',
  subscriptions: function() {
    this.subscribe('live');
  },
  waitOn: function () {
    return Meteor.subscribe('live');
  },
  data: function () {
    console.log(Session.get("draftViewingParty"));
    if(Session.get("draftViewingParty")._id) {
      return live.findOne({"_id": Session.get("draftViewingParty")._id});
    };
  },
  onBeforeAction: function() {
    if (!Meteor.userId()) {
      // if the user is not logged in, render the Login template
      Session.set("nextPage", "hostDetails");
      this.render("login");
    }
    else {
      GoogleMaps.load({
        v: '3',
        key: 'AIzaSyBaFCQQpLMUsqBeE0cyyccWKhTc9lzcBWM',
        libraries: 'places'
      });
      this.next();
    }
  },
  name: "hostlocation",
  action: function () {
    this.render('hostLocation');
    trackPageView('Normal', 'Host Simulcast Step 3');
    setHighLevelNav("Simulcast");
  }
});

// =============== Show a hosted party ==================
Router.route('/live/host/:_id', {
  layout: "default",
  loadingTemplate: 'loading',
  subscriptions: function() {
    this.subscribe('live', this.params._id);
  },
  waitOn: function () {
    return Meteor.subscribe('live', this.params._id);
  },
  data: function () {
    return live.findOne({"_id": this.params._id});
  },
  onBeforeAction: function() {
    GoogleMaps.load({
      v: '3',
      key: 'AIzaSyBaFCQQpLMUsqBeE0cyyccWKhTc9lzcBWM',
      libraries: 'places'
    });
    this.next();
  },
  name: "hosted",
  action: function () {
    this.render('hosted');
    trackPageView('Normal', 'Hosted Simulcast');
    setHighLevelNav("Simulcast");
  }
});

Router.route('/live/host/:_id/edit', {
  layout: "default",
  loadingTemplate: 'loading',
  subscriptions: function() {
    this.subscribe('live', this.params._id);
  },
  waitOn: function () {
    return Meteor.subscribe('live', this.params._id);
  },
  data: function () {
    return live.findOne({"_id": this.params._id});
  },
  onBeforeAction: function() {
    GoogleMaps.load({
      v: '3',
      key: 'AIzaSyBaFCQQpLMUsqBeE0cyyccWKhTc9lzcBWM',
      libraries: 'places'
    });
    Session.set("draftViewingParty", live.findOne({"_id": this.params._id}));
    this.next();
  },
  name: "editHosted",
  action: function () {
    this.render('hostDetails');
    trackPageView('Normal', 'Edit hosted Simulcast Step 2');
    setHighLevelNav("Simulcast");
  }
});


// =============== Create a sponsor ==================

Router.route('/sponsors/new', {
  layout: "default",
  loadingTemplate: 'loading',
  name: "sponsors.new",
  subscriptions: function() {
    this.subscribe('sponsors');
  },
  action: function () {
    this.render('newSponsor2');
    trackPageView('Manage', 'New Sponsors');
    setHighLevelNav("Profile");
  }
});

// =============== View a sponsor ==================

Router.route('/sponsors/show/:_id', {
  layout: "default",
  loadingTemplate: 'loading',
  subscriptions: function() {
    this.subscribe('sponsors');
  },
  waitOn: function () {
    return Meteor.subscribe('sponsors', this.params._id);
  },
  data: function () {
     return sponsors.findOne({_id: this.params._id});
   },
  name: "sponsors.show",
  action: function () {
    this.render('showSponsor');
    setHighLevelNav("Profile");
  }
});

// =============== Edit a hosted party ==================

Router.route('/sponsors/edit/:_id', {
  layout: "default",
  loadingTemplate: 'loading',
  subscriptions: function() {
    this.subscribe('sponsors');
  },
  waitOn: function () {
    return Meteor.subscribe('sponsors', this.params._id);
  },
  data: function () {
     return sponsors.findOne({_id: this.params._id});
   },
  name: "sponsors.edit",
  action: function () {
    this.render('editSponsor');
    setHighLevelNav("Profile");
  }
});

// =============== View sponsors ==================

Router.route('/sponsors', {
  layout: "default",
  loadingTemplate: 'loading',
  subscriptions: function() {
    this.subscribe('sponsors');
  },
  name: "sponsors",
  action: function () {
    this.render('allSponsors');
    setHighLevelNav("Sponsors");
    trackPageView('Normal', 'Sponsors');
  }
});

// =============== TEAM =======================
// ============================================
// =============== View team ==================

Router.route('/team', {
  layout: "default",
  loadingTemplate: 'loading',
  subscriptions: function() {
    this.subscribe('team');
  },
  name: "team",
  action: function () {
    this.render('team');
    setHighLevelNav("team");
    trackPageView('Normal', 'team');
  }
});

Router.route('/team/new', {
  layout: "default",
  loadingTemplate: 'loading',
  subscriptions: function() {
    this.subscribe('team');
  },
  name: "team.new",
  action: function () {
    this.render('newMember');
    setHighLevelNav("team");
    trackPageView('Normal', 'new team member');
  }
});

Router.route('/team/edit/:_id', {
  layout: "default",
  loadingTemplate: 'loading',
  subscriptions: function() {
    this.subscribe('team');
  },
  waitOn: function () {
    return Meteor.subscribe('team', this.params._id);
  },
  data: function () {
     return team.findOne({_id: this.params._id});
   },
  name: "team.edit",
  action: function () {
    this.render('editMember');
    setHighLevelNav("Team");
  }
});

Router.route('/team/show/:_id', {
  layout: "default",
  loadingTemplate: 'loading',
  subscriptions: function() {
    this.subscribe('team');
  },
  waitOn: function () {
    return Meteor.subscribe('team', this.params._id);
  },
  data: function () {
     return team.findOne({_id: this.params._id});
   },
  name: "team.show",
  action: function () {
    this.render('teamMember');
    setHighLevelNav("Team");
  }
});

Router.route('/media', {
  layout: "default",
  loadingTemplate: 'loading',
  name: "media",
  action: function () {
    this.render('media');
    trackPageView('Manage', 'Media');
    setHighLevelNav("Media");
  }
});

Router.route('/performers', {
  layout: "default",
  loadingTemplate: 'loading',
  name: "performers",
  action: function () {
    this.render('performers');
    trackPageView('Manage', 'Performers');
    setHighLevelNav("Performers");
  }
});

Router.route('/toasted', {
  layout: "default",
  loadingTemplate: 'loading',
  name: "toasted",
  action: function () {
    this.render('toasted');
    trackPageView('Toasted', 'Toasted');
    setHighLevelNav("Toasted");
  }
});


Router.route('/contact', {
  layout: "default",
  loadingTemplate: 'loading',
  name: "contact",
  // subscriptions: function() {
  //   this.subscribe('media');
  // },
  action: function () {
    this.render('contact');
    trackPageView('Manage', 'Contact');
    setHighLevelNav('Contact');
  }
});

Router.route('/styles-samples', {
  layout: "default",
  loadingTemplate: 'loading',
  name: "styles-samples",
  // subscriptions: function() {
  //   this.subscribe('media');
  // },
  action: function () {
    this.render('styles-samples');
    trackPageView('Manage', 'Styles-samples');
    setHighLevelNav("Styles-samples");
  }
});





//ACCOUNTS
Router.route('/login', {
  // this template will be rendered until the subscriptions are ready
  layout: "default",
  loadingTemplate: 'loading',
  name: "login",
  action: function () {
    if(this.params.query.nextPage) {
      Session.set("nextPage", this.params.query.nextPage);
    }
    this.render('login');
    trackPageView('Manage', 'Log in');
    setHighLevelNav("Profile");
  }
});

Router.route('/account', {
  // this template will be rendered until the subscriptions are ready
  layout: "default",
  loadingTemplate: 'loading',
  name: "account",
  action: function () {
    this.render('manage');
    trackPageView('Manage', 'Account');
    setHighLevelNav("Profile");
  }
});

Router.route('/register', {
  // this template will be rendered until the subscriptions are ready
  layout: "default",
  loadingTemplate: 'loading',
  name: "register",
  action: function () {
    if(this.params.query.nextPage) {
      Session.set("nextPage", this.params.query.nextPage);
    }
    this.render('createUser');
    trackPageView('Manage', 'Sign up');
    setHighLevelNav("Profile");
  }
});

Router.route('/events/freedomday2015', function () {
  this.layout('singlePage');
  this.render('freedomday');
});

Router.route('/events/momentum', function () {
  this.layout('default');
  this.render('momentum');
});

//MANAGEMENT
Router.route('/manage/users', {
  layout: "default",
  loadingTemplate: 'loading',
  subscriptions: function() {
    this.subscribe('allUsers');
  },
  waitOn: function () {
    return Meteor.subscribe('allUsers');
  },
  // data: function () {
  //    return users.find({});
  //  },
  name: "users",
  action: function () {
    this.render('users');
  }

});

//ANALYTICS
Router.route('/analytics/categories', function () {
  Meteor.subscribe('videos', function onReady() {
    Session.set('videosLoaded', true);
  });
  this.layout('default');
  this.render('categoryAnalytics');
});

// Server routes
Router.route('/api/speakers', {
    name: 'speakerApi',
    where: 'server',
    action: function () {
      var json = speakers.find().fetch();
      this.response.setHeader('Content-Type', 'application/json');
      this.response.end(JSON.stringify(json));
    }
});

Router.route('/humans', function () {
  this.layout('default');
  this.render('humans');
});
