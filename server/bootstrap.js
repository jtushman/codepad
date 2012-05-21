Meteor.startup(function () {
  if (Pages.find().count() === 0) {
      var timestamp = (new Date()).getTime();
      Pages.insert({name: 'My first page', content: '', created_at: timestamp});
      Pages.insert({name: 'My second page', content: '', created_at: timestamp++});
  }
});
