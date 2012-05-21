// Define Minimongo collections to match server/publish.js.
Pages = new Meteor.Collection('pages');

// Id of current page
Session.set('page_id', null);

// When editing a list name, ID of the list
Session.set('editing_pagename', null);

// Finds a text input in the DOM by id and focuses it.
var focus_field_by_id = function (id) {
  var input = document.getElementById(id);
  if (input) {
    input.focus();
    input.select();
  }
};

Template.pages.pages = function () {
    return Pages.find({}, {sort: {name: 1}});
}

Template.page_list_item.editing = function () {
  return Session.equals('editing_pagename', this._id);
};

Template.page_list_item.active = function () {
    return Session.equals('page_id', this._id) ? 'active' : '';
};

Template.page_list_item.events = {
  'mousedown': function (evt) { // select list
    console.log('hola');
    Router.setPage(this._id);
  },
  'dblclick': function (evt) { // start editing list name

//    Session.set('editing_pagename', this._id);
//    Meteor.flush(); // force DOM redraw, so we can focus the edit field
//    focus_field_by_id("page-name-input");
  }
};

Template.page.page = function () {
    var page_id = Session.get('page_id');
    if (!page_id) return {};
    console.log("tyring to find page:[" + page_id +"]")
    var page = Pages.findOne(page_id);
    return page || false;
}

Template.page.any_page_selected = function () {
  return !Session.equals('page_id', null);
};

Template.page.events = {
    'click input[type="button"]': function() {
        var page_content = document.getElementById("page_content").value;
        console.log("trying to update " + this._id + "with: [" + page_content + "]");
        Pages.update(this._id, {$set: {content: page_content}});
        Meteor.flush();
    }
}

////////// Tracking selected list in URL //////////

var PagesRouter = Backbone.Router.extend({
  routes: {
    ":page_id": "main"
  },
  main: function (page_id) {
    console.log("zing");
    Session.set("page_id", page_id);
  },
  setPage: function (page_id) {
    console.log("hello");
    this.navigate(page_id, true);
  }
});

Router = new PagesRouter;

Meteor.startup(function () {
  Backbone.history.start({pushState: true});
});

Handlebars.registerHelper("debug", function(optionalValue) {
  console.log("Current Context");
  console.log("====================");
  console.log(this);

  if (optionalValue) {
    console.log("Value");
    console.log("====================");
    console.log(optionalValue);
  }
});

