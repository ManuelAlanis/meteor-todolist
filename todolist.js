Tasks= new Mongo.Collection("tasks");

if (Meteor.isClient) {
  Template.body.helpers({
    tasks: function  () {
      return Tasks.find({},{sort:{createAt:-1}});
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
        createdAt: new Date() 
      });
 
      // Clear form
      event.target.text.value = "";
    }
  });


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
}