document.addEventListener('DOMContentLoaded', () => {
 
});


const savedTimetable = JSON.parse(localStorage.getItem('savedTimetable'));
buildTimetable(savedTimetable);

function getWeekType() {
  const startDate = new Date(new Date().getFullYear(), 0, 1); // 1 січня поточного року
  const currentDate = new Date();
  const weekNumber = Math.ceil(((currentDate - startDate) / (1000 * 60 * 60 * 24) + startDate.getDay() + 1) / 7);
  return weekNumber % 2 === 0 ? 'odd' : 'even'; // Знаменник - парний тиждень, Чисельник - непарний тиждень
}



function buildTimetable(data) {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  const timeSlots = [
    '1. 8:30-9:50',
    '2. 10:10-11:30',
    '3. 11:50-13:10',
    '4. 13:30-14:50',
    '5. 15:10-16:30',
    '6. 16:50-18:10',
    '7. 18:30-19:50'
  ];
  const weekType = getWeekType();
  console.log(weekType);

  const table = document.createElement('table');
  const headerRow = document.createElement('tr');
  headerRow.innerHTML = `<th>${getWeekType() === 'odd' ? 'Чисельник' : 'Знаменник'}</th><th>Понеділок</th><th>Вівторок</th><th>Середа</th><th>Четвер</th><th>П\'ятниця</th>`;
  table.appendChild(headerRow);

  const currentDayIndex = new Date().getDay() - 1;
  const currentTime = new Date().getHours() * 60 + new Date().getMinutes();

  for (let i = 0; i < timeSlots.length; i++) {
    const row = document.createElement('tr');
    const timeCell = document.createElement('td');
    timeCell.textContent = timeSlots[i];
    row.appendChild(timeCell);

    days.forEach((day, index) => {
      const cell = document.createElement('td');
      const lesson = data.days[day].lessons.find(lesson => lesson.timeSlot === i + 1 && (lesson.onWeek === 'all' || lesson.onWeek === weekType));
      if (lesson) {
        cell.textContent = lesson.subject;
      } else {
        cell.textContent = '---';
      }

      // Підсвітити поточний день тижня та поточний час
      if (index === currentDayIndex) {
        const [startHour, startMinute] = timeSlots[i].split(' ')[1].split('-')[0].split(':').map(Number);
        const [endHour, endMinute] = timeSlots[i].split(' ')[1].split('-')[1].split(':').map(Number);
        const startTime = startHour * 60 + startMinute;
        const endTime = endHour * 60 + endMinute;

        if (currentTime >= startTime && currentTime <= endTime) {
          timeCell.classList.add('highlight');
          cell.classList.add('highlight');
          headerRow.children[index + 1].classList.add('highlight');
        }
      }

      row.appendChild(cell);
    });

    table.appendChild(row);
  }
  const timetableContainer = document.querySelector('#timetable');
  timetableContainer.innerHTML = '';
  timetableContainer.appendChild(table);
}

// Додати стилі для підсвічування поточного дня тижня та поточного часу
const style = document.createElement('style');
style.textContent = `
  .highlight {
    background-color:  #5dd762
  }
`;
document.head.appendChild(style);