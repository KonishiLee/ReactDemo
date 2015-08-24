var TodoModel = Backbone.Model.extend({
  defaults: {
    title: 'have breakfast',
    done: false
  }
});

var TodoCollection = Backbone.Collection.extend({
  model: TodoModel
});

var TodoList = Backbone.View.extend({
  template: Handlebars.compile($("#todo-list-template").html()),
  className: 'col-lg-6 col-lg-offset-3',

  events: {
    'keypress #new-todo': 'createOnEnter'
  },

  initialize: function() {
    this.collection.on('add', this.addOne, this);
    this.collection.on('delete', this.delOne, this);
    this.$el.html(this.template({}));
    this.addAll();
  },

  addAll: function() {
    this.collection.each(this.addOne, this);
    return this;
  },

  addOne: function(todoModel) {
    var ItemView = new TodoItem({
      model: todoModel
    });
    this.$el.find("#todo-list").append(ItemView.render().el);
    return this;
  },

  createOnEnter: function(e) {
    if (e.keyCode != 13) return;

    if (!this.$el.find("#new-todo").val()) return;

    this.collection.add({
      title: this.$el.find("#new-todo").val(),
      done: false
    });

    this.$el.find("#new-todo").val('');
    return this;
  },

  delOne: function(model) {
    this.collection.remove(model);
  }
});

var TodoItem = Backbone.View.extend({
  template: Handlebars.compile($("#todo-item-template").html()),

  tagName: 'li',
  className: 'list-group-item',

  events: {
    'click .destroy': 'handelDestroy',
    'click .toggle': 'handelToggel'
  },

  initialize: function() {
    this.model.on('remove', this.remove, this);
    this.model.on('change', this.render, this);
  },

  handelDestroy: function() {
    this.model.trigger('delete', this.model);
    return this;
  },

  handelToggel: function(){
    this.model.set({
      done: !this.model.get('done')
    });
  },

  render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
  }
});

$(function(){
  todoArr = [
    {
      title: 'morning yoga',
      done: false
    },
    {
      title: 'have breakfast',
      done: false
    },
    {
      title: 'morning reading',
      done: false
    },
    {
      title: 'daily work',
      done: false
    }
  ],

  todos = new TodoCollection(todoArr),

  todoList = new TodoList({
    collection: todos
  });

  $(".container").html(todoList.render().el);
})
