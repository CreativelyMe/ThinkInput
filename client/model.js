Meteor.subscribe("graphs");
Meteor.autorun(function () {
    Meteor.subscribe("nodes", Session.get("current_graph"));
});



