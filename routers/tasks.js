const Router = require('express').Router;
const router = Router();
const { isAuthorized }= require('../middleware/isAuthenticated');

let tasks = [];


router.post('/new',isAuthorized(['admin', 'user']), (req, res) => {
    const { title, description } = req.body;
    const newTask = { id: tasks.length + 1, title, description };
    tasks.push(newTask);
    res.status(201).json(newTask);
});


router.get('/all', (req, res) => {
    res.json(tasks);
});


router.get('/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        res.json(task);
    } else {
        res.status(404).send('Task not found');
    }
});


router.put('/:id', isAuthorized(['admin', 'user']),(req, res) => {
    const taskId = parseInt(req.params.id);
    const { title, description } = req.body;
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex] = { id: taskId, title, description };
        res.status(200).json(tasks[taskIndex]);
    } else {
        res.status(404).send('Task not found');
    }
});


router.delete('/:id', isAuthorized(['admin']), (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        res.status(204).send('Task deleted!');
    } else {
        res.status(404).send('Task not found');
    }
});

module.exports = router;
