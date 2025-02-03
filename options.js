document.addEventListener("DOMContentLoaded", function () {
    //*
    //  Отримання посилань на сторінці опцій
    //  */
    const linksContainer = document.getElementById('linksContainer');
    const addLinkButton = document.getElementById('addLink');

    // Завантажити збережені посилання з локального сховища
    const savedLinks = JSON.parse(localStorage.getItem('links')) || [];
    savedLinks.forEach(link => addLinkField(link.link, link.label));

    addLinkButton.addEventListener('click', function () {
        addLinkField();
    });

    function addLinkField(link = '', label = '') {
        const linkSBlock = document.createElement('div');
        linkSBlock.className = 'linkSBlock';
    
        // Посилання
        const linkLabelBlock = document.createElement('div');
        const linkLabel = document.createElement('label');
        linkLabel.textContent = 'Посилання:';
        linkLabelBlock.appendChild(linkLabel);
    
        const linkInput = document.createElement('input');
        linkInput.type = 'text';
        linkInput.value = link;
        linkLabelBlock.appendChild(linkInput);
        linkSBlock.appendChild(linkLabelBlock);
    
        // Лейбл
        const linkNameBlock = document.createElement('div');
        const linkNameLabel = document.createElement('label');
        linkNameLabel.textContent = 'Назва:';
        linkNameLabel.htmlFor = 'linkName';
        linkNameBlock.appendChild(linkNameLabel);
    
        const linkNameInput = document.createElement('input');
        linkNameInput.setAttribute('maxlength', '25');
        linkNameInput.id = 'linkName';
        linkNameInput.type = 'text';
        linkNameInput.value = label;
        linkNameBlock.appendChild(linkNameInput);
        linkSBlock.appendChild(linkNameBlock);
    
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Зберегти';
        saveButton.addEventListener('click', function () {
            saveLink(link, linkInput.value, linkNameInput.value);
        });
        linkSBlock.appendChild(saveButton);
    
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Видалити';
        deleteButton.addEventListener('click', function () {
            deleteLink(linkInput.value, linkNameInput.value, linkSBlock);
        });
        linkSBlock.appendChild(deleteButton);
    
        linksContainer.appendChild(linkSBlock);
    }

    function saveLink(oldLink, newLink, label) {
        let links = JSON.parse(localStorage.getItem('links')) || [];
        const existingLinkIndex = links.findIndex(savedLink => savedLink.link === oldLink);
    
        if (existingLinkIndex !== -1) {
            // Оновити існуюче посилання
            links[existingLinkIndex].link = newLink;
            links[existingLinkIndex].label = label;
        } else {
            // Додати нове посилання
            links.push({ link: newLink, label });
        }
    
        localStorage.setItem('links', JSON.stringify(links));
        alert('Посилання збережено!');
    }

    function deleteLink(link, label, linkSBlock) {
        let links = JSON.parse(localStorage.getItem('links')) || [];
        links = links.filter(savedLink => savedLink.link !== link || savedLink.label !== label);
        localStorage.setItem('links', JSON.stringify(links));
        linkSBlock.remove();
        alert('Посилання видалено!');
    }


    //
    //Отримання інформації про факульети та групи
    //
    const facultiesApi = `https://rozklad.nubip.edu.ua/api/public/faculties`;

    // Отримання списку факультетів та груп
    chrome.runtime.sendMessage({ action: "fetchFaculties", url: facultiesApi }, response => {
        if (chrome.runtime.lastError) {
            console.error('Error fetching faculties:', chrome.runtime.lastError.message);
            return;
        }
        if (response.error) {
            console.error('Error fetching faculties:', response.error);
        } else {
            populateFaculties(response.data);
        }
    });

    function populateFaculties(data) {
        const facultiesSelect = document.getElementById('faculties');
        const groupsSelect = document.getElementById('group');

        data.forEach(faculty => {
            const option = document.createElement('option');
            option.value = faculty.id;
            option.textContent = faculty.title;
            facultiesSelect.appendChild(option);
        });

        const savedFacultyId = localStorage.getItem('selectedFaculty');
        const savedGroupId = localStorage.getItem('selectedGroup');

        if (savedFacultyId) {
            facultiesSelect.value = savedFacultyId;
            const selectedFaculty = data.find(faculty => faculty.id === savedFacultyId);
            populateGroups(selectedFaculty.groups, savedGroupId);
        }

        facultiesSelect.addEventListener('change', function () {
            const selectedFaculty = data.find(faculty => faculty.id === this.value);
            populateGroups(selectedFaculty.groups);
            localStorage.setItem('selectedFaculty', this.value);
        });
    }

    function populateGroups(groups, savedGroupId = null) {
        const groupsSelect = document.getElementById('group');
        groupsSelect.innerHTML = ''; //очищення

        groups.forEach(group => {
            const option = document.createElement('option');
            option.value = group.id;
            option.textContent = group.title;
            groupsSelect.appendChild(option);
        });

        if (savedGroupId) {
            groupsSelect.value = savedGroupId;
        }

        groupsSelect.addEventListener('change', function () {
            localStorage.setItem('selectedGroup', this.value);
        });
    }

    // Fetch and display the schedule
    document.getElementById('findSchedule').addEventListener('click', function () {
        const facultyId = document.getElementById('faculties').value;
        const groupId = document.getElementById('group').value;
        const apiUrl = `https://rozklad.nubip.edu.ua/api/public/schedule/${facultyId}/${groupId}`;

        chrome.runtime.sendMessage({ action: "fetchSchedule", url: apiUrl }, response => {
            if (chrome.runtime.lastError) {
                console.error('Error fetching schedule:', chrome.runtime.lastError.message);
                return;
            }
            if (response.error) {
                console.error('Error fetching schedule:', response.error);
            } else {
                buildTimetable(response.data);
                saveScheduleToLocalStorage(response.data);
            }
        });
    });

    // SЗбереження розкладу в localStorage у форматі JSON
    document.getElementById('saveSchedule').addEventListener('click', function () {
        const timetable = JSON.parse(localStorage.getItem('timetable'));
        if (timetable) {
            localStorage.setItem('savedTimetable', JSON.stringify(timetable));
            alert('Розклад збережено!');
        } else {
            alert('Немає розкладу для збереження.');
        }
    });

    // Завантаження розкладу з localStorage
    document.getElementById('loadSchedule').addEventListener('click', function () {
        const savedTimetable = localStorage.getItem('savedTimetable');
        if (savedTimetable) {
            const timetableData = JSON.parse(savedTimetable);
            buildTimetable(timetableData);
            alert('Розклад завантажено!');
        } else {
            alert('Збережений розклад не знайдено.');
        }
    });
    // Побудова таблиці розкладу
    function buildTimetable(data) {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
        const dayNames = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця'];
        const timeSlots = [
            '1. 8:30-9:50',
            '2. 10:10-11:30',
            '3. 11:50-13:10',
            '4. 13:30-14:50',
            '5. 15:10-16:30',
            '6. 16:50-18:10',
            '7. 18:30-19:50'
        ];

        const table = document.createElement('table');
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = '<th>Час</th><th>Понеділок</th><th>Вівторок</th><th>Середа</th><th>Четвер</th><th>П\'ятниця</th>';
        table.appendChild(headerRow);

        for (let i = 0; i < timeSlots.length; i++) {
            const row = document.createElement('tr');
            const timeCell = document.createElement('td');
            timeCell.textContent = timeSlots[i];
            row.appendChild(timeCell);

            days.forEach(day => {
                const cell = document.createElement('td');
                const lesson = data.days[day].lessons.find(lesson => lesson.timeSlot === i + 1);
                if (lesson) {
                    cell.innerHTML = `<span contenteditable="true">${lesson.subject}</span>`;
                } else {
                    cell.innerHTML = '<span contenteditable="true">---</span>';
                }


                cell.addEventListener('input', function () {
                    saveToLocalStorage(day, i + 1, this.innerText);
                });

                row.appendChild(cell);
            });

            table.appendChild(row);
        }

        const timetableContainer = document.querySelector('#timetable');
        timetableContainer.innerHTML = '';
        timetableContainer.appendChild(table);
    }

    function saveToLocalStorage(day, timeSlot, subject) {
        let timetable = JSON.parse(localStorage.getItem('timetable')) || {};
        if (!timetable[day]) {
            timetable[day] = {};
        }
        timetable[day][timeSlot] = subject;
        localStorage.setItem('timetable', JSON.stringify(timetable));
    }

    function saveScheduleToLocalStorage(data) {
        localStorage.setItem('timetable', JSON.stringify(data));
    }
});