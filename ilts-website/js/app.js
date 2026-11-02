/* ===== ILTS App.js — jQuery + Vanilla JS ===== */

$(document).ready(function () {

  // Navbar scroll effect
  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 50) {
      $('#mainNav').addClass('scrolled');
    } else {
      $('#mainNav').removeClass('scrolled');
    }
  });

  // Smooth scroll for nav links
  $('a[href^="#"]').on('click', function (e) {
    const target = $(this.getAttribute('href'));
    if (target.length) {
      e.preventDefault();
      $('html, body').animate({ scrollTop: target.offset().top - 70 }, 600);
    }
  });

  // Counter animation
  function animateCounter(id, target, suffix) {
    let count = 0;
    const step = Math.ceil(target / 60);
    const interval = setInterval(() => {
      count += step;
      if (count >= target) { count = target; clearInterval(interval); }
      $('#' + id).text(count + (suffix || ''));
    }, 30);
  }

  // Trigger counters when hero is visible
  let countersStarted = false;
  $(window).on('scroll', function () {
    if (!countersStarted && $(window).scrollTop() < 200) {
      countersStarted = true;
      animateCounter('counter1', 5240, '+');
      animateCounter('counter2', 128, '+');
      animateCounter('counter3', 94, '%');
    }
  });
  // Start on load
  setTimeout(() => {
    animateCounter('counter1', 5240, '+');
    animateCounter('counter2', 128, '+');
    animateCounter('counter3', 94, '%');
  }, 500);

  // Build course cards
  const courses = [
    { icon: 'fas fa-brain', color: '#6366f1', title: 'AI & Machine Learning', desc: 'Deep learning, NLP, computer vision and intelligent systems.', seats: 60 },
    { icon: 'fas fa-cloud', color: '#0ea5e9', title: 'Cloud Computing', desc: 'AWS, Azure, GCP, DevOps and cloud-native architecture.', seats: 60 },
    { icon: 'fas fa-shield-alt', color: '#ef4444', title: 'Cybersecurity', desc: 'Ethical hacking, network security and digital forensics.', seats: 40 },
    { icon: 'fas fa-chart-bar', color: '#f59e0b', title: 'Data Science', desc: 'Big data, analytics, visualization and business intelligence.', seats: 60 },
    { icon: 'fas fa-code', color: '#22c55e', title: 'Full Stack Dev', desc: 'React, Node.js, databases and modern web development.', seats: 80 },
    { icon: 'fas fa-mobile-alt', color: '#a855f7', title: 'Mobile Development', desc: 'Android, iOS, Flutter and cross-platform app development.', seats: 40 },
  ];

  const $courseContainer = $('#courseCards').parent();
  $courseContainer.empty();
  courses.forEach(c => {
    $courseContainer.append(`
      <div class="col-md-4 col-sm-6">
        <div class="course-card fade-in">
          <div class="course-icon" style="background:${c.color}22;">
            <i class="${c.icon}" style="color:${c.color};"></i>
          </div>
          <h5 class="text-white mb-2">${c.title}</h5>
          <p class="text-muted small mb-3">${c.desc}</p>
          <div class="d-flex justify-content-between align-items-center">
            <span class="text-muted small"><i class="fas fa-users me-1"></i>${c.seats} Seats</span>
            <a href="register.html" class="btn btn-sm btn-gradient px-3">Apply</a>
          </div>
        </div>
      </div>
    `);
  });

  // Testimonials
  const testimonials = [
    { name: 'Priya Sharma', college: 'BCA, Delhi University', text: 'The ILTS exam process was smooth and transparent. The online interview was professional and I got my result within 24 hours!', rating: 5 },
    { name: 'Rahul Verma', college: 'B.Sc CS, Pune University', text: 'Excellent platform for MCA entrance. The exam interface is user-friendly and the question quality is top-notch.', rating: 5 },
    { name: 'Anjali Singh', college: 'BCA, Lucknow University', text: 'I cleared both the exam and interview in one week. The process is very well organized. Highly recommend ILTS!', rating: 5 },
  ];

  const $inner = $('#testimonialInner');
  testimonials.forEach((t, i) => {
    const stars = '★'.repeat(t.rating);
    $inner.append(`
      <div class="carousel-item ${i === 0 ? 'active' : ''}">
        <div class="testimonial-card mx-auto">
          <div class="text-warning mb-3" style="font-size:1.3rem;">${stars}</div>
          <p class="text-muted fs-5 mb-4">"${t.text}"</p>
          <div class="d-flex align-items-center gap-3 justify-content-center">
            <div class="testimonial-avatar">${t.name[0]}</div>
            <div class="text-start">
              <h6 class="text-white mb-0">${t.name}</h6>
              <small class="text-muted">${t.college}</small>
            </div>
          </div>
        </div>
      </div>
    `);
  });

  // ===== REGISTRATION FORM =====
  window.currentStep = 1;

  window.nextStep = function (step) {
    if (!validateStep(step)) return;
    $('#formStep' + step).addClass('d-none');
    $('#formStep' + (step + 1)).removeClass('d-none');
    updateStepIndicators(step + 1);
    if (step + 1 === 4) buildReview();
    window.currentStep = step + 1;
  };

  window.prevStep = function (step) {
    $('#formStep' + step).addClass('d-none');
    $('#formStep' + (step - 1)).removeClass('d-none');
    updateStepIndicators(step - 1);
    window.currentStep = step - 1;
  };

  function updateStepIndicators(active) {
    for (let i = 1; i <= 4; i++) {
      const $el = $('#step-indicator-' + i);
      $el.removeClass('active completed');
      if (i < active) $el.addClass('completed');
      else if (i === active) $el.addClass('active');
    }
  }

  function validateStep(step) {
    let valid = true;
    const fields = {
      1: ['#firstName', '#lastName', '#dob', '#gender', '#email', '#mobile', '#address', '#state', '#category'],
      2: ['#degree', '#gradYear', '#gradPercent', '#university', '#twelfthPercent', '#tenthPercent', '#specialization'],
      3: []
    };
    (fields[step] || []).forEach(sel => {
      const $el = $(sel);
      if (!$el.val()) {
        $el.addClass('is-invalid');
        valid = false;
      } else {
        $el.removeClass('is-invalid').addClass('is-valid');
      }
    });
    return valid;
  }

  function buildReview() {
    const data = {
      'Full Name': ($('#firstName').val() + ' ' + $('#lastName').val()).trim(),
      'Email': $('#email').val(),
      'Mobile': $('#mobile').val(),
      'Date of Birth': $('#dob').val(),
      'Gender': $('#gender').val(),
      'State': $('#state').val(),
      'Category': $('#category').val(),
      'Degree': $('#degree').val(),
      'Graduation Year': $('#gradYear').val(),
      'Percentage/CGPA': $('#gradPercent').val(),
      'University': $('#university').val(),
      'Specialization': $('#specialization').val(),
    };
    let html = '';
    Object.entries(data).forEach(([k, v]) => {
      html += `<div class="review-row"><span class="review-label">${k}</span><span class="review-value">${v || '—'}</span></div>`;
    });
    $('#reviewBox').html(html);
  }

  // Upload box click
  $(document).on('click', '.upload-box', function () {
    $(this).find('input[type="file"]').trigger('click');
  });

  window.previewFile = function (input, boxId) {
    if (input.files && input.files[0]) {
      const name = input.files[0].name;
      $('#' + boxId).addClass('uploaded').find('p').first().text('✓ ' + name).css('color', '#86efac');
    }
  };

  // Form submit
  $('#registrationForm').on('submit', function (e) {
    e.preventDefault();
    if (!$('#agreeTerms').is(':checked')) {
      alert('Please agree to the Terms & Conditions.');
      return;
    }
    const regId = 'ILTS-2026-' + Math.floor(10000 + Math.random() * 90000);
    $('#regIdDisplay').text(regId);
    localStorage.setItem('ilts_reg_id', regId);
    localStorage.setItem('ilts_name', $('#firstName').val() + ' ' + $('#lastName').val());
    new bootstrap.Modal('#successModal').show();
  });

  // ===== EXAM =====
  const examQuestions = [
    // Programming (10)
    { q: 'Which data structure uses LIFO (Last In First Out) principle?', opts: ['Queue', 'Stack', 'Linked List', 'Tree'], ans: 1, subject: 'Programming' },
    { q: 'What is the time complexity of binary search?', opts: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'], ans: 2, subject: 'Programming' },
    { q: 'Which keyword is used to define a class in Java?', opts: ['struct', 'define', 'class', 'object'], ans: 2, subject: 'Programming' },
    { q: 'What does HTML stand for?', opts: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'None'], ans: 0, subject: 'Programming' },
    { q: 'Which sorting algorithm has the best average-case time complexity?', opts: ['Bubble Sort', 'Insertion Sort', 'Merge Sort', 'Selection Sort'], ans: 2, subject: 'Programming' },
    { q: 'In Python, which function is used to get the length of a list?', opts: ['size()', 'count()', 'length()', 'len()'], ans: 3, subject: 'Programming' },
    { q: 'What is the output of: print(2 ** 3) in Python?', opts: ['6', '8', '9', '5'], ans: 1, subject: 'Programming' },
    { q: 'Which of the following is NOT an OOP concept?', opts: ['Inheritance', 'Polymorphism', 'Compilation', 'Encapsulation'], ans: 2, subject: 'Programming' },
    { q: 'What does CSS stand for?', opts: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style Sheets', 'Colorful Style Sheets'], ans: 1, subject: 'Programming' },
    { q: 'Which protocol is used for secure web communication?', opts: ['HTTP', 'FTP', 'HTTPS', 'SMTP'], ans: 2, subject: 'Programming' },
    // DBMS (10)
    { q: 'What does SQL stand for?', opts: ['Structured Query Language', 'Simple Query Language', 'Standard Query Logic', 'Sequential Query Language'], ans: 0, subject: 'DBMS' },
    { q: 'Which SQL command is used to retrieve data?', opts: ['INSERT', 'UPDATE', 'SELECT', 'DELETE'], ans: 2, subject: 'DBMS' },
    { q: 'What is a primary key?', opts: ['A key that can be NULL', 'A key that uniquely identifies each record', 'A foreign key reference', 'A duplicate key'], ans: 1, subject: 'DBMS' },
    { q: 'Which normal form eliminates transitive dependencies?', opts: ['1NF', '2NF', '3NF', 'BCNF'], ans: 2, subject: 'DBMS' },
    { q: 'What is a JOIN in SQL?', opts: ['Deletes two tables', 'Combines rows from two or more tables', 'Creates a new table', 'Updates multiple tables'], ans: 1, subject: 'DBMS' },
    { q: 'Which command removes all rows from a table without deleting the table?', opts: ['DROP', 'DELETE', 'TRUNCATE', 'REMOVE'], ans: 2, subject: 'DBMS' },
    { q: 'What is an index in a database?', opts: ['A backup copy', 'A data structure to speed up queries', 'A type of join', 'A constraint'], ans: 1, subject: 'DBMS' },
    { q: 'ACID properties in DBMS stand for?', opts: ['Atomicity, Consistency, Isolation, Durability', 'Access, Control, Integrity, Data', 'Atomicity, Concurrency, Isolation, Data', 'None of these'], ans: 0, subject: 'DBMS' },
    { q: 'Which type of relationship is represented by a foreign key?', opts: ['One-to-One', 'Many-to-Many', 'One-to-Many', 'All of the above'], ans: 2, subject: 'DBMS' },
    { q: 'What does ER stand for in ER Diagram?', opts: ['Entity Relationship', 'Element Record', 'Entity Record', 'Element Relationship'], ans: 0, subject: 'DBMS' },
    // Aptitude (10)
    { q: 'If a train travels 360 km in 4 hours, what is its speed in km/h?', opts: ['80', '90', '100', '70'], ans: 1, subject: 'Aptitude' },
    { q: 'What is 15% of 200?', opts: ['25', '30', '35', '20'], ans: 1, subject: 'Aptitude' },
    { q: 'Find the next number: 2, 4, 8, 16, __', opts: ['24', '32', '28', '20'], ans: 1, subject: 'Aptitude' },
    { q: 'A can do a work in 10 days, B in 15 days. Together they finish in?', opts: ['5 days', '6 days', '8 days', '12 days'], ans: 1, subject: 'Aptitude' },
    { q: 'If APPLE = 50, then MANGO = ?', opts: ['50', '55', '60', '45'], ans: 1, subject: 'Aptitude' },
    { q: 'Simple interest on Rs.1000 at 10% per annum for 2 years?', opts: ['Rs.100', 'Rs.200', 'Rs.150', 'Rs.250'], ans: 1, subject: 'Aptitude' },
    { q: 'Which is the largest prime number less than 20?', opts: ['17', '19', '18', '16'], ans: 1, subject: 'Aptitude' },
    { q: 'If 5x = 25, then x = ?', opts: ['3', '4', '5', '6'], ans: 2, subject: 'Aptitude' },
    { q: 'A shopkeeper sells at 20% profit. Cost price is Rs.500. Selling price?', opts: ['Rs.550', 'Rs.600', 'Rs.650', 'Rs.700'], ans: 1, subject: 'Aptitude' },
    { q: 'How many seconds in 2 hours?', opts: ['3600', '7200', '1800', '5400'], ans: 1, subject: 'Aptitude' },
  ];

  let currentQ = 0;
  let answers = new Array(30).fill(null);
  let markedReview = new Array(30).fill(false);
  let timerInterval;
  let timeLeft = 30 * 60;

  window.startExam = function () {
    const regId = $('#regIdInput').val().trim();
    if (!regId) { alert('Please enter your Registration ID.'); return; }
    $('#preExamScreen').addClass('d-none');
    $('#examScreen').removeClass('d-none');
    buildPalette();
    loadQuestion(0);
    startTimer();
  };

  function startTimer() {
    timerInterval = setInterval(() => {
      timeLeft--;
      const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
      const s = (timeLeft % 60).toString().padStart(2, '0');
      $('#timerDisplay').text(m + ':' + s);
      if (timeLeft <= 300) $('#examTimer').addClass('warning');
      if (timeLeft <= 0) { clearInterval(timerInterval); submitExam(); }
    }, 1000);
  }

  function buildPalette() {
    const $p = $('#questionPalette').empty();
    for (let i = 0; i < 30; i++) {
      $p.append(`<button class="palette-btn" id="pb${i}" onclick="goToQuestion(${i})">${i + 1}</button>`);
    }
  }

  function loadQuestion(idx) {
    currentQ = idx;
    const q = examQuestions[idx];
    $('#currentQNum').text(idx + 1);
    $('#questionText').text(q.q);
    $('#qTypeBadge').text(q.subject);
    $('#subjectBadge').text(q.subject);
    $('#examProgress').css('width', ((idx + 1) / 30 * 100) + '%');

    const $opts = $('#optionsList').empty();
    const labels = ['A', 'B', 'C', 'D'];
    q.opts.forEach((opt, i) => {
      const selected = answers[idx] === i ? 'selected' : '';
      $opts.append(`
        <div class="option-item ${selected}" onclick="selectOption(${i})">
          <span class="option-label">${labels[i]}</span>
          <span>${opt}</span>
        </div>
      `);
    });

    $('#prevBtn').prop('disabled', idx === 0);
    $('#nextBtn').text(idx === 29 ? 'Finish' : 'Next').off('click').on('click', () => {
      if (idx === 29) confirmSubmit(); else changeQuestion(1);
    });

    updatePalette();
    updateAnsweredCount();
  }

  window.selectOption = function (optIdx) {
    answers[currentQ] = optIdx;
    loadQuestion(currentQ);
  };

  window.changeQuestion = function (dir) {
    const next = currentQ + dir;
    if (next >= 0 && next < 30) loadQuestion(next);
  };

  window.goToQuestion = function (idx) { loadQuestion(idx); };

  window.markForReview = function () {
    markedReview[currentQ] = !markedReview[currentQ];
    updatePalette();
  };

  function updatePalette() {
    for (let i = 0; i < 30; i++) {
      const $btn = $('#pb' + i);
      $btn.removeClass('answered review current');
      if (i === currentQ) $btn.addClass('current');
      else if (markedReview[i]) $btn.addClass('review');
      else if (answers[i] !== null) $btn.addClass('answered');
    }
  }

  function updateAnsweredCount() {
    const count = answers.filter(a => a !== null).length;
    $('#answeredCount').text(count);
  }

  window.confirmSubmit = function () {
    const count = answers.filter(a => a !== null).length;
    $('#submitSummary').text(`You have answered ${count} out of 30 questions.`);
    new bootstrap.Modal('#submitModal').show();
  };

  window.submitExam = function () {
    clearInterval(timerInterval);
    bootstrap.Modal.getInstance(document.getElementById('submitModal'))?.hide();

    let correct = 0, wrong = 0, skipped = 0;
    examQuestions.forEach((q, i) => {
      if (answers[i] === null) skipped++;
      else if (answers[i] === q.ans) correct++;
      else wrong++;
    });

    const score = correct * 3;
    const pct = Math.round((score / 90) * 100);
    const passed = pct >= 50;

    $('#examScreen').addClass('d-none');
    $('#resultScreen').removeClass('d-none');

    $('#scoreDisplay').text(score);
    $('#correctCount').text(correct);
    $('#wrongCount').text(wrong);
    $('#skippedCount').text(skipped);

    const scoreCircle = document.getElementById('scoreCircle');
    scoreCircle.style.setProperty('--score-pct', pct + '%');

    if (passed) {
      $('#resultIcon').html('<i class="fas fa-trophy fa-5x text-warning"></i>');
      $('#resultTitle').text('Congratulations! You Passed!');
      $('#resultSubtitle').text(`Score: ${score}/90 (${pct}%) — You have qualified for the Interview Round.`);
      $('#resultAction').html(`
        <div class="alert" style="background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.3);border-radius:12px;color:#86efac;">
          <i class="fas fa-check-circle me-2"></i>You have cleared the cutoff. Proceed to the Interview Round.
        </div>
        <a href="interview.html" class="btn btn-gradient btn-lg px-5 mt-2">
          <i class="fas fa-video me-2"></i>Go to Interview
        </a>
      `);
    } else {
      $('#resultIcon').html('<i class="fas fa-times-circle fa-5x text-danger"></i>');
      $('#resultTitle').text('Better Luck Next Time');
      $('#resultSubtitle').text(`Score: ${score}/90 (${pct}%) — Minimum 50% required to qualify.`);
      $('#resultAction').html(`
        <div class="alert" style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:12px;color:#fca5a5;">
          <i class="fas fa-info-circle me-2"></i>You did not meet the cutoff. You may re-apply in the next cycle.
        </div>
        <a href="index.html" class="btn btn-gradient btn-lg px-5 mt-2">
          <i class="fas fa-home me-2"></i>Back to Home
        </a>
      `);
    }
  };

  // ===== INTERVIEW =====
  window.checkSchedule = function () {
    const regId = $('#interviewRegId').val().trim();
    if (!regId) { alert('Please enter your Registration ID.'); return; }

    // Simulate schedule lookup
    const name = localStorage.getItem('ilts_name') || 'Candidate';
    const date = new Date();
    date.setDate(date.getDate() + 3);
    const dateStr = date.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    $('#candidateName').text(name);
    $('#candidateRegId').text(regId);
    $('#interviewDate').text(dateStr);
    $('#interviewTime').text('10:30 AM - 10:50 AM');
    $('#interviewPanel').text('Panel A — Dr. R. Sharma, Prof. M. Gupta');

    $('#scheduleDetails').removeClass('d-none');
    startCountdown(date);
    runSystemCheck();
  };

  function startCountdown(targetDate) {
    function update() {
      const now = new Date();
      const diff = targetDate - now;
      if (diff <= 0) { $('#countdownBox').html('<p class="text-success">Interview time has arrived!</p>'); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      $('#cdDays').text(String(d).padStart(2,'0'));
      $('#cdHours').text(String(h).padStart(2,'0'));
      $('#cdMins').text(String(m).padStart(2,'0'));
      $('#cdSecs').text(String(s).padStart(2,'0'));
    }
    update();
    setInterval(update, 1000);
  }

  window.runSystemCheck = function () {
    const checks = [
      { id: 'checkCamera', label: 'Camera', pass: true },
      { id: 'checkMic', label: 'Microphone', pass: true },
      { id: 'checkNet', label: 'Internet', pass: navigator.onLine },
      { id: 'checkBrowser', label: 'Browser', pass: true },
    ];
    checks.forEach((c, i) => {
      setTimeout(() => {
        const icon = c.pass ? 'fas fa-check-circle text-success' : 'fas fa-times-circle text-danger';
        const color = c.pass ? '#86efac' : '#fca5a5';
        $('#' + c.id).html(`<i class="${icon} me-2"></i><span style="color:${color}">${c.label} — ${c.pass ? 'OK' : 'Failed'}</span>`);
      }, (i + 1) * 600);
    });
  };

  window.joinInterview = function () {
    new bootstrap.Modal('#interviewModal').show();
  };

  window.sendChatMsg = function () {
    const msg = $('#chatInput').val().trim();
    if (!msg) return;
    $('#chatMessages').append(`<div class="chat-msg user-msg"><span class="chat-sender">You:</span> ${msg}</div>`);
    $('#chatInput').val('');
    $('#chatMessages').scrollTop($('#chatMessages')[0].scrollHeight);
  };

  $('#chatInput').on('keypress', function (e) {
    if (e.which === 13) window.sendChatMsg();
  });

  const controlState = { mic: true, cam: true, screen: false };
  window.toggleControl = function (type) {
    if (type === 'mic') {
      controlState.mic = !controlState.mic;
      $('#micBtn').html(`<i class="fas fa-microphone${controlState.mic ? '' : '-slash'}"></i>`);
      $('#micBtn').toggleClass('btn-dark btn-danger');
    } else if (type === 'cam') {
      controlState.cam = !controlState.cam;
      $('#camBtn').html(`<i class="fas fa-video${controlState.cam ? '' : '-slash'}"></i>`);
      $('#camBtn').toggleClass('btn-dark btn-danger');
    }
  };

  window.endInterview = function () {
    if (confirm('Are you sure you want to end the interview?')) {
      bootstrap.Modal.getInstance(document.getElementById('interviewModal')).hide();
      alert('Interview ended. Results will be communicated via email within 48 hours.');
    }
  };

  // Interview topics
  const topics = ['Data Structures', 'OOP Concepts', 'DBMS', 'Operating Systems', 'Networking', 'Python/Java', 'Web Technologies', 'Problem Solving', 'Project Discussion', 'Career Goals'];
  const $tags = $('#topicTags');
  topics.forEach(t => $tags.append(`<span class="topic-tag">${t}</span>`));

});
