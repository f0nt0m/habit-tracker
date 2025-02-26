document.addEventListener('DOMContentLoaded', () => {
    const habitInput = document.getElementById('habit-input');
    const addBtn = document.getElementById('add-btn');
    const habitList = document.getElementById('habit-list');
    const filterAllBtn = document.getElementById('filter-all');
    const filterActiveBtn = document.getElementById('filter-active');
    const filterCompletedBtn = document.getElementById('filter-completed');
    const completedCountEl = document.getElementById('completed-count');

    let habits = [];
    let currentFilter = 'all';

    loadHabits();
    renderHabits();

    addBtn.addEventListener('click', () => {
        const text = habitInput.value.trim();
        if (text !== '') {
            addHabit(text);
            habitInput.value = '';
            renderHabits();
        }
    });

    habitInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addBtn.click();
        }
    });

    filterAllBtn.addEventListener('click', () => {
        currentFilter = 'all';
        setActiveFilterButton(filterAllBtn);
        renderHabits();
    });

    filterActiveBtn.addEventListener('click', () => {
        currentFilter = 'active';
        setActiveFilterButton(filterActiveBtn);
        renderHabits();
    });

    filterCompletedBtn.addEventListener('click', () => {
        currentFilter = 'completed';
        setActiveFilterButton(filterCompletedBtn);
        renderHabits();
    });

    function addHabit(text) {
        const newHabit = {
            id: Date.now(),
            text,
            completed: false,
        };
        habits.push(newHabit);
        saveHabits();
    }

    function toggleHabitCompletion(habitId) {
        habits = habits.map((habit) => {
            if (habit.id === habitId) {
                return {
                    ...habit,
                    completed: !habit.completed
                };
            }
            return habit;
        });
        saveHabits();
        renderHabits();
    }

    function saveHabits() {
        localStorage.setItem('habits', JSON.stringify(habits));
    }

    function loadHabits() {
        const stored = localStorage.getItem('habits');
        if (stored) {
            habits = JSON.parse(stored);
        }
    }

    function renderHabits() {
        habitList.innerHTML = '';

        let filteredHabits = [];
        if (currentFilter === 'all') {
            filteredHabits = habits;
        } else if (currentFilter === 'active') {
            filteredHabits = habits.filter(habit => !habit.completed);
        } else if (currentFilter === 'completed') {
            filteredHabits = habits.filter(habit => habit.completed);
        }

        filteredHabits.forEach((habit) => {
            const li = document.createElement('li');
            li.classList.add('habit-item');
            if (habit.completed) {
                li.classList.add('completed');
            }

            const spanText = document.createElement('span');
            spanText.textContent = habit.text;

            spanText.addEventListener('click', () => {
                toggleHabitCompletion(habit.id);
            });

            li.appendChild(spanText);
            habitList.appendChild(li);
        });

        updateCompletedCount();
    }

    function updateCompletedCount() {
        const completedCount = habits.filter(habit => habit.completed).length;
        completedCountEl.textContent = `Выполнено: ${completedCount}`;
    }

    function setActiveFilterButton(activeButton) {
        [filterAllBtn, filterActiveBtn, filterCompletedBtn].forEach(btn => {
            btn.classList.remove('active-filter');
        });
        activeButton.classList.add('active-filter');
    }
});