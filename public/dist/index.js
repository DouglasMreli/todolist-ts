"use strict";
(function () {
    // Enum para representar as plataformas de notificação
    var NotificationPlataform;
    (function (NotificationPlataform) {
        NotificationPlataform["SMS"] = "SMS";
        NotificationPlataform["EMAIL"] = "EMAIL";
        NotificationPlataform["PUSH_NOTIFICATION"] = "PUSH_NOTIFICATION";
    })(NotificationPlataform || (NotificationPlataform = {}));
    var ViewMode;
    (function (ViewMode) {
        ViewMode["TODO"] = "TODO";
        ViewMode["REMINDER"] = "REMINDER";
    })(ViewMode || (ViewMode = {}));
    // função para gerar ID aleatorio
    var UUID = function () {
        return Math.random().toString(32).substring(2, 9);
    };
    // Função para melhorar a visualização de Date
    var DateUtils = {
        // função para retornar a data atual
        today: function () {
            return new Date();
        },
        tomorrow: function () {
            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            return tomorrow;
        },
        formatDate: function (date) {
            return "".concat(date.getDate(), ".").concat(date.getMonth() + 1, ".").concat(date.getFullYear());
        }
    };
    // classe que representa um Reminder
    var Reminder = /** @class */ (function () {
        //construtor do objeto
        function Reminder(description, date, notifications) {
            this.id = UUID();
            this.dateCreated = DateUtils.today();
            this.dateUpdated = DateUtils.today();
            this.description = '';
            this.date = DateUtils.today();
            this.notifications = [NotificationPlataform.EMAIL];
            this.description = description;
            this.date = date;
            this.notifications = notifications;
        }
        Reminder.prototype.render = function () {
            return "\n            ----> Reminder <----\n            desciprtion: ".concat(this.description, "\n            date: ").concat(DateUtils.formatDate(this.date), "\n            plataform: ").concat(this.notifications.join(','), "\n            ");
        };
        return Reminder;
    }());
    // classe que representa um ToDo
    var Todo = /** @class */ (function () {
        function Todo(description) {
            this.id = UUID();
            this.dateCreated = DateUtils.today();
            this.dateUpdated = DateUtils.today();
            this.description = '';
            this.done = false;
            this.description = description;
        }
        Todo.prototype.render = function () {
            return "\n            ----> ToDo <----\n            desciprtion: ".concat(this.description, "\n            done: ").concat(this.done ? 'Yes' : 'No');
        };
        return Todo;
    }());
    var todo = new Todo('Todo criado com classe');
    var reminder = new Reminder('Reminder craido com classe', new Date(), [NotificationPlataform.EMAIL]);
    var taskView = {
        // Recebe o formulário TODO do HTML
        getTodo: function (form) {
            var todoDescription = form.todoDescription.value;
            form.reset();
            return new Todo(todoDescription);
        },
        getReminder: function (form) {
            var reminderNotifications = [
                form.notification.value
            ];
            var reminderDate = new Date(form.scheduleDate.value);
            var reminderDescription = form.reminderDescription.value;
            form.reset();
            return new Reminder(reminderDescription, reminderDate, reminderNotifications);
        },
        // recebe uma lista de tasks(TODOS e REMINDERS), limpa a lista e coloca os novos objetos
        render: function (tasks, mode) {
            // Seletor do elemento HTML que contém a task list
            var tasksList = document.getElementById('tasksList');
            //Limpando a lista
            while (tasksList === null || tasksList === void 0 ? void 0 : tasksList.firstChild) {
                tasksList.removeChild(tasksList.firstChild);
            }
            // iterando a nova lista
            tasks.forEach(function (task) {
                // criando o elemento li
                var li = document.createElement('li');
                // criando representação textual do elemento
                var textNode = document.createTextNode(task.render());
                // colocando a represetanção no elemento li
                li.appendChild(textNode);
                // colocando o elemento dentro da lista de tasks
                tasksList === null || tasksList === void 0 ? void 0 : tasksList.appendChild(li);
            });
            var todoSet = document.getElementById('todoSet');
            var reminderSet = document.getElementById('reminderSet');
            if (mode === ViewMode.TODO) {
                todoSet === null || todoSet === void 0 ? void 0 : todoSet.setAttribute('style', 'display: block');
                todoSet === null || todoSet === void 0 ? void 0 : todoSet.removeAttribute('disabled');
                reminderSet === null || reminderSet === void 0 ? void 0 : reminderSet.setAttribute('style', 'display: none');
                reminderSet === null || reminderSet === void 0 ? void 0 : reminderSet.setAttribute('disabled', 'true');
            }
            else {
                reminderSet === null || reminderSet === void 0 ? void 0 : reminderSet.setAttribute('style', 'display: block');
                reminderSet === null || reminderSet === void 0 ? void 0 : reminderSet.removeAttribute('disabled');
                todoSet === null || todoSet === void 0 ? void 0 : todoSet.setAttribute('style', 'display: none');
                todoSet === null || todoSet === void 0 ? void 0 : todoSet.setAttribute('disabled', 'true');
            }
        }
    };
    var TaskController = function (view) {
        var _a, _b;
        var tasks = [];
        var mode = ViewMode.TODO;
        var handleEvent = function (event) {
            event.preventDefault();
            var form = event.target;
            switch (mode) {
                case ViewMode.TODO:
                    tasks.push(view.getTodo(form));
                    break;
                case ViewMode.REMINDER:
                    tasks.push(view.getReminder(form));
                    break;
            }
            view.render(tasks, mode);
        };
        var handleToggleMode = function () {
            switch (mode) {
                case ViewMode.TODO:
                    mode = ViewMode.REMINDER;
                    break;
                case ViewMode.REMINDER:
                    mode = ViewMode.TODO;
                    break;
            }
            view.render(tasks, mode);
        };
        (_a = document.getElementById('toggleMode')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', handleToggleMode);
        // escutando evento submit (sempre que ocorrer um submit no formulário, rodará a arrow function)
        (_b = document
            .getElementById('taskForm')) === null || _b === void 0 ? void 0 : _b.addEventListener('submit', handleEvent);
    };
    TaskController(taskView);
})();
