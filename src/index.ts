
(() =>{

    // Enum para representar as plataformas de notificação
    enum NotificationPlataform {
         SMS = 'SMS',
         EMAIL = 'EMAIL',
         PUSH_NOTIFICATION = 'PUSH_NOTIFICATION'
    } 

    enum ViewMode {
        TODO = 'TODO',
        REMINDER = 'REMINDER'
    }

    // função para gerar ID aleatorio
    const UUID = (): string => {
        return Math.random().toString(32).substring(2, 9);
    }

    // Função para melhorar a visualização de Date
    const DateUtils = {
        // função para retornar a data atual
        today(): Date {
            return new Date();
        }, // função para retornar o data do dia seguite
        tomorrow(): Date {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            return tomorrow;
        }, // função para formatar a data
        formatDate(date: Date):string {
            return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
        }
    }

    // interface pare definir uma TASK
    interface Task {
        id: string;
        dateCreated: Date,
        dateUpdated: Date;
        description: string,
        render(): string
    }

    // classe que representa um Reminder
    class Reminder implements Task {
        id: string = UUID();
        dateCreated: Date = DateUtils.today();
        dateUpdated: Date= DateUtils.today();
        description: string = '';

        date: Date = DateUtils.today();
        notifications: Array<NotificationPlataform> = [NotificationPlataform.EMAIL];

        //construtor do objeto
        constructor(
            description: string, 
            date: Date, 
            notifications: Array<NotificationPlataform>
        ) {
            this.description = description;
            this.date = date;
            this.notifications = notifications;
        }

        render(): string {
            return `
            ----> Reminder <----
            desciprtion: ${this.description}
            date: ${DateUtils.formatDate(this.date)}
            plataform: ${this.notifications.join(',')}
            `;
        }
    }

    // classe que representa um ToDo
    class Todo implements Task {
        id: string = UUID();
        dateCreated: Date = DateUtils.today();
        dateUpdated: Date = DateUtils.today();
        description: string = '';
        
        done: boolean = false;

        constructor(description: string) {
            this.description = description;
        }

        render(): string {
            return `
            ----> ToDo <----
            desciprtion: ${this.description}
            done: ${this.done? 'Yes': 'No'}`;
        }

    }
    
    const todo = new Todo('Todo criado com classe');

    const reminder = new Reminder(
        'Reminder craido com classe', 
        new Date(), [NotificationPlataform.EMAIL]
    );

    const taskView = {
        // Recebe o formulário TODO do HTML
        getTodo(form : HTMLFormElement): Todo {
            const todoDescription = form.todoDescription.value;
            form.reset();
            return new Todo(todoDescription);
        },// Recebe o formulário REMINDER do HTML
        getReminder(form: HTMLFormElement): Reminder {
            const reminderNotifications = [
                form.notification.value as NotificationPlataform];
            const reminderDate = new Date(form.scheduleDate.value);
            const reminderDescription = form.reminderDescription.value;
            form.reset();
            return new Reminder(
                reminderDescription, reminderDate, reminderNotifications);
        },
        // recebe uma lista de tasks(TODOS e REMINDERS), limpa a lista e coloca os novos objetos
        render(tasks: Array<Task>, mode: ViewMode) {
            // Seletor do elemento HTML que contém a task list
            const tasksList = document.getElementById('tasksList');
            
            //Limpando a lista
            while(tasksList?.firstChild){
                tasksList.removeChild(tasksList.firstChild);
            }

            // iterando a nova lista
            tasks.forEach((task) => {
                // criando o elemento li
                const li = document.createElement('li');
                // criando representação textual do elemento
                const textNode = document.createTextNode(task.render());
                // colocando a represetanção no elemento li
                li.appendChild(textNode);
                // colocando o elemento dentro da lista de tasks
                tasksList?.appendChild(li);
            })

            const todoSet = document.getElementById('todoSet');
            const reminderSet = document.getElementById('reminderSet');

            if (mode === ViewMode.TODO) {
                todoSet?.setAttribute('style', 'display: block');
                todoSet?.removeAttribute('disabled');
                reminderSet?.setAttribute('style', 'display: none');
                reminderSet?.setAttribute('disabled', 'true');
            } else {
                reminderSet?.setAttribute('style', 'display: block');
                reminderSet?.removeAttribute('disabled');
                todoSet?.setAttribute('style', 'display: none');
                todoSet?.setAttribute('disabled', 'true');
            }
        }
    };

    const TaskController = (view: typeof taskView) => {
        
        const tasks: Array<Task> = [];
        let mode: ViewMode = ViewMode.TODO;

        const handleEvent = (event: Event) => {
            event.preventDefault();
            const form = event.target as HTMLFormElement;
            switch(mode as ViewMode) {
                case ViewMode.TODO:
                    tasks.push(view.getTodo(form));
                    break;
                case ViewMode.REMINDER:
                    tasks.push(view.getReminder(form));
                    break;
            }
            view.render(tasks, mode);
        }

        const handleToggleMode = () => {
            switch (mode as ViewMode) {
                case ViewMode.TODO:
                    mode = ViewMode.REMINDER
                    break;
                case ViewMode.REMINDER:
                    mode = ViewMode.TODO
                    break;
            }
            view.render(tasks, mode);
        }

        document.getElementById('toggleMode')
        ?.addEventListener('click',handleToggleMode);
        // escutando evento submit (sempre que ocorrer um submit no formulário, rodará a arrow function)
        document
        .getElementById('taskForm')
        ?.addEventListener('submit', handleEvent);    
    };

    TaskController(taskView);
})();