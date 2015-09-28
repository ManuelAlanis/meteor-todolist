Tasks= new Mongo.Collection("tasks");

if (Meteor.isClient) {
  Template.body.helpers({
    tasks: function  () {
      if (Session.get("hideCompleted")) {
        // If hide completed is checked, filter tasks
        return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
      } else {
        // Otherwise, return all of the tasks
        return Tasks.find({}, {sort: {createdAt: -1}});
      }
    },
    hideCompleted: function () {
      return Session.get("hideCompleted");
    },
    incompleteCount: function () {
      return Tasks.find({checked: {$ne: true}}).count();
    }
  });
  
  //agregando un evento

  Template.body.events({
    "submit .new-task": function (event) {
      // cancelar las accion por defecto del navegador
      event.preventDefault();
 
      // Obtener el objecto de formulario
      var text = event.target.text.value;
 
      // insertar en la coleccion de mongo
      Tasks.insert({
        text: text,
        createdAt: new Date(),           
        owner: Meteor.userId(),          
        username: Meteor.user().username 
      });
 
      // Clear form
      event.target.text.value = "";
    },
    "change .hide-completed input": function  (event) {
      Session.set("hideCompleted", event.target.checked);
    }
  });

  //marcar o eliminar
  Template.task.events({
    "click .toggle-checked": function () {
      Tasks.update(this._id, {
        $set: {checked: ! this.checked}
      });
    },
    "click .delete": function () {
      Tasks.remove(this._id);
    }
  });

  Accounts.ui.config({
    passwordSignupFields: ""
  });
}