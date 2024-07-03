const calendar = document.querySelector('.calendar');
const month_picker = calendar.querySelector('#month-picker');
const calendar_header_year = calendar.querySelector('#year');
const calendar_days = calendar.querySelector('.calendar-days');
const overlay = document.querySelector('#overlay');

const month_names = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const generateCalendar = (month, year) => {
    const days_of_month = [31, (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    calendar_days.innerHTML = '';

    let currDate = new Date();
    if (!month) month = currDate.getMonth();
    if (!year) year = currDate.getFullYear();

    let curr_month = `${month_names[month]}`;
    month_picker.innerHTML = curr_month;
    calendar_header_year.innerHTML = year;

    let first_day = new Date(year, month, 1);

    for (let i = 0; i < days_of_month[month] + first_day.getDay(); i++) {
        let day = document.createElement('div');
        if (i >= first_day.getDay()) {
            let dayNumber = i - first_day.getDay() + 1;

            let formattedMonth = (month + 1).toString().padStart(2, '0'); // Formata o mês com duas casas decimais
            let formattedDay = dayNumber.toString().padStart(2, '0'); // Formata o dia com duas casas decimais
            
            let dayInput = document.createElement('input');
            dayInput.type = 'radio';
            dayInput.classList.add('btn-check');
            dayInput.name = 'dayOptionsCalendar';
            dayInput.id = `${year}-${formattedMonth}-${formattedDay}`;
            dayInput.autocomplete = 'off';
            
            let dayLabel = document.createElement('label');
            dayLabel.classList.add('btn', 'btn-outline-primary-day');
            dayLabel.htmlFor = `${year}-${formattedMonth}-${formattedDay}`;
            dayLabel.textContent = formattedDay;
            
            if (new Date(year, month, dayNumber + 1) < currDate) {
                dayInput.disabled = true;
                dayLabel.classList.add('disabled');
            }
            
            day.appendChild(dayInput);
            day.appendChild(dayLabel);
        }
        calendar_days.appendChild(day);
    }
};

let month_list = calendar.querySelector('.month-list');

month_names.forEach((e, index) => {
    let month = document.createElement('div');
    month.innerHTML = `<div data-month="${index}">${e}</div>`;
    month.querySelector('div').onclick = () => {
        month_list.classList.remove('show');
        overlay.classList.remove('show');
        curr_month.value = index;
        generateCalendar(index, curr_year.value);
    };
    month_list.appendChild(month);
});

month_picker.onclick = () => {
    month_list.classList.add('show');
    overlay.classList.add('show');
};

let currDate = new Date();

let curr_month = { value: currDate.getMonth() };
let curr_year = { value: currDate.getFullYear() };

generateCalendar(curr_month.value, curr_year.value);

document.querySelector('#prev-year').onclick = () => {
    --curr_year.value;
    generateCalendar(curr_month.value, curr_year.value);
};

document.querySelector('#next-year').onclick = () => {
    ++curr_year.value;
    generateCalendar(curr_month.value, curr_year.value);
};

overlay.onclick = () => {
    month_list.classList.remove('show');
    overlay.classList.remove('show');
};
