class Student {
  constructor(name) {
    this.name = name;
    this.grades = {};
  }

  addGrade(subject, grade) {
    if (this.grades[subject]) {
      this.grades[subject].push(grade);
    } else {
      this.grades[subject] = [grade];
    }
  }

  calculateAverageBySubject(subject) {
    if (this.grades[subject]) {
      let sum = this.grades[subject].reduce((total, grade) => total + grade, 0);
      return sum / this.grades[subject].length;
    }
    return 0;
  }

  calculateAverage() {
    let sum = 0;
    let count = 0;
    for (let subject in this.grades) {
      sum += this.calculateAverageBySubject(subject) * this.grades[subject].length;
      count += this.grades[subject].length;
    }
    return sum / count;
  }
}

let students = JSON.parse(localStorage.getItem('students')) || [];

document.getElementById('studentForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  let studentName = document.getElementById('studentName').value.trim();
  let subject = document.getElementById('subject').value.trim();
  let grade = parseFloat(document.getElementById('grade').value);
  let messageElement = document.getElementById('message');

  if (!studentName || !subject || isNaN(grade)) {
    messageElement.innerHTML = 'Todos los campos son obligatorios y la nota debe ser un número.';
    messageElement.classList.add('alert-danger');
    return;
  }

  messageElement.innerHTML = '';
  messageElement.classList.remove('alert-danger');
  
  let student = students.find(s => s.name === studentName);
  if (!student) {
    student = new Student(studentName);
    students.push(student);
  }
  student.addGrade(subject, grade);
  
  localStorage.setItem('students', JSON.stringify(students));
  renderStudents();
  
  document.getElementById('studentForm').reset();
  messageElement.innerHTML = 'Nota añadida exitosamente.';
  messageElement.classList.add('alert-success');
});

function renderStudents() {
  let gradesList = document.getElementById('gradesList');
  gradesList.innerHTML = '';
  students.forEach(student => {
    let gradeDiv = document.createElement('div');
    let subjects = Object.keys(student.grades);
    gradeDiv.innerHTML = `<strong>${student.name}</strong> - Promedio general: ${student.calculateAverage().toFixed(2)} <br>`;
    subjects.forEach(subject => {
      gradeDiv.innerHTML += `${subject} - Promedio: ${student.calculateAverageBySubject(subject).toFixed(2)}<br>Notas: ${student.grades[subject].join(', ')}<br>`;
    })
    gradesList.appendChild(gradeDiv);
  });
}

renderStudents();
