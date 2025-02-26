const state_ui = {
    habitInput: document.getElementById('habit-input'),
    addBtn: document.getElementById('add-btn'),
    habitList: document.getElementById('habit-list'),
    filterAllBtn: document.getElementById('filter-all'),
    filterActiveBtn: document.getElementById('filter-active'),
    filterCompletedBtn: document.getElementById('filter-completed'),
    completedCountEl: document.getElementById('completed-count')
};

const state_data = {
    habits: [],
    currentFilter: 'all'
};

document.addEventListener('DOMContentLoaded', () => {

    state_ui.addBtn.addEventListener('click', async () => {
        const text = state_ui.habitInput.value.trim();
        if (text !== '') {
            await addHabit(text);
            state_ui.habitInput.value = '';
            await loadHabits();
            renderHabits();
        }
    });

    state_ui.habitInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            state_ui.addBtn.click();
        }
    });

    state_ui.filterAllBtn.addEventListener('click', () => {
        state_data.currentFilter = 'all';
        setActiveFilterButton(state_ui.filterAllBtn);
        renderHabits();
    });

    state_ui.filterActiveBtn.addEventListener('click', () => {
        state_data.currentFilter = 'active';
        setActiveFilterButton(state_ui.filterActiveBtn);
        renderHabits();
    });

    state_ui.filterCompletedBtn.addEventListener('click', () => {
        state_data.currentFilter = 'completed';
        setActiveFilterButton(state_ui.filterCompletedBtn);
        renderHabits();
    });

    loadHabits().then(renderHabits);
});

async function loadHabits() {
    try {
        const response = await fetch('/habits');
        if (!response.ok) throw new Error('Network error');
        state_data.habits = await response.json();
    } catch (err) {
        console.error('Error loading habits:', err);
    }
}

async function addHabit(text) {
    try {
        const response = await fetch('/habits', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        if (!response.ok) throw new Error('Failed to add habit');
        return await response.json();
    } catch (err) {
        console.error('Error adding habit:', err);
    }
}

async function toggleHabitCompletion(habitId) {
    try {
        const response = await fetch(`/habits/${habitId}`, { method: 'PUT' });
        if (!response.ok) throw new Error('Failed to toggle habit');
        await loadHabits();
        renderHabits();
    } catch (err) {
        console.error('Error toggling habit:', err);
    }
}

function renderHabits() {
    state_ui.habitList.innerHTML = '';

    let filteredHabits = [];
    if (state_data.currentFilter === 'all') {
        filteredHabits = state_data.habits;
    } else if (state_data.currentFilter === 'active') {
        filteredHabits = state_data.habits.filter(habit => !habit.completed);
    } else if (state_data.currentFilter === 'completed') {
        filteredHabits = state_data.habits.filter(habit => habit.completed);
    }

    filteredHabits.forEach(habit => {
        const li = document.createElement('li');
        li.classList.add('habit-item');
        if (habit.completed) li.classList.add('completed');

        const spanText = document.createElement('span');
        spanText.textContent = habit.text;
        spanText.addEventListener('click', () => toggleHabitCompletion(habit.id));

        li.appendChild(spanText);
        state_ui.habitList.appendChild(li);
    });

    updateCompletedCount();
}

function updateCompletedCount() {
    const completedCount = state_data.habits.filter(habit => habit.completed).length;
    state_ui.completedCountEl.textContent = `Выполнено: ${completedCount}`;
}

function setActiveFilterButton(activeButton) {
    [state_ui.filterAllBtn, state_ui.filterActiveBtn, state_ui.filterCompletedBtn].forEach(btn => {
        btn.classList.remove('active-filter');
    });
    activeButton.classList.add('active-filter');
}
