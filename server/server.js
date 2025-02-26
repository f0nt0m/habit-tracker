const express = require('express');
const path = require('path');
const { LocalStorage } = require('node-localstorage');

const localStorage = new LocalStorage('./scratch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

if (!localStorage.getItem('habits')) {
    localStorage.setItem('habits', JSON.stringify([]));
}

function getHabits() {
    return JSON.parse(localStorage.getItem('habits'));
}

function saveHabits(habits) {
    localStorage.setItem('habits', JSON.stringify(habits));
}

app.get('/habits', (req, res) => {
    res.json(getHabits());
});

app.post('/habits', (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }
    const habits = getHabits();
    const newHabit = {
        id: Date.now(),
        text,
        completed: false
    };
    habits.push(newHabit);
    saveHabits(habits);
    res.status(201).json(newHabit);
});

app.put('/habits/:id', (req, res) => {
    const habitId = parseInt(req.params.id, 10);
    const habits = getHabits();
    const index = habits.findIndex(h => h.id === habitId);
    if (index === -1) {
        return res.status(404).json({ error: 'Habit not found' });
    }
    habits[index].completed = !habits[index].completed;
    saveHabits(habits);
    res.json(habits[index]);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
